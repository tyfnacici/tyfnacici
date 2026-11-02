---
title: "OpenLDAP Multimaster replication configuration with TLS"
description: "Setting up OpenLDAP Multimaster replication and securing it with TLS"
draft: false
tags: ["LDAP", "OpenLDAP", "TLS", "Linux"]
showToc: true
weight: 70
cover:
    image: "blog/openldap-multimaster/cover.png"
---

### 🔗 [Read on Medium](https://medium.com/@tyfnacici/openldap-multimaster)

- At least 2 virtual machines with openLDAP installed. In this article, we will use Ubuntu 22.04 LTS. It is strongly recommended that you use the same distributions.
- An NTP server installed and synchronizing properly on all of the virtual machines we will use.

### What is LDAP?

**Lightweight Directory Access Protocol** or simply **LDAP**, is an application layer protocol used to query and modify directory services running over TCP/IP.


This protocol is used by directory servers such as OpenLDAP, Sun Directory Server, and Microsoft Active Directory. For starters, we can say it has a structure similar to a database, but its most fundamental difference from a database is that it does not have a hierarchical structure.


The LDAP protocol is a message-oriented protocol. What this means is this: the client creates an LDAP message containing a request, and sends the message to the server; the server processes this request, and sends the client the result as a response in one or more LDAP messages.


Since LDAP is a message-based protocol, the client can make more than one request at a time. For example, a client can perform two search operations at the same time. Making it possible to perform multiple operations at the same time makes the LDAP protocol a more flexible and efficient protocol compared to HTTP and similar protocols that do not allow this.

### What is OpenLDAP?

OpenLDAP is an implementation of LDAP developed by the OpenLDAP Project. It uses a BSD-derived license known as the OpenLDAP Public License. It is a platform-independent protocol. Many Linux distributions in use include the OpenLDAP software for LDAP support.

### What is NTP?

NTP is a sequential time distribution system with redundant capacity. It measures the algorithms and delays on the network and on the target machine. Using these techniques, it can synchronize clocks to within thousandths of a second. NTP settings are made either from the /etc/ntp.conf file or from the /etc/xntp.conf file, depending on which distribution is used.


In most ntp.conf files with a basic configuration, there are two server names. One is the name of the server whose time is to be set, and the other is a dummy IP address.
The dummy IP address is used in case there are network problems or in case the NTP server is down/crashed. When the remote NTP server comes back up, the NTP application on the system will set the system clock according to it again. Of these two servers, the first acts as the primary server, and the second is for backup purposes. In addition, the location of this target file must also be specified. Over time, NTP will “learn” the error rate of the system clock and adjust itself accordingly.

### Let's Start the Installation

You need to apply the following steps on both servers.

#### 1-First, let's install NTP on both of our devices and make all of our machines run in sync.

apt -y install ntp


Since the NTP package is already configured on Ubuntu, we don't need to do any additional operation regarding NTP.

#### 2-All of our servers must know one another

nano /etc/hosts


Into this file, we write our machines' IP addresses and the addresses we want to put next to them.


10.0.0.1 ldap1.tayfun.com
10.0.0.2 ldap2.tayfun.com


To test whether this setting of ours works, you can enter the addresses you wrote from one of our machines to the other and ping them.

### Now we can move on to the LDAP installation.

#### In the Multi-Master setup, we install LDAP on the machine we want to be the Master.

#### 1-The steps I list below must be done on both machines.

apt -y install slapd ldap-utils

<img src="https://cdn-images-1.medium.com/max/802/1*p3mMm6KZOpqNtrZMyN8j0w.png" alt="Image" />
*Don't forget the password you set during the installation, we will need it :).*
#### 2-After the installation is finished, we need to run the following command to complete some configurations.

dpkg-reconfigure slapd


After running this command, you need to answer the questions that appear as follows.

- **Omit OpenLDAP Server Configuration:** No
- **DNS Domain Name:** This creates the base structure for your directory path.

