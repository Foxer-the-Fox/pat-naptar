import { Client } from "pg";

export async function handler(event) {
    const device_id = event.queryStringParameters.device_id;
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    const userRes = await client.query("SELECT id FROM users WHERE device_id=$1", [device_id]);
    const user = userRes.rows[0];

    const entriesRes = await client.query("SELECT * FROM entries WHERE user_id=$1", [user.id]);
    await client.end();
    return { statusCode: 200, body: JSON.stringify(entriesRes.rows) };
}
