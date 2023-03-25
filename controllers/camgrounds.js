const Campground = require('../models/campground')
const {cloudinary} = require('../cloudinary')
const mapboxToken = "pk.eyJ1Ijoicm9oaXQtZGV5IiwiYSI6ImNsZmh5d3p2dTBpYWwzb3JzaTQ3dDFhdGkifQ._Ty9KNWSgnbmZ53ynnwZDg"
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const geocoder = mbxGeocoding({accessToken: mapboxToken})

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.newForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCamp = async (req, res, next) => {
    const geodata = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const newCampground = new Campground(req.body.campground);
    newCampground.geometry = geodata.body.features[0].geometry
    newCampground.images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }))
    newCampground.author = req.user._id;
    await newCampground.save();
    console.log(newCampground)
    req.flash('success', 'Successfully created a new campground')
    res.redirect(`/campgrounds/${newCampground._id}`)

}

module.exports.showCamp = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: 'author'}
        ).populate('author');
    if(!campground){
        req.flash('error', 'Campground Not Found');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'No campground Found')
        return res.redirect(`/campgrounds`)
    }
    res.render('campgrounds/edit', { campground })
}

module.exports.editCamp = async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground })
    console.log(req.body)
    const imgs = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }))
    campground.images.push(...imgs);
    await campground.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${req.params.id}`)
}

module.exports.deleteCamp = async (req, res) => {

    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds')

}