import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';

// This acts as the entrypoint for the background 'flutter_overlay_window' UI representation.
// Note: Actual native bridging for background launch requires deep Android manifest and iOS AppDelegate edits.
// This widget provides the visual representation of the Uber-like "Floating App Bubble".
class AppBubbleOverlay extends StatelessWidget {
  const AppBubbleOverlay({super.key});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: AppColors.primary,
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: AppColors.primary.withOpacity(0.4),
              blurRadius: 10,
              spreadRadius: 2,
            ),
          ],
          border: Border.all(color: AppColors.card, width: 2),
        ),
        child: const Icon(
          Icons.temple_hindu,
          color: AppColors.textDark,
          size: 32,
        ),
      ),
    );
  }
}
