---
name: write-specs
description: Use this skill when the user wants to create a technical specification, plan the architecture, or define what to build before coding starts.
---

# Skill: Write Technical Specification

## Objective
Turn the raw challenge prompt into a rigorous technical specification. Pause for user approval before any code is written.

## Rules of Engagement
- Output the final specification to `production_artifacts/Technical_Specification.md`
- Include: Problem statement, user stories, tech stack choices, API design, data schema, component tree
- Identify 3 alternative problem interpretations and explain which you chose and WHY
- You MUST pause and ask: "Do you approve this specification? Any changes?"
- Do not proceed to building until you receive explicit approval.
