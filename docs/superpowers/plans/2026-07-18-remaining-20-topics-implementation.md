# Remaining 20 Topics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish 20 additional blog articles expanding topical authority across use-cases, features, DIY, and storage domains, using tag-based taxonomy.

**Architecture:** Content-only expansion. Each article is an MDX file under `content/posts/<slug>/en.mdx` following existing Velite conventions. No code changes required. Validation via build, lint, typecheck. Posts include 2-3 internal links to related content based on tag overlap.

**Tech Stack:** Next.js 16 (Turbopack), Tailwind v4, shadcn/ui, Velite, MDX, TypeScript.

---

### Task 1: Best Outdoor Security Cameras

**Files:**

- Create: `content/posts/best-outdoor-security-cameras-2026/en.mdx`

- [ ] **Step 1: Write frontmatter**

```yaml
---
title: "Best Outdoor Security Cameras (2026 Edition)"
description: "Weatherproof security cameras that actually survive the elements. We tested the top picks for yards, driveways, and perimeters—find the right one for your property."
publishedAt: 2026-07-18T00:00:00.000Z
updatedAt: 2026-07-18T00:00:00.000Z
slug: "best-outdoor-security-cameras-2026"
author: "Your Name"
tags: ["outdoor", "buying-guide", "comparison"]
postType: "review"
---
```

- [ ] **Step 2: Write article content (≈2000 words)**

Use structure:

- Introduction: Outdoor camera challenges (weather, placement, power)
- Comparison table: 6 cameras (resolution, FOV, storage, power, price, features)
- Detailed reviews for each (pros/cons, best use case, why it made the list)
- Buying advice: IP rating explained, mounting tips, power options
- Conclusion with recommendation tiers (premium, mid-range, budget)
- Internal links: link to `color-night-vision-vs-ir-comparison` (night vision), `poe-vs-wireless-vs-solar-comparison` (power), `camera-resolution-guide` (resolution)

- [ ] **Step 3: Add internal links** (check 2-3 related posts)

Place naturally in content:

- "For night vision performance, see our [Color Night Vision vs IR comparison](/blog/color-night-vision-vs-ir-comparison)."
- "Power considerations: read our [PoE vs Wireless vs Solar guide](/blog/poe-vs-wireless-vs-solar-comparison)."
- "Understanding resolution trade-offs: [Camera Resolution Guide](/blog/camera-resolution-guide)."

- [ ] **Step 4: Commit**

```bash
git add content/posts/best-outdoor-security-cameras-2026/en.mdx
git commit -m "feat: add best outdoor security cameras guide"
```

---

### Task 2: Best Security Cameras for Apartments & Renters

**Files:**

- Create: `content/posts/best-security-cameras-for-apartments-renters/en.mdx`

- [ ] **Step 1: Write frontmatter**

```yaml
---
title: "Best Security Cameras for Apartments & Renters"
description: "Non-invasive, landlord-friendly security cameras that won't violate your lease. Wireless, battery-powered, and easy-to-remove options for renters."
publishedAt: 2026-07-18T00:00:00.000Z
updatedAt: 2026-07-18T00:00:00.000Z
slug: "best-security-cameras-for-apartments-renters"
author: "Your Name"
tags: ["apartment-dwellers", "buying-guide", "wireless"]
postType: "review"
---
```

- [ ] **Step 2: Write article content (≈1800 words)**

Structure:

- Introduction: Rental constraints (no drilling, no permanence, landlord approval)
- Key criteria: wire-free, battery-powered, removable mounting, no wiring
- Comparison table: 5-6 renter-friendly cameras
- Detailed reviews with pros/cons
- Installation tips for temporary setups ( adhesive mounts, over door)
- Legal considerations: lease agreements, privacy laws (link to privacy-laws-by-state)
- Conclusion with top picks for different budgets
- Internal links: `best-security-cameras-under-100-2026` (budget), `wireless-camera-setup-diy-tips` (installation), `privacy-laws-by-state-cctv-guide` (legal)

- [ ] **Step 3: Add internal links**

- [ ] **Step 4: Commit**

---

### Task 3: Best Cameras for Large Backyards & Acreage

**Files:**

- Create: `content/posts/best-cameras-large-backyards-acreage/en.mdx`

- [ ] **Step 1: Write frontmatter**

