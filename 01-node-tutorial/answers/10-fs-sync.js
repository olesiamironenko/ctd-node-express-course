const { readFileSync, writeFileSync } = require("fs");

const filePath = "./temporary/fileA.txt";

writeFileSync(filePath, "This is the first line.\n");

writeFileSync(filePath, "This is the second line.\n", { flag: "a" });
writeFileSync(filePath, "This is the third line.\n", { flag: "a" });

const data = readFileSync(filePath, "utf8");

console.log(data);
