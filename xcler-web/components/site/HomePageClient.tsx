"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "@/app/(site)/page.module.css";

type Service = {
  title: string;
  description: string;
  icon: "web" | "app" | "automation" | "ai" | "cms" | "api";
};

type Project = {
  name: string;
  tags: string;
  description: string;
};

type Team = {
  name: string;
  role: string;
  initials: string;
  skills: string[];
};

type Testimonial = {
  quote: string;
  author: string;
};

type HomePageClientProps = {
  projects: Project[];
  team: Team[];
  testimonials: Testimonial[];
};

const services: Service[] = [
  {
    title: "Web Development",
    description: "Custom websites and web apps that convert.",
    icon: "web",
  },
  {
    title: "App Development",
    description: "Mobile and desktop apps built for scale.",
    icon: "app",
  },
  {
    title: "Workflow Automation",
    description: "Make.com, n8n, Zapier, GoHighLevel pipelines.",
    icon: "automation",
  },
  {
    title: "AI Agents & Chatbots",
    description: "RAG agents, call agents, LLM-powered tools.",
    icon: "ai",
  },
  {
    title: "WordPress & Shopify",
    description: "CMS-powered sites, fast and maintainable.",
    icon: "cms",
  },
  {
    title: "Backend & APIs",
    description: "FastAPI, Flask, CI/CD, and infrastructure.",
    icon: "api",
  },
];

const navLinks = ["Services", "Projects", "Blog", "About"];

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggered = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
    },
  },
};

