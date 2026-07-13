"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";


const PRICING_PLANS = {
  monthly: {
    id: "price_monthly_id_from_stripe",
    name: "Summarist Premium Monthly",
    price: 9.99,
    period: "month",
    description: "Perfect for flexible learners.",
    features: [
      "Unlimited access to all summaries",
      "Audio versions of all books",
      "Offline reading mode",
      "Cancel anytime",
    ],
  },
  annually: {
    id: "price_yearly_id_from_stripe",
    name: "Summarist Premium Yearly",
    price: 59.99,
    period: "year",
    description: "Our most popular plan. Save over 50%.",
    trialDays: 7,
    features: [
      "7-day free trial included",
      "Unlimited access to all summaries",
      "Audio versions of all books",
      "Offline reading mode",
      "Priority customer support",
    ],
  },
};

const FAQ_ITEMS = [
  {
    question: "How does the 7-day free trial work?",
    answer: "When you sign up for the annual plan, you won't be charged anything for the first 7 days. You can cancel at any time within the trial period from your account portal, and you won't owe a dime.",
  },
  {
    question: "Can I switch between monthly and annual plans?",
    answer: "Yes! You can easily upgrade or downgrade your active plan at any time through your billing settings dashboard.",
  },
  {
    question: "Is Summarist Premium really refundable?",
    answer: "We offer a 14-day money-back guarantee if you are not fully satisfied with your premium experience outside of your trial window.",
  },
];

export default function ChoosePlanPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually" | string>("annually");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedPlan = PRICING_PLANS[billingCycle as keyof typeof PRICING_PLANS];

  const handleCheckout = async () => {
    setLoading(true);
    try {
      console.log(`Redirecting to checkout for plan: ${selectedPlan.name} (${selectedPlan.id})`);
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sales-container">
      <div className="sales-header">
        <h1 className="sales-title">Get unlimited access to thousands of books</h1>
        <p className="sales-subtitle">
          Turn hours of reading into minutes of clear, actionable insights.
        </p>

        {/* Toggle Switches */}
        <div className="toggle-wrapper">
          <span className={`toggle-label ${billingCycle === "monthly" ? "active" : "inactive"}`}>
            Billed Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")}
            className="toggle-button"
            aria-label="Toggle billing cycle"
          >
            <span className={`toggle-slider ${billingCycle === "annually" ? "shifted" : ""}`} />
          </button>
          <span className={`toggle-label flex-center gap-sm ${billingCycle === "annually" ? "active" : "inactive"}`}>
            Billed Annually
            <span className="badge-saving">Save ~50%</span>
          </span>
        </div>
      </div>

      {/* Hero Active Plan Card Layout */}
      <div className="pricing-card">
        <div className="card-body">
          <div className="card-header-row">
            <div>
              <h2 className="plan-name">{selectedPlan.name}</h2>
              <p className="plan-desc">{selectedPlan.description}</p>
            </div>
            {billingCycle === "annually" && (
              <span className="badge-trial">7 Days Free</span>
            )}
          </div>

          <div className="price-row">
            <span className="price-amount">${selectedPlan.price}</span>
            <span className="price-period">/{selectedPlan.period}</span>
          </div>
          {billingCycle === "annually" && (
            <p className="price-fineprint">
              Renews at ${selectedPlan.price}/year after your free trial ends.
            </p>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="checkout-btn"
          >
            {loading ? "Loading checkout..." : billingCycle === "annually" ? "Start My 7-Day Free Trial" : "Subscribe Now"}
          </button>

          {/* Feature List */}
          <ul className="feature-list">
            {selectedPlan.features.map((feature, idx) => (
              <li key={idx} className="feature-item">
                <svg className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Accordion Block */}
      <div className="faq-container">
        <h3 className="faq-main-title">Frequently Asked Questions</h3>
        <div className="faq-stack">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="faq-item-box">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="faq-trigger"
                >
                  <span>{item.question}</span>
                  <ChevronDown className={`faq-arrow ${isOpen ? "rotated" : ""}`} />
                </button>
                <div className={`faq-collapse ${isOpen ? "open" : ""}`}>
                  <p className="faq-answer">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

