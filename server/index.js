const express =require('express')
const cors = require('cors')
const NodeCache = require( "node-cache" );
const myCache = new NodeCache({ stdTTL: 60000 });
const profileCache = new NodeCache({ stdTTL: 60000 });
const bodyParser = require('body-parser');

// import { v4 as uuidv4 } from 'uuid';
const { v4: uuidv4 } = require('uuid')
const App = express()
App.use(cors())
// parse application/x-www-form-urlencoded
App.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
App.use(bodyParser.json())


//  Health check Api to check service running
App.get("/",(req,res)=>{
    console.log("localhost:3000/",myCache.keys())
    res.send("Health Check working...")
})
// Api for fetch all post
App.get("/blog/fetchAllBlogs",(req,res)=>{
try {
    let _blogs = myCache.mget(myCache.keys())
    let _result ={
        success:true,
        data:Object.values(_blogs)
    }
    res.send(_result)
} catch (error) {
    res.send({success:false,error})
}
})
// Api for fetch based on id
App.get("/blog/fetchBlogById",(req,res)=>{
    try {
        console.log("req.params",req.query)
        let _blogs ={}
        if(myCache.has(req.query.id)){
            _blogs = myCache.get(req.query.id)
        }else{
            _blogs={}
        }
        let _result ={
            success:true,
            data:_blogs
        }
        res.send(_result)
    } catch (error) {
        res.send({success:false,error})
    }
})
// Api for fetch based on autho rId
App.get("/blog/fetchBlogByAuthor",(req,res)=>{
    try {
        console.log("req.params",req.query)
        let _blogs =[]
         _blogs = myCache.mget(myCache.keys())
         console.log('_blogs',typeof _blogs)
         _blogs = Object.values(_blogs).filter(data=>data.author==req.query.id)
         console.log("_blogs_blogs",_blogs)
        let _result ={
            success:true,
            data:_blogs
        }
        res.send(_result)
    } catch (error) {
        res.send({success:false,error})
    }
})
// Api for save new blog
App.post("/blog/saveNewBlog",(req,res)=>{
    try {
        console.log("body",req.body)
        let _id = uuidv4()
        myCache.set(_id,{...req.body,id:_id})
        let _result ={
            success:true,
            data:{}
        }
        res.send(_result)
    } catch (error) {
        res.send({success:false,error})
    }
})
App.post("/profile/userRegister",(req,res)=>{
    try {
    console.log("body",req)
    let _id = uuidv4()
    profileCache.set(req.body?.userName,{...req.body,id:_id})
    let _result ={
        success:true,
        data:{}
    }
    res.send(_result)
    } catch (error) {
        res.send({success:false,error})
    }
})
// 
App.post("/profile/UserLogin",(req,res)=>{
    try {
        let _user ={}
        if(profileCache.has(req.body.userName)){
            _user = profileCache.get(req.body.userName)
        }else{
            _user={}
        }
        let _result ={
            success:true,
            data:_user
        }
        res.send(_result)
    } catch (error) {
        res.send({success:false,error})
    }
})
// Api for fetch all User
App.get("/profile/fetchAllUsers",(req,res)=>{
    try {
        let _blogs = profileCache.mget(profileCache.keys())
        let _result ={
            success:true,
            data:Object.values(_blogs)
        }
        res.send(_result)
    } catch (error) {
        res.send({success:false,error})
    }
    })
App.listen('3000',()=>console.log("App is listing on port 3000"))