const app = require("../server");
const puppeteer = require("puppeteer");
const fs = require("fs");
const http = require("http");

const PORT = 3000;
const server = http.createServer(app);

server.listen(PORT, async () => {
  console.log(`Server running in http://localhost:${PORT}`);

  await scrapeAllProducts();

  server.close();
  process.exit(0);
});

const scrapeAllProducts = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--disable-setuid-sandbox", "--start-maximized"],
      ignoreHTTPSErrors: true,
    });
    console.log("Opening browser...");

    const url = "https://www.amazon.es";
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });
    console.log(`Navigation to ${url}`);
    await page.goto(url);

    // Elimina el banner de las cookies
    await page.waitForSelector("#sp-cc-wrapper");
    await page.click("#sp-cc-accept");

    await page.type("#twotabsearchtextbox", "dark souls");
    await page.keyboard.press("Enter");

    await page.waitForSelector(".s-pagination-next");

    let products = [];
    let hasNextPage = true;

    while (hasNextPage) {
      await page.waitForSelector(".s-pagination-next");

      const items = await page.$$eval(
        "div[data-component-type='s-search-result']",
        (nodes) => {
          return nodes
            .map((node) => {
              const titleElement = node.querySelector(
                "h2.a-size-base-plus > span"
              );
              const priceElement = node.querySelector(".a-offscreen");
              const imageElement = node.querySelector("img.s-image");

              const title = titleElement ? titleElement.innerText.trim() : null;
              const price = priceElement
                ? priceElement.innerText.replace(" ", "").trim()
                : null;
              const image = imageElement ? imageElement.src : null;

              return title && price && image ? { title, price, image } : null;
            })
            .filter(Boolean);
        }
      );

      products = products.concat(items);

      const nextButton = await page.$(
        "a.s-pagination-next:not(.s-pagination-disabled)"
      );

      if (nextButton) {
        await Promise.all([
          page.click("a.s-pagination-next"),
          page.waitForNavigation({ waitUntil: "networkidle2" }),
        ]);
      } else {
        hasNextPage = false;
      }
      hasNextPage = false;
    }

    console.log(`Found ${products.length} products`);

    fs.writeFileSync(
      "products.json",
      JSON.stringify(products, null, 2),
      "utf-8"
    );

    await browser.close();
  } catch (error) {
    console.error("Error opening browser:", error);
  } finally {
    console.log("Browser closed");
    await browser.close();
  }

  try {
    console.log("Sending data to the API...");
    const data = fs.readFileSync("products.json", "utf-8");
    const products = JSON.parse(data);

    const results = [];
    for (const product of products) {
      const data = await fetch("http://localhost:3000/products", {
        method: "POST",
        body: JSON.stringify(product),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = await data.json();
      results.push(res);
    }
    console.log(`Added ${results.length} products to the database`);
  } catch (error) {
    console.error("Error sending data to the API:", error);
  }
};
