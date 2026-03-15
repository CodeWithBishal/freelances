import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_text_styles.dart';
import '../../core/widgets/common_widgets.dart';

class PaymentSelectionScreen extends StatefulWidget {
  const PaymentSelectionScreen({super.key});

  @override
  State<PaymentSelectionScreen> createState() => _PaymentSelectionScreenState();
}

class _PaymentSelectionScreenState extends State<PaymentSelectionScreen> {
  String _selected = 'UPI';
  final _couponCtrl = TextEditingController();
  bool _couponApplied = false;

  final _upiOptions = ['GPay', 'PhonePe', 'Paytm', 'BHIM'];
  String _selectedUpi = 'GPay';

  @override
  void dispose() {
    _couponCtrl.dispose();
    super.dispose();
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
        title: const Text('Payment'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Amount due
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: AppColors.primaryGradient,
                borderRadius: BorderRadius.circular(18),
                boxShadow: AppColors.cardShadow,
              ),
              child: Column(
                children: [
                  Text('Amount Due', style: AppTextStyles.bodySmall),
                  const SizedBox(height: 4),
                  Text(
                    '₹1,850',
                    style: AppTextStyles.h1.copyWith(fontSize: 36),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Satyanarayan Katha • Pt. Ramesh Sharma',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            Text('Select Payment Method', style: AppTextStyles.h3),
            const SizedBox(height: 14),

            // Payment methods
            _PayMethodTile(
              icon: '💳',
              title: 'UPI',
              subtitle: 'Pay via any UPI app',
              selected: _selected == 'UPI',
              onTap: () => setState(() => _selected = 'UPI'),
              child: _selected == 'UPI'
                  ? Padding(
                      padding: const EdgeInsets.only(top: 12),
                      child: Row(
                        children: _upiOptions.map((u) {
                          final sel = _selectedUpi == u;
                          return GestureDetector(
                            onTap: () => setState(() => _selectedUpi = u),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 180),
                              margin: const EdgeInsets.only(right: 8),
                              padding: const EdgeInsets.symmetric(
                                horizontal: 14,
                                vertical: 8,
                              ),
                              decoration: BoxDecoration(
                                color: sel
                                    ? AppColors.primary
                                    : AppColors.background,
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(
                                  color: sel
                                      ? AppColors.primaryDark
                                      : AppColors.border,
                                ),
                              ),
                              child: Text(
                                u,
                                style: AppTextStyles.labelSmall.copyWith(
                                  fontWeight: sel
                                      ? FontWeight.w700
                                      : FontWeight.w400,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                    )
                  : null,
            ),

            _PayMethodTile(
              icon: '🏦',
              title: 'Net Banking',
              subtitle: 'Use your bank directly',
              selected: _selected == 'NetBanking',
              onTap: () => setState(() => _selected = 'NetBanking'),
            ),

            _PayMethodTile(
              icon: '👛',
              title: 'Wallet',
              subtitle: 'Balance: ₹580',
              selected: _selected == 'Wallet',
              onTap: () => setState(() => _selected = 'Wallet'),
            ),

            _PayMethodTile(
              icon: '🤝',
              title: 'Cash on Delivery',
              subtitle: 'Security deposit ₹300 required',
              selected: _selected == 'COD',
              onTap: () => setState(() => _selected = 'COD'),
            ),

            const SizedBox(height: 20),

            // Coupon
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Coupon / Promo Code', style: AppTextStyles.labelMedium),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _couponCtrl,
                          style: AppTextStyles.bodyMedium,
                          decoration: const InputDecoration(
                            hintText: 'Enter coupon code',
                            prefixIcon: Icon(
                              Icons.local_offer_outlined,
                              size: 18,
                              color: AppColors.textHint,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      ElevatedButton(
                        onPressed: () => setState(() => _couponApplied = true),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 16,
                          ),
                        ),
                        child: Text('Apply', style: AppTextStyles.labelMedium),
                      ),
                    ],
                  ),
                  if (_couponApplied) ...[
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        const Icon(
                          Icons.check_circle_rounded,
                          color: AppColors.success,
                          size: 16,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'PUJA20 applied! ₹200 off',
                          style: AppTextStyles.bodySmall.copyWith(
                            color: AppColors.success,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Breakdown
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                children: [
                  _Row('Service fee', '₹1,500'),
                  _Row('Platform fee', '₹50'),
                  _Row('Security deposit', '₹300'),
                  if (_couponApplied)
                    _Row(
                      'Discount (PUJA20)',
                      '-₹200',
                      valueColor: AppColors.success,
                    ),
                  const Divider(height: 20, color: AppColors.border),
                  _Row(
                    'Total',
                    _couponApplied ? '₹1,650' : '₹1,850',
                    bold: true,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            PrimaryButton(
              label: 'Pay ${_couponApplied ? "₹1,650" : "₹1,850"}  →',
              onTap: () {
                showDialog(
                  context: context,
                  builder: (_) => AlertDialog(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    content: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const SizedBox(height: 10),
                        const Text('✅', style: TextStyle(fontSize: 54)),
                        const SizedBox(height: 12),
                        Text(
                          'Payment Successful!',
                          style: AppTextStyles.h3,
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'Your booking is confirmed. Pandit will arrive in 12 mins.',
                          style: AppTextStyles.bodySmall,
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 20),
                        PrimaryButton(
                          label: 'Track Pandit',
                          onTap: () {
                            Navigator.pop(context);
                            context.push('/home/tracking');
                          },
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }
}

class _PayMethodTile extends StatelessWidget {
  final String icon, title, subtitle;
  final bool selected;
  final VoidCallback onTap;
  final Widget? child;

  const _PayMethodTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.selected,
    required this.onTap,
    this.child,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: selected ? AppColors.accent : AppColors.card,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: selected ? AppColors.primary : AppColors.border,
            width: selected ? 2 : 1,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(icon, style: const TextStyle(fontSize: 22)),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(title, style: AppTextStyles.labelMedium),
                      Text(subtitle, style: AppTextStyles.caption),
                    ],
                  ),
                ),
                if (selected)
                  const Icon(
                    Icons.check_circle_rounded,
                    color: AppColors.primary,
                    size: 22,
                  )
                else
                  const Icon(
                    Icons.radio_button_unchecked,
                    color: AppColors.textHint,
                    size: 22,
                  ),
              ],
            ),
            ?child,
          ],
        ),
      ),
    );
  }
}

class _Row extends StatelessWidget {
  final String label, value;
  final bool bold;
  final Color? valueColor;

  const _Row(this.label, this.value, {this.bold = false, this.valueColor});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: bold ? AppTextStyles.h4 : AppTextStyles.bodyMedium,
            ),
          ),
          Text(
            value,
            style: (bold ? AppTextStyles.price : AppTextStyles.bodyMedium)
                .copyWith(color: valueColor),
          ),
        ],
      ),
    );
  }
}
