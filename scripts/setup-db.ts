import { sql } from "../src/lib/db";

async function setup() {
  await sql`
    CREATE TABLE IF NOT EXISTS rsvps (
      id SERIAL PRIMARY KEY,
      primary_name TEXT NOT NULL,
      guest_names TEXT[] NOT NULL DEFAULT '{}',
      total_guests INTEGER NOT NULL DEFAULT 1,
      attending BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
  console.log("RSVP table ready.");
}

setup().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
