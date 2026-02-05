---
name: arxiv-paper-translator
description: Translate academic papers from arXiv to Chinese. Use when users want to (1) translate arXiv papers from English to Chinese, or (2) create technical reports summarizing academic papers. Works with arXiv paper IDs like "2206.04655".
license: MIT
---

# arXiv Paper Translator

Translate academic papers from arXiv by downloading LaTeX source, translating content while preserving structure, and generating translated PDFs with technical reports.

## Workflow Overview
1. **Download & Extract** - Get LaTeX source from arXiv
2. **Translate** - Translate English narrative content to Chinese following LaTeX-specific rules
3. **REVIEW PHASE** - **MUST COMPLETE** before compiling
4. **CJK Support & Localize Labels** - Add xeCJK, localize labels
5. **Compile .tex Files** - Generate translated PDF using XeLaTeX
6. **Report** - Create technical summary document

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

e.g. Tex Live full distribution (only linux/amd64):

```bash
# NOTICE: ghcr.1ms.run is a mirror of ghcr.io.
docker pull ghcr.1ms.run/xu-cheng/texlive-debian:20260101 --platform linux/amd64
# => docker pull ghcr.io/xu-cheng/latex-debian:20260101 --platform linux/amd64
```

**If both local XeLaTeX and Docker are not installed, then STOP trying to run this skill.** 
And Ask user question: "XeLaTeX or Docker is required to compile translated PDFs. Which one do you want to use? I'll help you to setup."

## Step 1: Download LaTeX Source

Extract ARXIV_ID from user input.

Download and extract source code from arXiv:

```bash
# Download LaTeX source (replace ARXIV_ID with user-specified paper ID)
ARXIV_ID="2206.04655"
mkdir -p arXiv_${ARXIV_ID}
wget -q https://arxiv.org/e-print/${ARXIV_ID} -O arXiv_${ARXIV_ID}/paper_source.tar.gz
mkdir -p arXiv_${ARXIV_ID}/paper_source
tar -xzf arXiv_${ARXIV_ID}/paper_source.tar.gz -C arXiv_${ARXIV_ID}/paper_source
```

**Verify extraction:**
```bash
# List files to understand structure
tree arXiv_${ARXIV_ID}/paper_source
```

## Step 2: Translate LaTeX Files

**IMPORTANT**: Before translating, read [references/translation_guidelines.md](references/translation_guidelines.md) for detailed rules.

### Translation Workflow

Step 2.1. **Copy all files** from `paper_source/` to `paper_cn/`:

Option 1 - Using cp (standard):
```bash
cd arXiv_${ARXIV_ID}
mkdir -p paper_cn
cp -r paper_source/* paper_cn/
```

Option 2 - Using rsync (better for incremental sync):
```bash
cd arXiv_${ARXIV_ID}
mkdir -p paper_cn
rsync -av paper_source/ paper_cn/
```

All .tex files in `paper_cn/` will be translated in-place later.

Step 2.2. Gather Context (MANDATORY):

Before ANY translation, you MUST extract:
1. **Paper Title**: From `\title{...}` in main file
2. **Abstract**: From `\begin{abstract}...\end{abstract}` or `\abstract{...}` in main file
3. **Paper Structure**: List all sections and which .tex file contains each    
4. **Key Terminologies**: Build terminology table from paper content

For some glossaries or terminologies you don't know how to translate, you can ASK user question for definition.

This information is REQUIRED for translation tasks.

Read [references/translation_prompt.md](references/translation_prompt.md) for detailed translation rules.

Step 2.3. Dispatch Translation Tasks

**Identify files to translate**:

- Find main file (contains \documentclass{...}, usually main.tex, paper.tex, template.tex, etc.)
- Filter .tex files that need translation (skip macro-only files if any, or user specified files)
- Create list of files to translate

**Translation Strategy**:

1. **Translate main file first** (sequential)
   - Builds shared terminology context
   - Ensures consistency for other files

2. **Translate other files**:
   - If 3+ files: Dispatch in parallel
   - If 1-2 files: Sequential translation

**Each translation Task**:
- Task type: general-purpose subagent
- Input: File path in `paper_cn/` directory
- Action: Read file → Translate → Edit file (Update file content with translated text)
- Must follow [references/translation_prompt.md](references/translation_prompt.md)
- Must use gathered context (title, abstract, structure, terminologies)

