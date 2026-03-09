import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../features/auth/splash_screen.dart';
import '../../features/auth/login_screen.dart';
import '../../features/auth/otp_screen.dart';
import '../../features/home/home_screen.dart';
import '../../features/booking/create_puja_request_screen.dart';
import '../../features/booking/bidding_screen.dart';
import '../../features/pandit/pandit_profile_screen.dart';
import '../../features/booking/booking_confirmation_screen.dart';
import '../../features/booking/payment_selection_screen.dart';
import '../../features/booking/arrival_verification_screen.dart';
import '../../features/tracking/live_tracking_screen.dart';
import '../../features/history/booking_history_screen.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/splash',
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      GoRoute(
        path: '/otp',
        builder: (context, state) =>
            OtpScreen(phone: state.uri.queryParameters['phone'] ?? ''),
      ),
      GoRoute(
        path: '/home',
        builder: (context, state) => const HomeScreen(),
        routes: [
          GoRoute(
            path: 'create-request',
            builder: (context, state) => const CreatePujaRequestScreen(),
          ),
          GoRoute(
            path: 'bidding',
            builder: (context, state) => const BiddingScreen(),
          ),
          GoRoute(
            path: 'pandit-profile',
            builder: (context, state) => const PanditProfileScreen(),
          ),
          GoRoute(
            path: 'booking-confirmation',
            builder: (context, state) => const BookingConfirmationScreen(),
          ),
          GoRoute(
            path: 'payment',
            builder: (context, state) => const PaymentSelectionScreen(),
          ),
          GoRoute(
            path: 'arrival-verification',
            builder: (context, state) => const ArrivalVerificationScreen(),
          ),
          GoRoute(
            path: 'tracking',
            builder: (context, state) => const LiveTrackingScreen(),
          ),
          GoRoute(
            path: 'history',
            builder: (context, state) => const BookingHistoryScreen(),
          ),
        ],
      ),
    ],
  );
}
