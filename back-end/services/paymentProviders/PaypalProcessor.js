const axios = require('axios');
const PaymentProcessor = require('../PaymentProcessor');
const AppError = require('../../utils/appError');

class PaypalProcessor extends PaymentProcessor {
    constructor(order_id, amount, email, items) {
        super(order_id, amount)
        this.email = email
        this.items = items
    }

    async getAccessToken() {
        const response = await axios({
            url: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
            method: 'post',
            data: 'grant_type=client_credentials',
            auth: {
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_SECRET
            }
        })

        return response.data.access_token
    }

    async processPayment() {
        try {
            const accessToken = await this.getAccessToken()

            // Convert items into Paypal format
            const formattedItems = this.items.map(item => ({
                name: item.name,
                description: item.description || "",
                quantity: item.quantity,
                unit_amount: {
                    currency_code: 'USD',
                    value: item.price.toFixed(2)
                }
            }))


            const response = await axios({
                url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                data: JSON.stringify({
                    intent: 'CAPTURE',
                    purchase_units: [
                        {
                            items: formattedItems,
                            amount: {
                                currency_code: 'USD',
                                value: this.amount,
                                breakdown: {
                                    item_total: {
                                        currency_code: 'USD',
                                        value: this.amount
                                    }
                                }
                            }
                        }
                    ],
                    application_context: {
                        return_url: `${process.env.BASE_URL}/payment-success?order_id=${this.order_id}`,
                        cancel_url: `${process.env.BASE_URL}/payment-failed?order_id=${this.order_id}`,
                        shipping_preference: "NO_SHIPPING",
                        user_action: "PAY_NOW",
                        brand_name: process.env.WEBSITE_DOMAIN
                    }

                })
            })
            if (!response.data.id) {
                throw new AppError("Failed to create PayPal order.", 400)
            }

            return {
                status: 'pending',
                redirect_url: response.data.links.find((link) => link.rel === 'approve').href,
                transaction_id: response.data.id,
            }
        } catch (error) {
            throw new AppError("PayPal initialization failed", 400)
        }
    }
}

module.exports = {
    PaypalProcessor,
}