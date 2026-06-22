<?php

use App\Http\Controllers\PageController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/catalog', [PageController::class, 'catalog'])->name('catalog');
Route::get('/cart', [PageController::class, 'cart'])->name('cart');
Route::get('/wishlist', [PageController::class, 'wishlist'])->name('wishlist');
Route::get('/login', [PageController::class, 'login'])->name('login');
Route::get('/product', [PageController::class, 'product'])->name('product');
Route::get('/profile', [PageController::class, 'profile'])->name('profile');
Route::get('/orders', [PageController::class, 'orders'])->name('orders');
Route::get('/admin', [PageController::class, 'admin'])->name('admin');

Route::get('/reviews', [ReviewController::class, 'index'])->name('reviews.index');
Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
