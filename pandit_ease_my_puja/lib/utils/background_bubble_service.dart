import 'package:flutter_overlay_window/flutter_overlay_window.dart';

class BackgroundBubbleService {
  static Future<void> toggleBubble(bool enable) async {
    if (enable) {
      final bool status = await FlutterOverlayWindow.isPermissionGranted();
      if (!status) {
        await FlutterOverlayWindow.requestPermission();
      }
      
      final bool hasPermission = await FlutterOverlayWindow.isPermissionGranted();
      if (hasPermission) {
        bool isActive = await FlutterOverlayWindow.isActive();
        if (!isActive) {
          await FlutterOverlayWindow.showOverlay(
            enableDrag: true,
            overlayTitle: "Easy My Puja Partner",
            overlayContent: "Running in background",
            flag: OverlayFlag.defaultFlag,
            alignment: OverlayAlignment.centerRight,
            visibility: NotificationVisibility.visibilityPublic,
            positionGravity: PositionGravity.auto,
            height: 180, // Giving some extra height for the drag padding
            width: 180,
          );
        }
      }
    } else {
      bool isActive = await FlutterOverlayWindow.isActive();
      if (isActive) {
        await FlutterOverlayWindow.closeOverlay();
      }
    }
  }
}
