import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_text_styles.dart';
import '../../core/widgets/common_widgets.dart';

class CreatePujaRequestScreen extends StatefulWidget {
  const CreatePujaRequestScreen({super.key});

  @override
  State<CreatePujaRequestScreen> createState() =>
      _CreatePujaRequestScreenState();
}

class _CreatePujaRequestScreenState extends State<CreatePujaRequestScreen> {
  String? _selectedPuja;
  String? _selectedDate;
  String? _selectedTime;
  double _offerPrice = 1500;
  final _instructionsCtrl = TextEditingController();

  final _pujaTypes = [
    ('🪔', 'Satyanarayan Katha'),
    ('🏠', 'Griha Pravesh'),
    ('👶', 'Namkaran Samskara'),
    ('💍', 'Vivah Puja'),
    ('🌙', 'Navgrah Puja'),
    ('🔱', 'Rudrabhishek'),
    ('🌸', 'Lakshmi Puja'),
    ('☀️', 'Surya Puja'),
  ];

  final _requirements = [
    'Pandit will bring flowers',
    'Devotee to arrange ghee',
    'Incense and lamp needed',
    'Fruits for prasad',
  ];

  final _checkedReq = <int>{0, 2};

  @override
  void dispose() {
    _instructionsCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
          onPressed: () => context.pop(),
        ),
        title: const Text('Create Puja Request'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Puja type selector
            _SectionCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _FieldLabel('Select Puja Type', required: true),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _pujaTypes.map((p) {
                      final selected = _selectedPuja == p.$2;
                      return GestureDetector(
                        onTap: () => setState(() => _selectedPuja = p.$2),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: selected
                                ? AppColors.primary
                                : AppColors.card,
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(
                              color: selected
                                  ? AppColors.primaryDark
                                  : AppColors.border,
                              width: selected ? 2 : 1,
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(p.$1, style: const TextStyle(fontSize: 15)),
                              const SizedBox(width: 6),
                              Text(
                                p.$2,
                                style: AppTextStyles.labelSmall.copyWith(
                                  color: selected
                                      ? AppColors.textPrimary
                                      : AppColors.textSecondary,
                                  fontWeight: selected
                                      ? FontWeight.w600
                                      : FontWeight.w400,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Date & Time
            _SectionCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _FieldLabel('Date & Time', required: true),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: _SelectionTile(
                          icon: Icons.calendar_today_outlined,
                          label: _selectedDate ?? 'Select Date',
                          placeholder: _selectedDate == null,
                          onTap: () async {
                            final d = await showDatePicker(
                              context: context,
                              initialDate: DateTime.now().add(
                                const Duration(days: 1),
                              ),
                              firstDate: DateTime.now(),
                              lastDate: DateTime.now().add(
                                const Duration(days: 90),
                              ),
                              builder: (ctx, child) => Theme(
                                data: Theme.of(ctx).copyWith(
                                  colorScheme: const ColorScheme.light(
                                    primary: AppColors.primary,
                                  ),
                                ),
                                child: child!,
                              ),
                            );
                            if (d != null) {
                              setState(
                                () => _selectedDate =
                                    '${d.day}/${d.month}/${d.year}',
                              );
                            }
                          },
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: _SelectionTile(
                          icon: Icons.access_time_rounded,
                          label: _selectedTime ?? 'Select Time',
                          placeholder: _selectedTime == null,
                          onTap: () async {
                            final t = await showTimePicker(
                              context: context,
                              initialTime: TimeOfDay.now(),
                              builder: (ctx, child) => Theme(
                                data: Theme.of(ctx).copyWith(
                                  colorScheme: const ColorScheme.light(
                                    primary: AppColors.primary,
                                  ),
                                ),
                                child: child!,
                              ),
                            );
                            if (t != null) {
                              setState(() => _selectedTime = t.format(context));
                            }
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Location
            _SectionCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _FieldLabel('Puja Location'),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppColors.accent,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.location_on_rounded,
                          color: AppColors.secondary,
                          size: 20,
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Current Location',
                                style: AppTextStyles.labelMedium,
                              ),
                              Text(
                                '45 Koregaon Park, Pune 411001',
                                style: AppTextStyles.bodySmall,
                              ),
                            ],
                          ),
                        ),
                        TextButton(
                          onPressed: () {},
                          child: Text(
                            'Change',
                            style: AppTextStyles.labelSmall.copyWith(
                              color: AppColors.secondary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Price section
            _SectionCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(child: _FieldLabel('Your Offer Price')),
                      Text(
                        '₹${_offerPrice.toInt()}',
                        style: AppTextStyles.price,
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.success.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: AppColors.success.withOpacity(0.4),
                          ),
                        ),
                        child: Text(
                          '✅ Suggested: ₹1,800',
                          style: AppTextStyles.caption.copyWith(
                            color: AppColors.success,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  SliderTheme(
                    data: SliderThemeData(
                      activeTrackColor: AppColors.primary,
                      inactiveTrackColor: AppColors.accent,
                      thumbColor: AppColors.primary,
                      overlayColor: AppColors.primary.withOpacity(0.2),
                      trackHeight: 6,
                    ),
                    child: Slider(
                      min: 500,
                      max: 10000,
                      divisions: 95,
                      value: _offerPrice,
                      onChanged: (v) => setState(() => _offerPrice = v),
                    ),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('₹500', style: AppTextStyles.caption),
                      Text('₹10,000', style: AppTextStyles.caption),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Requirements
            _SectionCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _FieldLabel('Requirements'),
                  const SizedBox(height: 10),
                  ..._requirements.asMap().entries.map((e) {
                    final i = e.key;
                    final text = e.value;
                    return InkWell(
                      onTap: () => setState(() {
                        if (_checkedReq.contains(i)) {
                          _checkedReq.remove(i);
                        } else {
                          _checkedReq.add(i);
                        }
                      }),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 6),
                        child: Row(
                          children: [
                            AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              width: 22,
                              height: 22,
                              decoration: BoxDecoration(
                                color: _checkedReq.contains(i)
                                    ? AppColors.primary
                                    : AppColors.card,
                                borderRadius: BorderRadius.circular(6),
                                border: Border.all(
                                  color: _checkedReq.contains(i)
                                      ? AppColors.primaryDark
                                      : AppColors.border,
                                  width: 2,
                                ),
                              ),
                              child: _checkedReq.contains(i)
                                  ? const Icon(
                                      Icons.check_rounded,
                                      size: 14,
                                      color: Colors.white,
                                    )
                                  : null,
                            ),
                            const SizedBox(width: 10),
                            Text(text, style: AppTextStyles.bodyMedium),
                          ],
                        ),
                      ),
                    );
                  }),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Instructions
            _SectionCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _FieldLabel('Special Instructions'),
                  const SizedBox(height: 10),
                  TextField(
                    controller: _instructionsCtrl,
                    maxLines: 3,
                    style: AppTextStyles.bodyMedium,
                    decoration: const InputDecoration(
                      hintText: 'Any specific requirements or instructions...',
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            PrimaryButton(
              label: '🔍  Find Pandits Near Me',
              onTap: _selectedPuja != null
                  ? () => context.push('/home/bidding')
                  : null,
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  final Widget child;
  const _SectionCard({required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
        boxShadow: AppColors.softShadow,
      ),
      child: child,
    );
  }
}

class _FieldLabel extends StatelessWidget {
  final String label;
  final bool required;
  const _FieldLabel(this.label, {this.required = false});

  @override
  Widget build(BuildContext context) {
    return RichText(
      text: TextSpan(
        text: label,
        style: AppTextStyles.h4,
        children: required
            ? [
                TextSpan(
                  text: ' *',
                  style: AppTextStyles.h4.copyWith(color: AppColors.secondary),
                ),
              ]
            : [],
      ),
    );
  }
}

class _SelectionTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool placeholder;
  final VoidCallback onTap;

  const _SelectionTile({
    required this.icon,
    required this.label,
    required this.placeholder,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        decoration: BoxDecoration(
          color: AppColors.background,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              size: 16,
              color: placeholder ? AppColors.textHint : AppColors.textPrimary,
            ),
            const SizedBox(width: 6),
            Expanded(
              child: Text(
                label,
                style: AppTextStyles.bodySmall.copyWith(
                  color: placeholder
                      ? AppColors.textHint
                      : AppColors.textPrimary,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
