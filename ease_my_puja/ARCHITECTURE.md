# Architecture

Easy My Puja uses a hybrid architecture:

Flutter App
     |
     | API
     |
Appwrite Backend
     |
     | Realtime
     |
Pandit Devices

Firebase FCM
     |
Push Notifications
     |
Pandits receive booking requests

--------------------------------------------------

Main Components

Flutter Client
Handles:
- UI
- business logic
- realtime subscriptions

Appwrite

Used for:
- Authentication
- Database
- Geo queries
- Realtime events
- functions

Firebase

Used for:
- Push notifications
- crash reporting
- remote feature toggles

--------------------------------------------------

Request Flow

User creates puja request

↓
Request stored in Appwrite, fires a function

↓
Geo query fetches nearby pandits

↓
FCM fanout sends notification

↓
Pandits submit bids

↓
Realtime subscription updates user screen