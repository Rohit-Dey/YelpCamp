if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
const campgrounds = require('../controllers/camgrounds')
const {storage} = require("../cloudinary")
const multer = require('multer')
const upload = multer({storage})

router.route('/')
    .get(wrapAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('images'), validateCampground, wrapAsync(campgrounds.createCamp))

router.get('/new',isLoggedIn, campgrounds.newForm)

router.route('/:id')
    .get(wrapAsync(campgrounds.showCamp))
    .put(isLoggedIn, isAuthor, upload.array('images'), validateCampground, wrapAsync(campgrounds.editCamp))
    .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCamp))

router.get('/:id/edit',isLoggedIn, isAuthor, wrapAsync(campgrounds.editForm))



module.exports = router;