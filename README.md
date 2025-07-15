# NicoNico Twitch Chat Overlay (Standalone)

A Twitch chat overlay styled like [NicoNico Douga](https://www.nicovideo.jp/) — no StreamElements or StreamLabs required!

Inspired by [Tekigg](https://github.com/tekigg/niconico-twitch) and [ThatKoffe](https://github.com/ThatKoffe/niconico-twitch)'s respective StreamLabs and StreamElements plugins.

## 🎮 Features

- Connects directly to Twitch IRC
- Nico-style scrolling messages
- OBS/browser source friendly
- Refresh token support
- No server or backend required
- Custom character limits
- Twitch Global + Channel Emotes
- BTTV/FFZ Emotes

## 🚀 How to Use

1. Clone or download the repo.
2. Open `config.js` and fill in your Twitch info.
3. Load `index.html` locally (as a `file:///` path) in OBS.

#### 🔐 Getting a `chat:read` Refresh Token

You can use [TwitchTokenGenerator.com](https://twitchtokengenerator.com) to get a `chat:read` refresh token using **your own Twitch Developer credentials**:

#### Step 1: Create a Twitch App
1. Go to [Twitch Developer Console](https://dev.twitch.tv/console/apps)
2. Click **“Register Your Application”**
3. Set the **redirect URL** to:
   ```
   https://twitchtokengenerator.com
   ```
4. Set category to **Website Integration**
5. Once created, copy:
   - **Client ID**
   - **Client Secret**

#### Step 2: Generate a Token with Your Own Credentials
1. Visit [TwitchTokenGenerator.com](https://twitchtokengenerator.com)
2. Click **"Custom Scope Token"**
3. Scroll down and click **"Use Custom Client ID/Secret"**
4. Paste your **Client ID** and **Client Secret**
5. Enable the scope `chat:read` (and optionally `chat:edit`)
6. Click **“Generate Token!”**
7. After logging in, you’ll be given:
   - `access_token` (temporary, used for chat)
   - `refresh_token` (store this in `config.js`)
   - Confirmation of which scopes are active

### 📁 Config File (`config.js`)

Replace values with your own in `config.js`:

```js
window.TWITCH_CONFIG = {
  clientId: "your_client_id_here",
  clientSecret: "your_client_secret_here",
  refreshToken: "your_refresh_token_here",
  channel: "your_channel_name",
  username: "your_twitch_username",
  fontSize: "30px", // Edit to a value that works for you. For 1080p, 30px or higher is best!
  hideUsername: true // set to false if you want to show usernames
  maxChars: 55,  // Maximum characters per message
};
```

## 🖥️ Add to OBS

- Add a **Browser Source**
- Choose the local `index.html` via file path
- Set dimensions (e.g., 1920x1080)
- Enable **"Shutdown source when not visible"** and **"Refresh browser when scene becomes active"**

## 📝 Future Plans
- Support for more emote platforms
- User-styled text (custom colors + font effects)
- Hide commands
- Hide users
- Auto-profanity filter

## 🛡️ Security Note

Never share your refresh token or client secret publicly.

## 📜 License

MIT
