import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';
import '../../utils/background_bubble_service.dart';

class BubbleToggleItem extends StatefulWidget {
  const BubbleToggleItem({super.key});

  @override
  State<BubbleToggleItem> createState() => _BubbleToggleItemState();
}

class _BubbleToggleItemState extends State<BubbleToggleItem> {
  bool _isBubbleActive = false;

  @override
  Widget build(BuildContext context) {
    return SwitchListTile(
      contentPadding: EdgeInsets.zero,
      secondary: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.teal.withOpacity(0.1),
          shape: BoxShape.circle,
        ),
        child: const Icon(Icons.picture_in_picture, color: Colors.teal),
      ),
      title: Text(
        'Run in Background',
        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
              fontWeight: FontWeight.w600,
            ),
      ),
      subtitle: Text(
        'App stays visible over other apps',
        style: Theme.of(context).textTheme.bodySmall,
      ),
      activeColor: AppColors.primary,
      value: _isBubbleActive,
      onChanged: (val) async {
        setState(() => _isBubbleActive = val);
        await BackgroundBubbleService.toggleBubble(val);
      },
    );
  }
}
