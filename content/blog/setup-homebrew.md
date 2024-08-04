---
title: "How to install and use Homebrew"
description: "Homebrew installation and usage explained"
dateString: Aug 2024
draft: false
tags: ["macos", "Linux"]
weight: 99
---

# What is Homebrew?

![](https://raw.githubusercontent.com/tyfnacici/tyfnacici/main/static/blog/setup-homebrew/homebrew.png)

Homebrew is a powerful package manager for macOS or Linux that makes installing and managing software a breeze. Whether you’re a developer, a power user, or someone just looking to simplify their macOS experience, Homebrew is an essential tool. In this guide, I'll walk you through the straightforward steps to install Homebrew on your macOS device.

## Installation

### Open terminal

Open spotlight by pressing "Cmd + Space" and type "Terminal"

### Paste installation script

Paste this line to your terminal. 

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

This command downloads and runs the Homebrew installation script. You will be prompted to enter your password (the same one you use to log into your macOS account). Type your password and press Enter. The installation process will begin.

### Verify the installation

After the installation is complete, you should verify that Homebrew is installed correctly. Run the following command in Terminal:

```
brew --version
```

## Usage

### Install your first package

Now that Homebrew is installed, you can start installing software packages. For example, to install the popular system information tool neofetch, you can use the following command:

```
brew install neofetch
```

### Searching for Packages
If you're unsure of the exact name of a package, you can search for it. For example, to search for Node.js, you can run:

```
brew search node
```

### List installed Packages
To see a list of all the packages you have installed via Homebrew, use:

```
brew list
```

### Uninstall Packages

If you want to uninstall the package that we downloaded, you can use:

```
brew uninstall neofetch
```

### Resources
  
- https://brew.sh/
  

