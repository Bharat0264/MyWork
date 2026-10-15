import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import puppeteer from "puppeteer-core";

const CHROME_PATHS = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  process.env.CHROME_BIN,
  process.env.PUPPETEER_EXECUTABLE_PATH,
].filter(Boolean);

const executablePath = CHROME_PATHS.find((p) => fs.existsSync(p));

if (!executablePath) {
  console.error("No Chrome or Edge browser executable found on system.");
  process.exit(1);
}

const projects = [
  {
    slug: "rainbow-digi-school",
    title: "Rainbow Digi School",
    liveUrl: "https://rainbow-digi-school.vercel.app",
  },
  {
    slug: "printbee",
    title: "PrintBee",
    liveUrl: "https://www.printbee.co.in",
  },
  {
    slug: "aura-bi",
    title: "AURA BI",
    liveUrl: "https://ai-bi-platform-gud0.onrender.com/",
  },
  {
    slug: "royal-mechanics",
    title: "Royal Mechanics",
    liveUrl: "https://royal-mechanics-one.vercel.app/",
  },
  {
    slug: "earnova",
    title: "Earnova",
    liveUrl: "https://www.earnova.in/",
  },
  {
    slug: "anutek",
    title: "Anutek",
    liveUrl: "https://anutek.vercel.app",
  },
  {
    slug: "redesign-concept",
    title: "Website Redesign",
    liveUrl: null,
  },
];

const OUTPUT_DIR = path.resolve(process.cwd(), "public", "projects");
const TEMP_DIR = path.resolve(process.cwd(), ".temp_screenshots");
const PROCESSOR_SCRIPT = path.resolve(process.cwd(), "scripts", "process-images.py");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

async function capture() {
  console.log(`Starting screenshot capture using: ${executablePath}`);
  const browser = await puppeteer.launch({
    executablePath,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--window-size=1440,900",
    ],
  });

  const missingUrls = [];

  for (const project of projects) {
    console.log(`\n-----------------------------------------`);
    console.log(`Processing [${project.title}] (${project.slug})`);

    if (!project.liveUrl) {
      console.log(`⚠️  No live URL configured for ${project.slug}. Generating clean placeholder.`);
      missingUrls.push(project.slug);
      generatePlaceholder(project.slug, project.title);
      continue;
    }

    const page = await browser.newPage();
    await page.setViewport({
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
    });

    try {
      console.log(`Navigating to ${project.liveUrl}...`);
      await page.goto(project.liveUrl, {
        waitUntil: ["domcontentloaded", "networkidle2"],
        timeout: 45000,
      });

      // Wait additional 1.5s as required
      await new Promise((r) => setTimeout(r, 1500));

      // Hide cookie banners and chat widgets
      await page.evaluate(() => {
        const selectors = [
          "#cookie-notice",
          "#cookie-banner",
          ".cookie-banner",
          ".cookie-consent",
          '[id*="cookie"]',
          '[class*="cookie"]',
          '[id*="consent"]',
          '[class*="consent"]',
          "#crisp-chatbox",
          ".intercom-lightweight-app",
          "#hubspot-messages-iframe-container",
          '[class*="chat-widget"]',
          '[id*="chat-widget"]',
          "#tawk-bubble-container",
          "#launcher",
          ".drift-frame-controller",
        ];
        selectors.forEach((sel) => {
          document.querySelectorAll(sel).forEach((el) => {
            try {
              el.style.display = "none";
              el.style.opacity = "0";
              el.style.pointerEvents = "none";
            } catch (_) {}
          });
        });
      });

      const tempViewportPng = path.join(TEMP_DIR, `${project.slug}_viewport.png`);
      const tempFullPng = path.join(TEMP_DIR, `${project.slug}_full.png`);

      // Viewport screenshot
      await page.screenshot({
        path: tempViewportPng,
        fullPage: false,
      });

      // Full page screenshot
      await page.screenshot({
        path: tempFullPng,
        fullPage: true,
      });

      console.log(`Captured raw PNGs. Optimizing with Python Pillow to WebP...`);
      optimizeScreenshots(project.slug, tempViewportPng, tempFullPng);
      console.log(`✓ Saved /public/projects/${project.slug}.webp and -full.webp`);
    } catch (err) {
      console.error(`❌ Failed capturing ${project.liveUrl}:`, err.message);
      missingUrls.push(project.slug);
      generatePlaceholder(project.slug, project.title);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  // Cleanup temp dir
  try {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  } catch (_) {}

  console.log(`\n=========================================`);
  console.log(`All project screenshots processed!`);
  if (missingUrls.length > 0) {
    console.log(`Projects that need a live URL: ${missingUrls.join(", ")}`);
  }
}

function optimizeScreenshots(slug, viewportPng, fullPng) {
  execSync(
    `python "${PROCESSOR_SCRIPT}" optimize "${slug}" "${viewportPng}" "${fullPng}" "${OUTPUT_DIR}"`,
    { stdio: "inherit" }
  );
}

function generatePlaceholder(slug, title) {
  execSync(
    `python "${PROCESSOR_SCRIPT}" placeholder "${slug}" "${title}" "${OUTPUT_DIR}"`,
    { stdio: "inherit" }
  );
}

capture().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
