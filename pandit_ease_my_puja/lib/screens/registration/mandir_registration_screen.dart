import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import '../../theme/app_colors.dart';
import '../main_layout.dart';

class MandirRegistrationScreen extends StatefulWidget {
  const MandirRegistrationScreen({super.key});

  @override
  State<MandirRegistrationScreen> createState() => _MandirRegistrationScreenState();
}

class _MandirRegistrationScreenState extends State<MandirRegistrationScreen> {
  String? _managementType;

  void _submit() {
    Navigator.of(context).pushReplacement(
      CupertinoPageRoute(builder: (_) => const MainLayout()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Column(
          children: [
            const Text('Easy My Puja', style: TextStyle(fontWeight: FontWeight.bold)),
            Text('Mandir Registration Portal', 
              style: Theme.of(context).textTheme.bodySmall?.copyWith(fontSize: 10, color: AppColors.textLight)),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            _buildSection(
              title: 'Temple Details',
              children: [
                _buildField('Temple Name', 'e.g. Shri Siddhivinayak Temple'),
                _buildField('Trust Name', 'e.g. Ganpati Trust'),
                _buildField('How old is the temple? (Years)', 'Enter number of years', keyboardType: TextInputType.number),
              ],
            ),
            const SizedBox(height: 16),
            _buildSection(
              title: 'Personnel',
              children: [
                _buildField('Senior Priest (Mukhya Pujari)', 'Full Name'),
                _buildField('Other Priest Names', 'Separate names with commas', maxLines: 3),
              ],
            ),
            const SizedBox(height: 16),
            _buildSection(
              title: 'Location & Contact',
              children: [
                _buildField('Temple Address', 'Complete postal address', maxLines: 3),
                _buildField('Primary Contact Number', '+91  10-digit mobile number', prefixText: '+91 ', keyboardType: TextInputType.phone),
              ],
            ),
            const SizedBox(height: 16),
            _buildSection(
              title: 'Temple Management Type',
              children: [
                _buildRadioOption('Government Operated', 'gov'),
                _buildRadioOption('Privately Operated', 'private'),
              ],
            ),
            const SizedBox(height: 16),
            _buildSection(
              title: 'Bank Details',
              isOptional: true,
              children: [
                _buildField('Bank Name', 'Name of the bank'),
                _buildField('Account Number', 'Account Number'),
                _buildField('IFSC Code', 'IFSC Code'),
              ],
            ),
            const SizedBox(height: 16),
            _buildSection(
              title: 'Document Uploads',
              children: [
                _buildUploadField('Approval and Agreement Signed', 'Tap to upload PDF or Image', Icons.cloud_upload_outlined),
                _buildUploadField('NDA Form', 'Tap to upload signed NDA', Icons.description_outlined),
                _buildUploadField('Permission Letter', 'Upload trust permission letter', Icons.folder_open_outlined),
              ],
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _submit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFFF9933), // Orange button as per design
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: const Text('Submit for Verification', style: TextStyle(color: Colors.white)),
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'By clicking submit, you agree to Easy My Puja\'s Partner Terms & Conditions.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 10, color: AppColors.textLight),
            ),
            const SizedBox(height: 32),
            const Text(
              'Easy My Puja | Empowering Divinity',
              style: TextStyle(fontSize: 12, color: Color(0xFFFF9933), fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildSection({required String title, required List<Widget> children, bool isOptional = false}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 4,
                    height: 16,
                    decoration: BoxDecoration(
                      color: const Color(0xFFFF9933),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    title,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                ],
              ),
              if (isOptional)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFF5E6),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: const Text('OPTIONAL', style: TextStyle(fontSize: 10, color: Color(0xFFFF9933), fontWeight: FontWeight.bold)),
                ),
            ],
          ),
          const SizedBox(height: 16),
          ...children,
        ],
      ),
    );
  }

  Widget _buildField(String label, String hint, {int maxLines = 1, TextInputType? keyboardType, String? prefixText}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 12, color: AppColors.textDark, fontWeight: FontWeight.w500)),
        const SizedBox(height: 8),
        TextField(
          maxLines: maxLines,
          keyboardType: keyboardType,
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: Color(0xFFBDBDBD), fontSize: 14),
            prefixText: prefixText,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFF0F0F0))),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFF0F0F0))),
          ),
        ),
        const SizedBox(height: 16),
      ],
    );
  }

  Widget _buildRadioOption(String label, String value) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      title: Text(label, style: const TextStyle(fontSize: 14)),
      leading: Radio<String>(
        value: value,
        groupValue: _managementType,
        activeColor: const Color(0xFFFF9933),
        onChanged: (val) => setState(() => _managementType = val),
      ),
    );
  }

  Widget _buildUploadField(String label, String hint, IconData icon) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 12, color: AppColors.textDark, fontWeight: FontWeight.w500)),
        const SizedBox(height: 8),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 20),
          decoration: BoxDecoration(
            border: Border.all(color: const Color(0xFFD9E2EC), style: BorderStyle.solid),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            children: [
              Icon(icon, color: const Color(0xFF94A3B8), size: 24),
              const SizedBox(height: 8),
              Text(hint, style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8))),
            ],
          ),
        ),
        const SizedBox(height: 16),
      ],
    );
  }
}
