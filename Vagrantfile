# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.provider "virtualbox" do |vb|
    # The 'npm install' requires alot of memory, especially for flex-sdk.
    vb.memory = 2048
  end

  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y nodejs-legacy npm git default-jre
    npm install -g grunt-cli
    gem install sass
  SHELL
end

