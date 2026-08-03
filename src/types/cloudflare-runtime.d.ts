/* eslint-disable @typescript-eslint/no-explicit-any */
declare type D1Database = any;
declare type R2Bucket = any;
declare type Fetcher = any;

declare module "cloudflare:workers" {
  export const env: {
    DB: D1Database;
    BUCKET: R2Bucket;
  };
}
