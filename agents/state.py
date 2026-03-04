from typing import List, TypedDict, Optional


class AgentState(TypedDict):
    project_path: str
    files: List[str]
    file_index: int  # Índice para el archivo actual en la lista `files`
    current_file: Optional[str]
    features_md_content: Optional[str]
