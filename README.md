# BIMCheck — real IFC wall material checks

This version reads IFC STEP contents with web-ifc 0.0.44. It counts entities derived from IfcElement and checks IfcWall, IfcWallStandardCase and IfcWallElementedCase for a named material, directly or through their assigned type. Material lists, layers, profiles, constituents and usage wrappers are followed.

Results include real Express IDs and Global IDs. Excel exports those same issues. The dashboard shows the latest real result rather than generated categories. A model with no walls is explicitly not applicable.

## Scope

This is a limited data quality check, not full IFC schema certification, geometry validation, dimensional validation or engineering/code compliance. A material association passes if at least one reachable IfcMaterial has a non-empty name. It does not establish the completeness or engineering suitability of a layered assembly. Files are processed in the browser; the latest result is stored locally when browser storage is available. Supported upload size: non-empty .ifc files up to 50 MB. Large files may temporarily block the UI.

## Run

- Install dependencies: `npm ci --ignore-scripts`
- Start: `npm start`, then open http://localhost:3000/
- Real parser integration tests: `npm run test:real`

Eight integration tests exercise real IFC data: missing/direct/inherited/layered materials, blank material names, no walls, malformed/truncated inputs and repeatability. The old Jest/Cypress tests describe the previous simulated application and need migration; their previous pass counts are not evidence for this implementation.

The three examples are minimal data-only IFC4 fixtures, not complete architectural models. Browser checks verified missing material and type-inherited material. Matching browser JS/WASM assets are vendored in src/vendor to avoid CDN version drift.

## Publish

Publish the src directory to the existing Netlify site after review. No GitHub push or Netlify production deployment has been made by this local change. Netlify may use the existing static configuration.

## 3D issue review

Use **View in 3D** on a finding or dashboard row. The browser keeps the latest analysed IFC in IndexedDB; the file is not sent to an external service. Each analysis has a unique ID, and stale links are rejected. Element Express IDs and Global IDs are verified against that same model before rendering.

The viewer highlights the selected wall, supports orbit/zoom/pan, focus, fit model, isolation and transparent context. Walls without renderable geometry show an explanatory message. Review does not modify the IFC or resolve issues automatically. WebGL and browser storage are required. A new analysis replaces the saved model; closing the browser may retain it in local storage.

`npm run test:3d` runs five additional real-parser tests covering geometry identity, distinct placements, invalid selection, GlobalId mismatch geometry-free data and composite-wall selection. The **Try 3D review example** button loads a minimal two-wall IFC with one material issue.

Rendering large models still runs on the main thread and can briefly block the UI. This first viewer does not include clipping, model editing, BCF export or arbitrary element picking. Three.js and OrbitControls are vendored from the installed package; see src/vendor/THREE-LICENSE.txt.

Browser verification also used the existing 03.ifc model (3,822 elements, 934 walls, four material findings). Composite walls were followed through IfcRelAggregates/IfcRelNests to highlight their geometry parts. Material validation remains scoped to the wall and its type, not the materials of decomposed parts.

## Local review notes

Each finding has Review notes, a human review status (Open / In review / Resolved), an explicit Save note button and a last-saved timestamp. Notes are keyed by analysis ID, Express ID and Global ID in browser localStorage. A new analysis starts a separate review; notes are not automatically transferred to a revised IFC. Notes are local, not collaborative, and are lost if browser site data is cleared. Export before replacing an analysis if you need its review record.

The dashboard displays saved statuses. Excel export on the dashboard and results page includes saved notes, status and UTC timestamp, read at export time. Unsaved edits are retained while switching elements in the current page and trigger a navigation warning. Resolved is a human review decision and does not change findings or prove a corrected IFC passes validation.

Run npm run test:reviews for six checks covering persistence, isolation, latest export data, validation, storage errors and text-safe Excel cells.

## Configurable checks and comparison

Project checks now allow enabling named material, classification reference code and Pset_WallCommon.FireRating independently, for walls. These are presence checks only: the app does not verify that a code or fire rating is suitable for the project, interpret normative requirements, or implement IDS. FireRating requires a non-empty string; an occurrence property overrides a type property. Classification reads IFC4 Identification or IFC2x3 ItemReference. Choices are remembered locally and frozen into each analysis result.

