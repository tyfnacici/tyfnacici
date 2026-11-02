---
title: "Setting up a MySQL cluster and adding a Slave from outside"
description: "A guide to setting up a MySQL cluster and adding a Slave from an external server"
draft: false
tags: ["MySQL", "Database", "Replication"]
showToc: true
weight: 50
cover:
    image: "blog/mysql-cluster-slave/cover.png"
---

### 🔗 [Read on Medium](https://medium.com/@tyfnacici/mysql-cluster-slave)

<img src="https://cdn-images-1.medium.com/max/1024/1*EpWj-CORo0-P_1kaaLb5aQ.png" alt="Image" />

In this article, I will show you how to add a slave to a MySQL cluster using the GTID replication method. Thanks to this, you will be able to back up your database from the outside without including the slave machine in your cluster. As the MySQL server I will use Percona Server, and for the machines in the cluster, Percona XtraDB Cluster. All of my machines run Ubuntu 22.04 LTS.

### What is MySQL and what does it do?

MySQL is open-source software used as a database management system (DBMS). MySQL allows you to perform operations such as creating, querying, updating, and deleting a database using SQL (Structured Query Language).

### Where is it used?

MySQL is widely used for internet-based projects such as web applications, e-commerce sites, blogs, and forums. It can also be used for big data storage and analytics operations. For example, many websites and applications store visitor data in a MySQL database.

### What is a MySQL Cluster?

MySQL Cluster is a scalable, high-performance database management system built on top of the MySQL database management system. This system enables data to be distributed and synchronized across multiple servers. In this way, delays and interruptions that may occur during database operations are minimized, and the risk of data loss is reduced.


MySQL Cluster is scalable against unlimited data size and a high number of users. This way, it can carry a large data load for internet-based projects such as web applications, e-commerce sites, mobile applications, and IoT projects. It is also resilient against a high number of users and heavy data traffic.

### What is database replication and what does it do?

Database replication is a method used to ensure that the content of a database is copied and synchronized in more than one location. In this way, delays and interruptions that may occur during database operations are minimized, and the risk of data loss is reduced. Replication can also be used for backup and restore operations.


Database replication can be used for various purposes. For example, it can be used to back up and restore a database. This way, data loss resulting from problems or accidents that may occur during database operations can be prevented. It can also be used to improve database performance. For example, in order to reduce the load on the database, it can be ensured that queries are mostly executed on the backup servers.

### Master-Slave Replication

In this method, database operations (querying, updating) are performed only on the Master server. The operations performed by the Master server are automatically repeated by the Slave servers. This way, all servers are synchronized at the same time.

### Multi-Master Replication

In this method, there are multiple master servers. Each master server mirrors data to the other master servers, and operations occurring on any master server are detected and adapted by the other master servers. This method provides higher scalability and flexibility compared to the Master-Master Replication method.

### What is Percona?

Percona is an open-source alternative for the MySQL database management system. Percona offers a specially optimized version of MySQL to improve its performance and scalability.


While preserving MySQL’s core features, Percona also offers additional features and tools. In this article, we will use Percona’s Percona Server and Percona XtraDB Cluster software.

### In this article, we will use GTID replication for Master Slave replication. So why do we use GTID replication?

In traditional replication, the transactions in the binary logs that the master server sends to the slave servers are re-executed by the slave servers in the same order in which they were made on the master server. However, this method can cause us problems when dealing with multiple replication channels or when trying to recover from replication errors.


In GTID replication, the master server assigns a unique GTID to each transaction and sends it to the slave servers along with the binary log. The slave servers then execute the transaction and match their own GTID state with the one on the source server. This makes it easy to monitor and fix replication errors, and makes switching to a new master server easier in case the current master server is corrupted.


GTID replication offers you conveniences when you want to add a new slave server to your replication setup. The new slave you connect starts from the last GTID, and you don’t need to specify the binlog file and its position as in traditional replication.

### Requirements
- 3 machines with Ubuntu 22.04 LTS installed, all on the same network
- An internet connection

### Let’s set up the machines in our cluster

### Let’s install Percona XtraDB Cluster on our machines

Let’s make the necessary downloads by entering the following codes, in order, into the terminal of **all** of the machines that will be in the cluster.


