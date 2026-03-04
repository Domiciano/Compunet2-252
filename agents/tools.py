import os
from pathlib import Path
import subprocess

# --- File System Tools ---

def list_files(project_path: str):
    """
    Lists all relevant source files in the project's 'src' directory.
    Only returns .tsx, .ts, .jsx, .js files.
    """
    base = Path(project_path).resolve()
    src_path = base / "src"
    if not src_path.exists():
        raise ValueError(f"No src folder found in {base}")

    files = [
        str(p) for p in src_path.rglob("*")
        if p.is_file() and p.suffix in [".tsx", ".ts", ".jsx", ".js"]
    ]
    return files

def read_file(path: str):
    """Reads a file and returns its content."""
    path_obj = Path(path)
    if not path_obj.exists() or not path_obj.is_file():
        return ""
    return path_obj.read_text(encoding="utf-8")

def write_file(path: str, content: str, append: bool = False):
    """
    Writes content to a file.
    Creates the directory if it doesn't exist.
    If append is True, it adds the content to the end of the file.
    """
    full_path = Path(path)
    try:
        full_path.parent.mkdir(parents=True, exist_ok=True)
        mode = "a" if append else "w"
        with full_path.open(mode, encoding="utf-8") as f:
            f.write(content)
        return f"File '{path}' {'appended' if append else 'written'} successfully."
    except Exception as e:
        return f"Error writing file: {e}"

# --- Spec/Markdown File Tools ---

def get_features_md_path():
    """Returns the path to the Features.md file at the project root."""
    # Assuming repo_root is defined at the top of the file, similar to how SPEC_DIR was.
    # Let's define repo_root here for this function's scope if it's not global.
    # Or, better, pass it as an argument if it's always available.
    # For now, I'll assume repo_root is accessible or define it locally.
    repo_root = Path(__file__).resolve().parent.parent
    return repo_root / "Features.md"


# --- Shell/Execution Tools ---

def run_shell(project_path: str, command: str):
    """Executes a shell command in the project's directory."""
    project_path_abs = str(Path(project_path).resolve())
    try:
        result = subprocess.run(
            command,
            shell=True,
            check=True,
            capture_output=True,
            text=True,
            cwd=project_path_abs,
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        return f"Error executing command: {e}\n{e.stderr}"

def run_tests(project_path: str):
    """Runs the tests for the project."""
    return run_shell(project_path, "npm test")
