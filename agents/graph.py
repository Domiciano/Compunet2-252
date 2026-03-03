from pathlib import Path
from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama

from state import AgentState
from tools import list_files, read_file, append_spec


llm = ChatOllama(
    model="qwen2.5-coder:latest",
    temperature=0
)


# 1️⃣ Listar archivos
def node_list_files(state: AgentState):
    files = list_files(state["project_path"])
    print(f"Found {len(files)} files to analyze.")
    return {"files": files}


# 2️⃣ Obtener siguiente archivo
def node_get_next_file(state: AgentState):
    files = state.get("files", [])

    if not files:
        return {
            "current_file": None,
            "files": []
        }

    next_file = files[0]
    remaining = files[1:]

    print(f"Processing: {next_file}")

    return {
        "current_file": next_file,
        "files": remaining
    }


# 3️⃣ Procesar archivo
def node_process_file(state: AgentState):
    file_path = state.get("current_file")

    if not file_path:
        return {}

    path_obj = Path(file_path)

    if not path_obj.exists() or not path_obj.is_file():
        return {}

    content = read_file(file_path)

    if not content.strip():
        return {}

    prompt = f"""
You are a frontend software architect.

Analyze this file.

1. Determine the type:
- Component
- Page
- Hook
- Context
- Service
- Store
- Utility
- Other

2. Describe its responsibility in 3-6 lines.

3. List:
- Main props (if component)
- State management used
- Internal project dependencies (relative imports)
- API calls (if any)

Return structured markdown in this format:

# {file_path}

Type: <Type>

## Responsibility
...

## Inputs
...

## Dependencies
...

## Side Effects
...

FILE CONTENT:
{content}
"""

    result = llm.invoke(prompt).content
    append_spec(result)

    return {}


# 4️⃣ Router
def router(state: AgentState):
    if state.get("files"):
        return "get_next_file"
    return END


# 5️⃣ Construcción del grafo
graph = StateGraph(AgentState)

graph.add_node("list_files", node_list_files)
graph.add_node("get_next_file", node_get_next_file)
graph.add_node("process_file", node_process_file)

graph.set_entry_point("list_files")

graph.add_edge("list_files", "get_next_file")
graph.add_edge("get_next_file", "process_file")
graph.add_conditional_edges("process_file", router)

app = graph.compile()