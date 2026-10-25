import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName } from './shared';
import { sourceRepositories } from './source-repositories';

export function baseOptions(): BaseLayoutProps {
  return {
    githubUrl: sourceRepositories.cxe.publicUrl,
    links: [
      {
        type: 'main',
        text: 'Source repositories',
        url: '/docs/architecture/source-repositories',
      },
      {
        type: 'main',
        text: 'Developer',
        url: '/developer',
      },
    ],
    nav: {
      title: appName,
    },
  };
}
