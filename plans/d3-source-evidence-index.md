# D3 source-evidence index

Status: active evidence register for D3.1/D3.2.  
Release scope: `v1.0.0-rc.8`.  
Reviewed: 2026-10-25.

This index is deliberately small: it records the release-qualified sources needed to review the global architecture pages. It is not an API inventory, a substitute for a live-cluster inspection, or a copy of application configuration.

## Status vocabulary

| Status | Use in D3 pages |
| --- | --- |
| **Verified deployed** | A release record and source evidence identify the behavior as active in the documented release. |
| **Implemented but not deployment-qualified** | Source and usually tests exist, but the available release material does not prove it is live. |
| **Legacy/fallback** | Retained compatibility code that is not on the documented default route. |
| **Historical** | A prior release or architecture, identified with its own evidence. |
| **Planned** | A proposed capability only. |

“Verified” in a page frontmatter means the cited source artifact was reviewed. It does not turn source inspection into a capacity, availability, or universal security guarantee.

## RC.8 source and image baseline

| Domain | Repository and immutable source | Release/image evidence | D3 use | Confidence |
| --- | --- | --- | --- | --- |
| Browser UI | `frontend` `c859bc68bd6d9f0f4a8c08507ed259b871ee2fb0` | `release-manifests/v1.0.0-rc.8/images.tsv`, `frontend` row | Browser boundary and runtime configuration | High |
| Gateway | `AlgoCrack-APIGateway` `e61d5fd86b116119e59c0536cdc88953d3510cc7` | manifest `api-gateway` row | Route groups and JWT filter placement | High |
| Identity | `AlgoCrack-AuthService` `ba9f759dec60307b3ebb376644df3282940401b2` | manifest `auth-service` row | Account/authentication data boundary | High |
| Problems | `AlgoCrack-ProblemService` `0bd8c3e0bb6850d4635db4bbea8bdf15bbc980d3` | manifest `problem-service` row | Catalogue, lists, profile and daily-challenge data boundary | High |
| Submissions | `AlgoCrack-SubmissionService` `fddf3d52b709b2bacc476898893e651dfadf0fba` | manifest `submission-service` row | Submission, progress and Playground ingress boundary | High |
| Execution API and runner | `CodeExecutionEngine` `c8e9c069e384d56a5ba3a01e370188db88ec05ba` | manifest `code-execution-engine` and `cxe-nsjail-runner` rows | v2 orchestration, runner and retained fallback boundaries | High |
| Edge WAF | `docker` `a53641c5bde32fe75e238a2ef598da28da95ba8b` | manifest `waf` row | WAF placement only; detailed rules are intentionally not published here | High |
| Deployment contract | `helm` `f32b8db734b111e3e3c1acce636e90f068dcd0d9` | `context/releases/final_rc_preparation.md` and rendered-release checks | Ingress, workload and observability topology | High for source topology; see deployment gap |
| Earlier manifests | `k8s` `2daf89537125d623fdc06fb525bcc4048f38c3a2` | repository README | Historical Kustomize material; not the RC.8 Helm contract | High |
| Release/developer tooling | `scripts` `7bca9a53194e558ec0fe731e27c06e4b4830c0d9` | RC.8 preparation record | Validation and image-release tooling context | High |

The checked-in image manifest contains eight `VERIFIED` `linux/amd64` image rows, including separate CXE orchestrator and persistent-runner images built from the same source commit. It records source repository, source SHA, Dockerfile/build context, image role, and manifest digest. D3 pages cite those roles instead of reproducing digests.

## Claim-to-evidence map

| Claim area | Primary evidence | Supporting evidence | Status used in D3.2 |
| --- | --- | --- | --- |
| `/` is served by the frontend and `/api` is sent to the WAF | `helm/algocrack/values.yaml`, `algocrack/templates/ingress.yaml` at `f32b8db` | Frontend route/API-client sources | Implemented but not deployment-qualified for the asserted RC.8 runtime; source topology verified |
| Gateway owns public-versus-JWT route selection | `AlgoCrack-APIGateway/src/main/resources/application.yml` at `e61d5fd` | Frontend clients and domain controller mappings | Implemented but not deployment-qualified |
| Auth, Problem and Submission own `auth_db`, `problem_db`, and `submission_db` | Helm MySQL database names plus each service datasource/Flyway configuration at the pinned commits | Migration directories | Implemented but not deployment-qualified |
| Submission delegates execution to CXE; CXE can publish a persistent task | Submission/CXE controller and adapter sources at `fddf3d5`/`c8e9c06` | RC.8 gate report and runner image row | Implemented but not deployment-qualified |
| A runner reads Redis v2 work and launches a fresh NsJail compile/run process | `CodeExecutionEngine/nsjail-runner/**`, `Dockerfile.runner.packaged` at `c8e9c06` | runner/atomic-move/Playground test entries in the RC.8 gate record | Implemented but not deployment-qualified |
| The legacy queue/Job and local-process paths remain | CXE routing/application sources at `c8e9c06` | RC.8 known-limitation record | Legacy/fallback |
| Prometheus scrapes actuator metrics; Alloy forwards Kubernetes logs to Loki; Grafana is provisioned with both sources | `helm/algocrack/templates/monitoring.yaml` at `f32b8db` | `docs/observability/**` | Implemented but not deployment-qualified |

## Release-record reconciliation

The D3.1 prompt names Helm revision **19** as the authoritative runtime baseline. The checked-in release evidence available to this documentation task says something different:

| Evidence | What it establishes | What it does not establish |
| --- | --- | --- |
| `context/releases/final_rc_preparation.md` | A read-only reference to Helm revision **18** and a local RC.8 image/build/gate record | That revision 19 was installed with the same values and image digests |
| `context/releases/rc8-kubernetes-deployment-preflight.md` | A proposed RC.8 image upgrade and expected unchanged topology | That the proposed upgrade was applied |
| `release-manifests/v1.0.0-rc.8/images.tsv` | Eight image/source mappings marked `VERIFIED` | The image IDs used by a specific running workload |
| `scripts` current `a2b74d9` | Later eight-image release automation and README guidance | A replacement RC.8 source baseline or a Helm upgrade; it is after the recorded `7bca9a5` pin |

Therefore D3.2 calls the diagrams **RC.8 source-qualified architecture** and marks deployment-sensitive pages `partial`. A Helm revision-19 values/manifest export plus workload image IDs can upgrade these statements to **Verified deployed** without changing the diagrams themselves.

## Reusable page evidence block

Use this compact format beside release-sensitive diagrams:

| Evidence | Record |
| --- | --- |
| Release | `v1.0.0-rc.8` |
| Source | `repository` at full SHA, `relative/path` |
| Supporting check | Named release record or test, if available |
| Status | One of the vocabulary labels above |
| Limitation | The exact missing runtime/deployment evidence, if any |

Never include credentials, raw user source, WAF exclusions, private manifests, or operational bypass procedures in an evidence block.
