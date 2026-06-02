"use client";

import { useEffect, useRef } from "react";

const CSS = `
  :root {
    --navy:       #0B1628;
    --navy-mid:   #132040;
    --navy-light: #1C2F56;
    --gold:       #C8973A;
    --gold-light: #E8B55A;
    --gold-pale:  #F5E9D0;
    --white:      #FAFAF8;
    --offwhite:   #F2F0EB;
    --muted:      #8B95A8;
    --line:       rgba(200,151,58,0.18);
    --line-dark:  rgba(255,255,255,0.07);
    --serif:      'DM Serif Display', Georgia, serif;
    --sans:       'DM Sans', system-ui, sans-serif;
    --radius:     10px;
    --radius-lg:  18px;
    --input-h:    48px;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    font-family: var(--sans);
    background: var(--offwhite);
    color: var(--navy);
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }
  a { text-decoration: none; color: inherit; }

  /* ── Nav ─────────────────────────────────────────────── */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(11,22,40,0.97);
    backdrop-filter: blur(12px);
    box-shadow: 0 1px 0 var(--line-dark);
    padding: 0 40px;
  }
  .nav-inner {
    max-width: 1160px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    height: 72px;
  }
  .logo {
    display: flex; align-items: center; gap: 10px;
    font-family: var(--serif); font-size: 22px; color: var(--white);
    letter-spacing: -.01em;
  }
  .logo-mark { width: 36px; height: 36px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .nav-back {
    display: flex; align-items: center; gap: 8px;
    font-size: 14px; color: rgba(250,250,248,.6);
    transition: color .2s; cursor: pointer;
  }
  .nav-back:hover { color: var(--white); }
  .nav-back svg { transition: transform .2s; }
  .nav-back:hover svg { transform: translateX(-3px); }

  /* ── Page layout ─────────────────────────────────────── */
  .page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding-top: 72px;
  }

  /* ── Left panel ──────────────────────────────────────── */
  .left-panel {
    background: var(--navy);
    padding: 80px 64px 80px 80px;
    position: relative; overflow: hidden;
    display: flex; flex-direction: column; justify-content: center;
    min-height: calc(100vh - 72px);
  }
  .left-panel::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(200,151,58,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(200,151,58,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }
  .left-glow {
    position: absolute; top: -100px; right: -100px;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(200,151,58,0.1) 0%, transparent 65%);
    pointer-events: none;
  }
  .left-content { position: relative; z-index: 1; }
  .panel-tag {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 600; letter-spacing: .12em;
    text-transform: uppercase; color: var(--gold);
    border: 1px solid rgba(200,151,58,.35); border-radius: 100px;
    padding: 5px 14px; margin-bottom: 28px;
  }
  .panel-headline {
    font-family: var(--serif);
    font-size: clamp(32px, 3.5vw, 48px);
    line-height: 1.08; letter-spacing: -.025em;
    color: var(--white); margin-bottom: 20px;
  }
  .panel-headline em { font-style: italic; color: var(--gold); }
  .panel-sub {
    font-size: 16px; font-weight: 300; line-height: 1.7;
    color: rgba(250,250,248,.55); margin-bottom: 52px; max-width: 400px;
  }

  /* What to expect list */
  .expect-list { display: flex; flex-direction: column; gap: 0; margin-bottom: 52px; }
  .expect-item {
    display: flex; gap: 16px;
    padding: 20px 0;
    border-bottom: 1px solid var(--line-dark);
  }
  .expect-item:first-child { padding-top: 0; }
  .expect-item:last-child { border-bottom: none; padding-bottom: 0; }
  .expect-icon {
    width: 36px; height: 36px; border-radius: 9px;
    background: rgba(200,151,58,.12);
    border: 1px solid rgba(200,151,58,.2);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .expect-text {}
  .expect-title { font-size: 14px; font-weight: 500; color: var(--white); margin-bottom: 4px; }
  .expect-desc  { font-size: 13px; font-weight: 300; color: rgba(250,250,248,.45); line-height: 1.55; }

  /* Social proof band */
  .proof-band {
    display: flex; gap: 32px; padding-top: 36px;
    border-top: 1px solid var(--line-dark);
  }
  .proof-stat {}
  .proof-num {
    font-family: var(--serif); font-size: 26px; color: var(--white);
    line-height: 1; margin-bottom: 4px; letter-spacing: -.02em;
  }
  .proof-num span { color: var(--gold); }
  .proof-label { font-size: 12px; color: var(--muted); letter-spacing: .02em; }

  /* ── Right panel — form ───────────────────────────────── */
  .right-panel {
    background: var(--offwhite);
    padding: 72px 80px 72px 64px;
    display: flex; flex-direction: column; justify-content: center;
  }
  .form-card {
    background: var(--white);
    border: 1px solid rgba(11,22,40,.08);
    border-radius: var(--radius-lg);
    padding: 48px 44px;
    box-shadow: 0 4px 32px rgba(11,22,40,.06);
  }
  .form-title {
    font-family: var(--serif); font-size: 26px; letter-spacing: -.02em;
    color: var(--navy); margin-bottom: 6px; line-height: 1.2;
  }
  .form-sub {
    font-size: 14px; font-weight: 300; color: var(--muted);
    margin-bottom: 36px; line-height: 1.6;
  }

  /* Form fields */
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .form-group { display: flex; flex-direction: column; gap: 7px; margin-bottom: 16px; }
  .form-group.no-mb { margin-bottom: 0; }
  label {
    font-size: 13px; font-weight: 500; color: var(--navy);
    letter-spacing: .01em;
  }
  .required { color: var(--gold); margin-left: 2px; }
  input[type="text"],
  input[type="email"],
  input[type="tel"],
  select,
  textarea {
    font-family: var(--sans);
    font-size: 14px; font-weight: 400;
    color: var(--navy);
    background: var(--white);
    border: 1px solid rgba(11,22,40,.15);
    border-radius: var(--radius);
    padding: 0 16px;
    height: var(--input-h);
    width: 100%;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
    appearance: none; -webkit-appearance: none;
  }
  textarea {
    height: 100px; padding: 14px 16px; resize: none; line-height: 1.5;
  }
  select {
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238B95A8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    padding-right: 40px; cursor: pointer;
  }
  input::placeholder, textarea::placeholder { color: rgba(11,22,40,.3); }
  input:focus, select:focus, textarea:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(200,151,58,.1);
  }
  input:hover:not(:focus), select:hover:not(:focus), textarea:hover:not(:focus) {
    border-color: rgba(11,22,40,.3);
  }

  /* Time slot picker */
  .slots-label { font-size: 13px; font-weight: 500; color: var(--navy); margin-bottom: 10px; letter-spacing: .01em; }
  .slots-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
    margin-bottom: 24px;
  }
  .slot {
    padding: 10px 8px; border-radius: var(--radius);
    border: 1px solid rgba(11,22,40,.12);
    font-size: 13px; font-weight: 400; color: rgba(11,22,40,.6);
    text-align: center; cursor: pointer;
    transition: all .18s; background: var(--white);
    user-select: none;
  }
  .slot:hover { border-color: var(--gold); color: var(--navy); }
  .slot.selected {
    background: var(--gold); border-color: var(--gold);
    color: var(--navy); font-weight: 500;
  }

  /* Checkbox row */
  .check-row {
    display: flex; align-items: flex-start; gap: 12px;
    margin-bottom: 28px; padding: 16px;
    background: rgba(200,151,58,.05);
    border: 1px solid rgba(200,151,58,.15);
    border-radius: var(--radius);
  }
  .check-row input[type="checkbox"] {
    width: 18px; height: 18px; min-width: 18px; border-radius: 5px;
    border: 1.5px solid rgba(11,22,40,.2); background: var(--white);
    padding: 0; cursor: pointer; appearance: none; -webkit-appearance: none;
    display: flex; align-items: center; justify-content: center;
    transition: all .18s; margin-top: 1px;
    background-image: none;
  }
  .check-row input[type="checkbox"]:checked {
    background: var(--gold); border-color: var(--gold);
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='8' viewBox='0 0 10 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 4l3 3 5-6' stroke='%230B1628' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: center;
  }
  .check-text { font-size: 13px; color: rgba(11,22,40,.65); line-height: 1.55; }
  .check-text strong { color: var(--navy); font-weight: 500; }

  /* Submit button */
  .btn-submit {
    width: 100%; height: 52px;
    background: var(--gold); border: none;
    border-radius: var(--radius); cursor: pointer;
    font-family: var(--sans); font-size: 15px; font-weight: 600;
    color: var(--navy); letter-spacing: .01em;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background .2s, transform .15s, box-shadow .2s;
  }
  .btn-submit:hover {
    background: var(--gold-light);
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(200,151,58,.3);
  }
  .btn-submit:active { transform: translateY(0); box-shadow: none; }

  .form-note {
    text-align: center; font-size: 12px; color: var(--muted);
    margin-top: 16px; line-height: 1.5;
  }

  /* Step divider */
  .form-divider {
    height: 1px; background: rgba(11,22,40,.07);
    margin: 24px 0;
    position: relative;
  }
  .form-divider span {
    position: absolute; left: 50%; transform: translateX(-50%) translateY(-50%);
    background: var(--white);
    font-size: 11px; font-weight: 600; letter-spacing: .1em;
    text-transform: uppercase; color: var(--muted);
    padding: 0 12px;
  }

  /* Success state */
  .success-state {
    display: none;
    flex-direction: column; align-items: center;
    text-align: center; padding: 24px 0;
  }
  .success-icon {
    width: 64px; height: 64px; border-radius: 50%;
    background: rgba(200,151,58,.1);
    border: 1px solid rgba(200,151,58,.3);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 24px;
  }
  .success-title {
    font-family: var(--serif); font-size: 26px; letter-spacing: -.02em;
    color: var(--navy); margin-bottom: 12px;
  }
  .success-sub { font-size: 15px; font-weight: 300; color: var(--muted); line-height: 1.65; max-width: 340px; }
  .success-meta {
    margin-top: 28px; padding: 18px 24px;
    background: var(--offwhite); border-radius: var(--radius);
    font-size: 14px; color: rgba(11,22,40,.6); line-height: 1.6;
    text-align: left; width: 100%;
  }
  .success-meta strong { color: var(--navy); font-weight: 500; display: block; margin-bottom: 4px; }

  /* ── Responsive ──────────────────────────────────────── */
  @media (max-width: 900px) {
    .page { grid-template-columns: 1fr; }
    .left-panel { padding: 60px 32px; min-height: auto; }
    .right-panel { padding: 48px 24px; }
    .form-card { padding: 32px 24px; }
    .form-row { grid-template-columns: 1fr; }
    nav { padding: 0 20px; }
  }
`;

