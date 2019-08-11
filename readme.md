## Prerequisites

This app was implemented with Laravel 5.8 - So, please make sure your server fulfills prerequisites: https://laravel.com/docs/5.8#server-requirements

You also will need a GIT, MySQL database and recent versions of Composer, Node.JS and npm.

## Installation

0. Clone the repository: $ git clone https://github.com/omarinho/sumoTest.git
1. Configure your webserver so the test URL point to /public directory of this app
2. Make sure the folders permissions are correctly set according to your web user and OS.
2. Copy .env.developer to .env
	- Modify APP_URL according to the assigned URL in your server for this app
	- Modify DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME and DB_PASSWORD according to your MySQL database
	- Modify RECORDS_PER_PAGE (for pagination) if you need it. Default is 10 records per page.
3. Run composer install.
4. Run npm install.
5. Run php artisan migrate.
6. Check the app in a browser.