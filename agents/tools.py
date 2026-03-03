from pathlib import Path


def list_files(project_path: str):
    base = Path(project_path).resolve()

    if not base.exists():
        raise ValueError(f"Project path does not exist: {base}")

    # Solo analizamos la carpeta src
    src_path = base / "src"

    if not src_path.exists():
        raise ValueError(f"No src folder found in {base}")

    files = []

    for p in src_path.rglob("*"):
        if (
            p.is_file()
            and p.suffix in [".tsx", ".ts", ".jsx", ".js"]
        ):
            files.append(str(p))

    return files


def read_file(path: str):
    path_obj = Path(path)

    if not path_obj.exists() or not path_obj.is_file():
        return ""

    return path_obj.read_text(encoding="utf-8")


def append_spec(content: str):
    # Guardamos specs dentro de agents/specs
    specs_dir = Path(__file__).resolve().parent / "specs"
    specs_dir.mkdir(exist_ok=True)

    spec_file = specs_dir / "generated.md"

    with open(spec_file, "a", encoding="utf-8") as f:
        f.write(content + "\n\n")