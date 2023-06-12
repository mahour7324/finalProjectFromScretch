const Product = require('./../models/productModel')

// createProduct controller --Admin----------------|
exports.createProduct = async (req,res,next) =>{
   const product = await Product.create(req.body );
   res.status(201).json({
      success:true, 
      product
   })
}



// Get all Products---------------------------------------|
exports.getAllProducts = async (req,res)=>{
   const Products = await Product.find();
   res.status(200).json({
      success:true,
      Products
   })
}

// Update the Product--Admin----------------------------------------------------------------------------------------------|
exports.updateProduct = async (req, res, next) => {
   const oldProduct_id = req.params.id
   let product_id = oldProduct_id.slice(0, -1);// because 2 extras are coming and creating problem like: 6484ba1951f776c1b83a0fe7\n
   let product = await Product.findById(product_id);
   if (!product) {
      res.status(500).json({
         success: false,
         message: "Product not found"
      });
      // return;  // Make sure to return after sending the response
   }
   product = await Product.findByIdAndUpdate(product_id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false
   });

   res.status(200).json({
      success: true,
      product,
   });
};



//deleting a Product--------------------------Admin--------------------------------|
exports.deleteProduct = async (req,res,next)=>{
   try
   {const oldProduct_id = req.params.id
   let product_id = oldProduct_id.slice(0, -1);
   let product = await Product.findById(product_id)
   if(!product){
      res.status(500).json({
         success:false,
         message: "Product not found",
      })
   }
   
   
   await product.deleteOne();
   res.status(200).json({
      success:true,
      message:"Product is successfully deleted"
   })
}
   catch (error) {
      // console.error(error);

      res.status(500).json({
         success: false,
         message: "Server Error such a Product doesn't Exist"
      });
   }
}
   
//getProductDetails----------------------------------------------------not working------------------------------------------|
exports.getProductDetails = async (req,res,next)=>{
   try
   {const oldProduct_id = req.params.id
   let product_id = oldProduct_id.slice(0, -1);
   let product = await Product.findById(product_id)
   if(!product){
      res.status(500).json({
         success:false,
         message: "Product not found",
      })
   }
   res.status(200).json({
      product
   })
   
   // await product.deleteOne();
   // res.status(200).json({
   //    success:true,
   //    message:"Product is successfully deleted"
   // })
}
   catch (error) {
      // console.error(error);

      res.status(500).json({
         success: false,
         message: "Server Error such a Product doesn't Exist"
      });
   }
}

//getProductDetails----------------------------------------------------------------------------------------------|