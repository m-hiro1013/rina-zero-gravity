import os

# Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.join(BASE_DIR, 'src')
DIST_TOON_DIR = os.path.join(BASE_DIR) # Output directly to toon_world folder

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def build_scripts():
    print("Building scripts.html...")
    js_buffer = []
    
    # Add JS modules
    modules_dir = os.path.join(SRC_DIR, 'js', 'modules')
    if os.path.exists(modules_dir):
        for filename in os.listdir(modules_dir):
            if filename.endswith('.js'):
                print(f"  Including module: {filename}")
                content = read_file(os.path.join(modules_dir, filename))
                # Remove export/import statements for simple concatenation (Primitive bundling)
                # or wrap in IIFE / simple object exposure if needed.
                # For now, let's assume we use ES modules in the browser directly
                # But GAS html service works best with just script tags.
                # Let's adjust the code to attach to global object (window) for now to be safe and simple.
                content = content.replace('export class', 'class').replace('export const', 'const')
                js_buffer.append(f"// --- {filename} ---\n{content}\n")

    # Add main app logic
    main_js = os.path.join(SRC_DIR, 'js', 'main.js')
    if os.path.exists(main_js):
        print("  Including main.js")
        content = read_file(main_js)
        js_buffer.append(f"// --- main.js ---\n{content}\n")

    output_content = "<script>\n" + "\n".join(js_buffer) + "\n</script>"
    write_file(os.path.join(DIST_TOON_DIR, 'scripts.html'), output_content)

def build_styles():
    print("Building styles.html...")
    css_buffer = []
    
    css_dir = os.path.join(SRC_DIR, 'css')
    if os.path.exists(css_dir):
        for filename in os.listdir(css_dir):
            if filename.endswith('.css'):
                print(f"  Including css: {filename}")
                content = read_file(os.path.join(css_dir, filename))
                css_buffer.append(f"/* --- {filename} --- */\n{content}\n")

    output_content = "<style>\n" + "\n".join(css_buffer) + "\n</style>"
    write_file(os.path.join(DIST_TOON_DIR, 'styles.html'), output_content)

if __name__ == '__main__':
    build_scripts()
    build_styles()
    print("Build complete!")
