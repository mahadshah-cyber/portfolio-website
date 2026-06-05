import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  // Clear existing entries to prevent duplicate primary keys
  await prisma.project.deleteMany({});
  await prisma.post.deleteMany({});

  // Seed 6 Real Projects
  const projects = [
    {
      title: "Portfolio Website",
      description: "Cinematic personal portfolio with custom sound design, GSAP 3D animations, Prisma + MySQL backend, and a full admin CMS with JWT authentication.",
      tech: "Next.js 16, React 19, Prisma, MySQL, TypeScript",
      category: "Web",
      githubUrl: "https://github.com/mahadshah-cyber/portfolio-website",
      liveUrl: null,
      featured: true,
    },
    {
      title: "Security Auditor",
      description: "Automated network security auditing tool with multi-threaded port scanning, service banner detection, CVE matching, and OWASP-aligned HTML reports.",
      tech: "Python, Socket, Threading, HTML",
      category: "Security",
      githubUrl: "https://github.com/mahadshah-cyber/security-auditor",
      liveUrl: null,
      featured: true,
    },
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce platform with JWT auth, shopping cart, Stripe payment integration, product management, and a complete admin dashboard.",
      tech: "React, Node.js, Express, MongoDB, Stripe",
      category: "Web",
      githubUrl: "https://github.com/mahadshah-cyber/ecommerce-platform",
      liveUrl: "https://client-flax-seven-43.vercel.app",
      featured: false,
    },
    {
      title: "Encryption Tool",
      description: "JavaFX desktop application for AES-256 GCM and RSA-2048 encryption/decryption with key generation and a dark-themed GUI.",
      tech: "Java 17, JavaFX, Maven, Crypto API",
      category: "Security",
      githubUrl: "https://github.com/mahadshah-cyber/encryption-tool",
      liveUrl: null,
      featured: false,
    },
    {
      title: "Web Vulnerability Scanner",
      description: "Python-based web vulnerability scanner that detects XSS (8+ payloads), SQL injection (error-based), and missing CSRF tokens, with a Flask dashboard and Docker support.",
      tech: "Python, Flask, SQLite, Docker, HTML",
      category: "Security",
      githubUrl: "https://github.com/mahadshah-cyber/web-vulnerability-scanner",
      liveUrl: "https://web-vulnerability-scanner-rust.vercel.app",
      featured: false,
    },
    {
      title: "Mobile Security App",
      description: "Cross-platform React Native app with AES-256 encrypted vault, secure notes, device security scanning, and biometric PIN lock protection.",
      tech: "React Native, Expo, CryptoJS, AsyncStorage",
      category: "Mobile",
      githubUrl: "https://github.com/mahadshah-cyber/mobile-security-app",
      liveUrl: null,
      featured: false,
    }
  ];

  for (const p of projects) {
    await prisma.project.create({ data: p });
  }

  // Seed Premium Blog Posts
  const posts = [
    {
      title: "Inside SQL Injection: Attack Mechanics & Safe Remediations",
      slug: "inside-sql-injection-mechanics-remediations",
      excerpt: "An in-depth analysis of how raw SQL compilers interpret untrusted inputs, illustrating standard blind and union-based exploitation, alongside parameterized query mitigations.",
      content: `<h2>Understanding the Vulnerability</h2><p>SQL Injection (SQLi) occurs when malicious SQL statements are injected into entry fields for execution. This happens when applications concatenate user inputs directly into raw SQL query strings instead of using parameterized queries.</p><h3>The Exploitation Vector</h3><p>Consider an unsafe authentication query:</p><pre><code>SELECT * FROM users WHERE email = ' + userInput + ' AND password = ' + passwordInput + '</code></pre><p>If an attacker inputs <code>admin@example.com' OR '1'='1</code> as the email, the query compiles as:</p><pre><code>SELECT * FROM users WHERE email = 'admin@example.com' OR '1'='1' AND password = '...'</code></pre><p>Since <code>'1'='1'</code> evaluates to true, the query bypasses validation entirely, granting unauthorized administrative control.</p><h3>Robust Remediations</h3><p>To eliminate SQLi surfaces permanently, developers must adopt:</p><ul><li><b>Parameterized Queries (Prepared Statements):</b> Forces the database compiler to treat input as literal data, never as executable code.</li><li><b>ORM Engines:</b> Modern engines like Prisma compile parameterized ciphers by default, eliminating manual concatenation mistakes.</li></ul>`,
      published: true,
    },
    {
      title: "Securing Modern Next.js Frameworks: OWASP Surface Audits",
      slug: "securing-modern-nextjs-owasp-surface-audits",
      excerpt: "Analyzing standard security vectors in Next.js Server Components, evaluating secure API authorizations, CORS shielding, and JWT cookie sanitizations.",
      content: `<h2>The Security Surface of Next.js</h2><p>Next.js blends server-side execution and client-side hydrations seamlessly. However, this hybrid topology introduces unique security considerations.</p><h3>1. Server Actions & CSRF Risks</h3><p>Server Actions execute on the server but are invoked from client triggers. Without proper verification, they can be vulnerable to Cross-Site Request Forgery (CSRF). Ensure you validate Origin and Referer headers inside your actions.</p><h3>2. Sanitizing JWT Cookies</h3><p>Administrative authentication tokens should never be stored in local storage, which is vulnerable to Cross-Site Scripting (XSS). Store tokens exclusively inside <b>HTTP-only, Secure, SameSite=Lax</b> cookies.</p><h3>3. Relational Queries (Prisma Shielding)</h3><p>Ensure that database queries do not leak sensitive columns. When querying models, explicitly use selection lists:</p><pre><code>prisma.user.findMany({ select: { email: true, name: true } })</code></pre>`,
      published: true,
    }
  ];

  for (const post of posts) {
    await prisma.post.create({ data: post });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
