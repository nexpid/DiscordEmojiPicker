import { loadImage } from "@napi-rs/canvas";

export default async function parse() {
  const map = await Bun.file("map.txt")
    .text()
    .then((x) => x.split(" "));

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

  return { map, image, imgWidth, imgHeight };
}
