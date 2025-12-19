const { people } = require("../data.js");

// -- helper --
function findPersonById(idParam) {
  const idToFind = parseInt(idParam);
  if (isNaN(idToFind) || idToFind <= 0) {
    return { error: "invalid-id" };
  }
  const index = people.findIndex((person) => person.id === idToFind);
  if (index === -1) {
    return { error: "not-found" };
  }
  return { person: people[index], index };
}
// -- end of helper --

function getPeople(req, res) {
  res.status(200).json(people);
}

function getPersonById(req, res) {
  const result = findPersonById(req.params.id);

  if (result.error === "invalid-id") {
    return res
      .status(400)
      .json({ success: false, message: "id must be a positive integer" });
  }

  if (result.error === "not-found") {
    return res
      .status(404)
      .json({ success: false, message: "person not found" });
  }

  res.status(200).json(result.person);
}

function addPerson(req, res) {
  const { name } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Pleasse provide a name" });
  }

  people.push({ id: people.length + 1, name: name });
  res.status(200).json({ success: true, name: name });
}

function updatePerson(req, res) {
  const result = findPersonById(req.params.id);

  if (result.error === "invalid-id") {
    return res
      .status(400)
      .json({ success: false, message: "id must be a positive integer" });
  }

  if (result.error === "not-found") {
    return res
      .status(404)
      .json({ success: false, message: "person not found" });
  }

  const { name } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Pleasse provide a name" });
  }

  result.person.name = name;
  res.status(200).json(result.person);
}

function deletePerson(req, res) {
  const result = findPersonById(req.params.id);
  if (result.error === "invalid-id") {
    return res
      .status(400)
      .json({ success: false, message: "id must be a positive integer" });
  }

  if (result.error === "not-found") {
    return res
      .status(404)
      .json({ success: false, message: "person not found" });
  }

  const deleted = people.splice(result.index, 1)[0];
  res.status(200).json({ success: true, deleted });
}

module.exports = {
  getPeople,
  getPersonById,
  addPerson,
  updatePerson,
  deletePerson,
};
