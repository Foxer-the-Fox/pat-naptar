import { Client } from "pg";

export async function handler() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const res = await client.query(
        "SELECT e.date, e.content, u.color FROM entries e JOIN users u ON e.user_id = u.id"
    );
    await client.end();
    return { statusCode: 200, body: JSON.stringify(res.rows) };
}
