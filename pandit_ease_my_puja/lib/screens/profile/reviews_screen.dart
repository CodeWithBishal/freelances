import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';

class ReviewsScreen extends StatelessWidget {
  const ReviewsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.card,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textDark),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Ratings & Reviews',
          style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.textDark),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            // Overall Rating Section
            const SizedBox(height: 20),
            Text(
              '4.8',
              style: Theme.of(context).textTheme.displayLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: AppColors.textDark,
                    fontSize: 64,
                  ),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                5,
                (index) => const Icon(
                  Icons.star,
                  color: AppColors.primary,
                  size: 24,
                ),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              '1,200 reviews',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: AppColors.textLight,
                  ),
            ),
            const SizedBox(height: 32),

            // Rating Bars
            _buildRatingBar(5, 0.78, '78%'),
            _buildRatingBar(4, 0.15, '15%'),
            _buildRatingBar(3, 0.04, '4%'),
            _buildRatingBar(2, 0.02, '2%'),
            _buildRatingBar(1, 0.01, '1%'),
            const SizedBox(height: 32),
            const Divider(color: AppColors.border),
            const SizedBox(height: 20),

            // Recent Reviews Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Recent Reviews',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                ),
                Row(
                  children: [
                    Text(
                      'Sort by',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppColors.textLight,
                          ),
                    ),
                    const Icon(Icons.keyboard_arrow_down, size: 16, color: AppColors.textLight),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Reviews List
            _buildReviewItem(
              context,
              name: 'Ravi Sharma',
              date: '2 days ago',
              rating: 5,
              content: 'Panditji was very punctual and performed the puja with great devotion. Highly recommended!',
              likes: 12,
              imageUrl: 'https://i.pravatar.cc/150?img=12',
            ),
            const SizedBox(height: 24),
            _buildReviewItem(
              context,
              name: 'Amit Patel',
              date: '1 week ago',
              rating: 4,
              content: 'Good service, but the puja started slightly late. Otherwise, everything was perfect.',
              likes: 4,
              dislikes: 1,
              imageUrl: 'https://i.pravatar.cc/150?img=13',
            ),
            const SizedBox(height: 24),
            _buildReviewItem(
              context,
              name: 'Suresh Kumar',
              date: '2 weeks ago',
              rating: 5,
              content: 'Very knowledgeable and explained the significance of each ritual clearly. Thank you!',
              likes: 8,
              isInitials: true,
              initials: 'SK',
            ),
            const SizedBox(height: 32),
            
            // Load More Button
            OutlinedButton(
              onPressed: () {},
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.textDark,
                side: const BorderSide(color: AppColors.border),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
              ),
              child: const Text('Load More Reviews'),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildRatingBar(int stars, double fillPercent, String percentText) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          Text(
            stars.toString(),
            style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.textDark, fontSize: 12),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: fillPercent,
                minHeight: 6,
                backgroundColor: const Color(0xFFF3F5F7),
                valueColor: const AlwaysStoppedAnimation<Color>(AppColors.primary),
              ),
            ),
          ),
          const SizedBox(width: 12),
          SizedBox(
            width: 32,
            child: Text(
              percentText,
              textAlign: TextAlign.right,
              style: const TextStyle(color: AppColors.textLight, fontSize: 12),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReviewItem(
    BuildContext context, {
    required String name,
    required String date,
    required int rating,
    required String content,
    int likes = 0,
    int dislikes = 0,
    String? imageUrl,
    bool isInitials = false,
    String? initials,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            isInitials
                ? CircleAvatar(
                    backgroundColor: const Color(0xFFF3F5F7),
                    child: Text(
                      initials ?? '',
                      style: const TextStyle(color: AppColors.textDark, fontWeight: FontWeight.bold),
                    ),
                  )
                : CircleAvatar(
                    backgroundImage: NetworkImage(imageUrl ?? ''),
                  ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                Text(
                  date,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppColors.textLight,
                      ),
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: List.generate(
            5,
            (index) => Icon(
              index < rating ? Icons.star : Icons.star_border,
              color: index < rating ? AppColors.primary : AppColors.border,
              size: 20,
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          content,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                height: 1.5,
              ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            const Icon(Icons.thumb_up_alt_rounded, size: 16, color: Color(0xFFBDBDBD)),
            const SizedBox(width: 4),
            Text(
              likes.toString(),
              style: const TextStyle(color: AppColors.textLight, fontSize: 12),
            ),
            const SizedBox(width: 16),
            const Icon(Icons.thumb_down_alt_rounded, size: 16, color: Color(0xFFBDBDBD)),
            if (dislikes > 0) ...[
              const SizedBox(width: 4),
              Text(
                dislikes.toString(),
                style: const TextStyle(color: AppColors.textLight, fontSize: 12),
              ),
            ],
          ],
        ),
      ],
    );
  }
}
