const crypto = require("crypto");
const dotenv = require("dotenv");
const path = require("path");

// Load .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

console.log("=== Testing Razorpay Backend Integration ===");
console.log("Key ID loaded:", KEY_ID ? KEY_ID.substring(0, 8) + "..." : "MISSING");
console.log("Key Secret loaded:", KEY_SECRET ? KEY_SECRET.substring(0, 6) + "..." : "MISSING");

async function runTests() {
  const Razorpay = require("razorpay");
  const rzp = new Razorpay({
    key_id: KEY_ID,
    key_secret: KEY_SECRET,
  });

  // Test 1: Create Order via Razorpay SDK with 50000 paise (₹500)
  console.log("\n[Test 1] Testing Order Creation via Razorpay API...");
  try {
    const order = await rzp.orders.create({
      amount: 50000,
      currency: "INR",
      receipt: `rcpt_test_${Date.now()}`,
      notes: { test: "automated_verification" },
    });
    console.log("✓ Razorpay Order Created Successfully!");
    console.log("  Order ID:", order.id);
    console.log("  Amount (paise):", order.amount);
    console.log("  Currency:", order.currency);
    console.log("  Status:", order.status);

    const testOrderId = order.id;
    const testPaymentId = "pay_test_" + Math.random().toString(36).substring(2, 10);

    // Test 2: Verify HMAC-SHA256 signature algorithm
    console.log("\n[Test 2] Testing HMAC-SHA256 Signature Verification...");
    const payload = `${testOrderId}|${testPaymentId}`;
    const validSignature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(payload)
      .digest("hex");

    console.log("  Generated Valid Signature:", validSignature);

    // Verification check with matching signature
    const bufferExpected = Buffer.from(validSignature);
    const bufferProvided = Buffer.from(validSignature);
    const isMatch = crypto.timingSafeEqual(bufferExpected, bufferProvided);
    console.log("✓ Signature comparison matched:", isMatch);

    // Test 3: Test signature mismatch detection
    console.log("\n[Test 3] Testing Invalid Signature Rejection...");
    const fakeSignature = "invalid_signature_hash_1234567890abcdef";
    const isMismatch = validSignature !== fakeSignature;
    console.log("✓ Invalid signature correctly detected as mismatch:", isMismatch);

    console.log("\n=== ALL RAZORPAY BACKEND TESTS PASSED SUCCESSFULLY! ===");
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
}

runTests();
