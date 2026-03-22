import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // Core palette – Blinkit-inspired, spiritual warm
  static const Color primary = Color(0xFFF8CB46); // Blinkit yellow
  static const Color primaryDark = Color(0xFFE5B83B);
  static const Color secondary = Color(0xFFE23744); // Zomato red
  static const Color background = Color(0xFFFFFDF7); // warm cream
  static const Color accent = Color(0xFFFFE066);
  static const Color card = Color(0xFFFFFFFF);
  static const Color border = Color(0xFFF0E5D1);

  // Text
  static const Color textPrimary = Color(0xFF1A1A2E);
  static const Color textSecondary = Color(0xFF6B6B8A);
  static const Color textHint = Color(0xFFB0A8A8);

  // Status
  static const Color success = Color(0xFF0C831F); // Blinkit green
  static const Color warning = Color(0xFFFF9F43);
  static const Color error = Color(0xFFE23744); // Zomato red
  static const Color info = Color(0xFF3498DB);

  // Booking status colours
  static const Color statusOpen = Color(0xFF3498DB);
  static const Color statusBidding = Color(0xFFFF9F43);
  static const Color statusAssigned = Color(0xFF9B59B6);
  static const Color statusCompleted = Color(0xFF0C831F);
  static const Color statusCancelled = Color(0xFFE23744);

  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [Color(0xFFF8CB46), Color(0xFFE5B83B)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient splashGradient = LinearGradient(
    colors: [Color(0xFFFFFDF7), Color(0xFFF8CB46)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  static const LinearGradient cardGradient = LinearGradient(
    colors: [Color(0xFFFFFFFF), Color(0xFFFFFDF7)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // Shadows
  static List<BoxShadow> cardShadow = [
    BoxShadow(
      color: const Color(0xFFF8CB46).withOpacity(0.15),
      blurRadius: 16,
      offset: const Offset(0, 4),
    ),
  ];

  static List<BoxShadow> softShadow = [
    BoxShadow(
      color: Colors.black.withOpacity(0.06),
      blurRadius: 12,
      offset: const Offset(0, 2),
    ),
  ];
}
