import Link from 'next/link';

const entries = [
  {
    href: '/docs',
    title: 'Introduction',
    text: 'What the RC.8 platform is, and the claims this site will not make.',
  },
  {
    href: '/docs/using/features',
    title: 'Features and Java support',
    text: 'Which product paths execute Java, and which languages are only retained in source.',
  },
  {
    href: '/docs/architecture/overview',
    title: 'Architecture',
    text: 'Browser, ingress, WAF, gateway, services, Redis, and the NsJail runner.',
  },
  {
    href: '/docs/architecture/repositories',
    title: 'Repositories',
    text: 'Which Git repository owns each published image.',
  },
  {
    href: '/docs/releases/v1.0.0-rc.8',
    title: 'RC.8 release',
    text: 'Verified image tags, source commits, and manifest digests.',
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-16">
      <p className="text-sm font-medium text-neutral-500">Documentation for v1.0.0-rc.8</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">AlgoCrack</h1>
      <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
        A LeetCode-style coding platform built as Java microservices, a Next.js frontend, and a
        persistent NsJail execution path. These pages describe the published RC.8 release on a
        local Kubernetes cluster.
      </p>
      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        {entries.map((entry) => (
          <li key={entry.href}>
            <Link
              href={entry.href}
              className="block h-full rounded-xl border p-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
            >
              <span className="font-medium">{entry.title}</span>
              <span className="mt-1 block text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                {entry.text}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
