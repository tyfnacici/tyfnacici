---
title: "Creating a Linux Virtual Machine with KVM"
description: "Kernel-Based Virtual Machine Explained"
dateString: Apr 2024
draft: false
tags: ["Linux", "DevOps", "Cloud"]
weight: 100
---

# Creating a Linux Virtual Machine with KVM
## What is KVM?

Kernel-Based Virtual Machine (KVM) is a virtualization infrastructure developed for the Linux kernel, transforming it into a hypervisor. KVM requires a processor with hardware virtualization capabilities to be available.

KVM is a part of Linux. If you have Linux Kernel 2.6.20 or newer, you have KVM. KVM was first announced in 2006 and merged with the mainline Linux kernel a year later. Since KVM is part of the existing Linux code, it immediately benefits from every new Linux feature, fix, and enhancement without additional engineering.

## What is Virtualization?

Virtualization allows hardware components such as processors, memory, and storage on a computer to be divided into multiple virtual machines (VMs). Each virtual machine runs its own operating system (OS) and behaves like an independent computer, even though it operates on only a portion of the underlying physical computer hardware.

Virtualization technology forms the foundation of modern cloud computing.

Virtualization provides various advantages to data center operators and service providers, including:

- Efficient resource utilization
- Easier management
- Minimum downtime

## What is a Hypervisor?

A hypervisor is a software layer that coordinates virtual machines. It acts as an interface between the virtual machine and the underlying physical hardware, ensuring that each has access to the physical resources it needs to execute. Additionally, it ensures that virtual machines do not interfere with each other by affecting each other's memory areas or computation cycles.

There are two types of hypervisors:

### Type 1 Hypervisor

Type 1 or “bare metal” hypervisor interacts directly with the underlying physical resources, completely replacing the traditional operating system. They are most commonly seen in virtual server scenarios.

### Type 2 Hypervisor

Type 2 hypervisor runs as an application on an existing operating system. They are most commonly used on endpoint devices to run alternative operating systems and carry a performance overhead since they need to use the main operating system to access and coordinate the underlying hardware resources.

## How Does KVM Work?

KVM turns Linux into a type 1 (bare metal) hypervisor. All hypervisors require some OS-level components such as a memory manager, process scheduler, I/O stack, device drivers, security manager, and network stack to run virtual machines. Since KVM is part of the Linux kernel, it has all these components. Each virtual machine is implemented as a regular Linux process, scheduled by the standard Linux scheduler, with dedicated virtual hardware such as a network card, graphics adapter, CPU(s), memory, and disks.

## What are the Advantages of Using KVM Hypervisor?

The biggest advantage of the KVM hypervisor is its native availability in Linux. Since KVM is part of Linux, it comes natively with the Linux kernel. It provides a simple user experience and seamless integration. However, KVM offers more benefits compared to other virtualization technologies. These include:

- Performance - One of the main drawbacks of traditional virtualization technologies is the performance lag of virtual machines compared to physical machines. As a type-1 hypervisor, KVM performs better than all type-2 hypervisors, delivering near-physical machine performance. With the KVM hypervisor, virtual machines boot quickly and achieve desired performance results.
- Scalability - As a Linux kernel module, the KVM hypervisor automatically scales to respond to heavy loads when the number of virtual machines increases. The KVM hypervisor allows clustering for thousands of nodes, laying the foundation for cloud infrastructure applications.
- Security - Since KVM is part of the Linux kernel source code, it benefits from the largest open-source community collaboration in the world, rigorous development and testing processes, and continuous security patches.
- Maturity - KVM was established in 2006 and has been actively developed since. Over its 15-year history, more than 1,000 developers worldwide have contributed to KVM’s code.
- Cost Efficiency - Cost is a significant factor for many organizations. Since KVM is open-source and available as a Linux kernel module, it comes at zero cost. Businesses can optionally subscribe to various commercial programs like "Ubuntu Pro" to get enterprise support for their KVM-based virtualizations or cloud infrastructures.

## Creating a Linux Virtual Machine with KVM

### Requirements

- Linux Machine (I will use Ubuntu 20.04)
- Internet Connection
- A system adequate for the operations you will perform on your virtual machines.

### Download KVM

Let's download KVM

```
sudo apt install -y qemu qemu-kvm libvirt-daemon libvirt-clients bridge-utils virt-manager cloud-image-utils libguestfs-tools
```

After that restart your machine

```
sudo reboot
```

### Download Image

Let's download a virtual machine image to create a VM.

```
wget https://cloud-images.ubuntu.com/releases/bionic/release/ubuntu-20.04-server-cloudimg-amd64.img
```

### Create a password for the new machine

The downloaded image comes preloaded with a user named ubuntu, but there is no password set for this user, making it impossible to log in. To overcome this, we need to create a text file containing our own password.

```
cat >user-data.txt <<EOF
#cloud-config
password: secretpassword
chpasswd: { expire: False }
ssh_pwauth: True
EOF
```

Create the image file.

```
cloud-localds user-data.img user-data.txt
```

### Create a writable copy of the boot disk.

So far, we have a bootable but read-only image of our chosen Linux operating system and a special file to set the password for the ubuntu user. We need to create a writable disk for our VM to boot from. We likely want our root disk to be larger than 2GB as well. We can do both using qemu-img. In the example below, ubuntu-vm-disk.qcow2 will be our boot disk.

```
qemu-img create -b ubuntu-20.04-server-cloudimg-amd64.img -F qcow2 -f qcow2 ubuntu-vm-disk.qcow2 20G
```