<img src="https://cdn-images-1.medium.com/max/619/1*wRNMw9cHCumOx8XpodwteA.png" alt="Image" />
- **Organization Name: **The name to be used as the base DN for your LDAP directory.
- **Administrator Password:** The admin password you set a moment ago
- **Remove The Database When Slapd Is Purged:** No
- **Move Old Database:** Yes

After making these settings, you can check your settings by writing the following command to the console.


slapcat

<img src="https://cdn-images-1.medium.com/max/621/1*sEBkZGM_paKyh9KTxN4xgA.png" alt="Image" />

#### 3-Let's create a base DN for users and groups.

Let's create the file as follows and put the text I added inside it.


vim base.ldif


dn: ou=people,dc=plusclouds,dc=com
objectClass: organizationalUnit
ou: people

dn: ou=groups,dc=plusclouds,dc=com
objectClass: organizationalUnit
ou: groups


To add this file to our LDAP installation, we need to run this command


ldapadd -x -D cn=admin,dc=plusclouds,dc=com -W -f base.ldif


When it asks for the password, you need to type the password you added while installing LDAP.

#### Let's move on to the setup of the servers we want to be slaves in the Multi-Master configuration

#### 1-Let's install the necessary packages.

apt -y install libnss-ldapd libpam-ldapd ldap-utils

#### 2-After the installation, let's run the following command to make the necessary configurations

dpkg-reconfigure nslcd

<img src="https://cdn-images-1.medium.com/max/621/1*YN-w9sncdQfOlgVxc4csrA.png" alt="Image" />

On the screen that appears, let's enter whatever address we specified in the hosts file of our Master server.

<img src="https://cdn-images-1.medium.com/max/621/1*oN-QDQi2CrEZVEhdJ3tG0w.png" alt="Image" />
*Let's also enter our LDAP base address.*
<img src="https://cdn-images-1.medium.com/max/1024/1*3GdsgToF4sVhCdqBP_LOug.png" alt="Image" />
*Here we select “simple”.*
<img src="https://cdn-images-1.medium.com/max/1024/1*T1USgfUSRVbVs2na_ioYvA.png" alt="Image" />
*Here, enter whichever account you want to be used to access the LDAP database. I will enter the admin account.*


Then, on the next screen, after entering our LDAP admin password, we say yes to the “Use StartTLS” option.

<img src="https://cdn-images-1.medium.com/max/1024/1*glMFxxUu6f_jBEw-gS2A_A.png" alt="Image" />
*On this screen we say “allow”.*
<img src="https://cdn-images-1.medium.com/max/1024/1*V45R_jGNlMqyg-wJLI0-Tg.png" alt="Image" />
*Here, write the address I specified. We will add the certificate here shortly.*


After making these configurations, you need to open the following file and add these lines to the very end of it.


vim /etc/pam.d/common-session


session optional pam_mkhomedir.so skel=/etc/skel umask=077


Then run the following command on your Slave machine.


systemctl restart nscd nslcd


Then exit your machine with the “exit” command and connect again. Once you have connected, set a new password with the “passwd” command. This password will be the password of the user account on your slave machine when you connect via ssh.

### Creating a certificate for SSL.

It is recommended that this part be done only for testing and development purposes. On systems that will be used in production, it will be more secure to obtain the certificate from an authority.


On all of our machines, you must make an addition to the “**/etc/ssl/openssl.cnf” file **with your Master machine’s DNS**, in the manner I will specify below.**


[ plusclouds.com ]
subjectAltName = DNS:ldap1.tayfun.com


then go to the “/etc/ssl/private” directory and run this command.


openssl genrsa -aes128 2048 > server.key


After setting a passphrase, run this command


openssl rsa -in server.key -out server.key


Finally, run this command to create your SSL certificate.


openssl req -utf8 -new -key server.key -out server.csr


This command will ask you a few questions. Since we are doing this for testing purposes at the moment, I am continuing by leaving them all blank.


Congratulations, we have created our certificate.


To be able to use our certificate, we need to run this command.


openssl x509 -in server.csr -out server.crt -req -signkey server.key -extfile /etc/ssl/openssl.cnf -extensions plusclouds.com -days 3650


Then we fix the permissions in our current directory.


