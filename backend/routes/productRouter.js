const express = require('express')
const { getAllProducts } = require('../controller/productController')
const router = express.Router();

//route
router.route("/products").get(getAllProducts)



module.exports = router;