import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_text_styles.dart';
import '../../core/widgets/common_widgets.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _phoneCtrl = TextEditingController();
  bool _isLoading = false;

  void _sendOtp() {
    if (_phoneCtrl.text.length == 10) {
      setState(() => _isLoading = true);
      Future.delayed(const Duration(milliseconds: 800), () {
        if (mounted) {
          setState(() => _isLoading = false);
          context.push('/otp?phone=${_phoneCtrl.text}');
        }
      });
    }
  }

  @override
  void dispose() {
    _phoneCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.splashGradient),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 32),

                // Back / logo area
                Center(child: const AppLogo(size: 72)),

                const SizedBox(height: 48),

                // Illustration card
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppColors.card,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: AppColors.border),
                    boxShadow: AppColors.softShadow,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Welcome Back 🙏', style: AppTextStyles.h2),
                      const SizedBox(height: 6),
                      Text(
                        'Enter your phone number to continue',
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),

                      const SizedBox(height: 28),

                      // Phone field
                      Text('Phone Number', style: AppTextStyles.labelMedium),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _phoneCtrl,
                        keyboardType: TextInputType.phone,
                        inputFormatters: [
                          FilteringTextInputFormatter.digitsOnly,
                          LengthLimitingTextInputFormatter(10),
                        ],
                        onChanged: (_) => setState(() {}),
                        style: AppTextStyles.bodyLarge,
                        decoration: InputDecoration(
                          hintText: '98765 43210',
                          prefixIcon: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 14,
                            ),
                            margin: const EdgeInsets.only(right: 8),
                            decoration: const BoxDecoration(
                              border: Border(
                                right: BorderSide(color: AppColors.border),
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Text(
                                  '🇮🇳',
                                  style: TextStyle(fontSize: 18),
                                ),
                                const SizedBox(width: 6),
                                Text('+91', style: AppTextStyles.labelMedium),
                              ],
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(height: 8),
                      Text(
                        'We\'ll send a 6-digit OTP to verify your number',
                        style: AppTextStyles.caption,
                      ),

                      const SizedBox(height: 28),

                      PrimaryButton(
                        label: 'Send OTP',
                        onTap: _phoneCtrl.text.length == 10 ? _sendOtp : null,
                        isLoading: _isLoading,
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 32),

                // Divider
                Row(
                  children: [
                    Expanded(child: Divider(color: AppColors.border)),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      child: Text('OR', style: AppTextStyles.caption),
                    ),
                    Expanded(child: Divider(color: AppColors.border)),
                  ],
                ),

                const SizedBox(height: 24),

                // Continue as guest (demo shortcut)
                SecondaryButton(
                  label: '👀  Browse as Guest',
                  onTap: () => context.go('/home'),
                ),

                const SizedBox(height: 40),

                // Benefits row
                ..._benefits.map((b) => _BenefitRow(icon: b.$1, text: b.$2)),

                const SizedBox(height: 24),

                // Terms
                Center(
                  child: Text(
                    'By continuing, you agree to our Terms & Privacy Policy',
                    style: AppTextStyles.caption,
                    textAlign: TextAlign.center,
                  ),
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

const _benefits = [
  ('🛡️', 'Aadhaar-verified pandits'),
  ('⚡', 'Get bids in under 2 minutes'),
  ('💳', 'Secure escrow payments'),
];

class _BenefitRow extends StatelessWidget {
  final String icon;
  final String text;

  const _BenefitRow({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Text(icon, style: const TextStyle(fontSize: 18)),
          const SizedBox(width: 12),
          Text(text, style: AppTextStyles.bodyMedium),
        ],
      ),
    );
  }
}