chmod 600 server.key


ll server.*

### Now that we have our certificate, let's move on to the SSL setup.

The following steps will be performed on all of our servers.


We run the following two commands one after the other.


cp /etc/ssl/private/server.key \
/etc/ssl/private/server.crt \
/etc/ssl/certs/ca-certificates.crt \
/etc/ldap/sasl2/


chown openldap. /etc/ldap/sasl2/server.key \
/etc/ldap/sasl2/server.crt \
/etc/ldap/sasl2/ca-certificates.crt


Then we create a file named “mod_ssl.ldif” and fill it in as follows.


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


We add this file to our LDAP configuration as follows.


ldapmodify -Y EXTERNAL -H ldapi:/// -f mod_ssl.ldif


Then we restart the slapd service by writing the following command.


 systemctl restart slapd

#### We have made the necessary settings for SSL on our servers. The following steps, however, we need to apply on our Slave server.

We go into our “etc/nslcd.conf” file and make the following additions on line 29.


ssl start_tls
tls_reqcert allow


then we restart our service with “[**systemctl**](https://www.server-world.info/en/command/html/systemctl.html)** restart nslcd” and after typing exit, we connect again via ssh.**

### We have done all the installations. Now let's move on to our Multi-Master Replication setup.

We do the following steps on both of our servers.


We create a file named “mod_syncprov.ldif” and fill its contents as follows.


dn: cn=module,cn=config
objectClass: olcModuleList
cn: module
olcModulePath: /usr/lib/ldap
olcModuleLoad: syncprov.la


ldapadd -Y EXTERNAL -H ldapi:/// -f mod_syncprov.ldif


With the command above, we add this file to our configuration.


Following this operation, we create a file named “syncprov.ldif”. We fill its contents as follows.


dn: olcOverlay=syncprov,olcDatabase={1}mdb,cn=config
objectClass: olcOverlayConfig
objectClass: olcSyncProvConfig
olcOverlay: syncprov
olcSpSessionLog: 100


We add this file to our configuration with the following command as well.


ldapadd -Y EXTERNAL -H ldapi:/// -f syncprov.ldif


We create a file named “multimaster.ldif”. We fill its contents as follows.


dn: cn=config
changetype: modify
replace: olcServerID
olcServerID: 1 //This must be different on each server, Slave or Master alike.

dn: olcDatabase={1}mdb,cn=config
changetype: modify
add: olcSyncRepl
olcSyncRepl: rid=001
 provider=ldap://10.0.0.1:389/ //Each machine's own IP address and port 389
 bindmethod=simple
 binddn="cn=admin,dc=plusclouds,dc=com"
 credentials=123 //your ldap password
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


Then let's add this file to the configuration on both of our machines.


ldapmodify -Y EXTERNAL -H ldapi:/// -f master01.ldif


We apply the following step only on the machine of ours that will be the Slave.


We go into the “/etc/nslcd.conf” file and add the following to line 10.


uri ldap://ldap1.tayfun.com/ ldap://ldap2.tayfun.com/


Finally, we restart the nslcd service with the following command.


systemctl restart nslcd

### We have completed our installation. Come on, let's give it a try and see whether it works.

Let's create a file named “ldapuser.ldif” on any one of our machines.


dn: uid=jammy,ou=people,dc=plusclouds,dc=com
objectClass: inetOrgPerson
objectClass: posixAccount
objectClass: shadowAccount
cn: jammy
sn: ubuntu
userPassword: {SSHA}j3oQtXCibE6YNoWl5Dh3G6+sHd1+pCOW //Here you need to generate a password with slappasswd and put it in.
loginShell: /bin/bash
uidNumber: 2000
gidNumber: 2000
homeDirectory: /home/jammy

dn: cn=jammy,ou=groups,dc=plusclouds,dc=com
objectClass: posixGroup
cn: jammy
gidNumber: 2000
memberUid: jammy


After adding this user to our configuration with the following command, this user should also be created on our other machines.


ldapadd -x -D cn=admin,dc=plusclouds,dc=com -W -f ldapuser.ldif
