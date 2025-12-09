import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ override: true });

export default defineConfig({
  schema: './src/lib/server/database/schema.ts',
  out: './drizzle/migrations',
  dialect: 'mysql',
  dbCredentials: {
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '3kVo5eGYqYJ1wZr.root',
    password: 'loS3fziUIAG069YO',
    database: 'test',
    ssl: {
      ca: fs.readFileSync(path.resolve('src/lib/server/database/ca.pem')).toString(),
      rejectUnauthorized: true,
    }
  },
  verbose: true,
  strict: true,
});