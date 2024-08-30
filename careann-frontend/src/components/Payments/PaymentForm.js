// src/components/Payments/PaymentForm.js
import React, { useState } from 'react';
import axios from 'axios';

function PaymentForm({ jobId, caregiverId }) {
    const [amount, setAmount] = useState('');
    const [stripeToken, setStripeToken] = useState('');

    const handlePayment = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://your-backend-api-url/api/payments/', {
                job: jobId,
                amount,
                stripe_token: stripeToken,
                caregiver: caregiverId,
            }, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            alert('Payment successful!');
        } catch (error) {
            console.error('Error processing payment', error);
        }
    };

    return (
        <div>
            <h2>Make a Payment</h2>
            <form onSubmit={handlePayment}>
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Stripe Token"
                    value={stripeToken}
                    onChange={(e) => setStripeToken(e.target.value)}
                />
                <button type="submit">Pay</button>
            </form>
        </div>
    );
}

export default PaymentForm;
