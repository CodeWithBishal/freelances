import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_text_styles.dart';

class PujaListScreen extends StatefulWidget {
  const PujaListScreen({super.key});

  @override
  State<PujaListScreen> createState() => _PujaListScreenState();
}

class _PujaListScreenState extends State<PujaListScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tab;
  String _searchQuery = '';

  final _tabs = ['All', 'Offline', 'Online', 'VIP Darshan'];

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: _tabs.length, vsync: this);
    _tab.addListener(() => setState(() {}));
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
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(),
            _buildSearchBar(),
            _buildTabBar(),
            Expanded(
              child: TabBarView(
                controller: _tab,
                children: [
                  _buildPujaGrid(_allPujas),
                  _buildPujaGrid(_offlinePujas),
                  _buildPujaGrid(_onlinePujas),
                  _buildDarshanList(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 10),
      color: AppColors.background,
      child: Row(
        children: [
          Text('Explore Pujas', style: AppTextStyles.h3),
          const Spacer(),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.12),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.primary.withOpacity(0.3)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.tune_rounded,
                    size: 14, color: AppColors.textPrimary),
                const SizedBox(width: 5),
                Text(
                  'Filter',
                  style: AppTextStyles.caption.copyWith(
                    color: AppColors.textPrimary,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
      child: TextField(
        onChanged: (v) => setState(() => _searchQuery = v.toLowerCase()),
        style: AppTextStyles.bodyMedium,
        decoration: InputDecoration(
          hintText: 'Search pujas, rituals...',
          hintStyle: AppTextStyles.bodyMedium.copyWith(
            color: AppColors.textHint,
          ),
          prefixIcon: const Icon(Icons.search_rounded,
              color: AppColors.textHint, size: 20),
          filled: true,
          fillColor: AppColors.card,
          contentPadding: const EdgeInsets.symmetric(vertical: 12),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: const BorderSide(color: AppColors.border),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: const BorderSide(color: AppColors.border),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide:
                const BorderSide(color: AppColors.primary, width: 1.5),
          ),
        ),
      ),
    );
  }

  Widget _buildTabBar() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: TabBar(
        controller: _tab,
        indicator: BoxDecoration(
          color: AppColors.primary,
          borderRadius: BorderRadius.circular(10),
        ),
        indicatorSize: TabBarIndicatorSize.tab,
        dividerColor: Colors.transparent,
        labelStyle: AppTextStyles.caption.copyWith(
          fontWeight: FontWeight.w700,
          color: AppColors.textPrimary,
        ),
        unselectedLabelStyle: AppTextStyles.caption.copyWith(
          fontWeight: FontWeight.w500,
          color: AppColors.textSecondary,
        ),
        labelColor: AppColors.textPrimary,
        unselectedLabelColor: AppColors.textSecondary,
        tabs: _tabs.map((t) => Tab(text: t)).toList(),
      ),
    );
  }

  Widget _buildPujaGrid(List<_PujaItem> pujas) {
    final filtered = _searchQuery.isEmpty
        ? pujas
        : pujas
            .where((p) =>
                p.name.toLowerCase().contains(_searchQuery) ||
                p.category.toLowerCase().contains(_searchQuery))
            .toList();

    if (filtered.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('🔍', style: TextStyle(fontSize: 48)),
            const SizedBox(height: 12),
            Text('No pujas found',
                style: AppTextStyles.h4.copyWith(color: AppColors.textSecondary)),
          ],
        ),
      );
    }

    return GridView.builder(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.82,
        mainAxisSpacing: 14,
        crossAxisSpacing: 14,
      ),
      itemCount: filtered.length,
      itemBuilder: (_, i) {
        final p = filtered[i];
        return _buildPujaCard(p);
      },
    );
  }

  Widget _buildPujaCard(_PujaItem p) {
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
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image area
            Stack(
              children: [
                Container(
                  height: 110,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        p.color.withOpacity(0.2),
                        p.color.withOpacity(0.05),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(17),
                    ),
                  ),
                  child: Center(
                    child: Text(p.emoji,
                        style: const TextStyle(fontSize: 48)),
                  ),
                ),
                // Type badge
                Positioned(
                  top: 8,
                  left: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 7, vertical: 3),
                    decoration: BoxDecoration(
                      color: p.badgeColor,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      p.badge,
                      style: AppTextStyles.caption.copyWith(
                        color: Colors.white,
                        fontSize: 9,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                ),
                if (p.isPopular)
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 6, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppColors.secondary,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        '🔥',
                        style: AppTextStyles.caption.copyWith(fontSize: 10),
                      ),
                    ),
                  ),
              ],
            ),
            // Info
            Padding(
              padding: const EdgeInsets.fromLTRB(10, 8, 10, 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    p.name,
                    style: AppTextStyles.labelSmall.copyWith(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.w700,
                      fontSize: 12,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Row(
                    children: [
                      const Icon(Icons.star_rounded,
                          color: AppColors.warning, size: 12),
                      const SizedBox(width: 2),
                      Text('${p.rating}',
                          style: AppTextStyles.caption.copyWith(
                            fontWeight: FontWeight.w600,
                          )),
                    ],
                  ),
                  const SizedBox(height: 3),
                  Text(
                    p.price,
                    style: AppTextStyles.caption.copyWith(
                      color: AppColors.secondary,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDarshanList() {
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
      itemCount: _darshanItems.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (_, i) {
        final d = _darshanItems[i];
        return GestureDetector(
          onTap: () {},
          child: Container(
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
                  width: 70,
                  height: 70,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        AppColors.primary.withOpacity(0.2),
                        AppColors.primary.withOpacity(0.05),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Center(
                    child:
                        Text(d.emoji, style: const TextStyle(fontSize: 36)),
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
                              d.name,
                              style: AppTextStyles.h4.copyWith(
                                fontSize: 15,
                              ),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 7, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppColors.success.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                  color: AppColors.success.withOpacity(0.3)),
                            ),
                            child: Text(
                              '✓ VIP',
                              style: AppTextStyles.caption.copyWith(
                                color: AppColors.success,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(d.location, style: AppTextStyles.caption),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          _tag(
                              Icons.confirmation_number_outlined,
                              'Fast Entry',
                              AppColors.primary),
                          const SizedBox(width: 6),
                          _tag(Icons.qr_code_rounded, 'QR Pass',
                              AppColors.info),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Text(
                            d.price,
                            style: AppTextStyles.priceSmall,
                          ),
                          const Spacer(),
                          GestureDetector(
                            onTap: () {},
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 14, vertical: 6),
                              decoration: BoxDecoration(
                                color: AppColors.primary,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Text(
                                'Book →',
                                style: AppTextStyles.caption.copyWith(
                                  color: AppColors.textPrimary,
                                  fontWeight: FontWeight.w800,
                                ),
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

  Widget _tag(IconData icon, String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 10, color: color),
          const SizedBox(width: 3),
          Text(label,
              style: AppTextStyles.caption.copyWith(
                color: color,
                fontWeight: FontWeight.w700,
                fontSize: 9.5,
              )),
        ],
      ),
    );
  }

  // ─── Data ──────────────────────────────────────────────────────────────────

  final _offlinePujas = [
    _PujaItem('🪔', 'Satyanarayan Katha', 'Offline', '₹1,500+', 4.9, true,
        AppColors.primary, AppColors.textPrimary, '📍 Offline'),
    _PujaItem('🏠', 'Griha Pravesh', 'Offline', '₹2,100+', 4.8, false,
        AppColors.warning, AppColors.warning, '📍 Offline'),
    _PujaItem('💍', 'Vivah Puja', 'Offline', '₹5,000+', 4.9, true,
        AppColors.secondary, AppColors.secondary, '📍 Offline'),
    _PujaItem('🔱', 'Rudrabhishek', 'Offline', '₹3,000+', 4.7, false,
        AppColors.success, AppColors.success, '📍 Offline'),
    _PujaItem('🌸', 'Durga Puja', 'Offline', '₹2,500+', 4.8, true,
        AppColors.secondary, AppColors.secondary, '📍 Offline'),
    _PujaItem('🌙', 'Navgrah Shanti', 'Offline', '₹2,100+', 4.9, false,
        AppColors.info, AppColors.info, '📍 Offline'),
    _PujaItem('🪬', 'Vastu Shanti', 'Offline', '₹1,800+', 4.6, false,
        AppColors.success, AppColors.success, '📍 Offline'),
    _PujaItem('🎊', 'Ganesh Puja', 'Offline', '₹900+', 4.7, true,
        AppColors.warning, AppColors.warning, '📍 Offline'),
  ];

  final _onlinePujas = [
    _PujaItem('💻', 'Live Satyanarayan', 'Online', '₹599+', 4.8, true,
        AppColors.info, AppColors.info, '💻 Online'),
    _PujaItem('📱', 'Video Havan', 'Online', '₹799+', 4.7, false,
        AppColors.info, AppColors.info, '💻 Online'),
    _PujaItem('🙏', 'Online Rudrabhishek', 'Online', '₹999+', 4.9, true,
        AppColors.info, AppColors.info, '💻 Online'),
    _PujaItem('🌺', 'E-Durga Pooja', 'Online', '₹499+', 4.6, true,
        AppColors.info, AppColors.info, '💻 Online'),
    _PujaItem('🔥', 'Online Navgrah', 'Online', '₹649+', 4.8, false,
        AppColors.info, AppColors.info, '💻 Online'),
  ];

  List<_PujaItem> get _allPujas => [..._offlinePujas, ..._onlinePujas];

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
  final String emoji, name, category, price, badge;
  final double rating;
  final bool isPopular;
  final Color color, badgeColor;
  const _PujaItem(this.emoji, this.name, this.category, this.price,
      this.rating, this.isPopular, this.color, this.badgeColor, this.badge);
}

class _DarshanItem {
  final String emoji, name, location, price;
  const _DarshanItem(this.emoji, this.name, this.location, this.price);
}
