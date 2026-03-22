import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_text_styles.dart';

// ─── Home Screen ──────────────────────────────────────────────────────────────
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen>
    with SingleTickerProviderStateMixin {
  bool _isOnlinePuja = false;
  final PageController _heroPageCtrl = PageController();
  final PageController _darshanPageCtrl = PageController();
  int _heroPage = 0;
  int _darshanPage = 0;
  int _selectedService = 0;
  late TabController _serviceTabCtrl;

  final List<String> _serviceTabs = [
    'All', 'Satyanarayan', 'Griha Pravesh', 'Marriage', 'Online', 'Darshan',
  ];

  @override
  void initState() {
    super.initState();
    _serviceTabCtrl = TabController(length: _serviceTabs.length, vsync: this);
    _serviceTabCtrl.addListener(() {
      if (!_serviceTabCtrl.indexIsChanging) {
        setState(() => _selectedService = _serviceTabCtrl.index);
      }
    });
  }

  @override
  void dispose() {
    _heroPageCtrl.dispose();
    _darshanPageCtrl.dispose();
    _serviceTabCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            _buildAppBar(),
            SliverToBoxAdapter(child: _buildBody()),
          ],
        ),
      ),
    );
  }

  // ─── AppBar ────────────────────────────────────────────────────────────────
  SliverAppBar _buildAppBar() {
    return SliverAppBar(
      pinned: false,
      floating: true,
      snap: true,
      elevation: 0,
      backgroundColor: AppColors.background,
      expandedHeight: 110,
      automaticallyImplyLeading: false,
      flexibleSpace: FlexibleSpaceBar(
        collapseMode: CollapseMode.none,
        background: Container(
          color: AppColors.background,
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      gradient: AppColors.primaryGradient,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Center(child: Text('🪔', style: TextStyle(fontSize: 18))),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Namaste 🙏',
                          style: AppTextStyles.caption.copyWith(
                              color: AppColors.textSecondary, fontWeight: FontWeight.w600)),
                      Text('Rahul Singh', style: AppTextStyles.h4.copyWith(fontSize: 14)),
                    ],
                  ),
                  const Spacer(),
                  // Online / Offline toggle
                  GestureDetector(
                    onTap: () => setState(() => _isOnlinePuja = !_isOnlinePuja),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 250),
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: _isOnlinePuja ? AppColors.secondary : AppColors.primary,
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: AppColors.softShadow,
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(_isOnlinePuja ? '💻' : '📍',
                              style: const TextStyle(fontSize: 12)),
                          const SizedBox(width: 5),
                          Text(
                            _isOnlinePuja ? 'Online' : 'Offline',
                            style: AppTextStyles.caption.copyWith(
                              color: _isOnlinePuja ? AppColors.card : AppColors.textPrimary,
                              fontWeight: FontWeight.w800,
                              fontSize: 11,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Stack(
                    clipBehavior: Clip.none,
                    children: [
                      IconButton(
                        onPressed: () {},
                        icon: const Icon(Icons.notifications_outlined,
                            color: AppColors.textPrimary, size: 22),
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(minWidth: 34, minHeight: 34),
                      ),
                      Positioned(
                        top: 2,
                        right: 2,
                        child: Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: AppColors.secondary, shape: BoxShape.circle),
                        ),
                      ),
                    ],
                  ),
                  Container(
                    width: 34,
                    height: 34,
                    decoration: BoxDecoration(
                      color: AppColors.accent,
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.primaryDark, width: 2),
                    ),
                    child: Center(
                      child: Text('R',
                          style: AppTextStyles.h4.copyWith(
                              color: AppColors.secondary, fontSize: 14)),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () {},
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        decoration: BoxDecoration(
                          color: AppColors.card,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.border),
                          boxShadow: AppColors.softShadow,
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.search_rounded,
                                color: AppColors.textHint, size: 18),
                            const SizedBox(width: 8),
                            Text('Search puja, pandit...',
                                style: AppTextStyles.bodySmall
                                    .copyWith(color: AppColors.textHint)),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: () {},
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 9),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.primary.withOpacity(0.3)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.location_on_rounded,
                              size: 14, color: AppColors.secondary),
                          const SizedBox(width: 4),
                          Text('Pune',
                              style: AppTextStyles.caption.copyWith(
                                  color: AppColors.textPrimary, fontWeight: FontWeight.w700)),
                          const Icon(Icons.arrow_drop_down_rounded,
                              size: 16, color: AppColors.textSecondary),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ─── Body ──────────────────────────────────────────────────────────────────
  Widget _buildBody() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 8),
        _buildHeroSlider(),
        _buildExploreServices(),
        _buildSectionHeader('Trending Poojas', actionLabel: 'See All'),
        _buildTrendingPoojas(),
        _buildSectionHeader('Client Stories', actionLabel: 'View All'),
        _buildVideoTestimonials(isClient: true),
        _buildSectionHeader('Trusted Specialists', actionLabel: 'View All'),
        _buildTrustedSpecialists(),
        _buildSectionHeader('VIP Temple Darshan'),
        _buildVipDarshanSlider(),
        _buildSectionHeader('What Pandits Say'),
        _buildVideoTestimonials(isClient: false),
        _buildSectionHeader('EMP Store', actionLabel: 'Shop All'),
        _buildEmpStore(),
        _buildSectionHeader('EMP Remedies'),
        _buildRemedies(),
        _buildFestivalOfferBanner(),
        _buildSectionHeader('EMP Blogs', actionLabel: 'Read All'),
        _buildBlogSection(),
        _buildTrustIndicators(),
        const SizedBox(height: 24),
      ],
    );
  }

  // ─── Section Header ────────────────────────────────────────────────────────
  Widget _buildSectionHeader(String title, {String? actionLabel}) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 24, 16, 12),
      child: Row(
        children: [
          Container(
            width: 4,
            height: 20,
            decoration: BoxDecoration(
              color: AppColors.secondary, borderRadius: BorderRadius.circular(2)),
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
                child: Text(actionLabel,
                    style: AppTextStyles.caption.copyWith(
                        color: AppColors.textPrimary, fontWeight: FontWeight.w700)),
              ),
            ),
        ],
      ),
    );
  }

  // ─── Section 1: Hero Slider ────────────────────────────────────────────────
  Widget _buildHeroSlider() {
    final slides = [
      _HeroSlide('🪔', 'Book a Pandit\nInstantly', 'Verified experts at your doorstep',
          const LinearGradient(colors: [Color(0xFFF8CB46), Color(0xFFFFAA00)],
              begin: Alignment.topLeft, end: Alignment.bottomRight)),
      _HeroSlide('🛕', 'VIP Temple\nDarshan Booking', 'Skip queues — fast entry QR pass',
          const LinearGradient(colors: [Color(0xFF0C831F), Color(0xFF0A6018)],
              begin: Alignment.topLeft, end: Alignment.bottomRight)),
      _HeroSlide('💻', 'Online Pooja\nServices', 'Live sacred rituals from anywhere',
          const LinearGradient(colors: [Color(0xFF3B82F6), Color(0xFF1D4ED8)],
              begin: Alignment.topLeft, end: Alignment.bottomRight)),
      _HeroSlide('🎊', 'Festival Special\nPoojas', 'Exclusive packages for every occasion',
          const LinearGradient(colors: [Color(0xFFE23744), Color(0xFFC02030)],
              begin: Alignment.topLeft, end: Alignment.bottomRight)),
    ];

    return Column(
      children: [
        SizedBox(
          height: 178,
          child: PageView.builder(
            controller: _heroPageCtrl,
            itemCount: slides.length,
            onPageChanged: (i) => setState(() => _heroPage = i),
            itemBuilder: (_, i) => _buildHeroCard(slides[i]),
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
              width: active ? 24 : 6, height: 6,
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

  Widget _buildHeroCard(_HeroSlide s) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        gradient: s.gradient,
        borderRadius: BorderRadius.circular(22),
        boxShadow: AppColors.cardShadow,
      ),
      child: Stack(
        children: [
          Positioned(
            right: -24, top: -24,
            child: Container(
              width: 150, height: 150,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.07),
              ),
            ),
          ),
          Positioned(
            right: 16, bottom: 0,
            child: Text(s.emoji, style: const TextStyle(fontSize: 78)),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 22, 100, 22),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(s.title,
                    style: AppTextStyles.h3.copyWith(
                        color: Colors.white, fontSize: 21, height: 1.2)),
                const SizedBox(height: 6),
                Text(s.subtitle,
                    style: AppTextStyles.bodySmall
                        .copyWith(color: Colors.white.withOpacity(0.85))),
                const SizedBox(height: 14),
                GestureDetector(
                  onTap: () => context.push('/home/create-request'),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 9),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(10),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.12),
                          blurRadius: 8, offset: const Offset(0, 3),
                        )
                      ],
                    ),
                    child: Text('Book Now →',
                        style: AppTextStyles.caption.copyWith(
                            color: AppColors.textPrimary,
                            fontWeight: FontWeight.w800, fontSize: 12)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ─── Section 2: Explore Services ──────────────────────────────────────────
  Widget _buildExploreServices() {
    final allServices = <String, List<_ServiceItem>>{
      'All': [
        _ServiceItem('🪔', 'Satyanarayan'), _ServiceItem('🏠', 'Griha Pravesh'),
        _ServiceItem('💍', 'Marriage'), _ServiceItem('💻', 'Online Pooja'),
        _ServiceItem('🛕', 'Darshan'), _ServiceItem('🌙', 'Navgrah Shanti'),
        _ServiceItem('🔱', 'Rudrabhishek'), _ServiceItem('🌺', 'Durga Puja'),
      ],
      'Satyanarayan': [
        _ServiceItem('🪔', 'Katha'), _ServiceItem('🌸', 'Prasad Kit'),
        _ServiceItem('📿', 'Panchamrit'),
      ],
      'Griha Pravesh': [
        _ServiceItem('🏠', 'House Warming'), _ServiceItem('🔥', 'Havan'),
        _ServiceItem('🌿', 'Vastu Puja'),
      ],
      'Marriage': [
        _ServiceItem('💍', 'Vivah Puja'), _ServiceItem('📿', 'Kundali Match'),
        _ServiceItem('🎊', 'Mehendi Ritual'),
      ],
      'Online': [
        _ServiceItem('💻', 'Live Satyanarayan'), _ServiceItem('📱', 'Video Havan'),
        _ServiceItem('🙏', 'E-Prasad'),
      ],
      'Darshan': [
        _ServiceItem('🛕', 'Tirupati'), _ServiceItem('✨', 'Kashi'),
        _ServiceItem('🌟', 'Shirdi'),
      ],
    };

    final key = _serviceTabs[_selectedService];
    final items = allServices[key] ?? allServices['All']!;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader('Explore Services'),
        SizedBox(
          height: 38,
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            scrollDirection: Axis.horizontal,
            itemCount: _serviceTabs.length,
            separatorBuilder: (_, __) => const SizedBox(width: 8),
            itemBuilder: (_, i) {
              final active = _selectedService == i;
              return GestureDetector(
                onTap: () => setState(() => _selectedService = i),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  decoration: BoxDecoration(
                    color: active ? AppColors.primary : AppColors.card,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                        color: active ? AppColors.primaryDark : AppColors.border),
                    boxShadow: active ? AppColors.softShadow : null,
                  ),
                  child: Text(_serviceTabs[i],
                      style: AppTextStyles.caption.copyWith(
                        color: active ? AppColors.textPrimary : AppColors.textSecondary,
                        fontWeight: active ? FontWeight.w700 : FontWeight.w500,
                      )),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 14),
        AnimatedSwitcher(
          duration: const Duration(milliseconds: 250),
          child: Padding(
            key: ValueKey(_selectedService),
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 4, childAspectRatio: 0.85,
                mainAxisSpacing: 10, crossAxisSpacing: 10,
              ),
              itemCount: items.length,
              itemBuilder: (_, i) {
                final svc = items[i];
                return GestureDetector(
                  onTap: () => context.push('/home/create-request'),
                  child: Container(
                    decoration: BoxDecoration(
                      color: AppColors.card,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.border),
                      boxShadow: AppColors.softShadow,
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 46, height: 46,
                          decoration: BoxDecoration(
                            color: AppColors.primary.withOpacity(0.1),
                            shape: BoxShape.circle,
                          ),
                          child: Center(
                            child: Text(svc.emoji,
                                style: const TextStyle(fontSize: 22)),
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(svc.label,
                            style: AppTextStyles.caption.copyWith(
                                color: AppColors.textPrimary,
                                fontWeight: FontWeight.w600, fontSize: 10),
                            textAlign: TextAlign.center,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ),
      ],
    );
  }

  // ─── Section 3: Trending Poojas ────────────────────────────────────────────
  Widget _buildTrendingPoojas() {
    final poojas = [
      _PoojasCard('🌹', 'Navgrah Shanti', '₹2,100 – ₹5,100', 4.9, true),
      _PoojasCard('🪔', 'Satyanarayan Katha', '₹1,500 – ₹3,000', 4.8, false),
      _PoojasCard('🌸', 'Lakshmi Puja', '₹800 – ₹2,500', 4.7, true),
      _PoojasCard('🔱', 'Rudrabhishek', '₹3,000 – ₹7,000', 4.9, false),
    ];

    return SizedBox(
      height: 198,
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
              width: 160,
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
                        height: 108,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [AppColors.primary.withOpacity(0.18),
                              AppColors.primary.withOpacity(0.04)],
                            begin: Alignment.topLeft, end: Alignment.bottomRight,
                          ),
                          borderRadius: const BorderRadius.vertical(
                              top: Radius.circular(17)),
                        ),
                        child: Center(
                          child: Text(p.emoji,
                              style: const TextStyle(fontSize: 50)),
                        ),
                      ),
                      if (p.isPopular)
                        Positioned(
                          top: 8, right: 8,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 7, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppColors.secondary,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text('🔥 Popular',
                                style: AppTextStyles.caption.copyWith(
                                    color: AppColors.card, fontSize: 9,
                                    fontWeight: FontWeight.w700)),
                          ),
                        ),
                    ],
                  ),
                  Padding(
                    padding: const EdgeInsets.all(10),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(p.label,
                            style: AppTextStyles.labelSmall.copyWith(
                                color: AppColors.textPrimary,
                                fontWeight: FontWeight.w700, fontSize: 12),
                            maxLines: 1, overflow: TextOverflow.ellipsis),
                        const SizedBox(height: 3),
                        Row(
                          children: [
                            const Icon(Icons.star_rounded,
                                color: AppColors.warning, size: 12),
                            const SizedBox(width: 2),
                            Text('${p.rating}',
                                style: AppTextStyles.caption.copyWith(
                                    fontWeight: FontWeight.w600)),
                          ],
                        ),
                        const SizedBox(height: 2),
                        Text(p.priceRange,
                            style: AppTextStyles.caption.copyWith(
                                color: AppColors.secondary,
                                fontWeight: FontWeight.w700)),
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

  // ─── Sections 4 & 7: Video Testimonials ───────────────────────────────────
  Widget _buildVideoTestimonials({required bool isClient}) {
    final items = isClient
        ? [
            _TestimonialCard('👩', 'Aarti Sharma', 'Pune',
                '"Absolutely divine experience! Pandit ji made everything so smooth."'),
            _TestimonialCard('👨', 'Ravi Kumar', 'Mumbai',
                '"Book and done in minutes. Will use again for Diwali Puja!"'),
            _TestimonialCard('👩‍🦱', 'Sunita Patel', 'Surat',
                '"Great app. Very trusted pandits. 5 stars!"'),
          ]
        : [
            _TestimonialCard('👨‍🦳', 'Pt. Ramesh Ji', '15 Yrs Exp.',
                '"EMP gives us more clients while we focus on rituals."'),
            _TestimonialCard('🧔', 'Pt. Suresh Ji', '20 Yrs Exp.',
                '"This platform has transformed how I connect with devotees."'),
          ];

    return SizedBox(
      height: 160,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        scrollDirection: Axis.horizontal,
        itemCount: items.length,
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemBuilder: (_, i) {
          final t = items[i];
          return Container(
            width: 240,
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
                    Stack(
                      children: [
                        Container(
                          width: 42, height: 42,
                          decoration: BoxDecoration(
                            color: AppColors.accent,
                            shape: BoxShape.circle,
                            border: Border.all(
                                color: AppColors.primaryDark, width: 2),
                          ),
                          child: Center(
                            child: Text(t.emoji,
                                style: const TextStyle(fontSize: 20)),
                          ),
                        ),
                        Positioned(
                          bottom: 0, right: 0,
                          child: Container(
                            width: 16, height: 16,
                            decoration: BoxDecoration(
                              color: AppColors.secondary,
                              shape: BoxShape.circle,
                              border: Border.all(
                                  color: AppColors.card, width: 1.5),
                            ),
                            child: const Icon(Icons.play_arrow_rounded,
                                size: 11, color: Colors.white),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(t.name,
                              style: AppTextStyles.labelSmall.copyWith(
                                  color: AppColors.textPrimary,
                                  fontWeight: FontWeight.w700)),
                          Text(t.location, style: AppTextStyles.caption),
                        ],
                      ),
                    ),
                    Row(
                      children: List.generate(5,
                          (_) => const Icon(Icons.star_rounded,
                              color: AppColors.warning, size: 12)),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Expanded(
                  child: Text(t.review,
                      style: AppTextStyles.bodySmall.copyWith(
                          color: AppColors.textSecondary,
                          fontStyle: FontStyle.italic, height: 1.4, fontSize: 11),
                      maxLines: 3, overflow: TextOverflow.ellipsis),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  // ─── Section 5: Trusted Specialists ───────────────────────────────────────
  Widget _buildTrustedSpecialists() {
    final pandits = [
      _PanditCard('👨‍🦳', 'Pt. Ramesh Sharma', 'Vedic Rituals', 4.9, '15 Yrs', '1.2 km'),
      _PanditCard('👨‍🦱', 'Pt. Suresh Joshi', 'South Indian', 4.7, '10 Yrs', '2.5 km'),
      _PanditCard('🧔', 'Pt. Anil Trivedi', 'North Indian', 4.8, '20 Yrs', '0.8 km'),
    ];

    return SizedBox(
      height: 155,
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
              width: 230,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.border),
                boxShadow: AppColors.softShadow,
              ),
              child: Row(
                children: [
                  Stack(
                    children: [
                      Container(
                        width: 56, height: 56,
                        decoration: BoxDecoration(
                          color: AppColors.accent,
                          shape: BoxShape.circle,
                          border: Border.all(color: AppColors.primaryDark, width: 2),
                        ),
                        child: Center(
                          child: Text(p.emoji, style: const TextStyle(fontSize: 26))),
                      ),
                      Positioned(
                        bottom: 0, right: 0,
                        child: Container(
                          padding: const EdgeInsets.all(3),
                          decoration: BoxDecoration(
                            color: AppColors.success,
                            shape: BoxShape.circle,
                            border: Border.all(color: AppColors.card, width: 1.5),
                          ),
                          child: const Icon(Icons.verified_rounded,
                              size: 10, color: Colors.white),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(p.name,
                            style: AppTextStyles.labelSmall.copyWith(
                                color: AppColors.textPrimary,
                                fontWeight: FontWeight.w700, fontSize: 12),
                            overflow: TextOverflow.ellipsis),
                        Text(p.specialty,
                            style: AppTextStyles.caption.copyWith(
                                color: AppColors.textSecondary)),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            const Icon(Icons.star_rounded,
                                color: AppColors.warning, size: 12),
                            const SizedBox(width: 2),
                            Text('${p.rating}',
                                style: AppTextStyles.caption
                                    .copyWith(fontWeight: FontWeight.w700)),
                            const SizedBox(width: 6),
                            _miniChip(p.experience, AppColors.primary),
                            const SizedBox(width: 4),
                            _miniChip(p.distance, AppColors.background),
                          ],
                        ),
                        const SizedBox(height: 5),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 7, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppColors.success.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                                color: AppColors.success.withOpacity(0.3)),
                          ),
                          child: Text('✔ Verified Pandit',
                              style: AppTextStyles.caption.copyWith(
                                  color: AppColors.success,
                                  fontWeight: FontWeight.w700, fontSize: 9.5)),
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

  Widget _miniChip(String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: color, borderRadius: BorderRadius.circular(6),
        border: Border.all(color: AppColors.border),
      ),
      child: Text(label,
          style: AppTextStyles.caption.copyWith(
              color: AppColors.textSecondary,
              fontWeight: FontWeight.w600, fontSize: 9.5)),
    );
  }

  // ─── Section 6: VIP Darshan Slider ────────────────────────────────────────
  Widget _buildVipDarshanSlider() {
    final temples = [
      _DarshanCard('🛕', 'Kashi Vishwanath', 'Varanasi, UP', 'Fast Entry Pass'),
      _DarshanCard('🌟', 'Tirupati Balaji', 'Andhra Pradesh', 'QR Verification'),
      _DarshanCard('✨', 'Shirdi Sai Baba', 'Maharashtra', 'VIP Darshan'),
      _DarshanCard('💛', 'Golden Temple', 'Amritsar, Punjab', 'Skip Queue'),
    ];

    return Column(
      children: [
        SizedBox(
          height: 148,
          child: PageView.builder(
            controller: _darshanPageCtrl,
            itemCount: temples.length,
            onPageChanged: (i) => setState(() => _darshanPage = i),
            itemBuilder: (_, i) {
              final t = temples[i];
              return Container(
                margin: const EdgeInsets.symmetric(horizontal: 16),
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      AppColors.primary.withOpacity(0.22),
                      AppColors.accent.withOpacity(0.1),
                    ],
                    begin: Alignment.topLeft, end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.primary.withOpacity(0.35)),
                ),
                child: Row(
                  children: [
                    Text(t.emoji, style: const TextStyle(fontSize: 58)),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppColors.success,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(t.feature,
                                style: AppTextStyles.caption.copyWith(
                                    color: AppColors.card,
                                    fontWeight: FontWeight.w700, fontSize: 9)),
                          ),
                          const SizedBox(height: 6),
                          Text(t.name,
                              style: AppTextStyles.h4.copyWith(fontSize: 15)),
                          Text(t.location, style: AppTextStyles.caption),
                          const SizedBox(height: 10),
                          GestureDetector(
                            onTap: () {},
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 14, vertical: 6),
                              decoration: BoxDecoration(
                                color: AppColors.primary,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Text('Book Darshan →',
                                  style: AppTextStyles.caption.copyWith(
                                      color: AppColors.textPrimary,
                                      fontWeight: FontWeight.w800)),
                            ),
                          ),
                        ],
                      ),
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
          children: List.generate(temples.length, (i) {
            final active = i == _darshanPage;
            return AnimatedContainer(
              duration: const Duration(milliseconds: 250),
              margin: const EdgeInsets.symmetric(horizontal: 3),
              width: active ? 20 : 6, height: 6,
              decoration: BoxDecoration(
                color: active ? AppColors.success : AppColors.border,
                borderRadius: BorderRadius.circular(3),
              ),
            );
          }),
        ),
      ],
    );
  }

  // ─── Section 8: EMP Store ─────────────────────────────────────────────────
  Widget _buildEmpStore() {
    final products = [
      _ProductCard('📦', 'Pooja Kit', '₹599', true),
      _ProductCard('🕯️', 'Incense Set', '₹150', false),
      _ProductCard('🪔', 'Brass Diya', '₹299', true),
      _ProductCard('🥥', 'Coconut', '₹40', false),
      _ProductCard('📿', 'Rudraksha', '₹799', true),
    ];

    return SizedBox(
      height: 162,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        scrollDirection: Axis.horizontal,
        itemCount: products.length,
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemBuilder: (_, i) {
          final p = products[i];
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
                      width: 58, height: 58,
                      decoration: BoxDecoration(
                        color: AppColors.primary.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: Text(p.emoji,
                            style: const TextStyle(fontSize: 30))),
                    ),
                    if (p.isBestseller)
                      Container(
                        padding: const EdgeInsets.all(3.5),
                        decoration: const BoxDecoration(
                            color: AppColors.secondary, shape: BoxShape.circle),
                        child: const Text('🔥', style: TextStyle(fontSize: 8)),
                      ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(p.label,
                    style: AppTextStyles.labelSmall.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w600, fontSize: 11),
                    textAlign: TextAlign.center,
                    maxLines: 1, overflow: TextOverflow.ellipsis),
                Text(p.price,
                    style: AppTextStyles.caption.copyWith(
                        color: AppColors.secondary, fontWeight: FontWeight.w700)),
                const Spacer(),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: AppColors.textPrimary,
                      padding: const EdgeInsets.symmetric(vertical: 6),
                      minimumSize: Size.zero,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8)),
                      elevation: 0,
                    ),
                    child: const Text('+ Add',
                        style: TextStyle(fontWeight: FontWeight.w800, fontSize: 11)),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  // ─── Section 9: Remedies ──────────────────────────────────────────────────
  Widget _buildRemedies() {
    final remedies = [
      ('🔮', 'Astrology', AppColors.secondary),
      ('💎', 'Gemstones', AppColors.info),
      ('🏡', 'Vastu', AppColors.success),
      ('🌿', 'Ayurveda', AppColors.warning),
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: remedies.map((r) {
          return Expanded(
            child: GestureDetector(
              onTap: () {},
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 4),
                padding: const EdgeInsets.symmetric(vertical: 14),
                decoration: BoxDecoration(
                  color: r.$3.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: r.$3.withOpacity(0.2)),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(r.$1, style: const TextStyle(fontSize: 26)),
                    const SizedBox(height: 6),
                    Text(r.$2,
                        style: AppTextStyles.caption.copyWith(
                            color: r.$3, fontWeight: FontWeight.w700,
                            fontSize: 9.5, height: 1.3),
                        textAlign: TextAlign.center),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildFestivalOfferBanner() {
    return GestureDetector(
      onTap: () {},
      child: Container(
        margin: const EdgeInsets.fromLTRB(16, 16, 16, 0),
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFFF8CB46), Color(0xFFFFBC00)],
            begin: Alignment.topLeft, end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
          boxShadow: AppColors.cardShadow,
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
                      color: AppColors.secondary,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text('🎊 FESTIVAL SPECIAL',
                        style: AppTextStyles.caption.copyWith(
                            color: AppColors.card, fontWeight: FontWeight.w800,
                            fontSize: 9, letterSpacing: 0.5)),
                  ),
                  const SizedBox(height: 6),
                  Text('Navratri Offers\nUp to 30% OFF',
                      style: AppTextStyles.h3.copyWith(
                          color: AppColors.textPrimary, fontSize: 18)),
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 7),
                    decoration: BoxDecoration(
                      color: AppColors.textPrimary,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text('Explore Offers →',
                        style: AppTextStyles.caption.copyWith(
                            color: AppColors.primary, fontWeight: FontWeight.w800)),
                  ),
                ],
              ),
            ),
            const Text('🪔', style: TextStyle(fontSize: 72)),
          ],
        ),
      ),
    );
  }

  // ─── Section 10: Blog ─────────────────────────────────────────────────────
  Widget _buildBlogSection() {
    final blogs = [
      _BlogCard('📖', 'How to Perform Diwali Puja at Home',
          'Step-by-step guide for perfect rituals...'),
      _BlogCard('🌟', 'Festival Calendar 2025 — Key Dates',
          'All important puja dates and muhuratas...'),
      _BlogCard('🙏', 'Why Choose a Verified Pandit?',
          'Benefits of booking certified priests...'),
    ];

    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: blogs.length,
      separatorBuilder: (_, __) => const SizedBox(height: 10),
      itemBuilder: (_, i) {
        final b = blogs[i];
        return GestureDetector(
          onTap: () {},
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.card,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.border),
              boxShadow: AppColors.softShadow,
            ),
            child: Row(
              children: [
                Container(
                  width: 72, height: 72,
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Center(
                    child: Text(b.emoji, style: const TextStyle(fontSize: 34))),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(b.title,
                          style: AppTextStyles.labelMedium.copyWith(fontSize: 13),
                          maxLines: 2, overflow: TextOverflow.ellipsis),
                      const SizedBox(height: 4),
                      Text(b.excerpt,
                          style: AppTextStyles.caption,
                          maxLines: 1, overflow: TextOverflow.ellipsis),
                      const SizedBox(height: 6),
                      Text('Read more →',
                          style: AppTextStyles.caption.copyWith(
                              color: AppColors.secondary,
                              fontWeight: FontWeight.w700)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // ─── Section 11: Trust Indicators ─────────────────────────────────────────
  Widget _buildTrustIndicators() {
    final badges = [
      (Icons.lock_outline_rounded, 'Safe &\nConfidential', AppColors.success),
      (Icons.verified_user_outlined, 'Verified\nPandits', AppColors.info),
      (Icons.security_outlined, 'Secure\nPayment', AppColors.secondary),
      (Icons.support_agent_outlined, '24/7\nSupport', AppColors.warning),
    ];

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 24, 16, 0),
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 8),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
        boxShadow: AppColors.softShadow,
      ),
      child: Row(
        children: badges.map((b) {
          return Expanded(
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: b.$3.withOpacity(0.1), shape: BoxShape.circle),
                  child: Icon(b.$1, color: b.$3, size: 22),
                ),
                const SizedBox(height: 6),
                Text(b.$2,
                    textAlign: TextAlign.center,
                    style: AppTextStyles.caption.copyWith(
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.w600, height: 1.3, fontSize: 10)),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}

// ─── Data Models ───────────────────────────────────────────────────────────────

class _HeroSlide {
  final String emoji, title, subtitle;
  final LinearGradient gradient;
  const _HeroSlide(this.emoji, this.title, this.subtitle, this.gradient);
}

class _ServiceItem {
  final String emoji, label;
  const _ServiceItem(this.emoji, this.label);
}

class _PoojasCard {
  final String emoji, label, priceRange;
  final double rating;
  final bool isPopular;
  const _PoojasCard(this.emoji, this.label, this.priceRange, this.rating, this.isPopular);
}

class _TestimonialCard {
  final String emoji, name, location, review;
  const _TestimonialCard(this.emoji, this.name, this.location, this.review);
}

class _PanditCard {
  final String emoji, name, specialty, experience, distance;
  final double rating;
  const _PanditCard(this.emoji, this.name, this.specialty, this.rating,
      this.experience, this.distance);
}

class _DarshanCard {
  final String emoji, name, location, feature;
  const _DarshanCard(this.emoji, this.name, this.location, this.feature);
}

class _ProductCard {
  final String emoji, label, price;
  final bool isBestseller;
  const _ProductCard(this.emoji, this.label, this.price, this.isBestseller);
}

class _BlogCard {
  final String emoji, title, excerpt;
  const _BlogCard(this.emoji, this.title, this.excerpt);
}
