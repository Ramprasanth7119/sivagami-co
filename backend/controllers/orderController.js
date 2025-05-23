import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import nodemailer from "nodemailer";
import twilio from "twilio";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const placeOrder = async (req, res) => {
  const { shippingInfo, orderItems, paymentMethod, user, totalAmount } = req.body;
  try {
    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentMethod,
      user,
      totalAmount,
    });

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item._id, { $inc: { stock: -item.quantity } });
    }

    const mailOptions = {
      from: process.env.GMAIL,
      to: user.email,
      subject: "Order Confirmation",
      html: `
        <h1>Thank you for your order!</h1>
        <p>Your order has been successfully placed.</p>
        <h2>Order Summary:</h2>
        <ul>
          ${orderItems.map(item => `<li>${item.name} - Quantity: ${item.quantity}</li>`).join("")}
        </ul>
        <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
        <p>We will notify you once your order is shipped.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    await twilioClient.messages.create({
      body: `Thank you for your order! Total: ₹${totalAmount}. We will notify you once it's shipped.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: user.phone,
    });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const placeOrderStripe = async (req, res) => {
  const { shippingInfo, orderItems, paymentMethod, user, totalAmount } = req.body;
  try {
    const line_items = orderItems.map(item => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const verifyStripe = async (req, res) => {
  const { shippingInfo, orderItems, paymentMethod, user, totalAmount } = req.body;
  try {
    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentMethod,
      user,
      totalAmount,
    });

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item._id, { $inc: { stock: -item.quantity } });
    }

    const mailOptions = {
      from: process.env.GMAIL,
      to: user.email,
      subject: "Order Confirmation",
      html: `
        <h1>Thank you for your order!</h1>
        <p>Your order has been successfully placed.</p>
        <h2>Order Summary:</h2>
        <ul>
          ${orderItems.map(item => `<li>${item.name} - Quantity: ${item.quantity}</li>`).join("")}
        </ul>
        <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
        <p>We will notify you once your order is shipped.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const placeOrderRazorpay = async (req, res) => {
  const { totalAmount } = req.body;
  try {
    const options = {
      amount: Number(totalAmount * 100),
      currency: "INR",
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const verifyRazorpay = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, shippingInfo, orderItems, paymentMethod, user, totalAmount } = req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    try {
      const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentMethod,
        user,
        totalAmount,
      });

      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item._id, { $inc: { stock: -item.quantity } });
      }

      const mailOptions = {
        from: process.env.GMAIL,
        to: user.email,
        subject: "Order Confirmation",
        html: `
          <h1>Thank you for your order!</h1>
          <p>Your order has been successfully placed.</p>
          <h2>Order Summary:</h2>
          <ul>
            ${orderItems.map(item => `<li>${item.name} - Quantity: ${item.quantity}</li>`).join("")}
          </ul>
          <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
          <p>We will notify you once your order is shipped.</p>
        `,
      };

      await transporter.sendMail(mailOptions);

      await twilioClient.messages.create({
        body: `Thank you for your order! Total: ₹${totalAmount}. We will notify you once it's shipped.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: user.phone,
      });

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.status(400).json({ message: "Payment verification failed" });
  }
};

export const userOrders = async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await Order.find({ user: id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
