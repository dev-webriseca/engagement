"use client";

import { Lock, Pencil, Trash2, Users, X } from "lucide-react";
import { useState, useTransition } from "react";
import {
  deleteRsvp,
  updateRsvp,
  verifyAdmin,
  type AdminResult,
  type RsvpRecord
} from "../actions";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [rsvps, setRsvps] = useState<RsvpRecord[] | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const result: AdminResult = await verifyAdmin(password);

      if (result.success && result.rsvps) {
        setRsvps(result.rsvps);
      } else {
        setError(result.message ?? "Unable to sign in.");
      }
    });
  };

  if (rsvps) {
    return (
      <RsvpList
        password={password}
        rsvps={rsvps}
        onUpdate={(updated) => setRsvps(updated)}
      />
    );
  }

  return (
    <main className="adminShell">
      <section className="adminCard">
        <div className="adminLock">
          <Lock size={32} strokeWidth={2.2} />
        </div>
        <h1>Admin Access</h1>
        <p>Enter the password to view RSVP responses.</p>

        <form onSubmit={handleSubmit}>
          <label className="adminLabel" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="adminInput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error ? <p className="adminError">{error}</p> : null}

          <button className="adminSubmit" type="submit" disabled={isPending}>
            {isPending ? "Checking..." : "View RSVPs"}
          </button>
        </form>
      </section>
    </main>
  );
}

