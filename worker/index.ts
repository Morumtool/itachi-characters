export interface Env {
  DISCORD_CLIENT_ID: string;
  DISCORD_CLIENT_SECRET: string;
  DISCORD_GUILD_ID: string;
  DISCORD_REDIRECT_URI: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Endpoint: GET /api/auth/discord/url
    if (pathname === '/api/auth/discord/url') {
      const clientId = env.DISCORD_CLIENT_ID;
      const redirectUri = env.DISCORD_REDIRECT_URI;
      
      if (!clientId) {
        return new Response(JSON.stringify({
          configured: false,
          message: 'DISCORD_CLIENT_ID environment variable is not set.'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'identify guilds',
      });

      const discordUrl = `https://discord.com/oauth2/authorize?${params.toString()}`;
      return new Response(JSON.stringify({
        configured: true,
        url: discordUrl,
        redirectUri
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Endpoint: GET /auth/discord/callback
    if (pathname === '/auth/discord/callback' || pathname === '/auth/discord/callback/') {
      const code = searchParams.get('code');
      const guild_id = searchParams.get('guild_id');
      const clientId = env.DISCORD_CLIENT_ID;
      const clientSecret = env.DISCORD_CLIENT_SECRET;
      const targetGuildId = env.DISCORD_GUILD_ID || guild_id || '123456789012345678';

      if (!code) {
        return new Response('Authorization code missing.', { status: 400, headers: corsHeaders });
      }

      try {
        const redirectUri = env.DISCORD_REDIRECT_URI;
        
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
            code: code,
            redirect_uri: redirectUri,
          }),
        });

        if (!tokenRes.ok) {
          const errorText = await tokenRes.text();
          return new Response(`Discord Token Exchange Failed: ${errorText}`, { status: 400, headers: corsHeaders });
        }

        const tokenData = await tokenRes.json() as any;
        const accessToken = tokenData.access_token;

        // Fetch user profile
        const userRes = await fetch('https://discord.com/api/users/@me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const userData = await userRes.json() as any;

        // Fetch user guilds
        const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const userGuilds = await guildsRes.json() as any;

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

        const html = `
          <!DOCTYPE html>
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
        `;

        return new Response(html, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/html; charset=utf-8'
          }
        });
      } catch (err: any) {
        return new Response(`OAuth Error: ${err.message}`, { status: 500, headers: corsHeaders });
      }
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  }
};
