const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fetch = require("node-fetch")

const app = express()
const PORT = 4000

app.use(cors());
app.use(bodyParser.json())

app.get("/", (req, res)=>{
    res.send("Ola backed is running...!")
})

app.get("/api/geocode", async (req, res)=> {
    try{
        const {q} = req.query;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`);
        const data = await response.json();
        res.json(data);
    }catch(error){
        res.status(500).json({error: "Failed to fetch geocode"});
    }
});

app.listen(PORT, ()=>{
    console.log(`Backend is running at server port ${PORT}`)
})