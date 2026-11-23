# Periodic Roll

An idle game: roll six tiles of elements and numbers, chase rare mutations (Planetary, Star, Impact ... The One Before All, Determination and the secret ???), upgrade, and rebirth.

## Files

```
index.html     the page (open this one)
css/style.css  all styling and themes
js/game.js     all game code: odds, mutations, cutscenes, sound, leaderboard
README.md      this file
```

No build step and no installs. It is plain HTML, CSS and JavaScript.

## Run it on your computer

Double-click `index.html`. It opens in your browser.

## Publish it free with GitHub Pages

1. Make a free account at https://github.com and click **New repository**. Name it `periodic-roll`, keep it **Public**, click **Create repository**.
2. On the new repository page click **uploading an existing file**.
3. Unzip the download first. Open the unzipped folder and drag **everything inside it** (the `index.html` file, the `css` folder, the `js` folder and `README.md`) into the GitHub upload box. Do not drag the zip itself.
4. Click **Commit changes**.
5. Go to **Settings > Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**, pick the **main** branch and the **/ (root)** folder, and click **Save**.
6. Wait about a minute and refresh. GitHub shows your link: `https://YOUR-USERNAME.github.io/periodic-roll/`.

## Notes

- Progress saves in each player's own browser (localStorage).
- The font loads from Google Fonts, so players need an internet connection for the exact look.
- The leaderboard code talks to Claude's built-in database, which only exists inside the Claude Artifact. On your own website the game still works and the leaderboard shows the player's own records on their device. A shared leaderboard across players needs a small online database (for example Firebase or Supabase); the leaderboard code is in `js/game.js`, in the functions `initBoard`, `renderBoard` and `renderLocalBoard`.
