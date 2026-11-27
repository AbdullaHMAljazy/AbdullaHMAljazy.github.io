// Text of the hub page (courses55/index.html) and the shared footer.
export default {
  updated: "27 November 2026",
  subtitle: "Two-term self-study courses in the format of Harvard's Math 55, built entirely from free resources",
  lead: "Each course takes the structure that makes Harvard's Math 55 work, a weekly problem set that carries most of the weight, two midterms and a final each term, and a fast, steady pace, and applies it to a different area of mathematics. Every week lists the topics, a free reading and, where useful, a video or a computation.",
  format: [
    "**Two terms of 13 weeks**, about three lectures' worth of reading or video a week.",
    "**A weekly problem set** of 8–10 problems, written up in full in LaTeX. In the Harvard course it carries about two thirds of the grade; here it is the course itself.",
    "**Two midterms and a final each term**, timed and closed-book, built from problems you have not seen.",
    "**Only free resources**: authors' own notes and books, open courseware, arXiv. Paid textbooks are named only for comparison.",
    "**A project** at the end of the advanced courses: a 10–20 page exposition or research draft.",
  ],
  orderIntro: "Math 55 (or an equivalent undergraduate education) comes first. After that the courses split into two lines that can run in parallel: an analytic line (ANT 55 with Prob 55) and an arithmetic–geometric line (AlgNT 55, then Modular 55; AG 55 independently).",
  order: {
    head: ["Course", "Start after", "Length", "Runs well with"],
    rows: [
      ["[Math 55](math55.html)", "Proof-based calculus", "26 weeks (about 16 on the compressed path)", "—"],
      ["[ANT 55](ant55.html)", "Math 55b (complex analysis)", "27 weeks", "Prob 55"],
      ["[Prob 55](prob55.html)", "Math 55b (real analysis)", "26 weeks", "ANT 55"],
      ["[AlgNT 55](algnt55.html)", "Math 55a (algebra)", "26 weeks", "ANT 55 or AG 55"],
      ["[Modular 55](modular55.html)", "AlgNT 55a and Math 55b", "26 weeks", "ANT 55b"],
      ["[AG 55](ag55.html)", "Math 55a; smooth manifolds for term b", "26 weeks", "AlgNT 55"],
    ],
  },
  orderNote: "At about 20 hours a week, one course takes half a year per term. Two courses in parallel need 35–40 hours a week. Nobody needs all six before starting research: learn a tool when a problem calls for it.",
  disclaimer: "These are independent self-study plans by Abdullah M. Al-jazy, inspired by the format of Harvard's Math 55. They are not affiliated with or endorsed by Harvard University or by any institution whose materials are linked; all linked materials belong to their authors.",
};
