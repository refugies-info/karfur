# Widget Workflows - Test Documentation

This document consolidates the test scenarios for all widget-related workflows. These READMEs are kept to record the original intent of previously existing tests, helping maintainers understand the expected behavior of each workflow.

## Table of Contents
- [getWidgets](#getwidgets)
- [postWidgets](#postwidgets)
- [patchWidget](#patchwidget)
- [deleteWidget](#deletewidget)

---

## getWidgets

### Test Scenarios

| # | Test Description | Expected HTTP Status | Purpose |
|---|------------------|----------------------|---------|
| 1 | Should return **405** if not from site | 405 Method Not Allowed | Reject any request not flagged as coming from the public site. The `checkRequestIsFromSite` helper throws `NOT_FROM_SITE`. |
| 2 | Should return **403** if not admin | 403 Forbidden | Ensure non-admin users cannot fetch widgets. The `checkIfUserIsAdmin` helper throws `NOT_AUTHORIZED`. |
| 3 | Should return **200** | 200 OK | **Happy path:** Admin users can retrieve widgets. Verifies `getAllWidgets` is called and returns 200. |

---

## postWidgets

### Test Scenarios

| # | Test Description | Expected HTTP Status | Purpose |
|---|------------------|----------------------|---------|
| 1 | Should return **405** if not from site | 405 Method Not Allowed | Reject any request not flagged as coming from the public site. |
| 2 | Should return **403** if not admin | 403 Forbidden | Ensure non-admin users cannot create widgets. |
| 3 | Should return **400** if no name | 400 Bad Request | Validate the payload includes a `name` field. |
| 4 | Should return **400** if no theme | 400 Bad Request | Validate at least one `theme` is provided. |
| 5 | Should return **400** if no `typeContenu` | 400 Bad Request | Validate at least one `typeContenu` is provided. |
| 6 | Should return **200** | 200 OK | **Happy path:** Admin users can create a widget. Verifies `createWidget` is called with correct arguments. |

---

## patchWidget

### Test Scenarios

| # | Test Description | Expected HTTP Status | Purpose |
|---|------------------|----------------------|---------|
| 1 | Should return **405** if not from site | 405 Method Not Allowed | Reject any request not flagged as coming from the public site. |
| 2 | Should return **403** if not admin | 403 Forbidden | Ensure non-admin users cannot update widgets. |
| 3 | Should return **400** if no id | 400 Bad Request | Validate the request contains a valid widget `id` parameter. |
| 4 | Should return **200** | 200 OK | **Happy path:** Admin users can update a widget. Verifies `updateWidget` is called correctly. |

---

## deleteWidget

### Test Scenarios

| # | Test Description | Expected HTTP Status | Purpose |
|---|------------------|----------------------|---------|
| 1 | Should return **405** if not from site | 405 Method Not Allowed | Reject any request not flagged as coming from the public site. |
| 2 | Should return **403** if not admin | 403 Forbidden | Ensure non-admin users cannot delete widgets. |
| 3 | Should return **400** if no id | 400 Bad Request | Validate the request contains a widget ID. |
| 4 | Should return **200** | 200 OK | **Happy path:** Admin users can delete a widget. Verifies `deleteWidgetById` is called with the correct ID. |

---

## Using These Scenarios

These test scenarios serve as a starting point for rebuilding proper end-to-end or unit tests. Each scenario documents the expected behavior and validation rules for the widget workflows.

When implementing new tests, consider:
1. The authorization requirements (admin access)
2. Input validation rules
3. Success and error conditions
4. Integration with the database layer
