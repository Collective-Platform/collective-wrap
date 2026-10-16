// Magazine pages for Collective's 2025 Wrap. Each page is a 2D canvas that
// becomes a texture on one side of a sheet (aspect 1 : 1.377). Copy and
// numbers come from the wrap's storyData.ts. Photo pages play the wrap's
// videos: the still is shown until the video has a frame, then main.js calls
// canvas.redraw() each frame to paint the video under the page's text.

export const PAGE_W = 1024;
export const PAGE_H = Math.round(PAGE_W * 1.377);

// Brand tokens from the wrap's global.css.
const CREAM = '#fff0de'; // cream-50
const STONE = '#1b1918'; // stone-900
const RED = '#fa0000'; // red-500
const MUTED = '#8c8580';
const DISPLAY = '"GC", Impact, sans-serif';
const SERIF = '"Foriene", Georgia, serif';
const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif';
const CN = '"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", sans-serif';
const M = 80; // page margin

// Videos are the wrap's own Vercel Blob uploads (same ones storyData.ts uses).
const BLOB = 'https://mqyxc4xvodvuodmx.public.blob.vercel-storage.com/updated/';

const LOGO_PATHS = [
  'M0 5.18811C0 2.07796 1.83497 0 4.84015 0C7.35743 0 8.94166 1.39179 9.20602 3.54752L6.8287 3.96542C6.68875 2.65722 5.96563 1.89136 4.78377 1.89136C3.28118 1.89136 2.40646 3.15877 2.40646 5.17454C2.40646 7.13588 3.2968 8.44215 4.85382 8.44215C5.95209 8.44215 6.6888 7.69184 6.88318 6.41279L9.2624 6.92589C8.79005 9.01358 7.26026 10.3491 4.81101 10.3491C1.67754 10.3491 0 8.30409 0 5.18811Z',
  'M10.7164 5.17454C10.7164 1.99052 12.6214 0 15.576 0C18.5307 0 20.4454 1.99052 20.4454 5.17454C20.4454 8.35855 18.5385 10.3491 15.576 10.3491C12.6136 10.3491 10.7164 8.34495 10.7164 5.17454ZM18.0331 5.17454C18.0331 3.08879 17.1292 1.83697 15.5838 1.83697C14.0385 1.83697 13.1229 3.08879 13.1229 5.17454C13.1229 7.26028 14.0404 8.5121 15.5838 8.5121C17.1272 8.5121 18.0331 7.26028 18.0331 5.17454Z',
  'M22.5797 0.237183H24.9317V8.20694H28.936V10.1119H22.5797V0.237183Z',
  'M30.981 0.237183H33.3311V8.20694H37.3374V10.1119H30.981V0.237183Z',
  'M46.2383 8.3819V10.1197H39.3804V0.244995H46.1411V1.96721H41.7324V4.19295H45.9039V5.91707H41.7324V8.3819H46.2383Z',
  'M47.8788 5.18811C47.8788 2.07796 49.7157 0 52.7189 0C55.2362 0 56.8224 1.39179 57.0868 3.54752L54.7075 3.96542C54.5695 2.65722 53.8444 1.89136 52.6626 1.89136C51.1619 1.89136 50.2852 3.15877 50.2852 5.17454C50.2852 7.13588 51.1755 8.44215 52.7325 8.44215C53.8308 8.44215 54.5695 7.69184 54.7639 6.41279L57.1412 6.92589C56.6688 9.01358 55.139 10.3491 52.6917 10.3491C49.5679 10.3491 47.8788 8.30409 47.8788 5.18811Z',
  'M66.1257 2.1013H63.2468V10.1119H60.9142V2.1013H58.049V0.237183H66.1296L66.1257 2.1013Z',
  'M67.9335 10.1119V0.237183H70.2855V10.1119H67.9335Z',
  'M72.0369 0.237183H74.5406L76.3756 6.60716C76.5165 7.05115 76.6193 7.50637 76.6827 7.96786H76.7371C76.8062 7.50619 76.9134 7.05107 77.0578 6.60716L78.8928 0.237183H81.3966L78.0726 10.1119H75.3512L72.0369 0.237183Z',
  'M90 8.3819V10.1197H83.144V0.244995H89.9028V1.96721H85.4941V4.19295H89.6656V5.91707H85.4941V8.3819H90Z',
].map((d) => new Path2D(d));

