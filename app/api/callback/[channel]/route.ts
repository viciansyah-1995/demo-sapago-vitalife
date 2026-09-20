import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { getCustomChannelConfig, isCustomChannel } from '@/lib/server/custom-channel';
import { saveCustomMessage } from '@/lib/server/custom-channel-db';
export const runtime = 'nodejs';
export async function POST(request: Request, { params }: { params: Promise<{ channel: string }> }) {
  const { channel } = await params; if (!isCustomChannel(channel)) return NextResponse.json({ error: 'Unsupported channel' }, { status: 404 });
  const rawBody = await request.text(); const signature = request.headers.get('x-talky-signature-256') || ''; const secret = getCustomChannelConfig(channel).secret;
  if (!secret || !signature.startsWith('sha256=')) return NextResponse.json({ error: 'Invalid callback configuration' }, { status: 401 });
  const expected = `sha256=${crypto.createHmac('sha256', secret).update(rawBody).digest('hex')}`; const valid = expected.length === signature.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  if (!valid) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  const payload = JSON.parse(rawBody) as { external_user_id?: string; external_conversation_id?: string; message?: { id?: string; text?: string; created_at?: string } }; console.info(`[custom-channel:${channel}] outbound`, payload.message?.id || 'unknown');
  if (payload.message?.id) saveCustomMessage({ id: payload.message.id, channel, externalUserId: (payload as any).external_user_id, externalConversationId: (payload as any).external_conversation_id, direction: 'outbound', text: payload.message.text || '', createdAt: payload.message.created_at, payload });
  return NextResponse.json({ accepted: true, message_id: payload.message?.id });
}
