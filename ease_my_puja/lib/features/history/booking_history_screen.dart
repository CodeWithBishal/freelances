import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_text_styles.dart';
import '../../core/widgets/common_widgets.dart';

class BookingHistoryScreen extends StatefulWidget {
  const BookingHistoryScreen({super.key});

  @override
  State<BookingHistoryScreen> createState() => _BookingHistoryScreenState();
}

class _BookingHistoryScreenState extends State<BookingHistoryScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tab;

  final _upcoming = [
    _HistoryData(
      puja: 'Satyanarayan Katha',
      pandit: 'Pt. Ramesh Sharma',
      date: '15 Mar 2026',
      time: '9:00 AM',
      price: '₹1,500',
      status: 'assigned',
      emoji: '🪔',
      rating: null,
    ),
  ];

  final _completed = [
    _HistoryData(
      puja: 'Griha Pravesh Puja',
      pandit: 'Pt. Suresh Joshi',
      date: '2 Mar 2026',
      time: '11:00 AM',
      price: '₹2,200',
      status: 'completed',
      emoji: '🏠',
      rating: 4.8,
    ),
    _HistoryData(
      puja: 'Lakshmi Puja',
      pandit: 'Pt. Anil Trivedi',
      date: '18 Feb 2026',
      time: '6:00 PM',
      price: '₹1,000',
      status: 'completed',
      emoji: '🌸',
      rating: 5.0,
    ),
    _HistoryData(
      puja: 'Navgrah Puja',
      pandit: 'Pt. Mohan Das',
      date: '5 Jan 2026',
      time: '7:30 AM',
      price: '₹1,800',
      status: 'completed',
      emoji: '🌙',
      rating: 4.5,
    ),
  ];

  final _cancelled = [
    _HistoryData(
      puja: 'Vivah Puja',
      pandit: 'Not assigned',
      date: '10 Jan 2026',
      time: '10:00 AM',
      price: '₹3,000',
      status: 'cancelled',
      emoji: '💍',
      rating: null,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tab.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
          onPressed: () => context.pop(),
        ),
        title: const Text('Booking History'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(48),
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.card,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.border),
            ),
            child: TabBar(
              controller: _tab,
              tabs: [
                Tab(text: 'Upcoming (${_upcoming.length})'),
                Tab(text: 'Done (${_completed.length})'),
                Tab(text: 'Cancelled (${_cancelled.length})'),
              ],
              indicator: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(10),
              ),
              indicatorSize: TabBarIndicatorSize.tab,
              dividerColor: Colors.transparent,
              labelStyle: AppTextStyles.labelSmall.copyWith(
                fontWeight: FontWeight.w600,
              ),
              unselectedLabelStyle: AppTextStyles.labelSmall,
            ),
          ),
        ),
      ),
      body: TabBarView(
        controller: _tab,
        children: [
          _HistoryList(
            items: _upcoming,
            emptyMessage: 'No upcoming bookings!',
            emptyEmoji: '📅',
          ),
          _HistoryList(
            items: _completed,
            emptyMessage: 'No completed bookings',
            emptyEmoji: '✅',
          ),
          _HistoryList(
            items: _cancelled,
            emptyMessage: 'No cancelled bookings',
            emptyEmoji: '🎉',
          ),
        ],
      ),
    );
  }
}

class _HistoryList extends StatelessWidget {
  final List<_HistoryData> items;
  final String emptyMessage, emptyEmoji;

  const _HistoryList({
    required this.items,
    required this.emptyMessage,
    required this.emptyEmoji,
  });

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(emptyEmoji, style: const TextStyle(fontSize: 48)),
            const SizedBox(height: 12),
            Text(emptyMessage, style: AppTextStyles.h4),
          ],
        ),
      );
    }
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: items.length,
      separatorBuilder: (_, _) => const SizedBox(height: 12),
      itemBuilder: (_, i) => _HistoryCard(data: items[i]),
    );
  }
}

class _HistoryCard extends StatelessWidget {
  final _HistoryData data;

  const _HistoryCard({required this.data});

  Color get _statusColor {
    switch (data.status) {
      case 'assigned':
        return AppColors.statusAssigned;
      case 'completed':
        return AppColors.statusCompleted;
      case 'cancelled':
        return AppColors.statusCancelled;
      default:
        return AppColors.textSecondary;
    }
  }

  String get _statusLabel {
    switch (data.status) {
      case 'assigned':
        return 'Upcoming';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return data.status;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
        boxShadow: AppColors.softShadow,
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    color: AppColors.accent,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Center(
                    child: Text(
                      data.emoji,
                      style: const TextStyle(fontSize: 26),
                    ),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              data.puja,
                              style: AppTextStyles.h4,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          StatusBadge(label: _statusLabel, color: _statusColor),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(data.pandit, style: AppTextStyles.bodySmall),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(
                            Icons.calendar_today_outlined,
                            size: 12,
                            color: AppColors.textHint,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '${data.date} • ${data.time}',
                            style: AppTextStyles.caption,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Footer
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: const BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.vertical(bottom: Radius.circular(18)),
            ),
            child: Row(
              children: [
                Text(data.price, style: AppTextStyles.price),
                const Spacer(),
                if (data.rating != null) ...[
                  RatingRow(rating: data.rating!),
                  const SizedBox(width: 10),
                ],
                if (data.status == 'assigned')
                  GestureDetector(
                    onTap: () => context.push('/home/tracking'),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.primary,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        'Track',
                        style: AppTextStyles.labelSmall.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),
                if (data.status == 'completed')
                  GestureDetector(
                    onTap: () => context.push('/home/create-request'),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.accent,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Text(
                        'Book Again',
                        style: AppTextStyles.labelSmall.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _HistoryData {
  final String puja, pandit, date, time, price, status, emoji;
  final double? rating;

  const _HistoryData({
    required this.puja,
    required this.pandit,
    required this.date,
    required this.time,
    required this.price,
    required this.status,
    required this.emoji,
    this.rating,
  });
}
