FROM node:latest

RUN apt-get update \
    && apt-get install -y x11vnc xvfb fluxbox wget wmctrl unzip \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /etc/apt/keyrings \
    && wget -q -O /etc/apt/keyrings/google-chrome.asc https://dl.google.com/linux/linux_signing_key.pub \
    && echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/google-chrome.asc] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list

RUN apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -f /etc/apt/sources.list.d/google-chrome.list \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/* \
    && sed -i 's/"$HERE\/chrome"/"$HERE\/chrome" --no-sandbox/g' /opt/google/chrome/google-chrome

WORKDIR /home/wdio/

COPY package*.json ./

RUN npm install \
    && mkdir -p /home/wdio/node_modules/chromedriver/lib/chromedriver \
    && ln -sf /home/wdio/node_modules/chromedriver/bin/chromedriver /home/wdio/node_modules/chromedriver/lib/chromedriver/chromedriver

COPY . .

CMD ["npm", "run", "wdio"]