**Example command to find main .tex file**:
```bash
find paper_cn/ -name "*.tex" -exec grep -l '\\documentclass' {} \; | head -1
```

## Step 3: Review Translation

After all translation Tasks are completed, you MUST review the translated content following [references/review_checklist.md](references/review_checklist.md) to verify:

1. **File Completeness Check**
2. **LaTeX Command Spelling**
3. **CJK Catcode Issues**
4. **Translation Quality Check**
5. **Content Spot-Check**

Perform fixes as needed based on review findings.

**CRITICAL**: Before proceeding to Step 4, you must confirm:
- [ ] All review checks completed
- [ ] Any issues identified and fixed
- [ ] Translation quality verified

## Step 4: Add Chinese Support

**IMPORTANT**: Follow [references/chinese_support.md](references/chinese_support.md) to configure CJK fonts and localize labels.

Modify main .tex file to include xeCJK package and set CJK fonts.

e.g. for Fandol font (which is included in TexLive Docker image):

```latex
\usepackage{xeCJK}
\setCJKmainfont{FandolSong}[ItalicFont=FandolKai]  % 宋体 - 正文，\emph 用楷体
\setCJKsansfont{FandolHei}    % 黑体 - 标题、\textsf
\setCJKmonofont{FandolFang}   % 仿宋 - 代码、\texttt
```

If running locally, Ask user for font preference before configuring. Check available fonts with `fc-list :lang=zh family`.

## Step 5: Compile Translated PDF

### Option 1: Local XeLaTeX

```bash
# Basic compilation
xelatex main.tex

# If paper has bibliography (recommended approach)
xelatex main.tex
bibtex main
xelatex main.tex
xelatex main.tex
```
Or use `latexmk` for automated compilation:

```bash
latexmk -xelatex main.tex
```

### Option 2: Docker with TeX Live

```bash
# change working directory to arXiv_${ARXIV_ID}
cd /path/to/arXiv_${ARXIV_ID}
docker run --rm \
  -v "$(pwd)/paper_cn":/workspace \
  -w /workspace \
  ghcr.1ms.run/xu-cheng/texlive-debian:20260101 \
  latexmk -xelatex main.tex
```

## Step 6: Generate Technical Report

Spawn a subagent following [references/summary_prompt.md](references/summary_prompt.md) to create a technical summary using [assets/report_template.md](assets/report_template.md).

**Save report**: `{arxiv_id}_technical_report.md`

## Final Deliverables

1. **Translated PDF**: `paper_cn/main.pdf`
2. **Technical report**: `{arxiv_id}_technical_report.md`
3. **Source**: `paper_cn/` directory with all translated LaTeX files

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Downloaded file is single .tex, not .tar.gz | `mv paper_source.tar.gz paper_source.tex` and create directory |
| Main file not named main.tex | `find . -name "*.tex" -exec grep -l "\\documentclass" {} \;` |
| Compilation fails with encoding error | `file *.tex` to check, `iconv -f ISO-8859-1 -t UTF-8` to convert |
| Command misspelling (e.g. `\footnotext`) | See review checklist step 2 — diff command sets to find typos |
| Undefined control sequence - \xmax概率 | xeCJK catcode issue — insert `{}` to separate custom macro from CJK text → `\xmax{}概率` |
| Undefined control sequence - \chinese{弋} | Original uses CJK package's \chinese macro; add \newcommand{\chinese}[1]{#1} after xeCJK config to prevent catcode issue |
| Custom .sty/.cls files | Copy to `paper_cn/`, check for hard-coded English text |
| `Missing $ inserted` in translated tables | Mixed CJK/Latin characters may cause xeCJK font switching errors (e.g. `(xyz)` be treated as math mode), restore original content in table cells | 
| Undefined references (e.g., `\ref{fig:joint-train}`) | Ensure ALL referenced files are present in `paper_cn/`, even if NOT translated files. | 
## References

- **Translation rules**: [references/translation_guidelines.md](references/translation_guidelines.md)
- **Translation prompt**: [references/translation_prompt.md](references/translation_prompt.md)
- **Review checklist**: [references/review_checklist.md](references/review_checklist.md)
- **Chinese support**: [references/chinese_support.md](references/chinese_support.md)
- **Report template**: [assets/report_template.md](assets/report_template.md)
- **Makefile template (optional)**: [assets/Makefile.template](assets/Makefile.template)
