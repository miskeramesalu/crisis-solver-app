import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { loadStripe } from "@stripe/stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useChapaPay } from "chapa-inline-hook";
import {
  Client,
  AccountId,
  PrivateKey,
  TransferTransaction,
  Hbar,
} from "@hashgraph/sdk";

const DonationSection = () => {
  // ---------- State ----------
  const [showModal, setShowModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [earnedTokens, setEarnedTokens] = useState(1250);
  const [phoneNumber, setPhoneNumber] = useState(""); // For M-Pesa
  const [chapaAmount, setChapaAmount] = useState(0); // For Chapa hook
  const [chapaError, setChapaError] = useState(null); // For Chapa hook
  const [chapaSuccess, setChapaSuccess] = useState(false); // For Chapa hook
  const [chapaClosed, setChapaClosed] = useState(false); // For Chapa hook

  // ---------- Helper: Show Toast/Alert ----------
  const showToast = (message, type = "info") => {
    // Replace with your preferred toast library (e.g., react-hot-toast)
    alert(message);
  };

  // ---------- Stripe Integration ----------
  const handleStripePayment = async () => {
    setIsProcessing(true);
    try {
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/create-checkout-session`,
        {
          amount: parseFloat(amount),
          currency: "usd",
          success_url: window.location.href + "?success=true",
          cancel_url: window.location.href + "?canceled=true",
        }
      );
      const sessionId = response.data.id;
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Stripe error:", error);
      showToast("Payment failed. Please try again.", "error");
      setIsProcessing(false);
    }
  };

  // ---------- PayPal Integration ----------
  const PayPalButtonComponent = () => (
    <PayPalScriptProvider
      options={{
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "USD",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical", color: "gold" }}
        createOrder={async () => {
          try {
            const response = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/api/paypal/create-order`,
              { amount: parseFloat(amount) }
            );
            return response.data.id;
          } catch (error) {
            console.error("PayPal createOrder error:", error);
            showToast("Failed to create PayPal order. Please try again.", "error");
            return null;
          }
        }}
        onApprove={async (data) => {
          try {
            const response = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/api/paypal/capture-order/${data.orderID}`
            );
            if (response.data.status === "COMPLETED") {
              showToast(`Thank you for your donation of $${amount}!`, "success");
              setShowModal(false);
              setSelectedMethod(null);
              setAmount("");
            }
          } catch (error) {
            console.error("PayPal capture error:", error);
            showToast("Payment capture failed. Please contact support.", "error");
          }
        }}
        onError={(err) => {
          console.error("PayPal error:", err);
          showToast("PayPal encountered an error. Please try again.", "error");
        }}
      />
    </PayPalScriptProvider>
  );

  // ---------- Chapa Integration ----------
  const ChapaPaymentComponent = () => {
    const { error, isPaymentSuccessful, isPaymentFailed, isPaymentClosed } = useChapaPay({
      amount: chapaAmount,
      public_key: import.meta.env.VITE_CHAPA_PUBLIC_KEY,
      classIdName: "chapa-inline-form",
      currency: "ETB",
    });

    React.useEffect(() => {
      if (isPaymentSuccessful) {
        showToast("Chapa payment successful!", "success");
        setChapaSuccess(true);
        setTimeout(() => {
          setShowModal(false);
          setSelectedMethod(null);
          setAmount("");
          setChapaSuccess(false);
        }, 2000);
      }
      if (isPaymentFailed) {
        showToast("Chapa payment failed. Please try again.", "error");
      }
      if (isPaymentClosed) {
        showToast("Payment window was closed.", "info");
        setChapaClosed(true);
      }
      if (error) {
        showToast(error, "error");
        setChapaError(error);
      }
    }, [isPaymentSuccessful, isPaymentFailed, isPaymentClosed, error]);

    return (
      <div>
        <div id="chapa-inline-form"></div>
        {chapaSuccess && <p style={{ color: "green" }}>✅ Payment successful!</p>}
        {chapaError && <p style={{ color: "red" }}>❌ Error: {chapaError}</p>}
      </div>
    );
  };

  // ---------- Hedera HBAR Integration ----------
  const handleHederaPayment = async () => {
    setIsProcessing(true);
    try {
      if (typeof window.hashpack === "undefined") {
        showToast("Please install Hashpack wallet extension first.", "error");
        setIsProcessing(false);
        return;
      }

      // Connect to Hashpack
      const response = await window.hashpack.connect();
      const userAccountId = response.accountIds[0];

      // Convert amount (USD input) to HBAR using current exchange rate
      // In production, fetch real exchange rate from an API
      const hbarAmount = parseFloat(amount) / 5; // Assuming 1 HBAR = $5 USD
      const amountInTinybars = Math.floor(hbarAmount * 100000000);

      // Create transfer transaction
      const transaction = await new TransferTransaction()
        .addHbarTransfer(AccountId.fromString(userAccountId), -amountInTinybars)
        .addHbarTransfer(
          AccountId.fromString(import.meta.env.VITE_HEDERA_TREASURY_ACCOUNT_ID),
          amountInTinybars
        )
        .freezeWithClient(Client.forTestnet());

      // Sign and submit via Hashpack
      const signResponse = await window.hashpack.signTransaction(transaction);
      const submitResponse = await signResponse.submit(Client.forTestnet());

      showToast(
        `✅ Donation of ${hbarAmount.toFixed(2)} HBAR successful! TX: ${submitResponse.transactionId}`,
        "success"
      );
      setShowModal(false);
      setSelectedMethod(null);
      setAmount("");
    } catch (error) {
      console.error("Hedera error:", error);
      showToast("Hedera payment failed. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // ---------- M-Pesa Integration ----------
  const handleMpesaPayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      showToast("Please enter a valid M-Pesa phone number (e.g., 2547XXXXXXXX).", "error");
      return;
    }
    setIsProcessing(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/mpesa/stk-push`, {
        phoneNumber: phoneNumber,
        amount: parseFloat(amount),
        accountReference: "CrisisSolver",
        transactionDesc: "Donation to Crisis Solver",
      });

      if (response.data.success) {
        showToast(
          `STK Push sent to ${phoneNumber}. Please enter your M-Pesa PIN to complete donation.`,
          "info"
        );
        setTimeout(() => {
          setShowModal(false);
          setSelectedMethod(null);
          setAmount("");
          setPhoneNumber("");
        }, 3000);
      } else {
        showToast("M-Pesa payment initiation failed. Please try again.", "error");
      }
    } catch (error) {
      console.error("M-Pesa error:", error);
      showToast("M-Pesa payment failed. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // ---------- Earned Tokens Donation ----------
  const handleEarnedTokensDonation = async () => {
    const tokenAmount = parseFloat(amount);
    if (earnedTokens < tokenAmount) {
      showToast(`You only have ${earnedTokens} tokens. Earn more by using the app!`, "error");
      return;
    }
    setIsProcessing(true);
    try {
      // Deduct tokens from user's account
      // In production, this should call your backend API
      setEarnedTokens(earnedTokens - tokenAmount);

      // Record donation in your database
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/donate-tokens`, {
        amount: tokenAmount,
        cause: "General Crisis Fund",
      });

      showToast(`✅ You donated ${tokenAmount} tokens to support verified crisis causes!`, "success");
      setShowModal(false);
      setSelectedMethod(null);
      setAmount("");
    } catch (error) {
      console.error("Token donation error:", error);
      showToast("Failed to process token donation. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // ---------- Verified Cause Selection ----------
  const handleVerifiedCause = () => {
    // In production, replace with a modal or redirect to a page listing verified NGOs
    window.location.href = "/verified-causes";
  };

  // ---------- Main Handler ----------
  const processDonation = () => {
    if (!selectedMethod) {
      showToast("Please select a donation method.", "error");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      showToast("Please enter a valid donation amount.", "error");
      return;
    }

    switch (selectedMethod) {
      case "credit_card":
        handleStripePayment();
        break;
      case "paypal":
        // PayPal is handled inside the modal with its own component, so just show it
        break;
      case "chapa":
        setChapaAmount(Math.floor(parseFloat(amount) * 100)); // Chapa expects amount in smallest unit (cents)
        break;
      case "hbar":
        handleHederaPayment();
        break;
      case "mpesa":
        handleMpesaPayment();
        break;
      case "earned_tokens":
        handleEarnedTokensDonation();
        break;
      case "verified_cause":
        handleVerifiedCause();
        break;
      default:
        showToast("Invalid payment method.", "error");
    }
  };

  // ---------- Render Method Selection Modal ----------
  const donationMethods = [
    { id: "credit_card", name: "Credit / Debit Card (Stripe)", icon: "💳" },
    { id: "paypal", name: "PayPal", icon: "🅿️" },
    { id: "chapa", name: "Chapa (Ethiopia)", icon: "🇪🇹" },
    { id: "hbar", name: "HBAR (Hedera Cryptocurrency)", icon: "₿" },
    { id: "mpesa", name: "M-Pesa ", icon: "📲" },
    { id: "earned_tokens", name: `Donate Earned Tokens (${earnedTokens} tokens)`, icon: "🎁" },
    { id: "verified_cause", name: "Support a Verified Cause", icon: "✅" },
  ];

  return (
    <>
      <section
        className="py-12 px-6 max-w-5xl mx-auto text-center"
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          margin: "20px auto",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <h2 className="text-3xl font-bold mb-4" style={{ color: "#1e3a8a" }}>
          Support Our Mission
        </h2>
        <p className="text-lg mb-4" style={{ color: "#333" }}>
          Join us in building a world where technology, transparency, and compassion
          come together to solve humanitarian challenges.
        </p>
        <p className="mb-4" style={{ color: "#555" }}>
          More than 307 million people worldwide are affected by hunger, health emergencies,
          poverty, disasters, and displacement. Your support helps Crisis Solver expand
          its platform, empower communities, and connect verified humanitarian causes
          with people who want to make a difference.
        </p>
        <p className="mb-6" style={{ color: "#555" }}>
          Every contribution helps us develop innovative tools, strengthen partnerships,
          improve transparency, and create measurable social impact.
        </p>

        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "12px 30px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
        >
          Donate Now
        </button>

        <p className="mt-6 font-semibold" style={{ color: "#1e3a8a" }}>
          Earn • Support • Heal the World
        </p>
      </section>

      {/* Donation Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "20px",
              maxWidth: "550px",
              width: "90%",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 20px 35px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "1.8rem", marginBottom: "10px", color: "#1e3a8a" }}>
              Choose Your Donation Method
            </h3>
            <p style={{ marginBottom: "20px", color: "#555" }}>
              Every method directly supports verified crisis interventions. 100% transparent.
            </p>

            {/* Amount Input */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
                Amount (USD)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 10, 25, 50"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "1rem",
                }}
              />
            </div>

            {/* Payment Method Options */}
            <div style={{ marginBottom: "25px" }}>
              <label style={{ fontWeight: "bold", display: "block", marginBottom: "12px" }}>
                Select Payment Method
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {donationMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px 16px",
                      border: selectedMethod === method.id ? "2px solid #2563eb" : "1px solid #ddd",
                      borderRadius: "12px",
                      cursor: "pointer",
                      backgroundColor: selectedMethod === method.id ? "#eff6ff" : "#fff",
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: "1.5rem", marginRight: "12px" }}>{method.icon}</span>
                    <span style={{ fontWeight: selectedMethod === method.id ? "bold" : "normal" }}>
                      {method.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Conditional UI for PayPal */}
            {selectedMethod === "paypal" && amount && parseFloat(amount) > 0 && (
              <div style={{ marginTop: "20px" }}>
                <PayPalButtonComponent />
              </div>
            )}

            {/* Conditional UI for Chapa */}
            {selectedMethod === "chapa" && amount && parseFloat(amount) > 0 && (
              <div style={{ marginTop: "20px" }}>
                <ChapaPaymentComponent />
              </div>
            )}

            {/* Conditional UI for M-Pesa Phone Number */}
            {selectedMethod === "mpesa" && (
              <div style={{ marginTop: "20px" }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
                  M-Pesa Phone Number (e.g., 2547XXXXXXXX)
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="254712345678"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                    marginBottom: "15px",
                  }}
                />
              </div>
            )}

            {/* Confirm Donation Button (hidden for PayPal & Chapa as they have their own buttons) */}
            {selectedMethod !== "paypal" && selectedMethod !== "chapa" && (
              <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
                <button
                  onClick={processDonation}
                  disabled={isProcessing}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: isProcessing ? "#9ca3af" : "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: isProcessing ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {isProcessing ? "Processing..." : "Confirm Donation"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "12px 20px",
                    background: "#e5e7eb",
                    color: "#333",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            )}

            <p style={{ fontSize: "12px", marginTop: "20px", color: "#777", textAlign: "center" }}>
              * All transactions are secure and PCI‑compliant where applicable. <br />
              For M-Pesa, an STK push will be sent to your registered Safaricom number. <br />
              For Hedera, you'll need Hashpack wallet installed.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default DonationSection;