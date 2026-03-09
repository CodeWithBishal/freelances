USERS COLLECTION
users

id
name
phone
email
role (devotee/pandit)
rating
total_bookings
wallet_balance
created_at


PANDIT_PROFILE
pandit_profiles
id
user_id (relationship users.id)

aadhar_verified
years_experience
specializations
certificates
video_intro_url

avg_rating
completed_pujas

location_geo
location_lat
location_lng

service_radius_km
profile_status

Use Appwrite Geo Field

location_geo : GeoPoint

Enable spatial index

PUJA_TYPES
puja_types

id
name
base_price
avg_market_price
duration_minutes
PUJA_REQUESTS
puja_requests

id
user_id
puja_type_id

description

offered_price
suggested_price

location_geo
location_lat
location_lng

status
(open / bidding / assigned / completed)

created_at
expires_at

Geo index required.

BIDS
bids

id
request_id
pandit_id

bid_price
bid_type (accept/counter)

arrival_eta_minutes

created_at

Relationships:

request_id -> puja_requests
pandit_id -> users
BOOKINGS
bookings

id
request_id
pandit_id
user_id

final_price

otp_code

status
pending
accepted
started
completed
cancelled

payment_status
escrow
released

created_at
RATINGS
ratings

id
booking_id
from_user
to_user

rating
review
created_at
FESTIVAL_SURGE
festival_surge

id
festival_name
city
start_time
end_time
surge_multiplier

Example:

Ganesh Chaturthi
1.6x surge