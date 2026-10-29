---
paths:
  - "src/features/**/README.md"
  - "src/features/**/docs/**/*.md"
  - "docs/**/*.md"
---

# Feature docs

A feature doc states what the feature does today, or what it must do once the current change ships. It is always current. It is never a history.

## Writing rules

- Write in the present tense, as the current truth.
- No dates, no status fields, no changelog, no "previously" or "updated" notes. Git keeps the history.
- Change a requirement by rewriting it in place.
- Delete behaviour that is removed. Do not mark it deprecated.
- Every decision sits next to the requirement it shapes, with its reason.
- Future work goes only in the `Planned` section. When it is built, move it into the sections above.
- One file per capability, named after it in kebab-case, for example `loan-payments.md`.
- A doc is written only after every open question is answered. It has no open questions section.

## README.md

Orientation only. Never repeat requirements from `docs/`.

1. **Purpose**: two or three sentences on what the feature is for.
2. **Routes**: the page URL and the API endpoints it calls.
3. **Files**: the entry files and what each `_shared/` folder holds.
4. **Docs**: a link to each file in `docs/`, with one line on what it covers.

## docs/<capability>.md

1. **Purpose**: what this capability lets the user do.
2. **Requirements**: numbered, each one specific enough to check against the code.
3. **Data**: sheet tab name, range, and each column in order with its format.
4. **Decisions**: each rule that is not obvious, with its reason.
5. **Edge cases**: empty sheet, missing values, invalid input, failed requests.
6. **Planned**: agreed future work that is not built yet. Omit the section when empty.
