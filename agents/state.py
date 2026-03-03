from typing import TypedDict, List

class AgentState(TypedDict):
    project_path: str
    files: List[str]
    current_file: str