---
title: "MySQL cluster kurulumu ve dışarıdan Slave ekleme"
description: "MySQL cluster kurulumu ve harici bir sunucudan Slave ekleme rehberi"
draft: false
tags: ["MySQL", "Database", "Replication"]
showToc: true
weight: 50
cover:
    image: "blog/mysql-cluster-slave/cover.png"
---

### 🔗 [Medium'da Oku](https://medium.com/@tyfnacici/mysql-cluster-slave)

<img src="https://cdn-images-1.medium.com/max/1024/1*EpWj-CORo0-P_1kaaLb5aQ.png" alt="Image" />

Bu yazımda size bir MySQL clusterine GTID replikasyon yöntemini kullanarak bir slave eklemeyi göstereceğim. Bunun sayesinde Clusterinize slave makineyi dahil etmeden dışarıdan veritabanınızın yedeğini alabileceksiniz. MySQL serveri olarak Percona Server, Clusterdeki makineler için ise Percona XtraDB Cluster kullanacağım. Makinelerimin tümü ise Ubuntu 22.04LTS.

### MySQL nedir, ne işe yarar?

MySQL, veritabanı yönetim sistemi (DBMS) olarak kullanılan bir açık kaynak kodlu yazılımdır. MySQL, SQL (Structured Query Language) dillerini kullanarak veritabanı oluşturma, sorgulama, güncelleme ve silme gibi işlemleri yapmanıza olanak tanır.

### Nerede kullanılır?

MySQL, web tabanlı uygulamalar, e-ticaret siteleri, bloglar ve forumlar gibi internet tabanlı projeler için yaygın olarak kullanılır. Ayrıca, büyük veri depolama ve analitik işlemler için de kullanılabilir. Örneğin, birçok web sitesi ve uygulama, ziyaretçi verilerini MySQL veritabanında saklar.

### MySQL Cluster nedir?

MySQL Cluster, MySQL veritabanı yönetim sistemi üzerine inşa edilmiş, ölçeklenebilir ve yüksek performanslı bir veritabanı yönetim sistemidir. Bu sistem, verilerin birden fazla sunucu arasında dağıtılmasını ve senkronize edilmesini sağlar. Bu sayede, veritabanı işlemleri esnasında oluşabilecek gecikmeler ve kesintiler minimize edilir ve veri kaybı riski azaltılır.


MySQL Cluster, sınırsız veri büyüklüğüne ve yüksek kullanıcı sayısına karşı ölçeklenebilir. Bu sayede, web tabanlı uygulamalar, e-ticaret siteleri, mobil uygulamalar, IoT projeleri gibi internet tabanlı projeler için büyük veri yükünü taşıyabilir. Ayrıca, yüksek kullanıcı sayısına ve veri trafiğine karşı dayanıklıdır.

### Veritabanı replikasyonu nedir, ne işe yarar?

Veritabanı replikasyonu, bir veritabanının içeriğinin birden fazla konumda kopyalanmasını ve senkronize edilmesini sağlamak için kullanılan bir yöntemdir. Bu sayede, veritabanı işlemleri esnasında oluşabilecek gecikmeler ve kesintiler minimize edilir ve veri kaybı riski azaltılır. Replikasyon ayrıca yedekleme ve geri yükleme işlemleri için de kullanılabilir.


Veritabanı replikasyonu, çeşitli amaçlar için kullanılabilir. Örneğin, veritabanının yedeklenmesi ve geri yüklenmesi için kullanılabilir. Bu sayede, veritabanı işlemleri esnasında oluşabilecek sorunlar veya kazalar sonucunda verilerin kaybı önlenebilir. Ayrıca, veritabanının performansını arttırmak için kullanılabilir. Örneğin, veritabanının yükünü azaltmak için, sorguların çoğunlukla yedek sunucular üzerinde gerçekleştirilmesi sağlanabilir.

### Master-Slave Replikasyon

Bu yöntemde, veritabanı işlemleri (sorgulama, güncelleme) yalnızca Master sunucuda gerçekleştirilir. Master sunucu tarafından gerçekleştirilen işlemler, Slave sunucular tarafından otomatik olarak tekrarlanır. Böylece tüm sunucular aynı anda senkronize edilir.

### Multi-Master Replikasyon

Bu yöntemde, birden fazla master sunucu bulunur. Her master sunucu, diğer master sunuculara veri yansıtır ve herhangi bir master sunucuda gerçekleşen işlemler diğer master sunucular tarafından algılanır ve uyarlanır. Bu yöntem, Master-Master Replikasyon yöntemine göre daha yüksek ölçeklenebilirlik ve esneklik sağlar.

