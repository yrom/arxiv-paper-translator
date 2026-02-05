# arXiv 论文翻译SKILL

这是一个用于将 arXiv 论文翻译为**中文**的 Agent SKILL。

> Skills follow the [Agent Skills](https://agentskills.io/) format.

## Features

- 下载指定 arXiv 论文的 LaTeX 源代码
- **保留原始的样式**: 基于原始的 LaTeX 进行翻译, 编译PDF 可以保留原始的样式和格式。
- **可以指定翻译的章节**: 你可以在Agent执行翻译时指定要翻译的章节，而不是整个论文。

### 翻译结果示例：

<table>
  <tr>
    <td>
      <img width="516" alt="original" src="https://github.com/user-attachments/assets/f727d06a-580a-48b8-87aa-a2eae34d146c" />
    </td>
    <td>
      <img width="516"  alt="translated" src="https://github.com/user-attachments/assets/a75551c7-eb07-4211-a1fd-548739e4a771" />
    </td>
  </tr>
  <tr>
    <td>
      <img width="533" alt="original" src="https://github.com/user-attachments/assets/5bf1604c-51d7-4912-82a2-500cbbcf8907" />
    </td>
    <td>
      <img width="533" alt="translated" src="https://github.com/user-attachments/assets/a72ab10f-f418-484a-bc13-e6cf4e72095f" />
    </td>
  </tr>
</table>

> [!NOTE]
> 如果你需要的是**PDF 文件**翻译，推荐你直接使用 [PDFMathTranslate](https://github.com/PDFMathTranslate/PDFMathTranslate)


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

> 翻译arxiv:2602.02276 为中文。跳过附录（Appendix）、还有实验eval部分不用翻译。

> /arxiv-paper-translator 翻译arXiv:2601.20802 为中文，同时整理核心观点输出一份中文博客用于分享
```

## LICENSE

MIT
