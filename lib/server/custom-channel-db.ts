import 'server-only';
import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';

let db: DatabaseSync | undefined;

function getDatabase() {
  if (db) return db;
  const database = new DatabaseSync(join(process.cwd(), 'data', 'custom-channel.sqlite'));
  database.exec(`PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS custom_messages (
      id TEXT PRIMARY KEY, channel TEXT NOT NULL, external_user_id TEXT NOT NULL,
      external_conversation_id TEXT, direction TEXT NOT NULL, text TEXT NOT NULL,
      created_at TEXT NOT NULL, payload TEXT NOT NULL
    )`);
  db = database;
  return database;
}

export function saveCustomMessage(input: { id: string; channel: string; externalUserId: string; externalConversationId?: string; direction: 'inbound' | 'outbound'; text: string; createdAt?: string; payload: unknown }) {
  getDatabase().prepare(`INSERT OR IGNORE INTO custom_messages (id,channel,external_user_id,external_conversation_id,direction,text,created_at,payload) VALUES (?,?,?,?,?,?,?,?)`).run(input.id, input.channel, input.externalUserId, input.externalConversationId || null, input.direction, input.text, input.createdAt || new Date().toISOString(), JSON.stringify(input.payload));
}

export function listCustomMessages(channel: string) {
  return getDatabase().prepare(`SELECT * FROM custom_messages WHERE channel = ? ORDER BY created_at ASC`).all(channel);
}