```yaml
---
title: "Best Security Cameras for Large Backyards & Acreage"
description: "Covering a big property? These long-range cameras with wide fields of view and solar power options keep expansive areas secure without frequent maintenance."
publishedAt: 2026-07-18T00:00:00.000Z
updatedAt: 2026-07-18T00:00:00.000Z
slug: "best-cameras-large-backyards-acreage"
author: "Your Name"
tags: ["large-backyard", "buying-guide", "solar-power"]
postType: "review"
---
```

- [ ] **Step 2: Write article content (≈1800 words)**

Structure:

- Introduction: Challenges of large properties (coverage gaps, power distance, wiring costs)
- Key criteria: long range (200ft+), wide FOV (140°+), solar options, PoE for reliability
- Comparison table: 6 cameras suited for large areas
- Detailed reviews
- Placement strategy: how many cameras, overlapping coverage, mounting heights
- Solar power viability (sunlight requirements, battery capacity)
- Internal links: `best-solar-powered-security-cameras` (solar focus), `outdoor-security-cameras` (weatherproofing), `poe-vs-wireless-vs-solar-comparison` (power/connectivity)

- [ ] **Step 3: Add internal links**

- [ ] **Step 4: Commit**

---

### Task 4: Best Small Business Security Camera Systems

**Files:**

- Create: `content/posts/best-small-business-security-camera-systems/en.mdx`

- [ ] **Step 1: Write frontmatter**

```yaml
---
title: "Best Small Business Security Camera Systems (2026)"
description: "Commercial-grade security camera systems designed for small businesses. Compare scalability, loss prevention features, and legal compliance requirements."
publishedAt: 2026-07-18T00:00:00.000Z
updatedAt: 2026-07-18T00:00:00.000Z
slug: "best-small-business-security-camera-systems"
author: "Your Name"
tags: ["small-business", "buying-guide", "comparison"]
postType: "review"
---
```

- [ ] **Step 2: Write article content (≈2000 words)**

Structure:

- Introduction: Business vs residential needs (liability, evidence quality, scalability, uptime)
- Key criteria: NVR vs cloud, number of cameras supported, retention, remote access, warranty
- Comparison table: 4-5 commercial-ready systems (Reolink NVR kits, Lorex, Amcrest, Ubiquiti, etc.)
- Detailed reviews
- Legal considerations for businesses (employee notification, audio laws, data retention)
- ROI discussion: theft prevention, insurance discounts
- Internal links: `poe-nvr-setup` (NVR setup), `cctv-video-file-formats` (evidence handling), `privacy-laws-by-state-cctv-guide` (compliance)

- [ ] **Step 3: Add internal links**

- [ ] **Step 4: Commit**

---

### Task 5: Best HOA-Compliant Security Cameras

**Files:**

- Create: `content/posts/best-hoa-compliant-security-cameras/en.mdx`

- [ ] **Step 1: Write frontmatter**

```yaml
---
title: "Best HOA-Compliant Security Cameras"
description: "Security cameras that meet typical HOA aesthetic requirements: discreet designs, small form factors, and community-friendly placement guidelines."
publishedAt: 2026-07-18T00:00:00.000Z
updatedAt: 2026-07-18T00:00:00.000Z
slug: "best-hoa-compliant-security-cameras"
author: "Your Name"
tags: ["hoa-compliant", "buying-guide", "aesthetic"]
postType: "review"
---
```

- [ ] **Step 2: Write article content (≈1600 words)**

Structure:

- Introduction: HOA restrictions (no pointing at streets/neighbors, aesthetic rules, placement approval)
- Key criteria: small/compact housings, adjustable mounts to control angles, neutral colors, low-profile
- Comparison table: 5-6 discreet cameras (bullet mini, dome cameras, low-profile)
- Detailed reviews
- Navigating HOA approval: how to present plans, compromise strategies
- Placement tips to avoid disputes
- Internal links: `best-apartment-dwellers` (similar restrictions), `camera-resolution-guide` (maintaining quality with smaller cameras), `outdoor-security-cameras` (weather rating)

- [ ] **Step 3: Add internal links**

- [ ] **Step 4: Commit**

---

### Task 6: Best Security Cameras for RVs & Mobile Homes

**Files:**

- Create: `content/posts/best-security-cameras-for-rvs-mobile-homes/en.mdx`

- [ ] **Step 1: Write frontmatter**

