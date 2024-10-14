const express = require("express");
const router = express.Router();

//index-users
router.get('/users',(req,res)=>{
    res.send("GET for users");
})

//show-users
router.get('/users/:id',(req,res) =>{
    res.send('GET for show users.');
})

//post-users
router.post('/users',(req,res) =>{
    res.send('POST for users.');
})

//DELETE-users
router.delete('/users/:id',(req,res) =>{
    res.send('DELETE for user id');
})

module.exports = router;