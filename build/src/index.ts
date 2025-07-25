import { createCanvas } from "@napi-rs/canvas";
import { mkdir, rm } from "fs/promises";
import parse, { parseEmoji } from "./parse";

console.time("Done");

const { map, image, imgWidth, imgHeight } = await parse();

await rm("../assets", { recursive: true, force: true });
await mkdir("../assets");

let i = 0;
for (const emoji of map) {
	if (emoji !== ".") {
		const img = createCanvas(imgWidth, imgHeight);
		const ctx = img.getContext("2d");

		const x = i % 20;
		const y = Math.floor(i / 20);

		ctx.drawImage(image, -x * imgWidth, -y * imgHeight);

		await Bun.write(
			`../assets/${parseEmoji(emoji)}.png`,
			img.toBuffer("image/png"),
		);
	}
	i++;
}

console.timeEnd("Done");
