// src/components/Forms/PaymentManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PaymentManagement() {
    const [paymentPlan, setPaymentPlan] = useState('');
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [paymentStatus, setPaymentStatus] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        // Fetch payment history on component mount
        const fetchPaymentHistory = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/payments/');
                setPaymentHistory(response.data);
            } catch (error) {
                console.error('Error fetching payment history:', error);
            }
        };

        fetchPaymentHistory();
    }, []);

    const handlePayment = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/payments/', {
                amount: amount,
                payment_plan: paymentPlan,
                stripe_token: 'your_stripe_token_here', // Replace with actual token
            });
            setPaymentStatus('Payment successful');
            setPaymentHistory([...paymentHistory, response.data]);
        } catch (error) {
            setPaymentStatus('Payment failed');
            console.error('Error processing payment:', error);
        }
    };

    return (
        <div>
            <h2>Manage Payments</h2>
            <form onSubmit={handlePayment}>
                <select value={paymentPlan} onChange={(e) => setPaymentPlan(e.target.value)}>
                    <option value="">Select Payment Plan</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button type="submit">Make Payment</button>
            </form>

            <p>{paymentStatus}</p>

            <div>
                <h3>Payment History</h3>
                <ul>
                    {paymentHistory.map((payment) => (
                        <li key={payment.id}>
                            <strong>{payment.created_at}</strong> - {payment.amount} USD - {payment.status}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default PaymentManagement;
