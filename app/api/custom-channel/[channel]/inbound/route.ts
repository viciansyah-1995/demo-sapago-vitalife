import { NextResponse } from 'next/server';
import { getCustomChannelConfig, isCustomChannel } from '@/lib/server/custom-channel';
import { saveCustomMessage } from '@/lib/server/custom-channel-db';
export const runtime = 'nodejs';
export async function POST(request: Request, { params }: { params: Promise<{ channel: string }> }) {
  const { channel } = await params;
  if (!isCustomChannel(channel)) return NextResponse.json({ error: 'Unsupported channel' }, { status: 404 });
  const body = await request.json() as { external_message_id: string; external_user_id: string; external_conversation_id?: string; text?: string; sent_at?: string }; const { accountId, token, apiBaseUrl } = getCustomChannelConfig(channel);
  if (!accountId || !token) return NextResponse.json({ error: 'Custom Channel env is not configured' }, { status: 503 });
  const response = await fetch(`${apiBaseUrl}/custom-channel-accounts/${accountId}/messages/inbound`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (response.ok) saveCustomMessage({ id: body.external_message_id, channel, externalUserId: body.external_user_id, externalConversationId: body.external_conversation_id, direction: 'inbound', text: body.text || '', createdAt: body.sent_at, payload: body });
  return new NextResponse(await response.text(), { status: response.status, headers: { 'Content-Type': 'application/json' } });
}
