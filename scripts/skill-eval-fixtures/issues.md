# Fixture: issues — realistic task for the issues skill

The user says: "turn this plan into trackable issues":

> Feature: CSV export for the reports page.
> - Backend: add GET /reports/export.csv that serializes the current report
>   query results to CSV (needs a new serializer + a route).
> - Frontend: add an "Export CSV" button to the reports page that hits the
>   endpoint and downloads the file.
> - Docs: update the user guide with the export flow.
> - Tests: cover the endpoint and the button.
>
> Tracker is beads (bd). Repo has CI on `just check`.

Respond as you would in a live session: the issue breakdown you would create
and the exact commands you would propose. This is a simulation — do not
actually run any commands.
