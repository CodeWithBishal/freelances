import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';

class CounterOfferScreen extends StatefulWidget {
  const CounterOfferScreen({super.key});

  @override
  State<CounterOfferScreen> createState() => _CounterOfferScreenState();
}

class _CounterOfferScreenState extends State<CounterOfferScreen> {
  final _priceController = TextEditingController(text: '3000');

  void _setQuickPrice(String price) {
    setState(() {
      _priceController.text = price;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Counter Offer'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Price info cards
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(
                      Icons.account_balance_wallet,
                      color: AppColors.primary,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'User Offered Price',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppColors.textLight,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '₹2,500',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.blue.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.trending_up, color: Colors.blue),
                  ),
                  const SizedBox(width: 16),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Suggested Market Price',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppColors.textLight,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '₹3,200',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Entrance section
            Text(
              'Enter your price',
              style: Theme.of(
                context,
              ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _priceController,
              keyboardType: TextInputType.number,
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: AppColors.textDark,
              ),
              decoration: InputDecoration(
                prefixIcon: const Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text(
                    '₹',
                    style: TextStyle(fontSize: 24, color: AppColors.textLight),
                  ),
                ),
                contentPadding: const EdgeInsets.symmetric(
                  vertical: 24,
                  horizontal: 16,
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: const BorderSide(color: AppColors.border),
                ),
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                const Icon(Icons.info, size: 16, color: AppColors.textLight),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Setting a competitive price increases your chances of acceptance.',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Quick Selects
            Text(
              'Quick select',
              style: Theme.of(
                context,
              ).textTheme.bodyMedium?.copyWith(color: AppColors.textLight),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _buildQuickSelectTile('2800'),
                const SizedBox(width: 12),
                _buildQuickSelectTile('3000'),
                const SizedBox(width: 12),
                _buildQuickSelectTile('3200'),
              ],
            ),
          ],
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: AppColors.background,
          border: Border(top: BorderSide(color: AppColors.border)),
        ),
        child: ElevatedButton(
          onPressed: () => Navigator.of(context).pop(),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Text('Submit Counteroffer'),
              SizedBox(width: 8),
              Icon(Icons.send),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuickSelectTile(String price) {
    final isSelected = _priceController.text == price;
    return Expanded(
      child: GestureDetector(
        onTap: () => _setQuickPrice(price),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected
                ? AppColors.primary.withValues(alpha: 0.2)
                : AppColors.card,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: isSelected ? AppColors.primary : AppColors.border,
            ),
          ),
          alignment: Alignment.center,
          child: Text(
            '₹$price',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: isSelected ? const Color(0xFFB07A00) : AppColors.textDark,
            ),
          ),
        ),
      ),
    );
  }
}
