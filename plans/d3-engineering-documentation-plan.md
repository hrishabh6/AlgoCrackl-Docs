# D3 engineering documentation plan

Status: planning artifact only. It does not create the D3 pages, generate an API reference, change application repositories, or change the RC.8 release.

Baseline: `v1.0.0-rc.8`, captured on 2026-10-25. D3 must use release-pinned source and validation evidence rather than a running Kubernetes cluster. The exact source pins are recorded in workspace release evidence at `context/releases/final_rc_preparation.md`; public docs should carry repository-relative path and commit SHA, not local filesystem links.

## 1. Goal and information architecture

D3 turns the current architecture overview into an engineering knowledge base for contributors, backend engineers, architecture reviewers, and maintainers. It follows the learning path below. It does **not** replace the D2 user guides or duplicate D4 operator runbooks.

```text
Introduction
  -> global architecture
  -> request and data flows
  -> service guides
  -> Code Execution Engine deep dive
  -> architectural decisions
  -> contributor setup and test strategy
  -> links to operations material owned by D4
```

### Proposed D3 site map

```text
Architecture
  System context (C4 L1)
  Container architecture (C4 L2)
  HTTP ingress and authentication boundary
  Data ownership and persistence
  Execution coordination and security boundary
  Observability architecture
  End-to-end flows
    Login and session establishment
    Problem retrieval and catalogue filters
    Run with visible/custom cases
    Official Submit and trusted oracle
    Playground run and snippet persistence
    Daily challenge and streak update
    Progress, rank, badge, and leaderboard update
    Saved list actions
    Error and timeout propagation

Services
  Frontend
  API Gateway
  Auth Service
  Problem Service
  Submission Service
  Code Execution Engine orchestrator
  Persistent NsJail runner
  Supporting infrastructure
    WAF and ingress
    Redis coordination
    MySQL ownership and Flyway boundary
    Helm topology and observability links

Execution engine
  Why persistent execution replaced Job-per-execution on the RC.8 path
  CXE and runner responsibilities
  Redis v2 task lifecycle
  Leasing, recovery, idempotency, and cancellation
  NsJail compile/run lifecycle and limits
  Submit and trusted-oracle evaluation
  Playground execution differences
  Failure taxonomy and retained fallback paths
  Security assumptions and measurement limits

Decisions
  ADR guide and candidate index
  Retrospective decision records

Build and contribute
  Repository map and ownership
  Native Linux setup and local workflow
  Configuration and OAuth boundary
  Build, test, fixtures, and migrations
  Documentation contribution and evidence policy
```

The sidebar should retain nested folders and short entry pages. Service pages should cross-link to their flow, API/route inventory, data ownership, test strategy, and only the diagrams necessary to understand their boundary.

## 2. Documentation status and evidence rules

Every substantive D3 page must have the existing docs frontmatter plus a nearby evidence table for higher-risk claims. Use one of these labels in prose:

| Label | Meaning |
| --- | --- |
| Verified deployed | Release evidence and source identify the behavior as active in RC.8. |
| Implemented, not deployment-qualified | Source/test evidence exists, but the RC.8 release record does not establish it as active. |
| Legacy/fallback | Retained code not on the documented RC.8 default route. |
| Historical | A prior architecture or release; identify version/date and evidence. |
| Planned | A proposal only; never word it as a present capability. |

For each diagram and non-obvious claim, capture: repository, full SHA, relative path, applicable test/release record, confidence, and review date. Do not state throughput, production traffic, security guarantees, or historical design intent if the source only proves code structure.

## 3. Global architecture pages and diagram inventory

