<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'СЕВЕР КОСМЕТИКА')</title>
    <link rel="stylesheet" href="{{ asset('css/styles.css') }}">
    @stack('head')
</head>
<body class="page">
    <header class="header">
        <div class="container header__inner">
            <a href="{{ route('home') }}" class="logo">СЕВЕР <span>КОСМЕТИКА</span></a>
            <nav class="nav">
                <a href="{{ route('home') }}" class="nav__link @if(request()->routeIs('home')) nav__link--active @endif">Главная</a>
                <a href="{{ route('catalog') }}" class="nav__link @if(request()->routeIs('catalog')) nav__link--active @endif">Каталог</a>
                <a href="{{ route('cart') }}" class="nav__link @if(request()->routeIs('cart')) nav__link--active @endif">Корзина<span class="nav__badge" id="cart-counter" hidden>0</span></a>
                <a href="{{ route('wishlist') }}" class="nav__link @if(request()->routeIs('wishlist')) nav__link--active @endif">Избранное</a>
                <a href="{{ route('reviews.index') }}" class="nav__link @if(request()->routeIs('reviews.*')) nav__link--active @endif">Отзывы</a>
                <a href="{{ route('profile') }}" class="nav__link" id="profile-nav-link" hidden>Профиль</a>
                <a href="{{ route('orders') }}" class="nav__link" id="orders-nav-link" hidden>Заказы</a>
                <a href="{{ route('login') }}" class="nav__link @if(request()->routeIs('login')) nav__link--active @endif" id="user-nav-link">Вход</a>
                <a href="{{ route('admin') }}" class="nav__link nav__link--admin" id="admin-nav-link" hidden>Админка</a>
            </nav>
        </div>
    </header>

    <main class="main">
        @yield('content')
    </main>

    @hasSection('footer')
        @yield('footer')
    @else
        <footer class="footer">
            <div class="container footer__inner">
                <p class="footer__copy">&copy; СЕВЕР КОСМЕТИКА, <span id="year"></span></p>
                <p class="footer__info">Интернет-магазин парфюмерии. Все права защищены.</p>
            </div>
        </footer>
    @endif

    <a href="#" class="whatsapp-btn" id="whatsapp-btn" aria-label="Написать в WhatsApp">
        <span class="whatsapp-btn__icon">W</span>
    </a>

    @stack('scripts')
    <script src="{{ asset('js/app.js') }}" defer></script>
</body>
</html>
