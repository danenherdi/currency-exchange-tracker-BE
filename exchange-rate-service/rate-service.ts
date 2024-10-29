import { Application, Router } from "./deps.ts";
import "https://deno.land/std@0.212.0/dotenv/load.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

const EXCHANGE_API_KEY = Deno.env.get("EXCHANGE_API_KEY") || "";
const EXCHANGE_API_URL = `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/USD`;

const app = new Application();
const router = new Router();

router.get("/rates", async (ctx) => {
  try {
    const response = await fetch(EXCHANGE_API_URL);
    const data = await response.json();
    ctx.response.body = data;
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: "Failed to fetch exchange rates" };
  }
});

app.use(oakCors()); // Tambahkan CORS middleware
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 3334 });
console.log("Exchange Rate Service is running on port 3334");
