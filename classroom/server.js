const express= require("express");
const app = express();
const users = require("./routes/user.js")
const posts = require("./routes/post.js")
const session = require("express-session");

const sessionOptions = {
    secret: "mysecretstring", resave: false, saveUninitialized: true,
}

app.use(session(sessionOptions));

app.get("/register",(req,res)=>{
    let {name = "anonymous"} = req.query;
    res.send(name);
})

app.get("/hello",(req,res)=>{
    res.send(`hello`);
})

// app.get("/reqcount", (req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`You sent a request ${req.session.count} itmes.`);
// })

// app.get("/test", (req,res)=>{
//     res.send("test successful");
// })

app.listen(3000, () =>{
    console.log("server is listening to port 3000");
})
