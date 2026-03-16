import 'package:flutter/material.dart';
import 'package:flutter_overlay_window/flutter_overlay_window.dart';
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
      child: Center(
        child: GestureDetector(
          onTap: () {
            FlutterOverlayWindow.shareData("open_app");
          },
          behavior: HitTestBehavior.opaque,
          child: Container(
            width: 48, // Standard tap target size
            height: 48,
            alignment: Alignment.center,
            decoration: const BoxDecoration(
              color: Colors.transparent,
            ),
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.primary,
                shape: BoxShape.circle,
                border: Border.all(
                  color: AppColors.textDark.withValues(alpha: 0.15),
                  width: 1,
                ),
              ),
              child: const Icon(
                Icons.temple_hindu,
                color: AppColors.textDark,
                size: 20,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
