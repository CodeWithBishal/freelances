# 🛕 Ease My Puja – Customer App

## Agent Specification (agent.md)

---

# 📌 Overview

Ease My Puja (Customer App) enables devotees to discover, book, negotiate, track, and pay for puja services with verified Pandits.

This document defines the **end-to-end user flow**, **states**, and **system architecture** for the customer app only.

---

# 🎯 User Role

* **Customer / Devotee** – books pujas and manages payments & bookings

---

# 🚀 App Entry Flow

```
Splash
 → Login (Phone OTP)
 → Home
```

---

# 🔐 1. Authentication

### Method:

* Phone OTP (Primary)
* Email (Optional fallback)

### Flow:

```
Enter Phone → Send OTP → Verify OTP → Session Created
```

---

# 🏠 2. Home Screen

### Sections:

* Search bar (search puja types)
* Featured banner (Book a Pandit)
* Explore services (Daily Puja, Marriage, Astrology, etc.)
* Trending Pujas
* Bottom Nav: Home | Bookings | Profile

### Actions:

* Search puja
* Select category
* Click “Book Now” / Add

---

# 🧾 3. Create Puja Request

### Inputs:

* Puja Type
* Date
* Time
* Location (Address)
* Suggested Price (system)
* Offer Your Price (user input)

➡️ CTA: **Continue**

---

# 🔄 4. Live Bidding / Matching

### State: Searching for Pandits

### Displays:

* List of Pandits
* Rating, experience, distance
* Offered price

### Actions:

* Accept a Pandit
* View Profile

---

# 👤 5. Pandit Profile

### Info:

* Name, rating, experience
* Specializations
* Certificates
* Reviews

➡️ CTA: **Book Appointment**

---

# ✅ 6. Booking Confirmation

### Shows:

* Puja Type
* Date & Time
* Assigned Pandit

➡️ CTA: **Go to Tracking**

---

# 📍 7. Live Tracking

### Map View:

* Pandit location
* ETA (e.g., 12 mins)

### Actions:

* Call Pandit

---

# 💳 8. Payment Flow

### Checkout Screen:

* Total Amount

### Payment Methods:

* UPI
* Cards
* Wallets
* Net Banking

➡️ CTA: **Pay**

---

# 🛕 9. Puja Lifecycle

### States:

* Scheduled
* In Progress
* Completed

---

# ⭐ 10. Rating & Review

### After Completion:

* Rate Pandit (stars)
* Write review (optional)

➡️ Submit Review

---

# 📋 11. Booking History

### Tabs:

* Upcoming
* Past

### Actions:

* View Details
* Book Again

---

# 💰 12. Wallet

### Features:

* Add Money
* View Transactions

---

# 👤 13. Profile

### Sections:

* Personal info
* Payment methods
* Settings

---

# 🔄 Complete User Flow

```
Splash
 → Login (OTP)
 → Home

Home
 → Select Puja / Search
 → Create Puja Request
 → Live Bidding
    → View Profile
    → Accept Pandit
 → Booking Confirmation
 → Live Tracking
 → Payment
 → Puja Completed
 → Rating & Review

Bottom Navigation:
 → Home
 → Bookings
 → Profile
```

---

# 🧠 State Machine

```
UNAUTHENTICATED
 → AUTHENTICATED
 → BROWSING
 → REQUEST_CREATED
 → MATCHING
 → CONFIRMED
 → TRACKING
 → IN_PROGRESS
 → COMPLETED
 → REVIEWED
```

---

# 🏗️ Tech Stack (Shared for Customer + Pandit Apps)

## 📱 Frontend (Both Apps)

* Flutter (single codebase with role-based modules OR two separate apps)
* State Management: Riverpod (preferred) / Bloc
* Navigation: GoRouter
* Architecture: Feature-first + Clean Architecture

---

## 🧩 Backend (Common for Both Apps)

### Appwrite (Core Backend)

#### 1. Auth

* Phone OTP (Primary)
* Email/Password (Optional)
* Role stored in user metadata (customer / pandit / mandir)

#### 2. Database (Shared Collections)

* users
* pandits
* mandirs
* puja_requests
* pandit_offers
* bookings
* transactions
* reviews
* availability

#### 3. Geo Queries

* Nearby Pandit discovery (for customer app)
* Distance-based request filtering (for pandit app)

#### 4. Functions

* Matching engine (customer → pandit)
* Booking lifecycle automation
* OTP validation (start + complete puja)
* Payment + payout triggers
* Notification triggers

---

## 🔔 Firebase (Support Services for Both Apps)

### 1. FCM

* Customer app:

  * Offer received
  * Booking confirmed
  * Pandit arrival updates
* Pandit app:

  * New booking requests
  * Counter responses

### 2. Crashlytics

* Error monitoring for both apps

### 3. Remote Config

* Dynamic pricing tweaks
* Feature flags (enable/disable features)

### 4. Analytics

* Funnel tracking (booking conversion)
* Retention tracking
* User behavior insights

---

# 🔄 Booking Lifecycle

```
REQUEST_CREATED
 → MATCHING
 → OFFER_RECEIVED
 → ACCEPTED
 → CONFIRMED
 → TRACKING
 → IN_PROGRESS
 → COMPLETED
 → PAID
 → REVIEWED
```

---

# ⚠️ Edge Cases

* No Pandits found → retry / expand radius(till 10mins)
* Multiple offers → choose best → counter offers
* Payment failure → retry
* Cancellation → before start
* Network issues → retry logic

---

# 🔐 Security

* OTP-based authentication
* Secure payments
* Role-based access

---

# 📈 Future Enhancements

* Real-time chat
* Dynamic pricing
* Subscription offers
* Loyalty rewards

---

# ✅ End of Agent Spec
