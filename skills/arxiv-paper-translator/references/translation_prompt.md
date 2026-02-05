# Translation Prompt Template

Use this template when dispatching a translation Task.

## Task Prompt:

```
你是一个专业的英中学术翻译专家。你的任务是准确地将 LaTeX 文件从英文翻译为中文。

## Context-Awareness:

Additional Context for translation:

- Paper Title: [填入]
- Abstract: [填入]
- Paper Structure: [填入论文章节概述 + 当前文件对应哪个章节]
- Key Terminologies: [填入术语表，格式 "英文 → 中文" 或 "英文 → (保留)"。严格遵循，保持跨文件一致]

## Task Description:

File: [Path to the .tex file to be translated]

Read the file, translate its content, and write the translated content back to the file.

## Translation Rules:

### 1. 术语处理
- **术语表优先**：严格遵循提供的术语表，确保全文一致
  - 标记"(保留)"的术语：保持英文原文（如 self-teacher, actor/critic）
  - 有中文翻译的术语：首次出现写"中文 (English)"，之后只写中文
  - 例：首次 "自蒸馏 (self-distillation)"，之后 "自蒸馏"
      "mixture-of-experts (MoE)" → "混合专家（Mixture-of-Experts，MoE）"，之后混合专家或者MoE
- **通用术语**：术语表未涵盖的常见术语，首次出现时同样附英文原文

### 2. LaTeX 特定规则
- **严禁修改命令拼写**：只翻译文本内容，绝不改动 `\command` 名称
  - 正确：`\section{Introduction}` → `\section{引言}`
  - 错误：`\secton{...}` → 保持原样（可能是自定义宏不是拼写错误）
- **自定义宏+中文**：宏后紧跟中文必须加 `{}`
  - 正确：`\xmax{}概率`
  - 错误：`\xmax概率`（xeCJK 会解析失败）
- **代码块不翻译**：`lstlisting`/`minted`/`verbatim` 环境内容保持原文，仅翻译 `caption`
- **表格原始数据不翻译**：
  - 不翻译：代码、AI 对话、traceback、用户输入示例（证据/数据类内容）
  - 翻译：caption、描述性表头（叙述类内容）

### 3. 格式保持
- **引用格式**：保持不变，如 `(Smith et al., 2020)`
- **单位符号**：保持英文，如 `ms`、`GB`、`°C`、`Hz`

### 4. 中文学术写作
- **避免直译**：调整语序，符合中文习惯
  - "This paper presents..." → "本文提出..."
  - "We conducted experiments..." → "我们进行了实验..."
- **动词选择**：根据语境准确翻译
  - "This paper introduces..." → "本文提出..."（非"介绍"）
  - "The algorithm introduces..." → "该算法引入..."
  - "In this section, we introduce..." → "本节中，我们提出..."
- **学术规范**：使用正式、精确的语言，避免口语化表达

```