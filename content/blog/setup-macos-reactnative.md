---
title: "How to Set Up React Native Enviroment"
description: "How to set up react native enviroment for MacOS"
dateString: Aug 2024
draft: true
tags: ["Javascript", "React Native"]
weight: 101
---

# How to set up react native enviroment for macos

## Instruction

In this guide, you'll learn how to set up your environment, so that you can run your project with Android Studio and Xcode. This will allow you to develop with Android emulators and iOS simulators, build your app locally, and more. (biraz değiştir)

#### Installing Homebrew

Open your terminal and paste this command

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

This command will install Homebrew package manager for your mac if its not installed.

#### Install Dependencies

After the installation of the homebrew paste this commands to your terminal.

```
brew install node
brew install watchman
```

## IOS Part

#### Install Xcode
Open App Store and search & install Xcode from there. After that you will also need to install Xcode Command line tools. Open Xcode, then choose Settings... (or Preferences...) from the Xcode menu. Go to the Locations panel and install the tools by selecting the most recent version in the Command Line Tools dropdown.

#### Installing an iOS Simulator in Xcode

To install a simulator, open Xcode > Settings... (or Preferences...) and select the Platforms (or Components) tab. Select a simulator with the corresponding version of iOS you wish to use.

If you are using Xcode version 14.0 or greater than to install a simulator, open Xcode > Settings > Platforms tab, then click "+" icon and select iOS… option.

#### Installing CocoaPods

Paste this command to your terminal
```
sudo gem install cocoapods
```

If you encounter any error in this step visit this url "https://guides.cocoapods.org/using/troubleshooting#installing-cocoapods"

## Android Part

### Java Development Kit installation

Install JDK by pasting this to your terminal emulator.

```
brew install --cask zulu@17
```

After the JDK installation, you need to add or update your JAVA_HOME environment variable in ~/.zshrc (or in ~/.bash_profile).

```
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```

### Install Android Studio

[Download Android Studio by going to this link](https://developer.android.com/studio?hl=tr). While on Android Studio installation wizard, make sure the boxes next to all of the following items are 
- Android SDK
- Android SDK Platform
- Android Virtual Device

Then, click "Next" to install all of these components.

