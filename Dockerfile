FROM node:latest
RUN apt-get update && apt-get install -y unzip
ADD https://github.com/CookingQuest/koa/archive/master.zip /repo/repo.zip
WORKDIR /repo
RUN unzip repo.zip
WORKDIR /repo/koa-master  
RUN yarn && yarn run build
RUN mv /repo/koa-master/dist /dist && rm -rf /repo
CMD ["NODE_ENV=prod", "node", "/dist/index.js"]