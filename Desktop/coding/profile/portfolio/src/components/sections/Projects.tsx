"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink } from "lucide-react";
import { soundManager } from "@/lib/sound";

gsap.registerPlugin(ScrollTrigger);

const categories = ["All", "Web", "Security", "Mobile"] as const;
type Category = (typeof categories)[number];

interface ProjectData {
  id: string;
  title: string;
  description: string;
  tech: string;
  category: string;
  githubUrl: string | null;
  liveUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  createdAt?: string;
}

const FALLBACK_PROJECTS: ProjectData[] = [
  {
    id: "1",
    title: "Portfolio Website",
    category: "Web",
    featured: true,
    description:
      "Cinematic personal portfolio with custom sound design, GSAP 3D animations, Prisma + MySQL backend, and a full admin CMS with JWT authentication.",
    tech: "Next.js 16, React 19, Prisma, MySQL, TypeScript",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&h=500&q=85",
    githubUrl: "https://github.com/mahadshah-cyber/portfolio-website",
    liveUrl: null,
  },
  {
    id: "2",
    title: "Security Auditor",
    category: "Security",
    featured: true,
    description:
      "Automated network security auditing tool with multi-threaded port scanning, service banner detection, CVE matching, and OWASP-aligned HTML reports.",
    tech: "Python, Socket, Threading, HTML",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&h=500&q=85",
    githubUrl: "https://github.com/mahadshah-cyber/security-auditor",
    liveUrl: null,
  },
  {
    id: "3",
    title: "E-Commerce Platform",
    category: "Web",
    featured: false,
    description:
      "Full-stack e-commerce platform with JWT auth, shopping cart, Stripe payment integration, product management, and a complete admin dashboard.",
    tech: "React, Node.js, Express, MongoDB, Stripe",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&h=500&q=85",
    githubUrl: "https://github.com/mahadshah-cyber/ecommerce-platform",
    liveUrl: "https://client-flax-seven-43.vercel.app",
  },
  {
    id: "4",
    title: "Encryption Tool",
    category: "Security",
    featured: false,
    description:
      "JavaFX desktop application for AES-256 GCM and RSA-2048 encryption/decryption with key generation and a dark-themed GUI.",
    tech: "Java 17, JavaFX, Maven, Crypto API",
    imageUrl: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&h=500&q=85",
    githubUrl: "https://github.com/mahadshah-cyber/encryption-tool",
    liveUrl: null,
  },
  {
    id: "5",
    title: "Web Vulnerability Scanner",
    category: "Security",
    featured: false,
    description:
      "Python-based web vulnerability scanner that detects XSS (8+ payloads), SQL injection (error-based), and missing CSRF tokens, with a Flask dashboard and Docker support.",
    tech: "Python, Flask, SQLite, Docker, HTML",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&h=500&q=85",
    githubUrl: "https://github.com/mahadshah-cyber/web-vulnerability-scanner",
    liveUrl: "https://web-vulnerability-scanner-rust.vercel.app",
  },
  {
    id: "6",
    title: "Mobile Security App",
    category: "Mobile",
    featured: false,
    description:
      "Cross-platform React Native app with AES-256 encrypted vault, secure notes, device security scanning, and biometric PIN lock protection.",
    tech: "React Native, Expo, CryptoJS, AsyncStorage",
    imageUrl: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=800&h=500&q=85",
    githubUrl: "https://github.com/mahadshah-cyber/mobile-security-app",
    liveUrl: null,
  },
];

const categoryAccents: Record<string, string> = {
  Web: "#FF2020",
  Security: "#2563EB",
  Mobile: "#F43F5E",
};

