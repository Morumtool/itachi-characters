import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getRedirectUri(req: express.Request): string {
  if (process.env.DISCORD_REDIRECT_URI) {
    return process.env.DISCORD_REDIRECT_URI;
  }
  const host = req.get('host') || '';
  const protocol = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
  return `${protocol}://${host}/auth/discord/callback`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Discord OAuth configuration endpoint
  app.get('/api/auth/discord/url', (req, res) => {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const redirectUri = getRedirectUri(req);
    
    if (!clientId) {
      return res.json({
        configured: false,
        message: 'DISCORD_CLIENT_ID environment variable is not set.'
      });
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'identify guilds',
    });

    const url = `https://discord.com/oauth2/authorize?${params.toString()}`;
    res.json({ configured: true, url, redirectUri });
  });

  // Discord OAuth Callback route
  app.get(['/auth/discord/callback', '/auth/discord/callback/'], async (req, res) => {
    const { code, guild_id } = req.query;
    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const targetGuildId = process.env.DISCORD_GUILD_ID || (guild_id as string) || '123456789012345678';

    if (!code) {
      return res.status(400).send('Authorization code missing.');
    }

    try {
      const redirectUri = getRedirectUri(req);
      
      // Token exchange
      const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId || '',
          client_secret: clientSecret || '',
          grant_type: 'authorization_code',
          code: code as string,
          redirect_uri: redirectUri,
        }),
      });

      if (!tokenRes.ok) {
        const errorText = await tokenRes.text();
        console.error('Discord token error:', errorText);
        return res.status(400).send(`Discord Token Exchange Failed: ${errorText}`);
      }

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      // Fetch user profile
      const userRes = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userData = await userRes.json();

      // Fetch user guilds
      const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userGuilds: Array<{ id: string; name: string }> = await guildsRes.json();

      // Check membership
      const inRequiredGuild = Array.isArray(userGuilds) && userGuilds.some((g) => g.id === targetGuildId);

      const authResult = {
        type: 'DISCORD_AUTH_SUCCESS',
        username: userData.username ? `${userData.username}#${userData.discriminator || '0'}` : 'Discordユーザー',
        userId: userData.id,
        avatar: userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : null,
        userGuildsCount: Array.isArray(userGuilds) ? userGuilds.length : 0,
        inRequiredGuild,
        targetGuildId,
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
              <h2>Discord 連携完了</h2>
              <p>画面を閉じて元のページに戻ります...</p>
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
    } catch (err: any) {
      console.error('Discord auth handler exception:', err);
      res.status(500).send(`OAuth Error: ${err.message}`);
    }
  });

  // Serve static or Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
