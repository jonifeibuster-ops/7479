@extends('layouts.app')

@section('title', 'SEVER COSMETICS — Главная')

@section('content')
<section class="hero">
    <div class="container hero__inner">
        <div class="hero__content">
            <h1 class="hero__title">Интернет-магазин парфюмерии <span>SEVER COSMETICS</span></h1>
            <p class="hero__subtitle">
                Премиальные ароматы в чёрно‑золотом исполнении. Подчеркните свой стиль изысканным шлейфом.
            </p>
            <div class="hero__actions">
                <a href="{{ route('catalog') }}" class="btn btn--primary">Перейти в каталог</a>
                <a href="{{ route('cart') }}" class="btn btn--outline">Перейти в корзину</a>
            </div>
        </div>
        <div class="hero__visual">
            <div class="bottle-card">
                <div class="bottle-card__glass"></div>
                <div class="bottle-card__label">SEVER</div>
                <div class="bottle-card__glow"></div>
            </div>
        </div>
    </div>
</section>

<section class="section section--dark">
    <div class="container">
        <h2 class="section__title">Почему выбирают нас</h2>
        <div class="features">
            <div class="feature-card">
                <h3 class="feature-card__title">Премиальное качество</h3>
                <p class="feature-card__text">Стойкие композиции, вдохновлённые мировыми ароматами.</p>
            </div>
            <div class="feature-card">
                <h3 class="feature-card__title">Быстрая доставка</h3>
                <p class="feature-card__text">Отправка в течение 24 часов в надёжной защитной упаковке.</p>
            </div>
            <div class="feature-card">
                <h3 class="feature-card__title">Удобная покупка</h3>
                <p class="feature-card__text">Корзина, личный вход и поддержка в один клик через WhatsApp.</p>
            </div>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <h2 class="section__title">Популярные ароматы</h2>
        <div class="products-grid" id="popular-products"></div>
        <div class="section__actions">
            <a href="{{ route('catalog') }}" class="btn btn--primary">Открыть весь каталог</a>
        </div>
    </div>
</section>
@endsection
