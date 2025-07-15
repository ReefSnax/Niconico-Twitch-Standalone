// Get URL parameters
const params = new URLSearchParams(window.location.search);
const channel = params.get("channel");
const token = params.get("token");
const username = params.get("username");

if (!channel || !token || !username) {
  alert("Missing required URL parameters: channel, token, username");
  throw new Error("Missing parameters");
}

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

function displayMessage(text) {
  const container = document.getElementById("chat-container");
  const el = document.createElement("div");
  el.className = "message";
  el.style.top = `${Math.random() * 80}%`;
  el.textContent = text;
  container.appendChild(el);
  setTimeout(() => el.remove(), 10000);
}