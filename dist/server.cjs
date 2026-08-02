var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_vite = require("vite");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_meta = {};
import_dotenv.default.config();
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
function getRedirectUri(req) {
  if (process.env.DISCORD_REDIRECT_URI) {
    return process.env.DISCORD_REDIRECT_URI;
  }
  const host = req.get("host") || "";
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  return `${protocol}://${host}/auth/discord/callback`;
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get("/api/auth/discord/url", (req, res) => {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const redirectUri = getRedirectUri(req);
    if (!clientId) {
      return res.json({
        configured: false,
        message: "DISCORD_CLIENT_ID environment variable is not set."
      });
    }
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "identify guilds"
    });
    const url = `https://discord.com/oauth2/authorize?${params.toString()}`;
    res.json({ configured: true, url, redirectUri });
  });
  app.get(["/auth/discord/callback", "/auth/discord/callback/"], async (req, res) => {
    const { code, guild_id } = req.query;
    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const targetGuildId = process.env.DISCORD_GUILD_ID || guild_id || "123456789012345678";
    if (!code) {
      return res.status(400).send("Authorization code missing.");
    }
    try {
      const redirectUri = getRedirectUri(req);
      const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          client_id: clientId || "",
          client_secret: clientSecret || "",
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri
        })
      });
      if (!tokenRes.ok) {
        const errorText = await tokenRes.text();
        console.error("Discord token error:", errorText);
        return res.status(400).send(`Discord Token Exchange Failed: ${errorText}`);
      }
      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;
      const userRes = await fetch("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const userData = await userRes.json();
      const guildsRes = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const userGuilds = await guildsRes.json();
      const inRequiredGuild = Array.isArray(userGuilds) && userGuilds.some((g) => g.id === targetGuildId);
      const authResult = {
        type: "DISCORD_AUTH_SUCCESS",
        username: userData.username ? `${userData.username}#${userData.discriminator || "0"}` : "Discord\u30E6\u30FC\u30B6\u30FC",
        userId: userData.id,
        avatar: userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : null,
        userGuildsCount: Array.isArray(userGuilds) ? userGuilds.length : 0,
        inRequiredGuild,
        targetGuildId
      };
      res.send(`
        <!Server HTML>
        <html>
          <head>
            <title>Discord Auth Complete</title>
            <style>
              body { font-family: sans-serif; background: #08080c; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .card { background: #0d0d14; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 24px; text-align: center; }
            </style>
          </head>
          <body>
            <div class="card">
              <h2>Discord \u9023\u643A\u5B8C\u4E86</h2>
              <p>\u753B\u9762\u3092\u9589\u3058\u3066\u5143\u306E\u30DA\u30FC\u30B8\u306B\u623B\u308A\u307E\u3059...</p>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage(${JSON.stringify(authResult)}, '*');
                setTimeout(() => window.close(), 1200);
              } else {
                window.location.href = '/';
              }
            </script>
          </body>
        </html>
      `);
    } catch (err) {
      console.error("Discord auth handler exception:", err);
      res.status(500).send(`OAuth Error: ${err.message}`);
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
