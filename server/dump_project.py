import os

# Папки, которые почти всегда не нужны
SKIP_DIRS = {
    ".git",
    "__pycache__",
    ".venv",
    "venv",
    "node_modules",
    ".idea",
    ".DS_Store"
}
SKIP_FILES = {
    "dump_project.py",
    "project_dump.txt",
    "package-lock.json",
    "package.json",
}
# Расширения файлов, которые будем читать
ALLOWED_EXTENSIONS = {
    ".py", ".txt", ".md", ".json", ".js", ".ts",
    ".html", ".css", ".yml", ".yaml", ".xml",
    ".go", ".java", ".cpp", ".c", ".h", ".rs",
    ".env"
}

def is_text_file(filename: str) -> bool:
    _, ext = os.path.splitext(filename)
    return ext in ALLOWED_EXTENSIONS

def dump_project(root_dir: str, output_file: str):
    file_count = 0

    with open(output_file, "w", encoding="utf-8") as out:
        for dirpath, dirnames, filenames in os.walk(root_dir):

            # удаляем ненужные папки из обхода
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]

            for filename in filenames:
                if filename in SKIP_FILES:
                    continue
                file_path = os.path.join(dirpath, filename)

                if not is_text_file(filename):
                    continue

                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()

                    out.write("\n\n")
                    # out.write("=" * 80 + "\n")
                    out.write(f"FILE: {file_path}\n")
                    # out.write("=" * 80 + "\n\n")
                    out.write(content)

                    file_count += 1

                except Exception as e:
                    out.write("\n\n")
                    out.write("=" * 80 + "\n")
                    out.write(f"FILE: {file_path}\n")
                    out.write("ERROR READING FILE\n")
                    out.write(str(e) + "\n")
                    out.write("=" * 80 + "\n")

    print(f"Готово! Обработано файлов: {file_count}")
    print(f"Результат сохранён в: {output_file}")

if __name__ == "__main__":
    project_path = "."   # текущая папка
    output_path = "project_dump.txt"

    dump_project(project_path, output_path)