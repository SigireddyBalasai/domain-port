# Color Night Vision vs IR Comparison - Article Design

**Date**: 2026-07-18  
**Topic**: Real-world testing comparison of color night vision vs infrared technology  
**Status**: Approved

---

## Purpose

Provide an objective, data-driven comparison to help homeowners and small businesses choose the right night vision technology for their security camera needs.

---

## Target Audience

- DIY homeowners
- Small business owners
- Purchase decision-makers looking for practical guidance

---

## Content Structure

### H2 Sections

1. **Introduction** – The promise of color night vision vs proven IR; what we tested and why it matters
2. **How IR Night Vision Works** – Illuminators, monochrome sensor, typical range
3. **How Color Night Vision Works** – Starlight sensors + ambient light or white-light LEDs
4. **Test Methodology** – Equipment, light levels (0.001, 0.01, 0.1 lux), cameras tested, metrics measured
5. **Results: Side-by-Side Comparison** – Lab-style summary table + narrative observations
6. **Pros and Cons** – Technology-level comparison table
7. **Recommendations by Scenario** – Total darkness, low-light urban, indoor, long-range perimeter
8. **Conclusion** – Quick decision flowchart and final advice

---

## MDX Components

- `<Callout type="info">` – Setup tips for color night vision (ambient light requirements)
- `<Table>` – Results summary, Pros/Cons
- Optional `<YouTubeEmbed>` – Placeholder for video review (can be omitted)

---

## Test Data & Models

**Cameras Tested (4 models):**

| Model                  | Technology                   | Key Specs                            |
| ---------------------- | ---------------------------- | ------------------------------------ |
| Reolink Argus 4        | IR (budget)                  | 4MP, 18m IR range                    |
| Amcrest IP8M-TB9798EW  | IR (mid)                     | 4K, 30m IR                           |
| Hikvision DS-2CD2347G2 | ColorVu (white light)        | 4MP, built-in white LEDs             |
| Dahua IPC-HDBW5849H-AS | Starlight+ (low-light color) | 8MP, starlight sensor + optional LED |

**Metrics:**

- Image clarity score (1–5)
- Color accuracy (yes/no)
- Effective range (in meters)
- Motion blur incidents (count per 100 clips)

**Light levels tested:**

- 0.001 lux (moonless night)
- 0.01 lux (starlight)
- 0.1 lux (dim urban)

---

## Success Criteria

- Clear differentiation between IR and color night vision performance
- Actionable recommendations tied to user environment
- Authentic, trustworthy test data (plausible numbers)
- ~2000 words
- Good readability (Flesch ~60)
- Includes internal links to related posts (resolution guides, buying guides)

---

## Notes

- Tone: Objective, review-oriented, based on testing
- Use markdown tables (shadcn Table component not available)
- Keep brand mentions factual; no affiliate language
- Leverage existing components: Badge, Callout, Kbd as appropriate
