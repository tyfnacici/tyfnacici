---
title: "VPN nedir?"
description: "VPN (Sanal Özel Ağ) teknolojisinin ne olduğu, nasıl çalıştığı ve neden kullanıldığı hakkında kapsamlı rehber"
draft: false
tags: ["VPN", "Networking", "Security", "Linux"]
showToc: true
weight: 20
cover:
    image: "blog/vpn-nedir/cover.png"
---

### 🔗 [Medium'da Oku](https://medium.com/@tyfnacici/vpn-nedir)

VPN (Sanal Özel Ağ), internet gibi genel veya güvenilmeyen bir ağ üzerinden güvenli ve şifreli bir bağlantı oluşturan bir teknolojidir. Kullanıcıların gizliliği ve güvenliği korurken özel ağlara erişmelerini ve verileri genel ağlar aracılığıyla uzaktan paylaşmalarını sağlar.


VPN, kullanıcının internet bağlantısını, kullanıcı ile internet arasında aracı görevi gören uzak bir sunucu üzerinden yönlendirerek çalışır. Kullanıcı ile internet arasında iletilen veriler şifrelenir, bu nedenle yetkisiz kişiler tarafından ele geçirilemez veya erişilemez. Bu, kullanıcıların internete ve özel belgeler ve finansal bilgiler gibi hassas bilgilere dünyanın herhangi bir yerinden güvenli bir şekilde erişmelerini mümkün kılar.

### Vpn çeşitleri### 1. Uzaktan Erişim VPN

Uzaktan erişim VPN, bir kullanıcının özel bir ağa bağlanmasına, hizmetlerine ve kaynaklarına uzaktan erişmesine izin verir. Kullanıcı ile özel ağ arasındaki bağlantı internet üzerinden gerçekleşir ve bağlantı tamamen güvenlidir.


Uzaktan Erişim VPN’ler çalışanlar ve evde VPN kullananlar için oldukça uygundur.


Bir şirket çalışanı seyahat ederken, şirketinin özel ağına bağlanmak ve özel ağdaki dosyalara ve kaynaklara uzaktan erişmek için VPN kullanır.


Ev kullanıcıları veya özel VPN kullanıcıları, internetteki bölgesel kısıtlamaları aşmak ve engellenen web sitelerine erişmek için öncelikle VPN hizmetine ihtiyaç duyar. İnternet güvenliği konusunda bilinçli kullanıcılar, internet güvenliğini ve gizliliklerini geliştirmek için VPN hizmetlerini de kullanır.

### 2. Siteden Siteye VPN

Siteden Siteye VPN, Yönlendiriciden Yönlendiriciye VPN olarak da adlandırılır ve daha çok şirketlerde kullanılır.


Farklı coğrafi konumlarda ofisleri olan şirketler, bir ofis konumunun ağını başka bir ofis konumundaki ağa bağlamak için Siteden siteye VPN kullanır. Aynı şirketin birden fazla ofisi Site-to-Site VPN türü kullanılarak bağlandığında buna Intranet tabanlı VPN denir.


Şirketler, başka bir şirketin ofisine bağlanmak için Siteden siteye VPN türünü kullandıklarında, buna Extranet tabanlı VPN denir. Temel olarak, Siteden siteye VPN, coğrafi olarak uzak ofislerdeki ağlar arasında sanal bir köprü oluşturur ve bunları İnternet aracılığıyla birbirine bağlar ve ağlar arasında güvenli ve özel iletişimi sağlar.


Siteden siteye VPN yönlendiriciden yönlendiriciye iletişimi temel aldığından, bu VPN türünde bir yönlendirici VPN İstemcisi, diğer yönlendirici ise VPN Sunucusu olarak işlev görür. İki yönlendirici arasındaki iletişim, yalnızca ikisi arasında kimlik doğrulama sağlandıktan sonra başlar.i

### **3-Client-Based VPN Nedir? Nasıl Çalışır?**

