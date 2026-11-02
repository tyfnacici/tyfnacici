---
title: "Drupal Installation with the LEMP Stack"
description: "Installing the Drupal CMS on the LEMP (Linux, Nginx, MySQL, PHP) stack"
draft: false
tags: ["Drupal", "LEMP", "CMS", "Linux"]
showToc: true
weight: 60
cover:
    image: "blog/lemp-drupal/cover.png"
---

### 🔗 [Read on Medium](https://medium.com/@tyfnacici/lemp-drupal)

### What is Drupal?

**Drupal** is a free, [open-source](https://tr.wikipedia.org/wiki/A%C3%A7%C4%B1k_kaynak) [content management system](https://tr.wikipedia.org/wiki/%C4%B0%C3%A7erik_y%C3%B6netim_sistemi), or an [infrastructure software](https://tr.wikipedia.org/w/index.php?title=Altyap%C4%B1_yaz%C4%B1l%C4%B1m%C4%B1&action=edit&redlink=1) focused on content management. Thanks to its modular structure, it can also be used as a web [application framework](https://tr.wikipedia.org/w/index.php?title=Uygulama_%C3%A7at%C4%B1s%C4%B1&action=edit&redlink=1), a community [portal](https://tr.wikipedia.org/wiki/Portal), a [forum](https://tr.wikipedia.org/wiki/Forum), or a [blog engine](https://tr.wikipedia.org/w/index.php?title=Blog_motoru&action=edit&redlink=1). **Drupal** is currently one of the most popular **CMS**s out there and is used by government agencies, large associations, non-profit organizations, and many Fortune 500 companies.

### What is the LEMP stack?

LEMP is an open-source web application stack used for developing web applications. The term LEMP is an acronym representing the L for the [Linux operating system](https://tr.wikipedia.org/wiki/Linux), the [Nginx](https://tr.wikipedia.org/wiki/Nginx) web server (pronounced engine-x, hence it is spoken as the E in the acronym), the M for the [MySQL](https://tr.wikipedia.org/wiki/MySQL) database, and the P for the [PHP](https://tr.wikipedia.org/wiki/PHP) language.

- **L-** Linux Operating System
- **E-** Nginx Server
- **M-** MySQL Database
- **P-** PHP

### What is a CMS?

CMS is an abbreviation of the English term “Content Management System”. With these systems, which come with ready-made source code, you can design and launch websites on many different topics and in many different fields. We say “systems” because there is no single CMS out there. Hundreds of content management systems are actively used around the world, each serving different purposes.

### What are the advantages of using CMS software?

**1-They are user-friendly**


Nobody likes using software that is hard to navigate and use. There are some applications that, if you had had the chance not to use them, you would have preferred never to use at all.


**2-You can easily customize them to suit your needs**


Most content management systems have plenty of customization options. By installing a new theme, you can easily adjust the overall design, look, and layout. These customizations allow you to change everything from basic colors and menu positions to how content is displayed.


Plugins and extensions give you the opportunity to expand the set of functions you get with content management software. Instead of coding from scratch, you can simply download a plugin to turn your website into one with the following features.

- Shopping carts
- Contact forms
- Email list management synchronization
- Spam protection
- Image compression
- Extra security
- And much more!

As I just mentioned, you don't need any technical knowledge to do these. All it takes is a single click to download the plugins.


Not all websites need the same features and functionality, and that is why these customization options are so useful. You don't have to waste storage space on a feature you don't want. For example, your business may only need a few pages of content, or you may be building a complete e-Commerce site showcasing various product pages. Whatever your requirements may be, the CMS you use needs to be flexible enough to be customized to meet your needs.


**3-It is mobile-friendly**


A responsive design structure allows content to be displayed seamlessly across various devices. Nowadays almost all of us have a mobile phone, which has demonstrated the necessity of responsive designs. Your site should be responsive to all devices. Drupal and other CMS software come mobile-friendly out of the box. You don't need to adjust your posts for screen types as you would on a regular website. The software does that for you.


**4-It is SEO-friendly**


SEO: it stands for Search Engine Optimization. In other words, it determines how high up your website appears in the search results when you search for anything on the internet. Most of you don't even feel the need to look beyond the first 3–4 results when doing a search on the internet. So you understand how important your website's SEO settings are. On a regular website, you may have to make these settings yourself, or even hire an SEO expert to do them for you if you really care about it. CMS software does these for you, optimizing your website for search engines. If that is not enough, you can also install plugins to score even better on SEO.


**5-Cost**


Imagine you are going to create a blog site from scratch for your business. If you don't have any skills in these areas, you will need to hire a web developer to do it. After the website is built, if you want to make any changes later on, chances are you will need to hire a web developer again. Also, since these changes can take a long time to make, they can cost you time as well. By using CMS software like Drupal, you can do the installation and any changes you want entirely by yourself. Moreover, when making changes, by using plugins etc. you can make changes that could take days on a regular website within very short periods of time.


Now that we have learned what is what, let's slowly move on to the installation.

### Requirements
- A machine with Ubuntu or a derivative operating system installed and at least 5GB of free space.
- An internet connection.
- A domain with an A record pointing to the IP address of the machine you will use.

### Let's install Nginx

Let's install nginx by entering the following command.


sudo apt update && sudo apt install nginx


After the download finishes, let's enter our server's IP address into our browser. A screen like the one below should appear.

<img src="https://cdn-images-1.medium.com/max/780/1*pAAbdNW0szeKaejJAmsFDw.png" alt="Image" />

### Let's install MySQL

Let's install MySQL by entering the following commands, in order, into our machine's terminal.


sudo apt install mariadb-server mariadb-client


Then let's set a password for the security of the MySQL console.


sudo mysql_secure_installation


We answer as follows.


Enter current password for root (enter for none): PRESS ENTER
​
Set root password [Y/n] Y
​
Remove anonymous users? [Y/n] y
​
Disallow root login remotely? [Y/n] y
​
Remove test database and access to it? [Y/n] y
​
Reload privilege tables now? [Y/n] y
​
All done!


Let's enter the MySQL console to test it.


sudo mysql -u root -p


When you enter the password, a screen like the one below will greet you.

<img src="https://cdn-images-1.medium.com/max/795/1*Em3HWZjVJYuiDmZxRGT1iQ.png" alt="Image" />

### Let's install PHP

The version of Drupal we are going to use supports PHP versions 8.1 and above. Since this version of PHP is not available in the Ubuntu 20.04 LTS repositories, we need to add the package repository ourselves.


sudo apt-get install software-properties-common
sudo add-apt-repository ppa:ondrej/php
sudo apt update


Then we can install PHP on our machine.


sudo apt install php8.2-fpm php8.2-common php8.2-mysql php8.2-gmp php8.2-curl php8.2-intl php8.2-mbstring php8.2-xmlrpc php8.2-gd php8.2-xml php8.2-cli php8.2-zip

### Let's create a database for Drupal

Drupal needs a database to store its data. To create one for it, let's open our MySQL console by entering the following command and enter the password we set.


sudo mysql -u root -p


Then let's create the database.


CREATE DATABASE drupaldb;


For Drupal to be able to make changes in this database, we need to create a separate user for it.


CREATE USER 'drupal'@'localhost' IDENTIFIED BY 'password';


Let's grant the user we created permission to operate on the “drupaldb” database.


GRANT ALL ON drupaldb.* TO 'drupal'@'localhost' WITH GRANT OPTION;


Let's save the changes and exit by writing the following commands.


FLUSH PRIVILEGES;
EXIT;

### Let's download Drupal to our machine

In order to download Drupal, we first need to make some installations.


sudo apt install curl git
curl -sS https://getcomposer.org/installer | sudo php -
- --install-dir=/usr/local/bin --filename=composer


After making the installations, let's install Drupal into our machine's **“/var/www/html”** directory by writing the following commands in order.


cd /var/www/html
sudo git clone --branch 10.0.2 https://git.drupal.org/project/drupal.git
cd /var/www/html/drupal
sudo composer install


If it asks “Continue as root/super user [yes]?” here, let's continue by saying yes.


For nginx to be able to access the directory where Drupal resides, we need to change its permissions.


sudo chown -R www-data:www-data /var/www/html/drupal/
sudo chmod -R 755 /var/www/html/drupal/

### Let's configure Nginx for Drupal

We have completed the download of Drupal. Now let's create a new server block to use Nginx with our Drupal website. With Nginx, you can create as many server blocks as you want.


sudo nano /etc/nginx/sites-available/drupal.conf


The content of the file should be as follows. You can enter your own domain in the **“server_name”** part.


server {
 server_name drupal.tayfun.com;
 root /var/www/html/drupal; 

## <-
- The directory where Drupal is located
​
 location = /favicon.ico {
 log_not_found off;
 access_log off;
 }
​
 location = /robots.txt {
 allow all;
 log_not_found off;
 access_log off;
 }
​
 

# Very rarely should these ever be accessed outside of your lan
 location ~* \.(txt|log)$ {
 allow 192.168.0.0/16;
 deny all;
 }
​
 location ~ \..*/.*\.php$ {
 return 403;
 }
​
 location ~ ^/sites/.*/private/ {
 return 403;
 }
​
 

# Block access to scripts in site files directory
 location ~ ^/sites/[^/]+/files/.*\.php$ {
 deny all;
 }
​
 

# Allow "Well-Known URIs" as per RFC 5785
 location ~* ^/.well-known/ {
 allow all;
 }
​
 

# Block access to "hidden" files and directories whose names begin with a
 

# period. This includes directories used by version control systems such
 

# as Subversion or Git to store control files.
 location ~ (^|/)\. {
 return 403;
 }
​
 location / {
 

# try_files $uri @rewrite; 

# For Drupal <= 6
 try_files $uri /index.php?$query_string; 

# For Drupal >= 7
 }
​
 location @rewrite {
 #rewrite ^/(.*)$ /index.php?q=$1; 

# For Drupal <= 6
 rewrite ^ /index.php; 

# For Drupal >= 7
 }
​
 

# Don't allow direct access to PHP files in the vendor directory.
 location ~ /vendor/.*\.php$ {
 deny all;
 return 404;
 }
​
 

# Protect files and directories from prying eyes.
 location ~* \.(engine|inc|install|make|module|profile|po|sh|.*sql|theme|twig|tpl(\.php)?|xtmpl|yml)(~|\.sw[op]|\.bak|\.orig|\.save)?$|^(\.(?!well-known).*|Entries.*|Repository|Root|Tag|Template|composer\.(json|lock)|web\.config)$|^#.*#$|\.php(~|\.sw[op]|\.bak|\.orig|\.save)$ {
 deny all;
 return 404;
 }
​
 

# In Drupal 8, we must also match new paths where the '.php' appears in
 

# the middle, such as update.php/selection. The rule we use is strict,
 

# and only allows this pattern with the update.php front controller.
 

# This allows legacy path aliases in the form of
 

# blog/index.php/legacy-path to continue to route to Drupal nodes. If
 

# you do not have any paths like that, then you might prefer to use a
 

# laxer rule, such as:
 

# location ~ \.php(/|$) {
 

# The laxer rule will continue to work if Drupal uses this new URL
 

# pattern with front controllers other than update.php in a future
 

# release.
 location ~ '\.php$|^/update.php' {
 fastcgi_split_path_info ^(.+?\.php)(|/.*)$;
 

# Ensure the php file exists. Mitigates CVE-2019-11043
 try_files $fastcgi_script_name =404;
 

# Security note: If you're running a version of PHP older than the
 

# latest 5.3, you should have "cgi.fix_pathinfo = 0;" in php.ini.
 

# See http://serverfault.com/q/627903/94922 for details.
 include fastcgi_params;
 

# Block httpoxy attacks. See https://httpoxy.org/.
 fastcgi_param HTTP_PROXY "";
 fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
 fastcgi_param PATH_INFO $fastcgi_path_info;
 fastcgi_param QUERY_STRING $query_string;
 fastcgi_intercept_errors on;
 

# PHP 5 socket location.
 #fastcgi_pass unix:/var/run/php5-fpm.sock;
 

# PHP 7 socket location.
 fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
 }
​
 location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
 try_files $uri @rewrite;
 expires max;
 log_not_found off;
 }
​
 

# Fighting with Styles? This little gem is amazing.
 

# location ~ ^/sites/.*/files/imagecache/ { 

# For Drupal <= 6
 location ~ ^/sites/.*/files/styles/ { 

# For Drupal >= 7
 try_files $uri @rewrite;
 }
​
 

# Handle private files through Drupal. Private file's path can come
 

# with a language prefix.
 location ~ ^(/[a-z\-]+)?/system/files/ { 

# For Drupal >= 7
 try_files $uri /index.php?$query_string;
 }
​
 

# Enforce clean URLs
 

# Removes index.php from urls like www.example.com/index.php/my-page --> www.example.com/my-page
 

# Could be done with 301 for permanent or other redirect codes.
 if ($request_uri ~* "^(.*/)index\.php/(.*)") {
 return 307 $1$2;
 }
}


Then let's enter the following commands to set it up so that it runs Drupal.


sudo ln -s /etc/nginx/sites-available/drupal.conf /etc/nginx/sites-enabled/
sudo systemctl restart nginx.service

### Let's access our machine

When you access your domain with your browser, a screen like the one below will greet you.

<img src="https://cdn-images-1.medium.com/max/1024/1*-drF4YyECkpjh4GbUPjhXw.png" alt="Image" />

Here we select the requested language, then we establish the database connection by entering the database we created along with the user and password.

<img src="https://cdn-images-1.medium.com/max/564/1*FMowraDKYWHf8W45BvvLdQ.png" alt="Image" />

Finally, we fill in the site information according to our preferences.

<img src="https://cdn-images-1.medium.com/max/1024/1*UvujZ73U8TEJNUbWiV3NeA.jpeg" alt="Image" />

Congratulations! You have successfully completed the installation.

<img src="https://cdn-images-1.medium.com/max/1024/1*v-V6mUYcS1qFHoQLPbJ39g.png" alt="Image" />
