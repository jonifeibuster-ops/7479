@extends('layouts.app')

@section('title', 'SEVER COSMETICS — Корзина')

@section('content')
<section class="section">
    <div class="container">
        <h1 class="section__title">Ваша корзина</h1>
        <div id="cart-empty" class="cart-empty">
            Корзина пуста. Перейдите в <a href="{{ route('catalog') }}">каталог</a>, чтобы подобрать аромат.
        </div>
        <div id="cart-items" class="cart-items" hidden></div>
        <div id="cart-summary" class="cart-summary" hidden>
            <div class="cart-summary__promo">
                <div class="form__group">
                    <label for="promocode-input" class="form__label">Промокод</label>
                    <div style="display: flex; gap: 8px;">
                        <input type="text" id="promocode-input" class="input" placeholder="Введите промокод">
                        <button type="button" class="btn btn--outline" id="promocode-btn">Применить</button>
                    </div>
                    <div class="form__message" id="promocode-message"></div>
                </div>
            </div>
            <div class="cart-summary__row">
                <span>Количество товаров:</span>
                <span id="cart-total-qty"></span>
            </div>
            <div class="cart-summary__row" id="cart-discount-row" hidden>
                <span>Скидка:</span>
                <span id="cart-discount">0 ₽</span>
            </div>
            <div class="cart-summary__row cart-summary__row--total">
                <span>Итого к оплате:</span>
                <span id="cart-total-price"></span>
            </div>
            <button class="btn btn--primary cart-summary__btn" id="checkout-btn">Оформить заказ</button>
        </div>
    </div>
</section>
@endsection