```yaml
---
title: "Best Security Cameras for RVs & Mobile Homes"
description: "Vibration-resistant, compact security cameras that can handle road travel and off-grid power. Keep your mobile home or RV secure wherever you park."
publishedAt: 2026-07-18T00:00:00.000Z
updatedAt: 2026-07-18T00:00:00.000Z
slug: "best-security-cameras-for-rvs-mobile-homes"
author: "Your Name"
tags: ["rv", "buying-guide", "battery-life"]
postType: "review"
---
```

- [ ] **Step 2: Write article content (≈1500 words)**

Structure:

- Introduction: Mobile living security challenges (vibration, power variability, theft)
- Key criteria: ruggedized housing, vibration resistance, battery/solar power, Wi-Fi range extenders
- Comparison table: 5 cameras suitable for RVs
- Detailed reviews
- Installation tips for curved surfaces, temporary mounts
- Power solutions: 12V DC, solar, battery packs
- Internal links: `best-outdoor-security-cameras-2026` (weatherproofing), `battery-life-power-options` (power deep dive), `wireless-camera-setup-diy-tips` (setup)

- [ ] **Step 3: Add internal links**

- [ ] **Step 4: Commit**

---

### Task 7: Best Solar-Powered Security Cameras (Off-Grid)

**Files:**

- Create: `content/posts/best-solar-powered-security-cameras/en.mdx`

- [ ] **Step 1: Write frontmatter**

```yaml
---
title: "Best Solar-Powered Security Cameras (Off-Grid)"
description: "Truly wire-free security cameras with solar panels. We tested the best off-grid options for sunny and low-light conditions, with real-world battery life data."
publishedAt: 2026-07-18T00:00:00.000Z
updatedAt: 2026-07-18T00:00:00.000Z
slug: "best-solar-powered-security-cameras"
author: "Your Name"
tags: ["solar-power", "buying-guide", "battery-life"]
postType: "review"
---
```

- [ ] **Step 2: Write article content (≈1800 words)**

Structure:

- Introduction: Solar cameras as ultimatewire-free solution, but sun dependency
- How solar cameras work: battery capacity, panel wattage, charge time
- Comparison table: 6 solar cameras (panel included vs separate)
- Detailed reviews with battery life test results
- Solar placement: maximizing exposure, seasonal variations
- Winter/low-light performance
- Internal links: `battery-life-power-options-corded-vs-battery-vs-solar` (power deeper dive), `best-outdoor-security-cameras-2026` (general outdoor), `best-cameras-for-large-backyards-acreage` (solar for large areas)

- [ ] **Step 3: Add internal links**

- [ ] **Step 4: Commit**

---

### Task 8: PTZ Cameras: When You Need Pan-Tilt-Zoom

**Files:**

- Create: `content/posts/ptz-cameras-when-you-need-pan-tilt-zoom/en.mdx`

- [ ] **Step 1: Write frontmatter**

```yaml
---
title: "PTZ Cameras: When You Need Pan-Tilt-Zoom"
description: "A deep dive into PTZ (pan-tilt-zoom) cameras: how they work, best use cases, and top models for active monitoring of large areas."
publishedAt: 2026-07-18T00:00:00.000Z
updatedAt: 2026-07-18T00:00:00.000Z
slug: "ptz-cameras-when-you-need-pan-tilt-zoom"
author: "Your Name"
tags: ["ptz", "buying-guide", "comparison"]
postType: "article"
---
```

- [ ] **Step 2: Write article content (≈2200 words)**

Structure:

- Introduction: What PTZ is, how it differs from fixed cameras
- PTZ mechanics: motors, optical zoom vs digital, presets, auto-tracking
- Use cases: large lots, construction sites, active monitoring, guard tours
- Advantages (flexibility, fewer cameras) and disadvantages (cost, moving parts, maintenance)
- Comparison table: 5 PTZ cameras (indoor/outdoor, optical zoom levels)
- Buying guide: what specs matter (zoom ratio, pan/tilt speed, low-light PTZ)
- Setup considerations: PoE power, mounting height, control interfaces
- Internal links: `best-outdoor-security-cameras-2026` (outdoor focus), `poe-vs-wireless-vs-solar-comparison` (PTZ typically PoE), `best-small-business-security-camera-systems` (commercial use)

- [ ] **Step 3: Add internal links**

- [ ] **Step 4: Commit**

---

