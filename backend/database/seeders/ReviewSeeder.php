<?php

namespace Database\Seeders;

use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $reviews = [
            [
                'user_name' => 'Анна',
                'rating' => 5,
                'comment' => 'Потрясающий аромат! Держится весь день, упаковка премиальная. Обязательно закажу ещё.',
                'is_approved' => true,
            ],
            [
                'user_name' => 'Михаил',
                'rating' => 4,
                'comment' => 'Качественный парфюм, быстрая доставка. Единственное — хотелось бы больше объёмов на выбор.',
                'is_approved' => true,
            ],
            [
                'user_name' => 'Елена',
                'rating' => 5,
                'comment' => 'SEVER COSMETICS — мой новый любимый магазин. Консультанты помогли подобрать идеальный аромат.',
                'is_approved' => true,
            ],
        ];

        foreach ($reviews as $review) {
            Review::query()->create($review);
        }
    }
}
