# 🛕 Ease My Puja – Pandit/Captain App

## Agent Specification (agent.md)

---

# 📌 Overview

Ease My Puja is a two-sided marketplace platform connecting **Devotees** with **Pandits (Captains)** and **Mandirs**.

This document defines the **complete user flow, system architecture, and integrations** for the Pandit/Captain app.

---

-> Cache read and write requests in flutter hive and shared preferences

# 🎯 Core Roles

1. **Pandit (Captain)** – accepts bookings and performs pujas
2. **Mandir** – registers temple and manages priests

---

# 🚀 App Entry Flow

```
Language Selection
 → Role Selection
 → Login
 → OTP Verification
 → Onboarding (Pandit / Mandir)
 → Manual Verification
 → Dashboard
```

---

# 🌐 1. Language Selection

* Multi-language support (EN, HI, MR, GU, etc.)
* Stored locally + backend synced

---

# 👤 2. Role Selection

* Pandit (Captain)
* Mandir

---

# 🔐 3. Authentication

### Method:

* Phone Number (Primary)
* Email (Optional fallback)

### Flow:

```
Enter Phone → Send OTP → Verify OTP → Session Created
```

---

# 🧾 4. Onboarding

## 👤 Pandit Onboarding

### Fields:

* Full Name (Aadhaar)
* Phone Number
* Years of Experience
* Primary Specialization
* Languages Known

### CTA:

➡️ **Submit for Manual Verification**

---

## 🛕 Mandir Onboarding

### Fields:

* Temple Name
* Trust Name
* Temple Age
* Senior Priest
* Other Priests

### CTA:

➡️ **Submit for Manual Verification**

---

# 🛡️ 5. Manual Verification System

### States:

* `pending`
* `approved`
* `rejected`

### Flow:

```
Submit → Admin Panel → Review Docs → Approve/Reject
```

### Restrictions:

* No booking access until approved

---

# 🏠 6. Dashboard (Home)

### Components:

* Greeting (Namaste, Panditji 🙏)
* Online / Offline Toggle
* Incoming Booking Requests

---

# 📥 7. Incoming Booking Flow

### Request Data:

* Puja Type
* Price Offered
* Distance
* Time
* Devotee Info

### Actions:

* Accept
* Decline
* Counter Offer

---

# 💸 8. Counter Offer Flow

### Inputs:

* User Offered Price
* Suggested Market Price

### Output:

* Custom Price

```
Submit Counter → Wait for Devotee Response
```

---

# 📍 9. Active Booking

### Details:

* Devotee Info
* Address
* Time
* Price

### Actions:

* Start Navigation

---

# 🔐 10. Puja Start Flow

### OTP-based Start:

* Pandit enters OTP from Devotee

➡️ Starts Puja Timer

---

# 🛕 11. Puja In Progress

### Displays:

* Puja Name
* Time Elapsed
* Expected Duration

### Utilities:

* Mantra Guide
* Samagri Tracker

---

# ✅ 12. Puja Completion Flow

### OTP-based Completion:

* Enter OTP from Devotee

➡️ Booking marked completed

---

# 💳 13. Wallet & Payments

### Features:

* Balance
* Withdraw
* Transactions
* Next Payout Date

---

# 📊 14. Earnings & Analytics

### Metrics:

* Daily / Weekly / Monthly Earnings
* Total Bookings
* Ratings
* Trends Graph

---

# 📋 15. Bookings

### Tabs:

* Upcoming
* Past

---

# 👤 16. Profile & Settings

### Sections:

* Update Profile
* My Documents
* Availability
* Wallet
* Logout

---

# 🧠 State Machine (Critical)

```
UNAUTHENTICATED
 → AUTHENTICATED
 → ONBOARDING
 → VERIFICATION_PENDING
 → APPROVED
 → ONLINE/OFFLINE
 → BOOKING_FLOW
```

---

# 🏗️ Tech Stack

## 📱 Frontend

* Flutter (Primary framework)
* State Management: Riverpod / Bloc (recommended)

---

## 🧩 Backend

### Appwrite (Core Backend)

#### 1. Auth

* Phone OTP (Primary)
* Email/Password (Optional)

#### 2. Database

Collections:

* users
* pandits
* mandirs
* bookings
* transactions
* reviews

#### 3. Geo Queries

* Nearby booking matching
* Radius-based search (Pandit discovery)

#### 4. Functions

* Booking lifecycle automation
* Payment handling hooks
* OTP verification logic
* Notification triggers

---

## 🔔 Firebase (Support Services)

### 1. FCM

* Booking requests
* Counter responses
* Status updates

### 2. Crashlytics

* Error tracking

### 3. Remote Config

* Feature flags
* Pricing tweaks
* A/B testing

### 4. Analytics

* Funnel tracking
* Retention
* Conversion metrics

---

# 🔄 Booking Lifecycle (Important)

```
REQUESTED
 → ACCEPTED / DECLINED / COUNTERED
 → CONFIRMED
 → STARTED (OTP)
 → IN_PROGRESS
 → COMPLETED (OTP)
 → PAID
```

---

# ⚠️ Edge Cases

* No response timeout → auto-expire request
* Counter loops → max retry limit
* OTP mismatch → retry logic
* Cancellation flow (future scope)
* Offline mode → no requests

---

# 🔐 Security

* OTP verification (start + complete)
* Role-based access control
* Secure payout system
* Data validation (Aadhaar/name consistency)

---

# 📈 Future Enhancements

* Live tracking (map integration)
* AI-based price suggestions
* Auto-matching engine
* Subscription plans (Pro upgrade)
* Ratings & review system expansion

---

# 🧩 Summary

This app follows a **real-time marketplace model** similar to ride-hailing and service platforms.

Key differentiators:

* Negotiation (Counter Offer)
* OTP-based trust system
* Religious workflow integration

---

# ✅ End of Agent Spec
