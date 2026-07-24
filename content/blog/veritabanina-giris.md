---
title: "Veritabanlarına giriş"
description: "Veritabanı temel kavramları, SQL ve NoSQL veritabanlarına giriş rehberi"
draft: false
tags: ["Database", "SQL", "Veritabanı"]
showToc: true
weight: 80
cover:
    image: "blog/veritabanina-giris/cover.png"
---

### 🔗 [Medium'da Oku](https://medium.com/@tyfnacici/veritabanina-giris)

<img src="https://cdn-images-1.medium.com/max/1024/1*Hy6TraZYhhj1ppjUqt_TiA.png" alt="Image" />### Veritabanı nedir?

Veritabanı, yapılandırılmış verilerin depolanması, yönetilmesi ve erişimine izin veren bir yazılım sistemidir. Veritabanları, bir veya daha fazla kullanıcı veya uygulama tarafından erişilebilen bir dizi ilişkisel veya hiyerarşik veri öğesini içerebilir. Veritabanları genellikle bir bilgisayar sunucusunda barındırılır ve bir veritabanı yönetim sistemi (DBMS) tarafından yönetilir.

### SQL nedir?

SQL (Structured Query Language), ilişkisel veritabanı yönetim sistemlerinde (RDBMS) veri manipülasyonu için kullanılan bir programlama dili ve standarttır. SQL, özellikle büyük veri setleri içindeki verileri sorgulamak, değiştirmek ve yönetmek için kullanılır.

### İlişkisel veritabanı nedir?

İlişkisel Veritabanı: İlişkisel veritabanı, verilerin birbirleriyle ilişkili olduğu bir veri modelidir. Bu tür veritabanları, tabloları kullanarak verileri depolar ve birbirleriyle ilişkilendirir. İlişkisel veritabanları, Oracle, MySQL ve Microsoft SQL Server gibi birçok farklı veritabanı yönetim sistemi tarafından desteklenir.


Bir veritabanı ilişkisel veritabanı olabilmek için aşağıdaki özellikleri sağlamalıdır:

- **Atomisite** tam bir veritabanı işlemini oluşturan tüm unsurları tanımlar.- **Tutarlılık** veri noktalarını bir işlemden sonra doğru durumda tutmaya ilişkin kuralları tanımlar.- **İzolasyon** karışıklığı önlemek için, kalıcı hâle gelene kadar, bir işlemin etkisini diğer işlemlerden görünmez kılar.- **Dayanıklılık** işlem gerçekleştiğinde veri değişikliklerinin kalıcı olmasını sağlar.### Varlık-İlişki modeli nedir?

Varlık-İlişki modeli, veritabanı tasarımı için örnek bir model/diyagram oluşturmamızı sağlar.

<img src="https://cdn-images-1.medium.com/max/578/1*gDY2zQghvXoWNePrPMIMEw.png" alt="Image" />

**1-Varlıklar (Entity):** Bir obje, sınıf, kişi veya yer olabilir. Varlık-İlişki modelinde dikdörtgen olarak gösterilir.

<img src="https://cdn-images-1.medium.com/max/566/1*YP8sgAeWealtgWh-_H8qrQ.png" alt="Image" />

**1.1-Zayıf varlık (Weak Entity): **Başka bir varlığa gereksinim duyan varlıklara zayıf varlık denir. Kendi başına bir özelliğe sahip değildir. Çift dikdörtgen olarak gösterilir.

<img src="https://cdn-images-1.medium.com/max/405/1*W3z0NzL9-fR_sF0bNFuDdA.png" alt="Image" />

**2-Özellikler (Attribute): **Bir varlığın niteliğini tanımlamak için kullanılır.

> Örn: id, yaş, tel no, isim vs. olabilir. Modelde daire ile gösterilir.<img src="https://cdn-images-1.medium.com/max/376/1*S9ICjBOwTBzZAEpu2fQFTA.png" alt="Image" />

**A-Anahtar Özellik:** Bir varlığın ana özelliklerini tanımlamak için kullanılır. Bir anahtarı temsil eder. Metnin altı çizili bir daire ile temsil edilir.

<img src="https://cdn-images-1.medium.com/max/376/1*JHYnEQsF9uWkWYS6XvoihQ.png" alt="Image" />

**B-Bileşik Özellik:** Bir çok özelliğin birleşmesi ile oluşur. Kendi dairesine bağlı olan daireler ile gösterilir.

<img src="https://cdn-images-1.medium.com/max/445/1*zLkYcME09ODgam9BLQVXiw.png" alt="Image" />

**C-Çokdeğerli özellik:** Birden fazla değer alabilen özelliğe denir. Çift oval ile gösterilir. Örn: Bir insanın birden fazla telefon numarası olabilir.

<img src="https://cdn-images-1.medium.com/max/225/1*C3Ri26jrejoVtQsgEKFbCw.png" alt="Image" />

