const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => {
    console.log("Database Connected")
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        let random1000 = Math.floor(Math.random() * 1000);
        let price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "63fe395cb6ee37ae6747d9bd",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price,
            geometry : 
            { 
              type : "Point", 
              coordinates : [ cities[random1000].longitude, 
                              cities[random1000].latitude ] 
            },
            description:'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatum minima eaque est officiis obcaecati possimus cum ipsam, aspernatur eos dolore praesentium ipsa accusantium veritatis inventore. Saepe atque ducimus perspiciatis a?',
            images: [
                {
                  url: 'https://res.cloudinary.com/dgwmrmqz1/image/upload/v1679303876/YelpCamp/fya96mv9tcsniv6yl4za.png',
                  filename: 'YelpCamp/fya96mv9tcsniv6yl4za',
                },
                {
                  url: 'https://res.cloudinary.com/dgwmrmqz1/image/upload/v1679303879/YelpCamp/jmbd7imnfk4ihcqdnwa6.png',
                  filename: 'YelpCamp/jmbd7imnfk4ihcqdnwa6',
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});