### Task 9: Facial Recognition Security Cameras: Capabilities & Privacy

**Files:**

- Create: `content/posts/facial-recognition-security-cameras-capabilities-privacy/en.mdx`

- [ ] **Step 1: Write frontmatter**

```yaml
---
title: "Facial Recognition Security Cameras: Capabilities & Privacy"
description: "How AI facial recognition works in security cameras, real-world accuracy, data storage implications, and the ethical and legal landscape."
publishedAt: 2026-07-18T00:00:00.000Z
updatedAt: 2026-07-18T00:00:00.000Z
slug: "facial-recognition-security-cameras-capabilities-privacy"
author: "Your Name"
tags: ["facial-recognition", "ai-features", "privacy-law"]
postType: "article"
---
```

- [ ] **Step 2: Write article content (≈2000 words)**

Structure:

- Introduction: Facial recognition in consumer/ prosumer cameras—reality vs marketing
- How it works: face detection → face recognition → matching against database
- Accuracy factors: lighting, angle, database size, false positives/negatives
- Privacy implications: biometric data laws, storage policies, third-party sharing
- Legal landscape: state bans (Illinois BIPA, California), GDPR considerations
- Should you use it? Use cases (known employee access, VIP detection) vs general surveillance
- Best cameras with facial recognition (mention brands with local processing)
- Internal links: `ai-features-explained-person-detection-vs-false-alarms` (AI features primer), `privacy-laws-by-state-cctv-guide` (specific laws), `cloud-storage-vs-local-storage` (where face data is stored)

- [ ] **Step 3: Add internal links**

- [ ] **Step 4: Commit**

---

### Task 10: Two-Way Audio Security Cameras: Complete Guide

**Files:**

- Create: `content/posts/two-way-audio-security-cameras-complete-guide/en.mdx`

- [ ] **Step 1: Write frontmatter**

```yaml
---
title: "Two-Way Audio Security Cameras: Complete Guide"
description: "Security cameras with built-in speakers and microphones let you speak to visitors, deter intruders, and communicate with delivery personnel. We cover features, sound quality, and use cases."
publishedAt: 2026-07-18T00:00:00.000Z
updatedAt: 2026-07-18T00:00:00.000Z
slug: "two-way-audio-security-cameras-complete-guide"
author: "Your Name"
tags: ["two-way-audio", "buying-guide", "smart-home"]
postType: "article"
---
```

- [ ] **Step 2: Write article content (≈1800 words)**

Structure:

- Introduction: What two-way audio is, why it's useful (deterrence, communication, accessibility)
- Audio quality considerations: speaker wattage, microphone sensitivity, echo cancellation
- Use cases: front door packages, warehouse communication, elderly care, pet deterrence
- Privacy concerns: audio laws (two-party consent states)
- Comparison table: 5-6 cameras with good two-way audio (Reolink, Eufy, TP-Link, Ring, Arlo)
- Setup tips: speaker placement, reducing background noise, volume settings
- Smart home integration: Alexa/Google announcements, doorbell chimes
- Internal links: `best-outdoor-security-cameras-2026` (camera picks), `smart-home-integration-alexa-google-homekit` (voice integration), `privacy-laws-by-state-cctv-guide` (audio consent laws)

- [ ] **Step 3: Add internal links**

- [ ] **Step 4: Commit**

---

### Task 11: Battery Life & Power Options: Corded vs Battery vs Solar

**Files:**

- Create: `content/posts/battery-life-power-options-corded-vs-battery-vs-solar/en.mdx`

- [ ] **Step 1: Write frontmatter**

```yaml
---
title: "Battery Life & Power Options: Corded vs Battery vs Solar"
description: "Deep dive into security camera power sources: how long batteries really last, solar panel sizing, and choosing the right power solution for your setup."
publishedAt: 2026-07-18T00:00:00.000Z
updatedAt: 2026-07-18T00:00:00.000Z
slug: "battery-life-power-options-corded-vs-battery-vs-solar"
author: "Your Name"
tags: ["battery-life", "installation", "comparison"]
postType: "howto"
---
```

- [ ] **Step 2: Write article content (≈2000 words)**

Structure:

