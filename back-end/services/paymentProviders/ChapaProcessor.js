// payment-providers/ChapaProcessor.js
const axios = require("axios");
const PaymentProcessor = require("./PaymentProcessor");
const AppError = require("../../utils/appError");

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

class ChapaProcessor extends PaymentProcessor {
    constructor(order_id, amount, user) {
        super(order_id, amount);
        this.user = user;
    }

    async processPayment() {
        try {
            // 1️⃣ Send request to Chapa to generate payment URL
            const response = await axios.post(
                `${process.env.CHAPA_BASE_URL}v1/transaction/initialize`,
                {
                    amount: this.amount,
                    currency: "ETB",
                    email: this.user.email,
                    first_name: this.user.firstName,
                    last_name: this.user.lastName,
                    phone_number: this.user.phoneNo,
                    tx_ref: `ORDER_${Date.now()}`,
                    callback_url: `${process.env.BASE_URL}/payment-verify`,
                    return_url: `${process.env.BASE_URL}/payment-return`,
                },
                {
                    headers: {
                        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
                        "Content-Type": 'application/json',
                    },
                }
            )

            if (response.data.status !== "success") {
                throw new AppError("Failed to initialize Chapa payment.", 400)
            }

            // Return Chapa checkout URL to redirect user
            return {
                status: "pending",
                redirect_url: response.data.data.checkout_url, // Redirect user here
            }
        } catch (error) {
            throw new AppError(error.response?.data?.message || "Chapa initialization failed", 400);
        }
    }

    async verifyPayment(trx_ref) {
        try {

            const response = await axios.get(
                `${process.env.CHAPA_BASE_URL}v1/transaction/verify/${trx_ref}`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
                    }
                })

            if (response.data.status !== 'success') {
                throw new AppError('Failed to verify Chapa transaction.', 400)
            }

            return response.data.data

        } catch (error) {
            throw new AppError(error.response?.data?.message || "Error verifying Chapa transaction.", 400)
        }
    }

    async
}

module.exports = ChapaProcessor;
