import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';

class SubscriptionScreen extends StatelessWidget {
  const SubscriptionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textDark),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Subscription Plans',
          style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.textDark),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            Text(
              'Choose Your Plan',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: AppColors.textDark,
                  ),
            ),
            const SizedBox(height: 8),
            Text(
              'Upgrade to get more puja requests and higher\nranking',
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: AppColors.textLight,
                  ),
            ),
            const SizedBox(height: 32),

            // Free Plan
            _buildPlanCard(
              context,
              title: 'Basic',
              price: 'Free',
              period: '/month',
              buttonText: 'Current Plan',
              isCurrent: true,
              features: [
                'Standard Ranking',
                'Basic Puja Requests',
              ],
              iconColor: AppColors.success,
            ),
            const SizedBox(height: 20),

            // Silver Plan
            _buildPlanCard(
              context,
              title: 'Silver',
              price: '₹999',
              period: '/month',
              buttonText: 'Upgrade to Silver',
              badge: 'POPULAR',
              outlineBorder: true,
              features: [
                'Higher Ranking',
                'More Puja Requests',
                'Priority Support',
              ],
              iconColor: AppColors.primary,
              buttonColor: AppColors.primary,
              buttonTextColor: AppColors.textDark,
            ),
            const SizedBox(height: 20),

            // Gold Plan
            _buildPlanCard(
              context,
              title: 'Gold',
              price: '₹1999',
              period: '/month',
              buttonText: 'Upgrade to Gold',
              badge: 'Best Value',
              badgeColor: AppColors.primary.withOpacity(0.15),
              badgeTextColor: AppColors.primary,
              features: [
                'Top Ranking',
                'Unlimited Puja Requests',
                'Premium Support',
                'Featured Profile',
              ],
              iconColor: AppColors.textDark,
              buttonColor: const Color(0xFF0D1B2A), // Dark Navy
              buttonTextColor: Colors.white,
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildPlanCard(
    BuildContext context, {
    required String title,
    required String price,
    required String period,
    required String buttonText,
    bool isCurrent = false,
    String? badge,
    Color? badgeColor,
    Color? badgeTextColor,
    bool outlineBorder = false,
    required List<String> features,
    required Color iconColor,
    Color? buttonColor,
    Color? buttonTextColor,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: outlineBorder ? AppColors.primary : AppColors.border.withOpacity(0.5),
          width: outlineBorder ? 2 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Stack(
        children: [
          if (badge != null)
            Positioned(
              top: 0,
              right: 0,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: badgeColor ?? AppColors.primary,
                  borderRadius: const BorderRadius.only(
                    topRight: Radius.circular(14),
                    bottomLeft: Radius.circular(12),
                  ),
                ),
                child: Text(
                  badge,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: badgeTextColor ?? AppColors.textDark,
                  ),
                ),
              ),
            ),
          Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 8),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      price,
                      style: Theme.of(context).textTheme.displayMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: AppColors.textDark,
                            height: 1,
                          ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(bottom: 6.0, left: 4),
                      child: Text(
                        period,
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: AppColors.textLight,
                            ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isCurrent ? const Color(0xFFF3F5F7) : buttonColor,
                      foregroundColor: isCurrent ? AppColors.textDark : buttonTextColor,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: Text(
                      buttonText,
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                ...features.map((feature) => _buildFeatureRow(feature, iconColor)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeatureRow(String text, Color iconColor) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        children: [
          Icon(Icons.check_circle, size: 20, color: iconColor),
          const SizedBox(width: 12),
          Text(
            text,
            style: const TextStyle(
              color: AppColors.textDark,
            ),
          ),
        ],
      ),
    );
  }
}
