import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_text_styles.dart';
import '../../core/widgets/common_widgets.dart';

class OtpScreen extends StatefulWidget {
  final String phone;
  const OtpScreen({super.key, required this.phone});

  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  final List<TextEditingController> _ctrlList = List.generate(
    6,
    (_) => TextEditingController(),
  );
  final List<FocusNode> _focusList = List.generate(6, (_) => FocusNode());
  bool _isLoading = false;
  int _resendCountdown = 30;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() {
    Future.doWhile(() async {
      await Future.delayed(const Duration(seconds: 1));
      if (!mounted) return false;
      setState(() {
        if (_resendCountdown > 0) _resendCountdown--;
      });
      return _resendCountdown > 0;
    });
  }

  String get _otp => _ctrlList.map((c) => c.text).join();
  bool get _isComplete => _otp.length == 6;

  void _onChanged(int index, String val) {
    if (val.length == 1 && index < 5) {
      _focusList[index + 1].requestFocus();
    }
    setState(() {});
  }

  void _onKey(int index, KeyEvent e) {
    if (e is KeyDownEvent &&
        e.logicalKey == LogicalKeyboardKey.backspace &&
        _ctrlList[index].text.isEmpty &&
        index > 0) {
      _focusList[index - 1].requestFocus();
    }
  }

  void _verify() {
    if (!_isComplete) return;
    setState(() => _isLoading = true);
    Future.delayed(const Duration(milliseconds: 900), () {
      if (mounted) {
        setState(() => _isLoading = false);
        context.go('/home');
      }
    });
  }

  @override
  void dispose() {
    for (final c in _ctrlList) {
      c.dispose();
    }
    for (final f in _focusList) {
      f.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.splashGradient),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 16),
                IconButton(
                  icon: const Icon(Icons.arrow_back_ios_new_rounded),
                  onPressed: () => context.pop(),
                  style: IconButton.styleFrom(
                    backgroundColor: AppColors.card,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                ),

                const SizedBox(height: 32),

                // Title
                Text('Verify OTP 🔐', style: AppTextStyles.h1),
                const SizedBox(height: 8),
                RichText(
                  text: TextSpan(
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: AppColors.textSecondary,
                    ),
                    children: [
                      const TextSpan(text: 'OTP sent to  '),
                      TextSpan(
                        text: '+91 ${widget.phone}',
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 40),

                // 6-digit OTP boxes
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: List.generate(
                    6,
                    (i) => _OtpBox(
                      controller: _ctrlList[i],
                      focusNode: _focusList[i],
                      onChanged: (v) => _onChanged(i, v),
                      onKey: (e) => _onKey(i, e),
                      filled: _ctrlList[i].text.isNotEmpty,
                    ),
                  ),
                ),

                const SizedBox(height: 16),

                // Resend
                Row(
                  children: [
                    Text(
                      "Didn't receive OTP? ",
                      style: AppTextStyles.bodySmall,
                    ),
                    _resendCountdown > 0
                        ? Text(
                            'Resend in ${_resendCountdown}s',
                            style: AppTextStyles.bodySmall.copyWith(
                              color: AppColors.textHint,
                            ),
                          )
                        : GestureDetector(
                            onTap: () => setState(() => _resendCountdown = 30),
                            child: Text(
                              'Resend OTP',
                              style: AppTextStyles.bodySmall.copyWith(
                                color: AppColors.secondary,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                  ],
                ),

                const SizedBox(height: 40),

                PrimaryButton(
                  label: 'Verify & Continue',
                  onTap: _isComplete ? _verify : null,
                  isLoading: _isLoading,
                ),

                const Spacer(),

                // Trust note
                Center(
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.lock_outline_rounded,
                        size: 14,
                        color: AppColors.textHint,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        'Your number is never shared with anyone',
                        style: AppTextStyles.caption,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _OtpBox extends StatelessWidget {
  final TextEditingController controller;
  final FocusNode focusNode;
  final ValueChanged<String> onChanged;
  final ValueChanged<KeyEvent> onKey;
  final bool filled;

  const _OtpBox({
    required this.controller,
    required this.focusNode,
    required this.onChanged,
    required this.onKey,
    required this.filled,
  });

  @override
  Widget build(BuildContext context) {
    return KeyboardListener(
      focusNode: FocusNode(),
      onKeyEvent: onKey,
      child: SizedBox(
        width: 48,
        height: 56,
        child: TextField(
          controller: controller,
          focusNode: focusNode,
          onChanged: onChanged,
          keyboardType: TextInputType.number,
          maxLength: 1,
          textAlign: TextAlign.center,
          style: AppTextStyles.h3,
          buildCounter:
              (_, {required currentLength, required isFocused, maxLength}) =>
                  null,
          decoration: InputDecoration(
            counterText: '',
            filled: true,
            fillColor: filled ? AppColors.accent : AppColors.card,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(
                color: filled ? AppColors.primary : AppColors.border,
                width: 2,
              ),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(
                color: filled ? AppColors.primary : AppColors.border,
                width: filled ? 2 : 1.5,
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(
                color: AppColors.primary,
                width: 2.5,
              ),
            ),
            contentPadding: EdgeInsets.zero,
          ),
        ),
      ),
    );
  }
}
