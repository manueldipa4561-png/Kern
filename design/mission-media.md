# Mission media (sound and clips)

Real sound for Music and real clips for Video, made with AI on 2026-10-09 in ElevenLabs (flow "KERN mission media"). Everything is fictional: no real people, shops, songs or logos. Files live in `public/media/`; the service worker leaves them to the network (byte ranges), so they need a connection.

| File | Mission | What it is | Made with |
|---|---|---|---|
| `noa-mango.m4a` | Music 1 (Noa's playlist) | Mango Static · bright, bouncy indie pop, 118 bpm | ElevenLabs Music v2.5, instrumental |
| `noa-trombone.m4a` | Music 1 | Sad Trombone Tuesday · muted trombone over minor piano, 62 bpm | same |
| `noa-sunrise.m4a` | Music 1 | Pocket Sunrise · fingerpicked acoustic guitar, 80 bpm (gain 0.5: it is a quiet song) | same |
| `noa-confetti.m4a` | Music 1 | Confetti Cannon · festival pop anthem, 128 bpm (the song to cut) | same |
| `noa-tile.m4a` | Music 1 | Tile Floor Groove · laid-back nu-disco, 112 bpm | same |
| `noa-bus.m4a` | Music 1 | Last Bus Home · dreamy lo-fi, 72 bpm (gain 0.5) | same |
| `gufo-beat.m4a` | Music 2 (Forno Gufo) | the house groove that comes in at the drop, 100 bpm, 10 s | same |
| `gufo-bed.m4a` | Music 2 | dawn street, distant birds, oven hum, 10 s | ElevenLabs Sound Effects v2 |
| `gufo-shutter.m4a` | Music 2 | roller shutter going up, played at 3 s | same |
| `gufo-dough.m4a` | Music 2 | dough slapped on a counter, played at 5 s | same |
| `tosta.mp4` | Video 1 (Tosta) | 15 s, 6 shots: walk 0-3, menu 3-7, press 7-9, cheese 9-11, bite 11-13, walk off 13-15 | Kling 3.0 Pro via ElevenLabs, 9:16, native sound |
| `skate.mp4` | Video 5 (Rotella) | 10 s, 4 shots: board 0-2, foot and push 2-5, wheels close-up 5-8, empty street 8-10 | same |

The mission text gives the seconds as they are in the clips (missions.ts, play.ts, play-video.ts, helps.ts, easy.ts). If a clip is remade, check its shots again and update those seconds.

## How they were made

- Songs: generated at 30 s, because 8 s pieces fade out after about 5 s. The steadiest loud 8 s window (10 s for the beat) was cut with 0.25 s fades, then encoded to AAC 96 kbps with `afconvert`.
- Clips: 1080x1920 from the model, exported to 540x960 H.264 (about 1.4 Mbit/s) with AVFoundation (`AVAssetExportPreset960x540` plus a size cap).
- Cost: about $5.50 in ElevenLabs credits for everything, of which the two clips are about $4.60.

## Prompts (shortened)

- Songs: "<mood> instrumental. <instruments>, <bpm>. Starts at full energy from the first second, no intro, no vocals." The anthem and the beat add "stays at full power the whole time, no breakdown, no fade".
- Tosta: "A small cream-coloured toasted-sandwich van in a sunny Italian city square... a young man with curly dark hair in a green jacket. Shot 1 (0-3s) walks toward the van... Shot 4 (9-12s) extreme close-up, melted cheese stretches very long..." Negative: text, captions, logos, watermark, morphing faces.
- Skate: "A quiet sunny city street... a skateboard with a natural wood deck and white wheels... Shot 1 board still, Shot 2 one foot on and one hard push, Shot 3 macro close-up of the wheels, Shot 4 rolls away." Negative: text, logos, tricks, falling.

Before a real launch, check the ElevenLabs plan terms for commercial use of generated media.
