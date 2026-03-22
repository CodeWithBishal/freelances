import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_text_styles.dart';
import '../../core/widgets/common_widgets.dart';

class PanditProfileScreen extends StatefulWidget {
  const PanditProfileScreen({super.key});

  @override
  State<PanditProfileScreen> createState() => _PanditProfileScreenState();
}

class _PanditProfileScreenState extends State<PanditProfileScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tab;

  final _specializations = [
    'Satyanarayan Katha',
    'Griha Pravesh',
    'Vivah Puja',
    'Navgrah Puja',
    'Rudrabhishek',
    'Namkaran',
  ];

  final _reviews = [
    _ReviewData(
      'Sneha P.',
      5.0,
      'Excellent pandit! Very knowledgeable and punctual.',
      '2d ago',
    ),
    _ReviewData(
      'Rohit M.',
      4.5,
      'Great experience. Would definitely book again.',
      '1w ago',
    ),
    _ReviewData(
      'Priya K.',
      5.0,
      'Very professional. Explained each step beautifully.',
      '2w ago',
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
      body: CustomScrollView(
        slivers: [
          // Hero app bar
          SliverAppBar(
            expandedHeight: 260,
            pinned: true,
            backgroundColor: AppColors.background,
            leading: Padding(
              padding: const EdgeInsets.all(8),
              child: CircleAvatar(
                backgroundColor: AppColors.card.withOpacity(0.7),
                child: IconButton(
                  icon: const Icon(
                    Icons.arrow_back_ios_new_rounded,
                    size: 18,
                    color: AppColors.textPrimary,
                  ),
                  onPressed: () => context.pop(),
                ),
              ),
            ),
            actions: [
              Padding(
                padding: const EdgeInsets.all(8),
                child: CircleAvatar(
                  backgroundColor: AppColors.card.withOpacity(0.7),
                  child: IconButton(
                    icon: const Icon(
                      Icons.share_outlined,
                      size: 18,
                      color: AppColors.textPrimary,
                    ),
                    onPressed: () {},
                  ),
                ),
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [AppColors.primary.withOpacity(0.4), AppColors.primary.withOpacity(0.1)],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(height: 60),
                    // Avatar
                    Container(
                      width: 96,
                      height: 96,
                      decoration: BoxDecoration(
                        color: AppColors.accent,
                        shape: BoxShape.circle,
                        border: Border.all(color: AppColors.primary, width: 3),
                        boxShadow: AppColors.cardShadow,
                      ),
                      child: const Center(
                        child: Text('👨‍🦳', style: TextStyle(fontSize: 48)),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text('Pt. Ramesh Sharma', style: AppTextStyles.h2),
                    const SizedBox(height: 4),
                    RatingRow(rating: 4.9, reviewCount: 234),
                    const SizedBox(height: 8),
                    // Badges row
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _Badge('✅ Aadhaar Verified', AppColors.success),
                        const SizedBox(width: 8),
                        _Badge('🏅 15 Years Exp', AppColors.statusBidding),
                        const SizedBox(width: 8),
                        _Badge('🪔 312 Pujas', AppColors.statusAssigned),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),

          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Stats strip
                Container(
                  margin: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 16,
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  decoration: BoxDecoration(
                    color: AppColors.card,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.border),
                    boxShadow: AppColors.softShadow,
                  ),
                  child: Row(
                    children: [
                      _StatItem('₹1,500', 'Starting Price'),
                      _Divider(),
                      _StatItem('12 min', 'Avg. ETA'),
                      _Divider(),
                      _StatItem('4.9 ⭐', 'Rating'),
                      _Divider(),
                      _StatItem('1.2 km', 'Distance'),
                    ],
                  ),
                ),

                // Tab bar
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(
                    color: AppColors.card,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: TabBar(
                    controller: _tab,
                    tabs: const [
                      Tab(text: 'About'),
                      Tab(text: 'Specializations'),
                      Tab(text: 'Reviews'),
                    ],
                    indicator: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    indicatorSize: TabBarIndicatorSize.tab,
                    dividerColor: Colors.transparent,
                  ),
                ),

                SizedBox(
                  height: 320,
                  child: TabBarView(
                    controller: _tab,
                    children: [
                      _AboutTab(),
                      _SpecializationsTab(items: _specializations),
                      _ReviewsTab(reviews: _reviews),
                    ],
                  ),
                ),

                const SizedBox(height: 80),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
        decoration: BoxDecoration(
          color: AppColors.card,
          border: Border(top: BorderSide(color: AppColors.border)),
          boxShadow: [BoxShadow(color: AppColors.textPrimary.withOpacity(0.12), blurRadius: 8)],
        ),
        child: Row(
          children: [
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('₹1,500', style: AppTextStyles.price),
                Text('Suggested price', style: AppTextStyles.caption),
              ],
            ),
            const SizedBox(width: 16),
            Expanded(
              child: PrimaryButton(
                label: '🙏  Book This Pandit',
                onTap: () => context.push('/home/booking-confirmation'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _AboutTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('About', style: AppTextStyles.h3),
          const SizedBox(height: 8),
          Text(
            'Pandit Ramesh Sharma is a highly experienced Vedic scholar with over 15 years of practice. He is well-versed in all major Hindu rituals and can conduct ceremonies in Sanskrit and regional languages.',
            style: AppTextStyles.bodyMedium,
          ),
          const SizedBox(height: 16),
          Text('Languages', style: AppTextStyles.h4),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: [
              'Hindi',
              'Marathi',
              'Sanskrit',
              'English',
            ].map((l) => Chip(label: Text(l))).toList(),
          ),
          const SizedBox(height: 16),
          Text('Certifications', style: AppTextStyles.h4),
          const SizedBox(height: 8),
          ...[
            'Vedic Rituals – Sanskrit College, Varanasi',
            'Jyotish Shastra – Astrology Board of India',
          ].map(
            (c) => Padding(
              padding: const EdgeInsets.only(bottom: 6),
              child: Row(
                children: [
                  const Icon(
                    Icons.verified_rounded,
                    size: 16,
                    color: AppColors.success,
                  ),
                  const SizedBox(width: 6),
                  Expanded(child: Text(c, style: AppTextStyles.bodySmall)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SpecializationsTab extends StatelessWidget {
  final List<String> items;
  const _SpecializationsTab({required this.items});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Wrap(
        spacing: 8,
        runSpacing: 8,
        children: items.map((s) => Chip(label: Text(s))).toList(),
      ),
    );
  }
}

class _ReviewsTab extends StatelessWidget {
  final List<_ReviewData> reviews;
  const _ReviewsTab({required this.reviews});

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: reviews.length,
      separatorBuilder: (_, _) => const SizedBox(height: 10),
      itemBuilder: (_, i) {
        final r = reviews[i];
        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppColors.card,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 16,
                    backgroundColor: AppColors.accent,
                    child: Text(r.name[0], style: AppTextStyles.labelMedium),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(r.name, style: AppTextStyles.labelMedium),
                  ),
                  RatingRow(rating: r.rating),
                  const SizedBox(width: 6),
                  Text(r.date, style: AppTextStyles.caption),
                ],
              ),
              const SizedBox(height: 8),
              Text(r.text, style: AppTextStyles.bodySmall),
            ],
          ),
        );
      },
    );
  }
}

class _ReviewData {
  final String name, text, date;
  final double rating;
  const _ReviewData(this.name, this.rating, this.text, this.date);
}

class _Badge extends StatelessWidget {
  final String label;
  final Color color;
  const _Badge(this.label, this.color);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Text(
        label,
        style: AppTextStyles.caption.copyWith(
          color: color,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String value, label;
  const _StatItem(this.value, this.label);

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        children: [
          Text(value, style: AppTextStyles.h4),
          Text(
            label,
            style: AppTextStyles.caption,
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

class _Divider extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(width: 1, height: 32, color: AppColors.border);
  }
}
