# Campaign Launchpad — Functional Scope Map

> **Scenario fittizio ESI.**

## Capabilities

### Template Catalog

Responsibility:

```text
expose approved campaign templates
```

Not responsible for:

```text
arbitrary plugin execution
brand-source ownership
```

### Campaign Draft

Responsibility:

```text
create/edit a draft within template constraints
```

### Preview

Responsibility:

```text
render a non-public preview of the current draft
```

### Approval

Responsibility:

```text
record approve/reject decision for a specific version
```

Rule:

```text
approval is version-specific
```

Changing content after approval creates a new version requiring new approval.

### Publication

Responsibility:

```text
publish an approved immutable version
```

### Rollback / Unpublish

Responsibility:

```text
remove public availability
or restore a previously approved publication version
```

## Actors and permissions

| Actor | Create/Edit | Approve | Publish | Public Read |
|---|---:|---:|---:|---:|
| Marketing Author | yes | no | yes, approved only | yes |
| Marketing Approver | read/review | yes | optional by policy | yes |
| Public Visitor | no | no | no | yes |

The exact separation between Approver and Publisher remains an ESI policy decision and may be tightened later.

## Main journey

```text
Author
→ template
→ draft v1
→ preview
→ submit
→ Approver approves v1
→ publish v1
→ public artifact v1
```

Change after publication:

```text
edit
→ draft v2
→ approval required again
```

Rollback:

```text
public v2
→ rollback
→ previous approved v1
```

## Business invariants

```text
published version must be approved
approval belongs to exact content version
public path cannot modify campaign state
publication history remains traceable
rollback target must be previously approved
```

## Open functional questions

```text
Can the same person approve and publish?
Is approval mandatory for all environments/campaign classes?
How long must publication history be retained?
Who owns emergency unpublish authority?
```

These remain open until Product/Marketing/Security policy decides them.

Do not let the implementation silently choose them.
