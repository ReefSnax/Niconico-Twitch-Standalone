# NicoNico Twitch Chat Overlay (Standalone)

A Twitch chat overlay styled like NicoNico Douga — no StreamElements or StreamLabs required!

## 🎮 Features

- Connects directly to Twitch IRC
- Nico-style scrolling messages
- OBS/browser source friendly
- No server or backend required

## 🚀 How to Use

1. Clone or download the repo.
2. Host the `index.html` locally or on any static host (Netlify, GitHub Pages, etc.).
3. Get a Twitch OAuth token (with chat:read scope).

### 🔐 Getting a `chat:read` OAuth Token

To overlay Twitch chat, you need an OAuth token with at least the `chat:read` scope. One quick way to get this is using [TwitchTokenGenerator.com](https://twitchtokengenerator.com):

1. Visit the site and choose **“Custom Scope Token”**
2. In the scope list, enable `chat:read` (and optionally `chat:edit`)
3. Click **“Generate Token!”** and log into your Twitch account
4. Copy the generated token (starts with `oauth:`)

### 🧩 Example Overlay URL

```
https://yourhost.com/index.html?channel=your_channel&username=your_username&token=oauth:YOUR_TOKEN_HERE
```

## 🖥️ Add to OBS

- Add a new **Browser Source**
- Set the URL with your `channel`, `username`, and `token` params
- Set dimensions (e.g., 1920x1080)
- Enable **"Shutdown source when not visible"** for security

## 🧪 Local Development

You can preview locally with any static server:

```bash
npx serve
# OR
python -m http.server
```

## 🛡️ Security Note

Use a secondary bot account or rotate tokens often. Future versions may support [Anonymous Twitch IRC](https://dev.twitch.tv/docs/irc) for read-only chat.

## 📜 License

MIT