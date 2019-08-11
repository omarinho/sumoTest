<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('index');
});

Auth::routes();

Route::get('/home', 'EmailController@list')->name('home');
Route::get('/create-email', 'EmailController@create')->name('create_email');
Route::post('/store', 'EmailController@store')->name('store');
Route::get('/delete/{id}', 'EmailController@delete')->name('delete');
Route::get('/show/{id}', 'EmailController@show')->name('show');
Route::get('/get/{id}', 'EmailController@get')->name('get');
Route::post('/update/{id}', 'EmailController@update')->name('update');