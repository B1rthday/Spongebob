# A Little World Made for You 🐾

A small, static, interactive birthday website. Plain HTML, CSS, and JavaScript. No backend, no tracking, no external services, no build step.

## Files

```
birthday-site/
├── index.html          the seven scenes
├── styles.css          palette, layout, animations, responsive rules
├── script.js           scene flow, animal garden, reveals, video, reset
├── README.md
└── assets/
    ├── images/
    │   └── norway-goat.jpg     OPTIONAL: the Norway goat photo
    └── video/
        └── birthday-video.mp4  REQUIRED for the final scene
```

## Run it locally

Double-click `index.html`, or serve the folder (recommended, so the video path and image loading behave like they will online):

```
cd birthday-site
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Add your assets

**Birthday video.** Put your finished video at `assets/video/birthday-video.mp4`. Use an MP4 (H.264 video, AAC audio) for the widest phone compatibility. If the file is missing, scene F shows a placeholder that names the expected path, and a "Skip to the final message" button keeps the experience moving. Once the file is in place, refresh the page.

**Norway goat photo (optional).** Put the photo at `assets/images/norway-goat.jpg`. If it's there, it appears under the animal garden as "The legendary Norway goat incident." If it isn't, that section stays hidden. Nothing breaks.

## Test checklist

Before you send it, open it on a phone (or use browser dev tools device mode at 320, 360, 390, and 430 px wide) and check:

- Scene A: "Open your little surprise" plays the paw trail and moves to the garden.
- Scene B: each of the five animals updates the stage and message; tapping one bounces it and floats a few paws.
- Scene C: "One more thing…" reveals the kind-to-yourself message.
- Scene D: the envelope opens and closes; "Continue the adventure" works.
- Scene E: each wish reveals on tap; "Unlock your final surprise" works.
- Scene F: the video plays with controls (no autoplay). When it ends, the closing scene appears after a short pause, or tap "Continue" to go straight there.
- Scene G: "Experience it again" returns to the start with everything reset, and the video is back at the beginning.

## Publish for free

Any static host works. Three easy options:

1. **Netlify Drop.** Go to app.netlify.com/drop and drag the whole `birthday-site` folder onto the page. You get a link in under a minute.
2. **GitHub Pages.** Create a repository, upload the files, then enable Pages under Settings → Pages, choosing the main branch.
3. **Cloudflare Pages.** Connect a repository, or upload with the direct-upload option.

Video note: free hosts generally accept files of this size, but very large videos slow the first load. If your video is over about 50 MB, compress it first (for example, with HandBrake at 720p or 1080p) for smoother playback on mobile data.

## Notes on how it's built

- Scene changes use a single delegated click listener, so buttons don't stack duplicate handlers and rapid taps are ignored while a transition runs.
- Reset cancels pending timers, pauses and rewinds the video, and clears every reveal.
- Motion respects the device's reduced-motion setting. Paw trails and bounces are skipped in that mode.
- Layouts use relative sizing and safe-area padding for phones with notches.
- The animal drawings are inline SVG, so they're crisp at any size and need no image files.
- No personal data is collected or stored, and no music plays.
