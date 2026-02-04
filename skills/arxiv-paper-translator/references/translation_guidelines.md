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

2. **Captions and labels**
   - Figure captions: `\caption{...}`
   - Table captions
   - Algorithm/listing titles

3. **Comments for readers**
   - Footnotes: `\footnote{...}`
   - Margin notes meant for reading

4. **Bibliography context (optional)**
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

3. **Code listings**
   ```latex
   % Code remains in English
   \begin{lstlisting}[language=Python]
   def train_model(data, epochs=100):
       return model.fit(data, epochs=epochs)
   \end{lstlisting}
   ```
   Exception: Translate code comments if they're meant for explanation

4. **Algorithm pseudocode structure**
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
   - Author names: John Smith → John Smith (不翻译)
   - Institution names: MIT → MIT (保持原文或意译:麻省理工学院)
   - Model names: ResNet, BERT → 保持原文

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

Translate only if they're notes for understanding:

```latex
% Before
% TODO: Add more experiments
\section{Experiments}

% After
% TODO: 添加更多实验
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

Before compiling, verify:

- [ ] All `.tex` files with content are translated
- [ ] All non-text files (images, bibfiles, styles) are copied
- [ ] LaTeX commands and environments unchanged
- [ ] Math formulas unchanged
- [ ] Labels and references unchanged
- [ ] File paths in `\input`, `\includegraphics` unchanged
- [ ] Document structure preserved (sections, subsections)
- [ ] Chinese text is natural and academically appropriate

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
