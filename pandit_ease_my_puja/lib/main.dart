import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:toastification/toastification.dart';
import 'package:flutter_overlay_window/flutter_overlay_window.dart';
import 'screens/splash/splash_screen.dart';
import 'screens/background/app_bubble_overlay.dart';
import 'theme/app_theme.dart';
import 'utils/background_bubble_service.dart';

@pragma("vm:entry-point")
void overlayMain() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: AppBubbleOverlay(),
    ),
  );
}

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> with WidgetsBindingObserver {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    // When app starts, hide bubble if active
    BackgroundBubbleService.hideBubble();

    // Listen for messages from the overlay
    FlutterOverlayWindow.overlayListener.listen((event) async {
      if (event == "open_app") {
        // Bring app to foreground natively via MethodChannel
        final platform = MethodChannel('app.channel.launcher');
        try {
          await platform.invokeMethod('openApp');
        } catch (e) {
          debugPrint("Failed to bring app to foreground: $e");
        }
        FlutterOverlayWindow.closeOverlay();
      }
    });
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      // App opened, remove bubble
      BackgroundBubbleService.hideBubble();
    } else if (state == AppLifecycleState.paused || state == AppLifecycleState.inactive || state == AppLifecycleState.hidden) {
      // App minimized or went to background, show bubble if online
      BackgroundBubbleService.showBubbleIfActive();
    }
  }

  @override
  Widget build(BuildContext context) {
    return ToastificationWrapper(
      child: MaterialApp(
        title: 'Easy My Puja Partner',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        home: const SplashScreen(),
      ),
    );
  }
}
