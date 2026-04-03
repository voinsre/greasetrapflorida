# Grease Trap Florida — Image Specification v2

**Total images needed:** 15
**Generation model:** Nano Banana Pro (via Antigravity)
**Output format:** WebP
**Output directory:** `/public/images/` (flat — NO subdirectories to avoid gotcha #21)

---

## Global Style Guidelines

**CRITICAL: Every prompt must include these quality anchors at the END:**
```
Shot on Sony A7IV, 35mm f/1.8 lens. Natural light mixed with ambient. 
8K resolution, hyperrealistic, editorial photography, shallow depth of field. 
Color graded: warm highlights, lifted shadows, slight teal in midtones.
```

**Scene rules for ALL images:**
- Absolutely NO human faces visible — ever. Shoot from behind, over shoulder, hands only, or empty scenes
- NO text, words, letters, numbers, logos, brand names, signage readable in any image
- NO AI artifacts: no extra fingers, no melting objects, no floating elements
- Florida environment: bright natural light, subtropical vegetation, modern commercial architecture
- Color temperature: warm (5500K-6500K), slight golden bias
- Mood: clean, professional, competent — like a commercial shoot for a trade magazine

---

## Prompt Template

Every prompt follows this structure:
```
[SUBJECT] + [ENVIRONMENT/SETTING] + [COMPOSITION/CAMERA] + [LIGHTING] + [MOOD/ATMOSPHERE] + [QUALITY ANCHORS]
```

---

## Image List

### 1. Homepage Hero

| Field | Value |
|---|---|
| **Filename:** | `hero-grease-trap-florida.webp` |
| **Dimensions:** | 1920 x 800 |
| **Max size:** | 120KB |
| **Alt text:** | "Professional grease trap cleaning service at a Florida restaurant" |
| **Placement:** | Homepage hero section (full-width, behind search bar overlay with dark gradient) |
| **Next.js:** | `priority={true}`, `sizes="100vw"` |

**Prompt:**
```
A professional grease trap service technician in crisp navy blue work coveralls and nitrile gloves, crouching beside an open concrete in-ground grease interceptor outside a commercial restaurant. The technician is viewed from behind at a three-quarter angle, operating a 4-inch diameter vacuum hose connected to a white Peterbilt vacuum truck parked on the right side of the frame. The grease interceptor lid is propped open revealing the stainless steel interior baffle. 

Setting: a modern Florida strip mall restaurant exterior, clean stucco walls painted warm beige, red awning above the restaurant entrance. Two tall Royal Palm trees frame the background against a vivid blue sky with wispy cirrus clouds. The parking lot is clean black asphalt with fresh white line markings.

Composition: wide shot, 24mm equivalent focal length, rule of thirds with the technician at the left third intersection. Low camera angle (waist height) looking slightly upward. The vacuum truck occupies the right 30% of the frame.

Lighting: mid-morning Florida sun, golden directional light from upper left casting defined shadows. Slight lens flare from the sun hitting the truck's chrome exhaust stack.

Shot on Sony A7IV, 24mm f/2.8 lens. Natural sunlight, golden hour morning. 8K resolution, hyperrealistic, editorial commercial photography. Color graded: warm highlights, lifted shadows, slight teal in the sky midtones.
```

### 2. OG/Social Sharing Image (Default)

| Field | Value |
|---|---|
| **Filename:** | `og-image.webp` |
| **Dimensions:** | 1200 x 630 |
| **Max size:** | 80KB |
| **Alt text:** | "Grease Trap Florida - Find Licensed Grease Trap Services" |
| **Placement:** | Default OG image, root layout metadata |

**Prompt:**
```
Overhead flat-lay product photography on a clean brushed stainless steel commercial kitchen prep table. Arranged deliberately in a grid composition: a pair of heavy-duty black nitrile work gloves laid flat, a coiled 2-inch diameter black rubber pump hose, an aluminum clipboard with a multi-carbon service form (no readable text, just lines and checkbox shapes visible), a yellow industrial flashlight, and a stainless steel grease trap strainer basket with fine mesh. A teal-colored pen rests diagonally across the clipboard.

Everything is clean — no grease or grime on the items. The surface has subtle scratches consistent with a real commercial prep table. Items cast soft shadows downward.

Composition: perfectly top-down aerial view, centered, symmetrical spacing between objects. Each item occupies its own zone with 2 inches of breathing room.

Lighting: soft overhead LED panel lighting mimicking a commercial kitchen ceiling, even diffusion, minimal shadows, slight specular highlights on the stainless steel surface and flashlight body.

Shot on Sony A7IV with 50mm f/2.8 macro lens. Overhead tripod mount. 8K resolution, hyperrealistic product photography, studio-quality flat lay. Clean color grade: neutral whites, slight warm cast on the metal surfaces.
```

### 3. Compliance Guide Header

| Field | Value |
|---|---|
| **Filename:** | `guide-compliance.webp` |
| **Dimensions:** | 1200 x 630 |
| **Max size:** | 60KB |
| **Alt text:** | "Florida grease waste compliance guide - Chapter 62-705 explained" |
| **Placement:** | /compliance/chapter-62-705-guide + OG image for compliance pages |

**Prompt:**
```
Close-up of two hands wearing clean latex gloves holding a thick multi-page official document on a brown clipboard. The document has printed horizontal lines and three distinct sections separated by bold divider lines — no readable text, just the structural layout of a multi-part form. The hands are positioned mid-frame, thumbs visible gripping the clipboard edges.

Background: a commercial kitchen scene at f/2.0 bokeh — soft blurred shapes of a stainless steel three-compartment sink, a wall-mounted hand soap dispenser, and the edge of a concrete grease interceptor access cover on the tile floor. Warm fluorescent kitchen lighting creates a slight amber cast in the background.

Composition: medium close-up, 50mm equivalent, centered on the clipboard. Hands enter from the bottom of frame. Shallow depth of field isolates the clipboard from the background.

Lighting: bright overhead commercial kitchen fluorescents as key light, with warm Florida daylight entering from a small window on the right side creating a rim light on the glove edges.

Shot on Sony A7IV, 50mm f/1.8 lens. Mixed ambient light. 8K resolution, hyperrealistic, documentary-style editorial photography. Color graded: warm highlights, neutral midtones, slight green in the fluorescent-lit background.
```

### 4. Cost Guide Header

| Field | Value |
|---|---|
| **Filename:** | `guide-cost.webp` |
| **Dimensions:** | 1200 x 630 |
| **Max size:** | 60KB |
| **Alt text:** | "Grease trap cleaning cost guide for Florida businesses" |
| **Placement:** | /cost/grease-trap-cleaning-cost + OG image |

**Prompt:**
```
Over-the-shoulder shot of a restaurant manager in a clean black chef coat, standing in a modern commercial kitchen, holding a tablet displaying a spreadsheet with colored cells and charts (no readable text or numbers, just colored blocks and line shapes). The tablet screen is angled toward camera showing the grid pattern. The manager's hands and forearms are visible, no face.

Background: a professional commercial kitchen in sharp-to-soft focus — stainless steel prep tables, a commercial six-burner range with copper pots hanging above, and a reach-in refrigerator. Clean tile floor. The kitchen is spotless and well-organized.

Composition: over-the-shoulder from behind-right, 35mm equivalent. The tablet occupies the center-left of the frame. Background fills the right side with kitchen details. Slight Dutch angle (2 degrees) for editorial feel.

Lighting: warm overhead kitchen pendants as key light creating pools of warm light on the stainless surfaces. Cool blue LED strip under the hood vent adds subtle color contrast in the background.

Shot on Sony A7IV, 35mm f/1.8 lens. Available kitchen light. 8K resolution, hyperrealistic, lifestyle editorial photography. Color graded: warm golden highlights on skin and metal, cool blue accent in background shadows.
```

### 5. Choosing a Provider Guide Header

| Field | Value |
|---|---|
| **Filename:** | `guide-choosing.webp` |
| **Dimensions:** | 1200 x 630 |
| **Max size:** | 60KB |
| **Alt text:** | "How to choose a grease trap service company in Florida" |
| **Placement:** | /guides/how-to-choose-grease-trap-service + OG image |

**Prompt:**
```
A white Ford F-550 vacuum service truck with a polished stainless steel tank on the back, parked in a clean commercial parking lot in front of a row of Florida restaurants. The truck is freshly washed and gleaming in the sunlight. A service technician in navy coveralls is walking away from the camera toward the restaurant entrance, carrying a clipboard in one hand and a flashlight in the other. Viewed from behind at medium distance.

The restaurant facade has a modern awning, tropical landscaping with bird of paradise plants and small palm trees in concrete planters. Two other storefronts are visible — a bakery and a juice bar — creating a typical Florida strip mall scene. Clean sidewalk with outdoor cafe tables (empty) visible.

Composition: wide establishing shot, 28mm equivalent. Truck on the left third, technician walking toward the right third. Restaurant facades fill the background. Eye-level camera height.

Lighting: late morning Florida sun from upper right. Hard shadows on the parking lot. Bright specular reflections on the truck's stainless tank. The awning casts a clean shadow line across the restaurant facade.

Shot on Sony A7IV, 28mm f/4 lens. Bright natural sunlight. 8K resolution, hyperrealistic, commercial fleet photography. Color graded: punchy contrast, saturated blue sky, warm tones on the stucco buildings.
```

### 6. Frequency Guide Header

| Field | Value |
|---|---|
| **Filename:** | `guide-frequency.webp` |
| **Dimensions:** | 1200 x 630 |
| **Max size:** | 60KB |
| **Alt text:** | "Grease trap cleaning schedule and frequency guide for Florida" |
| **Placement:** | /guides/grease-trap-cleaning-frequency-florida + OG image |

**Prompt:**
```
A commercial kitchen wall showing a professional maintenance schedule board — a large white magnetic dry-erase calendar with colored magnets (red, green, blue, yellow) placed on various dates and rows of colored sticky dots. No readable text whatsoever — just colored shapes and marks arranged in a grid pattern. A red dry-erase marker hangs from a string attached to the board.

Below the board and to the right, visible at the edge of the frame: the top of a round concrete grease trap access cover set into a grey tile floor, with a recessed stainless steel pull handle.

Composition: medium shot, 50mm equivalent, slight upward angle. The calendar board occupies the upper 60% of the frame. The grease trap cover is visible in the lower right corner. Wall is clean white painted CMU block typical of a commercial kitchen back-of-house area.

Lighting: even overhead fluorescent panel lighting, no harsh shadows. Slight warm cast from the marker board's white surface reflecting the fluorescents. Clean, even exposure.

Shot on Sony A7IV, 50mm f/2.8 lens. Indoor fluorescent ambient. 8K resolution, hyperrealistic, workplace documentary photography. Color graded: neutral balanced, slight lift in shadows, clean whites.
```

### 7. Manifest Guide Header

| Field | Value |
|---|---|
| **Filename:** | `guide-manifest.webp` |
| **Dimensions:** | 1200 x 630 |
| **Max size:** | 60KB |
| **Alt text:** | "Florida grease waste service manifest guide for restaurants" |
| **Placement:** | /compliance/grease-waste-manifest + OG image |

**Prompt:**
```
Close-up of a service technician's hands in worn leather work gloves, writing on a triple-carbon NCR form attached to a weathered brown clipboard. A blue ballpoint pen is held in the right hand, mid-stroke. The form shows printed horizontal lines and three distinct sections separated by bold divider lines — no readable text, just the structural layout of a multi-part form. The carbon copies beneath show slight offset, revealing the pink and yellow layers.

The clipboard rests on the concrete lip of an open outdoor grease interceptor. The dark interior of the trap is slightly visible behind the clipboard. In the blurred background: the chrome bumper and hitch of a vacuum truck, and a restaurant's rear service entrance with a screen door.

Composition: tight close-up, 85mm equivalent macro. Hands and clipboard fill 80% of the frame. Very shallow depth of field — only the pen tip and form surface are tack sharp. Background is creamy bokeh.

Lighting: direct Florida afternoon sunlight from upper left, creating sharp shadows of the pen and fingers on the form surface. Warm golden light on the gloves and clipboard. The trap interior is in deep shadow.

Shot on Sony A7IV, 85mm f/1.4 lens. Direct sunlight. 8K resolution, hyperrealistic, documentary close-up photography. Color graded: warm golden tones, deep rich shadows, slight desaturation in the background bokeh.
```

### 8. Emergency Overflow Guide Header

| Field | Value |
|---|---|
| **Filename:** | `guide-emergency.webp` |
| **Dimensions:** | 1200 x 630 |
| **Max size:** | 60KB |
| **Alt text:** | "Emergency grease trap overflow response guide" |
| **Placement:** | /guides/emergency-grease-trap-overflow + OG image |

**Prompt:**
```
A white Kenworth vacuum truck with amber emergency LED light bar flashing on the cab roof, parked at an angle in a restaurant parking lot during blue hour twilight. Orange running lights along the truck chassis are glowing. A 4-inch black rubber hose extends from the rear of the truck across the wet parking lot toward the restaurant's side entrance. The asphalt is wet from a recent rain, reflecting the amber and orange truck lights in puddles.

The restaurant is a modern single-story Florida building with large windows glowing warm from interior lighting. A single exterior wall sconce creates a pool of warm light near the side entrance. Palm tree silhouettes frame the upper corners of the image against a deep blue-violet twilight sky with the last orange glow of sunset on the horizon.

Composition: wide cinematic shot, 24mm equivalent, low camera angle (knee height). Truck on the right, restaurant on the left. The hose creates a leading line from truck to building. 16:9 cinematic crop feel.

Lighting: blue hour ambient as fill, amber truck LEDs as accent, warm restaurant window glow as background practicals. Wet pavement reflections create visual interest across the bottom third.

Shot on Sony A7IV, 24mm f/2.0 lens. Blue hour twilight. 8K resolution, hyperrealistic, cinematic commercial photography. Color graded: teal-orange split tone, deep shadows, lifted midtones, slight film grain.
```

### 9. FOG Inspection Guide Header

| Field | Value |
|---|---|
| **Filename:** | `guide-inspection.webp` |
| **Dimensions:** | 1200 x 630 |
| **Max size:** | 60KB |
| **Alt text:** | "What to expect during a Florida FOG inspection" |
| **Placement:** | /guides/what-happens-fail-fog-inspection + OG image |

**Prompt:**
```
A county health inspector viewed from behind at waist-up, wearing a tucked-in light blue polo shirt with a lanyard badge on the back of their neck, standing over an open in-ground grease interceptor in a commercial kitchen. They are shining a bright LED flashlight beam down into the open trap with their right hand while holding an aluminum clipboard against their hip with their left hand. The flashlight beam illuminates the interior of the concrete trap showing the baffle wall and water level.

The kitchen floor is grey quarry tile with a floor drain visible nearby. Stainless steel prep table legs and a mop bucket are visible at the edges of the frame. The kitchen is well-lit with overhead fluorescent panels.

Composition: medium shot from behind, 35mm equivalent, camera at the inspector's shoulder height. The open trap is the focal point at center-bottom of frame. The flashlight beam creates a dramatic light cone into the dark trap interior.

Lighting: bright overhead fluorescents as ambient fill. The flashlight creates a strong directional beam into the trap, creating contrast between the lit trap interior and the shadow around it. Slight rim light on the inspector's shoulders from a window light on the right.

Shot on Sony A7IV, 35mm f/2.0 lens. Mixed ambient light. 8K resolution, hyperrealistic, photojournalistic editorial photography. Color graded: neutral-cool tones in the kitchen, warm flashlight beam, slight green cast from fluorescents.
```

### 10. Restaurant Checklist Guide Header

| Field | Value |
|---|---|
| **Filename:** | `guide-restaurant-checklist.webp` |
| **Dimensions:** | 1200 x 630 |
| **Max size:** | 60KB |
| **Alt text:** | "Restaurant opening grease trap compliance checklist for Florida" |
| **Placement:** | /guides/starting-restaurant-florida-grease-compliance + OG image |

**Prompt:**
```
A brand-new, never-used commercial restaurant kitchen. Every surface is pristine polished stainless steel — the six-burner gas range with a clean stainless backsplash, a commercial hood vent system with clean baffle filters, a three-compartment stainless sink, and an empty reach-in refrigerator with glass doors. The floor is new grey quarry tile with clean dark grout lines. 

In the foreground left, a fresh concrete grease interceptor access cover is set flush into the tile floor — the concrete is light grey and new, with a recessed stainless steel D-ring pull handle. The cover is perfectly flush with the surrounding tile.

No people in the scene. The kitchen is empty and waiting for opening day. Through a pass-through window in the back wall, you can see the empty dining room with stacked chairs on tables.

Composition: wide interior shot, 24mm equivalent, camera at hip height looking across the kitchen. The grease trap cover is in the lower left foreground, the kitchen extends into the background. Natural leading lines from the tile grout and countertop edges draw the eye through the space.

Lighting: bright natural Florida daylight flooding in through large windows in the dining room (visible through the pass-through), supplemented by the kitchen's new LED panel ceiling lights. Clean, bright, optimistic exposure. No shadows.

Shot on Sony A7IV, 24mm f/4 lens. Mixed natural and LED light. 8K resolution, hyperrealistic, architectural interior photography. Color graded: bright and clean, slight cool cast on the stainless steel, warm daylight in the background through the pass-through window.
```

### 11. About Page Image

| Field | Value |
|---|---|
| **Filename:** | `about-page.webp` |
| **Dimensions:** | 1200 x 630 |
| **Max size:** | 60KB |
| **Alt text:** | "About Grease Trap Florida - helping businesses find trusted service providers" |
| **Placement:** | /about page |

**Prompt:**
```
Aerial drone photography of a typical Florida commercial district shot from 200 feet altitude at a 45-degree downward angle. A four-lane boulevard runs through the center with a landscaped median of palm trees and tropical shrubs. On both sides: single-story strip malls with flat roofs, restaurants with colorful awnings (red, green, blue), a gas station, and a grocery store anchor. Parking lots with scattered cars. 

Tropical landscaping throughout — Royal Palms line the boulevard, bougainvillea hedges between properties, manicured St. Augustine grass on the medians. The overall impression is clean, modern, prosperous Florida commercial life.

Composition: 45-degree aerial, DJI Mavic-style drone shot. The boulevard runs diagonally from lower-left to upper-right. Buildings and parking lots fill both sides. Slight barrel distortion at the edges consistent with a drone wide-angle lens.

Lighting: direct overhead midday Florida sun. Short shadows directly beneath the palm trees and buildings. Bright, saturated colors. The parking lot asphalt is warm grey, the rooftops are light-colored (white and tan TPO membrane).

Shot on DJI Mavic 3, Hasselblad L2D-20c lens. Midday overhead sun. 8K resolution, hyperrealistic aerial photography. Color graded: saturated tropical colors, vivid blue sky, warm pavement tones, punchy contrast.
```

### 12. Advertise/Claim Page Image

| Field | Value |
|---|---|
| **Filename:** | `advertise-page.webp` |
| **Dimensions:** | 1200 x 630 |
| **Max size:** | 60KB |
| **Alt text:** | "Advertise your grease trap service on Grease Trap Florida" |
| **Placement:** | /advertise and /claim-listing pages |

**Prompt:**
```
A gleaming white Ford F-750 medium-duty vacuum service truck with a polished stainless steel cylindrical tank, parked perfectly centered in front of a successful upscale casual restaurant in a Florida shopping plaza. The truck is freshly detailed — chrome bumper reflecting the scene, tires dressed black, stainless tank catching the sunlight. No text, logos, or lettering visible on the truck anywhere.

The restaurant behind has a modern Florida aesthetic: clean stucco facade painted warm white, dark wood-look composite panel accents, a fabric awning, outdoor patio seating with wicker chairs and white umbrellas (no diners visible). Potted traveler palms and agave plants in large concrete planters flank the restaurant entrance. Two Coconut Palms tower above the roofline.

A service technician in clean navy coveralls walks toward the restaurant entrance, viewed from behind at a distance, carrying a clipboard. Small figure, bottom third of frame.

Composition: wide establishing shot, 35mm equivalent, eye-level. Truck centered, restaurant fills the background. Slight off-center — truck shifted left of center creating an asymmetric balance with the restaurant entrance on the right. Clean sidewalk in the foreground.

Lighting: late morning Florida sun from the right side. Specular highlights on the truck's stainless tank. Warm light on the stucco facade. Clean shadows on the sidewalk. Blue sky with two small white cumulus clouds.

Shot on Sony A7IV, 35mm f/5.6 lens. Bright Florida sunlight. 8K resolution, hyperrealistic, commercial fleet marketing photography. Color graded: punchy, saturated, aspirational. Warm highlights, clean whites, vivid blue sky.
```

### 13. Blog Kitchen Image 1

| Field | Value |
|---|---|
| **Filename:** | `blog-kitchen-1.webp` |
| **Dimensions:** | 1200 x 630 |
| **Max size:** | 60KB |
| **Alt text:** | Set per blog post |
| **Placement:** | Blog post rotation |

**Prompt:**
```
Interior of a busy commercial restaurant kitchen during active dinner service. Stainless steel everywhere — the line, the hood, the prep tables. A large commercial wok range has flames visible beneath a round-bottom wok. Steam rises from multiple pans on the flat-top grill. A stockpot on the back burner has a gentle boil with steam curling upward.

No people visible in the frame — just the equipment, the fire, the steam, and the food in progress. Three plates are being plated on the pass (blurred, no detail needed). The floor is dark anti-fatigue rubber matting. The three-compartment sink in the background has running water.

Composition: wide interior, 24mm equivalent, camera at counter height looking across the active line. Steam and heat haze create atmosphere in the upper portion of the frame. Shallow depth — the foreground burner is sharp, the background sink is soft.

Lighting: overhead kitchen fluorescents as fill, open flame from the wok range as warm accent, stainless surfaces reflect and bounce light creating a metallic glow. Warm color temperature from the flames contrasts with cool fluorescent ambient.

Shot on Sony A7IV, 24mm f/2.0 lens. Available kitchen light. 8K resolution, hyperrealistic, restaurant kitchen documentary photography. Color graded: warm orange from flames, cool blue-green in shadows, high contrast, slight grain.
```

### 14. Blog Kitchen Image 2

| Field | Value |
|---|---|
| **Filename:** | `blog-kitchen-2.webp` |
| **Dimensions:** | 1200 x 630 |
| **Max size:** | 60KB |
| **Alt text:** | Set per blog post |
| **Placement:** | Blog post rotation |

**Prompt:**
```
Extreme close-up of a stainless steel grease trap strainer basket being lifted out of a small under-sink grease trap unit. Gloved hands (black nitrile) grip the strainer handles. The strainer mesh is partially clogged with solidified yellowish-white grease and food particles — realistic but not disgusting. Clear water drips from the bottom of the strainer back into the trap below.

The under-sink area is visible: white PVC pipes, the stainless steel trap body, and the grey rubber connection gasket. Clean grey tile wall behind.

Composition: tight macro close-up, 100mm equivalent. The strainer basket fills the center of the frame. Hands enter from bottom corners. Extreme shallow depth of field — only the strainer mesh is perfectly sharp. The dripping water droplets are frozen in mid-air.

Lighting: single bright LED work light from the upper left creating strong directional light on the strainer mesh and grease. The light catches the water droplets, creating small bright specular points. Deep shadow under the sink behind the trap.

Shot on Sony A7IV, 100mm f/2.8 macro lens. Single directional LED work light. 8K resolution, hyperrealistic, industrial macro photography. Color graded: high contrast, cool neutral tones, warm yellow in the grease, bright specular highlights on water.
```

### 15. Blog Kitchen Image 3

| Field | Value |
|---|---|
| **Filename:** | `blog-kitchen-3.webp` |
| **Dimensions:** | 1200 x 630 |
| **Max size:** | 60KB |
| **Alt text:** | Set per blog post |
| **Placement:** | Blog post rotation |

**Prompt:**
```
Exterior of a charming Florida restaurant row at golden hour sunset. Three restaurant storefronts side by side in a Mediterranean Revival style strip — arched doorways, terracotta barrel tile awnings, cream-colored stucco walls. Each restaurant has different colored canvas shade sails over their outdoor seating areas (burgundy, forest green, navy blue). Wrought iron cafe tables and chairs are arranged on the stamped concrete sidewalk patio.

No diners present — the scene is set but empty, as if photographed just before the dinner rush. String lights (Edison bulbs) are strung between the buildings, not yet glowing. Three tall Medjool Date Palms are planted in the median strip of the adjacent street. Mature bougainvillea cascades over a low stucco wall on the right edge of the frame.

Composition: street-level shot, 35mm equivalent, looking along the row of restaurants at a slight angle. Leading lines from the sidewalk edge and string lights draw the eye through the scene. Camera at standing eye height.

Lighting: golden hour sunlight from the left side, casting long warm shadows across the stamped concrete. The stucco walls glow warm peach-gold. The sky is a gradient from warm amber at the horizon to soft blue overhead. The date palm fronds are backlit with golden rim light.

Shot on Sony A7IV, 35mm f/2.8 lens. Golden hour natural light. 8K resolution, hyperrealistic, architectural and lifestyle photography. Color graded: rich golden highlights, deep warm shadows, saturated sky gradient, slight film-like halation around the backlit palm fronds.
```

---

## Image Optimization Checklist

After generating all images:

- [ ] All generated using Nano Banana Pro model
- [ ] Convert all to WebP format (use quality 80-85 for best size/quality balance)
- [ ] Verify hero image under 120KB
- [ ] Verify OG image under 80KB
- [ ] Verify all guide/blog images under 60KB
- [ ] Place ALL images in `/public/images/` — flat directory, absolutely NO subdirectories
- [ ] Verify filenames match this spec exactly (lowercase, hyphens, .webp extension)
- [ ] Visually inspect each image: no AI artifacts, no faces, no readable text
- [ ] Add to Next.js pages with correct `width`, `height`, `sizes`, and `alt`
- [ ] Set hero image `priority={true}`
- [ ] Verify OG image path in root layout metadata matches actual file location

---

## Lucide React Icons Used Throughout

Import from `lucide-react`. No custom SVGs needed.

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