function logo(ctx, x, y, width, color) {
  const s = width / 90;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = color;
  LOGO_PATHS.forEach((p) => ctx.fill(p));
  ctx.restore();
}

function text(ctx, str, x, y, { font = SANS, size = 22, weight = 400, style = '', color = STONE, align = 'left', tracking = 0 } = {}) {
  ctx.font = `${style} ${weight} ${size}px ${font}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.letterSpacing = `${tracking}px`;
  ctx.fillText(str, x, y);
  ctx.letterSpacing = '0px';
}

// Word-wraps by measured width (the fonts are proportional). Splits CJK text
// per character since it has no spaces. Returns the y below the last line.
function paragraph(ctx, str, x, y, width, { font = SERIF, size = 40, lineHeight = 1.2, weight = 400, style = '', color = STONE } = {}) {
  ctx.font = `${style} ${weight} ${size}px ${font}`;
  const cjk = /[　-鿿]/.test(str);
  const tokens = cjk ? [...str] : str.split(' ');
  const lines = [];
  let line = '';
  for (const t of tokens) {
    const next = cjk ? line + t : (line ? `${line} ${t}` : t);
    if (line && ctx.measureText(next).width > width) {
      lines.push(line);
      line = t;
    } else {
      line = next;
    }
  }
  lines.push(line);
  lines.forEach((l, i) => text(ctx, l, x, y + i * size * lineHeight, { font, size, weight, style, color }));
  return y + (lines.length - 1) * size * lineHeight;
}

function rule(ctx, y, color, x0 = M, x1 = PAGE_W - M, w = 2) {
  ctx.fillStyle = color;
  ctx.fillRect(x0, y, x1 - x0, w);
}

function kicker(ctx, label, color) {
  text(ctx, label.toUpperCase(), M, M + 40, { size: 18, weight: 700, tracking: 4, color });
  text(ctx, '2025 WRAPPED', PAGE_W - M, M + 40, { size: 18, weight: 700, tracking: 4, color, align: 'right' });
  rule(ctx, M + 64, color);
}

// Page numbers count the cover as 1, matching the HUD.
function folio(ctx, index, color) {
  const left = index % 2 === 1;
  const y = PAGE_H - 48;
  text(ctx, String(index + 1).padStart(2, '0'), left ? M : PAGE_W - M, y, {
    size: 16, color, align: left ? 'left' : 'right',
  });
  logo(ctx, left ? PAGE_W - M - 90 : M, y - 12, 90, color);
}

// Largest size (up to max) at which str fits in width.
function fitSize(ctx, str, font, width, max) {
  ctx.font = `400 ${max}px ${font}`;
  ctx.letterSpacing = '0px';
  return Math.min(max, Math.floor(max * width / ctx.measureText(str).width));
}

function cover(ctx, img) {
  if (!img) return; // stills aren't in the repo; the page fills in once its video has a frame
  const w = img.videoWidth || img.width, h = img.videoHeight || img.height;
  const s = Math.max(PAGE_W / w, PAGE_H / h);
  ctx.drawImage(img, (PAGE_W - w * s) / 2, (PAGE_H - h * s) / 2, w * s, h * s);
}

function shade(ctx, y0, y1, alpha) {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, 'rgba(27,25,24,0)');
  g.addColorStop(1, `rgba(27,25,24,${alpha})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, Math.min(y0, y1), PAGE_W, Math.abs(y1 - y0));
}

// ─── Page templates ──────────────────────────────────────────────────────────

const THEMES = {
  cream: { bg: CREAM, ink: STONE, number: RED, muted: MUTED },
  dark: { bg: STONE, ink: CREAM, number: RED, muted: '#9a928b' },
  red: { bg: RED, ink: CREAM, number: CREAM, muted: '#ffc9c0' },
};

