const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const path = require("path");

async function generatePdfFromHtml(htmlFilePath, outputPdfPath) {
  try {
    const htmlContent = await fs.readFile(htmlFilePath, "utf-8");

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent);

    // Wait for the content to render
    await new Promise((r) => setTimeout(r, 100));

    const contentHeight = await page.evaluate(() => {
      const body = document.querySelector("body");
      return body.clientHeight;
    });

    const bodyPadding = 60; // 30px top + 30px bottom
    const totalHeight = Math.max(
      contentHeight + bodyPadding,
      contentHeight * 1.25
    );

    await page.pdf({
      path: outputPdfPath,
      printBackground: true,
      height: `${totalHeight}px`,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
    });

    await browser.close();
    console.log(`PDF generated: ${outputPdfPath}`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error("Usage: node index.js <input_html_path> <output_pdf_path>");
    process.exit(1);
  }

  const inputFilePath = path.resolve(args[0]);
  const outputPdfPath = path.resolve(args[1]);

  await generatePdfFromHtml(inputFilePath, outputPdfPath);
}

main();