### Percona nedir?

Percona, MySQL veritabanı yönetim sistemi için açık kaynak kodlu bir alternatiftir. Percona, MySQL’in performansını ve ölçeklenebilirliğini arttırmak için özel olarak optimize edilmiş bir sürümünü sunar.


Percona, MySQL’in temel özelliklerini korurken, aynı zamanda ek özellikler ve araçlar sunar. Bu yazımda da Percona’nın Percona Server ve Percona XtraDB Cluster yazılımlarını kullanacağız.

### Yazımızda Master Slave replikasyonu için GTID replikasyonunu kullanacağız. Peki neden GTID replikasyonunu kullanıyoruz?

Geleneksel replikasyonda, master sunucunun slave sunuculara gönderdiği binary loglar içerisindeki işlemler, slave sunucular tarafından master sunucuda yapılan aynı sıra ile tekrar gerçekleştirilir. Ancak, bu yöntem birden fazla replikasyon kanalı ile uğraşırken veya replikasyon hatalarından kurtulmaya çalışırken bize sorunlar çıkartabilmektedir.


GTID replikasyonunda, master sunucu her işlem için benzersiz bir GTID atar ve bunu slave sunuculara binary log ile birlikte gönderir. Slave sunucular daha sonra işlemi yürütür ve kendi GTID durumlarını ana sunucudaki ile eşleştirir. Bu, replikasyon hatalarının kolayca izlenip düzeltilmesini ve mevcut master sunucunun bozulması durumunda yeni bir master sunucuya geçmeyi kolaylaştırır.


GTID replikasyonu, replikasyon kurulumunuza yeni bir slave sunucu eklemek istediğinizde size kolaylıklar sunar. Bağladığınız yeni slave son GTID ile başlar, geleneksel replikasyondaki gibi binlog dosyası ve pozisyonunu belirtmenize gerek kalmaz.

### Gereksinimler- Hepsi aynı ağda bulunan 3 Adet Ubuntu 22.04LTS kurulu makine- İnternet bağlantısı### Clusterimizdeki makinelerin kurulumlarını yapalım### Percona XtraDB Cluster kurulumlarını makinelerimize yapalım

Clusterde olacak makinelerimizin **tümünün** terminaline aşağıdaki kodları sırasıyla girerek gerekli indirmeleri yapalım.


sudo apt update
sudo apt install -y wget gnupg2 lsb-release curl
wget https://repo.percona.com/apt/percona-release_latest.generic_all.deb
sudo dpkg -i percona-release_latest.generic_all.deb
sudo apt update
sudo percona-release setup pxc80
sudo apt install -y percona-xtradb-cluster

### Kurulumunu yaptığımız makineleri konfigüre edelim

Gerekli indirmeleri yaptıktan sonra tüm makinelerimizde MySQL sunucularını konfigürasyon yapacağımız için durdurmamız gerekiyor.


sudo service mysql stop


Konfigürasyon işlemi için **“/etc/mysql/mysql.conf.d/mysqld.cnf”** dosyasını açıyoruz.


sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf


Burada **“wsrep_cluster_address”** kısmına ağımızda bulunacak bilgisayarların ip adreslerini sırasıyla girelim. Ardından bu adımı clusterde bulunacak tüm cihazlar için tekrarlıyalım. Ben iki adet makine ile clusterimi kuracağım.


wsrep_cluster_address=gcomm://192.168.70.61,192.168.70.62,192.168.70.63


Buraya kadar yapılan işlemlerimizi clusterde bulunacak tüm makinelerimiz için yapıyoruz.


Birinci nodemizi aşağıdaki bilgilere göre konfigüre edelim.


**“wsrep_node_name”: Clusterdeki her makine için farklı olmalıdır.**


**“wsrep_node_address”: O makinenin ip adresi**


wsrep_node_name=pxc1
wsrep_node_address=192.168.70.61
pxc_strict_mode=ENFORCING