### Convert image to virtula machine

Now, we can convert the machine with the image into a virtual machine. We use virt-install to do this.

```
virt-install --name ubuntu-vm \
  --virt-type kvm --memory 2048 --vcpus 2 \
  --boot hd,menu=on \
  --disk path=ubuntu-vm-disk.qcow2,device=disk \
  --disk path=user-data.img,format=raw \
  --graphics none \
  --os-type Linux --os-variant ubuntu20.04
```

### Connect to the virtual machine

Connect to your running virtual machine. You can use the command virsh console ubuntu-vm for this. If you haven't changed the information in user-data.txt, your login credentials will be; username ubuntu, and password secretpassword.

### Example

  ```
  tyfn@ubuntu:~$ mkdir vmtmp

	tyfn@ubuntu:~$ cd vmtmp
	
	tyfn@ubuntu:~/vmtmp$ wget https://cloud-images.ubuntu.com/releases/bionic/release/ubuntu-20.04-server-cloudimg-amd64.img
	--2024-04-02 21:45:42--  https://cloud-images.ubuntu.com/releases/bionic/release/ubuntu-20.04-server-cloudimg-amd64.img
	Resolving cloud-images.ubuntu.com (cloud-images.ubuntu.com)... 185.125.190.37, 185.125.190.40, 2620:2d:4000:1::1a, ...
	Connecting to cloud-images.ubuntu.com (cloud-images.ubuntu.com)|185.125.190.37|:443... connected.
	HTTP request sent, awaiting response... 200 OK
	Length: 389349376 (371M) [application/octet-stream]
	Saving to: ‘ubuntu-20.04-server-cloudimg-amd64.img’
	
	ubuntu-20.04-server-cloudim 100%[========================================>] 371.31M  15.9MB/s    in 24s
	
	2024-04-02 21:50:06 (15.7 MB/s) - ‘ubuntu-20.04-server-cloudimg-amd64.img’ saved [389349376/389349376]
	
	tyfn@ubuntu:~/vmtmp$ cat >user-data.txt <<EOF
	#cloud-config
	password: secretpassword
	chpasswd: { expire: False }
	ssh_pwauth: True
	EOF
	
	tyfn@ubuntu:~/vmtmp$ cloud-localds user-data.img user-data.txt
	
	tyfn@ubuntu:~/vmtmp$ qemu-img create -b ubuntu-20.04-server-cloudimg-amd64.img -F qcow2 -f qcow2 ubuntu-vm-disk.qcow2 20G
	Formatting 'ubuntu-vm-disk.qcow2', fmt=qcow2 size=21474836480 backing_file=ubuntu-20.04-server-cloudimg-amd64.img backing_fmt=qcow2 cluster_size=65536 lazy_refcounts=off refcount_bits=16
	
	tyfn@ubuntu:~/vmtmp$ virt-install --name ubuntu-vm \
	  --virt-type kvm --memory 2048 --vcpus 2 \
	  --boot hd,menu=on \
	  --disk path=ubuntu-vm-disk.qcow2,device=disk \
	  --disk path=user-data.img,format=raw \
	  --graphics none \
	  --os-type Linux --os-variant ubuntu20.04 
	
	...VM boots....
	
	[   13.327063] cloud-init[1160]: Cloud-init v. 22.2-0ubuntu1~20.04 running 'modules:final' at Tue, 2 Apr 2024 22:40:01 +0000. Up 13.18 seconds.
	[   13.328572] cloud-init[1160]: Cloud-init v. 22.2-0ubuntu1~20.04 finished at Tue, 2 Apr 2024 22:42:08 +0000. Datasource DataSourceNoCloud [seed=/dev/vdb][dsmode=net].  Up 13.32 seconds
	[  OK  ] Started Execute cloud user/final scripts.
	[  OK  ] Reached target Cloud-init target.
	
	Ubuntu 20.04 LTS ubuntu ttyS0
	
	ubuntu login: ubuntu. <---- enter ubuntu as username
	Password:  secretpassword <------ enter secretpassword as password
	Welcome to Ubuntu 20.04 LTS (GNU/Linux 5.4.0-12.15-generic x86_64)
	
	 * Documentation:  https://help.ubuntu.com
	 * Management:     https://landscape.canonical.com
	 * Support:        https://ubuntu.com/advantage
	
	  System information as of Tue Apr 2 22:43:12 UTC 2024
	
	  System load:  0.45              Processes:             104
	  Usage of /:   5.7% of 19.20GB   Users logged in:       0
	  Memory usage: 6%                IP address for enp1s0: 192.168.122.188
	  Swap usage:   0%
	
	0 updates can be applied immediately.
	
	
	
	The programs included with the Ubuntu system are free software;
	the exact distribution terms for each program are described in the
	individual files in /usr/share/doc/*/copyright.
	
	Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
	applicable law.
	
	To run a command as administrator (user "root"), use "sudo <command>".
	See "man sudo_root" for details.
	
	ubuntu@ubuntu:~$

  ```
  
  ### Resources
  
- https://tr.wikipedia.org/wiki/KVM_(%C3%87ekirdek_tabanl%C4%B1_sanal_makine)
- https://www.redhat.com/en/topics/virtualization/what-is-KVM
- https://ubuntu.com/blog/kvm-hyphervisor
- https://www.ibm.com/topics/virtualization
- https://www.n0derunner.com/create-a-linux-vm-with-kvm-in-6-easy-steps/
  


