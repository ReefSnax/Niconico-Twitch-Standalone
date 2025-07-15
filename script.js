
(function () {

function truncateHTML(htmlString, maxChars) {
  const container = document.createElement("div");
  container.innerHTML = htmlString;

  let count = 0;
  const result = document.createElement("div");

  function walk(node, outputParent) {
    for (let child of node.childNodes) {
      if (count >= maxChars) break;

      if (child.nodeType === Node.TEXT_NODE) {
        const remaining = maxChars - count;
        const text = child.textContent.substring(0, remaining);
        count += text.length;
        outputParent.appendChild(document.createTextNode(text));
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const clone = child.cloneNode(false);
        outputParent.appendChild(clone);
        walk(child, clone);
      }
    }
  }

  walk(container, result);
  return result.innerHTML + (count >= maxChars ? "…" : "");
}

  const config = window.TWITCH_CONFIG;

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
    return data.access_token || null;
  }

  async function getTwitchUserId(channel, accessToken, clientId) {
    const res = await fetch(`https://api.twitch.tv/helix/users?login=${channel}`, {
      headers: {
        "Client-ID": clientId,
        "Authorization": `Bearer ${accessToken}`
      }
    });
    const data = await res.json();
    return data?.data?.[0]?.id || null;
  }

  async function getJSON(url, headers = {}) {
    const res = await fetch(url, { headers });
    return res.ok ? res.json() : null;
  }

  async function fetchEmotes(channel, clientId, accessToken) {
    const emotes = {};
    const userId = await getTwitchUserId(channel, accessToken, clientId);
    if (!userId) return emotes;

    const twitchEmotes = await getJSON(`https://api.twitch.tv/helix/chat/emotes?broadcaster_id=${userId}`, {
      Authorization: `Bearer ${accessToken}`,
      'Client-Id': clientId
    });
    twitchEmotes?.data?.forEach(e => {
      emotes[e.name] = e.images?.url_2x || '';
    });

    const bttvGlobal = await getJSON("https://api.betterttv.net/3/cached/emotes/global");
    bttvGlobal?.forEach(e => {
      emotes[e.code] = `https://cdn.betterttv.net/emote/${e.id}/2x`;
    });

    const bttv = await getJSON(`https://api.betterttv.net/3/cached/users/twitch/${userId}`);
    [...(bttv?.channelEmotes || []), ...(bttv?.sharedEmotes || [])].forEach(e => {
      emotes[e.code] = `https://cdn.betterttv.net/emote/${e.id}/2x`;
    });

    const ffz = await getJSON(`https://api.frankerfacez.com/v1/room/${channel.toLowerCase()}`);
    if (ffz?.sets) {
      Object.values(ffz.sets).forEach(set => {
        set?.emoticons?.forEach(e => {
          emotes[e.name] = e.urls['2'] ? (e.urls['2'].startsWith('http') ? e.urls['2'] : `https:${e.urls['2']}`) : '';
        });
      });
    }

    return emotes;
  }

  function parseTwitchEmotes(message, emoteTag) {
    if (!emoteTag || emoteTag === "") return escapeHTML(message);

    const parts = [];
    const replacements = [];

    emoteTag.split("/").forEach(entry => {
      const [id, positions] = entry.split(":");
      positions.split(",").forEach(pos => {
        const [start, end] = pos.split("-").map(Number);
        replacements.push({ start, end, id });
      });
    });

    replacements.sort((a, b) => a.start - b.start);

    let lastIndex = 0;
    for (const { start, end, id } of replacements) {
      if (start > lastIndex) {
        parts.push(escapeHTML(message.substring(lastIndex, start)));
      }
      parts.push(`<img class="emote" src="https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/2.0" />`);
      lastIndex = end + 1;
    }

    if (lastIndex < message.length) {
      parts.push(escapeHTML(message.substring(lastIndex)));
    }

    return parts.join("");
  }

  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, m => ({
      '&': "&amp;", '<': "&lt;", '>': "&gt;", '"': "&quot;", "'": "&#39;"
    })[m]);
  }

  function parseThirdPartyEmotes(html, emotes) {
    return html.split(/(>[^<]*<|\s+)/).map(part => {
      if (part.startsWith(">") && part.endsWith("<")) return part;

      const trimmed = part.trim();
      const emoteURL = emotes[trimmed] || emotes[trimmed.toLowerCase()];
      if (emoteURL) {
        return part.replace(trimmed, `<img class="emote" src="${emoteURL}" />`);
      }

      return part;
    }).join("");
  }

function displayMessage(fullHTML) {
  const container = document.getElementById("chat-container");
  const el = document.createElement("div");
  el.className = "message";
    el.style.fontSize = config.fontSize || '24px';
  el.innerHTML = fullHTML;
    el.style.top = `${Math.random() * 80}%`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 10000);
  }

  async function init() {
    const accessToken = await getAccessToken(config);
    if (!accessToken) {
      alert("Failed to refresh access token. Check your config.js values.");
      return;
    }

    const emoteMap = await fetchEmotes(config.channel, config.clientId, accessToken);
    const socket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

    socket.onopen = () => {
      socket.send("CAP REQ :twitch.tv/tags");
      socket.send(`PASS oauth:${accessToken}`);
      socket.send(`NICK ${config.username}`);
      socket.send(`JOIN #${config.channel}`);
    };

    socket.onmessage = (event) => {
      const raw = event.data;
      if (raw.startsWith("PING")) {
        socket.send("PONG :tmi.twitch.tv");
        return;
      }

      const rawParts = raw.split(" :", 2);
      const meta = Object.fromEntries(
        (rawParts[0].startsWith("@") ? rawParts[0].slice(1).split(" ")[0] : "")
          .split(";")
          .map(kv => kv.split("="))
      );

      const match = raw.match(/:(\w+)![^ ]+ PRIVMSG #[^ ]+ :(.+)/);
      if (match) {
        let [_, user, msg] = match;
                        let html = parseTwitchEmotes(msg, meta["emotes"]);
        html = parseThirdPartyEmotes(html, emoteMap);
      if (config.maxChars) {
        html = truncateHTML(html, config.maxChars);
      }

        const usernameHTML = config.hideUsername ? "" : `<span class="username" style="color:${meta["color"] || '#fff'}">${user}:</span> `;
        displayMessage(usernameHTML + html);
      }
    };
  }

  init();
})();
