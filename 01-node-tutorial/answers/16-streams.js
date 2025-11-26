const { createReadStream } = require("fs");

const stream = createReadStream("../content/big.txt", {
  encoding: "utf8",
  highWaterMark: 200,
});

let counter = 0;

stream.on("data", (chunk) => {
  counter++;
  console.log(`--- Chunk #${counter}\n`);
  console.log(chunk);
  // checking each chunk length
  console.log(chunk.length);
});
stream.on("end", () => {
  console.log(`Done! ${counter} chunks received`);
});
stream.on("error", (err) => {
  console.log(`Stream error: ${err}`);
});