Diğer nodelerimizi de buna benzer şekilde fakat her [wsrep_node_name](https://docs.percona.com/percona-xtradb-cluster/8.0/wsrep-system-index.html#wsrep_node_name) and [wsrep_node_address](https://docs.percona.com/percona-xtradb-cluster/8.0/wsrep-system-index.html#wsrep_node_address)kısmı kendine has olacak şekilde düzenliyoruz.


Ben kurulumda ssl kullanmayacağım için bunu kapatacağım. Bunu yapmak için tüm makinelerimizde konfigürsayon dosyasına şu satırı ekleyelim.


pxc_encrypt_cluster_traffic = OFF


SSL sertifikası ile kurulum yapacaksanız dökümantasyonun [bu](https://docs.percona.com/percona-xtradb-cluster/8.0/configure.html#configure) ve [bu kısımlarına](https://docs.percona.com/percona-xtradb-cluster/8.0/security/encrypt-traffic.html#encrypt-replication-traffic) bakabilirsiniz.

### Birinci nodemizi bootstrap moduna alalım

Bootstrap, bilinen herhangi bir cluster adresi olmadan ilk nodenin başlatılması anlamına gelir: wsrep_cluster_address değişkeni boşsa, Percona XtraDB Kümesi bunun ilk node olduğunu varsayar ve clusteri başlatır.


Bootstrap modunda başlatmak için aşağıdaki komutu ilk nodemizde çalıştırıyoruz.


systemctl start mysql@bootstrap.service


Bu komutu kullanarak clusteri başlattığınızda, konfigürasyon dosyasında ayarladığımız şekilde çalışmaktansa “**wsrep_cluster_address=gcomm://**” şeklinde başlar ve bootstrap modunda çalışır. Bu, nodeye clusteri “**wsrep_cluster_conf_id**” değişkeni 1'e ayarlı olarak başlatmasını söyler. Yani clusterin ilk nodesini belirlemiş oluruz.


Clustere nodelerimizi ekledikten sonra, bootstrap modunu kapatıp bu nodeyi normal şekilde yeniden başlatabilirsiniz.


Ardından ilk nodemizde MySQL konsolunu açıp clusterin başlayıp başlamadığını kontrol edelim.


mysql -p
show status like 'wsrep%';


Şu şekilde bir çıktı vermesi gerek.


+----------------------------+--------------------------------------+
| Variable_name | Value |
+----------------------------+--------------------------------------+
| wsrep_local_state_uuid | c2883338-834d-11e2-0800-03c9c68e41ec |
| ... | ... |
| wsrep_local_state | 4 |
| wsrep_local_state_comment | Synced |
| ... | ... |
| wsrep_cluster_size | 1 |
| wsrep_cluster_status | Primary |
| wsrep_connected | ON |
| ... | ... |
| wsrep_ready | ON |
+----------------------------+--------------------------------------+
40 rows in set (0.01 sec)

### İkinci nodemizi clustere ekleyelim

İkinci nodemizde MySQL servisini çalıştıralım.


systemctl start mysql


Ardından bu nodemizde MySQL konsolunu açarak clustere bağlanıp bağlanmadığını kontrol edelim.


mysql -p
show status like 'wsrep%';


**wsrep_cluster_size**’nin 2 ye çıkması gerek.


+----------------------------------+--------------------------------------------------+
| Variable_name | Value |
+----------------------------------+--------------------------------------------------+
| wsrep_local_state_uuid | a08247c1-5807-11ea-b285-e3a50c8efb41 |
| ... | ... |
| wsrep_local_state | 4 |
| wsrep_local_state_comment | Synced |
| ... | |
| wsrep_cluster_size | 2 |
| wsrep_cluster_status | Primary |
| wsrep_connected | ON |
| ... | ... |
| wsrep_provider_capabilities | :MULTI_MASTER:CERTIFICATION: ... |
| wsrep_provider_name | Galera |
| wsrep_provider_vendor | Codership Oy <info@codership.com> |
| wsrep_provider_version | 4.3(r752664d) |
| wsrep_ready | ON |
| ... | ... | 
+----------------------------------+--------------------------------------------------+
75 rows in set (0.00 sec)


Ekleyeceğiniz diğer nodeleri de ikinci nodemizde yaptığımız işlemleri tekrarlayarak yapabilirsiniz.

### Bootstrap modunu kapatalım

Tüm nodeleri clustere bağladıktan sonra ilk nodemizde açtığımız Bootstrap modunu kapatalım.


systemctl stop mysql@bootstrap.service


Ardından MySQL servisimizi normal bir şekilde başlatalım.


systemctl start mysql


Artık clusterimizdeki makineler Multi-Master konfigürasyonunda çalışmaya başladılar.

### Slave makinemizi Clustere bağlayalım### Makinemize Percona Server kurulumunu yapalım

Aşağıdaki komutları sırasıyla makinemizin terminaline girerek gereki kurulumları yapalım.


sudo apt update
sudo apt install curl
curl -O https://repo.percona.com/apt/percona-release_latest.generic_all.deb
sudo apt install gnupg2 lsb-release ./percona-release_latest.generic_all.deb
sudo apt update
sudo percona-release setup ps80
sudo apt install percona-server-server

### Master sunucumuzun konfigürasyonlarını yapalım

Clusterde hangi makinenin slave sunucumuzun masteri olmasını istiyorsak ona geliyoruz. Master olacak makinemizin 3306 portunu replikasyon için açmamız gerekiyor.


Aşağıdaki kodu Master olacak makinemizin terminaline girelim.


sudo ufw allow from replica_server_ip to any port 3306


Buraya **“*replica_server_ip*”** kısmına slave olacak sunucumuzun ip adresini girmemiz gerekli.


Ardından Master sunucumuzda **“/etc/mysql/mysql.conf.d/mysqld.cnf”** dosyasını seçtiğimiz text editörümüz ile açıyoruz ve aşağıdaki kodları bu dosyaya ekliyoruz.


nano /etc/mysql/mysql.conf.d/mysqld.cnf


server-id = 1
log_bin = /var/log/mysql/mysql-bin.log
binlog_do_db = db 
gtid_mode = ON
enforce-gtid-consistency = ON


**“server-id”** = Her sunucunun kendisine özgü olması gereken sunucu idsi


**“binlog_do_db”** = Replikasyonun olmasını istediğiniz veritabanı. Eğer birden fazla veritabanını replike edecekseniz aşağıdaki gibi yapabilirsiniz.


binlog_do_db = db1
binlog_do_db = db2
binlog_do_db = db3
...
...


**“gtid_mode = ON” ve “enforce-gtid-consistency = ON”** GTID replikasyonu yapabilmemizi sağlar.


GTID hakkında daha detaylı bilgi için [buraya](https://dev.mysql.com/doc/refman/8.0/en/replication-gtids-concepts.html) tıklayabilirsiniz.


Bu dosyayı yukarıdaki gibi düzenledikten sonra mysql servisimizi yeniden başlatıyoruz.


sudo systemctl restart mysql

### Replikasyon için bir kullanıcı oluşturalım

Master sunucumuzda MySQL konsolunu açalım ve aşağıdaki komutu isteğimize göre düzenleyelim ve girelim.


CREATE USER 'replica_user'@'replica_server_ip' IDENTIFIED WITH mysql_native_password BY 'password';


**“replica_user”** = replikasyon yapacak kullanıcı


**“replica_server_ip”** = slave sunucumuzun ip adresi


**“password”** = replikasyon kullanıcının şifresi


Ardından bu replikasyon yapacak kullanıcıya yetki vermemiz gerekiyor.


GRANT REPLICATION SLAVE ON *.* TO 'replica_user'@'replica_server_ip';


Bunun ardından şu komutu çalıştıralım.


FLUSH PRIVILEGES;

### Slave sunucumuzun konfigurasyonlarını yapalım.

Slave sunucumuzda aşağıdaki komutu çalıştırarak mysqld.cnf dosyasını açalım.


nano /etc/mysql/mysql.conf.d/mysqld.cnf


server-id = 2
log_bin = /var/log/mysql/mysql-bin.log
binlog_do_db = db
gtid_mode=ON
enforce-gtid-consistency=ON
log-replica-updates=ON
skip-replica-start=ON
relay-log = /var/log/mysql/mysql-relay-bin.log


**“server-id”** = Her sunucunun kendisine özgü olması gereken sunucu idsi


**“binlog_do_db”** = Replikasyonun olmasını istediğiniz veritabanı. Eğer birden fazla veritabanını replike edecekseniz aşağıdaki gibi yapabilirsiniz.


binlog_do_db = db1
binlog_do_db = db2
binlog_do_db = db3
...
...


Son olarak MySQL servisimizi yeniden başlatalım.


sudo systemctl restart mysql

### Replikasyonu başlatalım

Slave sunucumuzda MySQL konsolumuzu açalım ve aşağıdaki komutları girelim.


CHANGE REPLICATION SOURCE TO
SOURCE_HOST='source_server_ip',
SOURCE_USER='replica_user',
SOURCE_PASSWORD='password',
SOURCE_AUTO_POSITION=1;


Burada SOURCE_LOG_FILE ve SOURCE_LOG_POS kısmını size unutmayın dediğim tablodaki değerler ile değiştirmeniz gerek.


Artık replikasyonu başlatabiliriz.


START SLAVE;


Replikasyon işlemimizin detaylarına bakalım.


SHOW REPLICA STATUS\G;


Yukarıdaki komutu girdiğimizde bize bunun gibi bir çıktı verecektir.


*************************** 1. row ***************************
 Replica_IO_State: Waiting for source to send event
 Source_Host: 192.168.122.38
 Source_User: replication_user
 Source_Port: 3306
 Connect_Retry: 60
 Source_Log_File: mysql-bin.000001
 Read_Source_Log_Pos: 1109
 Relay_Log_File: ubuntu3-relay-bin.000002
 Relay_Log_Pos: 1325
 Relay_Source_Log_File: mysql-bin.000001
 Replica_IO_Running: Yes
 Replica_SQL_Running: Yes
 Replicate_Do_DB: 
 Replicate_Ignore_DB: 
 Replicate_Do_Table: 
 Replicate_Ignore_Table: 
 Replicate_Wild_Do_Table: 
 Replicate_Wild_Ignore_Table: 
 Last_Errno: 0
 Last_Error: 
 Skip_Counter: 0
 Exec_Source_Log_Pos: 1109
 Relay_Log_Space: 1537
 Until_Condition: None
 Until_Log_File: 
 Until_Log_Pos: 0
 Source_SSL_Allowed: No
 Source_SSL_CA_File: 
 Source_SSL_CA_Path: 
 Source_SSL_Cert: 
 Source_SSL_Cipher: 
 Source_SSL_Key: 
 Seconds_Behind_Source: 0
Source_SSL_Verify_Server_Cert: No
 Last_IO_Errno: 0
 Last_IO_Error: 
 Last_SQL_Errno: 0
 Last_SQL_Error: 
 Replicate_Ignore_Server_Ids: 
 Source_Server_Id: 1
 Source_UUID: 732c6aba-9bbc-11ed-a9a9-525400644621
 Source_Info_File: mysql.slave_master_info
 SQL_Delay: 0
 SQL_Remaining_Delay: NULL
 Replica_SQL_Running_State: Replica has read all relay log; waiting for more updates
 Source_Retry_Count: 86400
 Source_Bind: 
 Last_IO_Error_Timestamp: 
 Last_SQL_Error_Timestamp: 
 Source_SSL_Crl: 
 Source_SSL_Crlpath: 
 Retrieved_Gtid_Set: 09df97bf-9bbb-11ed-9703-6e6b4394799a:1-4
 Executed_Gtid_Set: 09df97bf-9bbb-11ed-9703-6e6b4394799a:1-4
 Auto_Position: 1
 Replicate_Rewrite_DB: 
 Channel_Name: 
 Source_TLS_Version: 
 Source_public_key_path: 
 Get_Source_public_key: 0
 Network_Namespace: 
1 row in set (0.00 sec)
​
ERROR: 
No query specified


Master sunucumuzda aşağıdaki kodu çalıştırdığımızda bize “Retrieved_Gtid_Set: 09df97bf-9bbb-11ed-9703–6e6b4394799a:1–4” kısmındaki gtid kodu ile aşağıda verecek gtid kodu aynı oluyorsa makineler eşleşti demektir.


show master status;
+------------------+----------+--------------+------------------+------------------------------------------+
| File | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
+------------------+----------+--------------+------------------+------------------------------------------+
| mysql-bin.000001 | 1593 | | | 09df97bf-9bbb-11ed-9703-6e6b4394799a:1-6 |
+------------------+----------+--------------+------------------+------------------------------------------+

### Replikasyonumuza gecikme ekleyelim

Slave sunucumuzda MySQL konsoluna girerek replikasyonu durduralım.


stop slave;


Ardından ise gecikmeyi belirleyelim. Ben burada hemen deneyebilmek için 30 yazacağım. Bu yazdığım değer saniye cinsinden olduğu için yarım dakika gecikmeli şekilde veritabanı replikasyonu olacaktır. Bu değeri isteğiniz şekilde ayarlayabilirsiniz.


CHANGE MASTER TO MASTER_DELAY = 30;


Replikasyonu tekrar başlatalım.


START SLAVE;


Gecikmeyi kontrol etmek için aşağıdaki kodu MySQL konsoluna girerek çıkan ekranda “Master_Delay” kısmına bakabilirsiniz.


SHOW SLAVE STATUS \G


Gecikmeyi sıfırlamak için ise MySQL konsoluna


reset slave;


Yazmanız yeterlidir.


Daha detaylı bilgi için [buraya](https://dev.mysql.com/doc/refman/8.0/en/replication-delayed.html) tıklayabilirsiniz.


Okuduğunuz için teşekkürler.
