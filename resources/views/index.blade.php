<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Welcome!</h1>
    <h4>Solution by <a href="https://omaryesidmarino.com/" target="_blank">Omar Yesid Mariño</a></h4>
    @if (Auth::check())
        <a class="btn btn-success" href="{{ route('home') }}" role="button">Please, click here to see my solution</a>
    @else
        <a class="btn btn-danger" href="{{ route('register') }}" role="button">Please, register here to see my solution</a>
        <div class="clearfix hidden-xs hidden-sm"> </div>
        <small>Or <a href="{{ route('login') }}">login here</a> if you are already registered.</small>
    @endif    
 </div>
@endsection