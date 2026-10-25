import { rc8 } from '@/lib/releases/v1.0.0-rc.8';
import type { ReleaseRecord } from '@/lib/releases/schema';

export function ReleaseImages({ release = rc8 }: { release?: ReleaseRecord }) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="px-3 py-2 font-medium">Component</th>
            <th className="px-3 py-2 font-medium">Image</th>
            <th className="px-3 py-2 font-medium">Repository</th>
            <th className="px-3 py-2 font-medium">Git SHA</th>
            <th className="px-3 py-2 font-medium">Manifest digest</th>
          </tr>
        </thead>
        <tbody>
          {release.images.map((image) => (
            <tr key={image.component} className="border-b align-top">
              <td className="px-3 py-2 font-medium">{image.component}</td>
              <td className="px-3 py-2">
                <code>{image.image}</code>
              </td>
              <td className="px-3 py-2">{image.gitRepository}</td>
              <td className="px-3 py-2">
                <code>{image.gitSha.slice(0, 12)}</code>
              </td>
              <td className="px-3 py-2">
                <code>{`${image.manifestDigest.slice(0, 19)}…`}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-sm text-neutral-500">
        Digests are the OCI index digests recorded as {release.images[0]?.status ?? 'VERIFIED'} for{' '}
        {release.version}. A kubelet image ID is often the platform manifest digest, which can differ
        from this index digest.
      </p>
    </div>
  );
}
