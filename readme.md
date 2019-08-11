## Prerequisites

This app was implemented with Laravel 5.8 - So, please make sure your server fulfills prerequisites: https://laravel.com/docs/5.8#server-requirements

You also will need GIT, MySQL database and recent versions of Composer, Node.JS and npm.

## Installation

1. Clone the repository: $ git clone https://github.com/omarinho/sumoTest.git
2. Configure your webserver so the test URL point to /public directory of this app
3. Make sure the folders permissions are correctly set according to your web user and OS.
4. Copy .env.developer to .env
	- Modify APP_URL according to the assigned URL in your server for this app
	- Modify DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME and DB_PASSWORD according to your MySQL database
	- Modify RECORDS_PER_PAGE (for pagination) if you need it. Default is 10 emails per page.
5. Run **$ composer install** in the root folder of the project
6. Run **$ npm install** in the root folder of the project
7. Run **$ php artisan migrate** in the root folder of the project
8. Check the app in a browser.

## Use the app

1. You need to register first.
2. After that you will be able to see two options in the upper nav bar: Email List (the tabular page and Create New Email
3. In the tabular page you also can delete or edit an email.