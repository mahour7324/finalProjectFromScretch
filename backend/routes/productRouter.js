const express = require('express') 
const { getAllProducts , createProduct , updateProduct ,deleteProduct , getProductDetails} = require('../controller/productController') //importing controller methods

const router = express.Router(); 

//route : adding route with http methods 
router.route("/products").get(getAllProducts)
router.route("/products/new").post(createProduct)
router.route("/products/:id").put(updateProduct).delete(deleteProduct)// ****/products/mongoenteryid so we can get it in req.params.id
router.route("/products/:id").get(getProductDetails)




module.exports = router;