function StatCounter({
  to,
  suffix,
  label,
}: {
  to: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const duration = 900;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.floor(progress * to));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to]);

  return (
    <div className={styles.statItem} ref={ref}>
      <strong className={styles.statValue}>
        {value}
        {suffix ?? ""}
      </strong>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

function ServiceIcon({ type }: { type: Service["icon"] }) {
  const path = useMemo(() => {
    switch (type) {
      case "web":
        return "M3 5h18v14H3z M8 3v4 M16 3v4";
      case "app":
        return "M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M11 18h2";
      case "automation":
        return "M4 7h8M12 7l-2-2m2 2-2 2M20 17h-8m0 0 2-2m-2 2 2 2";
      case "ai":
        return "M12 3v4M12 17v4M3 12h4m10 0h4M6 6l3 3m6 6 3 3m0-12-3 3m-6 6-3 3";
      case "cms":
        return "M4 6h16v12H4z M4 10h16 M9 6v12";
      case "api":
      default:
        return "M7 7h10v10H7z M3 12h4m10 0h4M12 3v4m0 10v4";
    }
  }, [type]);

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.serviceIcon}>
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

export default function HomePageClient({ projects, team, testimonials }: HomePageClientProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [isInteractiveHover, setIsInteractiveHover] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      setPointer({ x: event.clientX, y: event.clientY });
      const target = event.target as HTMLElement | null;
      setIsInteractiveHover(Boolean(target?.closest("a, button")));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <main className={styles.page}>
      <div
        className={`${styles.cursor} ${
          isInteractiveHover ? styles.cursorLarge : ""
        }`}
        style={{ transform: `translate(${pointer.x - 6}px, ${pointer.y - 6}px)` }}
        aria-hidden="true"
      />

      <div
        className={styles.gridBackdrop}
        style={{
          transform: `translate3d(${(pointer.x - 500) * 0.01}px, ${
            (pointer.y - 400) * 0.01
          }px, 0)`,
        }}
        aria-hidden="true"
      />

      <header className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ""}`}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo}>
            XCLER
          </Link>

          <button
            className={styles.mobileToggle}
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ""}`}>
            {navLinks.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className={styles.navActions}>
            <button
              className={styles.themeToggle}
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label="Toggle dark mode"
            >
              {mounted && isDark ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.2 2.2m8.4 8.4 2.2 2.2m0-12.8-2.2 2.2M7.8 16.2l-2.2 2.2M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M21 13a8 8 0 1 1-10-10 7 7 0 1 0 10 10z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              )}
            </button>
            <a className={styles.primaryButton} href="#contact">
              Start a project →
            </a>
          </div>
        </div>
      </header>

      <section className={styles.hero} id="top">
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggered}
          className={styles.heroContent}
        >
          <motion.h1 variants={fadeInUp} className={styles.heroTitle}>
            <span>We build</span>
            <span>
              <em>digital things</em>
            </span>
            <span>that work.</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className={styles.heroSubtitle}>
            Web apps, automation, and AI systems for businesses that mean
            business.
          </motion.p>
          <motion.div variants={fadeInUp} className={styles.heroCtas}>
            <a href="#projects" className={styles.outlineButton}>
              See our work ↓
            </a>
            <a
              href="https://wa.me/923154823517"
              target="_blank"
              rel="noreferrer"
              className={styles.primaryButton}
            >
              WhatsApp us
            </a>
          </motion.div>
        </motion.div>

        <div className={styles.marqueeWrap}>
          <div className={styles.marqueeTrack}>
            <span>
              WEB DEVELOPMENT · APP DEVELOPMENT · WORKFLOW AUTOMATION · AI
              AGENTS · CHATBOTS · WORDPRESS · SHOPIFY · NEXT.JS · N8N ·
              MAKE.COM ·
            </span>
            <span>
              WEB DEVELOPMENT · APP DEVELOPMENT · WORKFLOW AUTOMATION · AI
              AGENTS · CHATBOTS · WORDPRESS · SHOPIFY · NEXT.JS · N8N ·
              MAKE.COM ·
            </span>
          </div>
        </div>
      </section>

      <section className={styles.statsBar}>
        <StatCounter to={3} suffix="+" label="Years experience" />
        <StatCounter to={20} suffix="+" label="Projects delivered" />
        <StatCounter to={3} label="Specialists on team" />
        <StatCounter to={100} suffix="%" label="Client retention" />
      </section>

      <motion.section
        className={styles.section}
        id="services"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggered}
      >
        <motion.h2 variants={fadeInUp}>What we do</motion.h2>
        <motion.p variants={fadeInUp} className={styles.sectionLead}>
          End-to-end digital execution — from idea to shipped product.
        </motion.p>
        <motion.div variants={fadeInUp} className={styles.servicesGrid}>
          {services.map((service) => (
            <article key={service.title} className={styles.serviceCard}>
              <ServiceIcon type={service.icon} />
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className={styles.priceBadge}>From €150</span>
            </article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className={styles.section}
        id="projects"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggered}
      >
        <motion.h2 variants={fadeInUp}>Selected work</motion.h2>
        <motion.div variants={fadeInUp} className={styles.projectsGrid}>
          {projects.map((project, index) => (
            <article key={project.name} className={styles.projectCard}>
              <span className={styles.projectNumber}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className={styles.projectTitle}>{project.name}</h3>
              <p className={styles.projectTags}>{project.tags}</p>
              <p className={styles.projectDescription}>{project.description}</p>
            </article>
          ))}
        </motion.div>
        <motion.a variants={fadeInUp} href="#projects" className={styles.inlineLink}>
          View all projects →
        </motion.a>
      </motion.section>

      <motion.section
        className={styles.section}
        id="blog"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggered}
      >
        <motion.h2 variants={fadeInUp}>Blog</motion.h2>
        <motion.p variants={fadeInUp} className={styles.sectionLead}>
          Notes on product delivery, automation systems, and practical growth.
        </motion.p>
      </motion.section>

      <motion.section
        className={styles.section}
        id="about"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggered}
      >
        <motion.h2 variants={fadeInUp}>The people behind it</motion.h2>
        <motion.div variants={fadeInUp} className={styles.teamGrid}>
          {team.map((person) => (
            <article key={person.name} className={styles.teamCard}>
              <div className={styles.avatar}>{person.initials}</div>
              <h3>{person.name}</h3>
              <p>{person.role}</p>
              <div className={styles.tags}>
                {person.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className={styles.section}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggered}
      >
        <motion.h2 variants={fadeInUp}>What clients say</motion.h2>
        <motion.div variants={fadeInUp} className={styles.testimonialGrid}>
          {testimonials.map((entry) => (
            <article key={entry.author} className={styles.testimonialCard}>
              <span className={styles.quoteMark}>“</span>
              <p>{entry.quote}</p>
              <small>{entry.author}</small>
            </article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className={styles.section}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggered}
      >
        <motion.h2 variants={fadeInUp}>Simple, transparent pricing</motion.h2>
        <motion.div variants={fadeInUp} className={styles.pricingGrid}>
          <article className={styles.pricingCard}>
            <h3>Starter</h3>
            <strong>from €150</strong>
            <p>for small businesses and single features</p>
          </article>
          <article className={styles.pricingCard}>
            <h3>Full Project</h3>
            <strong>from €500</strong>
            <p>for complete products and systems</p>
          </article>
        </motion.div>
        <motion.p variants={fadeInUp} className={styles.customLine}>
          Need something custom? Let&apos;s talk.{" "}
          <a href="https://wa.me/923154823517" target="_blank" rel="noreferrer">
            WhatsApp us
          </a>
        </motion.p>
      </motion.section>

      <section className={styles.finalCta} id="contact">
        <h2>Ready to build something real?</h2>
        <p>
          Tell us what you need. We&apos;ll get back to you on WhatsApp within
          24 hours.
        </p>
        <Link href="/contact" className={styles.primaryButton}>
          Start your project →
        </Link>
        <a href="mailto:hello@xcler.dev" className={styles.emailLink}>
          hello@xcler.dev
        </a>
      </section>

      <footer className={styles.footer}>
        <div>
          <h3 className={styles.logo}>XCLER</h3>
          <p>Digital agency built for results.</p>
        </div>
        <div>
          <h4>Services</h4>
          <ul>
            <li>Web Development</li>
            <li>App Development</li>
            <li>Automation</li>
          </ul>
        </div>
        <div>
          <h4>Pages</h4>
          <ul>
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#projects">Projects</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li>
              <a href="mailto:hello@xcler.dev">hello@xcler.dev</a>
            </li>
            <li>
              <a href="https://wa.me/923154823517" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </li>
            <li className={styles.socials}>
              <a href="https://www.facebook.com/xcler.dev" aria-label="Facebook">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M13.5 9H16V6h-2.5C10.7 6 10 7.7 10 10v2H8v3h2v5h3v-5h2.4l.6-3H13v-1.7c0-.8.2-1.3 1.5-1.3z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a href="https://www.instagram.com/xcler.dev" aria-label="Instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7zm5 3.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm4.5-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2025 Xcler. All rights reserved.</span>
          <span>Germany · Pakistan</span>
        </div>
      </footer>

      <a
        href="https://wa.me/923154823517"
        target="_blank"
        rel="noreferrer"
        className={styles.whatsAppFloat}
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3zm0 1.8a7.2 7.2 0 0 1 6.2 10.8l-.2.3.7 2.7-2.8-.7-.3.2A7.2 7.2 0 1 1 12 4.8zm-3 3.7c-.2 0-.4.1-.6.3-.3.3-.8 1-.8 2.3s.9 2.6 1 2.8c.1.2 1.8 2.9 4.5 4 .6.3 1.1.4 1.5.5.6.2 1.1.1 1.5.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1 .1-1.2l-.9-.4c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.6.1l-.5.6c-.2.2-.3.2-.6.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.5-1.8-.2-.3 0-.4.1-.6l.4-.5c.1-.1.2-.3.3-.4.1-.1 0-.3 0-.4l-.6-1.6c-.2-.5-.4-.4-.6-.4H9z"
            fill="currentColor"
          />
        </svg>
      </a>
    </main>
  );
}