// A big-number page: lead-in, the number, the rest of the sentence, then the
// story's subtitle and its Chinese translation.
function stat({ theme, label, lead, number, after, sub, cn }) {
  const t = THEMES[theme];
  return {
    bg: t.bg,
    draw(ctx, index) {
      kicker(ctx, label, t.ink);
      const w = PAGE_W - M * 2;
      let y = paragraph(ctx, lead, M, 250, w, { size: 50, color: t.ink });
      const size = fitSize(ctx, number, DISPLAY, w, 520);
      y += size * 0.86 + 40;
      text(ctx, number, M - 6, y, { font: DISPLAY, size, color: t.number });
      y = paragraph(ctx, after, M, y + 130, w, { size: 50, color: t.ink });
      if (sub) {
        rule(ctx, y + 60, t.ink, M, M + 120, 3);
        y = paragraph(ctx, sub, M, y + 140, w, { size: 36, style: 'italic', color: t.ink });
      }
      if (cn) paragraph(ctx, cn, M, Math.max(y + 80, PAGE_H - 200), w, { font: CN, size: 30, lineHeight: 1.5, color: t.muted });
      folio(ctx, index, t.muted);
    },
  };
}

function photo({ src, video, label, caption }) {
  return {
    bg: STONE,
    src,
    video,
    draw(ctx, index, img) {
      cover(ctx, img);
      shade(ctx, PAGE_H * 0.55, PAGE_H, 0.85);
      shade(ctx, 260, 0, 0.45);
      text(ctx, label.toUpperCase(), M, M + 40, { size: 18, weight: 700, tracking: 4, color: CREAM });
      paragraph(ctx, caption, M, PAGE_H - 200, PAGE_W - M * 2, { size: 44, style: 'italic', color: CREAM });
      folio(ctx, index, CREAM);
    },
  };
}

const GIVE_URL = 'https://give.collective.my/';
const GIVE_BUTTON = [M, PAGE_H - 300, 300, 96]; // x, y, w, h in page px

// ─── The issue ───────────────────────────────────────────────────────────────

