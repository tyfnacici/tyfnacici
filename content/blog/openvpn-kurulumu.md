---
title: "OpenVPN server kurulumu ve client konfigürasyonu oluşturma"
description: "OpenVPN sunucu kurulumu ve istemci yapılandırma dosyalarının oluşturulması"
draft: false
tags: ["OpenVPN", "VPN", "Linux", "Security"]
showToc: true
weight: 40
cover:
    image: "blog/openvpn-kurulumu/cover.png"
---

### 🔗 [Medium'da Oku](https://medium.com/@tyfnacici/openvpn-kurulumu)

<img src="https://cdn-images-1.medium.com/max/884/1*dExpXTogMQ1mnsJKvFMOMA.png" alt="Image" />### Gereksinimler- İki adet Ubuntu 20.04 kurulu makine. Bu makinelerin birinde sertifikalarımızı onaylayacağız, diğerinde ise OpenVPN servisimizi kuracağız.- Kuruluma bağlanabilmek için client olacak herhangi bir işletim sistemi kurulu cihaz. (Android, İOS, MacOS, Windows, Linux) Ben kendi makinemde kurulu olan Arch Linux’u kullanacağım.### Sertifikalarımızı onaylayacağımız makinenin kurulumunu ve konfigürasyonunu yapalım

**Not: Bu kısımda bulunanları makinenizde root kullancısı olarak değil, normal bir kullanıcı olarak yapmamız gerekmektedir.**


Aşağıdaki komutlar ile sertifikaları yönetmemizi sağlayan aracı makinemize kuralım.


sudo apt update
sudo apt install easy-rsa


Ardından PKI dizini oluşturalım ve bir önceki adımda indirdiğimiz dosyaların kısayolunu burada oluşturalım.


