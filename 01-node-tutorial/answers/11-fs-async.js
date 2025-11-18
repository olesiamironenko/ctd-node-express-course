const { writeFile } = require("fs");

const filePath = "./temporary/fileB.txt";

console.log("at start");

writeFile(filePath, "This is line 1.\n", (err, result) => {
  console.log("at point 1");

  if (err) {
    console.log("Error at point 1:", err);
    return;
  } else {
    console.log(result);

    writeFile(filePath, "This is line 2.\n", { flag: "a" }, (err, result) => {
      console.log("at point 2");

      if (err) {
        console.log("Error at point 2:", err);
        return;
      } else {
        console.log(result);

        writeFile(
          filePath,
          "This is line 3.\n",
          { flag: "a" },
          (err, result) => {
            console.log("at point 3");

            if (err) {
              console.log("Error at point 3:", err);
              return;
            } else {
              console.log(result);
            }
          }
        );
      }
    });
  }
});

console.log("at end");
