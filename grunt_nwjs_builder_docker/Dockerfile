FROM debian
MAINTAINER leknoppix

RUN DEBIAN_FRONTEND=noninteractive apt-get update

RUN apt-get upgrade -y

RUN apt-get install -y \
	nodejs nodejs-legacy npm \
	git \
	wget \
	curl

RUN npm update npm

RUN npm cache clean -f

RUN npm install -g n

RUN n stable

RUN npm install -g grunt

WORKDIR /var/nodejs