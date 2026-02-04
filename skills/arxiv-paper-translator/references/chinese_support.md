# Chinese Support Configuration

Add the following to the main .tex file preamble (before `\begin{document}`).

## Font Support

使用 Docker 编译时，Ask 用户选择字体方案：

**方案 A: Fandol（默认，学术正式风格）**
```latex
\usepackage{xeCJK}
\setCJKmainfont{FandolSong}[ItalicFont=FandolKai]  % 宋体 - 正文，\emph 用楷体
\setCJKsansfont{FandolHei}    % 黑体 - 标题、\textsf
\setCJKmonofont{FandolFang}   % 仿宋 - 代码、\texttt
```

**方案 B: 霞鹜文楷（开源，易读美观）**
```latex
\usepackage{xeCJK}
\setCJKmainfont{LXGW WenKai Lite}[ItalicFont=FandolKai]  % 霞鹜文楷 - 正文，\emph 用楷体
\setCJKsansfont{LXGW Marker Gothic}      % 霞鹜漫黑 - 标题、\textsf
\setCJKmonofont{FandolFang}              % 仿宋 - 代码、\texttt
```

以上字体均在推荐的 Docker 镜像（`xu-cheng/texlive-debian`）中预装。本地编译时可通过 `fc-list :lang=zh family` 查看可用中文字体。

## Localize Float Labels

```latex
\renewcommand{\figurename}{图}
\renewcommand{\tablename}{表}
\renewcommand{\abstractname}{摘要}
\renewcommand{\refname}{参考文献}
\renewcommand{\contentsname}{目录}
```

## Localize cleveref Names

If paper uses `cleveref` package:

```latex
\crefname{figure}{图}{图}
\Crefname{figure}{图}{图}
\crefname{table}{表}{表}
\Crefname{table}{表}{表}
\crefname{section}{章节}{章节}
\Crefname{section}{章节}{章节}
\crefname{algorithm}{算法}{算法}
\Crefname{algorithm}{算法}{算法}
\crefname{appendix}{附录}{附录}
\Crefname{appendix}{附录}{附录}
```

## Localize Theorem-like Environments

Find `\newtheorem` definitions (usually in preamble or .sty file) and replace display names:

```
Theorem → 定理
Proposition → 命题
Definition → 定义
Lemma → 引理
Corollary → 推论
Proof → 证明
```

## Remove Incompatible Packages

删除 `\usepackage[T1]{fontenc}`（如存在）。T1 是 pdfLaTeX 的 8-bit 字体编码，XeLaTeX 原生使用 Unicode，两者冲突会导致字体查找异常。

## Page Layout Fix

```latex
\raggedbottom
```

Prevents vertical stretching on pages with mixed CJK/math content.
