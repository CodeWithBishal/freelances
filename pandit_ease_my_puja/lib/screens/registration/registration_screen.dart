import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';
import '../main_layout.dart';

class RegistrationScreen extends StatefulWidget {
  const RegistrationScreen({super.key});

  @override
  State<RegistrationScreen> createState() => _RegistrationScreenState();
}

class _RegistrationScreenState extends State<RegistrationScreen> {
  final List<String> _languages = ['Hindi', 'Sanskrit'];
  String? _selectedSpecialization;

  void _addLanguage() {
    // ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Open language picker')));
  }

  void _submit() {
    Navigator.of(
      context,
    ).pushReplacement(MaterialPageRoute(builder: (_) => const MainLayout()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(
            context,
          ).pop(), // In a real app, handle back to login properly
        ),
        title: const Text('Register as Pandit'),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Personal Details Section
            Container(
              padding: const EdgeInsets.all(24.0),
              color: AppColors.background,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Personal Details',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Please provide your authentic details for verification.',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 24),

                  _buildLabel(context, 'Full Name (as per Aadhaar)'),
                  TextField(
                    decoration: const InputDecoration(
                      hintText: 'Enter your full name',
                    ),
                  ),
                  const SizedBox(height: 16),

                  _buildLabel(context, 'Phone Number'),
                  TextField(
                    decoration: const InputDecoration(
                      hintText: '+91 00000 00000',
                    ),
                    keyboardType: TextInputType.phone,
                  ),
                  const SizedBox(height: 16),

                  _buildLabel(context, 'Years of Experience'),
                  TextField(
                    decoration: const InputDecoration(hintText: 'e.g. 10'),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: 16),

                  _buildLabel(context, 'Primary Specialization'),
                  DropdownButtonFormField<String>(
                    decoration: const InputDecoration(
                      hintText: 'Select specialization',
                    ),
                    initialValue: _selectedSpecialization,
                    items:
                        [
                              'Vedic Scholar',
                              'Astrologer',
                              'Karma Kanda',
                              'Purohit',
                            ]
                            .map(
                              (s) => DropdownMenuItem(value: s, child: Text(s)),
                            )
                            .toList(),
                    onChanged: (val) =>
                        setState(() => _selectedSpecialization = val),
                  ),
                  const SizedBox(height: 16),

                  _buildLabel(context, 'Languages Known'),
                  Wrap(
                    spacing: 8.0,
                    runSpacing: 8.0,
                    children: [
                      ..._languages.map(
                        (lang) => Chip(
                          label: Text(lang),
                          backgroundColor: AppColors.primary,
                          side: BorderSide.none,
                          deleteIcon: const Icon(Icons.close, size: 16),
                          onDeleted: () {
                            setState(() => _languages.remove(lang));
                          },
                        ),
                      ),
                      OutlinedButton.icon(
                        onPressed: _addLanguage,
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 8,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(24),
                          ),
                        ),
                        icon: const Icon(Icons.add, size: 16),
                        label: const Text('Add'),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const Divider(height: 1, color: AppColors.border),

            // Verification Documents
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Verification Documents',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildUploadCard(
                    context: context,
                    icon: Icons.badge_outlined,
                    title: 'Upload Aadhaar Card',
                    subtitle: 'Front and Back (JPG, PNG, PDF)',
                  ),
                  const SizedBox(height: 12),
                  _buildUploadCard(
                    context: context,
                    icon: Icons.workspace_premium_outlined,
                    title: 'Upload Certifications',
                    subtitle: 'Degree or Karma Kanda Proof',
                  ),
                ],
              ),
            ),

            const Divider(height: 1, color: AppColors.border),

            // Video Introduction
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Video Introduction',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.accent.withValues(alpha: 0.5),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          'Recommended',
                          style: Theme.of(context).textTheme.bodySmall
                              ?.copyWith(
                                color: const Color(0xFFB07A00),
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(32),
                    decoration: BoxDecoration(
                      color: const Color(
                        0xFF1E2130,
                      ), // Dark background for video area
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: const BoxDecoration(
                            color: AppColors.primary,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.videocam,
                            size: 32,
                            color: AppColors.textDark,
                          ),
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'Record a short introduction',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Introduce yourself and your expertise to clients (Max 1 min)',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.white70, fontSize: 14),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: AppColors.card,
          border: Border(top: BorderSide(color: AppColors.border)),
        ),
        child: ElevatedButton.icon(
          onPressed: _submit,
          icon: const Icon(Icons.verified_user_outlined),
          label: const Text('Submit for Verification'),
        ),
      ),
    );
  }

  Widget _buildLabel(BuildContext context, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Text(
        text,
        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
          fontWeight: FontWeight.w600,
          color: AppColors.textDark,
        ),
      ),
    );
  }

  Widget _buildUploadCard({
    required BuildContext context,
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border, style: BorderStyle.solid),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: Colors.brown, size: 28),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(
                    context,
                  ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
                ),
                Text(subtitle, style: Theme.of(context).textTheme.bodySmall),
              ],
            ),
          ),
          Icon(
            Icons.upload_file,
            color: AppColors.textLight.withValues(alpha: 0.5),
          ),
        ],
      ),
    );
  }
}
