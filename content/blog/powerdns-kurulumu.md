---
title: "Ubuntu 20.04LTS PowerDNS kurulumu"
description: "Ubuntu 20.04 LTS üzerinde PowerDNS kurulumu ve yapılandırma adımları"
draft: false
tags: ["DNS", "PowerDNS", "Ubuntu", "Linux"]
showToc: true
weight: 30
cover:
    image: "blog/powerdns-kurulumu/cover.png"
---

### 🔗 [Medium'da Oku](https://medium.com/@tyfnacici/powerdns-kurulumu)

<img src="https://cdn-images-1.medium.com/max/280/1*tH2YrWgGxZLIuZrsVmXEfw.png" alt="Image" />### DNS nedir?

DNS (Alan Adı Sistemi), insan tarafından okunabilir alan adlarını IP adreslerine dönüştüren dağıtılmış ve hiyerarşik bir sistemdir. Bilgisayarlar ve diğer cihazlar birbirleriyle etki alanı adlarını değil IP adreslerini kullanarak iletişim kurduklarından, bu, web sitelerine ve diğer internet tabanlı hizmetlere erişmek için çok önemlidir.


Bir kullanıcı tarayıcıya bir etki alanı adı yazdığında, aygıtı bir DNS sunucusuna bir istek gönderir ve ardından ilgili IP adresini arar ve cihaza döndürür. Cihaz daha sonra istenen web sitesi veya hizmetle bağlantı kurmak için IP adresini kullanabilir.


DNS, internet’in kullanıcı dostu bir şekilde çalışmasına izin veren önemli bir bileşenidir. DNS olmadan, kullanıcıların web sitelerine erişmek için IP adreslerini manuel olarak girmesi gerekir, bu da interneti çok daha az erişilebilir ve kullanıcı dostu hale getirir.

### DNS kayıtları nelerdir?

DNS kayıtları, DNS sunucularında depolanan bilgi türleridir. Aşağıdakiler de dahil olmak üzere çeşitli DNS kaydı türleri vardır:

- A (Address) kayıdı: alan adını ip adresi ile eşler.- MX (Mail Exchange) kayıdı: bir etki alanı için e-posta iletilerini kabul etmekten sorumlu posta sunucusunu belirtir.- CNAME (Canonical Name) Kayıdı: bilgisayar adı için takma ad oluşturur.- NS (Name Server) kayıdı: belirli bir etki alanı için yetkili alan adı sunucularını tanımlar- PTR (Pointer) kayıdı: bir IP adresini bir ana bilgisayar adına eşler- TXT (Text) kayıdı: e-posta sahteciliğiyle mücadele için SPF (Gönderen İlkesi Çerçevesi) bilgileri gibi bir ana bilgisayar hakkında ek bilgiler sağlar- SRV (Service) kayıdı: bir etki alanı için belirli bir hizmeti barındıran sunucunun konumu gibi hizmetlerin konumunu belirtmek için kullanılır

Bu kayıtlar, Internet’te bulunan çeşitli hizmetlerin ve kaynakların yapılandırılmasına ve yönetilmesine yardımcı olarak kullanıcıların bunlara erişmesini ve bunları verimli bir şekilde kullanmasını sağlar.

### PowerDNS nedir?

PowerDNS (pdns), geleneksel BIND (named) DNS’e alternatif olarak çalışan açık kaynaklı bir DNS sunucusudur. PowerDNS normal DNS’e göre daha iyi performans sunar ve minimum bellek gereksinimine sahiptir. PowerDNS ayrıca basit DNS alan dosyalarından karmaşık veritabanı kurulumlarına ve çeşitli SQL platformlarına kadar birçok backend çalışabilir.

### MySQL veritabanını indirelim

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

<img src="https://cdn-images-1.medium.com/max/795/1*Em3HWZjVJYuiDmZxRGT1iQ.png" alt="Image" />### PowerDNS kurulumunu yapalım

PowerDNS reposunu makinemize eklemek için aşağıdaki komutları sırasıyla yazalım.


# Download PowerDNS GPG Key
wget -qO- https://repo.powerdns.com/FD380FBB-pub.asc | gpg --dearmor > /etc/apt/trusted.gpg.d/pdns.gpg
​
# Adding the PowerDNS Repository for Ubuntu 20.04 System
echo "deb [arch=amd64] http://repo.powerdns.com/ubuntu focal-auth-45 main" | sudo tee /etc/apt/sources.list.d/pdns.list


Ardından **“/etc/apt/preferences.d/pdns”** dosyasını oluşturalım ve aşağıdakileri girelim.