function RsvpList({
  password,
  rsvps,
  onUpdate
}: {
  password: string;
  rsvps: RsvpRecord[];
  onUpdate: (rsvps: RsvpRecord[]) => void;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const totalGuests = rsvps.reduce((sum, rsvp) => sum + rsvp.total_guests, 0);
  const totalParties = rsvps.length;

  const handleDelete = (id: number) => {
    startTransition(async () => {
      const result = await deleteRsvp(password, id);

      if (result.success) {
        onUpdate(rsvps.filter((rsvp) => rsvp.id !== id));
        setDeletingId(null);
      } else {
        setMessage(result.message ?? "Delete failed.");
      }
    });
  };

  return (
    <main className="adminShell">
      <header className="adminHeader">
        <h1>Engagement RSVPs</h1>
        <p>
          <Users size={18} />
          <span>
            {totalParties} {totalParties === 1 ? "party" : "parties"} · {totalGuests} {totalGuests === 1 ? "guest" : "guests"} total
          </span>
        </p>
      </header>

      {message ? <p className="adminMessage">{message}</p> : null}

      <section className="adminList">
        {rsvps.map((rsvp, index) => (
          <RsvpCard
            key={rsvp.id}
            entryNumber={index + 1}
            password={password}
            rsvp={rsvp}
            isEditing={editingId === rsvp.id}
            isDeleting={deletingId === rsvp.id}
            onEdit={() => setEditingId(rsvp.id)}
            onCancelEdit={() => setEditingId(null)}
            onSave={(updated) => {
              onUpdate(rsvps.map((r) => (r.id === updated.id ? updated : r)));
              setEditingId(null);
            }}
            onDelete={() => handleDelete(rsvp.id)}
            onConfirmDelete={() => setDeletingId(rsvp.id)}
            onCancelDelete={() => setDeletingId(null)}
          />
        ))}
      </section>
    </main>
  );
}

function RsvpCard({
  entryNumber,
  password,
  rsvp,
  isEditing,
  isDeleting,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
  onConfirmDelete,
  onCancelDelete
}: {
  entryNumber: number;
  password: string;
  rsvp: RsvpRecord;
  isEditing: boolean;
  isDeleting: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (rsvp: RsvpRecord) => void;
  onDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}) {
  const [primaryName, setPrimaryName] = useState(rsvp.primary_name);
  const [guestNames, setGuestNames] = useState<string[]>(rsvp.guest_names);
  const [notes, setNotes] = useState(rsvp.notes ?? "");
  const [isPending, startTransition] = useTransition();

  const addGuest = () => setGuestNames((names) => [...names, ""]);
  const removeGuest = (index: number) =>
    setGuestNames((names) => names.filter((_, i) => i !== index));
  const updateGuest = (index: number, value: string) =>
    setGuestNames((names) => names.map((name, i) => (i === index ? value : name)));

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();

    startTransition(async () => {
      const result = await updateRsvp(password, rsvp.id, primaryName, guestNames, notes);

      if (result.success) {
        const trimmedGuestNames = guestNames.map((n) => n.trim()).filter((n) => n.length > 0);
        onSave({
          ...rsvp,
          primary_name: primaryName.trim(),
          guest_names: trimmedGuestNames,
          total_guests: 1 + trimmedGuestNames.length,
          notes: notes.trim() || null
        });
      }
    });
  };

  if (isEditing) {
    return (
      <article className="adminRsvpCard adminRsvpCardEditing">
        <form onSubmit={handleSave}>
          <label className="adminEditLabel" htmlFor={`primary-${rsvp.id}`}>
            Primary Guest
          </label>
          <input
            id={`primary-${rsvp.id}`}
            className="adminEditInput"
            type="text"
            value={primaryName}
            onChange={(e) => setPrimaryName(e.target.value)}
            required
          />

          <label className="adminEditLabel">Additional Guests</label>
          {guestNames.map((name, index) => (
            <div className="adminEditGuestRow" key={index}>
              <input
                className="adminEditInput"
                type="text"
                value={name}
                onChange={(e) => updateGuest(index, e.target.value)}
                placeholder={`Guest ${index + 1}`}
              />
              <button
                className="adminIconButton"
                type="button"
                aria-label={`Remove guest ${index + 1}`}
                onClick={() => removeGuest(index)}
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <button className="adminTextButton" type="button" onClick={addGuest}>
            Add Guest
          </button>

          <label className="adminEditLabel" htmlFor={`notes-${rsvp.id}`}>
            Notes
          </label>
          <textarea
            id={`notes-${rsvp.id}`}
            className="adminEditTextarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />

          <div className="adminEditActions">
            <button className="adminSaveButton" type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </button>
            <button className="adminCancelButton" type="button" onClick={onCancelEdit}>
              Cancel
            </button>
          </div>
        </form>
      </article>
    );
  }

  if (isDeleting) {
    return (
      <article className="adminRsvpCard adminRsvpCardDeleting">
        <p>Are you sure you want to delete this RSVP?</p>
        <div className="adminDeleteActions">
          <button className="adminDeleteConfirm" type="button" onClick={onDelete}>
            Yes, Delete
          </button>
          <button className="adminCancelButton" type="button" onClick={onCancelDelete}>
            Cancel
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="adminRsvpCard">
      <div className="adminRsvpActions">
        <button
          className="adminIconButton"
          type="button"
          aria-label="Edit RSVP"
          onClick={onEdit}
        >
          <Pencil size={16} />
        </button>
        <button
          className="adminIconButton adminIconButtonDanger"
          type="button"
          aria-label="Delete RSVP"
          onClick={onConfirmDelete}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="adminRsvpMain">
        <h2>{rsvp.primary_name}</h2>
        <span className="adminRsvpCount">{entryNumber}</span>
      </div>
      <p className="adminRsvpGuestTotal">
        {rsvp.total_guests} {rsvp.total_guests === 1 ? "guest" : "guests"}
      </p>

      {rsvp.guest_names.length > 0 ? (
        <div className="adminRsvpGuests">
          <p>With:</p>
          <ul>
            {rsvp.guest_names.map((name, index) => (
              <li key={`${rsvp.id}-${index}`}>{name}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {rsvp.notes ? (
        <div className="adminRsvpNotes">
          <p>Notes:</p>
          <p>{rsvp.notes}</p>
        </div>
      ) : null}

      <time dateTime={new Date(rsvp.created_at).toISOString()}>
        {new Date(rsvp.created_at).toLocaleString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit"
        })}
      </time>
    </article>
  );
}
