import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_text_styles.dart';

// --- Local "Light Sanctuary" Theme Constants ---
class _SanctuaryTheme {
  static const Color background = AppColors.background;
  static const Color surfaceLow = AppColors.card;
  static const Color surfaceHigh = Color(
    0xFFF9F6EE,
  ); // Very light warm grey/cream for tabs
  static const Color primary = AppColors.primary;
  static const Color primaryDim = AppColors.primaryDark;
  static const Color onSurface = AppColors.textPrimary;
  static const Color onSurfaceVariant = AppColors.textSecondary;
  static const Color secondary = AppColors.secondary;

  static final ambientShadow = BoxShadow(
    color: AppColors.primary.withOpacity(0.12),
    blurRadius: 30,
    offset: const Offset(0, 10),
  );

  static final primaryGlow = BoxShadow(
    color: primary.withOpacity(0.3),
    blurRadius: 16,
    offset: const Offset(0, 4),
  );
}

class PujaListScreen extends StatefulWidget {
  const PujaListScreen({super.key});

  @override
  State<PujaListScreen> createState() => _PujaListScreenState();
}

class _PujaListScreenState extends State<PujaListScreen> {
  String _searchQuery = '';
  int _selectedTabIndex = 0;
  final _tabs = ['All', 'Offline', 'VIP Darshan'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _SanctuaryTheme.background,
      body: Stack(
        children: [
          // Background ambient glows
          Positioned(
            top: -100,
            left: -100,
            child: Container(
              width: 350,
              height: 350,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _SanctuaryTheme.primary.withOpacity(
                  0.2,
                ), // Warm yellow glow
                boxShadow: [
                  BoxShadow(
                    color: _SanctuaryTheme.primary.withOpacity(0.2),
                    blurRadius: 100,
                    spreadRadius: 50,
                  ),
                ],
              ),
            ),
          ),
          Positioned.fill(
            child: SafeArea(
              bottom: false,
              child: Column(
                children: [
                  _buildHeader(),
                  _buildSearchBar(),
                  Expanded(child: _buildContent()),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContent() {
    if (_selectedTabIndex == 0) return _buildPujaGrid(_allPujas);
    if (_selectedTabIndex == 1) return _buildPujaGrid(_offlinePujas);
    return _buildDarshanList();
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            'Explore\nPujas',
            style: TextStyle(
              fontFamily: 'Noto Serif',
              fontSize: 32,
              fontWeight: FontWeight.w600,
              color: _SanctuaryTheme.onSurface,
              height: 1.1,
            ),
          ),
          ClipRRect(
            borderRadius: BorderRadius.circular(30),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 10,
                ),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.6),
                  borderRadius: BorderRadius.circular(30),
                  border: Border.all(
                    color: _SanctuaryTheme.primary.withOpacity(0.3),
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.tune_rounded,
                      size: 16,
                      color: _SanctuaryTheme.onSurface,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      'Filter',
                      style: AppTextStyles.caption.copyWith(
                        fontWeight: FontWeight.w700,
                        color: _SanctuaryTheme.onSurface,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.6),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: _SanctuaryTheme.primary.withOpacity(0.2),
              ),
            ),
            child: TextField(
              onChanged: (v) => setState(() => _searchQuery = v.toLowerCase()),
              style: TextStyle(color: _SanctuaryTheme.onSurface),
              decoration: InputDecoration(
                hintText: 'Seek your ritual...',
                hintStyle: TextStyle(
                  color: _SanctuaryTheme.onSurfaceVariant,
                  fontSize: 15,
                ),
                prefixIcon: Icon(
                  Icons.search_rounded,
                  color: _SanctuaryTheme.onSurfaceVariant,
                  size: 22,
                ),
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(vertical: 16),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPujaGrid(List<_PujaItem> pujas) {
    final filtered = _searchQuery.isEmpty
        ? pujas
        : pujas
              .where(
                (p) =>
                    p.name.toLowerCase().contains(_searchQuery) ||
                    p.category.toLowerCase().contains(_searchQuery),
              )
              .toList();

    if (filtered.isEmpty) {
      return Center(
        child: Text(
          'No sacred rituals found.',
          style: TextStyle(color: _SanctuaryTheme.onSurfaceVariant),
        ),
      );
    }

    return GridView.builder(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 120),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.72,
        mainAxisSpacing: 20,
        crossAxisSpacing: 20,
      ),
      itemCount: filtered.length,
      itemBuilder: (_, i) => _buildPujaCard(filtered[i]),
    );
  }

  Widget _buildPujaCard(_PujaItem p) {
    return GestureDetector(
      onTap: () => context.push('/home/create-request'),
      child: Container(
        decoration: BoxDecoration(
          color: _SanctuaryTheme.surfaceLow,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: AppColors.border.withOpacity(0.5)),
          boxShadow: [_SanctuaryTheme.ambientShadow],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image area
            Stack(
              children: [
                Container(
                  height: 130,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        p.baseColor.withOpacity(0.15),
                        p.baseColor.withOpacity(0.02),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(24),
                    ),
                  ),
                  child: Center(
                    child: Text(p.emoji, style: const TextStyle(fontSize: 60)),
                  ),
                ),
                if (p.isPopular)
                  Positioned(
                    top: 12,
                    right: 12,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(20),
                      child: BackdropFilter(
                        filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: _SanctuaryTheme.secondary.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: _SanctuaryTheme.secondary.withOpacity(0.3),
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.local_fire_department_rounded,
                                size: 10,
                                color: _SanctuaryTheme.secondary,
                              ),
                              const SizedBox(width: 2),
                              Text(
                                'Popular',
                                style: TextStyle(
                                  color: _SanctuaryTheme.secondary,
                                  fontSize: 9,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            // Info
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      p.name,
                      style: TextStyle(
                        color: _SanctuaryTheme.onSurface,
                        fontWeight: FontWeight.w800,
                        fontSize: 14,
                        height: 1.2,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const Spacer(),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          p.price,
                          style: TextStyle(
                            color: _SanctuaryTheme.primaryDim,
                            fontWeight: FontWeight.w800,
                            fontSize: 13,
                          ),
                        ),
                        Row(
                          children: [
                            Icon(
                              Icons.star_rounded,
                              color: AppColors.warning,
                              size: 14,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              '${p.rating}',
                              style: TextStyle(
                                color: _SanctuaryTheme.onSurfaceVariant,
                                fontWeight: FontWeight.w700,
                                fontSize: 11,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDarshanList() {
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 120),
      itemCount: _darshanItems.length,
      separatorBuilder: (_, __) => const SizedBox(height: 20),
      itemBuilder: (_, i) {
        final d = _darshanItems[i];
        return GestureDetector(
          onTap: () {},
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: _SanctuaryTheme.surfaceLow,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: AppColors.border.withOpacity(0.5)),
              boxShadow: [_SanctuaryTheme.ambientShadow],
            ),
            child: Row(
              children: [
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        _SanctuaryTheme.primary.withOpacity(0.2),
                        _SanctuaryTheme.primary.withOpacity(0.05),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Center(
                    child: Text(d.emoji, style: const TextStyle(fontSize: 44)),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              d.name,
                              style: TextStyle(
                                color: _SanctuaryTheme.onSurface,
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.success.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Text(
                              'VIP Pass',
                              style: TextStyle(
                                color: AppColors.success,
                                fontSize: 9,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        d.location,
                        style: TextStyle(
                          color: _SanctuaryTheme.onSurfaceVariant,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            d.price,
                            style: TextStyle(
                              color: _SanctuaryTheme.primaryDim,
                              fontWeight: FontWeight.w900,
                              fontSize: 14,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 20,
                              vertical: 8,
                            ),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  _SanctuaryTheme.primary,
                                  _SanctuaryTheme.primaryDim,
                                ],
                              ),
                              borderRadius: BorderRadius.circular(100),
                              boxShadow: [_SanctuaryTheme.primaryGlow],
                            ),
                            child: const Text(
                              'Secure Spot',
                              style: TextStyle(
                                color: AppColors.textPrimary,
                                fontWeight: FontWeight.w800,
                                fontSize: 12,
                              ),
                            ),
                          ),
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
    );
  }

  // ─── Data ──────────────────────────────────────────────────────────────────

  final _offlinePujas = [
    _PujaItem(
      '🪔',
      'Satyanarayan Katha',
      'Offline',
      '₹1,500',
      4.9,
      true,
      AppColors.primary,
    ),
    _PujaItem(
      '🏠',
      'Griha Pravesh',
      'Offline',
      '₹2,100',
      4.8,
      false,
      AppColors.warning,
    ),
    _PujaItem(
      '💍',
      'Vivah Puja',
      'Offline',
      '₹5,000',
      4.9,
      true,
      AppColors.secondary,
    ),
    _PujaItem(
      '🔱',
      'Rudrabhishek',
      'Offline',
      '₹3,000',
      4.7,
      false,
      AppColors.success,
    ),
    _PujaItem(
      '🌸',
      'Durga Puja',
      'Offline',
      '₹2,500',
      4.8,
      true,
      AppColors.secondary,
    ),
    _PujaItem(
      '🌙',
      'Navgrah Shanti',
      'Offline',
      '₹2,100',
      4.9,
      false,
      AppColors.info,
    ),
    _PujaItem(
      '🪬',
      'Vastu Shanti',
      'Offline',
      '₹1,800',
      4.6,
      false,
      AppColors.success,
    ),
    _PujaItem(
      '🎊',
      'Ganesh Puja',
      'Offline',
      '₹900',
      4.7,
      true,
      AppColors.warning,
    ),
  ];

  List<_PujaItem> get _allPujas => [..._offlinePujas];

  final _darshanItems = [
    _DarshanItem('🛕', 'Kashi Vishwanath', 'Varanasi, UP', '₹499/person'),
    _DarshanItem('🌟', 'Tirupati Balaji', 'Andhra Pradesh', '₹799/person'),
    _DarshanItem('✨', 'Shirdi Sai Baba', 'Nashik, MH', '₹299/person'),
    _DarshanItem('💛', 'Golden Temple', 'Amritsar, Punjab', '₹199/person'),
    _DarshanItem('🔱', 'Somnath Temple', 'Gir, Gujarat', '₹399/person'),
    _DarshanItem('🌸', 'Vaishno Devi', 'Jammu & Kashmir', '₹599/person'),
  ];
}

// ─── Data Models ───────────────────────────────────────────────────────────────

class _PujaItem {
  final String emoji, name, category, price;
  final double rating;
  final bool isPopular;
  final Color baseColor;

  const _PujaItem(
    this.emoji,
    this.name,
    this.category,
    this.price,
    this.rating,
    this.isPopular,
    this.baseColor,
  );
}

class _DarshanItem {
  final String emoji, name, location, price;
  const _DarshanItem(this.emoji, this.name, this.location, this.price);
}
