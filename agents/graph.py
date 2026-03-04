from pathlib import Path
from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama

from state import AgentState
from tools import list_files, read_file, write_file, get_features_md_path


llm = ChatOllama(
    model="llama3.1:8b",
    temperature=0
)

# 1️⃣ Listar archivos
def node_list_files(state: AgentState):
    print("Listing files...")
    files = list_files(state["project_path"])
    print(f"Found {len(files)} files to analyze.")
    return {"files": files}





# 2️⃣ Inicializar Features.md
def node_initialize_features_md(state: AgentState):
    features_md_path = get_features_md_path()
    write_file(str(features_md_path), "# Application Features and Specifications\n\n")
    print(f"Initialized {features_md_path}")
    return {"features_md_content": "# Application Features and Specifications\n\n"}


# 3️⃣ Generar y actualizar especificación incrementalmente
def node_generate_incremental_spec(state: AgentState):
    files = state.get("files", [])
    file_index = state.get("file_index", 0)

    if file_index >= len(files):
        print("No more files to process.")
        return {"current_file": None, "file_index": file_index}

    file_path = files[file_index]
    print(f"Processing: {file_path}")

    path_obj = Path(file_path)

    if not path_obj.exists() or not path_obj.is_file():
        print(f"File {file_path} not found or is not a file. Skipping.")
        return {"current_file": None, "file_index": file_index + 1}

    content = read_file(file_path)

    if not content.strip():
        print(f"File {file_path} is empty. Skipping.")
        return {"current_file": None, "file_index": file_index + 1}

    prompt = f"""
You are a highly experienced Fullstack Software Architect specializing in React applications.
Your task is to generate a detailed technical specification for the provided file from a React project.
Focus on clarity, precision, and completeness, ensuring that another developer could understand the file's purpose,
its interactions, and its internal workings solely from your specification.

For each feature, you MUST include a Mermaid diagram (flowchart, sequence, or class diagram, whichever is most appropriate)
to visually represent the functionality or interaction.

Analyze the following file: {file_path}

--- File Content ---
{content}
--- End File Content ---

Generate the specification for this file. Each specification MUST follow this structure:

## Technical Specification: {file_path}

### 1. Overview
- Briefly describe the primary purpose and role of this file within the application.
- Identify its type (e.g., React Component, Page, Custom Hook, Utility Function, Context Provider, API Service, etc.).

### 2. Functionality & Responsibilities
- Detail what this file does. What problem does it solve? What features does it implement or support?
- If it's a component or page, describe its UI elements and user interactions.
- If it's a hook, explain what state or behavior it manages.
- If it's a utility, describe the operations it performs.

### 3. Inputs (Props/Parameters)
- If it's a React Component, list and describe all expected `props`. Include their types, whether they are optional, and their purpose.
- If it's a Custom Hook or Utility Function, list and describe its parameters.

### 4. Outputs/Side Effects
- What does this file return or produce? (e.g., JSX, state, data, modified data).
- Describe any side effects:
    - API calls (specify endpoints, methods, and data exchanged).
    - State mutations (local, global context, Redux, etc.).
    - Event emissions or subscriptions.
    - Direct DOM manipulations.

### 5. Internal Dependencies
- List all internal modules/files imported by this file (relative imports within the project).
- Briefly explain why each dependency is needed.

### 6. External Dependencies
- List all external libraries or packages imported (e.g., React, Material-UI, Axios, Lodash).
- Briefly explain their usage in this file.

### 7. Usage Examples (Optional, if applicable)
- Provide a brief code snippet or description of how this component/hook/utility is typically used by other parts of the application.

### 8. Notes/Considerations
- Any important design decisions, potential performance considerations, known limitations, or future improvements.

### 9. Mermaid Diagram
```mermaid
graph TD;
    A[Example Node] --> B[Another Node];
```
(Replace with an actual Mermaid diagram relevant to the file's functionality. Ensure the Mermaid syntax is correct.)

Ensure the output is clean, well-formatted Markdown and represents the specification for *this single file*.
"""
    new_spec_content = llm.invoke(prompt).content
    features_md_path = get_features_md_path()
    write_file(str(features_md_path), new_spec_content + "\n\n", append=True)
    print(f"Appended spec for {file_path} to Features.md")

    return {"current_file": file_path, "file_index": file_index + 1}


# 4️⃣ Router
def router(state: AgentState):
    files = state.get("files", [])
    file_index = state.get("file_index", 0)

    if file_index < len(files):
        return "generate_incremental_spec"
    return END


# 5️⃣ Construcción del grafo
graph = StateGraph(AgentState)

graph.add_node("list_files", node_list_files)
graph.add_node("initialize_features_md", node_initialize_features_md)
graph.add_node("generate_incremental_spec", node_generate_incremental_spec)

graph.set_entry_point("list_files")

graph.add_edge("list_files", "initialize_features_md")
graph.add_edge("initialize_features_md", "generate_incremental_spec")
graph.add_conditional_edges("generate_incremental_spec", router)

app = graph.compile()

