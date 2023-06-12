const mongoose = require('mongoose')
// creating product schema
const productSchema = new mongoose.Schema({ 
    name:{
        type:String,
        required:[true,'Please enter Product Name'],
        trim:true
    },
    discription:{
        type:String,
        required:[true,"Please enter the Product Discription"]
    },
    price:{
        type:Number,
        required:[true,"Please enter the Product Price"],
        maxLength:[8,"Price should not greather then 8 digit"]
    },
    rating:{
        type:Number,
        default:0
    },
    images:[
        {public_ID:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }}
    ],
    category:{
        type:String,
        required:[true,'Please specify the Product Category']
    },
    stock:{
        type:Number,
        required:[true,"Please enter the amount of Stock"],
        maxLength:[4,"Stock can't exceed 4 character"],
        default:1

    },
    numOfReviews:[{
        name:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            required:true
        },
        comment:{
            type:String,
            required:true
        }
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model("Product",productSchema) // making mongoose model of product schema named with Product