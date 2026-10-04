import handler, { createScheduledHandler, PluginBridge } from "@emdash-cms/cloudflare/worker";

export { PluginBridge };

export default {
  ...handler,

  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/__debug-db") {
      try {
        const result = await env.DB.prepare(
          "SELECT name, type FROM sqlite_master WHERE type IN ('table','view') ORDER BY type, name",
        ).all();

        return new Response(
          JSON.stringify({
            ok: true,
            tables: result.results,
            hasSessionBinding: Boolean(env.SESSION),
          }),
          {
            headers: { "content-type": "application/json; charset=utf-8" },
          },
        );
      } catch (error) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: error instanceof Error ? error.message : String(error),
          }),
          {
            status: 500,
            headers: { "content-type": "application/json; charset=utf-8" },
          },
        );
      }
    }

    return handler.fetch(request, env, ctx);
  },

  scheduled: createScheduledHandler(),
} satisfies ExportedHandler;
