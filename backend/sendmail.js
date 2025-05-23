import nodemailer from 'nodemailer';

// Create transporter (using Gmail example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ramprasanth2802@gmail.com',      // Replace with your email
    pass: 'ooia cplx tqdk ppek',         // Use app password (NOT your normal Gmail password)
  },
});

// Sample email template (same as HTML earlier)
const generateOrderEmail = (order) => {
  return `
    <html>
      <body style="font-family: Arial; background-color: #f4f4f4; padding: 20px;">
        <table style="max-width: 600px; background: white; margin: auto; border-radius: 8px; padding: 20px;">
          <tr><td><h2 style="color: #4CAF50;">Thanks for your order!</h2></td></tr>
          <tr><td><p><strong>Order ID:</strong> ${order.id}</p></td></tr>
          <tr><td><p><strong>Product:</strong> ${order.product}</p></td></tr>
          <tr><td><p><strong>Amount:</strong> ₹${order.amount}</p></td></tr>
          <tr><td><p><strong>Payment ID:</strong> ${order.paymentId}</p></td></tr>
          <tr><td><p><strong>Shipping Address:</strong><br />${order.address}</p></td></tr>
          <tr><td style="padding-top: 20px;"><p>If you have questions, contact <a href="mailto:support@ecomapp.com">support@ecomapp.com</a>.</p></td></tr>
        </table>
      </body>
    </html>
  `;
};

// Function to send mail
const sendOrderConfirmation = async (userEmail, order) => {
  try {
    const mailOptions = {
      from: '"E-Commerce App" ramprasanth2802@gmail.com',  // sender address
      to: userEmail,                                     // list of receivers
      subject: 'Your Order is Confirmed!',
      html: generateOrderEmail(order),                   // html body
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (err) {
    console.error('Failed to send email:', err.message);
  }
};

// Sample usage
const order = {
  id: 'ORD123456',
  product: 'Wireless Headphones',
  amount: 2499,
  paymentId: 'RZP_TEST_ABC123',
  address: 'John Doe<br>123 Main Street<br>Chennai, TN 600001',
};

sendOrderConfirmation('ramprasanths.22csd@kongu.edu', order); // Replace with actual user email