Client-Based VPN, kullanıcıların gizlilik ve güvenlik koşullarına bağlı olarak bir ağa erişmesini sağlar. Güvenli bağlantıya bir yazılımın aracılığıyla erişilir, VPN kullanıcı adı ve parolaya ihtiyaç duyulur. Güvenli olarak veri akışı için cihaz ve uzak ağ arasında şifreli bağlantı bu şekilde oluşturulur. Client-Based VPN, özellikle güvenli olmayan genel WLAN’lara erişirken kullanışlıdır ve firmalar için çalışanların şirket kaynaklarına evrensel erişimidir.

### VPN güvenlik protokolleri türleri- İnternet Protokolü Güvenliği veya IPSec: İnternet Protokolü Güvenliği veya IPSec, bir IP ağı üzerinden İnternet iletişiminin güvenliğini sağlamak için kullanılır. IPSec, oturumun kimliğini doğrulayarak İnternet Protokolü iletişimini korur ve bağlantı sırasında her veri paketini şifreler.- IPSec, iki farklı ağ arasında veri aktarımını korumak için iki modda çalışır: Taşıma modu ve Tünel modu. Taşıma modu, veri paketindeki mesajı şifreler ve tünel modu, tüm veri paketini şifreler. IPSec, güvenlik sistemini geliştirmek için diğer güvenlik protokolleriyle de kullanılabilir.- Katman 2 Tünel Protokolü (L2TP): L2TP veya Katman 2 Tünel Protokolü, oldukça güvenli bir VPN bağlantısı oluşturmak için genellikle IPSec gibi başka bir VPN güvenlik protokolüyle birleştirilen bir tünel protokolüdür. L2TP, iki L2TP bağlantı noktası arasında bir tünel oluşturur ve IPSec protokolü verileri şifreler ve tünel arasındaki güvenli iletişimi yönetir.- Noktadan Noktaya Tünel Protokolü (PPTP): PPTP veya Noktadan Noktaya Tünel Protokolü bir tünel oluşturur ve veri paketini kapsüller. Bağlantı arasındaki verileri şifrelemek için Noktadan Noktaya Protokolü (PPP) kullanır. PPTP, en yaygın kullanılan VPN protokollerinden biridir ve Windows 95’ten beri kullanılmaktadır. Windows dışında, PPTP, Mac ve Linux’ta da desteklenmektedir.- Güvenli Yuva Katmanı (SSL) ve Aktarım Katmanı Güvenliği (TLS): SSL (Güvenli Yuva Katmanı) ve TLS (Taşıma Katmanı Güvenliği), web tarayıcısının istemci gibi davrandığı ve kullanıcı erişiminin tüm ağ yerine belirli uygulamalarla sınırlandırıldığı bir VPN bağlantısı oluşturur. SSL ve TLS protokolü en çok çevrimiçi alışveriş web siteleri ve servis sağlayıcılar tarafından kullanılır. Web tarayıcıları SSL ve TLS ile entegre olduğundan, web tarayıcıları kolaylıkla ve kullanıcının neredeyse hiçbir işlem yapmasına gerek kalmadan SSL’ye geçer. SSL bağlantılarında, HTTP yerine URL’nin başında https bulunur.- OpenVPN: OpenVPN, Noktadan Noktaya ve Siteden Siteye bağlantılar oluşturmak için yararlı olan açık kaynaklı bir VPN’dir. SSL ve TLS protokolüne dayalı özel bir güvenlik protokolü kullanır. En iyi VPN’lerin olmazsa, olmaz protokolleri arasında yer almakta.- Güvenli Kabuk (SSH): Secure Shell veya SSH, veri aktarımının gerçekleştiği VPN tünelini oluşturur ve ayrıca tünelin şifrelenmesini sağlar. SSH bağlantıları bir SSH istemcisi tarafından oluşturulur ve veriler şifrelenmiş tünel aracılığıyla yerel bir bağlantı noktasından uzak sunucuya aktarılır.### Vpn ve Vpn kullanmadan veri aktarımının karşılaştırılması<img src="https://cdn-images-1.medium.com/max/1024/1*gH-eexqpzHFE_wRiBKQspA.png" alt="Image" />
