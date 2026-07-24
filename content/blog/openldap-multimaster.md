---
title: "TLS ile OpenLDAP Multimaster replication konfigürasyonu"
description: "OpenLDAP Multimaster replication kurulumu ve TLS ile güvenli hale getirme"
draft: false
tags: ["LDAP", "OpenLDAP", "TLS", "Linux"]
showToc: true
weight: 70
cover:
    image: "blog/openldap-multimaster/cover.png"
---

### 🔗 [Medium'da Oku](https://medium.com/@tyfnacici/openldap-multimaster)

- En az 2 adet openLDAP kurulu sanal makine. Bu yazıda Ubuntu 22.04 LTS kullanacağız. Aynı dağıtımları kullanmanız şiddetle tavsiye edilir.- Kullanacağımız sanal makinelerin hepsinde kurulu ve senkronize çalışan NTP server.### LDAP Nedir ?

**Lightweight Directory Access Protocol** veya kısaca **LDAP** (\*Basit İndeks Erişim Protokolü\*) TCP/IP üzerinde çalışan indeks servislerini sorgulama ve değiştirme amacıyla kullanılan uygulama katmanı protokolü.


Bu protokol, OpenLDAP, Sun Directory Server, Microsoft Active Directory gibi indeks sunucuları tarafından kullanılmaktadır. Başlangıç için veritabanına benzer yapıda diyebiliriz fakat bir veritabanı ile en temel farkı hiyerarşik bir yapıda olmamasıdır.


LDAP protokolü message-oriented (mesaj kaynaklı) bir protokoldür. Bunun anlamı şudur: istemci istek içeren bir LDAP iletisi oluşturur, ve mesajı sunucuya gönderir, sunucu ise bu istemi işler, ve sonucu bir veya birden fazla LDAP mesajı olarak istemciye yanıtı gönderir.


LDAP mesaj tabanlı bir protokol olduğu için, istemci tek seferde birden fazla istemde bulunabilir. Örneğin bir istemci aynı anda iki arama işlemini yapabilir. Birden fazla işlemi aynı anda yababilmeyi mümkün kılması LDAP protokolünü buna izin vermeyen HTTP ve benzeri protokollere göre daha esnek ve verimli bir protokol yapmaktadır.

### OpenLDAP Nedir ?

OpenLDAP, LDAP ‘ın OpenLDAP Project tarafından geliştirilmiş bir uygulamasıdır. OpenLDAP Kamu Lisansı olarak bilinen BSD-türevi bir lisans kullanmaktadır. Platform bağımsız bir protokoldür. Kullanımda olan birçok Linux dağıtımı, LDAP desteği için OpenLDAP yazılımını barındırır.

### NTP Nedir ?

NTP, fazlalık kapasitesi olan bir sıralı zaman dağıtım sistemidir. Ağdaki ve de hedef makinedeki algoritmaları, gecikmeleri ölçer. Bu teknikleri kullanarak saatleri saliselere kadar senkronize edebilir. NTP ayarları hangi dağıtımın kullanıldığına bağlı olarak ya /etc/ntp.conf ya da /etc/xntp.conf dosyasından yapılır.


Çoğu temel yapılandırmalı ntp.conf dosyasında iki sunucu ismi mevcuttur. Birisi, saat ayarının yapılması istenen sunucunun adı ve diğeri de sahte bir IP adresidir.
Sahte IP adresi ağ problemleri olması durumunda veya NTP sunucusunun kapalı olması/çökmesi durumunda kullanılır. Sistemdeki NTP uygulaması, uzak NTP sunucusu ayağa kalkınca, sistem saatini tekrar ona göre ayarlayacaktır. Bu iki sunucudan birincisi asıl sunucu olarak işlem yapar, ikincisi ise yedek amaçlıdır. Ayrıca bu hedef dosyanın yeri de belirtilmelidir. NTP zamanla, sistem saatindeki hata oranını “öğrenecek” ve kendini buna göre ayarlayacaktır.

### Kuruluma Başlayalım

Aşağıdaki adımları her iki sunucuda da uygulamanız gerekmektedir.

#### 1-Öncelikle cihazlarımızın ikisine de NTP kurup bütün makinelerimizin senkron çalışmasını sağlayalım.

apt -y install ntp


Ubuntuda NTP paketi hali hazırda konfigüre edilmiş olduğundan dolayı NTP ile ilgili herhangi ek bir işlem yapmamıza gerek kalmıyor.

