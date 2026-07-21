// "use client";

// import React, { useState } from "react";
// import { ChevronDown } from "lucide-react";
// // Import your stripe payment helpers based on the tutorial setup
// // import { getCheckoutUrl } from "@/utils/stripePayment";
// // import { initFirebase } from "@/firebase";

// const PRICING_PLANS = {
//   monthly: {
//     id: "price_monthly_id_from_stripe", // Replace with actual Stripe Price ID
//     name: "Summarist Premium Monthly",
//     price: 9.99,
//     period: "month",
//     description: "Perfect for flexible learners.",
//     features: [
//       "Unlimited access to all summaries",
//       "Audio versions of all books",
//       "Offline reading mode",
//       "Cancel anytime",
//     ],
//   },
//   annually: {
//     id: "price_yearly_id_from_stripe", // Replace with actual Stripe Price ID
//     name: "Summarist Premium Yearly",
//     price: 59.99,
//     period: "year",
//     description: "Our most popular plan. Save over 50%.",
//     trialDays: 7,
//     features: [
//       "7-day free trial included",
//       "Unlimited access to all summaries",
//       "Audio versions of all books",
//       "Offline reading mode",
//       "Priority customer support",
//     ],
//   },
// };

// const FAQ_ITEMS = [
//   {
//     question: "How does the 7-day free trial work?",
//     answer: "When you sign up for the annual plan, you won't be charged anything for the first 7 days. You can cancel at any time within the trial period from your account portal, and you won't owe a dime.",
//   },
//   {
//     question: "Can I switch between monthly and annual plans?",
//     answer: "Yes! You can easily upgrade or downgrade your active plan at any time through your billing settings dashboard.",
//   },
//   {
//     question: "Is Summarist Premium really refundable?",
//     answer: "We offer a 14-day money-back guarantee if you are not fully satisfied with your premium experience outside of your trial window.",
//   },
// ];

// export default function ChoosePlanPage() {
//   const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("annually");
//   const [openFaq, setOpenFaq] = useState<number | null>(null);
//   const [loading, setLoading] = useState(false);

//   const selectedPlan = PRICING_PLANS[billingCycle];

//   const handleCheckout = async () => {
//     setLoading(true);
//     try {
//       // Step implementation matching the video tutorial [00:26:35]:
//       // const app = initFirebase();
//       // const checkoutUrl = await getCheckoutUrl(app, selectedPlan.id);
//       // window.location.href = checkoutUrl;
//       console.log(`Redirecting to checkout for plan: ${selectedPlan.name} (${selectedPlan.id})`);
//     } catch (error) {
//       console.error("Checkout failed:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900 font-sans py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto text-center mb-10">
//         <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
//           Get unlimited access to thousands of books
//         </h1>
//         <p className="mt-4 text-xl text-slate-600">
//           Turn hours of reading into minutes of clear, actionable insights.
//         </p>

//         {/* Toggle Switches */}
//         <div className="mt-8 flex justify-center items-center gap-4">
//           <span className={`text-sm font-semibold ${billingCycle === "monthly" ? "text-blue-600" : "text-slate-500"}`}>
//             Billed Monthly
//           </span>
//           <button
//             onClick={() => setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")}
//             className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none"
//             aria-label="Toggle billing cycle"
//           >
//             <span
//               className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                 billingCycle === "annually" ? "translate-x-6" : "translate-x-1"
//               }`}
//             />
//           </button>
//           <span className={`text-sm font-semibold flex items-center gap-1.5 ${billingCycle === "annually" ? "text-blue-600" : "text-slate-500"}`}>
//             Billed Annually
//             <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-bold">
//               Save ~50%
//             </span>
//           </span>
//         </div>
//       </div>

//       {/* Hero Active Plan Card Layout */}
//       <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
//         <div className="p-8">
//           <div className="flex justify-between items-start">
//             <div>
//               <h2 className="text-2xl font-bold">{selectedPlan.name}</h2>
//               <p className="text-slate-500 text-sm mt-1">{selectedPlan.description}</p>
//             </div>
//             {billingCycle === "annually" && (
//               <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
//                 7 Days Free
//               </span>
//             )}
//           </div>

//           <div className="mt-6 flex items-baseline">
//             <span className="text-5xl font-extrabold tracking-tight">
//               ${selectedPlan.price}
//             </span>
//             <span className="ml-1 text-xl font-semibold text-slate-500">
//               /{selectedPlan.period}
//             </span>
//           </div>
//           {billingCycle === "annually" && (
//             <p className="text-xs text-green-600 font-medium mt-1">
//               Renews at ${selectedPlan.price}/year after your free trial ends.
//             </p>
//           )}

//           <button
//             onClick={handleCheckout}
//             disabled={loading}
//             className="mt-8 w-full bg-blue-600 text-white rounded-xl py-3 px-4 font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50"
//           >
//             {loading ? "Loading checkout..." : billingCycle === "annually" ? "Start My 7-Day Free Trial" : "Subscribe Now"}
//           </button>

//           {/* Feature List */}
//           <ul className="mt-8 space-y-4 border-t border-slate-100 pt-6">
//             {selectedPlan.features.map((feature, idx) => (
//               <li key={idx} className="flex items-start text-sm text-slate-600">
//                 <svg className="h-5 w-5 text-blue-500 shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
//                 </svg>
//                 {feature}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* Accordion Block */}
//       <div className="max-w-2xl mx-auto mt-20">
//         <h3 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h3>
//         <div className="space-y-4">
//           {FAQ_ITEMS.map((item, index) => {
//             const isOpen = openFaq === index;
//             return (
//               <div key={index} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
//                 <button
//                   onClick={() => setOpenFaq(isOpen ? null : index)}
//                   className="w-full flex justify-between items-center p-5 font-semibold text-left text-slate-800 hover:bg-slate-50 transition"
//                 >
//                   <span>{item.question}</span>
//                   <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
//                 </button>
//                 <div
//                   className={`transition-all duration-300 ease-in-out overflow-hidden ${
//                     isOpen ? "max-h-40 border-t border-slate-100" : "max-h-0"
//                   }`}
//                 >
//                   <p className="p-5 text-sm text-slate-600 leading-relaxed">{item.answer}</p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }



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