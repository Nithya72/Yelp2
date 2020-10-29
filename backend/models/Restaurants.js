const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    RestName: { type: String },
    RestEmailId: { type: String },
    RestPassword: { type: String },
    RestPhoneNo: { type: String },
    Location: { type: String },
    RestTimings: { type: String },
    Cuisine: { type: String },
    Description: { type: String },
    Rating: { type: Number, default: 5.0 },
    NumOfReviews: { type: Number },
    IsCurbPickUp: { type: String },
    IsDineIn: { type: String },
    IsYelpDelivery: { type: String },
    Latitude: { type: String },
    Longitude: { type: String },
    ImageSrc: { type: String, default: 'default' },
    ProfilePic: { type: String, default: 'avatar.jpg' },
    Reviews: [
        {
            Rating: { type: Number },
            Comment: { type: String },
            CustomerId: { type: Number },
            CustomerName: { type: String },
            ReviewDate: { type: Date }
        }
    ],
    Menu: [
        {
            DishName: { type: String },
            DishPrice: { type: Number },
            Cuisine: { type: String },
            DishImg: { type: String, default: 'default1.jpg' },
            DishMainIngd: { type: String },
            DishCategory: { type: String },
            DishDescription: { type: String }
        }
    ]
})

const Restaurants = mongoose.model('restaurants', RestaurantSchema);
module.exports = Restaurants;