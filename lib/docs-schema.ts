import { pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

export const sourceRefSchema = z.object({
  repo: z.string().min(1),
  ref: z.string().min(1),
  path: z.string().min(1),
});

export const docsPageSchema = pageSchema.extend({
  audience: z.array(z.enum(['user', 'developer', 'operator', 'maintainer'])).optional(),
  status: z.enum(['verified', 'partial', 'historical']).default('verified'),
  release: z.string().optional(),
  lastVerified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  sourceRefs: z.array(sourceRefSchema).optional(),
});

export type DocsPageFrontmatter = z.infer<typeof docsPageSchema>;
export type SourceRef = z.infer<typeof sourceRefSchema>;
