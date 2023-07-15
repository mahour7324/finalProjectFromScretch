const Product = require("./../models/productModel");
const ErrorHandler = require("./../utils/errorhandler");
const catchAsyncError = require("./../middleware/catchAsyncErrors");
const ApiFeatures = require("./../utils/apiFeatures");

// createProduct controller --Admin----------------------------------------------------------------------------------------------------------|
exports.createProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});
//-------------------------------------------------------------------------------------------------------------------------------------------|

// Get all Products---------------------------------------user-------------------------------------------------------------------------------|
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

// Create New Review or Update the review----------------------------------------------------------------------------------------------------|
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});
//-------------------------------------------------------------------------------------------------------------------------------------------|


// Get All Reviews of a product--------------------------------------------------------------------------------------------------------------|
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});
//-------------------------------------------------------------------------------------------------------------------------------------------|


// Delete Review-----------------------------------------------------------------------------------------------------------------------------|
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
//-------------------------------------------------------------------------------------------------------------------------------------------|
