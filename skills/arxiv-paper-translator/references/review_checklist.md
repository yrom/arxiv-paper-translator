# Translation Review Checklist

Spawn a reviewer subagent after all translation tasks complete. The reviewer executes the following checks.

## 1. File Completeness

```bash
# Verify all .tex files are translated
diff <(find ./paper_source -name "*.tex" -type f | sort) \
     <(find ./paper_cn -name "*.tex" -type f | sort)

# Verify all non-text files copied
diff <(find ./paper_source -type f ! -name "*.tex" | sort) \
     <(find ./paper_cn -type f ! -name "*.tex" | sort)
```

## 2. LaTeX Command Spelling

Detect misspelled commands introduced during translation (e.g. `\footnotetext` → `\footnotext`):

```bash
diff <(grep -ohrIE '\\[a-zA-Z]+' paper_source/ | sort -u) \
     <(grep -ohrIE '\\[a-zA-Z]+' paper_cn/ | sort -u) | grep '^>'
```

Right-side-only commands are suspicious. Verify each one — if not intentionally added (e.g. `\figurename`, `\setCJKmainfont`), it's likely a typo.

## 3. CJK Catcode Issue

Find custom macros directly followed by CJK characters (missing `{}`):

```bash
grep -rnE '\\[a-zA-Z]+[一-龥]' paper_cn/ --include='*.tex'
```

Each match needs `{}` inserted between macro and CJK text. Background: `xeCJK` sets CJK characters to catcode 11 (letter), so `\xmax概率` is parsed as one undefined command `\xmax概率` instead of `\xmax` + `概率`.

## 4. Content Spot-Check

For each .tex file, compare with source to verify:

- [ ] `\thanks{...}`, `\footnote{...}`, `\footnotetext{...}` content translated
- [ ] All section/subsection titles translated
- [ ] Figure and table captions translated
- [ ] LaTeX commands and math formulas unchanged
- [ ] File paths (`\input`, `\includegraphics`) unchanged
- [ ] Labels and references (`\label`, `\ref`, `\cite`) unchanged
