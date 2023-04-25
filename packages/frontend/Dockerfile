FROM public.ecr.aws/lambda/nodejs:16

# Set up lambda/work dir
WORKDIR ${LAMBDA_TASK_ROOT}

# Upgrade to npm v9
RUN npm install -g npm@9

# Install git for loading the firespring code standards module from github
RUN yum install -y git vim \
  && yum clean all \
  && rm -rf /var/cache/yum

# install dependencies
COPY package.json package-lock.json .
RUN npm install --include=dev

# copy function code
COPY . .

# Override the entrypoint and command since we won't be running this as a lambda
ENTRYPOINT ["bash"]
CMD ["-c", "while [ true ]; do sleep 60; done;"]
