"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, CreditCard, LogIn, Crown, Mail, ArrowUpRight } from "lucide-react";


// Types for our component state simulation
type SubscriptionStatus = "basic" | "premium" | "premium-plus";

export default function SettingsPage() {
  // Mock states to help you test all the required criteria in isolation
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [subscription, setSubscription] = useState<SubscriptionStatus>("basic");
  const [userEmail] = useState<string>("user@example.com");

  // Helper helper to format badges cleanly
  const getPlanDetails = (status: SubscriptionStatus) => {
    switch (status) {
      case "premium":
        return { label: "Premium", class: "badge--premium" };
      case "premium-plus":
        return { label: "Premium-Plus", class: "badge--premium-plus" };
      default:
        return { label: "Basic", class: "badge--basic" };
    }
  };

  const currentPlan = getPlanDetails(subscription);

  // --- UNAUTHENTICATED STATE ---
  if (!isLoggedIn) {
    return (
      <div className="settings-page">
        <div className="auth-card">
          <div className="auth-card__image-container">
            {/* Login placeholder illustration */}
            <svg className="auth-card__graphic" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="auth-card__title">Log in to view settings</h1>
          <p className="auth-card__subtitle">
            Manage your account preference details, subscription models, and personalized content tools.
          </p>
          <button 
            onClick={() => setIsLoggedIn(true)} 
            className="btn btn--primary btn--icon-layout"
          >
            <LogIn size={18} />
            Login to Your Account
          </button>
        </div>
      </div>
    );
  }

  // --- AUTHENTICATED STATE ---
  return (
    <div className="settings-page">
      {/* State Switcher Tool Bar (Purely for development/demonstration testing) */}
      <div className="dev-tools">
        <span className="dev-tools__label">Simulate account states:</span>
        <button onClick={() => setSubscription("basic")} className={`dev-tools__btn ${subscription === "basic" ? "active" : ""}`}>Basic</button>
        <button onClick={() => setSubscription("premium")} className={`dev-tools__btn ${subscription === "premium" ? "active" : ""}`}>Premium</button>
        <button onClick={() => setSubscription("premium-plus")} className={`dev-tools__btn ${subscription === "premium-plus" ? "active" : ""}`}>Premium-Plus</button>
        <button onClick={() => setIsLoggedIn(false)} className="dev-tools__btn dev-tools__btn--logout">Logout</button>
      </div>

      <div className="settings-container">
        <h1 className="settings-title">Settings</h1>

        {/* Section Block: Settings Profile Data */}
        <section className="settings-section">
          <div className="settings-section__header">
            <User className="settings-section__icon" size={20} />
            <h2 className="settings-section__title">User Profile</h2>
          </div>
          
          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-row__meta">
                <span className="settings-row__label">Email Address</span>
                <span className="settings-row__value flex-align-center">
                  <Mail size={14} className="margin-right-xs" />
                  {userEmail}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section Block: Subscription Framework */}
        <section className="settings-section">
          <div className="settings-section__header">
            <CreditCard className="settings-section__icon" size={20} />
            <h2 className="settings-section__title">Subscription Status</h2>
          </div>

          <div className="settings-card">
            <div className="settings-row settings-row--split">
              <div className="settings-row__meta">
                <span className="settings-row__label">Your Active Plan</span>
                <div className="flex-align-center margin-top-xs">
                  <span className={`badge ${currentPlan.class}`}>
                    {subscription !== "basic" && <Crown size={12} className="margin-right-xs" />}
                    {currentPlan.label}
                  </span>
                </div>
              </div>

              {/* Dynamic Action Trigger conditional logic */}
              {subscription === "basic" ? (
                <Link href="/choose-plan" className="btn btn--upgrade btn--icon-layout">
                  Upgrade to Premium
                  <ArrowUpRight size={16} />
                </Link>
              ) : (
                <button className="btn btn--secondary">
                  Manage Billing
                </button>
              )}
            </div>
            
            {subscription === "basic" && (
              <div className="settings-card__footer">
                <p className="settings-card__footer-text">
                  You are currently using the limited free tier plan. Upgrade to unlock full book summaries, audio playback elements, and offline reading utilities.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}