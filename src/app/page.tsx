"use client";

import Image from "next/image";
import {
  CheckCircle2,
  Coffee,
  Heart,
  Link as LinkIcon,
  MapPin,
  Menu,
  Minus,
  Plus,
  Wine
} from "lucide-react";
import { useState } from "react";
import { siteContent } from "@/lib/siteContent";

type ScheduleIcon = "party" | "ceremony" | "brunch";

const scheduleIcons: Record<ScheduleIcon, React.ComponentType<{ size?: number }>> = {
  party: Wine,
  ceremony: Heart,
  brunch: Coffee
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
    setMenuOpen(false);
  };

  return (
    <main className="siteShell">
      <section className="eventWall" aria-label="Event details">
        <button
          className="menuButton"
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu size={30} strokeWidth={3} />
        </button>

        <nav className={`eventMenu ${menuOpen ? "eventMenuOpen" : ""}`}>
          {siteContent.navigation.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {menuOpen ? (
          <button
            className="menuBackdrop"
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
          />
        ) : null}

        <HeroSection />
        <MobileRsvpButton />
        <InfoSections />
      </section>

      <RsvpPanel />
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
      <div className="heroDetails">
        <h1>{siteContent.event.title}</h1>
        <p>{siteContent.event.date}</p>
      </div>
      <span className="scrollHint">Scroll Down</span>
    </section>
  );
}

function MobileRsvpButton() {
  return (
    <button className="mobileRsvpButton" type="button">
      RSVP
    </button>
  );
}

function RsvpPanel() {
  return (
    <aside className="rsvpPanel" aria-label="RSVP invitation">
      <div className="invitationCard">
        <h2>{siteContent.event.rsvpPrompt}</h2>
        <p>{siteContent.event.rsvpDeadline}</p>
        <button className="enterPill" type="button">
          <CheckCircle2 size={24} strokeWidth={2.4} />
          <span>Press Enter</span>
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
          <span>Can't Make It</span>
          <input type="checkbox" />
        </label>
      </section>
    </aside>
  );
}

function InfoSections() {
  return (
    <>
      <section id="love-story" className="contentSection whiteSection storySection">
        <h2>Our Love Story</h2>
        <p>{siteContent.loveStory}</p>
      </section>

      <section id="schedule" className="contentSection navySection scheduleSection">
        <h2>Schedule of Events</h2>
        <div className="timeline">
          {siteContent.schedule.map((item) => {
            const Icon = scheduleIcons[item.icon as ScheduleIcon];

            return (
              <article className="timelineItem" key={item.title}>
                <span className="timelineIcon">
                  <Icon size={22} />
                </span>
                <h3>{item.title}</h3>
                <p className="eventTime">{item.date}</p>
                <p className="eventLocation">{item.location}</p>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="venue" className="mapSection navySection">
        <h2>{siteContent.venue.title}</h2>
        <p className="venueAddress">{siteContent.venue.address}</p>
        <iframe
          title={siteContent.venue.title}
          src={siteContent.venue.mapUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      <section id="qa" className="contentSection whiteSection qaSection">
        <h2>Q&amp;As</h2>
        {siteContent.questions.map((item) => (
          <article key={item.question}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </article>
        ))}
      </section>

      <section id="accommodations" className="contentSection navySection accommodationsSection">
        <h2>Accommodations</h2>
        {siteContent.accommodations.map((item) => (
          <article key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className="linkPair">
              <a href="#" aria-label={`${item.title} website`}>
                <LinkIcon size={16} />
                Go to Website
              </a>
              <a href="#" aria-label={`${item.title} map`}>
                <MapPin size={17} />
                View On Map
              </a>
            </div>
          </article>
        ))}
      </section>

      <section id="restaurants" className="contentSection whiteSection restaurantsSection">
        <h2>A Few Of Our Favorite Restaurants</h2>
        {siteContent.restaurants.map((item) => (
          <article key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section id="registry" className="contentSection navySection registrySection">
        <h2>Our Registry</h2>
        <p>{siteContent.registry.intro}</p>
        <div className="registryGrid">
          {siteContent.registry.stores.map((store) => (
            <a href="#" key={store}>
              {store}
            </a>
          ))}
        </div>
      </section>

      <div className="galleryImage">
        <Image
          src={siteContent.galleryImage.src}
          alt={siteContent.galleryImage.alt}
          fill
          sizes="(max-width: 767px) 100vw, 58vw"
        />
      </div>

      <section id="wedding-party" className="contentSection navySection partySection">
        <h2>Introducing Our Wedding Party</h2>
        {siteContent.weddingParty.map((person) => (
          <article key={`${person.name}-${person.role}`}>
            <h3>
              {person.name} | {person.role}
            </h3>
            <p>{person.description}</p>
          </article>
        ))}
        <footer>Made with RSVP</footer>
      </section>
    </>
  );
}
