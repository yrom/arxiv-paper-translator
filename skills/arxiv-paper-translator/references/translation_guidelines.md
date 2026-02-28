# LaTeX Source Translation Guidelines

This document provides detailed guidelines for translating academic papers from English to Chinese while preserving LaTeX structure and compilability.

## Core Principles

1. **Preserve LaTeX structure** - All commands, environments, and macros must remain valid
2. **Maintain scientific accuracy** - Mathematical expressions and technical terms must be precise
3. **Keep compilability** - The translated document must compile without errors
4. **Selective translation** - Only translate content meant for readers, not code/formulas
5. **Follow academic translation prompt** - See [translation_prompt.md](translation_prompt.md)

## What to Translate

### ✅ Always Translate

1. **Main text content**
   - Paragraphs, sentences in document body
   - Section, subsection, chapter titles
   - Abstract and conclusion text

2. **Paper title** — Translate text inside `\title{...}` / `\icmltitle{...}` and similar title commands

3. **Captions and labels**
   - Figure captions: `\caption{...}`
   - Table captions
   - Algorithm/listing titles

4. **Comments for readers**
   - Footnotes: `\footnote{...}`
   - Author footnotes: `\thanks{...}`
   - Margin notes meant for reading

5. **Hard-coded English labels in conference/journal .sty/.cls**
   - Check template files for visible English strings such as `Abstract`, `Equal contribution`, `Correspondence to:`, `Under review`, `Preprint`, etc.
   - Override with `\renewcommand` or edit the .sty/.cls strings directly
   ```latex
   % Example: override ICML template label
   \renewcommand{\icmlEqualContribution}{\textsuperscript{*}同等贡献 }
   ```
   - If no overridable command exists, edit the .sty/.cls copy in `paper_cn/` directly

6. **Bibliography context (optional)**
   - Paper titles in `\bibitem` if desired
   - Keep original for traceability

### Example: Main Text

```latex
% Before
\section{Introduction}
Deep learning has revolutionized computer vision.

% After
\section{引言}
深度学习已经彻底改变了计算机视觉领域。
```

### Example: Captions

```latex
% Before
\caption{Accuracy comparison on ImageNet dataset.}

% After
\caption{在ImageNet数据集上的准确率对比。}
```

## What NOT to Translate

### 🚯 Quick Decision Rule

If the content is **machine-executable** (code, formulas, command outputs),
do NOT translate it. Only translate narrative content meant for human readers.

### ❌ Never Translate

1. **Mathematical formulas and equations**
   ```latex
   % Keep unchanged
   \begin{equation}
   f(x) = \sum_{i=1}^{n} w_i x_i + b
   \end{equation}
   ```

2. **LaTeX commands and environments**
   ```latex
   % Keep these commands as-is
   \begin{figure}
   \includegraphics{image.pdf}
   \label{fig:example}
   \end{figure}
   ```

3. **Content in lstlisting and minted blocks**
   ```latex
   % Code remains in English
   \begin{lstlisting}[language=Python]
   def train_model(data, epochs=100):
       return model.fit(data, epochs=epochs)
   \end{lstlisting}
   ```
   
   ```latex
   % Skip translation for lstlisting block
   \begin{lstlisting}[style=snippet,caption={\textbf{System prompt: Tool use}}]
   You are a helpful function-calling AI assistant. You are provided with function signatures within <functions></functions> XML tags. You may call one or more functions to assist with the user query. Output any function calls within <function_calls></function_calls> XML tags. Do not make assumptions about what values to plug into functions.
   \end{lstlisting}
   ```

```latex
   % Skip translation for minted block
   \begin{minted}[
      ]{markdown}
Runtime Error
ZeroDivisionError: division by zero
Line 73 in separateSquares (Solution.py)

Last Executed Input
[[26,30,2],[11,23,1]]
   \end{minted}
```

4. **Raw data in tables** (AI queries, code, traceback, user input examples)
   - Keep cell content in English, only translate caption and descriptive headers
   - Rule of thumb: "evidence/data" → don't translate; "narrative" → translate

5. **Algorithm pseudocode structure**
   ```latex
   % Keep structure, translate only necessary keywords/comments
   \begin{algorithm}
   \caption{Training Algorithm}  % ← Translate caption
   \begin{algorithmic}
   \STATE $x \leftarrow 0$  % ← Keep code as-is
   \FOR{$i = 1$ to $n$}
   \STATE $x \leftarrow x + i$
   \ENDFOR
   \end{algorithmic}
   \end{algorithm}
   ```

5. **Person names and proper nouns**
   - Author names: keep as-is (John Smith → John Smith)
   - Model names: keep original (ResNet, BERT)
   - Institution names — follow these rules:
     - Chinese institutions: use official Chinese name
     - Well-known foreign institutions: use established Chinese translation
     - Lesser-known institutions: keep original English name
       - e.g. Tsinghua University → 清华大学, 
