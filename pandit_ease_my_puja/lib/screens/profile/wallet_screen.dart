import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';
import '../../widgets/custom_cached_image.dart';

class WalletScreen extends StatelessWidget {
  const WalletScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.card,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textDark),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Wallet & Payments',
          style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.textDark),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Balance Card
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(16),
                image: DecorationImage(
                  image: CustomCachedImage.provider('https://www.transparenttextures.com/patterns/microbial-mat.png'), // Subtle dots texture pattern
                  opacity: 0.1,
                  fit: BoxFit.cover,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Available Balance',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: const Color(0xFF4A3500),
                        ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '₹12,450',
                    style: Theme.of(context).textTheme.displaySmall?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: AppColors.textDark,
                        ),
                  ),
                  const SizedBox(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      ElevatedButton(
                        onPressed: () {},
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0D1B2A), // Dark Navy
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: const [
                            Text('Withdraw', style: TextStyle(fontWeight: FontWeight.bold)),
                            SizedBox(width: 8),
                            Icon(Icons.arrow_forward, size: 16),
                          ],
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            'Next Payout',
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                  color: const Color(0xFF4A3500),
                                ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '15 Oct 2023',
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.textDark,
                                ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Recent Transactions
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Recent Transactions',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                ),
                Text(
                  'View All',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            _buildTransactionTile(
              context,
              iconData: Icons.south_west,
              iconBgHex: 0xFFDFF1CE,
              iconColorHex: 0xFF2E7D32,
              title: 'Grah Shanti Puja Booking',
              date: '12 Oct 2023',
              amount: '+₹1,500',
              amountColor: AppColors.success,
              status: 'Completed',
              statusBgHex: 0xFFE8F5E9,
              statusColorHex: 0xFF2E7D32,
            ),
            const Divider(color: AppColors.border, height: 32),
            _buildTransactionTile(
              context,
              iconData: Icons.account_balance,
              iconBgHex: 0xFFF3F5F7,
              iconColorHex: 0xFF455A64,
              title: 'Withdrawal to Bank',
              date: '10 Oct 2023',
              amount: '-₹5,000',
              amountColor: AppColors.textDark,
              status: 'Completed',
              statusBgHex: 0xFFF3F5F7,
              statusColorHex: 0xFF455A64,
            ),
            const Divider(color: AppColors.border, height: 32),
            _buildTransactionTile(
              context,
              iconData: Icons.schedule,
              iconBgHex: 0xFFFFF3E0,
              iconColorHex: 0xFFE65100,
              title: 'Navratri Special Puja',
              date: '09 Oct 2023',
              amount: '+₹2,100',
              amountColor: const Color(0xFFE65100),
              status: 'Pending',
              statusBgHex: 0xFFFFF3E0,
              statusColorHex: 0xFFE65100,
            ),
            const Divider(color: AppColors.border, height: 32),
            _buildTransactionTile(
              context,
              iconData: Icons.south_west,
              iconBgHex: 0xFFDFF1CE,
              iconColorHex: 0xFF2E7D32,
              title: 'Vastu Shanti Consultation',
              date: '05 Oct 2023',
              amount: '+₹3,500',
              amountColor: AppColors.success,
              status: 'Completed',
              statusBgHex: 0xFFE8F5E9,
              statusColorHex: 0xFF2E7D32,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTransactionTile(
    BuildContext context, {
    required IconData iconData,
    required int iconBgHex,
    required int iconColorHex,
    required String title,
    required String date,
    required String amount,
    required Color amountColor,
    required String status,
    required int statusBgHex,
    required int statusColorHex,
  }) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Color(iconBgHex),
            shape: BoxShape.circle,
          ),
          child: Icon(iconData, color: Color(iconColorHex), size: 24),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                      color: AppColors.textDark,
                    ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 6),
              Row(
                children: [
                  Text(
                    date,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppColors.textLight,
                        ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    '•',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppColors.textLight,
                        ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: Color(statusBgHex),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      status,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: Color(statusColorHex),
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                          ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(width: 8),
        Text(
          amount,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: amountColor,
              ),
        ),
      ],
    );
  }
}
