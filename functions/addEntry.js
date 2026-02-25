import { Client } from "pg";

export async function handler(event) {
    const { device_id, date, content } = JSON.parse(event.body);
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    const userRes = await client.query("SELECT id, color FROM users WHERE device_id=$1", [device_id]);
    const user = userRes.rows[0];

    await client.query(
        "INSERT INTO entries(user_id,date,content) VALUES($1,$2,$3) ON CONFLICT(user_id,date) DO UPDATE SET content=EXCLUDED.content",
        [user.id,date,content]
    );

    await client.end();
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
}
