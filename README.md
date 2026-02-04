# arXiv 论文翻译SKILL

这是一个用于将 arXiv 论文翻译为**中文**的 Agent SKILL。

> Skills follow the [Agent Skills](https://agentskills.io/) format.

## 前置条件（二选一）

1. 可以运行 `xelatex` 工具用于编译 LaTeX 文档。
2. **或者** 可以执行 `docker`， 使用 [TeXLive Docker 镜像](https://github.com/xu-cheng/latex-docker)来编译 LaTeX 文档。

> 如何在你电脑上安装这些工具请问你的AI助手😄 

## 使用方法

安装这个SKILL：

```sh
npx skills add yrom/arxiv-paper-translator
```

在你的AI助手中使用它， e.g.：

```md
> Use arxiv paper translator SKILL. 翻译arXiv的论文为中文，ID 为：2601.20245

> /arxiv-paper-translator 翻译arXiv:2601.20802 为中文，同时整理核心观点输出一份中文博客用于分享
```

## LICENSE

MIT
