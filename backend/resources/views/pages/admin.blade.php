@extends('layouts.app')

@section('title', 'СЕВЕР КОСМЕТИКА — Админка')

@section('content')
<section class="section">
    <div class="container">
        <h1 class="section__title">Панель администратора</h1>
        <p class="section__subtitle" id="admin-access-message">
            Доступно только для администратора. Если вы не администратор, вернитесь на <a href="{{ route('home') }}">главную</a>.
        </p>

        <div class="admin-panels" id="admin-panels" hidden>
            <section class="admin-panel">
                <h2 class="admin-panel__title">Статистика</h2>
                <div id="admin-stats"></div>
            </section>

            <section class="admin-panel">
                <h2 class="admin-panel__title">Управление товарами</h2>
                <p class="admin-panel__subtitle">Добавляйте, редактируйте и удаляйте товары.</p>
                <div id="admin-products" class="admin-products-list"></div>
                <div class="admin-product-form-card">
                    <h3 class="section__title section__title--small">Добавить/Редактировать товар</h3>
                    <form id="admin-product-form" class="form">
                        <input type="hidden" id="product-id" value="">
                        <div class="form__row">
                            <div class="form__group">
                                <label for="product-name" class="form__label">Название *</label>
                                <input type="text" id="product-name" class="input" required>
                            </div>
                            <div class="form__group">
                                <label for="product-price" class="form__label">Цена (₽) *</label>
                                <input type="number" id="product-price" class="input" min="0" step="100" required>
                            </div>
                        </div>
                        <div class="form__row">
                            <div class="form__group">
                                <label for="product-category" class="form__label">Категория *</label>
                                <select id="product-category" class="input" required>
                                    <option value="женские">Женские</option>
                                    <option value="мужские">Мужские</option>
                                    <option value="унисекс">Унисекс</option>
                                </select>
                            </div>
                            <div class="form__group">
                                <label for="product-volume" class="form__label">Объём *</label>
                                <input type="text" id="product-volume" class="input" placeholder="50 мл" required>
                            </div>
                        </div>
                        <div class="form__group">
                            <label for="product-notes" class="form__label">Ноты аромата *</label>
                            <input type="text" id="product-notes" class="input" placeholder="Цитрусовые, бергамот..." required>
                        </div>
                        <div class="form__group">
                            <label for="product-description" class="form__label">Описание</label>
                            <textarea id="product-description" class="input input--textarea" rows="3"></textarea>
                        </div>
                        <div class="form__row">
                            <div class="form__group">
                                <label class="form__label">
                                    <input type="checkbox" id="product-popular"> Популярный товар
                                </label>
                            </div>
                            <div class="form__group">
                                <label class="form__label">
                                    <input type="checkbox" id="product-instock" checked> В наличии
                                </label>
                            </div>
                        </div>
                        <div class="form__actions">
                            <button type="submit" class="btn btn--primary">Сохранить товар</button>
                            <button type="button" class="btn btn--outline" onclick="document.getElementById('admin-product-form').reset(); document.getElementById('product-id').value = '';">Очистить</button>
                        </div>
                    </form>
                </div>
            </section>

            <section class="admin-panel">
                <h2 class="admin-panel__title">Управление заказами</h2>
                <p class="admin-panel__subtitle">Просматривайте и изменяйте статусы заказов.</p>
                <div id="admin-orders" class="orders-list"></div>
            </section>

            <section class="admin-panel">
                <h2 class="admin-panel__title">Отзывы покупателей</h2>
                <p class="admin-panel__subtitle">Модерируйте отзывы в базе данных через команду или phpMyAdmin. Здесь — демо-отзывы из localStorage.</p>
                <div id="admin-reviews" class="reviews-list reviews-list--admin"></div>
            </section>

            <section class="admin-panel">
                <h2 class="admin-panel__title">Настройки магазина</h2>
                <form id="admin-settings-form" class="form">
                    <div class="form__group">
                        <label for="whatsapp-phone" class="form__label">Номер WhatsApp (в формате 79990000000)</label>
                        <input type="tel" id="whatsapp-phone" class="input" placeholder="79990000000">
                    </div>
                    <div class="form__actions">
                        <button type="submit" class="btn btn--primary">Сохранить</button>
                    </div>
                    <div class="form__message" id="admin-settings-message"></div>
                </form>
            </section>
        </div>
    </div>
</section>
@endsection
