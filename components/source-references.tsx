import {
  rc8Release,
  sourceCommitUrl,
  sourcePathUrl,
  sourceRepositories,
  type SourcePathKind,
  type SourceRepository,
  type SourceRepositoryId,
} from '@/lib/source-repositories';

type SourceReferenceProps = {
  repository: SourceRepositoryId;
  path?: string;
  kind?: SourcePathKind;
  label?: string;
};

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

export function SourceReference({ repository: repositoryId, path, kind = 'file', label }: SourceReferenceProps) {
  const repository: SourceRepository = sourceRepositories[repositoryId];
  const commitUrl = sourceCommitUrl(repository);
  const pathUrl = path ? sourcePathUrl(repository, path, kind) : undefined;

  return (
    <aside className="my-6 rounded-lg border bg-fd-card p-4 text-sm">
      <p className="m-0 font-medium">{label ?? `${repository.name} source reference`}</p>
      <p className="mt-1 text-fd-muted-foreground">
        {rc8Release} · <code>{repository.rc8Revision.slice(0, 12)}</code> · {repository.role}
      </p>
      {repository.publicAccess === 'verified-public' && repository.publicUrl && commitUrl ? (
        <p className="mb-0 mt-3 flex flex-wrap gap-x-4 gap-y-1">
          <ExternalLink href={repository.publicUrl}>View repository</ExternalLink>
          <ExternalLink href={commitUrl}>View pinned revision</ExternalLink>
          {pathUrl ? <ExternalLink href={pathUrl}>View implementation source</ExternalLink> : null}
        </p>
      ) : (
        <p className="mb-0 mt-3 text-fd-muted-foreground">
          Source unavailable: public anonymous access was not verified for this repository. {repository.note}
        </p>
      )}
    </aside>
  );
}

export function SourceRepositoryTable() {
  return (
    <div className="my-6 overflow-x-auto">
      <table>
        <thead>
          <tr>
            <th>Repository</th>
            <th>Responsibility</th>
            <th>RC.8 source</th>
            <th>Availability</th>
          </tr>
        </thead>
        <tbody>
          {(Object.entries(sourceRepositories) as Array<[SourceRepositoryId, SourceRepository]>).map(([id, repository]) => {
            const commitUrl = sourceCommitUrl(repository);
            const primaryPath = repository.paths[0];
            const primaryPathUrl = primaryPath
              ? sourcePathUrl(repository, primaryPath.path, primaryPath.kind)
              : undefined;

            return (
              <tr key={id}>
                <td>
                  {repository.publicUrl ? <ExternalLink href={repository.publicUrl}>{repository.name}</ExternalLink> : repository.name}
                  <div className="mt-1 text-xs text-fd-muted-foreground">{repository.category}</div>
                </td>
                <td>{repository.role}</td>
                <td>
                  {commitUrl ? <ExternalLink href={commitUrl}>{repository.rc8Revision.slice(0, 12)}</ExternalLink> : <code>{repository.rc8Revision.slice(0, 12)}</code>}
                  {primaryPath && primaryPathUrl ? (
                    <div className="mt-1 text-xs"><ExternalLink href={primaryPathUrl}>{primaryPath.label}</ExternalLink></div>
                  ) : null}
                </td>
                <td>
                  {repository.publicAccess === 'verified-public' ? 'Public link verified' : 'Unavailable; no public link shown'}
                  {repository.note ? <div className="mt-1 text-xs text-fd-muted-foreground">{repository.note}</div> : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
