import record from '../../content/releases/v1.0.0-rc.8.json';
import { releaseRecordSchema, type ReleaseRecord } from './schema';

export const rc8: ReleaseRecord = releaseRecordSchema.parse(record);
