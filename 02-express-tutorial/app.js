const express = require("express");
const { products } = require("./data");
const app = express();

// ---- helper ----
// -- price validation --
function validatePrice(value) {
  if (value === undefined) return null;
  const num = Number(value);
  if (isNaN(num) || num < 0) return "Invalid price value.";
  return num;
}

// -- public --
app.use(express.static("./public"));

// -- test --
app.get("/api/v1/test", (req, res) => {
  res.json({ message: "it worked!" });
});

// -- all products --
app.get("/api/v1/products", (req, res) => {
  res.json(products);
});

// -- single product --
app.get("/api/v1/products/:productID", (req, res) => {
  console.log(req.params);
  //   res.json(req.params);
  const idToFind = parseInt(req.params.productID);

  // -- if productID is not a number --
  if (isNaN(idToFind)) {
    return res.status(404).json({ message: "That product was not found." });
  }

  const product = products.find((product) => product.id === idToFind);

  // -- if product with provided productID does not exist --
  if (!product) {
    return res.status(404).json({ message: "That product was not found." });
  }

  res.json(product);
});

// -- query --
app.get("/api/v1/query", (req, res) => {
  const { search, regex, limit, maxPrice, minPrice } = req.query;

  let filteredProducts = [...products];

  // -- validate price --
  const max = validatePrice(maxPrice);
  const min = validatePrice(minPrice);
  if (max === "Invalid price value.") {
    return res
      .status(400)
      .json({ message: "maxPrice must be a positive number" });
  }
  if (min === "Invalid price value.") {
    return res
      .status(400)
      .json({ message: "maxPrice must be a positive number" });
  }

  // -- simple search --
  if (search) {
    filteredProducts = filteredProducts.filter((product) => {
      return product.name.toLowerCase().startsWith(search.toLowerCase());
    });
  }

  // -- search with regex --
  if (regex) {
    try {
      const pattern = new RegExp(regex, "i");
      filteredProducts = filteredProducts.filter((product) => {
        pattern.test(product.name);
      });
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Invalid regular expression format" });
    }
  }

  // -- limit search results
  if (limit) {
    const limitNumber = parseInt(limit);
    if (!isNaN(limitNumber)) {
      filteredProducts = filteredProducts.slice(0, limitNumber);
    }
  }

  // -- filter by price --
  if (max !== null) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price <= max
    );
  }

  if (min !== null) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price >= min
    );
  }

  res.status(200).json(filteredProducts);
});

// app.post()
app.all("*", (req, res) => {
  res.status(404).send("<p><h1>404</h1></p><p>page not found</>");
});

app.listen(3000, () => {
  console.log("Listening to the port 3000...");
});
