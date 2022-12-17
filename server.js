

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

*/


// import express
const express = require("express")
const fs = require("fs")

// create a new express api
const app = express()

const port = 3000

const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

app.get("/characters", (req, res) => {
    let characters = data

    if (req.query.name) {
        characters = characters.filter(c => c.name === req.query.name)
    }

    if (req.query.house) {
        characters = characters.filter(c => c.house === req.query.house)
    }

    res.json(characters)
})

app.get("/characters/:id", (req, res) => {
    const characterId = parseInt(req.params.id)
    res.json(data.find(c => c.id === characterId))
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
