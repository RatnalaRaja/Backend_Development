const express = require ("express");
const urlRoute = require('./routes/url');
const {connectDB} =require('./connect');
const URL=require("./models/url");
const app = express();
const port=8001;


connectDB('mongodb://localhost:27017/short-url')
.then(()=>console.log("MOngodb Connected"));

app.use(express.json());

app.use("/url",urlRoute);

app.get('/:shortId',async(req,res)=>{
    const shortId=req.params.shortId;
    const entry=await URL.findOneAndUpdate({
        shortId
    },{$push:{
        visitHistory:{timestamps:Date.now()},
    }});
    res.redirect(FileSystemEntry.redirectURL);
})
app.listen(port,()=>{console.log(`Server started at port,${port}`)});
