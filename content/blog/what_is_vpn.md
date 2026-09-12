---
title: "What is a VPN?"
description: "Comprehensive guide on what VPN (Virtual Private Network) technology is, how it works, and why it is used"
draft: false
tags: ["VPN", "Networking", "Security", "Linux"]
showToc: true
weight: 20
cover:
    image: "blog/vpn-nedir/cover.png"
---

### 🔗 [Read on Medium](https://medium.com/@tyfnacici/vpn-nedir)

A VPN (Virtual Private Network) is a technology that creates a secure and encrypted connection over a public or untrusted network like the internet. It allows users to access private networks while protecting their privacy and security, and sharing data remotely over public networks.


A VPN works by routing the user's internet connection through a remote server that acts as an intermediary between the user and the internet. The data transmitted between the user and the internet is encrypted, so it cannot be intercepted or accessed by unauthorized parties. This makes it possible for users to securely access the internet and sensitive information like private documents and financial details from anywhere in the world.

### Types of VPNs

### 1. Remote Access VPN

A Remote Access VPN allows a user to connect to a private network and access its services and resources remotely. The connection between the user and the private network is made over the internet and is completely secure.


Remote Access VPNs are very suitable for employees and people using VPNs at home.


While traveling, an employee uses a VPN to connect to their company's private network and remotely access files and resources on the private network.


Home users or private VPN users primarily need a VPN service to overcome regional restrictions on the internet and access blocked websites. Security-conscious internet users also use VPN services to improve their internet security and privacy.

### 2. Site-to-Site VPN

A Site-to-Site VPN, also known as Router-to-Router VPN, is mostly used in companies.


Companies with offices in different geographical locations use Site-to-site VPN to connect the network of one office location to the network of another office location. When multiple offices of the same company are connected using the Site-to-Site VPN type, it is called an Intranet-based VPN.


When companies use the Site-to-site VPN type to connect to another company's office, it is called an Extranet-based VPN. Basically, a Site-to-site VPN creates a virtual bridge between networks in geographically distant offices and connects them via the Internet, providing secure and private communication between networks.


Since Site-to-site VPN is based on router-to-router communication, in this VPN type, one router functions as the VPN Client and the other router functions as the VPN Server. Communication between the two routers begins only after authentication is established between them.

### **3-What is Client-Based VPN? How Does It Work?**

Client-Based VPN allows users to access a network depending on privacy and security conditions. Access to the secure connection is achieved through software, and a VPN username and password are required. A secure connection between the device and the remote network is created this way for secure data flow. Client-Based VPN is especially useful when accessing insecure public WLANs and is a universal access for employees to company resources for firms.

### Types of VPN security protocols
- IP Security or IPSec: IP Security or IPSec is used to ensure the security of Internet communication over an IP network. IPSec protects IP communication by authenticating the session and encrypts every data packet during the connection.
- IPSec works in two modes to protect data transfer between two different networks: Transport mode and Tunnel mode. Transport mode encrypts the payload in the data packet and tunnel mode encrypts the entire data packet. IPSec can also be used with other security protocols to enhance the security system.
- Layer 2 Tunneling Protocol (L2TP): L2TP or Layer 2 Tunneling Protocol is a tunneling protocol that is often combined with another VPN security protocol like IPSec to create a very secure VPN connection. L2TP creates a tunnel between two L2TP endpoints, and the IPSec protocol encrypts the data and manages secure communication between the tunnel.
- Point-to-Point Tunneling Protocol (PPTP): PPTP or Point-to-Point Tunneling-Protocol creates a tunnel and encapsulates the data packet. It uses Point-to-Point Protocol (PPP) to encrypt the data between the connection. PPTP is one of the most commonly used VPN protocols and has been used since Windows 95. In addition to Windows, PPTP is also supported on Mac and Linux.
- Secure Sockets Layer (SSL) and Transport Layer Security (TLS): SSL (Secure Sockets Layer) and TLS (Transport Layer Security) create a VPN connection where the web browser acts like a client and user access is limited to specific applications instead of the whole network. SSL and TLS protocols are most used by online shopping websites and service providers. Since web browsers are integrated with SSL and TLS, web browsers switch to SSL easily and without the user having to do almost any action. In SSL connections, https is found at the beginning of the URL instead of http.
- OpenVPN: OpenVPN is an open-source VPN that is useful for creating Point-to-Point and Site-to-Site connections. It uses a special security protocol based on SSL and TLS protocols. It is one of the must-have protocols among the best VPNs.
- Secure Shell (SSH): Secure Shell or SSH creates the VPN tunnel where data transfer takes place and also provides encryption for the tunnel. SSH connections are created by an SSH client and data is transferred from a local connection port to a remote server through an encrypted tunnel.

### Comparison of data transfer with and without VPN

<img src="https://cdn-images-1.medium.com/max/1024/1*gH-eexqpzHFE_wRiBKQspA.png" alt="Image" />