**D-Türetilmiş Özellik: **Başka bir öznitelikten türetilebilen bir öznitelik, türetilmiş bir öznitelik olarak bilinir. Kesikli bir elips ile temsil edilebilir.

<img src="https://cdn-images-1.medium.com/max/355/1*PqXv2sVm6KTXdQllcwolCA.png" alt="Image" />

**3-İlişki: **Varlıklar arasındaki ilişkiyi tanımlamak için bir ilişki kullanılır. İlişkiyi temsil etmek için elmas veya eşkenar dörtgen kullanılır.

<img src="https://cdn-images-1.medium.com/max/567/1*zIku9POAGouQUKFffRUBnA.png" alt="Image" />

İlişki çeşitleri kendi aralarında aşağıdaki gibi ayrılmaktadır:


**A-Bire-Bir ilişki:** Bir varlığın yalnızca bir örneği ilişkiyle ilişkilendirildiğinde, bire bir ilişki olarak bilinir.

> Örn: Bir kadın bir erkekle evlenebilir veya bir erkek bir kadınla evlenebilir.<img src="https://cdn-images-1.medium.com/max/567/1*JilJ5g_VCAWJ6W6ftm976g.png" alt="Image" />

**B-Bire çok ilişki:** Bir varlığın yalnızca bir örneği ve Diğer bir varlığın birden fazla örneği ilişkiyle ilişkilendirildiğinde, bu bire çok ilişkisi olarak bilinir.

<img src="https://cdn-images-1.medium.com/max/1024/1*jexpnicOGdyloDS5LlrVdA.jpeg" alt="Image" />

**3-Çoka bir ilişki:** Çok varlığın ve yalnızca bir varlığın ilişkilendirilmesine bire bir ilişki denir.

<img src="https://cdn-images-1.medium.com/max/513/1*_j3xkVGaeRa66ojLWwMTCg.png" alt="Image" />

**4-Çoka çok ilişki:** Soldaki varlığın birden fazla örneği ve sağdaki bir varlığın birden fazla örneği ilişkiyle ilişkilendirildiğinde, buna çoka çok ilişkisi denir.

<img src="https://cdn-images-1.medium.com/max/468/1*wjiOrt0dUeyM4irbH5riYw.jpeg" alt="Image" />### Veritabanı normalizasyonu nedir?

Normalleştirme, veri tabanı tasarımında kullanılan bir süreçtir ve bir veritabanındaki verileri organize etmek için kullanılır. Normalleştirme, bir veritabanının tasarımını optimize etmeye ve verilerin tekrarlamasını en aza indirmeye çalışır. Bu, veritabanının daha iyi performans göstermesini sağlar ve verilerin bütünlüğünü korur. Normalleştirme süreci, bir veritabanındaki verilerin yapısal düzenlenmesine odaklanır ve verilerin daha iyi bir şekilde yönetilmesine yardımcı olur.

### ANSI standardı nedir?

ANSI SQL, Amerikan Ulusal Standartlar Enstitüsü (ANSI) tarafından geliştirilen SQL (Structured Query Language) standardının bir versiyonudur.


ANSI SQL, farklı DBMS’ler arasında uyumluluğu sağlamak ve birçok farklı veritabanı yönetim sistemi arasında taşınabilirliği kolaylaştırmak amacıyla geliştirilmiştir. ANSI SQL standardı, SQL sorgularının yapısı, syntax’ı, fonksiyonları ve diğer özellikleri açısından belirlenmiş bir dizi kural ve yönerge içermektedir.


Günümüzde kullanılan güncel ANSI SQL standardı ise SQL:2016’dır.

### WAMP nedir?

WAMP bir teknoloji yığınıdır. WAMP sayesinde kendi bilgisayarınızı bir web sunucusuna çevirebilirsiniz.

- “**W**” Windows işletim sistemi içindir. Bu teknoloji yığınının Linux için olanı da benzer şekilde LAMP olarak adlandırılır.- “**A**”Apache web sunucusu yazılımıdır.- “**M**” MySQL içindir. MySQL sayesinde ilişkisel veritabanlarınızı kontrol edebilirsiniz.- “**P**” PHP yazılım diline karşılık gelir.

MySQL ve WAMP yazılımları tamamen açık kaynaklı olduğu için (Windows dışında) bu programlar ile istediğinizi yapabilirsiniz.


MySQL’in şu andaki sahibi Oracle şirketidir ve şu andaki en güncel stabil sürümü ise 8.0.32’dir.


Kaynakça:


[https://www.javatpoint.com/dbms-er-model-concept](https://www.javatpoint.com/dbms-er-model-concept)


[https://web3ogren.com/](https://web3ogren.com/)


[https://blog.ansi.org/2018/10/sql-standard-iso-iec-9075-2016-ansi-x3-135/](https://blog.ansi.org/2018/10/sql-standard-iso-iec-9075-2016-ansi-x3-135/)


[https://www.hostinger.com/tutorials/what-is-wamp](https://www.hostinger.com/tutorials/what-is-wamp)
