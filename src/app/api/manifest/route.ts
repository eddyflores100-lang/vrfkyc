import { handle } from '@/lib/vrfkyc/core.mjs';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) { return handle(request, process.env); }
export async function POST(request: Request) { return handle(request, process.env); }
export async function OPTIONS(request: Request) { return handle(request, process.env); }
