# Translation Review Checklist

## 1. File Completeness

- Verify all .tex files are tranlated or copied (skip files that are not translated)
```bash
diff <(cd paper_source && find . -name "*.tex" -type f | sort) \
     <(cd paper_cn && find . -name "*.tex" -type f | sort)
```
- Verify all non-text files copied correctly
```bash
diff <(cd paper_source && find . -type f -not -name "*.tex" | sort) \
     <(cd paper_cn && find . -type f -not -name "*.tex" | sort)
```

## 2. LaTeX Command Spelling

Detect misspelled commands introduced during translation (e.g. `\footnotetext` → `\footnotext`):

```bash
diff <(cd paper_source && grep -ohrIE '\\[a-zA-Z]+' | sort -u) \
     <(cd paper_cn && grep -ohrIE '\\[a-zA-Z]+' | sort -u) \
     | grep '^>'
```

Right-side-only commands are suspicious. Verify each one — if not intentionally added (e.g. `\figurename`, `\setCJKmainfont`), it's likely a typo.

## 3. CJK Catcode Issue

Find custom macros directly followed by CJK characters (missing `{}`):

```bash
grep -rnE '\\[a-zA-Z]+[一-龥]' paper_cn/ --include='*.tex'
```

Each match needs `{}` inserted between macro and CJK text. Background: `xeCJK` sets CJK characters to catcode 11 (letter), so `\xmax概率` is parsed as one undefined command `\xmax概率` instead of `\xmax` + `概率`.

## 4. Terminology Consistency Check

For each .tex file, verify:

- [ ] Key terms translated consistently across all files
- [ ] First mention of key terms includes both English and Chinese
- [ ] Technical terms follow established terminology table
- [ ] Proper nouns (Agent Swarm, PARL, MoonViT-3D) handled correctly
- [ ] Acronyms first appear with full name + acronym (e.g., "强化学习 (Reinforcement Learning, RL)")

## 5. Translation Quality Check

For each .tex file, verify:

- [ ] Chinese expression is natural and fluent (avoiding direct translation artifacts)
- [ ] Academic language style is maintained throughout
- [ ] Sentence structures follow Chinese expression patterns
- [ ] Key verbs translated appropriately
- [ ] No colloquial expressions or overly casual language
- [ ] Technical descriptions are precise and professional

## 6. Content Spot-Check

For each .tex file, compare with source to verify:

- [ ] `\thanks{...}`, `\footnote{...}`, `\footnotetext{...}` content translated
- [ ] All section/subsection titles translated
- [ ] Figure and table captions translated
- [ ] LaTeX commands and math formulas unchanged
- [ ] File paths (`\input`, `\includegraphics`) unchanged
- [ ] Labels and references (`\label`, `\ref`, `\cite`) unchanged