const HTML = `
<!-- ── Nav ─────────────────────────────────────────────── -->
<nav>
  <div class="nav-inner">
    <a href="/" class="logo">
      <div class="logo-mark">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <polygon points="18,2 32,10 32,26 18,34 4,26 4,10" fill="#132040" stroke="#C8973A" stroke-width="1.5" stroke-linejoin="round"/>
          <polyline points="7,18 11,18 13.5,11 16.5,25 19.5,14 22,18 29,18" stroke="#C8973A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </div>
      Bay RCM
    </a>
    <a href="/" class="nav-back">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Back to site
    </a>
  </div>
</nav>

<!-- ── Page ─────────────────────────────────────────────── -->
<div class="page">

  <!-- Left: context panel -->
  <div class="left-panel">
    <div class="left-glow"></div>
    <div class="left-content">
      <div class="panel-tag">
        <svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill="currentColor"/></svg>
        Free 30-Minute Demo
      </div>
      <h1 class="panel-headline">
        See exactly where<br/>your revenue is <em>slipping</em>
      </h1>
      <p class="panel-sub">
        We'll walk through your current billing workflow, identify the gaps, and show you what Bay RCM would look like for your practice — no pressure, no obligation.
      </p>

      <div class="expect-list">
        <div class="expect-item">
          <div class="expect-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2a7 7 0 100 14A7 7 0 009 2z" stroke="#C8973A" stroke-width="1.4"/>
              <path d="M9 5v4l2.5 2" stroke="#C8973A" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="expect-text">
            <div class="expect-title">30-minute, no fluff</div>
            <div class="expect-desc">We respect your time. Straight to your practice's numbers — denial rates, AR aging, collection gaps.</div>
          </div>
        </div>
        <div class="expect-item">
          <div class="expect-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="3" width="14" height="12" rx="2.5" stroke="#C8973A" stroke-width="1.4"/>
              <path d="M5 8h8M5 11h5" stroke="#C8973A" stroke-width="1.4" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="expect-text">
            <div class="expect-title">Complimentary claims audit</div>
            <div class="expect-desc">We review your last 90 days of claims before the call so we can show up with real findings, not generic slides.</div>
          </div>
        </div>
        <div class="expect-item">
          <div class="expect-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 14V8l6-5 6 5v6" stroke="#C8973A" stroke-width="1.4" stroke-linejoin="round"/>
              <rect x="6.5" y="10" width="5" height="4" stroke="#C8973A" stroke-width="1.4"/>
            </svg>
          </div>
          <div class="expect-text">
            <div class="expect-title">Tailored to your specialty</div>
            <div class="expect-desc">We prepare payer-specific and specialty-specific insights — not a one-size pitch deck.</div>
          </div>
        </div>
        <div class="expect-item">
          <div class="expect-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="#C8973A" stroke-width="1.4"/>
              <path d="M6 9.5l2 2 4-4" stroke="#C8973A" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="expect-text">
            <div class="expect-title">Zero obligation</div>
            <div class="expect-desc">You leave with actionable findings regardless of whether we work together. The audit is yours to keep.</div>
          </div>
        </div>
      </div>

      <div class="proof-band">
        <div class="proof-stat">
          <div class="proof-num">98<span>%</span></div>
          <div class="proof-label">Clean claim rate</div>
        </div>
        <div class="proof-stat">
          <div class="proof-num">&lt;2<span>%</span></div>
          <div class="proof-label">Denial rate</div>
        </div>
        <div class="proof-stat">
          <div class="proof-num">14<span>d</span></div>
          <div class="proof-label">Avg. days to payment</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Right: form panel -->
  <div class="right-panel">
    <div class="form-card">

      <!-- Form state -->
      <div id="form-state">
        <div class="form-title">Book your demo</div>
        <p class="form-sub">Takes 90 seconds. We'll confirm within one business day.</p>

        <form id="demo-form" novalidate>

          <!-- Name row -->
          <div class="form-row">
            <div class="form-group no-mb">
              <label for="fname">First name <span class="required">*</span></label>
              <input type="text" id="fname" placeholder="Sarah" required/>
            </div>
            <div class="form-group no-mb">
              <label for="lname">Last name <span class="required">*</span></label>
              <input type="text" id="lname" placeholder="Patel" required/>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Work email <span class="required">*</span></label>
            <input type="email" id="email" placeholder="sarah@yourpractice.com" required/>
          </div>

          <div class="form-group">
            <label for="phone">Phone number</label>
            <input type="tel" id="phone" placeholder="(415) 555-0100"/>
          </div>

          <div class="form-row">
            <div class="form-group no-mb">
              <label for="practice">Practice name <span class="required">*</span></label>
              <input type="text" id="practice" placeholder="Bay Area Cardiology" required/>
            </div>
            <div class="form-group no-mb">
              <label for="providers">Number of providers</label>
              <select id="providers">
                <option value="" disabled selected>Select</option>
                <option>1–2</option>
                <option>3–5</option>
                <option>6–10</option>
                <option>11–25</option>
                <option>25+</option>
              </select>
            </div>
          </div>

          <div class="form-divider" style="margin-top:24px;"><span>Practice details</span></div>

          <div class="form-row">
            <div class="form-group no-mb">
              <label for="specialty">Specialty <span class="required">*</span></label>
              <select id="specialty" required>
                <option value="" disabled selected>Select specialty</option>
                <option>Primary Care</option>
                <option>Cardiology</option>
                <option>Orthopedics</option>
                <option>Dermatology</option>
                <option>Neurology</option>
                <option>Oncology</option>
                <option>Ophthalmology</option>
                <option>Urgent Care</option>
                <option>Physical Therapy</option>
                <option>Chiropractic</option>
                <option>Dental</option>
                <option>Other</option>
              </select>
            </div>
            <div class="form-group no-mb">
              <label for="ehr">EHR / Practice system</label>
              <select id="ehr">
                <option value="" disabled selected>Select EHR</option>
                <option>eClinicalWorks</option>
                <option>Athenahealth</option>
                <option>Kareo / Tebra</option>
                <option>DrChrono</option>
                <option>Epic</option>
                <option>Cerner</option>
                <option>Modernizing Medicine</option>
                <option>Practice Fusion</option>
                <option>Other</option>
                <option>Not sure</option>
              </select>
            </div>
          </div>

          <div class="form-divider"><span>Availability</span></div>

          <div class="slots-label">Preferred time slot <span class="required">*</span></div>
          <div class="slots-grid" id="slots">
            <div class="slot">Mon 9–11am</div>
            <div class="slot">Mon 1–3pm</div>
            <div class="slot">Tue 9–11am</div>
            <div class="slot">Tue 2–4pm</div>
            <div class="slot">Wed 10am–12</div>
            <div class="slot">Thu 9–11am</div>
            <div class="slot">Thu 1–3pm</div>
            <div class="slot">Fri 9–11am</div>
            <div class="slot">Flexible</div>
          </div>

          <div class="form-group">
            <label for="note">Anything you'd like us to prepare for? <span style="color:var(--muted);font-weight:300;">(optional)</span></label>
            <textarea id="note" placeholder="e.g. our denial rate has been above 12% for 3 months and we can't pinpoint why…"></textarea>
          </div>

          <div class="check-row">
            <input type="checkbox" id="audit" checked/>
            <label for="audit" class="check-text">
              <strong>Yes, run the complimentary claims audit before our call.</strong>
              We'll review your last 90 days and prepare specific findings for your practice.
            </label>
          </div>

          <button type="submit" class="btn-submit" id="submit-btn">
            Confirm my demo
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <p class="form-note">No spam. No hard sell. We confirm within one business day with a calendar invite.</p>
        </form>
      </div>

      <!-- Success state -->
      <div class="success-state" id="success-state">
        <div class="success-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M6 14l5 5 11-10" stroke="#C8973A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="success-title">You're booked.</div>
        <p class="success-sub">We'll confirm within one business day with a calendar invite and a short prep checklist.</p>
        <div class="success-meta" id="success-meta">
          <strong>What happens next</strong>
          Our team will review your claims before the call. You'll receive a calendar invite with a Zoom link and a 3-question prep form so we can make the 30 minutes count.
        </div>
      </div>

    </div>
  </div>
</div>
`;