| Page | Diagram type | Reader question | Evidence starting point |
| --- | --- | --- | --- |
| System context | C4 L1 | Who uses AlgoCrack and what external/trust boundaries matter? | `helm` `f32b8db`, ingress; `frontend` `c859bc6`, routes; gateway config. |
| Container architecture | C4 L2 | Which deployables, data stores, and communication paths make up RC.8? | Helm templates/values at `f32b8db`; release preparation §2. |
| Deployment topology | Deployment | Which workloads sit behind ingress, and where do Redis/MySQL/runner boundaries lie? | Helm templates at `f32b8db`; D4 owns operational rollout detail. |
| API ingress/auth | Data flow + sequence | How does a browser API request cross WAF, gateway, JWT, and a domain service? | Gateway `application.yml` `e61d5fd`; WAF config/release record. |
| Data ownership | Ownership diagram | Which MySQL schema/service owns canonical records versus Redis coordination state? | service configurations/Flyway plus Helm and CXE sources. |
| Execution trust boundary | Security diagram | Which process handles untrusted code and what must it not own? | runner/CXE boundaries at `c8e9c06`; Phase 6/7 evidence. |
| Observability architecture | Data flow | How do structured logs/metrics reach Prometheus/Loki/Grafana? | `docs/observability/**`, Helm observability settings, logging schema. |

Each diagram must have a concise explanatory page section, source/release context, and links to the deeper service or flow page. Keep container, deployment, and security diagrams separate rather than using one oversized architecture graphic.

## 4. Service documentation requirements

Every service page must cover responsibility/owned domain, relevant modules, public/internal boundary, owned data, configuration categories, request lifecycle, external dependencies, error propagation, security responsibilities, observability, tests, extension points, and known limitations. The purpose is architectural orientation—not class-by-class API extraction.

| Service/page | Primary source evidence | Required HLD/LLD focus | Special evidence questions |
| --- | --- | --- | --- |
| Frontend | `frontend` `c859bc6`, `src/app/**`, `src/lib/api/**`, `src/app/runtime-config/route.ts` | App Router routes, state/client API boundary, runtime feature configuration | Which UI capabilities are behind runtime/backend flags? Which page exposes each API? |
| API Gateway | `AlgoCrack-APIGateway` `e61d5fd`, `src/main/resources/application.yml` | Route groups, JWT boundary, downstream routing | Which paths are public versus authenticated? Do not infer controller APIs absent gateway exposure. |
| Auth Service | `AlgoCrack-AuthService` `ba9f759`, controller/properties/Flyway | local/OAuth login, token/cookie boundary, account persistence | Document config categories but never values, credentials, keys, or callback secrets. |
| Problem Service | `AlgoCrack-ProblemService` `0bd8c3e`, controllers, DTOs, Flyway | catalogue/read models, tags/lists/profile/POTD boundaries | Separate public question reads from account/admin routes; label scheduling evidence carefully. |
| Submission Service | `AlgoCrack-SubmissionService` `fddf3d5`, submission/playground/progress modules | Run/Submit/Playground ingress, judging orchestration, persistence/progress | Trace official user/oracle behavior, status/error shaping, and progress side effects. |
| CXE orchestrator | `CodeExecutionEngine` `c8e9c06`, root app + `execution-core` | API, validation, backend routing, status projection, legacy boundary | Explain only verified v2 behavior and the Job/local fallbacks. |
| Persistent NsJail runner | `CodeExecutionEngine` `c8e9c06`, `nsjail-runner/**` | claim/lease lifecycle, workspace, compile/run stages, recovery | Use Phase 4–7 results to qualify tested behavior and limits; never overstate sandbox proof. |
| WAF/Redis/MySQL/Helm/observability | `docker` `a53641c`, `helm` `f32b8db`, `scripts` `7bca9a5`, release record | edge filtering, coordination/data boundaries, topology, metrics/logs | D3 gives architecture/ownership; D4 owns deployment commands and operations procedures. |

### Component-level diagrams

Create LLD diagrams only where they improve a decision or extension point:

1. Frontend route/runtime-config/API-client relationship.
2. Gateway route/auth boundary.
3. Submission Run/Submit/Playground orchestration boundary.
4. CXE API/backend selector/v2 publisher/status reader relationship.
5. Runner lifecycle: Redis client, lease heartbeat, workspace manager, NsJail launcher, terminal commit.
6. Problem/POTD/progress collaboration only after controller/service evidence confirms the sequence.

