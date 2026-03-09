import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_text_styles.dart';
import '../../core/widgets/common_widgets.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedNav = 0;

  final _pujaCategories = [
    ('🪔', 'Satyanarayan\nKatha'),
    ('🏠', 'Griha\nPravesh'),
    ('👶', 'Namkaran\nSamskara'),
    ('💍', 'Vivah\nPuja'),
    ('🌙', 'Navgrah\nPuja'),
    ('🔱', 'Rudrabhishek'),
    ('🌸', 'Lakshmi\nPuja'),
    ('⭐', 'More'),
  ];

  final _upcomingPandits = [
    _PanditData(
      name: 'Pt. Ramesh Sharma',
      specialty: 'Vedic Rituals',
      rating: 4.9,
      reviews: 234,
      distance: '1.2 km',
      price: '₹1,500',
      emoji: '👨‍🦳',
      availableNow: true,
    ),
    _PanditData(
      name: 'Pt. Suresh Joshi',
      specialty: 'South Indian Puja',
      rating: 4.7,
      reviews: 180,
      distance: '2.5 km',
      price: '₹1,200',
      emoji: '👨‍🦱',
      availableNow: true,
    ),
    _PanditData(
      name: 'Pt. Anil Trivedi',
      specialty: 'North Indian Rites',
      rating: 4.8,
      reviews: 312,
      distance: '3.1 km',
      price: '₹2,000',
      emoji: '🧔',
      availableNow: false,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 16),
                    _buildSearchBar(),
                    const SizedBox(height: 20),
                    _buildActiveBanner(),
                    const SizedBox(height: 24),
                    _buildCategorySection(),
                    const SizedBox(height: 24),
                    _buildFeaturedPandits(),
                    const SizedBox(height: 24),
                    _buildFestivalBanner(),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 12),
      decoration: const BoxDecoration(
        color: AppColors.background,
        border: Border(bottom: BorderSide(color: AppColors.border, width: 1)),
      ),
      child: Row(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Namaste 🙏', style: AppTextStyles.bodySmall),
              Text('Rahul Singh', style: AppTextStyles.h3),
            ],
          ),
          const Spacer(),
          // Location chip
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.accent,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.location_on_rounded,
                  size: 14,
                  color: AppColors.secondary,
                ),
                const SizedBox(width: 4),
                Text('Pune, MH', style: AppTextStyles.labelSmall),
                const SizedBox(width: 2),
                const Icon(
                  Icons.keyboard_arrow_down_rounded,
                  size: 14,
                  color: AppColors.textSecondary,
                ),
              ],
            ),
          ),
          const SizedBox(width: 10),
          // Profile
          CircleAvatar(
            radius: 20,
            backgroundColor: AppColors.primary,
            child: Text(
              'R',
              style: AppTextStyles.h4.copyWith(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return GestureDetector(
      onTap: () {},
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
        decoration: BoxDecoration(
          color: AppColors.card,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.border),
          boxShadow: AppColors.softShadow,
        ),
        child: Row(
          children: [
            const Icon(
              Icons.search_rounded,
              color: AppColors.textHint,
              size: 20,
            ),
            const SizedBox(width: 10),
            Text(
              'Search puja type, pandit...',
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textHint,
              ),
            ),
            const Spacer(),
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(
                Icons.tune_rounded,
                size: 16,
                color: AppColors.textPrimary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActiveBanner() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF667eea), Color(0xFF764ba2)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF667eea).withOpacity(0.3),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 3,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white24,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    '🔥 TRENDING',
                    style: AppTextStyles.caption.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Book for Holi Festival',
                  style: AppTextStyles.h3.copyWith(color: Colors.white),
                ),
                const SizedBox(height: 4),
                Text(
                  'Get 20% off on all pujas',
                  style: AppTextStyles.bodySmall.copyWith(
                    color: Colors.white70,
                  ),
                ),
                const SizedBox(height: 12),
                ElevatedButton(
                  onPressed: () => context.push('/home/create-request'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: const Color(0xFF764ba2),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                    elevation: 0,
                  ),
                  child: Text(
                    'Book Now',
                    style: AppTextStyles.labelMedium.copyWith(
                      color: const Color(0xFF764ba2),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const Text('🪔', style: TextStyle(fontSize: 60)),
        ],
      ),
    );
  }

  Widget _buildCategorySection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SectionHeader(
          title: 'Puja Types',
          actionLabel: 'View All',
          onAction: () {},
        ),
        const SizedBox(height: 16),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 4,
            childAspectRatio: 0.85,
            mainAxisSpacing: 12,
            crossAxisSpacing: 8,
          ),
          itemCount: _pujaCategories.length,
          itemBuilder: (_, i) {
            final cat = _pujaCategories[i];
            return GestureDetector(
              onTap: () => context.push('/home/create-request'),
              child: Container(
                decoration: BoxDecoration(
                  color: AppColors.card,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.border),
                  boxShadow: AppColors.softShadow,
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(cat.$1, style: const TextStyle(fontSize: 26)),
                    const SizedBox(height: 6),
                    Text(
                      cat.$2,
                      style: AppTextStyles.caption.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w500,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildFeaturedPandits() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SectionHeader(
          title: 'Pandits Near You',
          actionLabel: 'See All',
          onAction: () {},
        ),
        const SizedBox(height: 14),
        SizedBox(
          height: 200,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: _upcomingPandits.length,
            separatorBuilder: (_, __) => const SizedBox(width: 12),
            itemBuilder: (_, i) {
              final p = _upcomingPandits[i];
              return GestureDetector(
                onTap: () => context.push('/home/pandit-profile'),
                child: _PanditCard(data: p),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildFestivalBanner() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.accent,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          const Text('🌸', style: TextStyle(fontSize: 40)),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Request a Puja Today!', style: AppTextStyles.h4),
                const SizedBox(height: 4),
                Text(
                  'Post your puja request & get bids from nearby pandits in minutes',
                  style: AppTextStyles.bodySmall,
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          GestureDetector(
            onTap: () => context.push('/home/create-request'),
            child: Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.arrow_forward_rounded, size: 18),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomNav() {
    final items = [
      (Icons.home_rounded, 'Home'),
      (Icons.history_rounded, 'History'),
      (Icons.add_circle_outline_rounded, 'Book'),
      (Icons.notifications_outlined, 'Alerts'),
      (Icons.person_outline_rounded, 'Profile'),
    ];

    return Container(
      decoration: const BoxDecoration(
        color: AppColors.card,
        border: Border(top: BorderSide(color: AppColors.border)),
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 12,
            offset: Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          children: List.generate(items.length, (i) {
            final selected = _selectedNav == i;
            return Expanded(
              child: InkWell(
                onTap: () {
                  setState(() => _selectedNav = i);
                  if (i == 1) context.push('/home/history');
                  if (i == 2) context.push('/home/create-request');
                },
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  child: i == 2
                      ? Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 46,
                              height: 46,
                              decoration: BoxDecoration(
                                gradient: AppColors.primaryGradient,
                                shape: BoxShape.circle,
                                boxShadow: AppColors.cardShadow,
                              ),
                              child: const Icon(
                                Icons.add_rounded,
                                color: Colors.white,
                                size: 26,
                              ),
                            ),
                          ],
                        )
                      : Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              items[i].$1,
                              color: selected
                                  ? AppColors.secondary
                                  : AppColors.textHint,
                              size: 24,
                            ),
                            const SizedBox(height: 2),
                            Text(
                              items[i].$2,
                              style: AppTextStyles.caption.copyWith(
                                color: selected
                                    ? AppColors.secondary
                                    : AppColors.textHint,
                                fontWeight: selected
                                    ? FontWeight.w600
                                    : FontWeight.w400,
                              ),
                            ),
                          ],
                        ),
                ),
              ),
            );
          }),
        ),
      ),
    );
  }
}

