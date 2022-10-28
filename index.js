const express = require('express');
const uuid = require('uuid');
const app = express();
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname,"./public/index.html"))
});

app.get('/notes', (req,res)=>{
   res.sendFile(path.join(__dirname,"./public/notes.html"))
});

app.get('/api/notes', (req,res)=>{
    fs.readFile("./db/db.json","utf-8",(err,data)=>{
        if(err){
            res.status(500).json({
                msg:"holy smokes, that ain't right",
                err:err
            })
        } else {
            const dataArr = JSON.parse(data);
            res.json(dataArr)
        }
    })
});

app.post('/api/notes', (req,res)=>{
    fs.readFile("./db/db.json", "utf-8",(err,data)=>{
        if(err){
            console.log(err);
            res.status(500).json({
                msg:"holy smokes, that ain't right",
                err:err
            })
        } else {
            const dataArr = JSON.parse(data);
            req.body.id = uuid.v4();
            //^ this is the syntax for adding a new id onto an object (in this case the object is '.body')
            dataArr.push(req.body);
            fs.writeFile("./db/db.json", JSON.stringify(dataArr,null,4),(err,data)=>{
                if(err){
                    console.log(err);
                    res.status(500).json({
                        msg:'thats nasty',
                        err:err
                    })
                } else {
                    res.json({
                        msg:"touch down!",
                    })
                }
            })
        }
    })
});

app.get('/*', (req,res)=>{
    res.sendFile(path.join(__dirname,"./public/index.html"))
});

app.listen(PORT,()=>{
    console.log(`listenin' on port ${PORT}`)
  })