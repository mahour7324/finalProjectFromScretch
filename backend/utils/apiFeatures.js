//making api features for search and filtering of products-----
class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  // method for searching item using keywords and case insensitive manner-------------------------------------------------------------------|
  search() {
    //ternary op ex :  const message = age >= 18 ? "You are an adult" : "You are a minor";
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $option: "i",
          },
        }
      : {};

    // console.log(keyword) out:{ name: { '$regex': 'samosa', '$option': 'i ' } }
    this.query = this.query.find({ ...keyword });
    return this; // return this : returns the class intanc itself and used in chaning if you wan't to run multiple mehtods of same class in chain manner.
  }
  //----------------------------------------------------------------------------------------------------------------------------------------|

  // method for filtering some keyword in query in browser----------------------------------------------------------------------------------|
  filter() {
    const queryCopy = { ...this.queryStr };
    //   Removing some fields for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    // Filter For Price and Rating

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    

    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }


    

    

  //----------------------------------------------------------------------------------------------------------------------------------------|
}
module.exports = ApiFeatures;