- Introduction: Power choices dominate camera selection—understand trade-offs
- Battery types: lithium-ion, li-poly, rechargeable vs replaceable
- How to estimate battery life: motion events per day, video quality, features (spotlight, PTZ)
- Solar panel sizing: watts vs battery capacity, winter/summer differences
- Comparison table: battery life claims vs real-world for popular models
- Extending battery life: settings tweaks, schedule recording, sensitivity adjustment
- Corded (PoE/ AC adapter) advantages: unlimited runtime, higher power consumption allowed
- Internal links: `best-solar-powered-security-cameras` (solar-specific), `best-outdoor-security-cameras-2026` (power options in reviews), `wireless-camera-setup-diy-tips` (installation)

- [ ] **Step 3: Add internal links**

- [ ] **Step 4: Commit**

---

### Task 12: Cloud Storage vs Local Storage for Security Cameras

**Files:**

- Create: `content/posts/cloud-storage-vs-local-storage/en.mdx`

- [ ] **Step 1: Write frontmatter**

```yaml
---
title: "Cloud Storage vs Local Storage for Security Cameras"
description: "Complete cost comparison, privacy implications, and bandwidth requirements. Should you store your security footage in the cloud or on local hard drives?"
publishedAt: 2026-07-18T00:00:00.000Z
updatedAt: 2026-07-18T00:00:00.000Z
slug: "cloud-storage-vs-local-storage"
author: "Your Name"
tags: ["cloud-storage", "local-storage", "privacy-law", "buying-guide"]
postType: "comparison"
---
```

- [ ] **Step 2: Write article content (≈2500 words)**

Structure:

- Introduction: Storage is a critical, ongoing cost—understand the options
- Cloud storage: how it works, subscription costs (per camera), vendor lock-in, accessibility, security
- Local storage: NVR/DVR hard drives, NAS, microSD cards—upfront cost, maintenance, privacy
- Comparison table: cloud vs local across dimensions (cost 5yr, accessibility, privacy, bandwidth, reliability)
- Detailed cost analysis: sample setups with 4/8 cameras over 5 years
- Privacy deep dive: where footage is stored, law enforcement access, encryption
- Hybrid approaches: local recording with cloud backup for clips
- Internal links: `best-small-business-security-camera-systems` (business storage needs), `cctv-video-file-formats` (formats for storage), `privacy-laws-by-state-cctv-guide` (storage regulations)

- [ ] **Step 3: Add internal links**

- [ ] **Step 4: Commit**

---

### Task 13: Smart Home Integration: Alexa, Google, HomeKit

**Files:**

- Create: `content/posts/smart-home-integration-alexa-google-homekit/en.mdx`

- [ ] **Step 1: Write frontmatter**

```yaml
---
title: "Smart Home Integration: Alexa, Google, HomeKit"
description: "Which security cameras work with your smart home ecosystem? We cover compatibility, automation scenarios, and voice control setup for Alexa, Google Assistant, and Apple HomeKit."
publishedAt: 2026-07-18T00:00:00.000Z
updatedAt: 2026-07-18T00:00:00.000Z
slug: "smart-home-integration-alexa-google-homekit"
author: "Your Name"
tags: ["smart-home", "ai-features", "diy"]
postType: "howto"
---
```

- [ ] **Step 2: Write article content (≈2000 words)**

Structure:

- Introduction: Smart home integration adds convenience but adds compatibility complexity
- Ecosystem overview: Alexa (Amazon), Google Assistant, Apple HomeKit/ HomeKit Secure Video
- Compatibility check: how to know if a camera works (skills, works with Alexa, HomeKit certification)
- What integration enables: live view on smart displays, voice commands, automations (motion triggers other devices)
- Table: camera brands and which ecosystems they support
- Setup walkthroughs for each major platform
- Limitations: cloud dependency, latency, feature parity
- Internal links: `best-outdoor-security-cameras-2026` (camera compatibility table), `two-way-audio-security-cameras-complete-guide` (smart home announcements), `best-apartment-dwellers` (renters with smart homes)

- [ ] **Step 3: Add internal links**

- [ ] **Step 4: Commit**

---

### Task 14: DIY Security Camera Installation: Complete Guide

**Files:**

- Create: `content/posts/diy-security-camera-installation-complete-guide/en.mdx`

- [ ] **Step 1: Write frontmatter**

