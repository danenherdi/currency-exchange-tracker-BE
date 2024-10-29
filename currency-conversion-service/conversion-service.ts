import { Application, Router } from "./deps.ts";
import "https://deno.land/std@0.212.0/dotenv/load.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

const EXCHANGE_API_KEY = Deno.env.get("EXCHANGE_API_KEY") || "";
const EXCHANGE_API_URL = `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/USD`;

const app = new Application();
const router = new Router();

router.post("/convert", async (ctx) => {
  const { from, to, amount } = await ctx.request.body().value;

  try {
    const response = await fetch(EXCHANGE_API_URL);
    const data = await response.json();

    if (!(from in data.conversion_rates) || !(to in data.conversion_rates)) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid currency code" };
      return;
    }

    const rate = data.conversion_rates[to] / data.conversion_rates[from];
    const converted_amount = Math.round((amount * rate + Number.EPSILON) * 100) / 100;

    ctx.response.body = { converted_amount };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: "Conversion failed" };
  }
});

app.use(oakCors()); // Tambahkan CORS middleware
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 3335 });
console.log("Currency Conversion Service is running on port 3335");
