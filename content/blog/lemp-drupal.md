---
title: "LEMP stack ile Drupal kurulumu"
description: "LEMP (Linux, Nginx, MySQL, PHP) stack üzerinde Drupal CMS kurulumu"
draft: false
tags: ["Drupal", "LEMP", "CMS", "Linux"]
showToc: true
weight: 60
cover:
    image: "blog/lemp-drupal/cover.png"
---

### 🔗 [Medium'da Oku](https://medium.com/@tyfnacici/lemp-drupal)

### Drupal nedir?

**Drupal** ücretsiz, [açık kaynaklı](https://tr.wikipedia.org/wiki/A%C3%A7%C4%B1k_kaynak) bir [içerik yönetim sistemi](https://tr.wikipedia.org/wiki/%C4%B0%C3%A7erik_y%C3%B6netim_sistemi) ya da içerik yönetim’e odaklı bir [altyapı yazılımıdır](https://tr.wikipedia.org/w/index.php?title=Altyap%C4%B1_yaz%C4%B1l%C4%B1m%C4%B1&action=edit&redlink=1). Modüler yapısı sayesinde, web [uygulama çatısı](https://tr.wikipedia.org/w/index.php?title=Uygulama_%C3%A7at%C4%B1s%C4%B1&action=edit&redlink=1), topluluk [portalı](https://tr.wikipedia.org/wiki/Portal), [forum](https://tr.wikipedia.org/wiki/Forum) ya da [blog motoru](https://tr.wikipedia.org/w/index.php?title=Blog_motoru&action=edit&redlink=1) olarak da kullanılabilmektedir. **Drupal** şu anda mevcut olan en popüler **CMS**’lerden biridir ve devlet kurumları, büyük dernekler, kar amacı gütmeyen kuruluşlar ve birçok Fortune 500 şirketi tarafından kullanılmaktadır.

### LEMP stack nedir?

LEMP, web uygulamaları geliştirmek için kullanılan açık kaynaklı bir web uygulaması yığınıdır. LEMP terimi, [Linux işletim sistemi](https://tr.wikipedia.org/wiki/Linux) için L, [Nginx](https://tr.wikipedia.org/wiki/Nginx) web sunucusu (engine-x olarak telaffuz edilir, dolayısıyla kısaltmada E olarak telaffuz edilir), [MySQL](https://tr.wikipedia.org/wiki/MySQL) veritabanı için M ve [PHP](https://tr.wikipedia.org/wiki/PHP) dili için P’yi temsil eden bir kısaltmadır.

- **L-** Linux Operating System- **E-** Nginx Server- **M-** MySQL Database- **P-** PHP### CMS nedir?

CMS, İngilizce “Content Management System” kelimesinin kısaltılmışıdır ve Türkçe çevirisi ise “içerik yönetim sistemi” olarak kabul edilmiştir. Hazır kaynak kodlara sahip bu sistemler ile birçok farklı konuda ve alanda internet sitesi tasarlayabilir ve yayına alabilirsiniz. Sistemler diyoruz çünkü tek bir tane CMS sistemi bulunmamaktadır. Dünya üzerinde yüzlerce içerik yönetim sistemi aktif olarak kullanılmaktadır ve farklı amaçlara hizmet etmektedir.

### CMS yazılımları kullanmanın artısı nelerdir?

**1-Kullanıcı dostudurlar**


Hiç kimse gezinmesi ve kullanması zor olan yazılımları kullanmaktan hoşlanmaz. Sizin de onları kullanmama şansınız olsaydı hiç kullanmamayı tercih ettiğiniz bazı uygulamalar vardır.


**2-Kolaylıkla isteğinize göre özelleştirebilirsiniz**


Çoğu içerik yönetim sisteminin birçok özelleştirme seçeneği vardır. Yeni bir tema yükleyerek genel tasarımı, görünümü ve düzeni kolayca ayarlayabilirsiniz. Bu özelleştirmeler, temel renklerden ve menü konumlarından tutun içeriğin görüntülenme biçimine kadar her şeyi değiştirmenize olanak tanır.


Eklentiler ve uzantılar, içerik yönetimi yazılımı ile elde ettiğiniz işlevler dizisini genişletme olanağı sağlar. Sıfırdan kodlamak yerine sadece eklentisini indirerek websitenizi aşağıdaki özelliklere sahip bir hale getirebilirsiniz.

- Alışveriş sepetleri- İletişim formları- E-posta listesi yönetimi senkronizasyonu- Spam koruması- Görüntü sıkıştırma- Ekstra güvenlik- Ve daha bir sürü şey!

Az önce de belirttiğim gibi bunları yapmak için teknik bilgiye sahip olmanız gerekmez. Sadece bir tık ile eklentileri indirmeniz yeterlidir.


Tüm web sitelerinin aynı özelliklere ve işlevselliğe ihtiyaç duymadığının farkındasızındır, ondan dolayı bu özelleştirme seçenekleri çok kullanışlıdır. İstemediğiniz bir özellik için gereksiz yere depolama alanı harcamanıza gerek kalmaz. Örneğin, işletmenizin yalnızca birkaç sayfa içeriğe ihtiyacı olabilir veya çeşitli ürün sayfalarını sergileyecek eksiksiz bir e-Ticaret sitesi oluşturuyor olabilirsiniz. Gereksinimleriniz ne olursa olsun, kullandığınız CMS’nin gereksinimlerinize uyacak şekilde özelleştirilebilmesi için yeterince esnek olması gerekir.


**3-Mobil dostudur**


Responsive bir tasarım yapısı, çeşitli cihazlarda kesintisiz içerik görüntülemeye olanak tanır. Günümüzde neredeyse hepimizin bir cep telefonu bulunuyor. Bu durum responsive tasarımların gerekliliğini gösterdi. Siteniz tüm cihazlara duyarlı olmalıdır. Drupal ve diğer CMS yazılımları doğuştan mobil dostu olarak kurulurlar. Gönderilerinizi normal bir websitesinde yapacağınız gibi ekran tiplerine göre ayarlamanız gerekmez. Bunu yazılım sizin yerinize yapar.


**4-SEO dostudur**


SEO: türkçesi, arama motoru optimizasyonu anlamına gelmektedir. Yani internette herhangi bir şey arattığınızda sizin websitenizin arama sonuçlarında ne kadar yukarıda çıkacağını belirler. Çoğunuz internette bir arama yaptığınızda ilk 3–4 sonuç dışındakilere bakma ihtiyacı bile duymazsınız. Websitenizin SEO ayarlarının ne kadar mühim olduğunu anlıyorsunuzdur. Normal bir websitesinde bu ayarları kendiniz hatta cidden buna önem veriyorsanız SEO uzmanı tutarak ona yaptırmanız gerekebilir. CMS yazılımları bunları sizin yerinize yaparak arama motorları için sizin websitenizi optimize eder. Bu yeterli gelmezse SEOda daha iyi puanlar almak için eklentiler de kurabilirsiniz.


**5-Maliyet**


İşletmeniz için sıfırdan bir blog sitesi oluşturacağınızı düşünelim. Eğer bu alanlarda herhangi bir yeteneğiniz yoksa yapması için bir web geliştiricisi tutmanız gerekecektir. Websitesi yapıldıktan sonra ileride herhangi bir değişiklik yapmak isterseniz büyük ihtimal tekrar bir web geliştiricisi tutmanız gerekebilir. Ayrıca bu değişiklikler yapması uzun sürebileceğinden zaman olarak da size kaybettirebilir. Drupal gibi CMS yazılımları kullanarak kurulumunu ve istediğiniz değişiklikleri tamamen kendiniz yapabilirsiniz. Ayrıca değişiklik yaparken de eklenti vb. kullanarak normal bir websitesinde günler alabilecek değişikleri siz çok kısa süreler içerisinde yapabilirsiniz.


Artık neyin ne olduğunu öğrendiysek yavaştan kuruluma geçelim.

### Gereksinimler- Bir adet Ubuntu veya türevi işletim sistemi kurulu min 5GB boş yeri olan bir makine.- İnternet bağlantısı.- Kullanacağınız makinenin ip adresine yönlendiren bir A kaydı olan Domain.### Nginx kurulumumuzu yapalım

Aşağıdaki komutu girerek nginx kurulumuzu yapalım.


sudo apt update && sudo apt install nginx


İndirme bittikten sonra sunucumuzun ip adresini tarayıcımıza girelim. Karşımıza aşağıdaki gibi bir ekran çıkması gerek.

<img src="https://cdn-images-1.medium.com/max/780/1*pAAbdNW0szeKaejJAmsFDw.png" alt="Image" />### MySQL kurulumunu yapalım

Aşağıdaki komutları sırasıyla makinemizin terminaline girerek MySQL kurulumunu yapalım.


sudo apt install mariadb-server mariadb-client


Ardından MySQL konsolunun güvenliği için şifre belirleyelim.


sudo mysql_secure_installation


Aşağıdaki gibi cevaplandırıyoruz.


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


Denemek için MySQL konsoluna girelim.


sudo mysql -u root -p


Şifreyi girdiğinizde aşağıdaki gibi bir ekran sizi karşılayacaktır.

<img src="https://cdn-images-1.medium.com/max/795/1*Em3HWZjVJYuiDmZxRGT1iQ.png" alt="Image" />### PHP kurulumlarımızı yapalım

Drupalın kullanacağımız sürümü PHP’nin 8.1 ve üzeri sürümlerini desteklemekte. Ubuntu 20.04LTS’nin repolarında PHP’nin bu sürümü bulunmadığı için paket reposunu kendimiz eklememiz gerek.


sudo apt-get install software-properties-common
sudo add-apt-repository ppa:ondrej/php
sudo apt update


Ardından PHP’yi makinemize kurabiliriz.


sudo apt install php8.2-fpm php8.2-common php8.2-mysql php8.2-gmp php8.2-curl php8.2-intl php8.2-mbstring php8.2-xmlrpc php8.2-gd php8.2-xml php8.2-cli php8.2-zip

### Drupal için bir veritabanı oluşturalım

Drupal, kendi verilerini tutmak için bir veritabanına ihtiyaç duyuyor. Ona bir veritabanı oluşturmak için aşağıdaki komutu girerek MySQL konsolumuzu açalım ve belirlediğimiz şifremizi girelim.


sudo mysql -u root -p


Ardından veritabanını oluşturalım.


CREATE DATABASE drupaldb;


Drupal’ın bu veritabanında düzenlemeler yapabilmesi için ona ayrı bir kullanıcı oluşturmamız gerek.


CREATE USER 'drupal'@'localhost' IDENTIFIED BY 'password';


Oluşturduğumuz kullanıcıya “drupaldb” veritabanında işlem yapmak için izin verelim.


GRANT ALL ON drupaldb.* TO 'drupal'@'localhost' WITH GRANT OPTION;


Aşağıdaki komutları yazarak işlemleri kaydedelim ve çıkalım.


FLUSH PRIVILEGES;
EXIT;

### Drupal’ı makinemize indirelim

Drupalı indirebilmek için öncelikle bazı kurulumlar yapmamız gerek.


sudo apt install curl git
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer


Kurulumları yaptıktan sonra aşağıdaki komutları sırasıyla yazarak Drupal’ı makinemizin **“/var/www/html”** dizinine kuralım.


cd /var/www/html
sudo git clone --branch 10.0.2 https://git.drupal.org/project/drupal.git
cd /var/www/html/drupal
sudo composer install


Burada “Continue as root/super user [yes]?” diye sorarsa yes diyerek devam edelim.


Drupalın bulunduğu dizine nginx’in erişebilmesi için izinlerini değiştirmemiz gerek.


sudo chown -R www-data:www-data /var/www/html/drupal/
sudo chmod -R 755 /var/www/html/drupal/

### Drupal için Nginx’i ayarlayalım

Drupal’ı indirme işlemini tamamladık. Şimdi, Nginx’i Drupal web sitemizle kullanmak üzere yeni bir sunucu bloğu oluşturalım. Nginx ile istediğiniz kadar sunucu bloğu oluşturabilirsiniz.


sudo nano /etc/nginx/sites-available/drupal.conf


Dosyanın içeriği aşağıdaki gibi olmalı. **“server_name”** kısmına kendi domaininizi girebilirsiniz.


server {
 server_name drupal.tayfun.com;
 root /var/www/html/drupal; ## <-- Drupal'ın bulunduğu dizin
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
 # try_files $uri @rewrite; # For Drupal <= 6
 try_files $uri /index.php?$query_string; # For Drupal >= 7
 }
​
 location @rewrite {
 #rewrite ^/(.*)$ /index.php?q=$1; # For Drupal <= 6
 rewrite ^ /index.php; # For Drupal >= 7
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
 # location ~ ^/sites/.*/files/imagecache/ { # For Drupal <= 6
 location ~ ^/sites/.*/files/styles/ { # For Drupal >= 7
 try_files $uri @rewrite;
 }
​
 # Handle private files through Drupal. Private file's path can come
 # with a language prefix.
 location ~ ^(/[a-z\-]+)?/system/files/ { # For Drupal >= 7
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


Ardından aşağıdaki komutları girerek Drupal’ı çalıştıracak şekilde ayarlayalım.


sudo ln -s /etc/nginx/sites-available/drupal.conf /etc/nginx/sites-enabled/
sudo systemctl restart nginx.service

### Makinemize erişelim

Domaininizi tarayıcınız ile eriştiğinizde sizi aşağıdaki gibi bir ekran karşılayacak.

<img src="https://cdn-images-1.medium.com/max/1024/1*-drF4YyECkpjh4GbUPjhXw.png" alt="Image" />

Burada istenen dili seçiyoruz ardından veritabanı bağlantısını oluşturduğumuz veritabanı ile kullanıcı şifre girerek sağlıyoruz.

<img src="https://cdn-images-1.medium.com/max/564/1*FMowraDKYWHf8W45BvvLdQ.png" alt="Image" />

Son olarak site bilgisini isteğimize bağlı dolduruyoruz.

<img src="https://cdn-images-1.medium.com/max/1024/1*UvujZ73U8TEJNUbWiV3NeA.jpeg" alt="Image" />

Tebrikler! Kurulumu başarı ile tamamladınız.

<img src="https://cdn-images-1.medium.com/max/1024/1*v-V6mUYcS1qFHoQLPbJ39g.png" alt="Image" />
