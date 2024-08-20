ARG BASE_REPO=300448126090.dkr.ecr.us-east-1.amazonaws.com/firespring/base
ARG SRC_TAG=bookworm
FROM ${BASE_REPO}:${SRC_TAG}

# Install the latest version of node and clean up
RUN apt-get update \
  && apt-get install -y curl \
  && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
  && apt-get install -y git nodejs \
  && apt-get clean \
  && rm -rf /tmp/* /var/tmp/* /var/lib/apt/lists/*

# Set up lambda/work dir
WORKDIR /usr/src/app

# Install git for loading the firespring code standards module from github
RUN apt-get update \
  && apt-get install -y git vim \
  && apt-get clean \
  && rm -rf /tmp/* /var/tmp/* /var/lib/apt/lists/*

# Install base dependencies
COPY .env.example package.json package-lock.json .
RUN  npm --include=dev install

# Install cloudformation dependencies
COPY packages/cloudformation/package.json packages/cloudformation/package-lock.json packages/cloudformation/
RUN  npm --prefix packages/cloudformation/ --include=dev install

# Install lambda dependencies
COPY packages/lambda/package.json packages/lambda/package-lock.json packages/lambda/
RUN  npm --prefix packages/lambda/ --include=dev install

# Install frontend dependencies
COPY packages/frontend/package.json packages/frontend/package-lock.json packages/frontend/
RUN  npm --prefix packages/frontend/ --include=dev install

# Copy function code
COPY . .

# Just loop endlessly so this container is available to connect to
CMD ["bash", "-c", "while [ true ]; do sleep 60; done;"]
