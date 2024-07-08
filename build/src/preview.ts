import { createCanvas, loadImage } from "@napi-rs/canvas";
import parse from "./parse";

console.time("Done");

const { map, image, imgWidth, imgHeight } = await parse();

const canvas = createCanvas(image.width, image.height);
const ctx = canvas.getContext("2d");
ctx.drawImage(image, 0, 0);
ctx.fillStyle = `#fff`;
ctx.font = `sans-serif ${imgHeight / 3}px`;
ctx.textBaseline = "top";

let i = 0;
for (const emoji of map) {
  const x = i % 20;
  const y = Math.floor(i / 20);
  if (emoji !== ".") {
    try {
      ctx.drawImage(
        await loadImage(
          `https://raw.githubusercontent.com/jdecked/twemoji/main/assets/72x72/${Array.from(
            emoji
          )
            .map((x) => x?.codePointAt(0)?.toString(16))
            .filter((x) => !!x && x !== "fe0f")
            .join("-")}.png`
        ),
        x * imgWidth,
        y * imgHeight,
        imgWidth / 2,
        imgHeight / 2
      );
    } catch (e) {
      ctx.fillStyle = "#fff";
      ctx.fillText("404", x * imgWidth, y * imgHeight);
    }
  } else {
    ctx.fillStyle = "#0005";
    ctx.fillRect(x * imgWidth, y * imgHeight, imgWidth, imgHeight);
  }

  i++;
}

await Bun.write("../preview.png", canvas.toBuffer("image/png"));
console.timeEnd("Done");
