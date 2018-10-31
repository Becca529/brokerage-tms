const mongoose = require('mongoose');

const Joi = require('joi');

const transactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    title: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    purchasePrice: { type: Number },
    listDate: { type: Date },
    effectiveDate: { type: Date },
    expirationDate: { type: Date },
    closingDate: { type: Date },
    comments: { type: String },
    mlsNumber: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    county: { type: String },
    state: { type: String },
    zip: { type: String },
    taxID: { type: String },
    propertyType: { type: String },
    listPrice: { type: Number, required: true },
    createDate: { type: Date },
    updateDate: { type: Date, default: Date.now }
});
