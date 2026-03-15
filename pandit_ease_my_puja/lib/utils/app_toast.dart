import 'package:flutter/material.dart';
import 'package:toastification/toastification.dart';

class AppToast {
  static void show(
    BuildContext context, {
    required String title,
    String? description,
    ToastType type = ToastType.info,
    Duration duration = const Duration(seconds: 3),
  }) {
    ToastificationType toastType;

    switch (type) {
      case ToastType.success:
        toastType = ToastificationType.success;
        break;
      case ToastType.error:
        toastType = ToastificationType.error;
        break;
      case ToastType.warning:
        toastType = ToastificationType.warning;
        break;
      case ToastType.info:
        toastType = ToastificationType.info;
        break;
    }

    toastification.show(
      context: context,
      type: toastType,
      style: ToastificationStyle.flatColored,
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
      description: description != null ? Text(description) : null,
      alignment: Alignment.bottomCenter,
      autoCloseDuration: duration,
      animationBuilder: (context, animation, alignment, child) {
        return SlideTransition(
          position: Tween<Offset>(
            begin: const Offset(0, 1),
            end: const Offset(0, 0),
          ).animate(animation),
          child: child,
        );
      },
      borderRadius: BorderRadius.circular(12.0),
      boxShadow: highModeShadow,
      showProgressBar: false,
      margin: const EdgeInsets.only(bottom: 24, left: 16, right: 16),
    );
  }
}

enum ToastType { success, error, warning, info }
