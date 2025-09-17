const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const PORT = 4000

app.use(cors())
app.use(bodyParser.json())

app.get("/", (req, res)=>{
    res.send("Ola backed is running...!")
})

app.listen(PORT, ()=>{
    console.log(`Backend is running at server port ${PORT}`)
})