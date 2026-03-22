import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_text_styles.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedNav = 0;
  final PageController _heroPageCtrl = PageController();
  int _heroPage = 0;
  bool _isOnlinePuja = false; // false = Offline, true = Online

  @override
  void dispose() {
    _heroPageCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(),
              _buildModeSelector(),
              _buildSearchBar(),
              _buildHeroBanner(),
              _buildQuickActions(),
              _buildSectionLabel('Popular Services'),
              _buildServicesGrid(),
              _buildSectionLabel('Trending Poojas', actionLabel: 'See All'),
              _buildTrendingPoojas(),
              _buildPromoBanner(),
              _buildSectionLabel('Trusted Pandits', actionLabel: 'View All'),
              _buildPanditList(),
              _buildSectionLabel('VIP Temple Darshan'),
              _buildVipDarshanSlider(),
              _buildSectionLabel('EMP Remedies'),
              _buildRemediesRow(),
              _buildSectionLabel('EMP Store', actionLabel: 'Shop All'),
              _buildStoreList(),
              _buildTestimonialBanner(),
              _buildTrustRow(),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  // ─── Header (scrolls with content) ──────────────────────────────────────────
  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 16, 16, 16),
      decoration: BoxDecoration(
        color: AppColors.background,
        border: const Border(bottom: BorderSide(color: AppColors.border, width: 0.8)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // App icon
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              gradient: AppColors.primaryGradient,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Center(
              child: Text('ॐ', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
            ),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Namaste 🙏',
                style: AppTextStyles.caption.copyWith(
                  color: AppColors.textSecondary,
                  fontWeight: FontWeight.w600,
                ),
              ),
              Text(
                'Rahul Singh',
                style: AppTextStyles.h4.copyWith(fontSize: 16),
              ),
            ],
          ),
          const Spacer(),
          // Location chip
          GestureDetector(
            onTap: () {},
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.12),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.primary.withOpacity(0.3)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.location_on_rounded, size: 13, color: AppColors.secondary),
                  const SizedBox(width: 4),
                  Text(
                    'Pune, MH',
                    style: AppTextStyles.caption.copyWith(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(width: 2),
                  const Icon(Icons.keyboard_arrow_down_rounded, size: 14, color: AppColors.textSecondary),
                ],
              ),
            ),
          ),
          const SizedBox(width: 8),
          // Notification bell
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.notifications_outlined, color: AppColors.textPrimary, size: 24),
                onPressed: () {},
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(minWidth: 36, minHeight: 36),
              ),
              Positioned(
                top: 4,
                right: 4,
                child: Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    color: AppColors.secondary,
                    shape: BoxShape.circle,
                  ),
                ),
              ),
            ],
          ),
          // Avatar
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: AppColors.accent,
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.primaryDark, width: 2),
            ),
            child: Center(
              child: Text(
                'R',
                style: AppTextStyles.h4.copyWith(color: AppColors.secondary, fontSize: 16),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ─── Online / Offline Mode Selector ──────────────────────────────────────────
  Widget _buildModeSelector() {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
        boxShadow: AppColors.softShadow,
      ),
      child: Row(
        children: [
          _ModeTab(
            icon: '📍',
            label: 'Offline Puja',
            sublabel: 'Pandit at home',
            selected: !_isOnlinePuja,
            onTap: () => setState(() => _isOnlinePuja = false),
            activeColor: AppColors.primary,
            activeBg: AppColors.primary,
          ),
          _ModeTab(
            icon: '💻',
            label: 'Online Puja',
            sublabel: 'Live video rituals',
            selected: _isOnlinePuja,
            onTap: () => setState(() => _isOnlinePuja = true),
            activeColor: AppColors.secondary,
            activeBg: AppColors.secondary,
          ),
        ],
      ),
    );
  }

  // ─── Search ──────────────────────────────────────────────────────────────────
  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      child: GestureDetector(
        onTap: () {},
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          decoration: BoxDecoration(
            color: AppColors.card,
            borderRadius: BorderRadius.circular(16),
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
                'Search puja, pandit, ritual...',
                style: AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.textHint,
                ),
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.all(7),
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(10),
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
      ),
    );
  }

  // ─── Hero Banner ─────────────────────────────────────────────────────────────
  Widget _buildHeroBanner() {
    final slides = [
      _HeroSlide(
        emoji: '🪔',
        title: 'Book a Pandit\nInstantly',
        subtitle: 'Verified pandits near you',
        ctaLabel: 'Book Now',
        gradient: const LinearGradient(
          colors: [Color(0xFFF8CB46), Color(0xFFFFAA00)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      _HeroSlide(
        emoji: '🛕',
        title: 'VIP Temple\nDarshan',
        subtitle: 'Fast entry pass & QR',
        ctaLabel: 'Book Darshan',
        gradient: const LinearGradient(
          colors: [Color(0xFF0C831F), Color(0xFF0A6618)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      _HeroSlide(
        emoji: '🎊',
        title: 'Festival Special\nPoojas',
        subtitle: 'Exclusive packages',
        ctaLabel: 'Explore',
        gradient: const LinearGradient(
          colors: [Color(0xFFE23744), Color(0xFFC02030)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
    ];

    return Column(
      children: [
        const SizedBox(height: 16),
        SizedBox(
          height: 172,
          child: PageView.builder(
            controller: _heroPageCtrl,
            itemCount: slides.length,
            onPageChanged: (i) => setState(() => _heroPage = i),
            itemBuilder: (_, i) {
              final s = slides[i];
              return Container(
                margin: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  gradient: s.gradient,
                  borderRadius: BorderRadius.circular(22),
                  boxShadow: AppColors.cardShadow,
                ),
                child: Stack(
                  children: [
                    // Decorative circle
                    Positioned(
                      right: -20,
                      top: -20,
                      child: Container(
                        width: 140,
                        height: 140,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.card.withOpacity(0.08),
                        ),
                      ),
                    ),
                    Positioned(
                      right: 20,
                      top: 10,
                      child: Container(
                        width: 90,
                        height: 90,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.card.withOpacity(0.1),
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.fromLTRB(20, 20, 100, 20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            s.title,
                            style: AppTextStyles.h2.copyWith(
                              color: AppColors.card,
                              height: 1.2,
                              fontSize: 22,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            s.subtitle,
                            style: AppTextStyles.bodySmall.copyWith(
                              color: AppColors.card.withOpacity(0.85),
                            ),
                          ),
                          const SizedBox(height: 14),
                          GestureDetector(
                            onTap: () => context.push('/home/create-request'),
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 8,
                              ),
                              decoration: BoxDecoration(
                                color: AppColors.card,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Text(
                                s.ctaLabel,
                                style: AppTextStyles.labelSmall.copyWith(
                                  color: AppColors.textPrimary,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    Positioned(
                      right: 16,
                      bottom: 16,
                      child: Text(s.emoji, style: const TextStyle(fontSize: 62)),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 10),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(slides.length, (i) {
            final active = i == _heroPage;
            return AnimatedContainer(
              duration: const Duration(milliseconds: 250),
              margin: const EdgeInsets.symmetric(horizontal: 3),
              width: active ? 20 : 6,
              height: 6,
              decoration: BoxDecoration(
                color: active ? AppColors.primary : AppColors.border,
                borderRadius: BorderRadius.circular(3),
              ),
            );
          }),
        ),
      ],
    );
  }

  // ─── Quick Actions ────────────────────────────────────────────────────────────
  Widget _buildQuickActions() {
    final actions = [
      _QuickAction('🪔', 'Book\nPandit', AppColors.primary.withOpacity(0.12), AppColors.primary),
      _QuickAction('🛕', 'Darshan\nPass', AppColors.success.withOpacity(0.12), AppColors.success),
      _QuickAction('📦', 'Puja\nKit', AppColors.secondary.withOpacity(0.1), AppColors.secondary),
      _QuickAction('🔮', 'Astro\nChat', AppColors.statusAssigned.withOpacity(0.12), AppColors.statusAssigned),
    ];

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 0),
      child: Row(
        children: actions.map((a) {
          return Expanded(
            child: GestureDetector(
              onTap: () => context.push('/home/create-request'),
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 4),
                padding: const EdgeInsets.symmetric(vertical: 14),
                decoration: BoxDecoration(
                  color: a.bgColor,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: a.accentColor.withOpacity(0.2)),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(a.emoji, style: const TextStyle(fontSize: 26)),
                    const SizedBox(height: 6),
                    Text(
                      a.label,
                      textAlign: TextAlign.center,
                      style: AppTextStyles.caption.copyWith(
                        color: a.accentColor,
                        fontWeight: FontWeight.w700,
                        fontSize: 10.5,
                        height: 1.4,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  // ─── Section Label ────────────────────────────────────────────────────────────
  Widget _buildSectionLabel(String title, {String? actionLabel}) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 24, 16, 12),
      child: Row(
        children: [
          Container(
            width: 4,
            height: 18,
            decoration: BoxDecoration(
              color: AppColors.secondary,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(width: 10),
          Text(title, style: AppTextStyles.h4),
          const Spacer(),
          if (actionLabel != null)
            GestureDetector(
              onTap: () {},
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  actionLabel,
                  style: AppTextStyles.caption.copyWith(
                    color: AppColors.textPrimary,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  // ─── Services Grid ────────────────────────────────────────────────────────────
  Widget _buildServicesGrid() {
    final services = [
      ('🪔', 'Satyanarayan', AppColors.primary.withOpacity(0.1)),
      ('🏠', 'Griha Pravesh', AppColors.success.withOpacity(0.1)),
      ('💍', 'Vivah Puja', AppColors.secondary.withOpacity(0.1)),
      ('💻', 'Online Pooja', AppColors.info.withOpacity(0.1)),
      ('🌙', 'Navgrah Puja', AppColors.statusAssigned.withOpacity(0.1)),
      ('🔱', 'Rudrabhishek', AppColors.warning.withOpacity(0.1)),
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3,
          childAspectRatio: 0.88,
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
        ),
        itemCount: services.length,
        itemBuilder: (_, i) {
          final svc = services[i];
          return GestureDetector(
            onTap: () => context.push('/home/create-request'),
            child: Container(
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.border),
                boxShadow: AppColors.softShadow,
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 52,
                    height: 52,
                    decoration: BoxDecoration(
                      color: svc.$3,
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Text(svc.$1, style: const TextStyle(fontSize: 26)),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    svc.$2,
                    style: AppTextStyles.caption.copyWith(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.w600,
                      fontSize: 11,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  // ─── Trending Poojas ──────────────────────────────────────────────────────────
  Widget _buildTrendingPoojas() {
    final poojas = [
      ('🌹', 'Navgrah Shanti', '₹2,100 - ₹5,100', true),
      ('🪔', 'Satyanarayan', '₹1,500 - ₹3,000', false),
      ('🌸', 'Lakshmi Puja', '₹800 - ₹2,500', false),
    ];

    return SizedBox(
      height: 184,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        scrollDirection: Axis.horizontal,
        itemCount: poojas.length,
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemBuilder: (_, i) {
          final p = poojas[i];
          return GestureDetector(
            onTap: () => context.push('/home/create-request'),
            child: Container(
              width: 155,
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.border),
                boxShadow: AppColors.softShadow,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Stack(
                    children: [
                      Container(
                        height: 100,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              AppColors.primary.withOpacity(0.2),
                              AppColors.primary.withOpacity(0.05),
                            ],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: const BorderRadius.vertical(
                            top: Radius.circular(17),
                          ),
                        ),
                        child: Center(
                          child: Text(p.$1, style: const TextStyle(fontSize: 44)),
                        ),
                      ),
                      if (p.$4)
                        Positioned(
                          top: 8,
                          right: 8,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 7,
                              vertical: 3,
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.secondary,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              '🔥 Popular',
                              style: AppTextStyles.caption.copyWith(
                                color: AppColors.card,
                                fontSize: 9,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                  Padding(
                    padding: const EdgeInsets.all(10),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          p.$2,
                          style: AppTextStyles.labelMedium.copyWith(fontSize: 13),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          p.$3,
                          style: AppTextStyles.caption.copyWith(
                            color: AppColors.secondary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  // ─── Promo Banner ──────────────────────────────────────────────────────────────
  Widget _buildPromoBanner() {
    return GestureDetector(
      onTap: () => context.push('/home/create-request'),
      child: Container(
        margin: const EdgeInsets.fromLTRB(16, 24, 16, 0),
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFF0C831F), Color(0xFF0A6618)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: AppColors.success.withOpacity(0.3),
              blurRadius: 16,
              offset: const Offset(0, 6),
            )
          ],
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      'LIMITED OFFER',
                      style: AppTextStyles.caption.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w800,
                        fontSize: 9,
                        letterSpacing: 0.8,
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'First Puja 20% OFF',
                    style: AppTextStyles.h3.copyWith(color: AppColors.card),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Use code PUJA20 at checkout',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.card.withOpacity(0.8),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                    decoration: BoxDecoration(
                      color: AppColors.card,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      'Book Now →',
                      style: AppTextStyles.labelSmall.copyWith(
                        color: AppColors.success,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const Text('🌸', style: TextStyle(fontSize: 68)),
          ],
        ),
      ),
    );
  }

  // ─── Pandit List ────────────────────────────────────────────────────────────────
  Widget _buildPanditList() {
    final pandits = [
      _PanditData('Pt. Ramesh Sharma', 'Vedic Rituals', '⭐ 4.9', '15 yrs', '1.2 km', '👨‍🦳'),
      _PanditData('Pt. Suresh Joshi', 'South Indian', '⭐ 4.7', '10 yrs', '2.5 km', '👨‍🦱'),
      _PanditData('Pt. Anil Trivedi', 'North Indian', '⭐ 4.8', '20 yrs', '0.8 km', '🧔'),
    ];

    return SizedBox(
      height: 140,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        scrollDirection: Axis.horizontal,
        itemCount: pandits.length,
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemBuilder: (_, i) {
          final p = pandits[i];
          return GestureDetector(
            onTap: () => context.push('/home/pandit-profile'),
            child: Container(
              width: 220,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.border),
                boxShadow: AppColors.softShadow,
              ),
              child: Row(
                children: [
                  Container(
                    width: 52,
                    height: 52,
                    decoration: BoxDecoration(
                      color: AppColors.accent,
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.primaryDark, width: 2),
                    ),
                    child: Center(
                      child: Text(p.emoji, style: const TextStyle(fontSize: 24)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          p.name,
                          style: AppTextStyles.labelMedium.copyWith(fontSize: 13),
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 2),
                        Text(p.specialty, style: AppTextStyles.caption),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            _Chip(p.rating, AppColors.primary),
                            const SizedBox(width: 4),
                            _Chip(p.distance, AppColors.background),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  // ─── VIP Darshan ────────────────────────────────────────────────────────────────
  Widget _buildVipDarshanSlider() {
    final temples = [
      ('Kashi Vishwanath', 'Varanasi, UP'),
      ('Tirupati Balaji', 'Andhra Pradesh'),
      ('Shirdi Sai Baba', 'Maharashtra'),
      ('Golden Temple', 'Punjab'),
    ];

    return SizedBox(
      height: 130,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        scrollDirection: Axis.horizontal,
        itemCount: temples.length,
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemBuilder: (_, i) {
          final t = temples[i];
          return GestureDetector(
            onTap: () {},
            child: Container(
              width: 230,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppColors.primary.withOpacity(0.25),
                    AppColors.accent.withOpacity(0.15),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.primary.withOpacity(0.3)),
              ),
              child: Row(
                children: [
                  const Text('🛕', style: TextStyle(fontSize: 46)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          t.$1,
                          style: AppTextStyles.h4.copyWith(fontSize: 14),
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 2),
                        Text(t.$2, style: AppTextStyles.caption),
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.primary,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            'Book Pass',
                            style: AppTextStyles.caption.copyWith(
                              color: AppColors.textPrimary,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  // ─── Remedies ────────────────────────────────────────────────────────────────────
  Widget _buildRemediesRow() {
    final items = [
      ('🔮', 'Astrology', AppColors.secondary, AppColors.secondary.withOpacity(0.08)),
      ('💎', 'Gemstones', AppColors.info, AppColors.info.withOpacity(0.08)),
      ('🏡', 'Vastu', AppColors.success, AppColors.success.withOpacity(0.08)),
      ('🌿', 'Ayurveda', AppColors.warning, AppColors.warning.withOpacity(0.08)),
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: items.map((item) {
          return Expanded(
            child: GestureDetector(
              onTap: () {},
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 4),
                padding: const EdgeInsets.symmetric(vertical: 14),
                decoration: BoxDecoration(
                  color: item.$4,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: item.$3.withOpacity(0.2)),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(item.$1, style: const TextStyle(fontSize: 26)),
                    const SizedBox(height: 6),
                    Text(
                      item.$2,
                      style: AppTextStyles.caption.copyWith(
                        color: item.$3,
                        fontWeight: FontWeight.w700,
                        fontSize: 10,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  // ─── Store ───────────────────────────────────────────────────────────────────────
  Widget _buildStoreList() {
    final items = [
      ('Pooja Kit', '₹599', '📦', true),
      ('Incense Sticks', '₹150', '🕯️', false),
      ('Brass Diya', '₹299', '🪔', true),
      ('Coconut', '₹40', '🥥', false),
    ];

    return SizedBox(
      height: 158,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        scrollDirection: Axis.horizontal,
        itemCount: items.length,
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemBuilder: (_, i) {
          final item = items[i];
          return Container(
            width: 118,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.card,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: AppColors.border),
              boxShadow: AppColors.softShadow,
            ),
            child: Column(
              children: [
                Stack(
                  alignment: Alignment.topRight,
                  children: [
                    Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        color: AppColors.primary.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: Text(item.$3, style: const TextStyle(fontSize: 32)),
                      ),
                    ),
                    if (item.$4)
                      Container(
                        padding: const EdgeInsets.all(3),
                        decoration: BoxDecoration(
                          color: AppColors.secondary,
                          shape: BoxShape.circle,
                        ),
                        child: Text(
                          '🔥',
                          style: const TextStyle(fontSize: 9),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 7),
                Text(
                  item.$1,
                  style: AppTextStyles.labelSmall.copyWith(
                    color: AppColors.textPrimary,
                    fontWeight: FontWeight.w600,
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  item.$2,
                  style: AppTextStyles.caption.copyWith(
                    color: AppColors.secondary,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const Spacer(),
                GestureDetector(
                  onTap: () {},
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 5),
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '+ Add',
                      textAlign: TextAlign.center,
                      style: AppTextStyles.caption.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  // ─── Testimonial ──────────────────────────────────────────────────────────────
  Widget _buildTestimonialBanner() {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 24, 16, 0),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
        boxShadow: AppColors.softShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                'Hear from Devotees',
                style: AppTextStyles.h4,
              ),
              const Spacer(),
              Row(
                children: List.generate(
                  5,
                  (_) => const Icon(Icons.star_rounded, color: AppColors.warning, size: 14),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            '"The pandit arrived exactly on time and performed the Satyanarayan Katha beautifully. Highly recommend EMP for all puja needs!"',
            style: AppTextStyles.bodySmall.copyWith(
              color: AppColors.textSecondary,
              fontStyle: FontStyle.italic,
              height: 1.6,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: AppColors.accent,
                  shape: BoxShape.circle,
                  border: Border.all(color: AppColors.primaryDark, width: 2),
                ),
                child: const Center(
                  child: Text('👩', style: TextStyle(fontSize: 18)),
                ),
              ),
              const SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Aarti Sharma',
                    style: AppTextStyles.labelSmall.copyWith(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  Text('Pune, Maharashtra', style: AppTextStyles.caption),
                ],
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: AppColors.success.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppColors.success.withOpacity(0.3)),
                ),
                child: Text(
                  '✅ Verified',
                  style: AppTextStyles.caption.copyWith(
                    color: AppColors.success,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ─── Trust Row ───────────────────────────────────────────────────────────────────
  Widget _buildTrustRow() {
    final badges = [
      (Icons.lock_outline, '100%\nSafe', AppColors.success),
      (Icons.verified_user_outlined, 'Verified\nPandits', AppColors.info),
      (Icons.security_outlined, 'Secure\nPayment', AppColors.secondary),
      (Icons.support_agent_outlined, '24/7\nSupport', AppColors.warning),
    ];

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 24, 16, 0),
      child: Row(
        children: badges.map((b) {
          return Expanded(
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: b.$3.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(b.$1, color: b.$3, size: 22),
                ),
                const SizedBox(height: 6),
                Text(
                  b.$2,
                  textAlign: TextAlign.center,
                  style: AppTextStyles.caption.copyWith(
                    color: AppColors.textSecondary,
                    fontWeight: FontWeight.w600,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  // ─── Bottom Nav ───────────────────────────────────────────────────────────────────
  Widget _buildBottomNav() {
    final items = [
      (Icons.home_rounded, Icons.home_outlined, 'Home'),
      (Icons.history_rounded, Icons.history_outlined, 'History'),
      (Icons.add_circle_rounded, Icons.add_circle_outline_rounded, 'Book'),
      (Icons.notifications_rounded, Icons.notifications_outlined, 'Alerts'),
      (Icons.person_rounded, Icons.person_outline_rounded, 'Profile'),
    ];

    return Container(
      decoration: BoxDecoration(
        color: AppColors.card,
        border: const Border(top: BorderSide(color: AppColors.border)),
        boxShadow: AppColors.softShadow,
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: List.generate(items.length, (i) {
            final selected = _selectedNav == i;
            final isCenter = i == 2;
            return Expanded(
              child: InkWell(
                onTap: () {
                  setState(() => _selectedNav = i);
                  if (i == 1) context.push('/home/history');
                  if (i == 2) context.push('/home/create-request');
                },
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  child: isCenter
                      ? Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                gradient: AppColors.primaryGradient,
                                shape: BoxShape.circle,
                                boxShadow: AppColors.cardShadow,
                              ),
                              child: const Icon(
                                Icons.add_rounded,
                                color: AppColors.textPrimary,
                                size: 28,
                              ),
                            ),
                          ],
                        )
                      : Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            AnimatedSwitcher(
                              duration: const Duration(milliseconds: 200),
                              child: Icon(
                                selected ? items[i].$1 : items[i].$2,
                                key: ValueKey(selected),
                                color: selected
                                    ? AppColors.secondary
                                    : AppColors.textHint,
                                size: 24,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              items[i].$3,
                              style: AppTextStyles.caption.copyWith(
                                color: selected
                                    ? AppColors.secondary
                                    : AppColors.textHint,
                                fontWeight: selected
                                    ? FontWeight.w700
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

// ─── Data Models ───────────────────────────────────────────────────────────────────

class _HeroSlide {
  final String emoji, title, subtitle, ctaLabel;
  final LinearGradient gradient;
  const _HeroSlide({
    required this.emoji,
    required this.title,
    required this.subtitle,
    required this.ctaLabel,
    required this.gradient,
  });
}

class _QuickAction {
  final String emoji, label;
  final Color bgColor, accentColor;
  const _QuickAction(this.emoji, this.label, this.bgColor, this.accentColor);
}

class _PanditData {
  final String name, specialty, rating, experience, distance, emoji;
  const _PanditData(
    this.name,
    this.specialty,
    this.rating,
    this.experience,
    this.distance,
    this.emoji,
  );
}

class _Chip extends StatelessWidget {
  final String label;
  final Color bgColor;
  const _Chip(this.label, this.bgColor);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.border),
      ),
      child: Text(
        label,
        style: AppTextStyles.caption.copyWith(
          color: AppColors.textSecondary,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

class _ModeTab extends StatelessWidget {
  final String icon, label, sublabel;
  final bool selected;
  final VoidCallback onTap;
  final Color activeColor, activeBg;

  const _ModeTab({
    required this.icon,
    required this.label,
    required this.sublabel,
    required this.selected,
    required this.onTap,
    required this.activeColor,
    required this.activeBg,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeInOut,
          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 14),
          decoration: BoxDecoration(
            color: selected ? activeBg : Colors.transparent,
            borderRadius: BorderRadius.circular(13),
            boxShadow: selected
                ? [
                    BoxShadow(
                      color: activeBg.withOpacity(0.25),
                      blurRadius: 10,
                      offset: const Offset(0, 3),
                    )
                  ]
                : null,
          ),
          child: Row(
            children: [
              Text(icon, style: const TextStyle(fontSize: 22)),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      label,
                      style: AppTextStyles.labelSmall.copyWith(
                        color: selected ? AppColors.card : AppColors.textSecondary,
                        fontWeight: FontWeight.w700,
                        fontSize: 13,
                      ),
                    ),
                    Text(
                      sublabel,
                      style: AppTextStyles.caption.copyWith(
                        color: selected
                            ? AppColors.card.withOpacity(0.8)
                            : AppColors.textHint,
                        fontSize: 10,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

