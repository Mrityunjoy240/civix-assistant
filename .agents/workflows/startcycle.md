# Title: Start Build Cycle
# Description: Runs the full PM → Spec → Build → QA pipeline for a new challenge.

Step 1: Read the challenge prompt the user provides carefully. Activate the write-specs skill to produce Technical_Specification.md. Pause for user approval.

Step 2: Once approved, activate the build-feature skill. Build the full app against the approved spec. 

Step 3: Once the build is complete, activate the qa-check skill. Run all QA checks and produce QA_Report.md.

Step 4: Open the browser, navigate to the local running app, take a screenshot of the working product. Save it to production_artifacts/screenshots/.

Step 5: Report completion with: live preview URL, QA Report summary, list of deviations from spec.
