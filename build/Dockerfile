FROM tensorflow/tensorflow

RUN apt-get update && apt-get install -y git wget
ARG DATASET_REPO
ARG ALGO_REPO
ARG ALGO_VERSION
EXPOSE 3000
RUN git clone ${ALGO_REPO} /work/ && echo {$ALGO_VERSION}
RUN mkdir /work/datasets && cd /work/datasets 
RUN wget  ${DATASET_REPO}.json
RUN ls -l /work/scripts/main.py
RUN python3 -V
CMD ["python","/work/scripts/main.py"  ]
