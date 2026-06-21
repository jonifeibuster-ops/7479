<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'SEVER COSMETICS')</title>
    <link rel="stylesheet" href="{{ asset('css/styles.css') }}">
    <link rel="stylesheet" href="{{ asset('css/reviews.css') }}">
    @stack('head')
</head>
<body class="page">
    <header class="header">
        <div class="container header__inner">
            <a href="{{ route('reviews.index') }}" class="logo">SEVER <span>COSMETICS</span></a>
            <nav class="nav">
                <a href="{{ route('reviews.index') }}" class="nav__link @if(request()->routeIs('reviews.*')) nav__link--active @endif">Отзывы</a>
            </nav>
        </div>
    </header>

    <main class="main">
        @yield('content')
    </main>

    <footer class="footer">
        <div class="container footer__inner">
            <p class="footer__text">&copy; {{ date('Y') }} SEVER COSMETICS. Премиальная парфюмерия.</p>
        </div>
    </footer>

    @stack('scripts')
</body>
</html>
