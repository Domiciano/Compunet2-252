from pathlib import Path
from graph import app


# Root del repositorio (Compunet2-252)
repo_root = Path(__file__).resolve().parent.parent

# Carpeta real del frontend
project_root = repo_root / "classnotesapp"

print(f"Analyzing frontend at: {project_root}")

app.invoke({
    "project_path": str(project_root),
    "files": [],
    "file_index": 0,  # Initialize file_index
    "current_file": None
})