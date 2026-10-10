import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { SECURITY } from '@/lib/vrfkyc/core.mjs';
export const runtime = 'nodejs';
export async function GET() { return new Response(await readFile(join(process.cwd(), 'public/index.html'), 'utf8'), {headers: {...SECURITY, 'Content-Type':'text/html; charset=utf-8'}}); }