class _PanditData {
  final String name, specialty, distance, price, emoji;
  final double rating;
  final int reviews;
  final bool availableNow;

  const _PanditData({
    required this.name,
    required this.specialty,
    required this.rating,
    required this.reviews,
    required this.distance,
    required this.price,
    required this.emoji,
    required this.availableNow,
  });
}

class _PanditCard extends StatelessWidget {
  final _PanditData data;

  const _PanditCard({required this.data});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 148,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
        boxShadow: AppColors.softShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: AppColors.accent,
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(data.emoji, style: const TextStyle(fontSize: 22)),
                ),
              ),
              const Spacer(),
              if (data.availableNow)
                Container(
                  width: 10,
                  height: 10,
                  decoration: const BoxDecoration(
                    color: AppColors.success,
                    shape: BoxShape.circle,
                  ),
                ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            data.name,
            style: AppTextStyles.labelMedium,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 3),
          Text(
            data.specialty,
            style: AppTextStyles.caption,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 6),
          RatingRow(rating: data.rating, reviewCount: data.reviews),
          const Spacer(),
          Row(
            children: [
              Text(data.price, style: AppTextStyles.priceSmall),
              const Spacer(),
              Text(data.distance, style: AppTextStyles.caption),
            ],
          ),
        ],
      ),
    );
  }
}
