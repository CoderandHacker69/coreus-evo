
#!/usr/bin/env python3
"""
build.py - Builds coreus-onefile.html from index.html

Transformations applied:
1. Converts relative asset paths to full URLs so the file works standalone.
2. Converts game backend mirror host references to GitHub Pages URLs.
3. Removes the "this is a deployment" notice from the About/Info section.
"""

import re
import sys
import os


def build_onefile(input_path="index.html", output_path="coreus-onefile.html"):
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found.")
        sys.exit(1)

    with open(input_path, "r", encoding="utf-8") as f:
        html = f.read()

    # -------------------------------------------------------------------------
    # 1. Convert relative asset paths to absolute URLs
    # -------------------------------------------------------------------------

    # Games JSON fetch
    html = html.replace(
        "./assets/games.json",
        "https://noodlelover1.github.io/coreus-assets/games.json",
    )

    # Tools JSON fetch
    html = html.replace(
        "./assets/tools.json",
        "https://noodlelover1.github.io/coreus-assets/games.json",
    )

    # Game launch paths (template in JavaScript)
    html = html.replace(
        '`./assets/${gamePath}`',
        '`https://noodlelover1.github.io/coreus-assets/${gamePath}`',
    )

    # Tool launch paths (template in JavaScript)
    html = html.replace(
        '`./assets/${toolPath}`',
        '`https://noodlelover1.github.io/coreus-assets/${toolPath}`',
    )

    # Tools images (first occurrence) -> CDN URL
    html = html.replace(
        'src="./assets/${imagePath}"',
        'src="https://noodlelover1.github.io/coreus-assets/${imagePath}"',
        1,
    )

    # Games images (remaining occurrence) -> GitHub Pages
    html = html.replace(
        'src="./assets/${imagePath}"',
        'src="https://noodlelover1.github.io/coreus-assets/${imagePath}"',
        1,
    )

    # -------------------------------------------------------------------------
    # 2. Convert game backend mirror hosts to GitHub Pages URL
    # -------------------------------------------------------------------------

    # Update mirrorHosts array in JavaScript - add GitHub Pages as primary
    html = html.replace(
        "const mirrorHosts = [\n                'https://coreus-assets-x44fhv591.onrender.com/',\n                'https://coreus-assets-7hb65sx0h.onrender.com/',\n                'https://coreus-assets-g6kx36vv0.vercel.app/'\n            ];",
        "const mirrorHosts = [\n                'https://noodlelover1.github.io/coreus-assets/',\n                'https://coreus-assets-x44fhv591.onrender.com/',\n                'https://coreus-assets-7hb65sx0h.onrender.com/',\n                'https://coreus-assets-g6kx36vv0.vercel.app/'\n            ];",
    )

    # Set default gameBackend to GitHub Pages for onefile
    html = html.replace(
        "let gameBackend = localStorage.getItem('gameBackend') || 'auto';",
        "let gameBackend = localStorage.getItem('gameBackend') || 'https://noodlelover1.github.io/coreus-assets/';",
    )

    # Game backend selector dropdown - add GitHub Pages as first option
    html = html.replace(
        "<option value=\"auto\">Auto fallback</option>",
        "<option value=\"https://noodlelover1.github.io/coreus-assets/\">GitHub Pages</option>",
        1,
    )

    # -------------------------------------------------------------------------
    # 3. Remove the "this is a deployment" notice from the About section
    # -------------------------------------------------------------------------

    html = html.replace(
        'This is a deployment of coreus not the singlefile version, get it here: <a href="/coreus-onefile.html" download=coreus-onefile.html style="color: var(--accent-color);">Download</a>',
        'You are running the singlefile version of Coreus. Get the latedt release here : <a href="https://noodlelover1.github.io/coreus/coreus-onefile.html" download=coreus-onefile.html style="color: var(--accent-color);">Download</a>',
        1,
    )

    # -------------------------------------------------------------------------
    # Write output
    # -------------------------------------------------------------------------

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)

    input_size = os.path.getsize(input_path)
    output_size = os.path.getsize(output_path)
    print(f"Built {output_path} successfully.")
    print(f"  Source: {input_path} ({input_size:,} bytes)")
    print(f"  Output: {output_path} ({output_size:,} bytes)")


if __name__ == "__main__":
    build_onefile()