Avoid LLD diagrams for ordinary CRUD controllers without a meaningful boundary or decision.

## 5. End-to-end sequence inventory

The sequence pages must name the entry point, participant, data read/write, execution boundary, terminal/error paths, and source evidence. A sequence diagram is not complete until its prose says which parts are verified deployed and which are legacy.

| Flow | Entry point and participants | Required failure/edge coverage | Initial evidence |
| --- | --- | --- | --- |
| Login/session | Frontend → Gateway → Auth | invalid credentials, OAuth redirect mismatch, expired/invalid session | frontend auth context, gateway config, Auth controller/properties |
| Problem retrieval | Browser → Gateway → Problem Service → problem data | public versus signed-in solved filter, empty/filter error | problem page/API client; Problem controller; gateway routes |
| Run with visible/custom cases | Workspace → Submission → CXE → runner/NsJail → Submission → UI | compile/runtime/timeout, runner/infrastructure result, custom-case inclusion | `problem-actions.tsx`, Submission `RunResponseDto`, CXE contract/tests |
| Official Submit/oracle | Workspace → Submission persistence/CXE user work → trusted oracle work → final state | polling delay, compile/runtime/timeout, stale/pending state, final persistence | `SubmissionProcessingService`, CXE adapter/poll, Phase evidence |
| Playground run | Playground UI → Submission → CXE/runner | Java-only rejection, stdout/stderr, compile/runtime/timeout, feature-disabled access | frontend workspace; `PlaygroundRunService`; router tests |
| Snippet persistence | Playground UI → Submission persistence | create/update/delete/list failure, unsaved client state | frontend API client + controller/service |
| POTD | Daily UI → Problem Service + official acceptance/progress | no scheduled challenge, UTC date, non-qualifying accepted work | daily components/calculator/controller sources |
| Streak/progress | accepted Submit → progress/rank/badges → profile/leaderboard reads | idempotency/duplicate handling if evidenced; unavailable progress sections | progress services/tests and frontend profile |
| Saved lists | library UI → Problem Service | signed-out/no list/ownership errors | frontend library components and list controller/service |
| Error/timeout propagation | any UI action → service → CXE/runner → UI | terminal taxonomy, retryable infrastructure error, user recovery advice | frontend error handling; service/CXE contracts; test evidence |

## 6. Execution-engine deep dive

This is the priority D3 section. It must explain reasoning and verified limitations, not just mirror source names.

### Proposed chapters

1. **Historical execution path and the problem it addressed** — Job-per-execution evidence and measured/contextual limits; identify historical claims with dates/sources.
2. **Persistent execution architecture** — CXE versus plain runner responsibilities, work boundaries, and retained legacy paths.
3. **Redis v2 lifecycle** — envelope/status/result boundaries, atomic move, claim/lease/heartbeat/reaper/terminal commit. Explain exactly-once limits and stale-token prevention only where test evidence supports it.
4. **NsJail process lifecycle** — fresh compile/run jail processes, workspace lifecycle, generated source, output handling, cancellation and cleanup.
5. **Resource policy** — configured time/process/output/JVM limits and why virtual-memory/JVM settings matter. Mark measurement and per-task accounting limitations.
6. **User and reference execution** — Submit user plus trusted oracle sequence, with no claim of parallelization unless verified.
7. **Playground differences** — Java-only execution, stdout/stderr/stdin, no oracle/progress, independent feature flags.
8. **Failure/security model** — code/environment/network/filesystem/descriptor boundaries, error taxonomy, no-fallback rule, residual risk.
9. **Performance evidence** — Phase 6 sample design/results and what it cannot prove; no production/generalized SLOs.
10. **Fallback and rollback** — legacy Job/local paths as retained compatibility, route selection status, and D4 link for operational actions.

