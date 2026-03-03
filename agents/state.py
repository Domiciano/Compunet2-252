from typing import TypedDict, List, Optional

class AgentState(TypedDict):
    project_path: str
    files: List[str]
    current_file: Optional[str]