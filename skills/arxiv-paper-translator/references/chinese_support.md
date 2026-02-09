# Chinese Support Configuration

Add the following to the main .tex file preamble (before `\begin{document}`).

## Font Support

Using `xeCJK` package to support CJK characters. Choose one of the font schemes below.

**Option 1.** When using Docker to compile, ask user to select the font scheme:

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

以上字体均在推荐的 Docker 镜像（`xu-cheng/texlive-debian`）中预装。

**Option 2.** When compiling locally, query local font list and ask user to select the font:

本地编译时可通过以下命令查看可用中文字体：

```bash
fc-list :lang=zh family
```

特别注意，中文字体没有斜体，一般用**楷体**代替。


e.g.: 

```latex
\usepackage{xeCJK}
\setCJKmainfont{Songti SC}[ItalicFont=Kaiti SC]
\setCJKsansfont{Heiti SC}
\setCJKmonofont{PingFang SC}
```

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

## Custom Command for CJK Text

如果原文定义了自定义命令包裹 CJK 文本，修改为直接输出参数内容。避免与`xeCJK`冲突。

```latex
% custom command for CJK text
\chinese{一}
```

```latex
% before
\newcommand{\chinese}[1]{\begin{CJK*}{UTF8}{gbsn}{#1}\end{CJK*}}
% after
\newcommand{\chinese}[1]{#1}
```

## 引号改写

将原文中的引号 "" 替换为 `` 和 ''。或者直接用中文引号“”

e.g:

```latex
% before 原文，用英文引号""包裹
Traditional approaches typically follow a "train-then-compress" pipeline
% after 翻译，用``和''包裹
传统方法通常采用``先训练后压缩''的流程
% after 翻译 2，用中文引号“”包裹
传统方法通常采用“先训练后压缩”的流程
```
