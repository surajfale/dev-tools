App icons — Mission Control mark (graphite, amber slash, orbit ring + body)

Edit the SVG sources, then regenerate every raster with:  pnpm generate:icons

Sources (edit these):
  ../favicon.svg          browser tab; simplified for 16–32px (no ring — it blurs)
  icon.svg                "any" app icon; full square with amber corner brackets
  icon-maskable.svg       Android adaptive icon; everything inside the 80% safe
                          zone (radius 205 of 512), no corner brackets
  icon-monochrome.svg     Android themed icon; only alpha is used

Generated (do not hand-edit):
  ../favicon.ico (16/32/48, PNG-in-ICO)   ../apple-touch-icon.png (180, opaque)
  icon-192.png  icon-512.png  icon-maskable-192.png  icon-maskable-512.png
  icon-monochrome.png

Check maskable cropping at https://maskable.app/editor before shipping changes.
