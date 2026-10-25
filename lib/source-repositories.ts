export type SourcePathKind = 'file' | 'directory';

export type SourcePath = {
  label: string;
  path: string;
  kind: SourcePathKind;
};

export type SourceRepository = {
  name: string;
  role: string;
  category: string;
  rc8Revision: string;
  publicUrl?: string;
  publicAccess: 'verified-public' | 'unavailable';
  paths: readonly SourcePath[];
  note?: string;
};

export const rc8Release = 'v1.0.0-rc.8';

/**
 * Static, reviewable source metadata. The documentation build never calls a
 * GitHub API; availability was checked from the configured remotes on 2026-10-25.
 */
export const sourceRepositories = {
  apiGateway: {
    name: 'AlgoCrack-APIGateway',
    role: 'JWT-aware API route dispatch',
    category: 'Runtime service',
    rc8Revision: 'e61d5fd86b116119e59c0536cdc88953d3510cc7',
    publicUrl: 'https://github.com/hrishabh6/AlgoCrack-APIGateway',
    publicAccess: 'verified-public',
    paths: [{ label: 'Gateway routes', path: 'src/main/resources/application.yml', kind: 'file' }],
  },
  auth: {
    name: 'AlgoCrack-AuthService',
    role: 'Accounts, authentication, and token boundary',
    category: 'Runtime service',
    rc8Revision: 'ba9f759dec60307b3ebb376644df3282940401b2',
    publicUrl: 'https://github.com/hrishabh6/AlgoCrack-AuthService',
    publicAccess: 'verified-public',
    paths: [{ label: 'Application configuration', path: 'src/main/resources/application.properties', kind: 'file' }],
  },
  problem: {
    name: 'AlgoCrack-ProblemService',
    role: 'Problem catalogue, lists, profile-facing problem data, and daily challenge domain',
    category: 'Runtime service',
    rc8Revision: '0bd8c3e0bb6850d4635db4bbea8bdf15bbc980d3',
    publicUrl: 'https://github.com/hrishabh6/AlgoCrack-ProblemService',
    publicAccess: 'verified-public',
    paths: [{ label: 'Problem controllers', path: 'src/main/java/com/hrishabh/problemservice/controllers', kind: 'directory' }],
  },
  submission: {
    name: 'AlgoCrack-SubmissionService',
    role: 'Submission, judging, progress, and Playground API domain',
    category: 'Runtime service',
    rc8Revision: 'fddf3d52b709b2bacc476898893e651dfadf0fba',
    publicUrl: 'https://github.com/hrishabh6/AlgoCrack-SubmissionService',
    publicAccess: 'verified-public',
    paths: [{ label: 'Submission source', path: 'src/main/java', kind: 'directory' }],
  },
  cxe: {
    name: 'CodeExecutionEngine',
    role: 'Execution API/orchestrator and persistent NsJail runner source',
    category: 'Execution runtime',
    rc8Revision: 'c8e9c069e384d56a5ba3a01e370188db88ec05ba',
    publicUrl: 'https://github.com/hrishabh6/CodeExecutionEngine',
    publicAccess: 'verified-public',
    paths: [
      { label: 'Execution controller', path: 'src/main/java/xyz/hrishabhjoshi/codeexecutionengine/controller/ExecutionController.java', kind: 'file' },
      { label: 'Persistent runner', path: 'nsjail-runner', kind: 'directory' },
    ],
  },
  docker: {
    name: 'AlgoCrack-Docker',
    role: 'WAF and container/observability material',
    category: 'Edge and container material',
    rc8Revision: 'a53641c5bde32fe75e238a2ef598da28da95ba8b',
    publicUrl: 'https://github.com/hrishabh6/AlgoCrack-Docker',
    publicAccess: 'verified-public',
    paths: [{ label: 'WAF material', path: 'waf', kind: 'directory' }],
  },
  frontend: {
    name: 'AlgoCrack-Frontend',
    role: 'Next.js product UI and browser API client',
    category: 'Runtime service',
    rc8Revision: 'c859bc68bd6d9f0f4a8c08507ed259b871ee2fb0',
    publicUrl: 'https://github.com/hrishabh6/AlgoCrack-Frontend',
    publicAccess: 'verified-public',
    paths: [{ label: 'Frontend source', path: 'src', kind: 'directory' }],
  },
  helm: {
    name: 'Algocrack-Helmchart',
    role: 'Helm deployment contract, workloads, ingress, and observability topology',
    category: 'Deployment',
    rc8Revision: 'f32b8db734b111e3e3c1acce636e90f068dcd0d9',
    publicUrl: 'https://github.com/hrishabh6/Algocrack-Helmchart',
    publicAccess: 'verified-public',
    paths: [{ label: 'AlgoCrack chart', path: 'algocrack', kind: 'directory' }],
  },
  k8s: {
    name: 'Deployment-Algocrack',
    role: 'Earlier Kustomize deployment material',
    category: 'Historical deployment',
    rc8Revision: '2daf89537125d623fdc06fb525bcc4048f38c3a2',
    publicAccess: 'unavailable',
    paths: [],
    note: 'The configured GitHub remote was not anonymously accessible on 2026-10-25. It is historical material and not the RC.8 Helm contract.',
  },
  scripts: {
    name: 'AlgoCrack-LocalScripts',
    role: 'Local development, image-release, and validation tooling',
    category: 'Developer tooling',
    rc8Revision: '7bca9a53194e558ec0fe731e27c06e4b4830c0d9',
    publicUrl: 'https://github.com/hrishabh6/AlgoCrack-LocalScripts',
    publicAccess: 'verified-public',
    paths: [{ label: 'Repository root', path: '', kind: 'directory' }],
    note: 'Later release-tool changes exist outside the RC.8 source pin; this entry preserves the release baseline.',
  },
} as const satisfies Record<string, SourceRepository>;

export type SourceRepositoryId = keyof typeof sourceRepositories;

export function sourceCommitUrl(repository: SourceRepository): string | undefined {
  return repository.publicUrl ? `${repository.publicUrl}/commit/${repository.rc8Revision}` : undefined;
}

export function sourcePathUrl(repository: SourceRepository, path: string, kind: SourcePathKind): string | undefined {
  if (!repository.publicUrl) return undefined;
  if (!path) return `${repository.publicUrl}/tree/${repository.rc8Revision}`;

  const route = kind === 'file' ? 'blob' : 'tree';
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  return `${repository.publicUrl}/${route}/${repository.rc8Revision}/${encodedPath}`;
}
