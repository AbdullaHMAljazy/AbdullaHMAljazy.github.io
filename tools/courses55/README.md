# 55 Courses — page generator

The pages in `/courses55` are generated from the files in `data/`.
Edit the data, then rebuild:

```sh
cd tools/courses55
npm install      # once: installs KaTeX
node build.mjs   # writes /courses55/*.html, the stylesheet and the KaTeX fonts
```

- One file per course in `data/` (`math55.mjs`, `ant55.mjs`, …); the hub page text is in `data/hub.mjs`.
- In any text field: `$...$` for inline LaTeX, `$$...$$` for display LaTeX, `[text](url)` for links, `**bold**`, `*italic*`.
- Rows of a term table whose topic contains `**Midterm` or `**Final` are highlighted as exam weeks.
- To add a course, create `data/<id>.mjs` with the same fields as the others and add it to `COURSES` in `build.mjs`.
- `courses55.css` here is the source of the stylesheet; the build copies it into `/courses55`.
