const express=require("express");
const app=express(); // it is just to initialize the express instance 
const path=require("path")
const mongoose=require('mongoose')
const mongodb=require('mongodb') 
const schema=require("./schema.js")
const http=require("http")
const server=http.createServer(app)
const io=require("socket.io")(server,{cors:{origin:"*"}})
const cookie=require('cookie')







// now we have to create a new instance like in mongoose 



app.use(express.urlencoded({extended:false}))
//because we are getting from cloud storage that why we use mongodb
app.set("view engine","ejs")// thoda khula khula hona chhaiya tha islya 
app.use(express.static(path.join(__dirname,'public')))// here we are using middleware as asset
app.get("/",(req,res)=>{
    res.render(__dirname + '/public/index.ejs')
})// in node & express we can use arrow function in routes 
app.get("/home",(req,res)=>{
    res.render(__dirname + '/public/home.ejs')
})
app.get("/secreat",(req,res)=>{
    res.render(__dirname+'/public/save.ejs')
})
app.post("/input",async(req,res)=>{
let article=new schema({
    disease:req.body.disease,
    desc:req.body.desc,
    imagelink:req.body.imagelink,
    population:req.body.population,

    man:req.body.man,
    ladies:req.body.ladies
})

try {
    save=await article.save()
    res.redirect("/secreat")
} catch (error) {
    console.log(error)
    res.redirect("/secreat")
}
})
mongoose.connect('mongodb+srv://divyanshuraj43435_db_user:9FvDgGOUROCOGdoh@smartindia.6uydl5q.mongodb.net/?retryWrites=true&w=majority&appName=smartindia').then(()=>console.log("connected to database")) // connection string hai onine nikala hai 
server.listen(process.env.PORT ||  3000,()=>{
    console.log("brotehr running in port 3000")
})// it also give callback 
app.get("/consult",(req,res)=>{
    res.render(__dirname+'/public/consult.ejs')
})
app.get("/moodtracker",(req,res)=>{
res.render(__dirname+'/public/mod.ejs')
})
///////////////////////////////// in ubuntu use ctrl + c to stop node as server 
/////////////////it's time to create sockets into the project 


app.post("/login",(req,res)=>{
res.cookie('user',req.body.user)
res.cookie('password',req.body.password)
res.redirect("/home")
})
app.get("/search", async(req,res)=>{
    const quer=req.query.query;
    if(quer=="Anxiety"){
        res.json({
            disease:"Anxiety",
            desc:"Anxiety is an emotion characterized by feelings of tension, worried thoughts, and physical changes like a racing heart. While a normal and often helpful response to stress, it becomes a disorder when symptoms are excessive, persist for extended periods (e.g., more than six months), and negatively interfere with daily life. Symptoms can include physical sensations such as sweating, muscle tension, fatigue, and a fast heartbeat, along with mental symptoms like irritability, poor concentration, and trouble sleeping",
            population:35,
            ladies:25,
            man:30
        })
    }
    else{
    let finddata=await schema.findOne({disease:quer})// search? kuch bhi likho as a query count hota hai 
    res.json(finddata) }
})

app.get("/connect",(req,res)=>{
    res.render(__dirname+"/public/mod.ejs")

   
})
/////////////////////sockets ka concept/////
io.on('connection',(socket)=>{
    // just to get names of user from cookies i have used chatgpt 
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const username = cookies.user || "Anonymous";
    io.emit('usercon',username)

    console.log("User connected:", username);

  // Notify all users
  
    
    console.log(socket.id)
    
    socket.on('bhaikijubani',(data)=>{
        //socket.broadcast.emit('bhaikijubani',data)// this  will send message to all except myself
        io.emit('bhaikijubani',{name:username,dt:data})
    })
})
app.get("/tracker",(req,res)=>{
    res.render(__dirname+"/public/moodtracker.ejs")
})
app.get("/game",(req,res)=>{
    res.render(__dirname+"/public/game.ejs")
})