const PAGES = [
  // 0 — cover
  {
    bg: STONE,
    src: 'photos/global-kids.jpg',
    video: BLOB + 'collective-global.mp4',
    draw(ctx, index, img) {
      cover(ctx, img);
      shade(ctx, PAGE_H * 0.35, 0, 0.9);
      shade(ctx, PAGE_H * 0.55, PAGE_H, 0.9);
      logo(ctx, M, M, 200, CREAM);
      text(ctx, 'ISSUE 2025', PAGE_W - M, M + 22, { size: 20, weight: 700, tracking: 4, color: CREAM, align: 'right' });
      const size = fitSize(ctx, 'WRAPPED', DISPLAY, PAGE_W - M * 2, 400);
      text(ctx, '2025', M - 4, M + 60 + size * 0.86, { font: DISPLAY, size, color: RED });
      text(ctx, 'WRAPPED', M - 4, M + 60 + size * 1.8, { font: DISPLAY, size, color: CREAM });
      paragraph(ctx, "You didn't just attend church.", M, PAGE_H - 220, PAGE_W - M * 2, { size: 46, color: CREAM });
      paragraph(ctx, 'You were part of building one.', M, PAGE_H - 160, PAGE_W - M * 2, { size: 46, style: 'italic', color: CREAM });
    },
  },
  // 1 — inside cover: opening line + contents
  {
    bg: CREAM,
    draw(ctx, index) {
      kicker(ctx, 'A year in review', STONE);
      let y = paragraph(ctx, "You didn't just attend church.", M, 300, PAGE_W - M * 2, { size: 92, lineHeight: 1.05 });
      y = paragraph(ctx, 'You were part of building one.', M, y + 110, PAGE_W - M * 2, { size: 92, lineHeight: 1.05, style: 'italic', color: RED });
      text(ctx, '你不只是来聚会，而是参与建立了一间教会。', M, y + 100, { font: CN, size: 34, color: MUTED });
      const items = [['Belonging', 3], ['Beyond our walls', 6], ['A hall for 213', 8], ['Healing', 10], ['Learning', 14], ['Together', 16]];
      let ty = PAGE_H - 140 - items.length * 62;
      rule(ctx, ty - 50, STONE);
      items.forEach(([name, n]) => {
        text(ctx, String(n).padStart(2, '0'), M, ty, { font: DISPLAY, size: 40, color: RED });
        text(ctx, name, M + 110, ty, { font: SERIF, size: 36 });
        ty += 62;
      });
      folio(ctx, index, MUTED);
    },
  },
  // 2
  stat({
    theme: 'cream', label: '01 — Belonging',
    lead: 'Last year', number: '9,784', after: 'people walked through our doors.',
    sub: "That's the capacity of Stadium Negara.",
    cn: '去年，共有 9,784 人走进了这扇大门。这相当于整个国家体育馆的席位。',
  }),
  // 3
  photo({ src: 'photos/church.jpg', video: BLOB + 'walking-in-church.mp4', label: '01 — Belonging', caption: '9,784 people through our doors.' }),
  // 4
  stat({
    theme: 'dark', label: '01 — Belonging',
    lead: 'For', number: '273', after: 'of them, the visit changed everything.',
    sub: 'They came to know Jesus personally.',
    cn: '其中 273 人第一次的到访，改变了他们一切。他们亲身认识了耶稣。',
  }),
  // 5
  stat({
    theme: 'cream', label: '02 — Beyond our walls',
    lead: "Your giving didn't just go towards one church. It supported", number: '17', after: 'churches across 7 countries.',
    cn: '你的奉献不仅仅是帮助一间教会。它帮助了遍布七个国家的17间教会。',
  }),
  // 6
  photo({ src: 'photos/global-group.jpg', video: BLOB + 'collective-global.mp4', label: '02 — Beyond our walls', caption: '17 churches. 7 countries.' }),
  // 7
  stat({
    theme: 'dark', label: '03 — A hall for 213',
    lead: "You probably don't remember every ringgit you gave. But the", number: '213',
    after: 'kids will never forget the school hall you built for them.',
    cn: '你或许不记得你奉献的每一令吉，但这 213 位孩子永远不会忘记你为他们建的学校礼堂。',
  }),
  // 8
  photo({ src: 'photos/hall.jpg', video: BLOB + 'hall-makeover.mp4', label: '03 — A hall for 213', caption: 'The school hall you built.' }),
  // 9
  photo({ src: 'photos/dental.jpg', video: BLOB + 'dental-compressed.mp4', label: '04 — Healing', caption: '1,085 tooth extractions.' }),
  // 10
  stat({
    theme: 'cream', label: '04 — Healing',
    lead: 'You paid for', number: '1,085', after: 'tooth extractions.',
    sub: 'No identification. No subsidised care. For 454 of them, this was the only option.',
    cn: '你资助了 1,085 次拔牙手术。没有身份证，没有津贴医疗。对其中的 454 人来说，这是唯一的选择。',
  }),
  // 11
  stat({
    theme: 'dark', label: '04 — Healing',
    lead: "You subsidised doctors' visits for", number: '4,922', after: 'refugees.',
    sub: '331 babies were vaccinated against serious disease threats.',
    cn: '你资助了 4,371 位难民看诊。让 331 名婴儿接种了疫苗，免受严重疾病的威胁。',
  }),
  // 12
  photo({ src: 'photos/clinic.jpg', video: BLOB + 'autrui.mp4', label: '04 — Healing', caption: '331 babies vaccinated.' }),
  // 13
  photo({ src: 'photos/school.jpg', video: BLOB + 'walking-to-school.mp4', label: '05 — Learning', caption: 'Some kids walk hours just to learn in Sabah.' }),
  // 14
  stat({
    theme: 'cream', label: '05 — Learning',
    lead: 'Some kids walk hours just to learn in Sabah. You kept 5 hostels running for', number: '180', after: 'of them.',
    cn: '在沙巴，有些孩子为了上学要走好几个小时的路。你维持了五间宿舍的运作，帮助了180个孩子。',
  }),
  // 15
  stat({
    theme: 'dark', label: '06 — Together',
    lead: 'We cannot list them all. But you were part of making them happen. No single person did this. It took',
    number: '432', after: 'of us.',
    cn: '还有更多无法尽述。但皆因有你而成就。这并非一人之功，而是432人共同努力。',
  }),
  // 16 — 2026 goal
  {
    bg: RED,
    links: [{ rect: GIVE_BUTTON, href: GIVE_URL }],
    draw(ctx, index) {
      kicker(ctx, '2026', CREAM);
      paragraph(ctx, 'Our goal this year is to raise', M, 330, PAGE_W - M * 2, { size: 56, color: CREAM });
      const size = fitSize(ctx, '1,500,000', DISPLAY, PAGE_W - M * 2, 400);
      text(ctx, 'RM', M, 470, { font: DISPLAY, size: 120, color: STONE });
      text(ctx, '1,500,000', M - 6, 470 + size * 0.95, { font: DISPLAY, size, color: CREAM });
      paragraph(ctx, "Let's build together.", M, 880, PAGE_W - M * 2, { size: 64, style: 'italic', color: CREAM });
      paragraph(ctx, '我们今年的筹款目标是 RM 1,500,000 · 让我们一起建造', M, 970, PAGE_W - M * 2, { font: CN, size: 34, lineHeight: 1.5, color: '#ffd6cf' });
      // "Give Now" pill — GIVE_BUTTON is also its click target (see links)
      const [, by, bw, bh] = GIVE_BUTTON;
      ctx.fillStyle = CREAM;
      ctx.beginPath();
      ctx.roundRect(M, by, bw, bh, bh / 2);
      ctx.fill();
      text(ctx, 'Give Now', M + bw / 2, by + 62, { size: 36, weight: 700, color: RED, align: 'center' });
      text(ctx, '立即奉献', M + bw + 40, by + 60, { font: CN, size: 42, weight: 600, color: CREAM });
      folio(ctx, index, CREAM);
    },
  },
  // 17 — back cover
  {
    bg: STONE,
    draw(ctx) {
      const size = fitSize(ctx, 'WRAPPED', DISPLAY, PAGE_W - M * 2, 400);
      text(ctx, '2025', M - 4, 260 + size * 0.86, { font: DISPLAY, size, color: '#2c2826' });
      text(ctx, 'WRAPPED', M - 4, 260 + size * 1.8, { font: DISPLAY, size, color: '#2c2826' });
      paragraph(ctx, 'It took 432 of us.', M, PAGE_H - 330, PAGE_W - M * 2, { size: 56, style: 'italic', color: CREAM });
      rule(ctx, PAGE_H - 250, '#3a3532');
      logo(ctx, M, PAGE_H - 190, 300, CREAM);
      text(ctx, "LET'S BUILD TOGETHER", PAGE_W - M, PAGE_H - 160, { size: 18, weight: 700, tracking: 4, color: RED, align: 'right' });
    },
  },
];

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    // Missing stills (public/photos/*) shouldn't break the issue.
    img.onerror = () => resolve(null);
    img.src = `/${src}`;
  });
}

