const path = require("path");
const crypto = require("crypto");
const express = require("express");
const Razorpay = require("razorpay");
require("dotenv").config();

const PORT = Number(process.env.PORT || 3000);
const PLAN_AMOUNT_PAISE = 14900;

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  throw new Error("Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in environment.");
}

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

let cachedPlanId = process.env.RAZORPAY_PLAN_ID || null;

async function getOrCreatePlanId() {
  if (cachedPlanId) {
    return cachedPlanId;
  }

  const plan = await razorpay.plans.create({
    period: "monthly",
    interval: 1,
    item: {
      name: "Rapid Math Pro Monthly",
      description: "Unlock all Rapid Math tools",
      amount: PLAN_AMOUNT_PAISE,
      currency: "INR",
    },
    notes: {
      product: "rapid-math-pro",
    },
  });

  cachedPlanId = plan.id;
  return cachedPlanId;
}

app.get("/api/payment/config", (req, res) => {
  res.json({
    keyId,
    amountPaise: PLAN_AMOUNT_PAISE,
    amountDisplay: "Rs 149/month",
    currency: "INR",
  });
});

app.post("/api/subscription/create", async (req, res) => {
  try {
    const planId = await getOrCreatePlanId();
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 120,
      notes: {
        product: "rapid-math-pro",
      },
    });

    res.json({
      subscriptionId: subscription.id,
      status: subscription.status,
    });
  } catch (error) {
    res.status(500).json({
      error: error?.error?.description || error.message || "Failed to create subscription",
    });
  }
});

app.post("/api/subscription/verify", (req, res) => {
  const {
    razorpay_payment_id: paymentId,
    razorpay_subscription_id: subscriptionId,
    razorpay_signature: signature,
  } = req.body || {};

  if (!paymentId || !subscriptionId || !signature) {
    return res.status(400).json({ error: "Missing payment verification fields" });
  }

  const hmac = crypto
    .createHmac("sha256", keySecret)
    .update(`${paymentId}|${subscriptionId}`)
    .digest("hex");

  if (hmac !== signature) {
    return res.status(400).json({ error: "Invalid payment signature", success: false });
  }

  return res.json({ success: true });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Rapid Math app running at http://localhost:${PORT}`);
});
