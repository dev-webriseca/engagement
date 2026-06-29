"use client";

import Image from "next/image";
import { CheckCircle2, Minus, Plus, X } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { siteContent } from "@/lib/siteContent";
import { submitRsvp } from "./actions";

export default function Home() {
  const [rsvpOpen, setRsvpOpen] = useState(false);

  return (
    <main className="siteShell">
      <section className="eventWall" aria-label="Event details">
        <HeroSection />
        <MobileRsvpButton onClick={() => setRsvpOpen(true)} />
        <InfoSections />
      </section>

      <RsvpPanel onClick={() => setRsvpOpen(true)} />

      {rsvpOpen ? <RsvpModal onClose={() => setRsvpOpen(false)} /> : null}
    </main>
  );
}

function HeroSection() {
  return (
    <section className="heroSection">
      <Image
        src={siteContent.event.heroImage}
        alt={siteContent.event.heroImageAlt}
        fill
        sizes="(max-width: 767px) 100vw, 58vw"
        className="heroImage"
        priority
      />
      <div className="bismillahWrapper">
        <Image
          src="/images/bismillah.png"
          alt="Bismillah al-Rahman al-Rahim"
          width={700}
          height={210}
          className="bismillahImage"
          priority
        />
      </div>
      <div className="heroDetails">
        <h1>{siteContent.event.title}</h1>
        <p>{siteContent.event.date}</p>
      </div>
      <span className="scrollHint">Scroll Down</span>
    </section>
  );
}

function MobileRsvpButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="mobileRsvpButton" type="button" onClick={onClick}>
      RSVP
    </button>
  );
}

function RsvpPanel({ onClick }: { onClick: () => void }) {
  return (
    <aside className="rsvpPanel" aria-label="RSVP invitation">
      <div className="invitationCard">
        <h2>{siteContent.event.rsvpPrompt}</h2>
        <p>{siteContent.event.rsvpDeadline}</p>
        <button className="enterPill" type="button" onClick={onClick}>
          <CheckCircle2 size={24} strokeWidth={2.4} />
          <span>RSVP Here</span>
        </button>
      </div>

      <section className="rsvpStub" aria-label="RSVP form preview">
        <h3>RSVP</h3>
        <div className="stubRule" />
        <div className="stubRow">
          <span>Attending</span>
          <div className="counter">
            <button type="button" aria-label="Decrease attendees">
              <Minus size={18} />
            </button>
            <span>0</span>
            <button type="button" aria-label="Increase attendees">
              <Plus size={18} />
            </button>
          </div>
        </div>
        <label className="checkboxRow">
          <span>Can&apos;t Make It</span>
          <input type="checkbox" />
        </label>
      </section>
    </aside>
  );
}

function RsvpModal({ onClose }: { onClose: () => void }) {
  const [primaryName, setPrimaryName] = useState("");
  const [guestNames, setGuestNames] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const addGuest = () => {
    setGuestNames((names) => [...names, ""]);
  };

  const removeGuest = (index: number) => {
    setGuestNames((names) => names.filter((_, i) => i !== index));
  };

  const updateGuest = (index: number, value: string) => {
    setGuestNames((names) => names.map((name, i) => (i === index ? value : name)));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    startTransition(async () => {
      const result = await submitRsvp(primaryName, guestNames, notes);
      setStatus(result.success ? "success" : "error");
      setMessage(result.message);
    });
  };

  return (
    <div className="rsvpModalBackdrop" onClick={onClose}>
      <div
        className="rsvpModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rsvpTitle"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="rsvpModalClose" type="button" aria-label="Close RSVP form" onClick={onClose}>
          <X size={24} />
        </button>

        {status === "success" ? (
          <div className="rsvpSuccess">
            <CheckCircle2 size={48} strokeWidth={2} />
            <h2 id="rsvpTitle">Thank You!</h2>
            <p>{message}</p>
            <button className="rsvpSubmitButton" type="button" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 id="rsvpTitle">Will You Be Joining Us?</h2>
            <p className="rsvpSubtext">
              Please RSVP so we can secure your spot. No email required.
            </p>

            <label className="rsvpLabel" htmlFor="primaryName">
              Your Name *
            </label>
            <input
              id="primaryName"
              className="rsvpInput"
              type="text"
              value={primaryName}
              onChange={(e) => setPrimaryName(e.target.value)}
              placeholder="Enter your full name"
              required
            />

            <div className="rsvpGuests">
              <p className="rsvpLabel">Additional Guests</p>
              {guestNames.map((name, index) => (
                <div className="rsvpGuestRow" key={index}>
                  <input
                    className="rsvpInput"
                    type="text"
                    value={name}
                    onChange={(e) => updateGuest(index, e.target.value)}
                    placeholder={`Guest ${index + 1} name`}
                  />
                  <button
                    className="rsvpIconButton"
                    type="button"
                    aria-label={`Remove guest ${index + 1}`}
                    onClick={() => removeGuest(index)}
                  >
                    <Minus size={18} />
                  </button>
                </div>
              ))}
              <button className="rsvpTextButton" type="button" onClick={addGuest}>
                <Plus size={16} />
                Add Guest
              </button>
            </div>

            <label className="rsvpLabel" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              className="rsvpInput rsvpTextarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Dietary restrictions, accessibility needs, etc."
              rows={3}
            />

            {status === "error" ? <p className="rsvpError">{message}</p> : null}

            <button
              className="rsvpSubmitButton"
              type="submit"
              disabled={isPending || !primaryName.trim()}
            >
              {isPending ? "Submitting..." : "Secure My Spot"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function formatStory(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
  return <div style={{ whiteSpace: "pre-line" }}>{parts}</div>;
}

function ScrollReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`scrollReveal ${isVisible ? "is-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

function InfoSections() {
  return (
    <>
      <ScrollReveal>
        <section id="invitation" className="contentSection whiteSection storySection">
          <div className="invitationInner">
            <div className="invitationFrame">
              <Image
                src="/images/bismillah-sage.png"
                alt="Bismillah al-Rahman al-Rahim"
                width={520}
                height={156}
                className="invitationBismillah"
                priority
              />
              <h2>You&apos;re Invited</h2>
              {formatStory(siteContent.loveStory)}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section id="venue" className="mapSection navySection">
          <iframe
            title={siteContent.venue.title}
            src={siteContent.venue.mapUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      </ScrollReveal>
    </>
  );
}
