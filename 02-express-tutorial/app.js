const express = require("express");
const cookieParser = require("cookie-parser");
const { products, people } = require("./data");
const peopleRouter = require("./routes/people");
const app = express();

const logger = (req, res, next) => {
  const method = req.method;
  const url = req.url;
  const time = new Date().getFullYear();
  console.log(method, url, time);
  next();
};

// -- public --
app.use(logger);
app.use(express.static("./methods-public"));

// -- post implementation
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

app.use("/api/v1/people", peopleRouter);

// ---- helper ----
// -- price validation --
function validatePrice(value) {
  if (value === undefined) return null;
  const num = Number(value);
  if (isNaN(num) || num < 0) return "Invalid price value.";
  return num;
}

// -- middleware --
// -- authentication --
function auth(req, res, next) {
  const { name } = req.cookies;

  if (!name) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  console.log("Cookies received:", req.cookies);
  req.user = name;

  next();
}
// -- end of middleware --

// -- logon --
app.post("/logon", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is reqired" });
  }
  res.cookie("name", name);
  res.status(201).json({ message: `Hello, ${name}` });
});

// -- logoff --
app.delete("/logoff", (req, res) => {
  res.clearCookie("name");
  res.status(200).json({ message: "User logged off" });
});

// -- test authentication --
app.get("/test", auth, (req, res) => {
  res.status(200).json({ message: `Welcome ${req.user}` });
});

app.get("/", (req, res) => {
  res.send("Home");
});

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
        return pattern.test(product.name);
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

// // -- get people --
// app.get("/api/v1/people", (req, res) => {
//   res.json(people);
// });

// // -- post people --
// app.post("/api/v1/people", (req, res) => {
//   const { name } = req.body;

//   // -- validation --
//   if (!name) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Please provide a name" });
//   }

//   // add to array
//   people.push({ id: people.length + 1, name: req.body.name });
//   res.status(200).json({ success: true, name: req.body.name });
// });

// app.post()
app.all("*", (req, res) => {
  res.status(404).send("<h1>404</h1><p>page not found</p>");
});

app.listen(3000, () => {
  console.log("Listening to the port 3000...");
});
