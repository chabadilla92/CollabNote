import { NextResponse } from 'next/server.js';

export async function GET() {
  return NextResponse.json({ message: 'pong' });
}
