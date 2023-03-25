const express = require('express')
//express routers get seperate params so we use this because id we are 
//referring to belongs to other route in other router
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync');
const reviews = require('../controllers/reviews')
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')

router.post('/', isLoggedIn, validateReview, wrapAsync(reviews.add))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviews.delete))


module.exports = router;