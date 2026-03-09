import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_text_styles.dart';
import '../../core/widgets/common_widgets.dart';

class BookingConfirmationScreen extends StatefulWidget {
  const BookingConfirmationScreen({super.key});

  @override
  State<BookingConfirmationScreen> createState() =>
      _BookingConfirmationScreenState();
}

class _BookingConfirmationScreenState extends State<BookingConfirmationScreen> {
  String _selectedPayment = 'UPI';

  final _requirements = [
    ('🌸', 'Flowers', 'Provided by pandit'),
    ('🧈', 'Ghee', 'Arrange yourself'),
    ('🪔', 'Diya & lamp oil', 'Arrange yourself'),
    ('🍌', 'Fruits', 'Provided by pandit'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
          onPressed: () => context.pop(),
        ),
        title: const Text('Booking Confirmation'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Pandit card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: AppColors.primaryGradient,
                borderRadius: BorderRadius.circular(18),
                boxShadow: AppColors.cardShadow,
              ),
              child: Row(
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      color: Colors.white30,
                      shape: BoxShape.circle,
                    ),
                    child: const Center(
                      child: Text('👨‍🦳', style: TextStyle(fontSize: 28)),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Pt. Ramesh Sharma', style: AppTextStyles.h3),
                        Text(
                          '⭐ 4.9 • 15 yrs exp • 1.2 km away',
                          style: AppTextStyles.bodySmall,
                        ),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text('₹1,500', style: AppTextStyles.price),
                      Text('Final price', style: AppTextStyles.caption),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Puja details
            _Card(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Puja Details', style: AppTextStyles.h4),
                  const SizedBox(height: 12),
                  const Divider(color: AppColors.border),
                  const SizedBox(height: 8),
                  _DetailRow('Puja Type', '🪔 Satyanarayan Katha'),
                  _DetailRow('Date', '15 March 2026'),
                  _DetailRow('Time', '9:00 AM'),
                  _DetailRow('Duration', '~2.5 hours'),
                  _DetailRow('Location', '45 Koregaon Park, Pune 411001'),
                  _DetailRow('ETA', '12 minutes'),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Requirements
            _Card(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Requirements', style: AppTextStyles.h4),
                  const SizedBox(height: 12),
                  ..._requirements.map(
                    (r) => Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: Row(
                        children: [
                          Text(r.$1, style: const TextStyle(fontSize: 18)),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(r.$2, style: AppTextStyles.bodyMedium),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 3,
                            ),
                            decoration: BoxDecoration(
                              color: r.$3.contains('yourself')
                                  ? AppColors.warning.withOpacity(0.12)
                                  : AppColors.success.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              r.$3,
                              style: AppTextStyles.caption.copyWith(
                                color: r.$3.contains('yourself')
                                    ? AppColors.warning
                                    : AppColors.success,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Security deposit
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.info.withOpacity(0.08),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.info.withOpacity(0.3)),
              ),
              child: Row(
                children: [
                  const Icon(
                    Icons.security_rounded,
                    color: AppColors.info,
                    size: 22,
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Security Deposit: ₹300',
                          style: AppTextStyles.labelMedium,
                        ),
                        Text(
                          'Refundable if pandit doesn\'t arrive. Held in escrow.',
                          style: AppTextStyles.caption,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Payment
            _Card(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Payment Method', style: AppTextStyles.h4),
                  const SizedBox(height: 12),
                  ...[
                    ('💳', 'UPI'),
                    ('🏦', 'Net Banking'),
                    ('👛', 'Wallet'),
                  ].map(
                    (p) => _PaymentOption(
                      icon: p.$1,
                      label: p.$2,
                      selected: _selectedPayment == p.$2,
                      onTap: () => setState(() => _selectedPayment = p.$2),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Price breakdown
            _Card(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Price Breakdown', style: AppTextStyles.h4),
                  const SizedBox(height: 12),
                  _PriceRow('Puja service', '₹1,500'),
                  _PriceRow('Platform fee', '₹50'),
                  _PriceRow('Security deposit', '₹300'),
                  const Divider(height: 20, color: AppColors.border),
                  _PriceRow('Total', '₹1,850', bold: true),
                ],
              ),
            ),
            const SizedBox(height: 24),

            PrimaryButton(
              label: '✅  Confirm Booking',
              onTap: () => context.push('/home/payment'),
            ),
            const SizedBox(height: 16),
            Text(
              'Payment will be held in escrow until service completion',
              style: AppTextStyles.caption,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }
}

class _Card extends StatelessWidget {
  final Widget child;
  const _Card({required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
        boxShadow: AppColors.softShadow,
      ),
      child: child,
    );
  }
}

class _DetailRow extends StatelessWidget {
  final String label, value;
  const _DetailRow(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 90,
            child: Text(label, style: AppTextStyles.bodySmall),
          ),
          Expanded(
            child: Text(
              value,
              style: AppTextStyles.bodyMedium.copyWith(
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _PriceRow extends StatelessWidget {
  final String label, value;
  final bool bold;
  const _PriceRow(this.label, this.value, {this.bold = false});

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
            style: bold ? AppTextStyles.price : AppTextStyles.bodyMedium,
          ),
        ],
      ),
    );
  }
}

class _PaymentOption extends StatelessWidget {
  final String icon, label;
  final bool selected;
  final VoidCallback onTap;

  const _PaymentOption({
    required this.icon,
    required this.label,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: selected ? AppColors.accent : AppColors.background,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: selected ? AppColors.primary : AppColors.border,
            width: selected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Text(icon, style: const TextStyle(fontSize: 20)),
            const SizedBox(width: 10),
            Text(label, style: AppTextStyles.labelMedium),
            const Spacer(),
            if (selected)
              const Icon(
                Icons.check_circle_rounded,
                color: AppColors.primary,
                size: 20,
              ),
          ],
        ),
      ),
    );
  }
}
