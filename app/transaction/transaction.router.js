const express = require('express');
// To learn more about the Joi NPM module, see official docs
// https://www.npmjs.com/package/joi
const Joi = require('joi');

const { HTTP_STATUS_CODES } = require('../config.js');
const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const { Transaction, TransactionJoiSchema } = require('./transaction.model.js');

const transactionRouter = express.Router();

// CREATE NEW TRANSACTION
transactionRouter.post('/', jwtPassportMiddleware, (request, response) => {
    // Remember, We can access the request body payload thanks to the express.json() middleware we used in server.js
    const newTransaction = {
        user: request.user.id,
        name: request.body.name,
        type: request.body.type,
        status: request.body.status,
        createDate: Date.now()
    };

    // Step 1: Validate new transaction information is correct.
    // Here, we use the Joi NPM library for easy validation
    // https://www.npmjs.com/package/joi
    const validation = Joi.validate(newTransaction, TransactionJoiSchema);
    if (validation.error) {
    // Step 2A: If validation error is found, end the the request with a server error and error message.
        return response
            .status(HTTP_STATUS_CODES.BAD_REQUEST)
            .json({ error: validation.error });
    }
    // Step 2B: Attempt to create a new transaction using Mongoose.Model.create
    // https://mongoosejs.com/docs/api.html#model_Model.create
    Transaction.create(newTransaction)
        .then(createdTransaction => {
            // Step 3A: Return the correct HTTP status code, and the note correctly formatted via serialization.
            return response
                .status(HTTP_STATUS_CODES.CREATED)
                .json(createdTransaction.serialize());
        })
        .catch(error => {
            // Step 3B: If an error ocurred, return an error HTTP status code and the error in JSON format.
            return response
                .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
                .json(error);
        });
});

// RETRIEVE ALL TRANSACTIONS
transactionRouter.get('/transactions', (request, response) => {
    // Step 1: Attempt to retrieve all transactions using Mongoose.Model.find()
    // https://mongoosejs.com/docs/api.html#model_Model.find
    Transaction.find()
        .populate('user')
        .then(transactions => {
            // Step 2A: Return the correct HTTP status code, and the transactions correctly formatted via serialization.
            return response
                .status(HTTP_STATUS_CODES.OK)
                .json(transactions.map(transaction => transaction.serialize()));
        })
        .catch(error => {
            // Step 2B: If an error ocurred, return an error HTTP status code and the error in JSON format.
            return response
                .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
                .json(error);
        });
});

// RETRIEVE ONE TRANSACTION BY ID
transactionRouter.get('/:transactionid', (request, response) => {
    // Step 1: Attempt to retrieve the transaction using Mongoose.Model.findById()
    // https://mongoosejs.com/docs/api.html#model_Model.findById
    Transaction.findById(request.params.noteid)
        .populate('user')
        .then(transaction => {
            // Step 2A: Return the correct HTTP status code, and the transaction correctly formatted via serialization.
            return response
                .status(HTTP_STATUS_CODES.OK)
                .json(transaction.serialize());
        })
        .catch(error => {
            // Step 2B: If an error ocurred, return an error HTTP status code and the error in JSON format.
            return response
                .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
                .json(error);
        });
});

// UPDATE TRANSACTION BY ID
transactionRouter.put(
    '/:transactionid',
    jwtPassportMiddleware,
    (request, response) => {
        const transactionUpdate = {
            name: request.body.name,
            type: request.body.type
        };
        // Step 1: Validate new transaction information is correct.
        // Here, we use the Joi NPM library for easy validation
        // https://www.npmjs.com/package/joi
        const validation = Joi.validate(transactionUpdate, TransactionJoiSchema);
        if (validation.error) {
            // Step 2A: If validation error is found, end the the request with a server error and error message.
            return response
                .status(HTTP_STATUS_CODES.BAD_REQUEST)
                .json({ error: validation.error });
        }
        // Step 2B: Attempt to find the transaction, and update it using Mongoose.Model.findByIdAndUpdate()
        // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
        Transaction.findByIdAndUpdate(
            request.params.transactionid,
            transactionUpdate
        )
            .then(() => {
                // Step 3A: Since the update was performed but no further data provided,
                // we just end the request with NO_CONTENT status code.
                return response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
            })
            .catch(error => {
                // Step 3B: If an error ocurred, return an error HTTP status code and the error in JSON format.
                return response
                    .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
                    .json(error);
            });
    }
);

// REMOVE TRANSACTION BY ID
transactionRouter.delete(
    '/:transactionid',
    jwtPassportMiddleware,
    (request, response) => {
    // Step 1: Attempt to find the transaction by ID and delete it using Mongoose.Model.findByIdAndDelete()
    // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndDelete
        Transaction.findByIdAndDelete(request.params.transactionid)
            .then(() => {
                // Step 2A: Since the deletion was performed but no further data provided,
                // we just end the request with NO_CONTENT status code.
                return response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
            })
            .catch(error => {
                // Step 2B: If an error ocurred, return an error HTTP status code and the error in JSON format.
                return response
                    .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
                    .json(error);
            });
    }
);

module.exports = { transactionRouter };
