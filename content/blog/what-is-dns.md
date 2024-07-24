---
title: "What is DNS"
description: "Domain Name Server Explained"
dateString: Apr 2024
draft: true
tags: [""]
weight: 300
---

# What is DNS (Domain Name Server)?

![](https://raw.githubusercontent.com/tyfnacici/tyfnacici/main/static/blog/what-is-dns/domain.webp)

From your mobile phone to your laptop or servers hosting major websites, all computers on the internet use IP addresses to find and communicate with each other. However, when accessing a website, instead of typing the IP address, we enter the site's domain name in our web browser to reach the website. In fact, you could reach the site by typing the IP address instead of the domain name, but imagine doing this for all the sites you visit in a day. Rather than remembering all these numbers, we use domains that people can more easily understand. DNS is the service that allows us to type domain names into the browser to go to IP addresses.

## How Does DNS Work?

DNS works similarly to a phone book. It directs incoming requests to the IP addresses corresponding to the requested domain names.

### Types of DNS Services

1- Authoritative DNS

An Authoritative DNS has the final authority over a domain name and is responsible for providing IP address information to recursive DNS servers.

2- DNS Recursor (Recursive DNS)

Clients usually do not query authoritative DNS servers directly. Instead, they connect to another type of DNS service known as a resolver, which is a recursive DNS server. A recursive DNS server, even if it does not have the DNS records you ask for, acts as an intermediary that can retrieve DNS information on your behalf.

If a request to a recursive DNS server has been made recently, the DNS server responds by looking at the data stored in its cache. If the data is not in the cache, it forwards the query to one or more authoritative DNS servers to find the answer.

### Types of DNS Records

- NS Record: The name of the authoritative DNS server responsible for the domain name.
- A Record: Records that hold a computer name and its corresponding IPv4 address.
- AAAA Record: Records that hold a computer name and its corresponding IPv6 address.
- CNAME Record: Alias. Used to create an alias for an existing A record.
- MX Record: Used to define where email should be sent.
- TXT Record: A record type typically used in ownership verification processes.

## How Does the DNS Server Direct an Incoming Request to Your Web Application?

![](https://raw.githubusercontent.com/tyfnacici/tyfnacici/main/static/blog/what-is-dns/dns-lookup-steps.png)

1. A user types 'example.com' into a web browser, and the query goes to the internet, received by a DNS recursive resolver.
2. The resolver then sends a query to a DNS root name server (.).
3. The root server responds to the resolver with the address of a Top-Level Domain (TLD) DNS server (e.g., .com or .net), which holds information for its domains. When 'example.com' is searched, our request is directed to the .com TLD.
4. The resolver then makes a request to the .com TLD.
5. The TLD server responds with the IP address of the domain's name server, 'example.com'.
6. Finally, the recursive resolver sends a query to the domain's name server.
7. The IP address for 'example.com' then returns from the name server to the resolver.
8. The DNS resolver then responds to the web browser with the IP address of the initially requested domain.
Once the 8 steps of the DNS lookup have returned the IP address for example.com, the browser is able to make the request for the web page:
9. The browser makes a HTTP request to the IP address.
10. The server at that IP returns the webpage to be rendered in the browser (step 10).

### Resources

- https://www.cloudflare.com/learning/dns/what-is-dns/#
- https://aws.amazon.com/route53/what-is-dns/
- https://www.techtarget.com/searchnetworking/definition/domain-name-system
- https://en.wikipedia.org/wiki/Domain_Name_System
- https://www.cloudflare.com/learning/dns/what-is-a-dns-server/