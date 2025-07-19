import { loadImage } from "@napi-rs/canvas";

export default async function parse() {
	const map = await Bun.file("emojiGrid.txt")
		.text()
		.then(x => x.replace(/\r/g, ""))
		.then((x) => x.split(/[\n ]/));

	let hasDuplicates = false;
	map.forEach((x, i) => {
		if (map.slice(i + 1).includes(x) && x !== ".") {
			console.log(`Found a duplicate: ${x}`);
			hasDuplicates = true;
		}
	});
	if (hasDuplicates) throw new Error("Duplicates found");

	const image = await loadImage(
		"https://discord.com/assets/1b05b930a77fbff9.png",
	);
	const imgWidth = image.width / 20;
	const imgHeight = image.height / 4;

	return { map, image, imgWidth, imgHeight };
}

export function parseEmoji(emoji: string) {
	const codepoints = Array.from(emoji)
		.map((x) => x?.codePointAt(0)?.toString(16));

	return codepoints.filter(x => typeof x === "string" && x !== "fe0f").join("-");
}
