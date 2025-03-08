const ChapaProcessor = require("./paymentProviders/ChapaProcessor");
const { PaypalProcessor } = require("./paymentProviders/PaypalProcessor");
const AppError = require("../utils/appError");
const payment = require("../db/models/payment");

const processPayment = async ({ order_id, payment_method, amount, email, phone, items }) => {
    if (!order_id || !payment_method || !amount || !email) {
        throw new AppError("Missing required fields", 400);
    }

    let PaymentProcessor

    switch (payment_method.toLowerCase()) {
        case 'paypal':
            PaymentProcessor = new PaypalProcessor(order_id, amount, email, items)
            break
        case 'chapa':
            PaymentProcessor = new ChapaProcessor(order_id, amount, user)
            break
        default:
            throw new AppError('Invalid payment method', 400)
    }

    const paymentResponse = await PaymentProcessor.processPayment()

    if (paymentResponse.status !== 'pending') {
        throw new AppError("Payment initialization failed", 400)
    }

    try {
        await payment.create({
            order_id,
            payment_method,
            payment_amount: amount,
            payment_status: "pending",
            transactionId: '',
            email_address: email,
        });
    } catch (error) {
        throw new AppError("Database error while saving payment", 500);
    }

    return {
        success: true,
        redirect_url: paymentResponse.redirect_url
    }
}

module.exports = processPayment