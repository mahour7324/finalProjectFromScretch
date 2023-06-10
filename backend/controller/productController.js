const Product = require('./../models/productModel')
// constroller of product creation
exports.createProduct = async (req,res,next) =>{
   const product = await Product.create(req.body );
   res.status(201).json({
      success:true, 
      product
   })
}



// sample working controller
exports.getAllProducts = (req,res)=>{
   res.status(200).json({Message:"working"})
}