```yaml
---
title: "DIY Security Camera Installation: Complete Guide"
description: "Step-by-step guide to installing security cameras yourself: tools, wiring, mounting, configuration, and safety tips for both wired and wireless systems."
publishedAt: 2026-07-18T00:00:00.000Z
updatedAt: 2026-07-18T00:00:00.000Z
slug: "diy-security-camera-installation-complete-guide"
author: "Your Name"
tags: ["diy", "installation", "howto"]
postType: "howto"
---
```

- [ ] **Step 2: Write article content (≈2500 words)**

Structure:

- Introduction: DIY saves money and gives control—overview of what's involved
- Tools checklist: drill, fish tape, cable clips, ladder, screwdriver set, wire stripper, etc.
- Pre-installation planning: camera placement survey, field of view testing (use phone), cable routing paths
- Wiring: Cat5e/6 for PoE, RG59 for analog, power adapters for wireless
- Mounting: different surfaces (wood, stucco, brick, vinyl), use of anchors, weatherproofing
- Drill/Run cable: techniques to avoid obstacles, through ceilings/attics, conduit use
- Termination: RJ45 crimping, BNC connectors, waterproofing connections
- NVR/DVR placement and network setup
- Testing and adjustment: focus, motion detection zones, smartphone app setup
- Safety: ladder safety, electrical (avoid power lines), drilling into walls (stud finder)
- Internal links: `poe-camera-cable-running-diy-installation` (PoE specifics), `wireless-camera-setup-diy-tips` (wireless focus), `camera-resolution-guide` (placement for optimal view)

- [ ] **Step 3: Add internal links**

- [ ] **Step 4: Commit**

---

### Task 15: How to Mount Outdoor Cameras (Wall, Ceiling, Eave)

**Files:**

- Create: `content/posts/how-to-mount-outdoor-cameras-wall-ceiling-eave/en.mdx`

- [ ] **Step 1: Write frontmatter**

```yaml
---
title: "How to Mount Outdoor Cameras (Wall, Ceiling, Eave)"
description: "Step-by-step mounting instructions for outdoor security cameras on different surfaces. Includes hardware selection, weatherproofing, and angle adjustment tips."
publishedAt: 2026-07-18T00:00:00.000Z
updatedAt: 2026-07-18T00:00:00.000Z
slug: "how-to-mount-outdoor-cameras-wall-ceiling-eave"
author: "Your Name"
tags: ["diy", "installation", "outdoor"]
postType: "howto"
---
```

- [ ] **Step 2: Write article content (≈1800 words)**

Structure:

- Introduction: Proper mounting is critical for performance and weatherproofing
- Mounting location considerations: height (8-12 ft), angle (downward), avoiding glare, eavesdropping
- Hardware types: camera-specific mounts, universal brackets, adjustable arms, pole mounts
- Surface prep: cleaning, marking, pilot holes
- Wall mounting: stud finder, screws, anchors, sealing holes with silicone
- Ceiling mounting (under eaves): recommended for front door coverage, use lag bolts into rafters
- Eave mounting: positioning to cover driveway/yard, avoid obstruction
- Pole mounting: ground-mounted poles, guy wires for tall poles
- Weatherproofing: cable jackets, silicon gel, downward angle to prevent water pooling
- Internal links: `diy-security-camera-installation-complete-guide` (comprehensive), `best-outdoor-security-cameras-2026` (camera-specific tips), `poe-camera-cable-running-diy-installation` (cable management)

- [ ] **Step 3: Add internal links**

- [ ] **Step 4: Commit**

---

### Task 16: PoE Camera Cable Running: DIY Installation

**Files:**

- Create: `content/posts/poe-camera-cable-running-diy-installation/en.mdx`

- [ ] **Step 1: Write frontmatter**

```yaml
---
title: "PoE Camera Cable Running: DIY Installation"
description: "How to run Ethernet cables for PoE security cameras through walls, attics, and conduit. Complete guide to tools, cable types, and best practices for reliable installations."
publishedAt: 2026-07-18T00:00:00.000Z
updatedAt: 2026-07-18T00:00:00.000Z
slug: "poe-camera-cable-running-diy-installation"
author: "Your Name"
tags: ["diy", "installation", "poe-camera"]
postType: "howto"
---
```

- [ ] **Step 2: Write article content (≈2000 words)**

Structure:

