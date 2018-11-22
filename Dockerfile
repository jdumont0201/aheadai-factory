FROM node:10
EXPOSE 3030

RUN mkdir /work
COPY package.json /work/package.json
WORKDIR /work
RUN npm install
COPY / /work
RUN ls 
CMD ["npm","start"]