# all packages with first name pdns- will be installed from the repo.powerdns.com repository
Package: pdns-*
Pin: origin repo.powerdns.com
Pin-Priority: 600


Sistemimizin paket indexini yenileyelim ve gerekli paketleri indirelim.


# refresh package index after adding new repository
sudo apt update
​
# install PowerDNS and PowerDNS MySQL/MariaDB backend
sudo apt install pdns-server pdns-backend-mysql -y


Son olarak PowerDNS servisi çalışıyor mu kontrol edelim.


sudo systemctl status pdns.service


Gördüğünüz gibi PowerDNS servisi 53 portunda çalışır vaziyette.

<img src="https://cdn-images-1.medium.com/max/1024/1*hAdaX93tpcA_xuJFC8lw9A.png" alt="Image" />### PowerDNS veritabanını konfigüre edelim

MySQL konsolumuzu açalım.


mysql -u root -p


Ardından aşağıdaki komutları girerek PowerDNS için bir veritabanı oluşturalım ve PowerDNS’in bu veritabanına erişebilmesi için bir kullanıcı oluşturalım.


# creating database named pdns
create database pdns;
​
# create user pdnsadmin and grant privileges to the database pdns
grant all on pdns.* to pdnsadmin@localhost identified by 'StrongPdnsPasswd';
​
# reload database privileges to apply new changes
flush privileges;
​
# exit from the MySQL shell
exit


Ardından PowerDNS’in oluşturmuş olduğu hazır veritabanı şemasını MySQL veritabanımıza ekleyelim.


# import the schema.mysql.sql to the pdns database
mysql -u pdnsadmin -p pdns < /usr/share/pdns-backend-mysql/schema/schema.mysql.sql


Bu işlemden sonra aşağıdaki komutu yazdığımızda bize bunun gibi bir çıktı vermesi gerek.

<img src="https://cdn-images-1.medium.com/max/467/1*VOpuPBqLm4wie7YI_8vTWw.png" alt="Image" />### PowerDNS’i MySQL’e bağlayalım

Öncelikle PowerDNS servisini durduralım.


sudo systemctl stop pdns.service


Ardından **“*/etc/powerdns/pdns.d/mysql.conf*”** isimli dosyayı oluşturalım ve içerisini aşağıdaki gibi dolduralım.


# Define the gmysql backend
launch+=gmysql
​
# Details MariaDB database for PowerDNS
gmysql-host=127.0.0.1
gmysql-port=3306
gmysql-dbname=pdns #powerdns için oluşturduğumuz veritabanı
gmysql-user=pdnsadmin #powerdns için oluşturduğumuz kullanıcı
gmysql-password=StrongPdnsPasswd #powerdns için oluşturduğumuz şifre
gmysql-dnssec=yes
# gmysql-socket=


Oluşturduğumuz dosyanın izinlerini PowerDNS’in erişebilmesi için düzenleyelim.


# change the ownership to user and group pdns
sudo chown pdns:pdns /etc/powerdns/pdns.d/mysql.conf
​
# change permission of the file
sudo chmod 640 /etc/powerdns/pdns.d/mysql.conf


PowerDNS servisini yeniden başlatalım.


# start PowerDNS service
sudo systemctl start pdns.service
​
# verify status of the PowerDNS service
sudo systemctl status pdns.service

<img src="https://cdn-images-1.medium.com/max/906/1*cMt5YMGR9JmOJrYNG8qqnQ.png" alt="Image" />### DNS kayıtlarını oluşturalım

MySQL konsolunu açalım.


mysql -u root -p


Ardından domainimizi “domains” tablosuna ekleyelim.


INSERT INTO domains (name, type) VALUES ('example.com', 'NATIVE');


Bu domainimize A, NS ve SOA DNS kayıtlarını ekleyelim.


INSERT INTO records (domain_id, name, type, content, ttl)
VALUES (1, 'example.com', 'A', '192.0.2.1', 3600);
​
INSERT INTO records (domain_id, name, type, content, ttl)
VALUES (1, 'example.com', 'NS', 'ns1.example.com', 3600);
​
INSERT INTO records (domain_id, name, type, content, ttl)
VALUES (1, 'example.com', 'SOA', 'ns1.example.com hostmaster.example.com 2023010101 10800 3600 604800 3600', 3600);


MySQL konsolundan çıkalım ve aşağıdaki komutu yazarak konfigürasyonları doğrulayalım.


pdnsutil check-all-zones

<img src="https://cdn-images-1.medium.com/max/780/1*WEVfiT0b1jHMlV9cpt-RCg.png" alt="Image" />

Kurulum başarıyla tamamlandı. Okuduğunuz için teşekkürler.
