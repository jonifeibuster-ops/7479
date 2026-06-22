@extends('layouts.app')

@section('title', 'SEVER COSMETICS — Вход')

@section('content')
<section class="section">
    <div class="container auth">
        <div class="auth-card">
            <h1 class="section__title">Вход в аккаунт</h1>
            <p class="auth__subtitle">Выберите тип входа: покупатель или администратор.</p>
            <form id="login-form" class="form">
                <div class="form__group">
                    <label class="form__label">Роль</label>
                    <div class="role-switch">
                        <button type="button" class="role-switch__btn role-switch__btn--active" data-role="customer">Покупатель</button>
                        <button type="button" class="role-switch__btn" data-role="admin">Администратор</button>
                    </div>
                </div>
                <div class="form__group">
                    <label for="login-email" class="form__label">E-mail</label>
                    <input type="email" id="login-email" class="input" placeholder="you@example.com" required>
                </div>
                <div class="form__group" id="password-group" hidden>
                    <label for="login-password" class="form__label">Пароль администратора</label>
                    <input type="password" id="login-password" class="input" placeholder="Введите пароль администратора">
                    <small class="form__hint">Для примера: admin123</small>
                </div>
                <div class="form__actions">
                    <button type="submit" class="btn btn--primary">Войти</button>
                </div>
                <div class="form__message" id="login-message"></div>
            </form>
        </div>
    </div>
</section>
@endsection
