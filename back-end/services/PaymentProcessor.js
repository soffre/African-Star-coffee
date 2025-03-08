const {AppError} = require('../utils/appError')

class PaymentProcessor {
    constructor(order_id, amount){
        if(new.target === PaymentProcessor){
            throw new AppError("Cannot instantiate abstract class PaymentProcessor directly",400)
        }
        this.order_id = order_id
        this.amount = amount
    }

     // Abstract method (must be implemented in subclasses)
    async processPayment() {
        throw new AppError("processPayment() must be implemented in subclasses.", 400);
    }
}

module.exports = PaymentProcessor