#### 2-Sunucularımızın hepsi birbirini tanımalı

nano /etc/hosts


Bu dosyanın içerisine ise makinelerimizin ip adresleri ve onların yanına koymak istediğimiz adresleri yazıyoruz.


10.0.0.1 ldap1.tayfun.com
10.0.0.2 ldap2.tayfun.com


Bu ayarımızın çalışıp çalışmadığını denemek için makinelerimizin birinden diğerine yazdığınız adresleri girip ping atabilirsiniz.

### Artık ldap kurulumuna geçebiliriz.#### Multi-Master Kurulumunda Master olmasını istediğimiz makinemize Ldap kurulumunu yapıyoruz.#### 1-Aşağıda belirttiğim adımlar her iki makinede de yapılmalıdır.

apt -y install slapd ldap-utils

<img src="https://cdn-images-1.medium.com/max/802/1*p3mMm6KZOpqNtrZMyN8j0w.png" alt="Image" />
*Kurulum esnasında belirlediğiniz şifreyi unutmayın bize lazım olacak :).*
#### 2-Kurulum bittikten sonra aşağıdaki komutu çalıştırıp bazı konfigürasyonları tamamlamamız gerekiyor.

dpkg-reconfigure slapd


Bu komutu çalıştırdıktan sonra çıkan sorulara aşağıdaki gibi cevap vermeniz gerekiyor.

- **Omit OpenLDAP Server Configuration:** No- **DNS Domain Name:** This creates the base structure for your directory path.<img src="https://cdn-images-1.medium.com/max/619/1*wRNMw9cHCumOx8XpodwteA.png" alt="Image" />- **Organization Name: **The name to be used as the base DN for your LDAP directory.- **Administrator Password:** Az önce ayarladığınız admin şifresi- **Remove The Database When Slapd Is Purged:** No- **Move Old Database:** Yes

Bu ayarlamaları yaptıktan sonra aşağıdaki komutu konsola yazarak ayarlarınızı kontrol edebilirsiniz.


slapcat

<img src="https://cdn-images-1.medium.com/max/621/1*sEBkZGM_paKyh9KTxN4xgA.png" alt="Image" />#### 3-Kullanıcılar ve gruplar için bir temel DN oluşturalım.

Aşağıdaki şekilde dosyayı oluşturalım ve içerisine de eklediğim yazıları koyalım.


vim base.ldif


dn: ou=people,dc=plusclouds,dc=com
objectClass: organizationalUnit
ou: people

dn: ou=groups,dc=plusclouds,dc=com
objectClass: organizationalUnit
ou: groups


Bu dosyayı ldap kurulumumuza eklemek için şu komutu çalıştırmamız gerekiyor


ldapadd -x -D cn=admin,dc=plusclouds,dc=com -W -f base.ldif


Şifre sorduğu zaman ise ldap’i kurarken eklediğiniz şifreyi yazmanız gerekiyor.

#### Multi-Master Kurulumundaki slave olmasını istediğimiz sunucuların kurulumuna geçelim#### 1-Gerekli paketlerin kurulumunu yapalım.

apt -y install libnss-ldapd libpam-ldapd ldap-utils

#### 2-Kurulumu yaptıktan sonra aşağıdaki komutu çalıştırarak gerekli konfigürasyonları yapalım

dpkg-reconfigure nslcd

<img src="https://cdn-images-1.medium.com/max/621/1*YN-w9sncdQfOlgVxc4csrA.png" alt="Image" />

Gelen ekranda Master olan sunucumuzun hosts dosyasında belirlediğimiz adresi ne ise onu girelim.

<img src="https://cdn-images-1.medium.com/max/621/1*oN-QDQi2CrEZVEhdJ3tG0w.png" alt="Image" />
*LDAP base adresimizi de girelim.*
<img src="https://cdn-images-1.medium.com/max/1024/1*3GdsgToF4sVhCdqBP_LOug.png" alt="Image" />
*Burada simpleyi seçiyoruz.*
<img src="https://cdn-images-1.medium.com/max/1024/1*T1USgfUSRVbVs2na_ioYvA.png" alt="Image" />
*Burada hangi hesap ile ldap veri tabanına erişilmesini istiyorsanız onu giriniz. Ben admin hesabını gireceğim.*


Daha sonra çıkan ekranda ldap admin şifremizi girdikten sonra Use StartTLS seçeneğine evet diyoruz.

