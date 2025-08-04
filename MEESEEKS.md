# Quick Development
```
make api-run
# another terminal
cd ./web

export NODE_OPTIONS=--openssl-legacy-provider
export SERVE_URL_DEV=http://localhost:9000
yarn install
yarn start
```
# Build with customized title
```
export DASHBOARD_TITLE=APISIX-Mule && export FOOTER_INFO="VIP-192.168.6.6" && make quick
```