# OpenResearch — website

Minimal Next.js landing site for **OpenResearch**, the decentralized,
agent-driven research protocol where the benchmark is the oracle.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (`@theme` design tokens, no `tailwind.config`)
- `next/font` (Inter + JetBrains Mono)
- Brand assets in `public/logos/`

## Brand tokens

Defined as CSS variables under `@theme` in `app/globals.css`:

| Token | Hex | Use |
|---|---|---|
| `--color-bg` | `#0B0F1A` | Deep Indigo · backgrounds |
| `--color-cyan` | `#22D3EE` | Electric Cyan · highlights |
| `--color-blue` | `#3B82F6` | Soft Blue · structure |
| `--color-green` | `#22C55E` | Success Green · top node |

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Structure

```
app/
  layout.tsx           # fonts, metadata, theme bootstrap
  page.tsx             # composes the landing sections
  globals.css          # Tailwind v4 + brand tokens
  components/
    Nav.tsx
    Hero.tsx
    Insight.tsx
    HowItWorks.tsx
    Domains.tsx
    Architecture.tsx
    TokenFlow.tsx
    GetStarted.tsx
    Footer.tsx
  ore/                 # /ore — landing page for ORE, the macOS agent workspace
    page.tsx           # standalone: own header/footer, not the protocol nav
    OreHeader.tsx      # floating glass capsule, contracts once scrolled
    OreChrome.tsx      # ORE footer
    OreInstall.tsx     # Homebrew / curl install tabs
    OreDemoVideo.tsx   # hero demo video with a pause control
    OreAssistant.tsx   # the assistant section (claims checked against v0.7.2)
    OreNative.tsx      # native-Swift stat band (counts checked against v0.7.2)
    OreActivity.tsx    # GitHub-style commit heatmap
    activity.json      # dated snapshot of commits per day (see its `source`)
    ore.css            # animated wallpaper + liquid-glass surfaces
public/logos/
  icon.png
  watermark-vertical.png
public/ore/
  icon.svg             # ORE app icon for the page: the ore repo's AppIcon.svg,
                       # comments stripped and viewBox cropped to the tile
  icon.png             # raster of the same icon, used by the OG image
  demo.mp4             # hero product demo (trimmed screen recording, no audio)
  demo-poster.jpg      # its first frame, shown while the video loads
```

`/ore/install.sh` is a rewrite (see `next.config.ts`) to the installer in
`OpenResearchh/ore`, never a copy, so the published `curl … | sh` cannot drift
from the reviewed script. It resolves only while that repository is public.

Sections map directly to the brand guide and `detail.md`: hero / insight /
how-it-works / domains / architecture / token flow / get started / footer.
