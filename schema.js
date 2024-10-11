const Joi = require('joi');

module.exports.ListingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        descroption: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.string().allow("",null)
    }).required()
})