---
name: arxiv-paper-translator
description: Translate academic papers from arXiv to Chinese. Use when users want to (1) translate arXiv papers from English to Chinese, or (2) create technical reports summarizing academic papers. Works with arXiv paper IDs like "2206.04655".
license: MIT
---

# arXiv Paper Translator

Translate academic papers from arXiv by downloading LaTeX source, translating content while preserving structure, and generating translated PDFs with technical reports.

## Workflow Overview

1. **Download & Extract** - Get LaTeX source from arXiv
2. **Translate** - Convert English text to Chinese following LaTeX-specific rules
3. **Verify** - Check completeness and copy non-text files
4. **Compile** - Generate translated PDF using XeLaTeX
5. **Report** - Create technical summary document

## Prerequisites

Check local xelatex installation:
```bash
xelatex --version
```
If not installed, make sure Docker is installed and available.

```bash
docker --version
```
This skill requires XeLaTeX to compile translated PDFs. If not installed locally, Docker will be used instead.

Recommend using [xu-cheng/latex-docker](https://github.com/xu-cheng/latex-docker) Docker images.

```sh
# e.g. Tex Live full distribution (only linux/amd64). 
# NOTICE: ghcr.1ms.run is a mirror of ghcr.io.
docker pull ghcr.1ms.run/xu-cheng/texlive-debian:20260101 --platform linux/amd64
```

**If both local XeLaTeX and Docker are not installed, then STOP trying to run this skill.** And recommend user to install XeLaTeX or Docker.

## Step 1: Download LaTeX Source

Download and extract source code from arXiv:

```bash
# Download LaTeX source (replace ARXIV_ID with user-specified paper ID)
ARXIV_ID="2206.04655"
# Working Directory
mkdir -p arXiv_${ARXIV_ID}
cd arXiv_${ARXIV_ID}
wget https://arxiv.org/e-print/${ARXIV_ID} -O paper_source.tar.gz
mkdir paper_source
tar -xzf paper_source.tar.gz -C paper_source
cd paper_source
```

**Verify extraction:**
```bash
# List files to understand structure
ls -R
# Identify main .tex file (usually main.tex, paper.tex, or ms.tex)
find . -name "*.tex"
```

## Step 2: Translate LaTeX Files

### Read Translation Guidelines

**IMPORTANT**: Before translating, read [references/translation_guidelines.md](references/translation_guidelines.md) for detailed rules on:
- What to translate (main text, captions, footnotes)
- What NOT to translate (formulas, commands, person names, labels)
- Special cases (tables, algorithms, inline math)

### Translation Process

1. **Copy all non-.tex files** from `paper_source/` to `paper_cn/`:
   ```bash
   # Change to Working Directory
   cd arXiv_${ARXIV_ID}
   mkdir -p paper_cn
   cp -rv paper_source/* paper_cn/ 2>/dev/null || true
   # remove all .tex files from paper_cn/
   find ./paper_cn -name "*.tex" -type f -exec rm -f {} \;
   # .tex files will be translated later
   ```

2. **Find all .tex files**:
   ```bash
   find ./paper_source -name "*.tex" -type f
   ```

2. **Read each .tex file** and translate content according to guidelines.

3. **Save translations** to new directory `paper_cn/`, e.g.:
  ```
  paper_source/main.tex -> paper_cn/main.tex
  ```
  NOTICE: Just copy .tex files that has no content to translate (e.g. only commands, citations, or empty files).


### Parallel Translation for Large Papers

If paper has many .tex files or sections, spawn subagents to translate multiple files or sections in parallel:

```python
# Example: Launch parallel translation agents
# Agent 1: Translate introduction and related work
# Agent 2: Translate methodology
# Agent 3: Translate experiments and results
# Agent 4: Translate conclusion and appendix
```

This significantly speeds up translation of papers with many .tex files or sections.

When spawning subagents, each subagent should follow the prompt in [references/translation_prompt.md](references/translation_prompt.md) and add the title and abstract of the paper for context-awareness.

Make sure each subagent follows the translation guidelines and handles a single .tex file or section.

## Step 3: Verify Translation Completeness

Before compiling, check:

- Verify all `.tex` files translated from `paper_source/` are in `paper_cn/`
  ```
  # working dir: arXiv_${ARXIV_ID}
  find ./paper_source -name "*.tex" -type f
  find ./paper_cn -name "*.tex" -type f
  # Compare the two lists to verify all files are translated
  ```
- Verify all non-text files (e.g.figures, images, .bib, .sty) copied to `paper_cn/`
  ```
  # working dir: arXiv_${ARXIV_ID}
  find ./paper_source -type f ! -name "*.tex"
  find ./paper_cn -type f ! -name "*.tex"
  # Compare the two lists to verify all non-text files are copied
  ```

**Manual check**: Read through main .tex file to ensure:
- [ ] All sections translated
- [ ] LaTeX commands unchanged
- [ ] Math formulas unchanged
- [ ] File paths (\\input, \\includegraphics) unchanged
- [ ] Labels and references (\\label, \\ref, \\cite) unchanged

## Step 4: Add Chinese Support

Edit the main .tex file to add Chinese font support:

```latex
% Add to preamble (before \begin{document})
\usepackage{xeCJK}
\setCJKmainfont{FandolSong}  % TeX Live built-in font (RECOMMENDED)
```

**Font Options:**
- **FandolSong** (推荐) - TeX Live 自带开源字体，无需额外安装
- Noto Serif CJK SC - 需要安装 `fonts-noto-cjk` 包
- SimSun (宋体) - Windows 系统字体，Linux/Mac 需安装
- Songti SC - macOS 系统字体

Alternative: If paper uses specific document class, consider switching to ctex:
```latex
% Change document class
\documentclass[UTF8]{ctexart}  % or ctexbook, ctexrep
```

## Step 5: Compile Translated PDF

### Option 1: Local XeLaTeX (if available)

Use XeLaTeX for Chinese support:

```bash
# Basic compilation
xelatex main.tex

# If paper has bibliography (recommended approach)
xelatex main.tex
bibtex main
xelatex main.tex
xelatex main.tex

# Or use latexmk (if available)
latexmk -xelatex main.tex
```

### Option 2: Docker with TeX Live (recommended if local XeLaTeX unavailable)

If you don't have XeLaTeX installed locally, use Docker:

```bash
docker run --rm \
  -v paper_cn:/workspace \
  -w /workspace \
  ghcr.1ms.run/xu-cheng/texlive-debian:20260101 \
  bash -c "xelatex main.tex && bibtex main && xelatex main.tex && xelatex main.tex"

# Or if you created a Makefile (see Step 5.1)
docker run --rm \
  -v paper_cn:/workspace \
  -w /workspace \
  ghcr.1ms.run/xu-cheng/texlive-debian:20260101 \
  make pdf
```

### Step 5.1: Add Makefile (Optional but Recommended)

Copy the Makefile template from skill assets to the `paper_cn` directory:

```bash
# Copy Makefile template to paper_cn directory
cp path/to/skills/arxiv-latex-translator/assets/Makefile.template paper_cn/Makefile
```

The Makefile provides these targets:
- `make pdf` - Full compilation with bibliography (default)
- `make draft` - Quick compile without bibliography
- `make clean` - Remove auxiliary files
- `make distclean` - Remove all generated files including PDF
- `make help` - Show usage information

Then compile with:
```bash
# Local
make pdf

# Docker
docker run --rm -v paper_cn:/workspace -w /workspace \
  ghcr.1ms.run/xu-cheng/texlive-debian:20260101 make pdf
```

**Output**: `main.pdf` (or corresponding output file)

## Step 6: Generate Technical Report

Spawn a subagent to generate the technical report.

The subagent will:

- Follow the [references/summary_prompt.md](references/summary_prompt.md)
- Based on understanding of the LaTeX source and translated PDF, create a technical summary using [assets/report_template.md](assets/report_template.md).

**Fill in the template sections**:
1. Read the translated PDF (paper_cn/main.pdf) to understand paper content
2. Extract key information (title, authors, contributions, methods, results)
3. Analyze the research approach and findings
4. Summarize in structured Markdown format

**Save report**: `{arxiv_id}_technical_report.md`

## Final Deliverables

Provide user with:
1. ✅ **Translated PDF path**: `paper_cn/main.pdf`
2. ✅ **Technical report**: `{arxiv_id}_technical_report.md`
3. ✅ **Source location**: `paper_cn/` directory with all translated LaTeX files

## Common Issues & Solutions

### Issue: Downloaded file is a single .tex instead of .tar.gz
```bash
# Some papers have single-file sources
mv paper_source.tar.gz paper_source.tex
mkdir paper_source && mv paper_source.tex paper_source/
```

### Issue: Main file not named main.tex
```bash
# Find and identify main file
find . -name "*.tex" -exec grep -l "\\documentclass" {} \;
```

### Issue: Compilation fails with Chinese text
```bash
# Check encoding
file *.tex  # Should show UTF-8

# Convert if needed
iconv -f ISO-8859-1 -t UTF-8 file.tex > file_utf8.tex
```

### Issue: Paper uses custom .sty or .cls files
- Always copy non-`.tex` files (e.g. figures, images, .bib, .sty) to `paper_cn/`
- Check if styles have hard-coded English text that needs translation

## Tips for High-Quality Translation

1. **Maintain academic tone** - Use formal Chinese appropriate for academic papers
2. **Preserve technical terms** - Keep widely-accepted English terms (e.g., "Transformer", "ResNet", "CNN", "GAN", "SVG", "LLM")
3. **Consistency** - Use consistent translations for repeated terms throughout paper
4. **Test compilation early** - Compile after translating first section to catch issues early
5. **Verify math rendering** - Ensure all equations display correctly in translated PDF

## References

- **Detailed translation rules**: [references/translation_guidelines.md](references/translation_guidelines.md)
- **Report template**: [assets/report_template.md](assets/report_template.md)
- **Makefile template**: [assets/Makefile.template](assets/Makefile.template)
- **arXiv API**: https://info.arxiv.org/help/api/index.html
