import 'package:flutter_overlay_window/flutter_overlay_window.dart';

class BackgroundBubbleService {
  static bool isOnline = false;

  static Future<void> showBubbleIfActive() async {
    if (!isOnline) return;
    
    final bool status = await FlutterOverlayWindow.isPermissionGranted();
    if (!status) return; // Don't show if permission was denied

    bool isActive = await FlutterOverlayWindow.isActive();
    if (!isActive) {
      await FlutterOverlayWindow.showOverlay(
        enableDrag: true,
        overlayTitle: "Easy My Puja Partner",
        overlayContent: "Online - Running in background",
        flag: OverlayFlag.defaultFlag,
        alignment: OverlayAlignment.centerRight,
        visibility: NotificationVisibility.visibilityPublic,
        positionGravity: PositionGravity.auto,
        height: 180, 
        width: 180,
      );
    }
  }

  static Future<void> hideBubble() async {
    bool isActive = await FlutterOverlayWindow.isActive();
    if (isActive) {
      await FlutterOverlayWindow.closeOverlay();
    }
  }

  static Future<bool> toggleOnline(bool online) async {
    if (online) {
      final bool status = await FlutterOverlayWindow.isPermissionGranted();
      if (!status) {
        final granted = await FlutterOverlayWindow.requestPermission();
        if (!(granted ?? false)) {
          isOnline = false;
          return false; // Permission denied, stay offline
        }
      }
      isOnline = true;
      return true;
    } else {
      isOnline = false;
      await hideBubble();
      return true;
    }
  }
}
