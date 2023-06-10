const express = require('express')
const { getAllProducts , createProduct } = require('../controller/productController')

const router = express.Router();

//route
router.route("/products").get(getAllProducts)
router.route("/products/new").post(createProduct)



module.exports = router;