import { sql } from "../src/lib/db";

async function test() {
  const result = await sql`
    INSERT INTO rsvps (primary_name, guest_names, total_guests, attending)
    VALUES ('Test Guest', ${["Guest One", "Guest Two"]}, 3, TRUE)
    RETURNING id, primary_name, guest_names, total_guests, created_at
  `;
  console.log("Inserted test RSVP:", result[0]);

  await sql`DELETE FROM rsvps WHERE primary_name = 'Test Guest'`;
  console.log("Test RSVP cleaned up.");
}

test().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
