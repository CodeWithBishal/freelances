import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';
import '../requests/counter_offer_screen.dart';
import '../../utils/app_toast.dart';
import '../../utils/background_bubble_service.dart';
import '../../widgets/custom_cached_image.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Namaste, Panditji 🙏',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                          fontSize: 20,
                          color: AppColors.textDark,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Welcome back to your dashboard',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: AppColors.textLight,
                        ),
                      ),
                    ],
                  ),
                  CircleAvatar(
                    radius: 20,
                    backgroundImage: CustomCachedImage.provider(
                      'https://i.pravatar.cc/150?img=11',
                    ), // Placeholder avatar
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Online Status Card
              const _OnlineStatusCard(),
              const SizedBox(height: 32),

              // Incoming Requests Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "Incoming Requests",
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.error.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      '2 New',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: AppColors.error,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Request Cards
              const _RequestCard(
                title: 'Satyanarayan Puja',
                time: 'Tomorrow, 10:00 AM',
                price: '₹1,500',
                timer: '04:59',
                distance: '4.2 km away • Koramangala 4th Block',
                user: 'Rahul Sharma • Samagri Required',
              ),
              const SizedBox(height: 16),
              const _RequestCard(
                title: 'Griha Pravesh',
                time: 'Sunday, 08:00 AM',
                price: '₹3,000',
                timer: '12:45',
                distance: '8.5 km away • HSR Layout',
                user: '',
                noUser: true,
                noCounter: true,
              ),
            ],
          ),
        ),
      ),
    );
  }

}

class _OnlineStatusCard extends StatefulWidget {
  const _OnlineStatusCard();

  @override
  State<_OnlineStatusCard> createState() => _OnlineStatusCardState();
}

class _OnlineStatusCardState extends State<_OnlineStatusCard> {
  bool _isOnline = false;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 20,
        vertical: 16,
      ),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.wifi, color: Color(0xFFD4A000)),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _isOnline ? 'Online' : 'Offline',
                  style: Theme.of(context).textTheme.titleMedium
                      ?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: AppColors.textDark,
                      ),
                ),
                const SizedBox(height: 4),
                Text(
                  _isOnline
                      ? 'Ready for bookings'
                      : 'Not accepting bookings',
                  style: Theme.of(context).textTheme.bodyMedium
                      ?.copyWith(color: AppColors.textLight),
                ),
              ],
            ),
          ),
          Switch(
            value: _isOnline,
            onChanged: (val) async {
              final success =
                  await BackgroundBubbleService.toggleOnline(val);
              if (success && mounted) {
                setState(() {
                  _isOnline = val;
                });
              }
            },
            activeThumbColor: AppColors.card,
            activeTrackColor: AppColors.primary,
            inactiveThumbColor: AppColors.textLight,
            inactiveTrackColor: AppColors.border,
          ),
        ],
      ),
    );
  }
}

class _RequestCard extends StatelessWidget {
  final String title;
  final String time;
  final String price;
  final String timer;
  final String distance;
  final String user;
  final bool noCounter;
  final bool noUser;

  const _RequestCard({
    required this.title,
    required this.time,
    required this.price,
    required this.timer,
    required this.distance,
    required this.user,
    this.noCounter = false,
    this.noUser = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border.withValues(alpha: 0.5)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Text(
                  title,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                    color: AppColors.textDark,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                price,
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                  color: AppColors.textDark,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                time,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: AppColors.textDark.withValues(alpha: 0.8),
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                ),
              ),
              Row(
                children: [
                  const Icon(Icons.timer, size: 16, color: AppColors.error),
                  const SizedBox(width: 6),
                  Text(
                    timer,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppColors.error,
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Details
          Row(
            children: [
              const Icon(Icons.location_on, size: 16, color: Color(0xFFBDBDBD)),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  distance,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: AppColors.textDark.withValues(alpha: 0.8),
                    fontSize: 14,
                  ),
                ),
              ),
            ],
          ),
          if (!noUser) ...[
            const SizedBox(height: 12),
            Row(
              children: [
                const Icon(Icons.person, size: 16, color: Color(0xFFBDBDBD)),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    user,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppColors.textDark.withValues(alpha: 0.8),
                      fontSize: 14,
                    ),
                  ),
                ),
              ],
            ),
          ],
          const SizedBox(height: 24),

          // Action Buttons
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () {
                    AppToast.show(
                      context,
                      title: 'Request Declined',
                      description: 'The booking has been rejected.',
                      type: ToastType.error,
                    );
                  },
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    side: BorderSide(
                      color: AppColors.error.withValues(alpha: 0.5),
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text(
                    'Decline',
                    style: TextStyle(color: AppColors.error),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              if (!noCounter) ...[
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const CounterOfferScreen(),
                        ),
                      );
                    },
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      side: BorderSide(
                        color: Colors.orange.withValues(alpha: 0.5),
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      'Counter',
                      style: TextStyle(color: Colors.orange),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
              ],
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    AppToast.show(
                      context,
                      title: 'Booking Accepted!',
                      description:
                          'You can now view this in your Active Bookings.',
                      type: ToastType.success,
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: AppColors.textDark,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    elevation: 0,
                  ),
                  child: const Text(
                    'Accept',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
