const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: "dgwmrmqz1",
    api_key: 916265592995863,
    api_secret: '2vZfDsb8iPjmVpNat7g_C5LbzOk'
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
})

module.exports = {
    cloudinary,
    storage
}