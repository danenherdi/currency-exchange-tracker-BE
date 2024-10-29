import { assertEquals, assertExists } from "@std/assert";

// Tes endpoint GET /rates
Deno.test("GET /rates should return exchange rates", async () => {
    const response = await fetch("http://localhost:3334/rates");
    const data = await response.json();

    assertEquals(response.status, 200);  // Pastikan status 200
    assertExists(data.conversion_rates);  // Pastikan ada field 'conversion_rates'
    assertExists(data.conversion_rates.USD);  // Cek jika nilai USD tersedia
});
