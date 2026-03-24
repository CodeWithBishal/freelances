import 'package:go_router/go_router.dart';
import '../../features/auth/splash_screen.dart';
import '../../features/onboarding/language_selection_screen.dart';
import '../../features/auth/login_screen.dart';
import '../../features/auth/otp_screen.dart';
import '../../features/auth/profile_screen.dart';
import '../../features/home/home_screen.dart';
import '../../features/home/main_shell.dart';
import '../../features/home/puja_list_screen.dart';
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
      // ── Auth ─────────────────────────────────────────────────────────────
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/language_selection',
        builder: (context, state) => LanguageSelectionScreen(
          isFromProfile: state.uri.queryParameters['isFromProfile'] == 'true',
        ),
      ),
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      GoRoute(
        path: '/otp',
        builder: (context, state) =>
            OtpScreen(phone: state.uri.queryParameters['phone'] ?? ''),
      ),

      // ── Main shell (bottom nav) ───────────────────────────────────────────
      ShellRoute(
        builder: (context, state, child) => MainShell(child: child),
        routes: [
          GoRoute(
            path: '/home',
            builder: (context, state) => const HomeScreen(),
          ),
          GoRoute(
            path: '/home/puja-list',
            builder: (context, state) => const PujaListScreen(),
          ),
          GoRoute(
            path: '/home/history',
            builder: (context, state) => const BookingHistoryScreen(),
          ),
          GoRoute(
            path: '/home/profile',
            builder: (context, state) => const ProfileScreen(),
          ),
        ],
      ),

      // ── Booking flow (full-screen, no shell) ─────────────────────────────
      GoRoute(
        path: '/home/create-request',
        builder: (context, state) => const CreatePujaRequestScreen(),
      ),
      GoRoute(
        path: '/home/bidding',
        builder: (context, state) => const BiddingScreen(),
      ),
      GoRoute(
        path: '/home/pandit-profile',
        builder: (context, state) => const PanditProfileScreen(),
      ),
      GoRoute(
        path: '/home/booking-confirmation',
        builder: (context, state) => const BookingConfirmationScreen(),
      ),
      GoRoute(
        path: '/home/payment',
        builder: (context, state) => const PaymentSelectionScreen(),
      ),
      GoRoute(
        path: '/home/arrival-verification',
        builder: (context, state) => const ArrivalVerificationScreen(),
      ),
      GoRoute(
        path: '/home/tracking',
        builder: (context, state) => const LiveTrackingScreen(),
      ),
    ],
  );
}
