# Remyndrs — Claude Project Reference

## ⚠️ Before Any Copy or Content Work
Read `remyndrs-brand-reference.md` first. It contains approved copy, rejected phrases,
voice rules, and the pre-publish checklist. Do not write or edit any website copy,
ad copy, or user-facing text without consulting it.

---

## Analytics & Tracking

- ✅ Google Analytics GA4 — Measurement ID: `G-T8ZBVMT9JE` — https://analytics.google.com
- ✅ Meta Pixel — ID: `2321949688328139`
- Key events tracked: `mobile_sms_click`, `cta_click`, `demo_started`, `demo_completed`, `persona_select`, `landing_page_view`

---

## Completed Features

- ✅ Share buttons
- ✅ FAQ section (faq.html)
- ✅ Google Analytics GA4
- ✅ Meta Pixel
- ✅ Desktop contact forms
- ✅ Hardcoded "87 spots remaining" removed
- ✅ Android platform detection (shows form instead of SMS link)
- ✅ Interactive demo (try-demo section)
- ✅ Persona selector (index.html)

---

## Known Issues / Technical Debt

**QR Code dependency**
- Uses external API: `https://api.qrserver.com/v1/create-qr-code/`
- Risk: If API goes down, QR section breaks
- Fix: Generate static QR code and host locally

**"See more examples → " link (index.html)**
- Currently links to `#see-it-section` — loops back to itself
- Fix: Point to a dedicated examples page or remove the link

**Logo file size**
- remyndrs-logo.png is ~226KB — compress or convert to SVG

**Color contrast**
- SMS disclaimer text, special commands section, footer text opacity may not meet WCAG AA
- Needs accessibility audit

---

## High Priority: Referral Tracking System

### Phase 1 — Unique Referral Codes
- Generate unique code per user (format: `REF-ABC123`)
- Update share message: `"Try Remyndrs free! Text START REF-ABC123 to +1 (855) 552-1950"`
- Backend: parse "START [REFCODE]", validate, link new user to referrer

### Phase 2 — Referral Dashboard
- SMS commands: `REFERRAL` (get code), `REFERRALS` (see count), `REWARDS` (check balance)

### Phase 3 — Rewards Program
- Refer 1 → 1 week free Premium
- Refer 3 → 1 month free Premium
- Refer 5 → 3 months free Premium
- Refer 10 → 6 months free Premium
- New users get extended trial (21 days instead of 14)

### Database Schema
```sql
CREATE TABLE referral_codes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE referrals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    referrer_user_id INT NOT NULL,
    referred_user_id INT NOT NULL,
    referral_code VARCHAR(20) NOT NULL,
    conversion_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reward_granted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (referrer_user_id) REFERENCES users(id),
    FOREIGN KEY (referred_user_id) REFERENCES users(id)
);

CREATE TABLE rewards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    reward_type VARCHAR(50) NOT NULL,
    reward_value INT NOT NULL,
    earned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    applied BOOLEAN DEFAULT FALSE,
    applied_date TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## Medium Priority

**Web Portal** — Login via SMS verification, view/manage reminders, lists, memories, data export

**A/B Testing** — CTA copy, button colors, pricing display position, testimonial placement

**Trust Signals** — Real testimonials with photos (target 5-10), "As seen on..." when applicable

**Annual Billing** — Annual option (save 2 months), pause subscription option

---

## Lower Priority / Long-term

- Mobile app (push notifications, visual list management)
- SMS enhancements (relative dates, smart suggestions, calendar sync)
- Content marketing blog
- Email sequences for trial users
- Product Hunt launch
- Partnerships: senior care, ADHD support groups, productivity influencers

---

## SMS / Legal Compliance

- TCPA: https://www.fcc.gov/tcpa
- A2P 10DLC registration required for US carriers
- All SMS CTAs must include: "Msg & data rates may apply. Reply STOP to unsubscribe."

---

## Payment Processing (Planned)

- Stripe primary — https://stripe.com/docs
- PayPal, Apple Pay, Google Pay secondary

---

*Last Updated: 2026-04-15*
