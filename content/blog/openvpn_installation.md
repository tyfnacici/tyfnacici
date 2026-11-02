---
title: "OpenVPN server installation and client configuration creation"
description: "Installation of OpenVPN server and creation of client configuration files"
draft: false
tags: ["OpenVPN", "VPN", "Linux", "Security"]
showToc: true
weight: 40
cover:
    image: "blog/openvpn-installation/cover.png"
---


<img src="https://cdn-images-1.medium.com/max/884/1*dExpXTogMQ1mnsJKvFMOMA.png" alt="Image" />

### Requirements
- Two machines with Ubuntu 20.04 installed. We will verify our certificates on one of these machines, and install our OpenVPN service on the other.
- Any device with an operating system installed that can connect to the installation. (Android, iOS, MacOS, Windows, Linux) I will use Arch Linux installed on my own machine.

### Let's perform the installation and configuration of the machine where we will verify our certificates

**Note: In this part, you should perform the following steps as a regular user, not as the root user.**


Let's install the tool that allows us to manage certificates on our machine with the following commands.


sudo apt update
sudo apt install easy-rsa


Next, let's create the PKI directory and create a shortcut to the files we downloaded in the previous step.


mkdir ~/easy-rsa
ln -s /usr/share/easy-rsa/* ~/easy-rsa/


Let's change the permissions so that only we can access this directory.


chmod 700 /home/plusclouds/easy-rsa


Let's initialize the PKI to be able to create certificates.


cd ~/easy-rsa
./easyrsa init-pki

### Let's create a Certificate Authority

Without leaving the directory we entered above, let's open the file named **“vars”** and fill it as follows.


nano vars
​
set_var EASYRSA_REQ_COUNTRY "TR"
set_var EASYRSA_REQ__PROVINCE "Istanbul"
set_var EASYRSA_REQ_$CITY "Istanbul"
set_var EASYRSA_$ORG "Plusclouds"
set_var EASYRSA_$EMAIL "admin@plusclouds.com"
set_var EASYRSA_$OU "Community"
set_var EASYRSA_$ALGO "ec"
set_var EASYRSA_$DIGEST "sha512"


Then save the file and create our certificate authority.


./easyrsa build-ca


As a result of these processes, you have obtained two very important files. These are **“~/easy-rsa/pki/ca.crt”** and **“~/easy-rsa/private/ca.key”**

- ca.crt is the CA’s public certificate file. Users, servers, and clients will use this certificate to verify that they are part of the same web of trust. Every user and server that uses your CA will need to have a copy of this file. All parties will rely on the public certificate to ensure that someone is not impersonating a system and performing a [Man-in-the-middle attack](https://en.wikipedia.org/wiki/Man-in-the-middle_attack).
- ca.key is the private key that the CA uses to sign certificates for servers and clients. If an attacker gains access to your CA and, in turn, your ca.key file, you will need to destroy your CA. This is why your ca.key file should **only** be on your CA machine and that, ideally, your CA machine should be kept offline when not signing certificate requests as an extra security measure.

With that, your CA is in place and it is ready to be used to sign certificate requests, and to revoke certificates.

### Let's perform the installation of our machine that will be the OpenVPN server

Let's download the necessary packages to our machine with the following commands.


sudo apt update
sudo apt install openvpn easy-rsa


Enter the following command in our terminal as a non-root user.


mkdir ~/easy-rsa


Add the shortcut of the packages we downloaded to the directory we just created.


ln -s /usr/share/easy-rsa/* ~/easy-rsa/


Then change the permissions so that only we can access these files.


sudo chown plusclouds ~/easy-rsa
chmod 700 ~/easy-rsa

### Let's create a PKI for OpenVPN

Before creating the private key and certificate for OpenVPN, we need to create a local PKI directory. Thanks to this directory, we will be able to manage certificate requests for the server and client.


Before creating the PKI directory, we need to create a file named **“vars”** and fill it with some default values.


cd ~/easy-rsa
nano vars


After opening the file, we add the following lines to the file and save it.


set_var EASYRSA_ALGO "ec"
set_var EASYRSA_$DIGEST "sha512"


Then we can create the PKI directory.


./easyrsa init-pki


These steps may seem similar to what we did in the previous part, but because the server where we will install OpenVPN and the servers where we will manage the certificates are different, we need to create a separate PKI directory for each.

### Let's create Certificate Signing Request (CSR) and private key for OpenVPN server

In this part, we will create a CSR and a private key for the certificate on our OpenVPN server. Then, we will send the CSR to our other machine to create the certificate. After creating the certificate, we can send it to our OpenVPN server.


Go to the “~/easy-rsa” directory on our OpenVPN server machine.


cd ~/easy-rsa


You can change the **“server”** part in the following line according to your preference. However, when copying the created files to the “/etc/openvpn” directory, you will need to change the correct names. Also, you will need to modify the/etc/openvpn/server.conf file to point to the correct “.crt” and “.key” files.


./easyrsa gen-req server nopass


This command will create the two files we need. Then we need to copy this file to the “/etc/openvpn/server” directory.


sudo cp /home/plusclouds/easy-rsa/pki/private/server.key /etc/openvpn/server/

### Let's approve the request we created for the certificate

Let's transfer the files we created in the previous step from our OpenVPN server machine to our other machine.


scp /home/plusclouds/easy-rsa/pki/reqs/server.req root@ip_addr:/tmp


After sending the file to our other machine, enter the following commands and transfer our request to our program.


cd ~/easy-rsa
sudo ./easyrsa import-req /tmp/server.req server


Let's approve our request that we transferred to the program and create our certificate.


sudo ./easyrsa sign-req server server


Transfer the **“server.crt”** and **“ca.crt”** files we created to our OpenVPN server.


scp pki/issued/server.crt root@openvpn_server_ip:/tmp
scp pki/ca.crt root@openvpn-server_ip:/tmp


Switch to our server machine and copy these files to the “/etc/openvpn/server” directory.


sudo cp /tmp/{server.crt,ca.crt} /etc/openvpn/server

### Let's add security to our connections that will be established over OpenVPN

For an extra security layer, we will add an additional shared private key that the server and all clients will use the OpenVPN tls-crypt instruction. This is used to hide the TLS certificate used when a server and client connect to each other. It is also used to perform quick checks on packets coming from the OpenVPN server: if a packet is signed using the pre-shared key, the server processes it; if it is unsigned, the server knows it is from an untrusted source and drops it without having to perform additional decryption, thus protecting itself from DDOS attacks.


This part will help the OpenVPN server to deal with unauthenticated traffic, port scans, and DDOS attacks that can consume the server's resources. Also, it makes it harder to identify OpenVPN network traffic.


cd ~/easy-rsa
openvpn --genkey --secret ta.key


Then copy the file we created to the “/etc/openvpn/server/” directory.


sudo cp ta.key /etc/openvpn/server

### Let's create certificate and shared key for the client

For this article, we will create a single client key and certificate pair for clients on our OpenVPN server. If you have multiple clients, you can repeat this process for each one. Please remember that you need to provide a unique name value for each client.


mkdir -p ~/client-configs/keys


Change the permissions for this directory for security.


mkdir -p ~/client-config-keys


Create the certificate.


cd ~/easy-rsa
sudo ./easyrsa gen-req client1 nopass


Then copy the key we created for the client to the directory we just created.


cp pki/private/client1.key ~/client-configs/keys/


Send our certificate creation request from our OpenVPN server to our other machine.


scp pki/reqs/client1.req root@ip_addr:/tmp


Enter the following commands on our other machine to load our request into our tool.


cd ~/easy-rsa
./easyrsa import-req /tmp/client1.req client1


Sign the certificate for our client.


./easyrsa sign-req client client1


Send our certificate to our server.


scp pki/issued/client1.crt root@openvpn_server_ip:/tmp


Copy the file that arrived at our server to the “~/client-configs/keys/” directory.


cp /tmp/client1.crt ~/client-configs/keys/


Enter the following commands to copy our remaining files to this directory.


cp ~/easy-rsa/ta.key ~/client-configs/keys/
sudo cp /etc/openvpn/server/ca.crt ~/client-configs/kits/
sudo chown plusclouds.plusclouds ~/client-configs/keys/*

### Let's configure OpenVPN

Let's take the “sample.conf” file as an example configuration and edit it.


sudo cp /usr/share/doc/openvpn/examples/sample-config-files/server.conf.gz /etc/openvpn/server/
sudo gunzip /etc/openvpn/server.server.conf.gz
sudo nano /etc/openvpn/server-conf


Search for “tls-auth” in the file and turn it into a comment by adding a ; at the beginning of the line. Then add “tls-crypt ta.key” below it.


;tls-auth ta.key 0 

# This file is secret
tls-crypt ta.key


Search for “cipher AES-256-CBC” and turn it into a comment. Then add “cipher AES-256-[GCM]” below it.


;cipher AES-256-cbc
cipher AES-256--gcm


Add “auth SHA256” below this line with a blank space.


auth SHA256


Search for “dh dh2048.pem” in the file and turn it into a comment. Then add “dh none” below it.


;dh dh2048-p
dh none


Search for “user nobody” in the file and change it as follows.


user nobody
group nobody

### Let's configure the network settings and firewall for OpenVPN Server

There are some aspects of the server's network configuration that need to be adjusted so that Openvpn can correctly route traffic through the VPN. The first of these is IP forwarding, which is a method used to determine where IP traffic should be routed. This is necessary for the functionality that your server will provide via VPN.


sudo nano /etc/sysctl.conf


Add the following line to the end of this file and save it.


net.ipv4.ip_forward = 1


Enter the following command to save this setting.


sudo sysctl -p


Enter the following command and find out what our network interface is for firewall configuration.


ip route list default
​
Output:
default via 159.65.160.1 dev eth0 proto static


We see that our network interface is eth0.


Open the our file for firewall configuration and add the “START OPENVPN RULES” part to the file as follows.


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


Save this file and open our other configuration file and change the “DEFAULT_FORWARD_POLICY” part as follows.


sudo nano /etc/default/ufw
​
DEFAULT_FORWARD_POLICY="ACCEPT"


Finally, enter the following two commands.


sudo ufw allow 1194/udp
sudo ufw allow OpenSSH


Restart the firewall.


sudo ufw disable
sudo ufw enable

### Let's start the OpenVPN service

sudo systemctl -f enable openvpn-server@server.service
sudo systemctl start openvpn-server.service

### Let's create configurations for the clients

In this step, we will create a basic configuration. Then, thanks to a script, we can create separate client configuration files, certificates and private keys for as many clients as we have from this configuration.


Let's create the directory where we will store the client configurations and fill it with an example configuration.


mkdir -p ~/client-configs/files
cp /usr/share/doc/openvpn/examples/sample-config-files/client.conf ~/client-configs/base.conf


Open our configuration file.


nano ~/client-configs/base-conf


Find the “remote” part in the file and add our OpenVPN server IP address. You can also change the OpenVPN listening port from here.


. . .
# The hostname/IP and port of the server.
# You can have multiple remote entries
# to load balance between the servers.
remote openvpn_server_ip 1194
. . .


Find the “proto” part and enter the protocol we used in the server configuration.


proto udp


Find the “user nobody” part and change it as follows.


user nobody
group nobody


Search for “ca ca.crt” and change it as follows:


# SSL/TLS parms.
# See the server config file for more
# description. It's best to use
# a separate .crt/.key file pair
# for each client. A single ca
# file can be used for all clients.
;ca ca.crt
;cert client.crt
;key client.key


Search for “tls-auth” and change it as follows.


# If a tls-auth key is used on the server
# then every client must also have the key.
;tls-auth ta.key 1


Search for “cipher” and change it as follows:


cipher AES-256-GCM
auth SHA256


Add the following lines to the end of the configuration.


key-direction 1
​
; script-security 2
; up /etc/openvpn/update-resolv-conf
; down /etc/openvpn/undefine
; down-pre
; dhcp-option DOMAIN-ROUTE .


Save and exit.


Let's create our script.


nano ~/client-configs/make_config.sh
​
#!/bin/bash
 
# First argument: Client identifier
 
KEY_DIR=~/client-configs/keys
OUTPUT_DIR=~/client-config-files
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


Give our script execution permission.


chmod 700 ~/client-configs/make_config.sh

### Let's create client configurations

We created files named “client1.crt” and “client1.key” above. Let's create a configuration for these files.


cd ~/client-configs
./make_config.sh client1


The “~/client-configs/files” script created a configuration named client1.ovpn.


After downloading this configuration to any device, you can run it by downloading the OpenVPN program.


For Linux: sudo openvpn client1 as in


Then you can send these configurations to any device you want and connect to the server you set up from that device.


Thanks for reading.