- Introduction: PoE delivers power and data over one cable—the gold standard for reliability
- Cable selection: Cat5e vs Cat6 vs outdoor-rated, solid core vs stranded, shielded vs unshielded
- Tools: fish tape, cable puller, crimping tools, RJ45 connectors, punch-down tool (for keystone)
- Planning route: from NVR location to camera locations; shortest practical path; avoiding interference
- Running cable:
  - Through walls (vertical runs between floors)
  - Through attic (crossing joists, protection from insulation)
  - Through conduit (outdoor, underground, or exposed)
  - Through soffit/fascia
- Termination: RJ45 plugs (field-terminated) vs keystone jacks (more reliable)
- Testing: cable tester, PoE injector test before final mounting
- Troubleshooting: no power, intermittent connection, PoE standard mismatches (802.3af/at)
- Internal links: `poe-nvr-setup` (NVR configuration), `diy-security-camera-installation-complete-guide` (general), `best-small-business-security-camera-systems` (PoE common in business)

- [ ] **Step 3: Add internal links**

- [ ] **Step 4: Commit**

---

### Task 17: Wireless Camera Setup: DIY Installation Tips

**Files:**

- Create: `content/posts/wireless-camera-setup-diy-tips/en.mdx`

- [ ] **Step 1: Write frontmatter**

```yaml
---
title: "Wireless Camera Setup: DIY Installation Tips"
description: "Avoid WiFi dead zones and interference with these wireless security camera installation tips. Placement, network optimization, and troubleshooting for reliable connectivity."
publishedAt: 2026-07-18T00:00:00.000Z
updatedAt: 2026-07-18T00:00:00.000Z
slug: "wireless-camera-setup-diy-tips"
author: "Your Name"
tags: ["diy", "installation", "wireless"]
postType: "howto"
---
```

- [ ] **Step 2: Write article content (≈1800 words)**

Structure:

- Introduction: Wireless means no cables for power/data, but WiFi reliability is key
- Understanding WiFi range: 2.4GHz vs 5GHz, obstacles (walls, floors), interference (microwaves, neighbors)
- Signal strength testing: use phone apps before installing
- Optimizing home network: access point placement, mesh systems, network segregation (IoT VLAN)
- Setup process: power on, app pairing, WiFi connection, firmware update
- Common pitfalls: weak signal, crowded channels, ISP router limitations
- Troubleshooting: frequent disconnects, slow streaming, event delays
- Extenders and access points: when to add them, Ethernet backhaul preferred
- Internal links: `best-apartment-dwellers` (rental wireless setups), `poe-vs-wireless-vs-solar-comparison` (connectivity comparison), `best-outdoor-security-cameras-2026` (outdoor wireless models)

- [ ] **Step 3: Add internal links**

- [ ] **Step 4: Commit**

---

### Task 18: Common Security Camera Problems & Fixes

**Files:**

- Create: `content/posts/common-security-camera-problems-fixes/en.mdx`

- [ ] **Step 1: Write frontmatter**

```yaml
---
title: "Common Security Camera Problems & Fixes"
description: "Troubleshooting guide for the most frequent security camera issues: no video, poor night vision, connectivity drops, false alarms, and more. Step-by-step fixes."
publishedAt: 2026-07-18T00:00:00.000Z
updatedAt: 2026-07-18T00:00:00.000Z
slug: "common-security-camera-problems-fixes"
author: "Your Name"
tags: ["diy", "troubleshooting", "howto"]
postType: "howto"
---
```

- [ ] **Step 2: Write article content (≈2200 words)**

Structure:

- Introduction: Problems are inevitable—this is your go-to troubleshooting reference
- Symptom-based troubleshooting flowchart (text + bullet decisions)
- Problems and fixes:
  1. Camera offline/not connecting
  2. No video or black screen
  3. Poor night vision (grainy, short range)
  4. Constant false motion alerts
  5. Laggy/latency in live view
  6. Two-way audio not working
  7. Recording not saving (SD/NVR)
  8. App crashes or cannot login
  9. IR LEDs staying on all day
  10. Battery draining too fast
- For each: symptoms, likely causes, step-by-step fixes, when to contact support
- Maintenance tips: firmware updates, cleaning lenses, battery replacement
- Internal links: `night-vision-not-working-troubleshooting-guide` (specific night vision), `wireless-camera-setup-diy-tips` (connectivity issues), `battery-life-power-options-corded-vs-battery-vs-solar` (power problems)

- [ ] **Step 3: Add internal links**

- [ ] **Step 4: Commit**

---

### Task 19: Night Vision Not Working? Troubleshooting Guide