sudo apt update
sudo apt install -y wget gnupg2 lsb-release curl
wget https://repo.percona.com/apt/percona-release_latest.generic_all.deb
sudo dpkg -i percona-release_latest.generic_all.deb
sudo apt update
sudo percona-release setup pxc80
sudo apt install -y percona-xtradb-cluster

### Let’s configure the machines we have installed

After making the necessary downloads, we need to stop the MySQL servers on all of our machines, since we are going to configure them.


sudo service mysql stop


For the configuration process, we open the **“/etc/mysql/mysql.conf.d/mysqld.cnf”** file.


sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf


Here, let’s enter the IP addresses of the computers that will be on our network, in order, into the **“wsrep_cluster_address”** part. Then let’s repeat this step for all the devices that will be in the cluster. I will set up my cluster with two machines.


wsrep_cluster_address=gcomm://192.168.70.61,192.168.70.62,192.168.70.63


We perform the operations done up to this point for all of our machines that will be in the cluster.


Let’s configure our first node according to the following information.


**“wsrep_node_name”: Must be different for each machine in the cluster.**


**“wsrep_node_address”: That machine’s IP address**


wsrep_node_name=pxc1
wsrep_node_address=192.168.70.61
pxc_strict_mode=ENFORCING


We configure our other nodes in a similar way, but so that every [wsrep_node_name](https://docs.percona.com/percona-xtradb-cluster/8.0/wsrep-system-index.html#wsrep_node_name) and [wsrep_node_address](https://docs.percona.com/percona-xtradb-cluster/8.0/wsrep-system-index.html#wsrep_node_address) part is unique to itself.


Since I will not use ssl in my setup, I will turn this off. To do this, let’s add the following line to the configuration file on all of our machines.


pxc_encrypt_cluster_traffic = OFF


If you are going to do the setup with an SSL certificate, you can take a look at [this](https://docs.percona.com/percona-xtradb-cluster/8.0/configure.html#configure) and [this part](https://docs.percona.com/percona-xtradb-cluster/8.0/security/encrypt-traffic.html#encrypt-replication-traffic) of the documentation.

### Let’s put our first node into bootstrap mode

Bootstrap means starting the first node without any known cluster address: if the wsrep_cluster_address variable is empty, Percona XtraDB Cluster assumes it is the first node and starts the cluster.


To start in bootstrap mode, we run the following command on our first node.


systemctl start mysql@bootstrap.service


When you start the cluster using this command, instead of running as we configured in the configuration file, it starts as “**wsrep_cluster_address=gcomm://**” and runs in bootstrap mode. This tells the node to start the cluster with the “**wsrep_cluster_conf_id**” variable set to 1. In other words, we have determined the first node of the cluster.


After adding our nodes to the cluster, you can turn off bootstrap mode and restart this node normally.


Then let’s open the MySQL console on our first node and check whether the cluster has started.


mysql -p
show status like 'wsrep%';


It should give an output like this.


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

### Let’s add our second node to the cluster

Let’s run the MySQL service on our second node.


systemctl start mysql


Then let’s open the MySQL console on this node of ours and check whether it has joined the cluster.


mysql -p
show status like 'wsrep%';


**wsrep_cluster_size** should rise to 2.


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


You can add the other nodes as well by repeating the operations we performed on our second node.

### Let’s turn off bootstrap mode

After connecting all the nodes to the cluster, let’s turn off the Bootstrap mode we enabled on our first node.


systemctl stop mysql@bootstrap.service


Then let’s start our MySQL service normally.


systemctl start mysql


Now the machines in our cluster have started working in a Multi-Master configuration.

### Let’s connect our Slave machine to the cluster

### Let’s install Percona Server on our machine

Let’s do the necessary installations by entering the following commands, in order, into our machine’s terminal.


sudo apt update
sudo apt install curl
curl -O https://repo.percona.com/apt/percona-release_latest.generic_all.deb
sudo apt install gnupg2 lsb-release ./percona-release_latest.generic_all.deb
sudo apt update
sudo percona-release setup ps80
sudo apt install percona-server-server

### Let’s configure our Master server

We go to whichever machine in the cluster we want to be the master of our slave server. We need to open port 3306 of the machine that will be the Master, for replication.


Let’s enter the following code into the terminal of the machine that will be the Master.


sudo ufw allow from replica_server_ip to any port 3306


Here, into the **“*replica_server_ip*”** part, we need to enter the IP address of our server that will be the slave.


Then, on our Master server, we open the **“/etc/mysql/mysql.conf.d/mysqld.cnf”** file with our text editor of choice and add the following codes to this file.


nano /etc/mysql/mysql.conf.d/mysqld.cnf


server-id = 1
log_bin = /var/log/mysql/mysql-bin.log
binlog_do_db = db 
gtid_mode = ON
enforce-gtid-consistency = ON


**“server-id”** = A server ID that must be unique to each server


**“binlog_do_db”** = The database you want to be replicated. If you are going to replicate more than one database, you can do it as follows.


binlog_do_db = db1
binlog_do_db = db2
binlog_do_db = db3
...
...


**“gtid_mode = ON” and “enforce-gtid-consistency = ON”** enable us to perform GTID replication.


For more detailed information about GTID, you can click [here](https://dev.mysql.com/doc/refman/8.0/en/replication-gtids-concepts.html).


After editing this file as above, we restart our mysql service.


sudo systemctl restart mysql

### Let’s create a user for replication

Let’s open the MySQL console on our Master server, edit the following command according to our needs, and enter it.


CREATE USER 'replica_user'@'replica_server_ip' IDENTIFIED WITH mysql_native_password BY 'password';


**“replica_user”** = the user that will perform the replication


**“replica_server_ip”** = the IP address of our slave server


**“password”** = the replication user’s password


Then we need to grant privileges to this user that will perform the replication.


GRANT REPLICATION SLAVE ON *.* TO 'replica_user'@'replica_server_ip';


After this, let’s run the following command.


FLUSH PRIVILEGES;

### Let’s configure our Slave server.

On our Slave server, let’s open the mysqld.cnf file by running the following command.


nano /etc/mysql/mysql.conf.d/mysqld.cnf


server-id = 2
log_bin = /var/log/mysql/mysql-bin.log
binlog_do_db = db
gtid_mode=ON
enforce-gtid-consistency=ON
log-replica-updates=ON
skip-replica-start=ON
relay-log = /var/log/mysql/mysql-relay-bin.log


**“server-id”** = A server ID that must be unique to each server


**“binlog_do_db”** = The database you want to be replicated. If you are going to replicate more than one database, you can do it as follows.


binlog_do_db = db1
binlog_do_db = db2
binlog_do_db = db3
...
...


Finally, let’s restart our MySQL service.


sudo systemctl restart mysql

### Let’s start the replication

Let’s open our MySQL console on our Slave server and enter the following commands.


CHANGE REPLICATION SOURCE TO
SOURCE_HOST='source_server_ip',
SOURCE_USER='replica_user',
SOURCE_PASSWORD='password',
SOURCE_AUTO_POSITION=1;


Here, you need to replace the SOURCE_LOG_FILE and SOURCE_LOG_POS parts with the values from the table I told you to note down.


Now we can start the replication.


START SLAVE;


Let’s take a look at the details of our replication process.


SHOW REPLICA STATUS\G;


When we enter the command above, it will give us an output like this.


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


When we run the following code on our Master server, if the GTID code it gives below is the same as the GTID code in the “Retrieved_Gtid_Set: 09df97bf-9bbb-11ed-9703–6e6b4394799a:1–4” part, it means the machines have matched.


show master status;
+------------------+----------+--------------+------------------+------------------------------------------+
| File | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
+------------------+----------+--------------+------------------+------------------------------------------+
| mysql-bin.000001 | 1593 | | | 09df97bf-9bbb-11ed-9703-6e6b4394799a:1-6 |
+------------------+----------+--------------+------------------+------------------------------------------+

### Let’s add a delay to our replication

Let’s enter the MySQL console on our Slave server and stop the replication.


stop slave;


Then we set the delay. I will write 30 here so that I can try it right away. Since the value I write is in seconds, the database replication will happen with a half-minute delay. You can set this value however you wish.


CHANGE MASTER TO MASTER_DELAY = 30;


Let’s start the replication again.


START SLAVE;


To check the delay, you can enter the following code into the MySQL console and look at the “Master_Delay” part on the resulting screen.


SHOW SLAVE STATUS \G


To reset the delay, in the MySQL console


reset slave;


it is enough to write this.


For more detailed information, you can click [here](https://dev.mysql.com/doc/refman/8.0/en/replication-delayed.html).


Thank you for reading.
