# AGENT.md
Project: Easy My Puja
Platform: Flutter Android
Backend: Appwrite + Firebase

Purpose:
Easy My Puja is a real-time marketplace platform connecting devotees with nearby verified pandits for pooja services using a bidding system similar to ride-hailing apps.

Users can post a pooja request with an offered price and nearby pandits can accept, decline, or counteroffer.

This is user app, pandit app will be created seperately

The platform supports:
- Real-time bidding
- Location-based matching
- Secure escrow payments
- Pandit verification
- Festival surge pricing
- VIP darshan booking

--------------------------------------------------

Tech Stack

Frontend
Flutter

Backend Services
Appwrite:
- Auth (Phone + Email)
- Database
- Geo queries
- Realtime
- Functions

Firebase:
- FCM notifications
- Crashlytics
- Remote Config
- Analytics

--------------------------------------------------

Architecture Rules

1. UI and Business Logic must be separated.
2. No repository folder.
3. Backend logic must live in:

backend/
  appwrite_client/
  firebase_client/
  appwrite_dart_client/
  services/
  algorithms/

4. Use Appwrite Realtime for:
- bidding updates
- booking status updates

5. Use Firebase FCM for:
- pandit request notifications
- booking updates

--------------------------------------------------

Project Structure

lib/

core/
  constants/
  theme/
  utils/

backend/
  appwrite_client/
  firebase_client/
  appwrite_dart_client/
  services/
  algorithms/

features/

  auth/
    login_screen.dart
    otp_screen.dart

  home/
    home_screen.dart

  booking/
    create_puja_request.dart
    bidding_screen.dart
    pandit_selection_screen.dart

  pandit/
    incoming_requests_screen.dart
    bid_screen.dart
    earnings_dashboard.dart

  wallet/
    wallet_screen.dart

  profile/
    profile_screen.dart

--------------------------------------------------

Core System Modules

Devotee App
- Create Puja Request
- Live Pandit Bidding
- Compare Pandits
- Secure Payment
- Rating System

Pandit App
- Accept Requests
- Counter Offer
- Earnings Dashboard
- Navigation to Devotee

Admin
- Pandit KYC Verification
- Surge Pricing Control
- Dispute Management

--------------------------------------------------

Critical System Principles

1. Requests expire after configurable time (default 600 seconds) using appwrite function so that even if user restarts the app, the requests continues and the function will expire after 600 seconds or until user press the cancel button.
2. Pandits receive requests only within radius (default 5km) radius keeps increasing if booking not accepted till 15km and after 300 seconds.
3. Payments held in escrow using razorpay and transactions stored in appwrite db
4. OTP verification before pooja start
5. All pandits must be Aadhaar verified

# NEARBY PANDIT MATCHING ALGORITHM
Algorithm: findNearbyPandits()

Input:
user_location
radius_km
puja_type

Steps:

1. Geo Query Appwrite

SELECT pandits
WHERE distance < radius_km
AND status = active

2. Filter by specialization

3. Calculate score

score =
rating_weight +
distance_weight +
experience_weight +
availability_weight

4. Sort by score

5. Return top N pandits

6. Send FCM notifications


Suggested Price =
Avg Market Price
+ Distance Fee
+ Festival Surge


# REAL TIME BIDDING SYSTEM
User creates request

↓

Appwrite stores request

↓

Realtime channel

requests.{request_id}.bids

↓

Pandits submit bid

↓

User receives live updates

# FCM 
User posts request

↓

Appwrite function triggered

↓

Nearby pandits fetched

↓

Tokens collected

↓

Firebase FCM fanout

↓

Notifications sent

# ESCROW PAYMENT SYSTEM
User selects pandit

↓

Payment locked in escrow

↓

Pooja starts (OTP verified)

↓

Pooja completes

↓

Payment released to pandit

↓

User rating requested

Complete Feature Modules
Devotee App Features
1. Authentication

Phone number OTP login (Appwrite)
after otp verification ask for first name, last name, and email, save to auth and db

Profile creation after first login

Logout

Session persistence

2. User Profile Management

View profile

Edit name

Add multiple addresses

Preferred language

View ratings received

Account verification status

Wallet balance


3. Location Services

Enable GPS location

Manual location selection

Map based address selection

Save frequently used addresses

Real-time location detection

Distance estimation for pandits

4. Puja Request Creation

User creates a request containing:

Puja type

Date

Time

Location

Special instructions

Estimated duration

Suggested price

Offer your price

Upload optional reference image

Select required materials (optional)

System automatically calculates:

Suggested price

Distance fee

Surge price (if applicable)

5. Smart Price Suggestion

Automatically suggest price using:

Average price for that puja

Distance cost

Festival surge multiplier

Local demand

User can:

Accept suggested price

Increase/decrease offer price

6. Nearby Pandit Matching

System performs:

Geo search (Appwrite spatial query)

Availability filtering

Specialization filtering

Rating prioritization

Distance prioritization

7. Real-Time Pandit Bidding

