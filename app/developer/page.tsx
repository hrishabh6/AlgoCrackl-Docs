import Link from 'next/link';
import type { Metadata } from 'next';
import { authorProfile } from '@/lib/author';
import { sourceRepositories } from '@/lib/source-repositories';

export const metadata: Metadata = {
  title: `Developer | ${authorProfile.name}`,
  description: 'The developer behind AlgoCrack: cloud-native infrastructure, distributed systems, and AI-assisted engineering.',
};

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="font-medium text-fd-primary underline-offset-4 hover:underline" href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

export default function DeveloperPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-16">
      <p className="text-sm font-medium text-fd-muted-foreground">Developer</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{authorProfile.name}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-fd-muted-foreground">{authorProfile.role}</p>

      <section className="mt-12 grid gap-8 rounded-2xl border bg-fd-card p-6 sm:grid-cols-[minmax(0,1.6fr)_minmax(12rem,1fr)] sm:p-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Professional focus</h2>
          <p className="mt-3 leading-7 text-fd-muted-foreground">
            Hrishabh is a DevOps Engineer at {authorProfile.employer}. His work includes deployment and operational support for enterprise production systems, Kubernetes and Helm-based delivery workflows, Datadog-backed observability, and production troubleshooting.
          </p>
          <p className="mt-3 leading-7 text-fd-muted-foreground">
            He has experience with products involving GSMA SGP.22 and SGP.32 technologies and eSIM IoT Remote Manager (eIM). This page does not describe employer-internal architecture, customers, incidents, or operating procedures.
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Career overview</h3>
          <ol className="mt-4 space-y-4 border-l pl-4 text-sm">
            {authorProfile.career.map((entry) => (
              <li key={entry.date}>
                <p className="font-medium">{entry.title}</p>
                <p className="mt-1 text-fd-muted-foreground">{entry.date}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Engineering interests</h2>
        <p className="mt-3 max-w-3xl leading-7 text-fd-muted-foreground">
          Independently, Hrishabh explores the platform and architecture concerns that connect application development with reliable operations.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {authorProfile.interests.map((interest) => (
            <li key={interest} className="rounded-lg border bg-fd-card px-4 py-3 text-sm">
              {interest}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">About AlgoCrack</h2>
        <p className="mt-3 max-w-3xl leading-7 text-fd-muted-foreground">
          AlgoCrack is a personal engineering project that brings those interests together: Java and Spring Boot microservices, a Next.js interface, Kubernetes-oriented deployment, observability, and a sandbox-based code-execution path. Its architecture documentation is deliberately source-backed and distinguishes release evidence from planned work.
        </p>
        <p className="mt-4">
          <Link className="font-medium text-fd-primary underline-offset-4 hover:underline" href="/docs/architecture/source-repositories">
            Explore the commit-pinned source repositories
          </Link>
          <span className="text-fd-muted-foreground"> or </span>
          <ExternalLink href={sourceRepositories.cxe.publicUrl}>view the execution-engine source</ExternalLink>
          <span className="text-fd-muted-foreground">.</span>
        </p>
      </section>

      <section className="mt-12 rounded-2xl border bg-fd-card p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">AI-assisted engineering</h2>
        <blockquote className="mt-4 border-l-2 border-fd-primary pl-4 text-lg leading-8">
          “I use AI coding tools to accelerate implementation, while I direct requirements, architectural decisions, system integration, technical review, debugging, testing, and release verification.”
        </blockquote>
        <p className="mt-4 max-w-3xl leading-7 text-fd-muted-foreground">
          This is an engineering workflow, not an automatic application generator. The goal is to move faster while retaining responsibility for design choices, integration boundaries, validation, and the evidence behind release claims.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Profiles</h2>
        <p className="mt-3 text-fd-muted-foreground">Public profile links supplied by the project owner.</p>
        <div className="mt-5 flex flex-wrap gap-4">
          {authorProfile.profiles.map((profile) => (
            <ExternalLink key={profile.label} href={profile.href}>{profile.label}</ExternalLink>
          ))}
        </div>
      </section>
    </main>
  );
}
