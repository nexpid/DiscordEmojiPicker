//@ts-expect-error Womp womp
import rawEmojiRegex from "twemoji-parser/dist/lib/regex";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import { rm, mkdir } from "fs/promises";

console.time("Done");

// a period is used if an emoji doesn't exist
const emojiRegex = new RegExp(`(${rawEmojiRegex.source})|(\.)`, rawEmojiRegex.flags);
const map = (await Bun.file("map.txt").text()).match(emojiRegex) ?? [];

let hasDuplicates = false;
map.forEach((x, i) => {
  if (map.slice(i + 1).includes(x) && x !== ".") {
    console.log(`Found a duplicate: ${x}`);
    hasDuplicates = true;
  }
});
if (hasDuplicates) throw new Error("Duplicates found");

const image = await loadImage(
  "https://canary.discord.com/assets/55e1dff9b6a3ad363e9f.png"
);
const imgWidth = image.width / 20;
const imgHeight = image.height / 4;

await rm("../assets", { recursive: true, force: true });
await mkdir("../assets");

let i = 0;
for (const emoji of map) {
    i++;
    if (emoji === ".") continue;

  const img = createCanvas(imgWidth, imgHeight);
  const ctx = img.getContext("2d");

  const x = i % 20;
  const y = Math.floor(i / 20);

  ctx.drawImage(image, -x * imgWidth, -y * imgHeight);

  await Bun.write(
    `../assets/${Array.from(emoji)
      .map((x) => x?.codePointAt(0)?.toString(16))
      .filter((x) => !!x)
      .join("-")}.png`,
    img.toBuffer("image/png")
  );
}

console.timeEnd("Done");