export default function Demo() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let selectedSlot: string | null = null;

    const slots = Array.from(root.querySelectorAll<HTMLElement>(".slot"));
    const onSlotClick = (el: HTMLElement) => () => {
      slots.forEach((s) => s.classList.remove("selected"));
      el.classList.add("selected");
      selectedSlot = el.textContent;
    };
    const slotHandlers = slots.map((el) => {
      const h = onSlotClick(el);
      el.addEventListener("click", h);
      return [el, h] as const;
    });

    const val = (id: string) =>
      (root.querySelector<HTMLInputElement>("#" + id)?.value ?? "").trim();

    const showError = (msg: string) => {
      let el = root.querySelector<HTMLParagraphElement>("#form-error");
      if (!el) {
        el = document.createElement("p");
        el.id = "form-error";
        el.style.cssText =
          "font-size:13px;color:#C0392B;background:rgba(192,57,43,0.07);border:1px solid rgba(192,57,43,0.18);border-radius:8px;padding:10px 14px;margin-bottom:16px;";
        root.querySelector("#submit-btn")?.before(el);
      }
      el.textContent = msg;
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    const form = root.querySelector<HTMLFormElement>("#demo-form");
    const onSubmit = async (e: Event) => {
      e.preventDefault();
      const fname = val("fname");
      const email = val("email");
      const practice = val("practice");
      const specialty = root.querySelector<HTMLSelectElement>("#specialty")?.value ?? "";

      if (!fname || !email || !practice || !specialty || !selectedSlot) {
        const missing: string[] = [];
        if (!fname) missing.push("first name");
        if (!email) missing.push("work email");
        if (!practice) missing.push("practice name");
        if (!specialty) missing.push("specialty");
        if (!selectedSlot) missing.push("a time slot");
        showError("Please fill in: " + missing.join(", ") + ".");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError("Please enter a valid email address.");
        return;
      }

      const btn = root.querySelector<HTMLButtonElement>("#submit-btn");
      const btnHtml = btn?.innerHTML;
      if (btn) {
        btn.innerHTML =
          '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.5" stroke-dasharray="22 22" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0 9 9" to="360 9 9" dur="0.7s" repeatCount="indefinite"/></circle></svg> Sending…';
        btn.disabled = true;
      }

      const lname = val("lname");

      try {
        const res = await fetch("/api/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fname,
            lname,
            email,
            phone: val("phone"),
            practice,
            providers: root.querySelector<HTMLSelectElement>("#providers")?.value ?? "",
            specialty,
            ehr: root.querySelector<HTMLSelectElement>("#ehr")?.value ?? "",
            slot: selectedSlot,
            note: val("note"),
            audit: root.querySelector<HTMLInputElement>("#audit")?.checked ?? false,
          }),
        });

        if (!res.ok) throw new Error("Request failed");

        const formState = root.querySelector<HTMLElement>("#form-state");
        if (formState) formState.style.display = "none";
        const s = root.querySelector<HTMLElement>("#success-state");
        if (s) s.style.display = "flex";
        const meta = root.querySelector<HTMLElement>("#success-meta");
        if (meta) {
          meta.innerHTML =
            `<strong>Confirmed for ${selectedSlot}</strong>` +
            `${fname}${lname ? " " + lname : ""}, we'll send a calendar invite to <strong>${email}</strong> along with a short prep checklist. ` +
            `Our team will begin the claims audit for <strong>${practice}</strong> before your call.`;
        }
      } catch {
        showError(
          "Something went wrong sending your request. Please try again or email us directly."
        );
        if (btn && btnHtml !== undefined) {
          btn.innerHTML = btnHtml;
          btn.disabled = false;
        }
      }
    };
    form?.addEventListener("submit", onSubmit);

    return () => {
      slotHandlers.forEach(([el, h]) => el.removeEventListener("click", h));
      form?.removeEventListener("submit", onSubmit);
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div ref={rootRef} dangerouslySetInnerHTML={{ __html: HTML }} />
    </>
  );
}
