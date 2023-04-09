const express = require('express')
const path = require('path')
const fs = require('fs')
const server =  express()
const port = 3001

server.use(express.static('public'))

server.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, "public/index.html"))
})

server.get('/notes', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public/notes.html'))
})

server.get('/api/notes', (req, res)=>{
    res.sendFile(path.join(__dirname, 'db/db.json'))
})

server.post('/api/notes', (req, res)=>{
    const {title, text} = req.body
    if(title && text){
        fs.readFile('./db/db.json', 'utf8', (err, data)=>{
            let newData = JSON.parse(data)
            newData.push({"title": title, "text": text})
            fs.writeFile('./db/db.json', JSON.stringify(newData), (err)=>err? console.log('Failed to write to db.json.'): console.log('Write successful.'))
        })
    }else{
        res.status(500).json('Error in finding new db items.')
    }
    
})

server.listen(port, console.log("Open page at port ", port))