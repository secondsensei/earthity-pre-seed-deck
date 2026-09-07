# Earthity Pre-Seed Deck

## Generate PDF

```bash
node _deck-export.js pdf "Earthity Technologies Pre-Seed Deck"
```

Outputs `Earthity Technologies Pre-Seed Deck.pdf` in the project root.

Uses `puppeteer-core` with the system Chrome at `C:\Program Files\Google\Chrome\Application\chrome.exe`. Renders `index.html` at 1280×720, exports at 13.33×7.5 inches with background graphics.

To also export per-slide screenshots:

```bash
node _deck-export.js both "Earthity Technologies Pre-Seed Deck"
```

Screenshots only, limited to the slides you need (1-based; ranges allowed).
Prefer this over `both` — do not render all 8 PNGs to check one slide:

```bash
node _deck-export.js screenshots "check" 4      # slide 4 only
node _deck-export.js screenshots "check" 2,4-6  # slides 2, 4, 5, 6
```

Delete the temporary PNGs when done.
