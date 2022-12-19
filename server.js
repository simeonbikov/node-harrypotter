/* 
We have a client requirement to build a RESTful API in Express
to manage a database of Harry Potter Characters.

This API should include:
- an endpoint that returns a list of all characters

- - this endpoint should have the ability to filter by house 
    and by name. 

- an endpoint that returns the details of a single character

/characters
/characters/<id>
/characters/1
/characters/2
/characters/3

/characters?name=Harry Potter&house=Gryffindor
/characters?house=Gryffindor
/characters?house=Slytherin


C - Create
  - POST request

R - Read/Retrieve
  - GET request

U - Update
  - PUT
    - Updating the entire document

  Original Document
  {
    "name": "Hannah Abbott",
    "house": "Hufflepuff"
  }
  
  Hannah Abbot changes house to Gryffindor

  PUT /characters/22
  Body:
    {
      "name": "Hannah Abbott",
      "house": "Gryffindor"
    }

  PATCH /characters/22

  Body:
    {
      "house": "Gryffindor"
    }


D - Delete
  - DELETE
  
  DELETE /characters/:id


POST /characters   

  Headers
    {
      "Authentication": <auth token>
    }

  Body: 
    {
      "name": "Hannah Abbott",
      "house": "Hufflepuff"
    }


// 200 OK 
// 400 Client Error (bad input/no auth/wrong auth)
// 500 Server Error (API broke)



*/


const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const port = 3000;

let data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
let maxID = Math.max(...data.map((c) => c.id));

app.get("/characters", (req, res) => {
  let characters = data;

  if (req.query.name) {
    characters = characters.filter((c) => c.name === req.query.name);
  }

  if (req.query.house) {
    characters = characters.filter((c) => c.house === req.query.house);
  }

  res.json(characters);
});

app.get("/characters/:id", (req, res) => {
  const characterId = parseInt(req.params.id);
  res.json(data.find((c) => c.id === characterId));
});

app.post("/characters", (req, res) => {
  if (!req.body.name || !req.body.house) {
    res.status(400).send("You must include a name and a house in your request");
    return;
  }
  const validHouses = ["Gryffindor", "Ravenclaw", "Slytherin", "Hufflepuff"];
  if (!validHouses.includes(req.body.house)) {
    res.status(400).send("House must be a valid Hogwarts House");
    return;
  }

  const newCharacter = {
    id: ++maxID,
    name: req.body.name,
    house: req.body.house,
  };

  data.push(newCharacter);
  save();
  res.json(newCharacter);
});

app.delete("/characters/:id", (req, res) => {

  const characterId = parseInt(req.params.id);
  const characterIndex = data.findIndex((c) => c.id === characterId);

  if (characterIndex < 0) {
    res.sendStatus(404);
    return;
  }

  data.splice(characterIndex, 1);
  save();
  res.send("character deleted");
});

app.put("/characters/:id", (req, res) => {

  if (!req.body.name || !req.body.house) {
    res.status(400).send("You must include a name and a house in your request");
    return;
  }
  const validHouses = ["Gryffindor", "Ravenclaw", "Slytherin", "Hufflepuff"];
  if (!validHouses.includes(req.body.house)) {
    res.status(400).send("House must be a valid Hogwarts House");
    return;
  }

  const characterId = parseInt(req.params.id);
  const characterIndex = data.findIndex((c) => c.id === characterId);

  if (characterIndex < 0) {
    res.sendStatus(404);
    return;
  }

  const updatedCharacter = {
    id: characterId,
    name: req.body.name,
    house: req.body.house,
  };

  const origCharacter = data[characterIndex];
  data[characterIndex] = updatedCharacter;
  save();
  res.json([origCharacter, updatedCharacter]);
});

const save = () => {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
};

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
