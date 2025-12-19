const express = require("express");
const router = express.Router();
const {
  getPeople,
  getPersonById,
  addPerson,
  updatePerson,
  deletePerson,
} = require("../controllers/people.js");
const { people } = require("../data.js");

router.get("/", getPeople);

router.post("/", addPerson);

router.get("/:id", getPersonById);

router.put("/:id", updatePerson);

router.delete("/:id", deletePerson);

module.exports = router;