<img src="https://cdn-images-1.medium.com/max/1024/1*glMFxxUu6f_jBEw-gS2A_A.png" alt="Image" />
*Bu ekrana ise allow diyoruz.*
<img src="https://cdn-images-1.medium.com/max/1024/1*V45R_jGNlMqyg-wJLI0-Tg.png" alt="Image" />
*Burada benim belirttim adresi yazınız. Biraz sonra buraya sertifikayı ekleyeceğiz.*


Bu konfigürasyonları yaptıktan sonra aşağıdaki dosyaya girip en sonuna şu satırları eklemeniz gerekiyor.


vim /etc/pam.d/common-session


session optional pam_mkhomedir.so skel=/etc/skel umask=077


Daha sonra Slave makinanızda şu komutu çalıştırınız.


systemctl restart nscd nslcd


Ardından makinenizden “exit” komutu ile çıkış yapıp tekrar bağlantı kurunuz. Bağlantı kurduğunuzda ise “passwd” komutu ile yeni bir şifre belirleyiniz. Bu şifre ssh ile bağlandığınızda slave makinenizdeki kullanıcı hesabının şifresi olacak.

### SSL için sertifika oluşturmak.

Bu kısımın sadece test ve geliştirme yapma amaçlı kullanmak için yapılması tavsiye edilir. Gerçek ortamda kullanılacak sistemlerde bir otoriteden sertifikayı almanız daha güvenli olacaktır.


tüm makinelerimizde “**/etc/ssl/openssl.cnf” dosyasına **Master makinenizin DNS i olacak şekilde** aşağıda belirteceğim şekilde bir ekleme yapmalısınız.**


[ plusclouds.com ]
subjectAltName = DNS:ldap1.tayfun.com


ardından “/etc/ssl/private” dizinine gidip şu komutu çalıştırınız.


openssl genrsa -aes128 2048 > server.key


Bir şifre belirledikten sonra şu komutu çalıştırınız


openssl rsa -in server.key -out server.key


SSL sertifikanızı oluşturmak için son olarak şu komutu çalıştırınız.


openssl req -utf8 -new -key server.key -out server.csr


Bu komut size birkaç soru soracaktır. Şu an test amaçlı bunu yaptığımızsdan dolayı hepsini boş bırakarak devam ediyorum.


Tebrikler sertifikamızı oluşturduk.


Sertifikamızı kullanabilmek için şu komutu çalıştırmamız gerekiyor.


openssl x509 -in server.csr -out server.crt -req -signkey server.key -extfile /etc/ssl/openssl.cnf -extensions plusclouds.com -days 3650


Ardından bulunduğumuz dizinde izinleri düzeliyoruz.


chmod 600 server.key


ll server.*

### Sertifikamıza sahip olduğumuza göre SSL kurulumuna geçelim.

Aşağıdaki adımlar tüm sunucularımızda yapılacaktır.


Aşağıdaki iki komutu ardarda çalıştırıyoruz.


cp /etc/ssl/private/server.key \
/etc/ssl/private/server.crt \
/etc/ssl/certs/ca-certificates.crt \
/etc/ldap/sasl2/


chown openldap. /etc/ldap/sasl2/server.key \
/etc/ldap/sasl2/server.crt \
/etc/ldap/sasl2/ca-certificates.crt


Ardından bir “mod_ssl.ldif” isimli dosya oluşturuyoruz ve içini aşağıdaki şekilde dolduruyoruz.


dn: cn=config
changetype: modify
add: olcTLSCACertificateFile
olcTLSCACertificateFile: /etc/ldap/sasl2/ca-certificates.crt
-
replace: olcTLSCertificateFile
olcTLSCertificateFile: /etc/ldap/sasl2/server.crt
-
replace: olcTLSCertificateKeyFile
olcTLSCertificateKeyFile: /etc/ldap/sasl2/server.key


Bu dosyamızı ise LDAP konfigürasyonumuza şu şekilde ekliyoruz.


ldapmodify -Y EXTERNAL -H ldapi:/// -f mod_ssl.ldif


Ardından aşağıdaki komutu yazarak slapd servisini yeniden başlatıyoruz.


 systemctl restart slapd

#### Sunucularımızdaki SSL için gerekli ayarlamaları yaptık. Aşağıdaki adımları ise Slave sunucumuzda uygulamamız gerek.

“etc/nslcd.conf” dosyamıza girip 29. satıra aşağıdaki eklemeleri yapıyoruz.


