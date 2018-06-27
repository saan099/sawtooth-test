FROM ubuntu:xenial

RUN echo "deb http://repo.sawtooth.me/ubuntu/ci xenial universe" >> /etc/apt/sources.list \
 && apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 8AA7AF1F1091A5FD \
 && apt-get update

RUN apt-get install -y -q --allow-downgrades \
    git \
    python3 \
    python3-stdeb

RUN apt-get install -y -q --allow-downgrades \
    python3-grpcio \
    python3-grpcio-tools \
    python3-protobuf

RUN apt-get install -y -q --allow-downgrades \
    python3-cbor \
    python3-colorlog \
    python3-toml \
    python3-yaml \
    python3-zmq

RUN mkdir -p /var/log/sawtooth

WORKDIR /project

ENTRYPOINT [ "python3","main.py" ]


