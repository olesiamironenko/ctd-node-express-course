const { writeFile, readFile } = require("fs").promises;

async function writer() {
  const filePath = "./temporary/temp.txt";
  try {
    await writeFile(filePath, "This is the first line.\n");
    await writeFile(filePath, "This is the second line.\n", { flag: "a" });
    await writeFile(filePath, "This is the third line.\n", { flag: "a" });
  } catch (err) {
    console.error("Error: ", err);
  }
}

async function reader() {
  const filePath = "./temporary/temp.txt";

  try {
    const data = await readFile(filePath, "utf8");
    console.log("Reader outpput:\n" + data);
  } catch (err) {
    console.error("Reader error:", err);
  }
}

async function readWrite() {
  await writer();
  await reader();
}

readWrite();
