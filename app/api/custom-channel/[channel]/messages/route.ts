import { NextResponse } from 'next/server';
import { isCustomChannel } from '@/lib/server/custom-channel';
import { listCustomMessages } from '@/lib/server/custom-channel-db';
export const runtime = 'nodejs';
export async function GET(_: Request, { params }: { params: Promise<{ channel: string }> }) {
  const { channel } = await params;
  if (!isCustomChannel(channel)) return NextResponse.json({ error: 'Unsupported channel' }, { status: 404 });
  return NextResponse.json({ messages: listCustomMessages(channel) });
}
