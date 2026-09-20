import 'server-only';
import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';

const db = new DatabaseSync(join(process.cwd(), 'data', 'custom-channel.sqlite'));
db.exec(`CREATE TABLE IF NOT EXISTS custom_messages (
  id TEXT PRIMARY KEY, channel TEXT NOT NULL, external_user_id TEXT NOT NULL,
  external_conversation_id TEXT, direction TEXT NOT NULL, text TEXT NOT NULL,
  created_at TEXT NOT NULL, payload TEXT NOT NULL
)`);

export function saveCustomMessage(input: { id: string; channel: string; externalUserId: string; externalConversationId?: string; direction: 'inbound' | 'outbound'; text: string; createdAt?: string; payload: unknown }) {
  db.prepare(`INSERT OR IGNORE INTO custom_messages (id,channel,external_user_id,external_conversation_id,direction,text,created_at,payload) VALUES (?,?,?,?,?,?,?,?)`).run(input.id, input.channel, input.externalUserId, input.externalConversationId || null, input.direction, input.text, input.createdAt || new Date().toISOString(), JSON.stringify(input.payload));
}

export function listCustomMessages(channel: string) {
  return db.prepare(`SELECT * FROM custom_messages WHERE channel = ? ORDER BY created_at ASC`).all(channel);
}