ssl start_tls
tls_reqcert allow


ardından “[**systemctl**](https://www.server-world.info/en/command/html/systemctl.html)** restart nslcd” ile servisimizi yeniden başlatıyoruz ve exit dedikten sonra ssh ile tekrar bağlanıyoruz.**

### Bütün kurulumları yaptık. Artık Multi-Master Replication kurulumumuza geçelim.

Aşağıdaki adımları her iki sunucumuzda da yapıyoruz.


Bir “mod_syncprov.ldif” isimli dosya oluşturuyoruz ve içerisini aşağıdaki gibi dolduruyoruz.


dn: cn=module,cn=config
objectClass: olcModuleList
cn: module
olcModulePath: /usr/lib/ldap
olcModuleLoad: syncprov.la


ldapadd -Y EXTERNAL -H ldapi:/// -f mod_syncprov.ldif


Yukarıdaki komut ile bu dosyayı konfigürasyonumuza ekliyoruz.


Bu işlmin ardından “syncprov.ldif” isimli bir dosya oluşturuyoruz. İçerisini de aşağıdaki gibi dolduruyoruz.


dn: olcOverlay=syncprov,olcDatabase={1}mdb,cn=config
objectClass: olcOverlayConfig
objectClass: olcSyncProvConfig
olcOverlay: syncprov
olcSpSessionLog: 100


Bu dosyayı da aşağıdaki komut ile konfigürasyonumuza ekliyoruz.


ldapadd -Y EXTERNAL -H ldapi:/// -f syncprov.ldif


“multimaster.ldif” isimli bir dosya oluşturuyoruz. İçerisini de aşağıdaki gibi dolduruyoruz.


dn: cn=config
changetype: modify
replace: olcServerID
olcServerID: 1 //Burası her sunucuda farklı olmalıdır. Slave/Master fark etmeksizin.

dn: olcDatabase={1}mdb,cn=config
changetype: modify
add: olcSyncRepl
olcSyncRepl: rid=001
 provider=ldap://10.0.0.1:389/ //Her makinenin kendi ip adresi ve 389 portu
 bindmethod=simple
 binddn="cn=admin,dc=plusclouds,dc=com"
 credentials=123 //ldap şifreniz
 searchbase="dc=plusclouds,dc=com"
 scope=sub
 schemachecking=on
 type=refreshAndPersist
 retry="30 5 300 3"
 interval=00:00:05:00
-
add: olcMirrorMode
olcMirrorMode: TRUE

dn: olcOverlay=syncprov,olcDatabase={1}mdb,cn=config
changetype: add
objectClass: olcOverlayConfig
objectClass: olcSyncProvConfig
olcOverlay: syncprov


Ardından bu dosyayı her iki makinemizde de konfigürasyona ekliyelim.


ldapmodify -Y EXTERNAL -H ldapi:/// -f master01.ldif


Aşağıdaki adımı ise sadece Slave olacak makinemizde uyguluyoruz.


“/etc/nslcd.conf” dosyasına girip 10. satıra şunları ekliyoruz.


uri ldap://ldap1.tayfun.com/ ldap://ldap2.tayfun.com/


Son olarak aşağıdaki komut ile nslcd servisini yeniden başlatıyoruz.


systemctl restart nslcd

### Kurulumumuzu tamamladık. Haydi çalışıp çalışmadığını bir deneyelim.

Herhangi bir makinemizde “ldapuser.ldif” isimli dosya oluşturalım.


dn: uid=jammy,ou=people,dc=plusclouds,dc=com
objectClass: inetOrgPerson
objectClass: posixAccount
objectClass: shadowAccount
cn: jammy
sn: ubuntu
userPassword: {SSHA}j3oQtXCibE6YNoWl5Dh3G6+sHd1+pCOW //Buraya slappaswd ile bir şifre alıp onu koymanız gerekmektedir.
loginShell: /bin/bash
uidNumber: 2000
gidNumber: 2000
homeDirectory: /home/jammy

dn: cn=jammy,ou=groups,dc=plusclouds,dc=com
objectClass: posixGroup
cn: jammy
gidNumber: 2000
memberUid: jammy


Bu kullanıcıyı konfigürasyonumuza aşağıdaki komut ile ekledikten sonra diğer makinelerimizde de bu kullanıcının oluşması gerekmektedir.


ldapadd -x -D cn=admin,dc=plusclouds,dc=com -W -f ldapuser.ldif
