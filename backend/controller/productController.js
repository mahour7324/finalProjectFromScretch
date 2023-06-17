const Product = require("./../models/productModel");
const ErrorHandler = require("./../utils/errorhandler");
const catchAsyncError = require("./../middleware/catchAsyncErrors");
const ApiFeatures = require("./../utils/apiFeatures");

// createProduct controller --Admin----------------------------------------------------------------------------------------------------------|
exports.createProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});
//-------------------------------------------------------------------------------------------------------------------------------------------|

// Get all Products--------------------------------------------------------------------------------------------------------------------------|
exports.getAllProducts = catchAsyncError(async (req, res) => {
  // console.log(req.query, "req.query") // out: { keyword: 'samosa', category: 'food' } req.query
  const resultPerPage = 5;
  const productCount = await Product.countDocuments( )
  const apiFeature = new ApiFeatures(Product.find(), req.query)
  .search()
  .filter()
  .pagination(resultPerPage);


  
  const products = await apiFeature.query;
  res.status(200).json({
    success: true,
    products,
    productCount
  });
});
//-------------------------------------------------------------------------------------------------------------------------------------------|

// Update the Product--Admin-----------------------------------------------------------------------------------------------------------------|
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  const oldProduct_id = req.params.id;
  let product_id = oldProduct_id.slice(0, -1); // because 2 extras character are coming and creating problem, like: 6484ba1951f776c1b83a0fe7\n
  let product = await Product.findById(product_id);
  if (!product) {
    res.status(500).json({
      success: false,
      message: "Product not found",
    });
    // return;
  }
  product = await Product.findByIdAndUpdate(product_id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});
//-------------------------------------------------------------------------------------------------------------------------------------------|

//deleting a Product--------------------------Admin------------------------------------------------------------------------------------------|
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const oldProduct_id = req.params.id;
  let product_id = oldProduct_id.slice(0, -1);
  let product = await Product.findById(product_id);
  if (!product) {
    res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }
  await product.deleteOne();
  res.status(200).json({
    success: true,
    message: "Product is successfully deleted",
  });
});
//-------------------------------------------------------------------------------------------------------------------------------------------|

//getProductDetails------------------------------------------------------admin---------------------------------------------------------------|
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  const oldProduct_id = req.params.id;
  let product_id = oldProduct_id.slice(0, -1);
  let product = await Product.findById(product_id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    product,
  });
});
//-------------------------------------------------------------------------------------------------------------------------------------------|
