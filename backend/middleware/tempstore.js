const path =  require("path")

// Move the file to the desired folder

const localUpload = async (file) => {

    
    const fileExtension = path.extname(file.name);
 const uploadPath = './public/' + file.name; // Include the file extension in the upload path
  file.mv(uploadPath, (err) => {
   if (err) {
    // return res.status(500).json({ success: false , message: err.message});
    console.log("not uploaded")
    
   }

//    return res.status(200).json({ success: true, message: 'File uploaded successfully' });
  console.log("file uploded")

 });
 
}
 

module.exports = localUpload;