mkdir ~/easy-rsa
ln -s /usr/share/easy-rsa/* ~/easy-rsa/


Bu dizine sadece bizim erişebilmemiz için izinleri değiştirelim.


chmod 700 /home/plusclouds/easy-rsa


Sertifika oluşturabilmek için PKI’yi başlatalım.


cd ~/easy-rsa
./easyrsa init-pki

### Sertifika yetkilisi oluşturalım

Yukarıda girmiş olduğumuz dizinden çıkmadan **“vars”** isimli dosyayı açalım ve aşağıdaki gibi dolduralım.


nano vars
​
set_var EASYRSA_REQ_COUNTRY "TR"
set_var EASYRSA_REQ_PROVINCE "Istanbul"
set_var EASYRSA_REQ_CITY "Istanbul"
set_var EASYRSA_REQ_ORG "Plusclouds"
set_var EASYRSA_REQ_EMAIL "admin@plusclouds.com"
set_var EASYRSA_REQ_OU "Community"
set_var EASYRSA_ALGO "ec"
set_var EASYRSA_DIGEST "sha512"


Ardından dosyayı kaydedelim ve sertifika yetkilimizi oluşturalım.


./easyrsa build-ca


Bu işlemler sonucunda iki adet çok önemli dosya elde ettiniz. Bunlar **“~/easy-rsa/pki/ca.crt”** **“~/easy-rsa/pki/private/ca.key”**

- ca.crt is the CA’s public certificate file. Users, servers, and clients will use this certificate to verify that they are part of the same web of trust. Every user and server that uses your CA will need to have a copy of this file. All parties will rely on the public certificate to ensure that someone is not impersonating a system and performing a [Man-in-the-middle attack](https://en.wikipedia.org/wiki/Man-in-the-middle_attack).- ca.key is the private key that the CA uses to sign certificates for servers and clients. If an attacker gains access to your CA and, in turn, your ca.key file, you will need to destroy your CA. This is why your ca.key file should **only** be on your CA machine and that, ideally, your CA machine should be kept offline when not signing certificate requests as an extra security measure.

With that, your CA is in place and it is ready to be used to sign certificate requests, and to revoke certificates.

### OpenVPN sunucusu olacak makinemizin kurulumunu yapalım

Aşağıdaki komutları girerek makinemize gerekli olan paketleri indirelim.


sudo apt update
sudo apt install openvpn easy-rsa


Aşağıdaki komutu root olmayan bir kullanıcı ile terminalimize girelim.


mkdir ~/easy-rsa


İndirdiğimiz paketlerin kısayolunu az önce oluşturduğumuz dizine ekleyelim.


ln -s /usr/share/easy-rsa/* ~/easy-rsa/


Ardından bu dosyalara sadece bizim erişebilmemiz için izinleri değiştirelim.


sudo chown plusclouds ~/easy-rsa
chmod 700 ~/easy-rsa

### OpenVPN için bir PKI oluşturalım

OpenVPN için private key ve sertifika oluşturmadan önce local bir PKI dizini oluşturmamız gerekiyor. Bu dizin sayesinde sunucu ve client için sertifika isteklerini yönetebileceğiz.


PKI dizini oluşturmadan önce **“vars”** isimli bir dosya oluşturup içini bazı default değerler ile doldurmamız gerek.


cd ~/easy-rsa
nano vars


Dosyayı açtıktan sonra aşağıdaki satırları dosyaya ekliyoruz ve dosyayı kaydediyoruz.


set_var EASYRSA_ALGO "ec"
set_var EASYRSA_DIGEST "sha512"


Ardından PKI dizini oluşturabiliriz.


./easyrsa init-pki


Bu adımlar, önceki kısımdaki yaptıklarımızla benzer gelebilir fakat OpenVPN kuracağımız sunucu ile Sertifikaları yöneteceğimiz sunucular farklı olduğundan ikisi için ayrı bir PKI dizini oluşturmamız gerekiyor.

### OpenVPN server için Certificate Signing Request (CSR) ve private key oluşturalım

Bu kısımda OpenVPN sunucumuzda sertifika için bir CSR ve private key oluşturacağız. Ardından CSR’ı diğer makinemize göndererek sertifikayı oluşturacağız. Sertifikayı oluşturduktan sonra da OpenVPN sunucumuza gönderebiliriz.


OpenVPN server makinemizde “~/easy-rsa” dizinine girelim.


cd ~/easy-rsa


Aşağıdaki satırda vereceğim **“server”** kısmını kendi isteğinizie göre değişebilirsiniz. Fakat oluşturulan dosyaları **“/etc/openvpn”** dizinine kopyalarken, doğru adları değiştirmeniz gerekecektir. Ayrıca **“/etc/openvpn/server.conf”** dosyasını da doğru **“.crt”** ve “**.key**” dosyalarını göstermesi için değiştirmeniz gerekecektir.


./easyrsa gen-req server nopass


Bu komut bizim için gereken iki dosyayı oluşturacaktır. Ardından bu dosyayı **“/etc/openvpn/server”** dizinine kopyalamamız gerekiyor.


sudo cp /home/plusclouds/easy-rsa/pki/private/server.key /etc/openvpn/server/

### Sertifika için oluşturduğumuz isteği onaylayalım

Önceki adımda oluşturduğumuz dosyaları OpenVPN server makinemizden diğer makinemize aktaralım.


scp /home/plusclouds/easy-rsa/pki/reqs/server.req root@ip_addr:/tmp


Diğer makinemize dosyayı gönderdikten sonra aşağıdaki komutları girelim ve isteğimizi programımıza aktaralım.


cd ~/easy-rsa
sudo ./easyrsa import-req /tmp/server.req server


Programa aktardığımız isteğimizi onaylayalım ve sertifikamızı oluşturalım.


sudo ./easyrsa sign-req server server


Oluşturduğumuz **“server.crt”** ve **“ca.crt”** dosyalarını OpenVPN serverimize aktaralım


scp pki/issued/server.crt root@openvpn_server_ip:/tmp
scp pki/ca.crt root@openvpn_server_ip:/tmp


Server makinemize geçelim ve bu dosyaları **“/etc/openvpn/server”** dizinine kopyalayalım.


sudo cp /tmp/{server.crt,ca.crt} /etc/openvpn/server

### OpenVPN üzerinden kurulacak bağlantılarımıza güvenlik ekleyelim

Ek bir güvenlik katmanı için, sunucunun ve tüm istemcilerin openvpn’in tls-crypt yönergesini kullanacağı ek bir paylaşılan private key ekleyeceğiz. Bu, bir sunucu ve client birbirine bağlandığında kullanılan TLS sertifikasını gizlemek için kullanılır. OpenVPN sunucusu tarafından gelen paketler üzerinde hızlı kontroller yapmak için de kullanılır: bir paket önceden paylaşılan anahtar kullanılarak imzalanırsa, sunucu onu işler; imzalanmamışsa, sunucu bunun güvenilmeyen bir kaynaktan olduğunu bilir ve ek şifre deşifre işlemi yapmak zorunda kalmadan onu bırakır ve bu sayede DDOS işlemlerinden kendini korumuş olur.


Bu kısım, OpenVPN sunucunuzun sunucunun kaynaklarını sömürebilen kimliği doğrulanmamış trafik, port taramaları ve DDOS saldırılarıyla başa çıkabilmesini sağlamaya yardımcı olacaktır. Ayrıca OpenVPN ağ trafiğini tanımlamayı zorlaştırır.


cd ~/easy-rsa
openvpn --genkey --secret ta.key


Ardından oluşturduğumuz dosyayı da **“/etc/openvpn/server/”** dizinine kopyalayalım.


sudo cp ta.key /etc/openvpn/server

### Client için sertifika ve eş anahtar oluşturalım

Bu yazım için OpenVPN sunucumuzda clientler için tek bir client anahtarı ve sertifika çifti oluşturacağız. Birden fazla clientiniz varsa, bu işlemi her biri için tekrarlayabilirsiniz. Her client için benzersiz bir ad değeri iletmeniz gerektiğini lütfen unutmayın.


mkdir -p ~/client-configs/keys


Güvenlik için bu dizinin izinlerini değiştirelim.


mkdir -p ~/client-configs/keys


Sertifika oluşturalım.


cd ~/easy-rsa
sudo ./easyrsa gen-req client1 nopass


Ardından client için oluşturduğumuz anahtarı az önce oluşturduğumuz dizine kopyalayalım.


cp pki/private/client1.key ~/client-configs/keys/


Sertifika oluşturma isteğimizi OpenVPN sunucumuzdan diğer makinemize gönderelim.


scp pki/reqs/client1.req root@ip_addr:/tmp


Diğer makinemizde aşağıdaki komutları girerek aracımıza sertifika isteğini yükleyelim.


cd ~/easy-rsa
./easyrsa import-req /tmp/client1.req client1


İstemcimiz için sertifikayı imzalayalım.


./easyrsa sign-req client client1


Sertifikamızı sunucumuza gönderelim.


scp pki/issued/client1.crt root@openvpn_server_ip:/tmp


Sunucumuza gelen dosyasyı **“~/client-configs/keys/”** dizinine kopyalayalım.


cp /tmp/client1.crt ~/client-configs/keys/


Aşağıdaki komutları girerek kalan dosyalarımızı da bu dizine kopyalayalım.


cp ~/easy-rsa/ta.key ~/client-configs/keys/
sudo cp /etc/openvpn/server/ca.crt ~/client-configs/keys/
sudo chown plusclouds.plusclouds ~/client-configs/keys/*

### OpenVPN konfigürasyonunu yapalım

Örnek bir konfigürasyon dosyası olan **“sample.conf”** dosyasını alalım ve düzenleyelim.


sudo cp /usr/share/doc/openvpn/examples/sample-config-files/server.conf.gz /etc/openvpn/server/
sudo gunzip /etc/openvpn/server/server.conf.gz
sudo nano /etc/openvpn/server/server.conf


Dosyanın içerisinde “tls-auth” aratalım ve çıkan satırın başına ; ekleyerek yorum satırı haline çevirelim. Altına da “tls-crypt ta.key” kısmını ekleyelim.


;tls-auth ta.key 0 # This file is secret
tls-crypt ta.key


“cipher AES-256-CBC” aratalım ve yorum satırına getirelim. Altına da “cipher AES-256-GCM” ekleyelim.


;cipher AES-256-CBC
cipher AES-256-GCM


Bu satırın altına boşluk bırakarak “auth SHA256” ekleyelim.


auth SHA256


Dosyada “dh dh2048.pem” aratalım ve yorum satırı haline getirelim. Altına da “dh none” kısmını ekleyelim.


;dh dh2048.pem
dh none


Dosyada “user nobody” kısmını aratalım ve aşağıdaki gibi değiştirelim.


user nobody
group nobody

### OpenVPN Server için network ayarını güvenlik duvarını konfigüre edelim

Openvpn’in trafiği VPN üzerinden doğru şekilde yönlendirebilmesi için sunucunun ağ yapılandırmasının ayarlanması gereken bazı yönleri vardır. Bunlardan ilki, IP trafiğinin nereye yönlendirilmesi gerektiğini belirlemek için kullanılan bir yöntem olan IP yönlendirmedir. Bu, sunucunuzun sağlayacağı VPN işlevselliği için gereklidir.


sudo nano /etc/sysctl.conf


Bu dosyanın sonuna aşağıdaki satırı ekleyelim ve kaydedelim.


net.ipv4.ip_forward = 1


Bu ayarı kaydetmek için aşağıdaki komutu girelim.


sudo sysctl -p


Aşağıdaki komutu girelim ve güvenlik duvarı konfigürasyonu içi ağ arayüzümüzün ne olduğunu öğrenelim.


ip route list default
​
Çıktı:
default via 159.65.160.1 dev eth0 proto static


Burada ağ arayüzümüzün eth0 olduğunu görüyoruz.


Güvenlik duvarı konfigürasyonu için dosyamızı açalım ve aşağıdaki gibi “START OPENVPN RULES” kısmını dosyaya ekleyelim.


sudo nano /etc/ufw/before.rules


#
# rules.before
#
# Rules that should be run before the ufw command line added rules. Custom
# rules should be added to one of these chains:
# ufw-before-input
# ufw-before-output
# ufw-before-forward
#
 
# START OPENVPN RULES
# NAT table rules
*nat
:POSTROUTING ACCEPT [0:0]
# Allow traffic from OpenVPN client to eth0 (change to the interface you discovered!)
-A POSTROUTING -s 10.8.0.0/8 -o eth0 -j MASQUERADE
COMMIT
# END OPENVPN RULES
 
# Don't delete these required lines, otherwise there will be errors
*filter
. . .


Bu dosyayı kaydedelim ve bir diğer konfigürasyon dosyamızı açalım ve “DEFAULT_FORWARD_POLICY” kısmını aşağıdaki gibi değiştirelim.


sudo nano /etc/default/ufw
​
DEFAULT_FORWARD_POLICY="ACCEPT"


Son olarak aşağıdaki iki komutu girelim.


sudo ufw allow 1194/udp
sudo ufw allow OpenSSH


Güvenlik duvarını yeniden başlatalım.


sudo ufw disable
sudo ufw enable

### OpenVPN servisini başlatalım

sudo systemctl -f enable openvpn-server@server.service
sudo systemctl start openvpn-server@server.service

### Clientler için konfigürasyon oluşturalım

Bu adımda bir temel konfigürasyon oluşturacağız. Ardından bir script sayesinde bu konfigürasyondan ne kadar clientimiz varsa her birine ayrı client konfig dosyaları, sertifikalar ve private key oluşturabileceğiz.


Client konfigürasyonlarını depolayacağımız dizinimizi oluşturalım ve içini örnek bir konfigürasyon ile dolduralım.


mkdir -p ~/client-configs/files
cp /usr/share/doc/openvpn/examples/sample-config-files/client.conf ~/client-configs/base.conf


Konfigürasyon dosyamızı açalım.


nano ~/client-configs/base.conf


Dosyanın içerisinde **“remote”** kısmını bulalım ve OpenVPN sunucumuzun ip adresini ekleyelim. OpenVPN’in dinleme portunu da buradan değiştirebilirsiniz.


. . .
# The hostname/IP and port of the server.
# You can have multiple remote entries
# to load balance between the servers.
remote openvpn_server_ip 1194
. . .


“proto” kısmını bulalım ve server konfigürasyonunda kullandığımız protokolü girelim.


proto udp


“user nobody” kısmını bulalım ve aşağıdaki gibi değiştirelim.


user nobody
group nobody


“ca ca.crt” kısmını aratalım ve aşağıdaki gibi değiştirelim.


# SSL/TLS parms.
# See the server config file for more
# description. It's best to use
# a separate .crt/.key file pair
# for each client. A single ca
# file can be used for all clients.
;ca ca.crt
;cert client.crt
;key client.key


“tls-auth” kısmını aratalım ve aşağıdaki gibi değiştirelim.


# If a tls-auth key is used on the server
# then every client must also have the key.
;tls-auth ta.key 1


“cipher” kısmını aratalım ve aşağıdaki gibi değiştirelim.


cipher AES-256-GCM
auth SHA256


Konfigürasyonun sonnua aşağıdaki satırları ekleyelim.


key-direction 1
​
; script-security 2
; up /etc/openvpn/update-resolv-conf
; down /etc/openvpn/update-resolv-conf
​
; script-security 2
; up /etc/openvpn/update-systemd-resolved
; down /etc/openvpn/update-systemd-resolved
; down-pre
; dhcp-option DOMAIN-ROUTE .


Kaydedelim ve çıkalım.


Scriptimizi oluşturalım.


nano ~/client-configs/make_config.sh
​
#!/bin/bash
 
# First argument: Client identifier
 
KEY_DIR=~/client-configs/keys
OUTPUT_DIR=~/client-configs/files
BASE_CONFIG=~/client-configs/base.conf
 
cat ${BASE_CONFIG} \
 <(echo -e '<ca>') \
 ${KEY_DIR}/ca.crt \
 <(echo -e '</ca>\n<cert>') \
 ${KEY_DIR}/${1}.crt \
 <(echo -e '</cert>\n<key>') \
 ${KEY_DIR}/${1}.key \
 <(echo -e '</key>\n<tls-crypt>') \
 ${KEY_DIR}/ta.key \
 <(echo -e '</tls-crypt>') \
 > ${OUTPUT_DIR}/${1}.ovpn


Scriptimize çalışma izni verelim.


chmod 700 ~/client-configs/make_config.sh

### Client konfigürasyonlarını oluşturalım

Bu yazının yukarısında “client1.crt” ve “client1.key” isimli dosyalar oluşturmuştuk. Bu dosyalar için bir konfigürasyon oluşturalım.


cd ~/client-configs
./make_config.sh client1


**“~/client-configs/files”** scriptimiz client1.ovpn isimli bir konfigürasyon oluşturdu.


Bu konfigürasyonu herhangi bir cihaza attıktan sonra OpenVPN programını indirerek çalıştırabilirsiniz.


Linux için: sudo openvpn client1 gibi


Ardından bu konfigürasyonları istediğiniz cihaza göndererek o cihazdan kurduğunuz sunucunuza bağlanmasını sağlayabilirsiniz.


Okuduğunuz için teşekkürler.
