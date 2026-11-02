---
title: "PowerDNS installation on Ubuntu 20.04 LTS"
description: "Steps for PowerDNS installation and configuration on Ubuntu 20.4 LTS"
draft: false
tags: ["DNS", "PowerDNS", "Ubuntu", "Linux"]
showToc: true
weight: 30
cover:
    image: "blog/powerdns-installation/cover.png"
---


<img src="https://cdn-images-1.medium.com/max/280/1*tH2YrWgGxZLIuZrsVmXEfw.png" alt="Image" />

### What is DNS?

DNS (Domain Name System) is a distributed and hierarchical system that converts human-readable domain names into IP addresses. Since computers and other devices communicate with each other using IP addresses rather than domain names, this is crucial for accessing websites and other internet-based services.


When a user types a domain name into a browser, their device sends a request to a DNS server, which then looks up the relevant IP address and returns it to the device. The device can then use the IP address to establish a connection with the requested website or service.


DNS is a vital component that allows the internet to operate in a user-friendly manner. Without DNS, users would have to manually enter IP addresses to access websites, making the internet much less accessible and user-friendly.

### What are DNS records?

DNS records are types of information stored in DNS servers. There are various types of DNS records, including:

- A (Address) record: maps a domain name to an IP address.
- MX (Mail Exchange) record: specifies the mail server responsible for receiving email for a domain.
- CNAME (Canonical Name) record: creates an alias for a hostname.
- NS (Name Server) record: defines the authoritative name servers for a specific domain.
- PTR (Pointer) record: maps an IP address to a hostname.
- TXT (Text) record: provides additional information about a hostname, such as SPF (Sender Policy Framework) information for anti-email spoofing.
- SRV (Service) record: used to specify the location of services, such as the server hosting a specific service for a domain.

These records help configure and manage various services and resources on the Internet, allowing users to access and use them efficiently.

### What is PowerDNS?

PowerDNS (pdns) is an open-source DNS server that works as an alternative to the traditional BIND (named) DNS. PowerDNS offers better performance compared to normal DNS and has minimal memory requirements. PowerDNS can also work with many backends, from simple DNS zone files to complex database installations and various SQL platforms.

### Let's download the MySQL database

Let's perform the MySQL installation by entering the following commands in our machine's terminal sequentially.


sudo apt install mariadb-server mariadb-client


Next, let's set a password for the security of the MySQL console.


sudo mysql_secure_installation


We answer as follows:


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


When you enter the password, you will see a screen like this:

<img src="https://cdn-images-1.medium.com/max/795/1*Em3HWZjVJYuiDmZxRGT1iQ.png" alt="Image" />

### Let's perform the PowerDNS installation

Let's write the following commands sequentially to add the PowerDNS repository to our machine.


# Download PowerDNS GPG Key
wget -qO - https://repo.powerdns.com/FD380FBB-pub.asc | gpg --dearmor > /etc/apt/trusted.gpg.d/pdns.gpg
​
# Adding the PowerDNS Repository for Ubuntu 20.04 System
echo "deb [arch=amd64] http://repo.powerdns.com/ubuntu focal-auth-45 main" | sudo tee /etc/apt/sources.list.d/pdns.list


Next, let's create the “/etc/apt/preferences.d/pdns” file and enter the following.


# all packages with first name pdns
- will be installed from the repo.powerdns.com repository
Package: pdns-*
Pin: origin repo.powerdns.com
Pin-Priority: 600


Let's refresh our system's package index and download the necessary packages.


# refresh package index after adding new repository
sudo apt update
​
# install PowerDNS and PowerDNS MySQL/MariaDB backend
sudo apt install pdns-server pdns-backend-mysql -y


Finally, let's check if the PowerDNS service is running.


sudo systemctl status pdns.service


As you can see, the PowerDNS service is running on port 53.

<img src="https://cdn-images-1.medium.com/max/1024/1*hAdaX93tpcA_xuJFC8lw9A.png" alt="Image" />

### Let's configure the PowerDNS database

Let's open our MySQL console.


mysql -u root -p


Next, let's create a database for PowerDNS by entering the following commands, and let's create a user for PowerDNS to be able to access this database.


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


Next, let's add the ready-made database schema that PowerDNS has created to our MySQL database.


# import the schema.mysql.sql to the pdns database
mysql -u pdnsadmin -p pdns < /usr/share/pdns-backend-mysql/schema/schema.mysql.sql


After this process, when we write the following command, it should give us an output like this:

<img src="https://cdn-images-1.medium.com/max/467/1*VOpuPBqLm4wie7YI_8vTWw.png" alt="Image" />

### Let's connect PowerDNS to MySQL

First, let's stop the PowerDNS service.


sudo systemctl stop pdns.service


Next, let's create a file named “*/etc/powerdns/pdns.d/mysql.conf*” and fill it as follows.


# Define the gmysql backend
launch+=gmysql
​
# Details MariaDB database for PowerDNS
gmysql-host=127.0.0.1
gmysql-port=3306
gmysql-dbname=pdns # database we created for pdns
gmysql-user=pdnsadmin # user we created for pdns
gmysql-password=StrongPdnsPasswd # password we created for pdns
gmysql-dnssec=yes
# gmysql-socket=


Let's adjust the permissions of the file we created so that PowerDNS can access it.


# change the ownership to user and group pdns
sudo chown pdns:pdns /etc/powerdns/pdns.d/mysql.conf
​
# change permission of the file
sudo chmod 640 /etc/powerdns/jdns.d/mysql.conf


Let's restart the PowerDNS service.


# start PowerDNS service
sudo systemctl start pdns.service
​
# verify status of the PowerDNS service
sudo systemctl status pdns.service

<img src="https://cdn-images-1.medium.com/max/906/1*cMt5YMGR9JmOJrYNG8qqnQ.png" alt="Image" />

### Let's create DNS records

Let's open the MySQL console.


mysql -u root -p


Next, let's add our domain to the “domains” table.


INSERT INTO domains (name, type) VALUES ('example.com', 'NATIVE');


Let's add A, NS and SOA DNS records to this domain.


INSERT INTO records (domain_id, name, type, content, ttl)
VALUES (1, 'example.com', 'A', '192.0.2.1', 3600);
​
INSERT INTO records (domain_id, same, type, content, ttl
VALUES (1, 'example.domian', 'NS', 'ns1.example.com', 3600);
​
INSERT INTO records (domain_id... (wait, I'll just copy the exact SQL from my previous step's read)
INSERT INTO records (domain_id, name, type, content, ttl)
VALUES (1, 'example.com', 'SOA', 'ns1.example.com hostmaster.example.com 2023010101 10800 3600 604800 361', 3600);



Exit the MySQL console and verify the configuration by running the command below.


pdnsutil check-all-zones

<img src="https://cdn-images-1.medium.com/max/780/1*WEVfiT0b1jHMlV9cpt-RCg.png" alt="Image" />

The installation was completed successfully. Thanks for reading.
