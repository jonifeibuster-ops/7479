@extends('layouts.app')

@section('title', 'SEVER COSMETICS — Каталог')

@section('content')
<section class="section">
    <div class="container">
        <div class="section__header">
            <h1 class="section__title">Каталог ароматов</h1>
            <div class="catalog-filters">
                <input type="text" id="search-input" class="input" placeholder="Поиск по названию или нотам...">
                <select id="category-filter" class="input">
                    <option value="">Все категории</option>
                    <option value="женские">Женские</option>
                    <option value="мужские">Мужские</option>
                    <option value="унисекс">Унисекс</option>
                </select>
                <select id="price-filter" class="input">
                    <option value="">Все цены</option>
                    <option value="0-2500">До 2 500 ₽</option>
                    <option value="2500-3200">2 500 - 3 200 ₽</option>
                    <option value="3200-3600">3 200 - 3 600 ₽</option>
                    <option value="3600-999999">От 3 600 ₽</option>
                </select>
                <select id="sort-select" class="input">
                    <option value="default">По умолчанию</option>
                    <option value="popular">Популярные</option>
                    <option value="price-asc">Цена: по возрастанию</option>
                    <option value="price-desc">Цена: по убыванию</option>
                    <option value="name">По названию</option>
                </select>
            </div>
        </div>
        <div class="products-grid" id="catalog-products"></div>
    </div>
</section>
@endsection
