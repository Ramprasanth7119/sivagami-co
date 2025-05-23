// utils/mailer.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderConfirmationEmail = async (to, orderData) => {
  const { username, orderId, productName, amount, paymentId, address } = orderData;

  const mailOptions = {
    from: `"E-Commerce Store" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Order Confirmation - ${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Thank you for your order, ${username}!</h2>
        <p>Your order has been successfully placed. Here are your order details:</p>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td><strong>Order ID:</strong></td><td>${orderId}</td></tr>
          <tr><td><strong>Product:</strong></td><td>${productName}</td></tr>
          <tr><td><strong>Total:</strong></td><td>₹${amount}</td></tr>
          <tr><td><strong>Payment ID:</strong></td><td>${paymentId}</td></tr>
          <tr><td><strong>Delivery Address:</strong></td><td>${address}</td></tr>
        </table>
        <p style="margin-top: 20px;">We’ll notify you once your order is shipped.</p>
        <p>Need help? Contact us at <a href="mailto:support@yourstore.com">support@yourstore.com</a></p>
        <p style="margin-top: 30px; font-size: 14px; color: #888;">© ${new Date().getFullYear()} E-Commerce Store. All rights reserved.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return { success: true };
  } catch (error) {
    console.error("Email error:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendOrderConfirmationEmail };
