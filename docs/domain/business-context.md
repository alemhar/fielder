# Business Context · Fielder

## Overview
Fielder is a mobile-first app for field workers to capture and manage activity data in environments with unreliable connectivity.

## Core Use Cases
- Receive assigned activities for a given day or location.
- Record structured information for each activity (forms, checklists, tags).
- Capture photos and file uploads as evidence or attachments.
- Track time spent on activities (start/stop, durations).
- Take notes via text and (future) speech-to-text.
- Work offline, with automatic or manual sync to a backend when connectivity returns.

## Key Personas
- **Field User**: Performs activities in the field, often offline, needing fast, simple data entry.
- **Supervisor/Manager** (future backend/UI): Reviews completed activities, evidence, and time reports.

## Domain Constraints
- Must function reliably offline (no hard dependency on live network).
- Data integrity is critical: avoid duplicate or lost entries during sync.
- Attachments (photos/files) can be large; handle storage and upload efficiently.

## Open Questions
- Exact activity assignment model and backend ownership.
- Conflict resolution strategy when offline edits collide with server changes.
- Detailed access control and permissions model.
