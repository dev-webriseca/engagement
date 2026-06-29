"use server";

import { sql } from "@/lib/db";

export interface RsvpRecord {
  id: number;
  primary_name: string;
  guest_names: string[];
  total_guests: number;
  notes: string | null;
  attending: boolean;
  created_at: Date;
}

export interface AdminResult {
  success: boolean;
  rsvps?: RsvpRecord[];
  message?: string;
}

export interface RsvpResult {
  success: boolean;
  message: string;
}

export async function submitRsvp(
  primaryName: string,
  guestNames: string[],
  notes: string
): Promise<RsvpResult> {
  try {
    const trimmedPrimaryName = primaryName.trim();

    if (!trimmedPrimaryName) {
      return { success: false, message: "Please enter your name." };
    }

    const trimmedGuestNames = guestNames
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    const totalGuests = 1 + trimmedGuestNames.length;

    const trimmedNotes = notes.trim() || null;

    await sql`
      INSERT INTO rsvps (primary_name, guest_names, total_guests, notes, attending)
      VALUES (${trimmedPrimaryName}, ${trimmedGuestNames}, ${totalGuests}, ${trimmedNotes}, TRUE)
    `;

    return {
      success: true,
      message:
        "Your RSVP has been recorded. If you need to make any changes or your plans change, please get in touch with the sender."
    };
  } catch (error) {
    console.error("RSVP submission error:", error);
    return {
      success: false,
      message:
        "Something went wrong while saving your RSVP. Please try again later."
    };
  }
}

export async function verifyAdmin(password: string): Promise<AdminResult> {
  try {
    if (password !== process.env.ADMIN_PASSWORD) {
      return { success: false, message: "Incorrect password." };
    }

    const rsvps = await sql`
      SELECT id, primary_name, guest_names, total_guests, notes, attending, created_at
      FROM rsvps
      ORDER BY created_at DESC
    `;

    return { success: true, rsvps: rsvps as RsvpRecord[] };
  } catch (error) {
    console.error("Admin fetch error:", error);
    return {
      success: false,
      message: "Something went wrong while fetching RSVPs."
    };
  }
}

export interface DeleteResult {
  success: boolean;
  message?: string;
}

export async function deleteRsvp(password: string, id: number): Promise<DeleteResult> {
  try {
    if (password !== process.env.ADMIN_PASSWORD) {
      return { success: false, message: "Incorrect password." };
    }

    await sql`DELETE FROM rsvps WHERE id = ${id}`;
    return { success: true };
  } catch (error) {
    console.error("Delete RSVP error:", error);
    return { success: false, message: "Something went wrong while deleting the RSVP." };
  }
}

export interface UpdateResult {
  success: boolean;
  message?: string;
}

export async function updateRsvp(
  password: string,
  id: number,
  primaryName: string,
  guestNames: string[],
  notes: string
): Promise<UpdateResult> {
  try {
    if (password !== process.env.ADMIN_PASSWORD) {
      return { success: false, message: "Incorrect password." };
    }

    const trimmedPrimaryName = primaryName.trim();

    if (!trimmedPrimaryName) {
      return { success: false, message: "Primary name is required." };
    }

    const trimmedGuestNames = guestNames
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    const totalGuests = 1 + trimmedGuestNames.length;
    const trimmedNotes = notes.trim() || null;

    await sql`
      UPDATE rsvps
      SET primary_name = ${trimmedPrimaryName},
          guest_names = ${trimmedGuestNames},
          total_guests = ${totalGuests},
          notes = ${trimmedNotes}
      WHERE id = ${id}
    `;

    return { success: true };
  } catch (error) {
    console.error("Update RSVP error:", error);
    return { success: false, message: "Something went wrong while updating the RSVP." };
  }
}
