const express = require('express')
const path = require('path')
const fs = require('fs')
const server =  express()
const port = process.env.PORT || 3001

server.use(express.json())
server.use(express.urlencoded({ extended: true }));
server.use(express.static('public'))

server.get('/notes', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public/notes.html'))
})

server.get('/api/notes', (req, res)=>{
    res.sendFile(path.join(__dirname, 'db/db.json'))
})

server.post('/api/notes', (req, res)=>{
    const title = req.body["title"]
    const text = req.body["text"]
    const id = Math.floor(Math.random()*1000000)
    if(title && text){
        fs.readFile('./db/db.json', 'utf8', (err, data)=>{
            let newData = JSON.parse(data)
            newData.push({"id":id, "title": title, "text": text})
            fs.writeFile('./db/db.json', JSON.stringify(newData), (err)=>err? console.log('Failed to write to db.json.'): console.log('Write successful.'))
            res.status(201).json(newData)
        })
    }else{
        res.status(500).json('Error in finding new db items.')
    }
    
})

server.delete('/api/notes/:id', (req, res)=>{
    const id = parseInt(req.params.id)
    if(id){
        fs.readFile('./db/db.json', 'utf8', (err, data)=>{
            let currentData = JSON.parse(data)
            let newData = currentData.filter((val)=>val["id"]!==id)
            console.log(id)
            console.log(newData)
            fs.writeFile('./db/db.json', JSON.stringify(newData), (err)=>err? console.log('Failed to write to db.json.'): console.log('Removal successful.'))
            res.status(201).json("Delete succeded")
        })
    }else{
        res.status(500).json('Delete failed')
    }
})

server.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, "public/index.html"))
})

server.listen(port, console.log("Open page at port ", port))