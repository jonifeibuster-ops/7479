@extends('layouts.app')

@section('title', 'СЕВЕР КОСМЕТИКА — Отзывы')

@push('head')
<link rel="stylesheet" href="{{ asset('css/reviews.css') }}">
@endpush

@section('content')
<section class="section">
    <div class="container reviews-page">
        <div class="reviews-page__list">
            <h1 class="section__title">Отзывы наших покупателей</h1>

            @if (session('success'))
                <div class="form__message form__message--success form__message--page" role="status">
                    {{ session('success') }}
                </div>
            @endif

            <div class="reviews-list" id="public-reviews">
                @forelse ($reviews as $review)
                    <article class="review-card">
                        <div class="review-card__header">
                            <div class="review-card__name">{{ $review->user_name }}</div>
                            <div class="review-card__rating" aria-label="Оценка {{ $review->rating }} из 5">
                                @for ($i = 1; $i <= 5; $i++)
                                    <span class="star star--{{ $i <= $review->rating ? 'filled' : 'empty' }}">★</span>
                                @endfor
                            </div>
                        </div>
                        <p class="review-card__text">{{ $review->comment }}</p>
                        <div class="review-card__meta">
                            Отзыв от {{ $review->created_at->locale('ru')->translatedFormat('d F Y') }}
                        </div>
                    </article>
                @empty
                    <p class="cart-empty">Пока нет ни одного одобренного отзыва. Будьте первым!</p>
                @endforelse
            </div>

            @if ($reviews->hasPages())
                <nav class="pagination" aria-label="Навигация по отзывам">
                    @if ($reviews->onFirstPage())
                        <span class="pagination__link pagination__link--disabled">Назад</span>
                    @else
                        <a href="{{ $reviews->previousPageUrl() }}" class="pagination__link">Назад</a>
                    @endif

                    <span class="pagination__info">
                        Страница {{ $reviews->currentPage() }} из {{ $reviews->lastPage() }}
                    </span>

                    @if ($reviews->hasMorePages())
                        <a href="{{ $reviews->nextPageUrl() }}" class="pagination__link">Вперёд</a>
                    @else
                        <span class="pagination__link pagination__link--disabled">Вперёд</span>
                    @endif
                </nav>
            @endif
        </div>

        <div class="reviews-page__form">
            <div class="reviews-form-card">
                <h2 class="section__title section__title--small">Оставить отзыв</h2>
                <p class="section__subtitle">Поделитесь впечатлениями о покупке — отзыв появится после модерации.</p>

                <form id="review-form" class="form" action="{{ route('reviews.store') }}" method="POST" novalidate data-laravel>
                    @csrf

                    <div class="form__group">
                        <label for="review-name" class="form__label">Ваше имя</label>
                        <input
                            type="text"
                            id="review-name"
                            name="user_name"
                            class="input @error('user_name') input--error @enderror"
                            value="{{ old('user_name') }}"
                            placeholder="Например, Анна"
                            required
                            maxlength="100"
                            autocomplete="name"
                        >
                        @error('user_name')
                            <span class="form__field-error">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="form__group">
                        <span class="form__label" id="rating-label">Оценка</span>
                        <div class="star-rating" role="radiogroup" aria-labelledby="rating-label">
                            @for ($i = 5; $i >= 1; $i--)
                                <input
                                    type="radio"
                                    id="rating-{{ $i }}"
                                    name="rating"
                                    value="{{ $i }}"
                                    class="star-rating__input"
                                    @checked(old('rating', 5) == $i)
                                    required
                                >
                                <label for="rating-{{ $i }}" class="star-rating__star" title="{{ $i }} из 5">★</label>
                            @endfor
                        </div>
                        @error('rating')
                            <span class="form__field-error">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="form__group">
                        <label for="review-text" class="form__label">Комментарий</label>
                        <textarea
                            id="review-text"
                            name="comment"
                            class="input input--textarea @error('comment') input--error @enderror"
                            rows="4"
                            placeholder="Поделитесь своими впечатлениями..."
                            required
                            minlength="10"
                            maxlength="2000"
                        >{{ old('comment') }}</textarea>
                        @error('comment')
                            <span class="form__field-error">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="form__actions">
                        <button type="submit" class="btn btn--primary" id="review-submit-btn">
                            Отправить отзыв
                        </button>
                    </div>

                    <div class="form__message" id="review-message" role="status" aria-live="polite"></div>
                </form>
            </div>
        </div>
    </div>
</section>
@endsection

@push('scripts')
<script src="{{ asset('js/reviews.js') }}" defer></script>
@endpush
