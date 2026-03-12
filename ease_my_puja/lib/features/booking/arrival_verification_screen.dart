import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_text_styles.dart';
import '../../core/widgets/common_widgets.dart';

class ArrivalVerificationScreen extends StatefulWidget {
  const ArrivalVerificationScreen({super.key});

  @override
  State<ArrivalVerificationScreen> createState() =>
      _ArrivalVerificationScreenState();
}

class _ArrivalVerificationScreenState extends State<ArrivalVerificationScreen>
    with TickerProviderStateMixin {
  late AnimationController _pulseCtrl;
  late Animation<double> _pulseAnim;
  bool _panditArrived = false;

  final String _otp = '847291';

  @override
  void initState() {
    super.initState();
    _pulseCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    )..repeat(reverse: true);
    _pulseAnim = Tween<double>(begin: 0.95, end: 1.05).animate(_pulseCtrl);
  }

  @override
  void dispose() {
    _pulseCtrl.dispose();
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
        title: const Text('Arrival Verification'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Status card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.border),
                boxShadow: AppColors.softShadow,
              ),
              child: Column(
                children: [
                  // Pandit avatar with pulse
                  ScaleTransition(
                    scale: _pulseAnim,
                    child: Container(
                      width: 90,
                      height: 90,
                      decoration: BoxDecoration(
                        gradient: AppColors.primaryGradient,
                        shape: BoxShape.circle,
                        boxShadow: AppColors.cardShadow,
                      ),
                      child: const Center(
                        child: Text('👨‍🦳', style: TextStyle(fontSize: 44)),
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),
                  Text('Pt. Ramesh Sharma', style: AppTextStyles.h3),
                  const SizedBox(height: 4),
                  StatusBadge(
                    label: _panditArrived ? '✅ Pandit Arrived' : '🚗 En Route',
                    color: _panditArrived
                        ? AppColors.success
                        : AppColors.warning,
                  ),
                  if (!_panditArrived) ...[
                    const SizedBox(height: 8),
                    Text(
                      'Arriving in approximately 3 minutes',
                      style: AppTextStyles.bodySmall,
                    ),
                  ],
                  const SizedBox(height: 20),
                  const Divider(color: AppColors.border),
                  const SizedBox(height: 16),

                  // OTP display
                  Text('Your OTP', style: AppTextStyles.h4),
                  const SizedBox(height: 6),
                  Text(
                    'Share this code with the pandit to start the puja',
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: _otp.split('').map((digit) {
                      return Container(
                        width: 48,
                        height: 56,
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        decoration: BoxDecoration(
                          gradient: AppColors.primaryGradient,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: AppColors.cardShadow,
                        ),
                        child: Center(
                          child: Text(
                            digit,
                            style: AppTextStyles.h2.copyWith(
                              color: Colors.white,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    '⚠️ Do not share this OTP before pandit arrives',
                    style: AppTextStyles.caption.copyWith(
                      color: AppColors.warning,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Pandit details card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                children: [
                  const Text('🪔', style: TextStyle(fontSize: 32)),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Satyanarayan Katha',
                          style: AppTextStyles.labelMedium,
                        ),
                        Text('Today • 9:00 AM', style: AppTextStyles.bodySmall),
                      ],
                    ),
                  ),
                  Text('₹1,500', style: AppTextStyles.price),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Action buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.call_outlined, size: 18),
                    label: const Text('Call Pandit'),
                    onPressed: () {},
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.map_outlined, size: 18),
                    label: const Text('Track'),
                    onPressed: () => context.push('/home/tracking'),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Mark arrived (simulated)
            if (!_panditArrived)
              PrimaryButton(
                label: 'Pandit Arrived? Confirm',
                onTap: () => setState(() => _panditArrived = true),
              ),

            const SizedBox(height: 16),

            // Report mismatch
            TextButton.icon(
              icon: const Icon(
                Icons.report_outlined,
                size: 16,
                color: AppColors.error,
              ),
              label: Text(
                'Report wrong pandit',
                style: AppTextStyles.bodySmall.copyWith(
                  color: AppColors.error,
                  fontWeight: FontWeight.w600,
                ),
              ),
              onPressed: () {},
            ),
          ],
        ),
      ),
    );
  }
}
