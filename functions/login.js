import { Client } from "pg";

export async function handler(event) {
    const { device_id, name, color } = JSON.parse(event.body);
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    let res = await client.query("SELECT * FROM users WHERE device_id=$1", [device_id]);
    if (res.rows.length === 0) {
        res = await client.query(
            "INSERT INTO users(device_id,name,color) VALUES($1,$2,$3) RETURNING *",
            [device_id,name,color]
        );
    }
    await client.end();
    return { statusCode: 200, body: JSON.stringify(res.rows[0]) };
}
