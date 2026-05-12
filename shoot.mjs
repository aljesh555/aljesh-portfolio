import puppeteer from "puppeteer";

const URL = process.env.URL || "https://aljesh-portfolio.pages.dev/";
const OUT = process.env.OUT || "/tmp/aljesh-shots/shot.png";
const WAIT = parseInt(process.env.WAIT || "8000", 10);
const W = parseInt(process.env.W || "1600", 10);
const H = parseInt(process.env.H || "1000", 10);
const DARK = process.env.DARK !== "0";

const browser = await puppeteer.launch({
  headless: true,
  args: [
    "--enable-webgl",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--no-sandbox",
    "--disable-features=Translate,UseChromeOSDirectVideoDecoder",
  ],
  defaultViewport: { width: W, height: H, deviceScaleFactor: 1 },
});

try {
  const page = await browser.newPage();
  await page.emulateMediaFeatures([
    { name: "prefers-color-scheme", value: DARK ? "dark" : "light" },
    { name: "prefers-reduced-motion", value: "no-preference" },
  ]);
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
  // wait extra for the loader minimum hold + globe to spin up
  await new Promise((r) => setTimeout(r, WAIT));
  await page.screenshot({ path: OUT, type: "png" });
  console.log("OK", OUT);
} catch (e) {
  console.error("FAIL", e.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
