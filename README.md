# NicoNico Twitch Chat Overlay (Standalone)

A Twitch chat overlay styled like [NicoNico Douga](https://www.nicovideo.jp/) — no StreamElements or StreamLabs required!

Inspired by [Tekigg](https://github.com/tekigg/niconico-twitch) and [ThatKoffe](https://github.com/ThatKoffe/niconico-twitch)'s respective StreamLabs and StreamElements plugins.

## 🎮 Features

- Connects directly to Twitch IRC
- Nico-style scrolling messages
- OBS/browser source friendly
- Refresh token support for long sessions
- No server or backend required

## 🚀 How to Use

1. Clone or download the repo.
2. Open `config.js` and fill in your Twitch info.
3. Load `index.html` locally (as a `file:///` path) in OBS.

### 🔐 Getting a Refresh Token

You can use [TwitchTokenGenerator.com](https://twitchtokengenerator.com) to get a refresh token:

1. Visit the site and choose **“Custom Scope Token”**
2. Enable the `chat:read` scope (and optionally `chat:edit`)
3. After logging in, copy both:
   - Your **Refresh Token**
   - Your **Client ID**
4. Create your own app in [Twitch Dev Console](https://dev.twitch.tv/console/apps) to get a **Client Secret**

### 📁 Config File (`config.js`)

Replace values with your own in `config.js`:

```js
window.TWITCH_CONFIG = {
  clientId: "your_client_id_here",
  clientSecret: "your_client_secret_here",
  refreshToken: "your_refresh_token_here",
  channel: "your_channel_name",
  username: "your_twitch_username"
};
```

## 🖥️ Add to OBS

- Add a **Browser Source**
- Choose the local `index.html` via file path
- Set dimensions (e.g., 1920x1080)
- Enable **"Shutdown source when not visible"** and **"Refresh browser when scene becomes active"**

## 🧪 Local Development

Preview locally using:

```bash
npx serve
# OR
python -m http.server
```

## 🛡️ Security Note

Never share your refresh token or client secret publicly.
Use a bot account instead of your main Twitch account when possible.

## 📜 License

MIT
