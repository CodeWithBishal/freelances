import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_text_styles.dart';
import '../../core/widgets/common_widgets.dart';

class BiddingScreen extends StatefulWidget {
  const BiddingScreen({super.key});

  @override
  State<BiddingScreen> createState() => _BiddingScreenState();
}

class _BiddingScreenState extends State<BiddingScreen> {
  String _sortBy = 'Price';
  final int _timeLeft = 540; // 9 minutes

  final _sortOptions = ['Price', 'Rating', 'Distance', 'ETA'];

  final _bids = [
    _BidData(
      name: 'Pt. Ramesh Sharma',
      specialty: 'Vedic Rituals',
      rating: 4.9,
      reviews: 234,
      price: 1500,
      eta: 12,
      experience: 15,
      distance: '1.2 km',
      emoji: '👨‍🦳',
      type: BidType.accepted,
      badge: '⭐ Top Rated',
    ),
    _BidData(
      name: 'Pt. Suresh Joshi',
      specialty: 'South Indian Puja',
      rating: 4.7,
      reviews: 180,
      price: 1200,
      eta: 18,
      experience: 10,
      distance: '2.5 km',
      emoji: '👨‍🦱',
      type: BidType.counter,
      badge: '💸 Lowest Price',
    ),
    _BidData(
      name: 'Pt. Anil Trivedi',
      specialty: 'North Indian Rites',
      rating: 4.8,
      reviews: 312,
      price: 1800,
      eta: 8,
      experience: 20,
      distance: '0.8 km',
      emoji: '🧔',
      type: BidType.accepted,
      badge: '⚡ Fastest',
    ),
    _BidData(
      name: 'Pt. Mohan Das',
      specialty: 'Hindu Rituals',
      rating: 4.5,
      reviews: 98,
      price: 950,
      eta: 25,
      experience: 6,
      distance: '4.1 km',
      emoji: '👴',
      type: BidType.counter,
      badge: null,
    ),
  ];

  String _formatTime(int secs) {
    final m = secs ~/ 60;
    final s = secs % 60;
    return '${m.toString().padLeft(2, '0')}:${s.toString().padLeft(2, '0')}';
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
        title: const Text('Live Bidding'),
        actions: [
          TextButton.icon(
            icon: const Icon(
              Icons.cancel_outlined,
              size: 16,
              color: AppColors.error,
            ),
            label: Text(
              'Cancel',
              style: AppTextStyles.labelSmall.copyWith(
                color: AppColors.error,
                fontWeight: FontWeight.w600,
              ),
            ),
            onPressed: () => context.go('/home'),
          ),
        ],
      ),
      body: Column(
        children: [
          // Request summary + timer
          Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: AppColors.primaryGradient,
              borderRadius: BorderRadius.circular(18),
              boxShadow: AppColors.cardShadow,
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '🪔 Satyanarayan Katha',
                        style: AppTextStyles.h4.copyWith(
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Tomorrow • 9:00 AM • Pune',
                        style: AppTextStyles.bodySmall.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Your offer: ₹1,500',
                        style: AppTextStyles.labelMedium,
                      ),
                    ],
                  ),
                ),
                Column(
                  children: [
                    Text('Expires in', style: AppTextStyles.caption),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        _formatTime(_timeLeft),
                        style: AppTextStyles.h3.copyWith(
                          color: _timeLeft < 120
                              ? AppColors.error
                              : AppColors.textPrimary,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Sort row
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                Text(
                  '${_bids.length} bids received',
                  style: AppTextStyles.labelMedium,
                ),
                const Spacer(),
                ...(_sortOptions.map((s) {
                  final sel = _sortBy == s;
                  return GestureDetector(
                    onTap: () => setState(() => _sortBy = s),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      margin: const EdgeInsets.only(left: 6),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 5,
                      ),
                      decoration: BoxDecoration(
                        color: sel ? AppColors.primary : AppColors.card,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: sel ? AppColors.primaryDark : AppColors.border,
                        ),
                      ),
                      child: Text(
                        s,
                        style: AppTextStyles.caption.copyWith(
                          color: AppColors.textPrimary,
                          fontWeight: sel ? FontWeight.w700 : FontWeight.w400,
                        ),
                      ),
                    ),
                  );
                })),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // Bid cards
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _bids.length,
              separatorBuilder: (_, _) => const SizedBox(height: 12),
              itemBuilder: (_, i) => _BidCard(
                data: _bids[i],
                onSelect: () => context.push('/home/pandit-profile'),
              ),
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

enum BidType { accepted, counter }

class _BidData {
  final String name, specialty, distance, emoji;
  final String? badge;
  final double rating;
  final int reviews, price, eta, experience;
  final BidType type;

  const _BidData({
    required this.name,
    required this.specialty,
    required this.rating,
    required this.reviews,
    required this.price,
    required this.eta,
    required this.experience,
    required this.distance,
    required this.emoji,
    required this.type,
    this.badge,
  });
}

class _BidCard extends StatelessWidget {
  final _BidData data;
  final VoidCallback onSelect;

  const _BidCard({required this.data, required this.onSelect});

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
          // Header row
          Padding(
            padding: const EdgeInsets.all(14),
            child: Row(
              children: [
                // Avatar
                Container(
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    color: AppColors.accent,
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.border, width: 2),
                  ),
                  child: Center(
                    child: Text(
                      data.emoji,
                      style: const TextStyle(fontSize: 24),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              data.name,
                              style: AppTextStyles.h4,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          if (data.badge != null)
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 7,
                                vertical: 3,
                              ),
                              decoration: BoxDecoration(
                                color: AppColors.accent,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                data.badge!,
                                style: AppTextStyles.caption.copyWith(
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 3),
                      Text(data.specialty, style: AppTextStyles.bodySmall),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          RatingRow(
                            rating: data.rating,
                            reviewCount: data.reviews,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            '• ${data.experience} yrs exp',
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

          // Stats row
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: const BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(18),
                bottomRight: Radius.circular(18),
              ),
            ),
            child: Row(
              children: [
                // Bid type badge
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: data.type == BidType.accepted
                        ? AppColors.success.withOpacity(0.12)
                        : AppColors.warning.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: data.type == BidType.accepted
                          ? AppColors.success.withOpacity(0.4)
                          : AppColors.warning.withOpacity(0.4),
                    ),
                  ),
                  child: Text(
                    data.type == BidType.accepted ? '✅ Accepted' : '🤝 Counter',
                    style: AppTextStyles.caption.copyWith(
                      color: data.type == BidType.accepted
                          ? AppColors.success
                          : AppColors.warning,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                _StatChip(
                  icon: Icons.access_time_rounded,
                  label: '${data.eta} min',
                ),
                const SizedBox(width: 6),
                _StatChip(
                  icon: Icons.location_on_outlined,
                  label: data.distance,
                ),
                const Spacer(),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text('₹${data.price}', style: AppTextStyles.price),
                    GestureDetector(
                      onTap: onSelect,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.primary,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text('Select', style: AppTextStyles.labelMedium),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _StatChip extends StatelessWidget {
  final IconData icon;
  final String label;
  const _StatChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: AppColors.textSecondary),
          const SizedBox(width: 3),
          Text(
            label,
            style: AppTextStyles.caption.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}
