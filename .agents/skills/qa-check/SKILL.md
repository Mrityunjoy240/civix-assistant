---
name: qa-check
description: Use this skill to run quality checks, fix bugs, verify the app works end-to-end, and check mobile responsiveness.
---

# Skill: QA Check

## Objective
Test the app, fix bugs, verify all core flows work, screenshot evidence of each.

## Checklist
- [ ] App loads without errors
- [ ] Core user flow works end-to-end
- [ ] Mobile view renders correctly (use browser dev tools)
- [ ] No console errors
- [ ] Environment variables are in .env not hardcoded
- [ ] Run: npm run build (or equivalent) — must pass without errors

## Output
Produce a QA_Report.md in production_artifacts/ listing each checklist item + PASS/FAIL