Pandits receive the request and can:

Accept offered price

Send counteroffer

Decline request

User receives bids in real time via:

Appwrite realtime

UI updates instantly

User sees:

Pandit name

rating

experience

price

ETA

specialization

8. Compare Pandits

User can compare pandits by:

Price

Rating

Experience

Certification

Distance

ETA

Completed poojas

Profile completeness

Sorting options:

Lowest price

Highest rating

Fastest arrival

Most experienced

9. Pandit Profile View

User can view:

Name

Photo

Video introduction

Certifications

Experience years

Specializations

Ratings and reviews

Completed poojas

Languages spoken

10. Booking Confirmation

After selecting a pandit:

Booking summary screen

Price confirmation

Estimated arrival time

Payment method selection

Booking created in database.

11. Real-Time Booking Status

User can see status updates:

Pandit accepted

Pandit en route

Pandit arrived

Pooja started

Pooja completed

12. Live Location Tracking

User can see pandit moving on map.

Uses:

Google Maps

Periodic location updates

13. OTP Verification

Before starting the pooja:

App generates OTP

Pandit enters OTP

Confirms correct identity

If mismatch:

User can reject pandit.

14. Payment System

Payment options:

Prepaid (UPI/Card/Wallet)

COD with wallet security deposit

Partial payment with escrow

Payments held in escrow until completion.

15. Wallet System

Wallet features:

Add money

Refunds

Cashback rewards

Security deposit for COD

Transaction history

16. VIP Darshan Booking

Users can:

Select temple

Choose darshan slot

Upload ID proof

Receive digital ID card

Receive one-time QR code

QR verified at temple.

17. Ratings & Reviews

After completion:

User rates pandit on:

Ritual quality

Punctuality

Behaviour

Knowledge

Optional written review.

18. Booking History

User can see:

Completed bookings

Cancelled bookings

Upcoming bookings

Each booking shows:

Pandit name

Puja type

Price

Date

19. Notifications

User receives push notifications for:

New bid

Booking confirmation

Pandit arrival

Payment confirmation

Festival offers

Using Firebase FCM.

20. Customer Support

Users can:

Raise dispute

Contact support

Request refund

Chat with support

# Pandit Partner App Features (Not Yet Start, just for context)
1. Registration

Pandits register with:

Aadhaar verification

Phone OTP

Upload certificates

Upload photo

Upload video introduction

Admin must approve.

2. Profile Management

Pandit can edit:

Name

Profile photo

Certifications

Experience

Specializations

Service radius

Availability schedule

3. Availability Controls

Pandit can:

Toggle online/offline

Set working hours

Set travel radius

Pause notifications

4. Incoming Puja Requests

Pandits receive notifications containing:

Puja type

Distance

User location

Offered price

Date & time

5. Bidding System

Pandit can:

Accept price

Send counteroffer

Decline request

Response time configurable.

6. Booking Management

Pandit sees:

Upcoming bookings

Active booking

Completed bookings

Booking details include:

location

price

instructions

7. Navigation

Integrated Google Maps navigation.

Pandit can:

Start navigation

Track route

Update arrival status

8. OTP Verification

Pandit enters OTP before starting pooja.

Prevents fraud.

9. Earnings Dashboard

Pandit sees:

Daily earnings

Weekly earnings

Monthly earnings

Total bookings

Average rating

Charts and analytics.

10. Payment Withdrawals

Pandit can:

Withdraw wallet balance

Add bank account

View payment history

11. Ratings System

Pandits can:

View ratings received

Respond to reviews

Report unfair ratings

12. Subscription Plans

Pandits can subscribe to premium plans:

Benefits:

Higher search ranking

Featured listing

Increased visibility

13. Notifications

Pandit receives alerts for:

New request

Bid accepted

Booking reminder

Payment released

# Admin Panel Features (Not Yet Start, just for context)
1. Admin Authentication

Secure login.

Role-based permissions.

2. Pandit Verification

Admin verifies:

Aadhaar

Certificates

Video introduction

Approve or reject profile.

3. User Management

Admin can:

View users

Suspend users

Ban fraudulent accounts

Reset accounts

4. Booking Management

Admin dashboard shows:

Active bookings

Completed bookings

Cancelled bookings

Admin can intervene.

5. Dispute Resolution

Admin handles:

payment disputes

service complaints

refund requests

6. Surge Pricing Control

Admin can configure:

Festival surge multiplier

City based surge

Time based surge

Example:

Navratri
surge = 1.7x
7. Commission Management

Admin sets:

platform commission %

convenience fee

8. Financial Dashboard

Admin views:

total revenue

commissions earned

payouts

active transactions

9. Analytics Dashboard

Admin can see:

bookings per day

popular pujas

active pandits

city performance

10. Content Management

Admin manages:

puja categories

pricing suggestions

help articles

temple list

11. Notification System

Admin can send:

push notifications

promotional campaigns

festival announcements

12. Fraud Detection

Admin monitors:

fake pandits

repeated cancellations

suspicious bidding patterns