### Required execution diagrams

- context/trust boundary around browser, Submission Service, CXE, Redis, runner, and NsJail;
- v2 state machine for queued/claimed/processing/terminal/recovery (only verified transitions);
- Run and Submit sequences with a distinct oracle stage;
- runner component diagram;
- compile/run workspace lifecycle sequence;
- failure/cancellation path with stale-commit protection;
- deployment boundary for orchestrator and runner;
- measured performance timeline diagram with methodology caveat.

## 7. ADR candidate index

Use an ADR template with **Context, problem, decision, alternatives considered, reasons, tradeoffs/consequences, implementation status, source evidence, and related diagrams/docs**. If historical alternatives are not recorded, label the analysis **retrospective** rather than inventing deliberation.

| Candidate | Status to investigate | Evidence starting point |
| --- | --- | --- |
| Microservices versus monolith | Retrospective unless historical record is found | repository topology, gateway routes, deployment chart |
| Redis-backed execution coordination | Current implementation + retrospective reasoning | CXE v2 client/Lua/resources and Phase 3–6 evidence |
| Persistent NsJail runner versus Job-per-execution | Current implementation with documented Phase plan/history | `context/cxe_*`, Phase 4–7 reports, CXE code |
| Separate CXE orchestrator and runner workloads | Current implementation | `execution-core`, runner image, Helm runner template |
| Helm as deployment contract | Current deployment architecture | Helm README/VERIFY/templates and release record |
| WAF with narrow source-code exclusions | Current policy; security review required | docker WAF rules/manager and RC.8 WAF record |
| Runtime frontend feature configuration | Current implementation | frontend runtime-config route/tests and Helm environment wiring |
| Immutable release images and release manifests | Current release process | scripts release tooling, `images.tsv`, RC.8 preparation |
| Separate documentation repository | Current docs-project decision | D0/D1 blueprint and docs repository configuration |

## 8. Source evidence map

| Domain | Repository / RC.8 SHA | Starting paths and evidence |
| --- | --- | --- |
| Browser/product UI | `frontend` `c859bc68bd6d9f0f4a8c08507ed259b871ee2fb0` | `src/app/**`, `src/components/**`, `src/lib/api/**`, runtime-config tests |
| API route/auth boundary | `AlgoCrack-APIGateway` `e61d5fd86b116119e59c0536cdc88953d3510cc7` | `src/main/resources/application.yml`, README |
| Auth | `AlgoCrack-AuthService` `ba9f759dec60307b3ebb376644df3282940401b2` | controllers, properties, Flyway migrations |
| Catalogue/lists/POTD/profile | `AlgoCrack-ProblemService` `0bd8c3e0bb6850d4635db4bbea8bdf15bbc980d3` | controllers, dailychallenge module, migrations |
| Submission/progress/Playground | `AlgoCrack-SubmissionService` `fddf3d52b709b2bacc476898893e651dfadf0fba` | controllers, processing/judging/playground/progress modules, migrations |
| Execution | `CodeExecutionEngine` `c8e9c069e384d56a5ba3a01e370188db88ec05ba` | root app, `execution-core/**`, `nsjail-runner/**`, tests, Dockerfiles |
| WAF/container material | `docker` `a53641c5bde32fe75e238a2ef598da28da95ba8b` | `waf/**`, Compose/observability assets |
| Deployment | `helm` `f32b8db734b111e3e3c1acce636e90f068dcd0d9` | `algocrack/values.yaml`, templates, overlays, README/VERIFY |
| Historical manifests | `k8s` `2daf89537125d623fdc06fb525bcc4048f38c3a2` | README and Kustomize base; do not treat as current Helm contract |
| Developer/release tools | `scripts` `7bca9a53194e558ec0fe731e27c06e4b4830c0d9` | README, `nsjail/**`, `cxe/**`, `deployment/**` |
| Release evidence | workspace release snapshot | `context/releases/final_rc_preparation.md`, `release-manifests/v1.0.0-rc.8/images.tsv`, Phase 4–7 status reports |

