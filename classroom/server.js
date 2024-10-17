const express= require("express");
const app = express();
const users = require("./routes/user.js")
const posts = require("./routes/post.js")
const cookieParser = require("cookie-parser")

app.use(cookieParser("secretcode"));

app.get("/getsignedcookies",(req,res)=>{
    res.cookie("made-in","china", {signed:true});
    res.send("signed cookie sent");
})

app.get("/getcookies",(req,res) =>{
    res.cookie("from","india");
    res.cookie("greet","namaste");
    res.send("sent you some cookies!");
})

app.get("/verify",(req,res) =>{
    console.log(req.signedCookies);
    res.send("verified");
})

app.get("/", (req,res)=>{
    let {name= "anonymous"} = req.cookies;
    res.send(`Hi, ${name}`);
})

app.use('/users', users);
app.use('/posts', posts);

app.listen(3000, () =>{
    console.log("server is listening to port 3000");
})
