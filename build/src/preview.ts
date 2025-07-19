import { createCanvas, loadImage } from "@napi-rs/canvas";
import parse, { parseEmoji } from "./parse";

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
		const em = parseEmoji(emoji);

		try {
			ctx.drawImage(
				await loadImage(
					`https://raw.githubusercontent.com/jdecked/twemoji/main/assets/72x72/${em}.png`,
				),
				x * imgWidth,
				y * imgHeight,
				imgWidth / 2,
				imgHeight / 2,
			);
		} catch (e) {
			ctx.fillStyle = "#fff";
			ctx.fillText("404", x * imgWidth, y * imgHeight);
		}
	} else {
		const og = ctx.getImageData(x * imgWidth, y * imgHeight, imgWidth, imgHeight);

		for (let i = 3; i < og.data.length; i += 4) {
			const a = og.data[i]!;
			og.data[i] = Math.floor(a * 0.45);
		}
		ctx.putImageData(og, x * imgWidth, y * imgHeight);
	}

	i++;
}

await Bun.write("../preview.png", canvas.toBuffer("image/png"));
console.timeEnd("Done");
