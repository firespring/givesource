FROM public.ecr.aws/lambda/nodejs:16

# Set up lambda/work dir
WORKDIR ${LAMBDA_TASK_ROOT}

# Upgrade to npm v9
RUN npm install -g npm@9

# Configure root creds for node and composer
ARG GITHUB_OAUTH_TOKEN
RUN echo "machine github.com login ${GITHUB_OAUTH_TOKEN}" > ~/.netrc

# Install git for loading the firespring code standards module from github
RUN yum install -y git \
  && yum clean all \
  && rm -rf /var/cache/yum

# install dependencies
COPY package.json package-lock.json .
RUN npm install --include=dev

# copy function code
COPY . .

# set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "app.handler" ]
