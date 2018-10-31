const mongoose = require('mongoose');

const Joi = require('joi');

const transactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    name: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String },
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
    listPrice: { type: Number },
    createDate: { type: Date },
    updateDate: { type: Date, default: Date.now }
});

transactionSchema.methods.serialize = function() {
    let user;
    // We serialize the user if it's populated to avoid returning any sensitive information, like the password hash.
    if (typeof this.user.serialize === 'function') {
        user = this.user.serialize();
    } else {
        user = this.user;
    }

    return {
        id: this._id,
        user: user,
        name: this.name,
        type: this.type,
        status: this.status,
        createDate: this.createDate,
        updateDate: this.updateDate
    };
};

// To validate that data used to create a new transaction is valid, we will use "Joi", a NPM library that
// allows you to create "blueprints" or "schemas" to ensure validation of key information. To learn more:
// https://www.npmjs.com/package/joi
const TransactionJoiSchema = Joi.object().keys({
    // To learn more about Joi string validations, see:
    // https://github.com/hapijs/joi/blob/v13.6.0/API.md#string---inherits-from-any
    user: Joi.string().optional(),
    name: Joi.string()
        .min(1)
        .required(),
    status: Joi.string()
        .min(1)
        .required(),
    type: Joi.string()
        .min(1)
        .required(),
    createDate: Joi.date().timestamp()
});

// To learn more about how Mongoose schemas and models are created, see:
// https://mongoosejs.com/docs/guide.html
const Transaction = mongoose.model('transaction', transactionSchema);
// To learn more about Mongoose Models vs Schemas, see:
// https://stackoverflow.com/questions/9127174/why-does-mongoose-have-both-schemas-and-models
module.exports = { Transaction, TransactionJoiSchema };
