# PM Acceptance Criteria Generator

A frontend tool that formats feature requirements into a Given / When / Then acceptance criteria draft.

協助 PM 將功能需求整理為驗收條件草稿，作為與工程、設計及 QA 討論的起點。

This portfolio project demonstrates a focused product workflow: collecting requirement context, validating input, and presenting a draft that users can review and copy.

The generator uses a fixed, rule-based template. It does not use AI, call external APIs, or analyze the meaning of requirements.

## Features

- Capture a feature name, user role, original requirement, platform, and optional constraints.
- Generate one Given / When / Then draft from the submitted values.
- Require a feature name, user role, and original requirement, with whitespace-only input rejected.
- Render user-provided content as text using `textContent` and `createTextNode`, so it is not interpreted as HTML.
- Copy the latest draft as plain text, with progress, success, and failure feedback.
- Support responsive layouts and system light/dark preferences.
- Provide labeled form fields, visible keyboard focus, and live status announcements.

The interface and generated draft text are currently in Traditional Chinese.

## How It Works

After trimming leading and trailing whitespace and validating required fields, the tool maps the input into a fixed structure:

| Output | Source |
| --- | --- |
| Feature title | Feature name |
| Given | User role, selected platform, and optional constraints |
| When | A fixed sentence describing the user operating the named feature |
| Then | The original requirement, preserved as entered after trimming |

Available platform options are Web, iOS / Android App, and Unity / VR. The selection changes the platform label in the draft; it does not generate platform-specific scenarios.

The output is a starting point for review. Users still need to clarify expected behavior, measurable outcomes, and missing scenarios.

## Product Decisions

- The current MVP uses deterministic rules to keep the output transparent, predictable, and free from API cost.
- Copying uses the latest successfully generated draft rather than unsubmitted form edits, so the copied text always matches the visible result.
- User input is inserted through text-only DOM APIs to prevent it from being interpreted as executable HTML.

## Tech Stack

- Vanilla JavaScript with ES modules
- HTML5 and CSS, including Grid and media queries
- Vite 8 for local development and production builds
- Browser APIs: DOM, FormData, Constraint Validation, and Clipboard

There is no backend or AI service integration.

## Getting Started

### Prerequisites

- Node.js 20.19+ within the 20.x release line, or Node.js 22.12+
- npm

### Run Locally

From the repository directory:

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite in your terminal.

### Build and Preview

```bash
npm run build
npm run preview
```

The build command generates production files in `dist/`. The preview command serves that build locally.

## Current Limitations

- Generates a single template-based scenario per submission.
- Does not interpret requirements, resolve ambiguity, or generate missing edge cases.
- Uses the original requirement as the Then statement, which may still need rewriting into a testable outcome.
- Treats additional constraints as text; it does not validate their business rules.
- Does not save drafts or provide history; refreshing the page clears the current input and result.
- Clipboard copying depends on browser support and permissions and generally requires HTTPS or localhost. If copying fails, users can select and copy the result manually.
- No automated test suite is currently configured.

## Next Steps

Potential improvements, not yet implemented:

- Refine the template to better distinguish user actions from observable outcomes.
- Add structured support for success, error, and boundary scenarios.
- Add automated checks for validation, text rendering, and clipboard feedback.
- Gather feedback from PM and QA users to improve field guidance and draft usefulness.
