// src/components/Admin/PaymentManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PaymentManagement() {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        async function fetchPayments() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/admin/payments/');
                setPayments(response.data);
            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        }
        fetchPayments();
    }, []);

    const updatePaymentStatus = async (paymentId, status) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/admin/payment/${paymentId}/update-status/`, { status });
            setPayments(payments.map(payment => payment.id === paymentId ? { ...payment, status } : payment));
        } catch (error) {
            console.error('Error updating payment status:', error);
        }
    };

    return (
        <div>
            <h2>Payment Management</h2>
            <table>
                <thead>
                    <tr>
                        <th>Job</th>
                        <th>Care Seeker</th>
                        <th>Caregiver</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map(payment => (
                        <tr key={payment.id}>
                            <td>{payment.job.title}</td>
                            <td>{payment.care_seeker.username}</td>
                            <td>{payment.caregiver.username}</td>
                            <td>${payment.amount}</td>
                            <td>{payment.status}</td>
                            <td>
                                <button onClick={() => updatePaymentStatus(payment.id, 'Completed')}>Mark as Completed</button>
                                <button onClick={() => updatePaymentStatus(payment.id, 'Failed')}>Mark as Failed</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PaymentManagement;
