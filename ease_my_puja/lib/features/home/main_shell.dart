import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_text_styles.dart';

/// Wraps all 5 bottom-nav tabs in a single shell so the bar persists across
/// page changes without being re-created.
class MainShell extends StatefulWidget {
  final Widget child;
  const MainShell({super.key, required this.child});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _selectedIndex = 0;

  static const _routes = [
    '/home',
    '/home/puja-list',
    '/home/create-request', // FAB – push, don't navigate shell
    '/home/history',
    '/home/profile',
  ];

  void _onTap(int i) {
    if (i == 2) {
      // Centre FAB always pushes create-request on top
      context.push('/home/create-request');
      return;
    }
    setState(() => _selectedIndex = i);
    context.go(_routes[i]);
  }

  @override
  Widget build(BuildContext context) {
    // Sync index when the shell's child route changes
    final location = GoRouterState.of(context).uri.path;
    final computed = _computeIndex(location);
    if (computed != _selectedIndex) {
      WidgetsBinding.instance.addPostFrameCallback(
          (_) => setState(() => _selectedIndex = computed));
    }

    return Scaffold(
      body: widget.child,
      bottomNavigationBar: _BottomBar(
        selectedIndex: _selectedIndex,
        onTap: _onTap,
      ),
    );
  }

  int _computeIndex(String path) {
    if (path.startsWith('/home/puja-list')) return 1;
    if (path.startsWith('/home/history')) return 3;
    if (path.startsWith('/home/profile')) return 4;
    return 0; // home
  }
}

// ─── Shared Bottom Bar ────────────────────────────────────────────────────────
class _BottomBar extends StatelessWidget {
  final int selectedIndex;
  final ValueChanged<int> onTap;

  const _BottomBar({required this.selectedIndex, required this.onTap});

  static const _items = [
    (Icons.home_rounded, Icons.home_outlined, 'Home'),
    (Icons.auto_awesome_rounded, Icons.auto_awesome_outlined, 'Pujas'),
    (Icons.add_circle_rounded, Icons.add_circle_rounded, 'Book'),
    (Icons.history_rounded, Icons.history_outlined, 'History'),
    (Icons.person_rounded, Icons.person_outline_rounded, 'Profile'),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.card,
        border: const Border(
            top: BorderSide(color: AppColors.border, width: 0.8)),
        boxShadow: AppColors.softShadow,
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: List.generate(_items.length, (i) {
            final selected = selectedIndex == i;
            final isCenter = i == 2;

            return Expanded(
              child: InkWell(
                onTap: () => onTap(i),
                splashColor: AppColors.primary.withOpacity(0.1),
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: isCenter
                      ? Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 50,
                              height: 50,
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
                                selected
                                    ? _items[i].$1
                                    : _items[i].$2,
                                key: ValueKey(selected),
                                color: selected
                                    ? AppColors.secondary
                                    : AppColors.textHint,
                                size: 24,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              _items[i].$3,
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
