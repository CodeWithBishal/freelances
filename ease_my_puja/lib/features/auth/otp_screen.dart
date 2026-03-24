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
      backgroundColor: AppColors.card,
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.splashGradient),
        child: SafeArea(
          bottom: false,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                child: IconButton(
                  icon: const Icon(Icons.arrow_back_ios_new_rounded),
                  onPressed: () => context.pop(),
                  style: IconButton.styleFrom(
                    backgroundColor: AppColors.card,
                    elevation: 2,
                    shadowColor: AppColors.primaryDark.withOpacity(0.2),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                ),
              ),

              // Modern Animated Graphic Area
              Expanded(
                child: Center(
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      // Outer glow
                      TweenAnimationBuilder<double>(
                        tween: Tween(begin: 0.0, end: 1.0),
                        duration: const Duration(seconds: 2),
                        builder: (context, value, child) {
                          return Container(
                            width: 180 + (value * 20),
                            height: 180 + (value * 20),
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: RadialGradient(
                                colors: [
                                  AppColors.primary.withOpacity(0.3 * (1 - value)),
                                  AppColors.primary.withOpacity(0.0),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                      // Middle circle
                      Container(
                        width: 140,
                        height: 140,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.card.withOpacity(0.8),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.primary.withOpacity(0.2),
                              blurRadius: 30,
                              spreadRadius: 10,
                            ),
                          ],
                        ),
                      ),
                      // Core icon container
                      Container(
                        padding: const EdgeInsets.all(28),
                        decoration: BoxDecoration(
                          color: AppColors.card,
                          shape: BoxShape.circle,
                          boxShadow: AppColors.cardShadow,
                          border: Border.all(
                            color: AppColors.primary.withOpacity(0.1),
                            width: 2,
                          ),
                        ),
                        child: const Icon(
                          Icons.mark_email_read_rounded,
                          size: 64,
                          color: AppColors.primaryDark,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Bottom card
              Container(
                decoration: BoxDecoration(
                  color: AppColors.card,
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
                  boxShadow: AppColors.softShadow,
                ),
                padding: const EdgeInsets.fromLTRB(28, 40, 28, 32),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text('Verify OTP', style: AppTextStyles.h1.copyWith(fontSize: 28)),
                        const SizedBox(width: 8),
                        const Text('🔐', style: TextStyle(fontSize: 24)),
                      ],
                    ),
                    const SizedBox(height: 12),
                    RichText(
                      text: TextSpan(
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: AppColors.textSecondary,
                          height: 1.5,
                          letterSpacing: 0.2,
                        ),
                        children: [
                          const TextSpan(text: 'We\'ve sent a 6-digit verification code to\n'),
                          TextSpan(
                            text: '+91 ${widget.phone}',
                            style: AppTextStyles.bodyLarge.copyWith(
                              color: AppColors.textPrimary,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 0.5,
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

                    const SizedBox(height: 24),

                    // Resend Section
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "Didn't receive code?",
                          style: AppTextStyles.bodyMedium.copyWith(
                            color: AppColors.textSecondary,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        _resendCountdown > 0
                            ? Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  color: AppColors.border.withOpacity(0.3),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(Icons.timer_outlined, size: 14, color: AppColors.textHint),
                                    const SizedBox(width: 6),
                                    Text(
                                      '00:${_resendCountdown.toString().padLeft(2, '0')}',
                                      style: AppTextStyles.bodySmall.copyWith(
                                        color: AppColors.textSecondary,
                                        fontWeight: FontWeight.w700,
                                        fontFeatures: [const FontFeature.tabularFigures()],
                                      ),
                                    ),
                                  ],
                                ),
                              )
                            : TextButton(
                                onPressed: () {
                                  setState(() => _resendCountdown = 30);
                                  _startTimer();
                                },
                                style: TextButton.styleFrom(
                                  foregroundColor: AppColors.primaryDark,
                                  padding: const EdgeInsets.symmetric(horizontal: 12),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                                child: Text(
                                  'Resend OTP',
                                  style: AppTextStyles.bodySmall.copyWith(
                                    fontWeight: FontWeight.w800,
                                    decoration: TextDecoration.underline,
                                  ),
                                ),
                              ),
                      ],
                    ),

                    const SizedBox(height: 48),

                    PrimaryButton(
                      label: 'Verify & Continue',
                      onTap: _isComplete ? _verify : null,
                      isLoading: _isLoading,
                    ),

                    const SizedBox(height: 28),
                    SafeArea(
                      top: false,
                      child: Center(
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                          decoration: BoxDecoration(
                            color: AppColors.success.withOpacity(0.05),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.success.withOpacity(0.1)),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                Icons.security_rounded,
                                size: 14,
                                color: AppColors.success,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Your number is strictly confidential',
                                style: AppTextStyles.caption.copyWith(
                                  color: AppColors.success.withOpacity(0.8),
                                  fontWeight: FontWeight.w600,
                                  fontSize: 11,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _OtpBox extends StatefulWidget {
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
  State<_OtpBox> createState() => _OtpBoxState();
}

class _OtpBoxState extends State<_OtpBox> with SingleTickerProviderStateMixin {
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    )..repeat(reverse: true);

    widget.focusNode.addListener(_onFocusChange);
  }

  void _onFocusChange() {
    if (mounted) setState(() {});
  }

  @override
  void dispose() {
    _animationController.dispose();
    widget.focusNode.removeListener(_onFocusChange);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    bool hasFocus = widget.focusNode.hasFocus;

    return KeyboardListener(
      focusNode: FocusNode(),
      onKeyEvent: widget.onKey,
      child: Stack(
        alignment: Alignment.center,
        children: [
          AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeOutCubic,
            width: 52,
            height: 64,
            decoration: BoxDecoration(
              color: hasFocus 
                  ? AppColors.card 
                  : (widget.filled ? AppColors.primary.withOpacity(0.08) : AppColors.background),
              borderRadius: BorderRadius.circular(18),
              border: Border.all(
                color: hasFocus
                    ? AppColors.primaryDark
                    : (widget.filled ? AppColors.primaryDark.withOpacity(0.6) : AppColors.border),
                width: hasFocus ? 2.5 : 1.5,
              ),
              boxShadow: hasFocus
                  ? [
                      BoxShadow(
                        color: AppColors.primary.withOpacity(0.2),
                        blurRadius: 15,
                        offset: const Offset(0, 8),
                      )
                    ]
                  : (widget.filled
                      ? [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.03),
                            blurRadius: 4,
                            offset: const Offset(0, 2),
                          )
                        ]
                      : null),
            ),
            child: Center(
              child: TextField(
                controller: widget.controller,
                focusNode: widget.focusNode,
                onChanged: widget.onChanged,
                keyboardType: TextInputType.number,
                maxLength: 1,
                textAlign: TextAlign.center,
                cursorWidth: 0, // Custom cursor via Stack
                showCursor: false,
                style: AppTextStyles.h2.copyWith(
                  color: AppColors.textPrimary,
                  fontWeight: FontWeight.w900,
                  fontSize: 26,
                  letterSpacing: 2,
                ),
                buildCounter:
                    (_, {required currentLength, required isFocused, maxLength}) =>
                        null,
                decoration: const InputDecoration(
                  counterText: '',
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.zero,
                ),
              ),
            ),
          ),
          // Animated Underline Indicator
          if (hasFocus && !widget.filled)
            Positioned(
              bottom: 12,
              child: FadeTransition(
                opacity: _animationController,
                child: Container(
                  width: 20,
                  height: 3,
                  decoration: BoxDecoration(
                    color: AppColors.primaryDark,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
