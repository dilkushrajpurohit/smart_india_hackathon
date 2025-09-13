//hey bhai yaha par main schema define karta hai 
const mongoose=require('mongoose')
const schema=new mongoose.Schema({
disease:{
    type:String
},
desc:{
    type:String
},
imagelink:{
    type:String
},
population:{
    type:Number
},
man:{
    type:Number
},
ladies:{
    type:Number
},







}) 
module.exports=mongoose.model('schema',schema)  // it is a new constructor it is almost same as class that why we use new keyword here because we are creating a new instance 
