<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class PageController extends Controller
{
    public function home(): View
    {
        return view('pages.home');
    }

    public function catalog(): View
    {
        return view('pages.catalog');
    }

    public function cart(): View
    {
        return view('pages.cart');
    }

    public function wishlist(): View
    {
        return view('pages.wishlist');
    }

    public function login(): View
    {
        return view('pages.login');
    }

    public function product(): View
    {
        return view('pages.product');
    }

    public function profile(): View
    {
        return view('pages.profile');
    }

    public function orders(): View
    {
        return view('pages.orders');
    }

    public function admin(): View
    {
        return view('pages.admin');
    }
}
