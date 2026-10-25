import { z } from 'zod';

export const releaseImageSchema = z.object({
  component: z.string().min(1),
  image: z.string().min(1),
  gitRepository: z.string().min(1),
  gitSha: z.string().regex(/^[0-9a-f]{40}$/),
  platform: z.literal('linux/amd64'),
  manifestDigest: z.string().regex(/^sha256:[0-9a-f]{64}$/),
  status: z.literal('VERIFIED'),
  dockerfile: z.string().min(1),
  artifactRole: z.string().min(1),
});

export const releaseRecordSchema = z.object({
  version: z.string().regex(/^v\d+\.\d+\.\d+-rc\.\d+$/),
  verifiedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  deployment: z.object({
    kind: z.literal('local-kubernetes'),
    summary: z.string().min(1),
  }),
  execution: z.object({
    submission: z.string().min(1),
    playground: z.string().min(1),
    executedLanguages: z.array(z.string().min(1)),
    savedSnippetLanguages: z.array(z.string().min(1)),
    retainedFallbacks: z.array(z.string().min(1)),
  }),
  limitations: z.array(z.string().min(1)).min(1),
  images: z.array(releaseImageSchema).min(1),
});

export type ReleaseRecord = z.infer<typeof releaseRecordSchema>;
export type ReleaseImage = z.infer<typeof releaseImageSchema>;