function getProjectImageSrc(project: ProjectData) {
  if (project.imageUrl && !project.imageUrl.endsWith(".svg")) {
    return project.imageUrl;
  }

  const titleLower = project.title.toLowerCase();

  const PREMIUM_IMAGES = {
    portfolio: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&h=500&q=85",
    auditor: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&h=500&q=85",
    ecommerce: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&h=500&q=85",
    encryption: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&h=500&q=85",
    scanner: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&h=500&q=85",
    mobile: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=800&h=500&q=85",
    ctf: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&h=500&q=85",
  };

  if (titleLower.includes("portfolio")) return PREMIUM_IMAGES.portfolio;
  if (titleLower.includes("auditor")) return PREMIUM_IMAGES.auditor;
  if (titleLower.includes("e-commerce") || titleLower.includes("commerce")) return PREMIUM_IMAGES.ecommerce;
  if (titleLower.includes("encryption") || titleLower.includes("suite") || titleLower.includes("cryptography")) return PREMIUM_IMAGES.encryption;
  if (titleLower.includes("scanner") || titleLower.includes("vulnerability")) return PREMIUM_IMAGES.scanner;
  if (titleLower.includes("mobile") || titleLower.includes("phone")) return PREMIUM_IMAGES.mobile;
  if (titleLower.includes("ctf") || titleLower.includes("challenge") || titleLower.includes("dashboard")) return PREMIUM_IMAGES.ctf;

  let hash = 0;
  for (let i = 0; i < project.id.length; i++) {
    hash = project.id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % 7;
  const list = Object.values(PREMIUM_IMAGES);
  return list[index];
}

function ProjectCard({
  project,
  index,
}: {
  project: ProjectData;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const hologramRef = useRef<HTMLDivElement>(null);
  const isSecurity = project.category === "Security";
  const [classified, setClassified] = useState(false);

  const accent = categoryAccents[project.category] || "#FF2020";
  const techs = project.tech
    ? project.tech
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!innerRef.current || !hologramRef.current) return;
    const rect = innerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Parallax Tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = -(x - centerX) / 15;

    // Keep the 3D parallax + add a subtle "cinematic magnet" translation
    // (no Magnetic component dependency).
    gsap.to(innerRef.current, {
      rotateX,
      rotateY,
      duration: 0.35,
      ease: "power2.out",
    });

    const dx = ((x - centerX) / rect.width) * 10; // px
    const dy = ((y - centerY) / rect.height) * 8; // px

    gsap.to(cardRef.current, {
      x: dx,
      y: dy,
      duration: 0.35,
      ease: "power2.out",
    });

    // Hologram position
    const hx = (x / rect.width) * 100;
    const hy = (y / rect.height) * 100;
    hologramRef.current.style.setProperty("--mouse-x", `${hx}%`);
    hologramRef.current.style.setProperty("--mouse-y", `${hy}%`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!innerRef.current) return;
    gsap.to(innerRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.35,
      ease: "power2.out",
    });

    if (cardRef.current) {
      gsap.to(cardRef.current, {
        x: 0,
        y: 0,
        duration: 0.35,
        ease: "power2.out",
      });
    }

    setClassified(false);
  }, []);

  useEffect(() => {
    if (!cardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 60, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          delay: index * 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, cardRef);
    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="group relative perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={(e) => {
        if (isSecurity) setClassified(true);
        const pan = (e.clientX / window.innerWidth - 0.5) * 2;
        soundManager.hover(pan);
      }}
    >
      <div
        ref={innerRef}
        className="relative rounded-2xl overflow-hidden glass-card transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,32,32,0.15)] bg-zinc-950/50"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Holographic shimmer */}
        <div
          ref={hologramRef}
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10 rounded-2xl"
          style={{
            background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06) 0%, transparent 70%)`,
          }}
        />

        {/* Laser scan line on hover */}
        <div className="laser-scan-line" />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-20 opacity-70 transition-opacity group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          }}
        />

        {/* Image */}
        <div
          className="relative h-52 overflow-hidden"
          style={{ transform: "translateZ(30px)" }}
        >
          <Image
            src={getProjectImageSrc(project)}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-10" />

          {/* Category badge */}
          <div className="absolute top-3 right-3 z-20">
            <span
              className="text-[9px] font-accent tracking-widest uppercase px-3 py-1.5 rounded-full backdrop-blur-md border shadow-2xl"
              style={{
                color: accent,
                borderColor: `${accent}40`,
                background: "rgba(0,0,0,0.7)",
              }}
            >
              {project.category}
            </span>
          </div>

          {/* CLASSIFIED stamp */}
          {isSecurity && classified && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <span className="classified-stamp text-xl font-bold text-red-500/90 font-accent tracking-[0.25em] border-4 border-red-500/80 px-6 py-3 uppercase -rotate-12 animate-in zoom-in duration-300">
                Classified
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className="p-6 relative z-10 bg-zinc-950/40 backdrop-blur-sm"
          style={{ transform: "translateZ(20px)" }}
        >
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors duration-300 leading-tight">
            {project.title}
          </h3>
          <p className="text-zinc-500 text-xs leading-relaxed line-clamp-3 mb-5 h-12">
            {project.description}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {techs.slice(0, 4).map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 text-[9px] rounded-md bg-zinc-900/80 border border-zinc-800 text-zinc-400 font-mono uppercase tracking-wider"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Links */}
          {(project.githubUrl || project.liveUrl) && (
            <div className="flex items-center gap-5 pt-4 border-t border-zinc-800/30">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[11px] text-zinc-500 hover:text-white transition-all duration-300"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Source
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[11px] text-zinc-500 hover:text-white transition-all duration-300"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Live Demo
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [projects, setProjects] = useState<ProjectData[]>(FALLBACK_PROJECTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) return;
        const data = await res.json();
        if (data.projects && data.projects.length > 0) {
          setProjects(data.projects);
        }
      } catch {
        // Keep fallback data
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  // Removed the "intro header" stagger animation.
  // Replaced with a more graphical editor-like reveal using an animated grid + scanline overlay.

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".project-card-wrapper");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" },
    );
  }, [activeCategory]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative py-28 lg:py-36 overflow-hidden bg-black"
    >
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span
          className="text-[14vw] font-accent font-bold tracking-[0.25em]"
          style={{ color: "rgba(255,255,255,0.012)", whiteSpace: "nowrap" }}
        >
          PROJECTS
        </span>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,0,0,0.06),transparent_65%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Header */}
        <div ref={headerRef} className="relative text-center mb-14">
          {/* Graph/editor-style overlay */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            {/* grid */}
            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                transform: "translateZ(0)",
              }}
            />
            {/* animated scan line */}
            <div className="absolute left-0 right-0 h-[2px] bg-red-400/70 blur-[0.2px]" />
            <div
              className="absolute inset-x-[-20%] h-40 bg-[radial-gradient(closest-side,rgba(255,32,32,0.35),transparent)]"
              style={{ top: "40%" }}
            />
          </div>

          <p className="text-red-500 text-xs tracking-[0.3em] uppercase font-accent mb-3">
            Portfolio
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            Featured <span className="text-gradient-cinematic">Projects</span>
          </h2>
          <div className="section-line" />
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={(e) => {
                setActiveCategory(cat);
                const pan = (e.clientX / window.innerWidth - 0.5) * 2;
                soundManager.click(pan);
              }}
              onMouseEnter={(e) => {
                const pan = (e.clientX / window.innerWidth - 0.5) * 2;
                soundManager.hover(pan);
              }}
              className={`interactive px-6 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-500 ${
                activeCategory === cat
                  ? "bg-red-600 text-white shadow-[0_0_20px_rgba(255,32,32,0.4)] scale-105"
                  : "bg-zinc-900/40 text-zinc-500 hover:text-white border border-zinc-800 hover:border-red-500/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {filtered.map((project, i) => (
            <div key={project.id} className="project-card-wrapper">
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-zinc-600 text-sm font-mono tracking-wider">
              NO PROJECTS FOUND IN THIS CLUSTER.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
