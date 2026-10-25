# D3 documentation gaps

Status: open evidence register for D3.1/D3.2.
Reviewed: 2026-10-25.

These gaps prevent D3 from overstating source observations as live-cluster facts. They do not block the source-qualified global architecture pages in this batch.

| Priority | Gap | Affected D3 claim | Safe evidence needed | Batch impact |
| --- | --- | --- | --- | --- |
| High | No checked-in Helm revision-19 values export, rendered manifest, or workload image-ID capture was available. Existing RC.8 records reference revision 18 and one explicitly says no upgrade was performed. | “Verified deployed in revision 19” | Redacted revision-19 values/manifest comparison and a read-only workload image/status capture | Keep all D3.2 deployment-sensitive claims **Implemented but not deployment-qualified**. Does not block D3.3 source-based flow work. |
| High | Source defines gateway routes, but no generated OpenAPI contract is checked in. | Complete public API reference or payload contract | Approved source-of-truth API spec or owner-reviewed curated route inventory | Do not generate an API reference in D3.2. |
| Medium | The RC.8 manifest proves image/source mapping, not registry publication or the image digest selected by a particular Pod. | Exact running-image provenance | Release publication record and workload image IDs | Avoid presenting image manifest success as a live rollout proof. |
| Medium | Current `scripts` HEAD is later than the recorded RC.8 source pin, and its worktree contains unrelated local changes. | Release-tool behavior at RC.8 | A clean, approved tool release reference or a new release snapshot | Cite `7bca9a5` for RC.8 tooling; describe later automation only as subsequent, non-baseline work. |
| Medium | Runtime service-to-service authorization and network-policy behavior is only partially visible in the global sources. | Complete internal authorization matrix | Service-owner review plus rendered/runtime policy evidence | D3.2 states the observed ingress/gateway and runner restrictions; it does not claim a universal service-mesh policy. |
| Medium | Log/metric configuration proves collection paths, not every metric, dashboard panel, alert response, retention guarantee, or on-call process. | Operational coverage/SLOs | Dashboard/export inventory and operator-owned runbook evidence | Observability page describes configured paths only. |
| Low | Historical reasons for microservices, the old Job-per-execution path, and persistent-runner selection are not recorded as decision records. | Original design intent or alternatives | Dated ADRs, issue/PR discussion, or owner review | Treat any rationale as present-day engineering interpretation, not historical fact. |
| Low | Browser/external OAuth dependency configuration is source-configurable, but D3.2 has no release-qualified provider/client configuration evidence. | A particular provider configuration is active | Redacted release configuration and owner approval | System context names external identity only conditionally and does not expose configuration values. |

## Resolution rule

Each future D3 page must either link to a row above or add a new row before making a stronger claim. A missing runtime artifact is not a reason to infer deployment behavior from a controller, Helm template, or image tag.

## Out of scope for this batch

- D3.3 request-flow pages and API route inventory.
- D3.4 service deep dives and owner sign-off.
- D3.5 lease algorithms, Lua transition details, full NsJail lifecycle, and performance claims.
- D4 operational procedures, cluster access instructions, and deployment commands.
