const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name:"dhs4regdw",
    api_key:"857185286267267",
    api_secret:"2T9TyokBESNcX1kOMDnURUkKKTY"
})

const image = "../../public/A.png"


cloudinary.uploader.upload(image, {
    folder: "avatars",
    width: 150,
    crop: "scale",}).then( result =>{
    console.log(result)
}).catch(err =>{
    console.log(err)
})
