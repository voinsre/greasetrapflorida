# Grease Trap Florida — Image Specification

**Total images needed:** 15
**Generation tool:** Gemini (Antigravity) or equivalent AI image generator
**Format:** WebP
**Output directory:** `/public/images/` (flat — NO subdirectories to avoid gotcha #21)

---

## Global Style Guidelines

All images must follow these rules:

- **Style:** Photorealistic, professional, warm lighting
- **NO faces visible** — always show backs, hands, or equipment only
- **NO text, logos, or watermarks** in any image
- **NO brand names** visible on equipment or uniforms
- **Color palette:** Warm tones with teal/green accents to match site design
- **Setting:** Florida feel — bright light, clean commercial environments
- **Mood:** Professional, trustworthy, competent

---

## Image List

### 1. Homepage Hero

| Field | Value |
|---|---|
| **Filename:** | `hero-grease-trap-florida.webp` |
| **Dimensions:** | 1920 × 800 |
| **Max size:** | 120KB |
| **Alt text:** | "Professional grease trap cleaning service at a Florida restaurant" |
| **Placement:** | Homepage hero section (full-width, behind search bar overlay) |
| **Next.js:** | `priority={true}`, `sizes="100vw"` |
| **Prompt:** | A professional service technician in clean work clothing operating a vacuum hose near a commercial grease trap outside a busy Florida restaurant. Bright sunny day. Palm trees visible in background. The stainless steel grease trap is open with the worker actively pumping. Clean white service truck partially visible. Shot from behind/side angle, no face visible. Photorealistic, warm lighting, professional atmosphere. |

### 2. OG/Social Sharing Image (Default)

| Field | Value |
|---|---|
| **Filename:** | `og-image.webp` |
| **Dimensions:** | 1200 × 630 |
| **Max size:** | 80KB |
| **Alt text:** | "Grease Trap Florida - Find Licensed Grease Trap Services" |
| **Placement:** | Default OG image, root layout metadata |
| **Prompt:** | Clean flat-lay composition: a commercial kitchen grease trap grate on a stainless steel surface, a pump hose neatly coiled, a clipboard with a service manifest form, and a set of work gloves. All arranged professionally on a clean surface. Bright, even lighting. Teal green accent in the composition (maybe gloves or clipboard edge). Top-down overhead shot. Photorealistic. |

### 3. Compliance Guide Header

| Field | Value |
|---|---|
| **Filename:** | `guide-compliance.webp` |
| **Dimensions:** | 1200 × 630 |
| **Max size:** | 60KB |
| **Alt text:** | "Florida grease waste compliance guide - Chapter 62-705 explained" |
| **Placement:** | /compliance/chapter-62-705-guide + OG image for compliance pages |
| **Prompt:** | Close-up of hands holding an official-looking compliance document with a clipboard, standing next to a commercial kitchen grease interceptor access point. Background shows a clean restaurant kitchen slightly blurred. Bright Florida daylight coming through a window. Professional, serious but approachable mood. No text visible on document. Photorealistic. |

### 4. Cost Guide Header

| Field | Value |
|---|---|
| **Filename:** | `guide-cost.webp` |
| **Dimensions:** | 1200 × 630 |
| **Max size:** | 60KB |
| **Alt text:** | "Grease trap cleaning cost guide for Florida businesses" |
| **Placement:** | /cost/grease-trap-cleaning-cost + OG image |
| **Prompt:** | A commercial kitchen manager reviewing a service invoice on a tablet while standing in a clean professional kitchen. Stainless steel counters, commercial cooking equipment slightly blurred in background. Focus on the tablet and hands. Warm overhead kitchen lighting. Professional atmosphere. No face visible — shot from over the shoulder. Photorealistic. |

### 5. Choosing a Provider Guide Header

| Field | Value |
|---|---|
| **Filename:** | `guide-choosing.webp` |
| **Dimensions:** | 1200 × 630 |
| **Max size:** | 60KB |
| **Alt text:** | "How to choose a grease trap service company in Florida" |
| **Placement:** | /guides/how-to-choose-grease-trap-service + OG image |
| **Prompt:** | Two service professionals in clean uniforms consulting with a restaurant manager near an open outdoor grease interceptor. One professional holds a clipboard, pointing at the trap. Sunny Florida day, palm trees in the far background. Shot from medium distance, faces not clearly visible. Clean white service truck in the background. Photorealistic, warm tones. |

### 6. Frequency Guide Header

| Field | Value |
|---|---|
| **Filename:** | `guide-frequency.webp` |
| **Dimensions:** | 1200 × 630 |
| **Max size:** | 60KB |
| **Alt text:** | "Grease trap cleaning schedule and frequency guide for Florida" |
| **Placement:** | /guides/grease-trap-cleaning-frequency-florida + OG image |
| **Prompt:** | A wall-mounted maintenance schedule whiteboard in a commercial kitchen with dates and service intervals visible (text not readable, just marks/colors). Next to it, a clean grease trap access point on the floor. Kitchen equipment slightly blurred in background. Bright overhead fluorescent lighting typical of a commercial kitchen. Photorealistic, organized professional environment. |

### 7. Manifest Guide Header

| Field | Value |
|---|---|
| **Filename:** | `guide-manifest.webp` |
| **Dimensions:** | 1200 × 630 |
| **Max size:** | 60KB |
| **Alt text:** | "Florida grease waste service manifest guide for restaurants" |
| **Placement:** | /compliance/grease-waste-manifest + OG image |
| **Prompt:** | Close-up of a service technician's gloved hands filling out a multi-part form on a clipboard, next to an open grease trap. A pen in hand, service truck in the blurred background. Official-looking form with sections and signature lines visible but not readable. Outdoor setting, Florida sunshine. Photorealistic. |

### 8. Emergency Overflow Guide Header

| Field | Value |
|---|---|
| **Filename:** | `guide-emergency.webp` |
| **Dimensions:** | 1200 × 630 |
| **Max size:** | 60KB |
| **Alt text:** | "Emergency grease trap overflow response guide" |
| **Placement:** | /guides/emergency-grease-trap-overflow + OG image |
| **Prompt:** | A service truck with emergency lights/amber beacon parked outside a restaurant at dusk. Service hoses deployed from the truck to the building. Dramatic warm sunset sky. Sense of urgency but professional response. The truck is a clean, well-maintained vacuum truck. Shot from across the parking lot. Photorealistic, dramatic lighting. |

### 9. FOG Inspection Guide Header

| Field | Value |
|---|---|
| **Filename:** | `guide-inspection.webp` |
| **Dimensions:** | 1200 × 630 |
| **Max size:** | 60KB |
| **Alt text:** | "What to expect during a Florida FOG inspection" |
| **Placement:** | /guides/what-happens-fail-fog-inspection + OG image |
| **Prompt:** | A health inspector with a clipboard examining a commercial kitchen grease trap interior, shining a flashlight into the open trap. The inspector wears a polo shirt and lanyard. Shot from behind at a distance, face not visible. Clean restaurant kitchen in background. Professional, slightly serious tone. Bright kitchen lighting. Photorealistic. |

### 10. Restaurant Checklist Guide Header

| Field | Value |
|---|---|
| **Filename:** | `guide-restaurant-checklist.webp` |
| **Dimensions:** | 1200 × 630 |
| **Max size:** | 60KB |
| **Alt text:** | "Restaurant opening grease trap compliance checklist for Florida" |
| **Placement:** | /guides/starting-restaurant-florida-grease-compliance + OG image |
| **Prompt:** | A bright, brand-new restaurant kitchen — everything clean and shiny stainless steel. An empty commercial kitchen before opening day. A fresh concrete grease interceptor access point visible on the floor near the dishwashing area. Natural light streaming through new windows. Optimistic, fresh-start feeling. Photorealistic. |

### 11. About Page Image

| Field | Value |
|---|---|
| **Filename:** | `about-page.webp` |
| **Dimensions:** | 1200 × 630 |
| **Max size:** | 60KB |
| **Alt text:** | "About Grease Trap Florida - helping businesses find trusted service providers" |
| **Placement:** | /about page |
| **Prompt:** | Aerial view of a Florida commercial district — strip malls, restaurant row, palm trees, blue sky with white clouds. The camera is looking down at about 45 degrees. Multiple restaurant storefronts visible. Clean, organized commercial area. Bright Florida sunshine. Photorealistic, warm colors. |

### 12. Advertise/Claim Page Image

| Field | Value |
|---|---|
| **Filename:** | `advertise-page.webp` |
| **Dimensions:** | 1200 × 630 |
| **Max size:** | 60KB |
| **Alt text:** | "Advertise your grease trap service on Grease Trap Florida" |
| **Placement:** | /advertise and /claim-listing pages |
| **Prompt:** | A clean white grease trap service truck parked in front of a successful-looking restaurant. The truck is professionally branded (no readable text). Restaurant has an outdoor seating area with customers (blurred, distant). Palm trees, blue sky. The truck looks new and well-maintained. A service technician is walking toward the restaurant entrance, viewed from behind. Photorealistic, professional, aspirational. |

### 13-15. Blog Post Headers (3 generic images for rotation)

| Field | Value |
|---|---|
| **Filenames:** | `blog-kitchen-1.webp`, `blog-kitchen-2.webp`, `blog-kitchen-3.webp` |
| **Dimensions:** | 1200 × 630 |
| **Max size:** | 60KB each |
| **Alt text:** | Unique per blog post (set in blog content) |
| **Placement:** | Blog posts, rotated across 6 seed posts + future posts |

**Prompt 13:** Interior of a busy commercial kitchen during service. Stainless steel, steam, activity. Floor drains visible. Warm commercial lighting. Wide shot, no faces identifiable. Energy and movement. Photorealistic.

**Prompt 14:** Close-up of a stainless steel grease trap grate being cleaned with a brush and degreaser spray. Soapy water, clean gloves, professional work. Tight crop on the hands and equipment. Bright lighting. Photorealistic, detail-oriented.

**Prompt 15:** Exterior of a Florida restaurant row at golden hour — multiple storefronts, outdoor dining, warm sunset light. Clean commercial area with landscaping. Shot from the sidewalk. No people in focus. Warm, inviting, Florida atmosphere. Photorealistic.

---

## Image Optimization Checklist

After generating all images:

- [ ] Convert all to WebP format
- [ ] Verify hero image under 120KB
- [ ] Verify OG image under 80KB
- [ ] Verify all guide/blog images under 60KB
- [ ] Place ALL images in `/public/images/` (flat directory, no nesting)
- [ ] Verify filenames match this spec exactly
- [ ] Add to Next.js pages with correct `width`, `height`, `sizes`, and `alt`
- [ ] Set hero image `priority={true}`
- [ ] Verify OG image path in root layout metadata matches actual file

---

## Lucide React Icons Used Throughout

These are the primary icons used in the site. Import from `lucide-react`:

| Icon | Usage |
|---|---|
| `Phone` | Click-to-call buttons |
| `Globe` | Website links |
| `MapPin` | Address/location |
| `Star` | Ratings |
| `ShieldCheck` | DEP Licensed badge |
| `Clock` | 24/7 Emergency badge |
| `Truck` | Service badge |
| `ClipboardCheck` | Manifest Provided badge |
| `Filter` | Filter bar |
| `Search` | Search bar |
| `ChevronRight` | Breadcrumbs, navigation |
| `ChevronDown` | FAQ accordion |
| `ExternalLink` | External website links |
| `Mail` | Email/contact |
| `AlertTriangle` | Emergency/warning content |
| `CheckCircle` | Verified checkmarks on listings |
| `Building2` | Establishment type icons |
| `Wrench` | Service type icons |
| `FileText` | Compliance/manifest icons |
| `DollarSign` | Cost/pricing content |

No custom SVGs needed. Lucide React covers all icon needs for this build.
