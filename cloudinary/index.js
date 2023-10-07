const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// CLOUDINARY CONFIG DETAILS
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CLOUDINARYSTORAGE CONFIG
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: `GymFinder`,
    allowedFormats: ["jpg", "png", "jpeg"],
  },
});

module.exports = {
  cloudinary,
  storage,
};