The dashboard compares its current analysis against one of up to 10 earlier local summaries. Matching uses GlobalId + rule, never Express ID. The selected rules and rule-engine fingerprint must match. Results distinguish new, persistent, no-longer-failing, removed/unmatched and ambiguous identities. A removed element is not a confirmed correction. The user must select revisions of the same model; changed GlobalIds cannot be tracked reliably. Only the latest model geometry is kept; older analysis summaries support comparison without retaining their IFC bytes.

Review notes now include Assignee (person/team text, no notifications) and are isolated by rule as well as analysis and element. Excel includes assignee and rule columns. Human Resolved status does not affect the automated version comparison. No server accounts, shared assignments, IDS import or BCF export have been added.

npm run test:workflow exercises the rule toggles, classification and property fixtures, comparison outcomes, rule mismatch, duplicate GlobalIds and assignee/rule isolation. The existing parser, geometry and review suites also pass (26 tests in total).

## Larger-file analysis

Information analysis now runs in a dedicated module Web Worker with a 100 MiB limit (104,857,600 bytes). Full 3D remains limited to 50 MiB, because geometry generation/rendering is a separate main-thread workload. Worker progress reports real stages and wall counts; the activity bar is indeterminate, not an estimated percentage. Cancel analysis terminates the worker; Retry selected file restarts from the beginning. Cancellation is available through computation and disabled during final result saving. Files above the 3D cap are not transferred back to the main page or saved for geometry. Rendering of finding lists starts with 100 entries and can be expanded in batches.

Tests on this computer used the real 03.ifc enriched with synthetic IFC property records to produce exactly 50, 75 and 100 MiB files. They preserve 3,822 elements, 934 walls and four material findings. Node parser timings were 0.59 / 0.57 / 0.75 seconds; peak process RSS across the sequential run rose to 884 MiB (not a browser measurement or per-file isolated peak). The 100 MiB browser worker completed in approximately 1.27 seconds with 26 main-page timer updates while running. Browser cancellation was also checked. These are synthetic parsing benchmarks, not a claim that every 100 MiB real model will run this quickly or fit memory on all devices. No larger-geometry benchmark was performed.

The four test:large checks cover limit boundaries, worker cancellation, progress/result cleanup and worker errors. Existing real parser, rule and review tests were rerun. Geometry stays unchanged. Large result persistence, Excel export and 3D can still be limited by device memory and browser storage; this change does not add a server or 200 MiB support.


## BCF 2.1 export

Use **Export BCF** on the dashboard or validation results to download all findings as a `.bcfzip` archive. In 3D review, save your note, optionally select **Capture snapshot**, and use **Export this finding as BCF**. Snapshots are stored in IndexedDB per analysis, element and check, and reused in dashboard exports. A new capture replaces the previous image for that finding.

Exports include one topic per finding, the IFC filename, GlobalId selection when valid, saved status, assignee and comment. Topic identifiers remain stable when exporting the same analysis and rule again. Authors are labelled BIMCheck / BIMCheck local review because this application has no authenticated user identity. Invalid GlobalIds are described explicitly without exporting a misleading component reference. The IFC itself is not embedded.

This initial version includes snapshots and component selections, **not camera coordinates**. The viewer recentres geometry; coordinate conversion needs separate interoperability validation before camera export. Files over 50 MiB can still export information findings without 3D images. Save edits before exporting. Human review statuses do not change automated findings. BCF import, server collaboration and IDS validation are not implemented.

Validation: `npm run test:bcf` tests ZIP round trips, XML escaping, saved review metadata, stable identity, separate rules, missing GlobalIds, snapshots and empty/error cases. Official buildingSMART BCF 2.1 schemas are in `tests/bcf-schemas`, sourced from https://github.com/buildingSMART/BCF-XML/tree/release_2_1/Schemas. Use `tests/validate-bcf.py` with Python/lxml to validate the generated archive. Desktop BIM application interoperability has not yet been verified.


## Guided first visit

Select **Take a guided demo** on the home page. Four stages use the real `geometry_review.ifc` fixture: analyse, understand the missing-material finding, locate and annotate the wall, then export BCF. Snapshot capture is optional. The demo uses only the material check without changing saved check preferences. Its model is stored under a separate IndexedDB key and is not written to the working dashboard or analysis history. Exit/restart controls remain available. Reloading restarts the guidance for the current page; saved review notes remain associated with that demo analysis. No public deployment is performed by this change.
