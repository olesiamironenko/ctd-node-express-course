const { writeFile, readFile } = require("fs").promises;

const filePath = "./temporary/temp.txt";
writeFile(filePath, "Write line 1.\n")
  .then(() => {
    return writeFile(filePath, "Write line 2.\n", { flag: "a" });
  })
  .then(() => {
    return writeFile(filePath, "This is the third line.\n", { flag: "a" });
  })
  .then(() => {
    return readFile(filePath, "utf8");
  })
  .then((data) => {
    console.log("File content:\n" + data);
  })
  .catch((err) => {
    console.error("Error: ", err);
  });
