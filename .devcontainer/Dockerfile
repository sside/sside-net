FROM node:22-bookworm

RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
    && echo "$SNIPPET" >> "/root/.bashrc"

RUN apt update \
    && apt install --yes --no-install-recommends \
        bash-completion

RUN echo 'source /etc/bash_completion' >> "/root/.bashrc"

CMD ["/bin/bash"]
