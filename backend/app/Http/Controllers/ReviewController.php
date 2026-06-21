<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ReviewController extends Controller
{
    public function index(): View
    {
        $reviews = Review::query()
            ->approved()
            ->latest()
            ->paginate(10);

        return view('reviews.index', compact('reviews'));
    }

    public function store(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'user_name' => ['required', 'string', 'min:2', 'max:100'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string', 'min:10', 'max:2000'],
        ], [
            'user_name.required' => 'Укажите ваше имя.',
            'user_name.min' => 'Имя должно содержать минимум 2 символа.',
            'rating.required' => 'Выберите оценку от 1 до 5.',
            'rating.min' => 'Оценка должна быть от 1 до 5.',
            'rating.max' => 'Оценка должна быть от 1 до 5.',
            'comment.required' => 'Напишите текст отзыва.',
            'comment.min' => 'Комментарий должен содержать минимум 10 символов.',
        ]);

        Review::create([
            'user_name' => $validated['user_name'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'is_approved' => false,
        ]);

        $message = 'Спасибо! Ваш отзыв отправлен на модерацию и появится после одобрения.';

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => $message,
            ], 201);
        }

        return redirect()
            ->route('reviews.index')
            ->with('success', $message);
    }
}
