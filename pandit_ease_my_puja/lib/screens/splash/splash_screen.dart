import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';
import '../auth/login_screen.dart'; // We'll build this next

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with TickerProviderStateMixin {
  late AnimationController _fadeController;
  late AnimationController _rotateController;
  late AnimationController _scaleController;

  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    
    // Fade in text and motives
    _fadeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );
    _fadeAnimation = CurvedAnimation(parent: _fadeController, curve: Curves.easeIn);

    // Continuous slow rotation for motives
    _rotateController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 10),
    )..repeat();

    // Subtle scale pulsing
    _scaleController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    )..repeat(reverse: true);
    _scaleAnimation = Tween<double>(begin: 0.95, end: 1.05).animate(
      CurvedAnimation(parent: _scaleController, curve: Curves.easeInOut),
    );

    _fadeController.forward();

    // Navigate to next screen after splash
    Future.delayed(const Duration(seconds: 4), () {
      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const LoginScreen()),
        );
      }
    });
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _rotateController.dispose();
    _scaleController.dispose();
    super.dispose();
  }

  Widget _buildMotif(IconData icon, double angle, double distance, double scale) {
    return AnimatedBuilder(
      animation: _rotateController,
      builder: (context, child) {
        final currentAngle = angle + (_rotateController.value * 2 * math.pi);
        return Transform.translate(
          offset: Offset(
            math.cos(currentAngle) * distance,
            math.sin(currentAngle) * distance,
          ),
          child: Transform.rotate(
            angle: _rotateController.value * 2 * math.pi * (angle % 2 == 0 ? 1 : -1),
            child: Transform.scale(
              scale: scale,
              child: Icon(icon, color: AppColors.primary.withOpacity(0.4), size: 40),
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    // removed unused size variable
    
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: FadeTransition(
          opacity: _fadeAnimation,
          child: Stack(
            alignment: Alignment.center,
            children: [
              // Motifs surrounding the center
              _buildMotif(Icons.temple_hindu, 0, 120, 1.2),
              _buildMotif(Icons.spa_rounded, math.pi / 3, 110, 0.9),
              _buildMotif(Icons.wb_sunny_rounded, 2 * math.pi / 3, 130, 1.0),
              _buildMotif(Icons.flare, math.pi, 120, 0.8),
              _buildMotif(Icons.spa_rounded, 4 * math.pi / 3, 110, 0.9),
              _buildMotif(Icons.temple_hindu, 5 * math.pi / 3, 130, 1.1),
              
              // Central App Name
              ScaleTransition(
                scale: _scaleAnimation,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withOpacity(0.15),
                        shape: BoxShape.circle,
                        border: Border.all(color: AppColors.border, width: 2),
                      ),
                      child: const Icon(
                        Icons.self_improvement,
                        size: 64,
                        color: AppColors.primary,
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Easy My Puja',
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.w700,
                        color: AppColors.textDark,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Pandit Partner',
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: AppColors.textLight,
                        fontWeight: FontWeight.w500,
                        letterSpacing: 1.2,
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
