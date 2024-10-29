import { assertEquals, assertExists } from "@std/assert";

// Tes endpoint POST /convert untuk konversi yang valid
Deno.test("POST /convert should return the converted amount", async () => {
    const body = JSON.stringify({
        from: "USD",
        to: "IDR",
        amount: 100,
    });

    const response = await fetch("http://localhost:3335/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
    });

    const data = await response.json();

    assertEquals(response.status, 200);  // Pastikan status 200
    assertExists(data.converted_amount);  // Pastikan ada field 'converted_amount'
    console.log(`Converted amount: ${data.converted_amount}`);
    });

    // Tes error handling untuk mata uang tidak valid
    Deno.test("POST /convert should return an error for invalid currencies", async () => {
    const body = JSON.stringify({
        from: "INVALID",
        to: "IDR",
        amount: 100,
    });

    const response = await fetch("http://localhost:3335/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
    });

    const data = await response.json();

    assertEquals(response.status, 400);  // Ekspektasi status 400
    assertExists(data.error);  // Pastikan ada field 'error'
    console.log(`Error message: ${data.error}`);
});