**Files:**

- Create: `content/posts/night-vision-not-working-troubleshooting-guide/en.mdx`

- [ ] **Step 1: Write frontmatter**

```yaml
---
title: "Night Vision Not Working? Troubleshooting Guide"
description: "Is your camera's night vision fuzzy, short-range, or completely dark? Diagnose and fix IR night vision problems with our step-by-step guide."
publishedAt: 2026-07-18T00:00:00.000Z
updatedAt: 2026-07-18T00:00:00.000Z
slug: "night-vision-not-working-troubleshooting-guide"
author: "Your Name"
tags: ["diy", "troubleshooting", "night-vision"]
postType: "howto"
---
```

- [ ] **Step 2: Write article content (≈1600 words)**

Structure:

- Introduction: Night vision is critical—when it fails, your camera is useless at night
- How IR night vision works: IR LEDs, sensor sensitivity, IR cut filter
- Common symptoms and diagnosis:
  - Completely dark: IR LEDs off (settings, power), object blocking IR
  - Very short range (5-10 ft): weak IR, dirty lens, power insufficient
  - Grainy/blurry: low sensitivity, overexposed IR reflection, dirty lens
  - IR glare/reflection: nearby surfaces reflecting IR, reposition angle
  - IR staying on during day: broken IR cut filter or setting
- Step-by-step fixes: check settings (IR mode auto/on), clean lens, ensure no obstructions, power cycle, firmware
- When it's not fixable: failed IR LEDs, broken sensor, need RMA
- Upgrading: color night vision cameras (spotlight, starlight sensors)
- Internal links: `color-night-vision-vs-ir-comparison` (color night vision option), `common-security-camera-problems-fixes` (broader troubleshooting), `best-outdoor-security-cameras-2026` (camera picks with good night vision)

- [ ] **Step 3: Add internal links**

- [ ] **Step 4: Commit**

---

### Task 20: CCTV Video Storage Calculator: How Much Hard Drive Space

**Files:**

- Create: `content/posts/cctv-video-storage-calculator-hard-drive-space/en.mdx`

- [ ] **Step 1: Write frontmatter**

```yaml
---
title: "CCTV Video Storage Calculator: How Much Hard Drive Space"
description: "Calculate hard drive requirements for your CCTV system. We explain the factors (resolution, framerate, compression) and provide a practical calculator for retention planning."
publishedAt: 2026-07-18T00:00:00.000Z
updatedAt: 2026-07-18T00:00:00.000Z
slug: "cctv-video-storage-calculator-hard-drive-space"
author: "Your Name"
tags: ["resources", "storage", "howto"]
postType: "howto"
---
```

- [ ] **Step 2: Write article content (≈1800 words)**

Structure:

- Introduction: Storage planning prevents running out of space and ensures you keep footage long enough
- Storage calculation formula: bitrate × seconds per day × retention days ÷ 8 = GB needed
- Variables explained:
  - Resolution and framerate's impact on bitrate
  - Compression: H.264 vs H.265 (roughly half the size)
  - Motion-only vs continuous recording
  - Scene complexity (high motion = higher bitrate)
- Table: estimated daily storage per camera at common configs (1080p 15fps H.265 motion ≈ 6GB/day, etc.)
- Example calculations: 8 camera system, 30 days retention → X TB needed ( RAID overhead)
- Calculator tool: present interactive-like steps (readers can multiply themselves)
- NVR hard drive selection: NAS drives vs desktop, RAID 1/5/10 for redundancy
- Internal links: `cctv-video-file-formats` (formats/compression), `best-small-business-security-camera-systems` (business retention needs), `best-security-cameras-under-100-2026` (budget storage options)

- [ ] **Step 3: Add internal links**

- [ ] **Step 4: Commit**

---

## Verification Steps

After all 20 tasks complete:

- [ ] **Build Velite**: `bun run build` (watcher: `bun run dev`) → ensure no content errors
- [ ] **Lint**: `bun run lint`
- [ ] **Typecheck**: `bun run typecheck`
- [ ] **Format**: `bun run format`
- [ ] **Review git status**: verify 20 new directories under `content/posts/`
- [ ] **Test internal links**: spot-check that links point to existing slugs

---

**Plan complete and saved to `docs/superpowers/plans/2026-07-18-remaining-20-topics-implementation.md`.**

**Execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute all tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
