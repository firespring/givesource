FROM public.ecr.aws/lambda/nodejs:14

# Set up lambda/work dir
WORKDIR ${LAMBDA_TASK_ROOT}

# Install git for loading the firespring code standards module from github
RUN yum install -y git vim \
  && yum clean all \
  && rm -rf /var/cache/yum

# install dependencies
COPY packages/lambda/package.json packages/lambda/package-lock.json .
RUN npm install --include=dev

# copy function code
COPY packages/lambda .
COPY .env .base_env
COPY config base_config
COPY package.json base_package.json

# set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "app.handler" ]

## Override the entrypoint and command since we won't be running this as a lambda
#ENTRYPOINT ["bash"]
#CMD ["-c", "while [ true ]; do sleep 60; done;"]
