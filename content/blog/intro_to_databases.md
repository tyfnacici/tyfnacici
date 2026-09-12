---
title: "Introduction to Databases"
description: "Database basic concepts, guide to SQL and NoSQL databases"
draft: false
tags: ["Database", "SQL", "Database"]
showToc: true
weight: 80
cover:
    image: "blog/veritabanina-giris/cover.png"
---

### 🔗 [Read on Medium](https://medium.com/@tyfnacici/veritabanina-girisy)

<img src="https://cdn-images-1.medium.com/max/1024/1*Hy6TraZYhhj1ppjUqt_TiA.png" alt="Image" />

### What is a Database?

A database is a software system that allows for the storage, management, and access of structured data. Databases can contain a set of relational or hierarchical data elements that can be accessed by one or more users or applications. Databases are typically hosted on a computer server and managed by a Database Management System (DBMS).

### What is SQL?

SQL (Structured Query Language) is a programming language and standard used for data manipulation in Relational Database Management Systems (RDBMS). SQL is specifically used to query, modify, and manage data within large datasets.

### What is a Relational Database?

A Relational Database is a data model where data is stored in relations to each other. This type of database uses tables to store and relate data. Relational databases are supported by many different database management systems, such as Oracle, MySQL, and Microsoft SQL Server.


For a database to be a relational database, it must provide the following properties:

- **Atomicity** defines all the elements that constitute a complete database transaction.
- **Consistency** defines the rules for keeping data points in a correct state after a transaction.
- **Isolation** makes the effects of a transaction invisible to other transactions until it is made permanent, to prevent confusion.
- **Durability** ensures that data changes are permanent when a transaction is completed.

### What is an Entity-Relationship model?

The Entity-Relationship model allows us to create an exemplary model/diagram for database design.

<img src="https://cdn-images-1.medium.com/max/578/1*gDY2zQghvXoWNePrPMIMEw.png" alt="Image" />

**1-Entities:** An object, a class, a person, or a place can be an entity. In the Entity-Relationship model, it is represented by a rectangle.

<img src="https://cdn-images-1.medium.com/max/566/1*YP8sgAeWealtgWh-_H8qrQ.png" alt="Image" />

**1.1-Weak Entity: **Entities that require another entity are called weak entities. They do not have their own properties. They are represented by a double rectangle.

<img src="https://cdn-images-1.medium.com/max/405/1*W3z0NzL9-fR_sF0bNFuDdA.png" alt="Image" />

**2-Attributes: **Used to define a property of an entity.

> e.g.: id, age, phone no, name, etc. It is represented by a circle in the model.

<img src="https://cdn-images-1.medium.com/max/376/1*S9ICjBOwTBzZAEpu2fQFTA.png" alt="Image" />

**A-Key Attribute:** Used to define the main properties of an entity. It represents a key. It is represented by an underlined circle.

<img src="https://cdn-images-1.medium.com/max/376/1*JHYnEQsF9uWkWYS6XvoihQ.png" alt="Image" />

**B-Composite Attribute:** It consists of the combination of several attributes. It is represented by circles connected to a main circle.

<img src="https://cdn-images-1.medium.com/max/445/1*zLkYcME09ODgam9BLQVXiw.png" alt="Image" />

**C-Multi-valued Attribute:** It refers to an attribute that can take multiple values. It is represented by a double oval. e.g., A person can have multiple phone numbers.

<img src="https://cdn-images-1.medium.com/max/225/1*C3Ri26jrejoVtQsgEKFbCw.png" alt="Image" />

**D-Derived Attribute: **An attribute that can be derived from another attribute is known as a derived attribute. It can be represented by a dashed ellipse.

<img src="https://cdn-images-1.medium.com/max/355/1*PqXv2sVm6KTXdQllcwolCA.png" alt="Image" />

**3-Relationship: **A relationship is used to define the relationship between entities. A diamond or a rhombus is used to represent a relationship.

<img src="https://cdn-images-1.medium.com/max/567/1*zIku9POAGouQUKFffRUBnA.png" alt="Image" />

Relationship types are classified among themselves as follows:


**A-One-to-One relationship:** A one-to-one relationship occurs when only one instance of one entity is associated with only one instance of another entity.

> e.g.: A woman can marry one man or one man can marry one woman.

<img src="https://cdn-images-1.medium.com/max/567/1*JilJ5g_VCAWJ6W6ftm976g.png" alt="Image" />

**B-One-to-Many relationship:** A one-to-many relationship occurs when only one instance of one entity is associated with multiple instances of another entity.

<img src="https://cdn-images-1.medium.com/max/1024/1*jexpnicOGdyloDS5LlrVdA.jpeg" alt="Image" />

**3-Many-to-One relationship:** A many-to-one relationship occurs when many entities and only one entity are associated.

<img src="https://cdn-images-1.medium.com/max/513/1*_j3xkVGaeRa66ojLWwMTCg.png" alt="Image" />

**4-Many-to-Many relationship:** A many-to-many relationship occurs when multiple instances of the left entity and multiple instances of the right entity are associated.

<img src="https://cdn-images-1.medium.com/max/468/1*wjiOrt0dUeyM4irbH5riYw.jpeg" alt="Image" />

### What is database normalization?

Normalization is a process used in database design and is used to organize data in a database. Normalization aims to optimize the design of a database and minimize data redundancy. This ensures that the database performs better and maintains data integrity. The normalization process focuses on the structural organization of data in a database and helps in managing data more effectively.

### What is the ANSI standard?

ANSI SQL is a version of the SQL (Structured Query Language) standard developed by the American National Standards Institute (ANSI).


ANSI SQL was developed to ensure compatibility between different DBMSs and to facilitate portability among many different database management systems. The ANSI SQL standard includes a set of rules and guidelines regarding the structure, syntax, functions, and other features of SQL queries.


The current ANSI SQL standard used today is SQL:2016.

### What is WAMP?

WAMP is a technology stack. With WAMP, you can turn your own computer into a web server.

- “**W**” is for Windows operating system. The equivalent of this technology stack for Linux is called LAMP.
- “**A**” is Apache web server software.
- “**M**” is for MySQL. With MySQL, you can control your relational databases.
- “**P**” stands for PHP programming language.

Since MySQL and WAMP software are completely open source (outside of Windows), you can do whatever you want with these programs.


The current owner of MySQL is Oracle Corporation, and the most current stable version is 8.0.32.


Sources:


[https://www.javatpoint.com/dbms-er-model-concept](https://www.javatpoint.com/DBMS-ER-Model-Concept)


[https://web3ogren.com/](https://web3ogren.com/)


[https://blog.ansi.org/2018/10/sql-standard-iso-iec-9075-2016-ansi-x3-135/](https://blog.ansi.org/2008/10/SQL-Standard-ISO-IEC-90-75-2016/ANSI-X3-1-35/)


[https://www.hostinger.com/tutorials/what-is-wamp](https://www.hostinger.com/ tutorials/what-is-wamp)