6. **File paths and references**
   ```latex
   % Keep unchanged
   \input{sections/methodology}
   \includegraphics{figures/result.pdf}
   \cite{smith2020deep}
   ```

7. **URLs and hyperlinks**
   ```latex
   % Keep unchanged
   \url{https://arxiv.org/abs/2206.04655}
   \href{https://github.com/...}{code repository}
   ```

8. **Labels and reference keys**
   ```latex
   % Keep unchanged
   \label{sec:intro}
   \ref{fig:architecture}
   \cite{lecun2015deep}
   ```
9. **Inline expressions and code**
   ```latex
   % Keep unchanged
   $E = mc^2$
   \texttt{code}
   \verb|code|
   ```
## Special Cases

### Tables

Translate cell content (data descriptions), keep structure:

```latex
% Before
\begin{table}
\begin{tabular}{lcc}
\hline
Method & Accuracy & Speed \\
\hline
Ours & 95.2\% & 10ms \\
\hline
\end{tabular}
\caption{Performance comparison}
\end{table}

% After
\begin{table}
\begin{tabular}{lcc}
\hline
方法 & 准确率 & 速度 \\
\hline
本文方法 & 95.2\% & 10ms \\
\hline
\end{tabular}
\caption{性能对比}
\end{table}
```

### Inline Math in Text

Keep math unchanged, translate surrounding text:

```latex
% Before
The loss function $\mathcal{L}$ measures the error.

% After
损失函数 $\mathcal{L}$ 用于衡量误差。
```

### Acronyms

First mention: provide both English and Chinese

e.g.: English "mixture-of-experts (MoE)" → Chinese "混合专家（Mixture-of-Experts，MoE）"

```latex
% Before
Convolutional Neural Networks (CNN) are widely used.

% After
卷积神经网络（Convolutional Neural Networks, CNN）被广泛应用。
```

Subsequent mentions: use acronym

```latex
% Before
CNNs achieve high accuracy.

% After
CNN具有很高的准确率。
```

### Comments in LaTeX Source

Comments (`%`-prefixed lines) do not need translation — keep them as-is to save tokens.

```latex
% TODO: Add more experiments  ← keep original, do not translate
\section{实验}
```

## File Organization

### Multi-file Projects

1. **Main file** (e.g., `main.tex`)
   - Translate preamble comments if helpful
   - Translate document content

2. **Section files** (e.g., `sections/intro.tex`)
   - Translate each file independently
   - Keep `\input{}` or `\include{}` commands unchanged

3. **Non-text files** (copy as-is)
   - Images: `figures/*.pdf`, `figures/*.png`
   - Bibliography: `references.bib` (optional translation of titles)
   - Style files: `*.sty`, `*.cls`
   - Build scripts: `Makefile`, `latexmkrc`

### Directory Structure

```
paper_source/          # Original
├── main.tex
├── sections/
│   ├── intro.tex
│   └── method.tex
├── figures/
│   └── arch.pdf
└── references.bib

paper_cn/              # Translated
├── main.tex          # Translated
├── sections/
│   ├── intro.tex     # Translated
│   └── method.tex    # Translated
├── figures/
│   └── arch.pdf      # Copied as-is
└── references.bib    # Copied (or optionally translate titles)
```

## Translation Quality Checklist

For detailed automated checks (file completeness, command spelling diff, CJK catcode scan, content spot-check), see [review_checklist.md](review_checklist.md).

## Chinese Writing Guidelines

Follow these guidelines for better readability:

| 类别 | 规则 | 示例 |
|------|------|------|
| 去冗余词 | 避免"来"、"地"、"的"、"了"等非必要词 | `来表示` → `表示`；`隐式地` → `隐式` |
| 精简主语 | 削减"我们"，用"本文"或无主语句 | `在本工作中，我们提出了X` → `本文提出的X` |
| 去空洞修饰语 | 删空洞形容词，用数据代替 | `卓越的效率` → `速度快约100倍` |
| 术语标注 | 英文标注统一 Title Case | `photometric loss` → `Photometric Loss` |
| 句式精简 | 合并碎句，拆分长定语 | 三个"首先/然后/最后"短句 → 一句带顿号 |

## Handling Edge Cases

### Custom Macros

If paper defines custom commands:

```latex
\newcommand{\ournethod}{ProposedNet}
```

Translate the output, not the command:

```latex
% If used in text
We propose \ourmethod{} for classification.

% Translate to
我们提出\ourmethod{}用于分类。
% Keep macro unchanged, it will expand to "ProposedNet"
```

Or redefine macro to Chinese:

```latex
\newcommand{\ourmethod}{提出的网络}
```

### Theorems and Proofs

Translate theorem content, keep structure:

```latex
% Before
\begin{theorem}
For any convex function $f$, the minimum exists.
\end{theorem}

% After
\begin{theorem}
对于任意凸函数 $f$，最小值存在。
\end{theorem}
```

May need to configure theorem environment names:

```latex
\newtheorem{theorem}{定理}
\newtheorem{lemma}{引理}
\newtheorem{proof}{证明}
```