async function loadFonts() {
  const faces = [
    new FontFace('GC', 'url(/fonts/gc-grind.woff2)'),
    new FontFace('Foriene', 'url(/fonts/foriene-serif-regular.woff2)'),
    new FontFace('Foriene', 'url(/fonts/foriene-serif-italic.woff2)', { style: 'italic' }),
  ];
  await Promise.all(faces.map(async (f) => document.fonts.add(await f.load())));
}

// Muted + playsinline so browsers allow autoplay without a click. main.js
// plays and pauses these depending on which spread is open.
function createVideo(src) {
  const video = document.createElement('video');
  // Cross-origin (Blob storage) — anonymous CORS keeps the page canvas
  // untainted so it can still be uploaded as a WebGL texture.
  Object.assign(video, { crossOrigin: 'anonymous', muted: true, loop: true, playsInline: true, preload: 'metadata' });
  video.src = src;
  return video;
}

export async function createPages() {
  const [, images] = await Promise.all([
    loadFonts(),
    Promise.all(PAGES.map((p) => (p.src ? loadImage(p.src) : null))),
  ]);
  return PAGES.map((p, i) => {
    const canvas = document.createElement('canvas');
    canvas.width = PAGE_W;
    canvas.height = PAGE_H;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, PAGE_W, PAGE_H);
    ctx.textBaseline = 'alphabetic';
    p.draw(ctx, i, images[i]);
    canvas.links = p.links ?? [];
    if (p.video) {
      const video = createVideo(p.video);
      canvas.video = video;
      canvas.redraw = () => {
        ctx.fillStyle = p.bg;
        ctx.fillRect(0, 0, PAGE_W, PAGE_H);
        p.draw(ctx, i, video);
      };
    }
    return canvas;
  });
}