Before publishing a technical page, re-check that its exact paths exist at the pinned SHA. A controller alone is insufficient to claim released UI exposure; combine frontend/gateway/release evidence as needed.

## 9. Work packages and dependencies

| Package | Deliverables | Dependencies | Exit criteria |
| --- | --- | --- | --- |
| D3.1 Evidence inventory | machine-readable source map, page claim template, gap register | release pins, owner review | sample source refs validated; no unpinned release claims |
| D3.2 Global architecture | L1/L2/data/trust/observability pages and diagrams | D3.1, Helm/gateway/service evidence | diagrams render, distinguish deployed/fallback/planned paths |
| D3.3 Request flows | eight sequence pages from §5 | D3.1, service owners for uncertain flows | each flow names error/write boundaries and evidence |
| D3.4 Service guides | seven service pages plus supporting-infrastructure pages | D3.2–D3.3, repo owners | required service template complete; no shallow class catalogues |
| D3.5 CXE deep dive | nine execution chapters/diagrams | Phase 4–7 evidence and CXE review | recovery/security/performance claims are qualified and linkable |
| D3.6 ADR index | ADR template and evidence-backed candidate pages/index | historical records where available | retrospective labels used when history is missing |
| D3.7 Contributor reference | repository map, native setup, tests/fixtures/config/migration cross-links | scripts/readmes and D4 boundary agreement | newcomer can locate ownership/entry points without secret instructions |
| D3.8 Quality/release review | link/source checks, diagram/accessibility review, terminology/glossary pass | all D3 pages | reviewer sign-off and documented known gaps |

Recommended order: D3.1 → D3.2 → D3.3 → D3.4 and D3.5 in parallel only after evidence templates are stable → D3.6/D3.7 → D3.8. Do not begin D4 procedures merely because a D3 page identifies an operator topic.

## 10. Missing evidence and open questions

1. No checked-in OpenAPI definition exists in the Java services. D3 should publish a curated route inventory first; generating an API reference needs a separately approved contract/spec source.
2. Auth, Problem, and Submission repositories lack complete service READMEs. D3 must obtain source-owner review rather than infer business semantics from controller names.
3. Confirm the canonical public Git remote/visibility policy before turning source references into outbound links.
4. Confirm whether profile/rank/badge formula documentation is acceptable at its current RC.8 detail level and which terms are intentionally zero.
5. Retain the Phase 6 limitations: benchmark evidence is environment-specific and not a general production performance claim.
6. Confirm which D4 operational material is public, maintainer-gated, or kept only in repository runbooks. Do not publish operational secrets, credentials, raw test data, or bypass procedures.
7. Collect historical records before asserting why the microservice split or older Job path was originally chosen.
8. Establish an owner/review matrix for each service and an API-change/docs-impact check before D3 is treated as a living reference.

## 11. Quality and acceptance criteria

- A newcomer can follow the architecture learning path from L1 to a specific implementation boundary.
- Every major diagram answers a stated question, renders accessibly in light/dark themes, and has an expansion-safe reading experience.
- Significant technical claims carry an RC.8 source/release/test reference and a status label.
- Service pages separate public gateway behavior, internal calls, data ownership, configuration, and legacy paths.
- Flow pages include writes, errors, timeouts/cancellation where relevant, and user-visible versus internal outcomes.
- The execution deep dive states known limits/no-go findings and does not convert test evidence into an unqualified security or SLO guarantee.
- Links, MDX/schema validation, local search, responsive navigation, and diagram controls pass docs CI/browser review.
- No page contains credentials, raw user/reference code, private manifests, operator kubeconfig commands, or unreviewed WAF bypass material.

## 12. D3 stop condition

D3 is ready to start only after the missing-evidence questions are triaged, owners approve the page scope, and a focused implementation prompt chooses the first work package. This plan is not authorization to generate D3 pages automatically.
