async function getAccessToken(config) {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: config.refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret
  });

  const res = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    body
  });

  const data = await res.json();
  return data.access_token ? `oauth:${data.access_token}` : null;
}

function connectToTwitchChat(token, username, channel) {
  const socket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

  socket.onopen = () => {
    socket.send(`PASS ${token}`);
    socket.send(`NICK ${username}`);
    socket.send(`JOIN #${channel}`);
  };

  socket.onmessage = (event) => {
    const msg = event.data;
    if (msg.startsWith("PING")) {
      socket.send("PONG :tmi.twitch.tv");
      return;
    }

    const match = msg.match(/:(\w+)!\w+@\w+\.tmi\.twitch\.tv PRIVMSG #\w+ :(.+)/);
    if (match) {
      const [_, user, message] = match;
      displayMessage(`${user}: ${message}`);
    }
  };
}

function displayMessage(text) {
  const container = document.getElementById("chat-container");
  const el = document.createElement("div");
  el.className = "message";
  el.style.top = `${Math.random() * 80}%`;
  el.textContent = text;
  container.appendChild(el);
  setTimeout(() => el.remove(), 10000);
}

// Initialize
(async () => {
  const config = window.TWITCH_CONFIG;
  const token = await getAccessToken(config);
  if (!token) {
    alert("Failed to refresh access token. Check your config.js values.");
    return;
  }
  connectToTwitchChat(token, config.username, config.channel);
})();