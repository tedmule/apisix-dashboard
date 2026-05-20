#!/usr/bin/env bash

TAG=$(git describe --tags --dirty --always)

export DASHBOARD_TITLE=西信APISIX-内部 && export FOOTER_INFO="VIP:10.254.4.130, 10.254.4.131/132" && make quick
SOURCE_IMAGE_NAME="apisix-dashboard:${TAG}"
TARGET_IMAGE_NAME="harbor.hexinpass.com/apache/apisix-dashboard:${TAG}-xx-internal"
docker tag ${SOURCE_IMAGE_NAME}  ${TARGET_IMAGE_NAME}
docker push ${TARGET_IMAGE_NAME}

export DASHBOARD_TITLE=西信APISIX-公网 && export FOOTER_INFO="VIP:10.254.4.133, 10.254.4.134/135" && make quick
SOURCE_IMAGE_NAME="apisix-dashboard:${TAG}"
TARGET_IMAGE_NAME="harbor.hexinpass.com/apache/apisix-dashboard:${TAG}-xx-internet"
docker tag ${SOURCE_IMAGE_NAME}  ${TARGET_IMAGE_NAME}
docker push ${TARGET_IMAGE_NAME}

export DASHBOARD_TITLE=二枢APISIX-内部 && export FOOTER_INFO="VIP:10.254.4.136, 10.254.4.137/138" && make quick
SOURCE_IMAGE_NAME="apisix-dashboard:${TAG}"
TARGET_IMAGE_NAME="harbor.hexinpass.com/apache/apisix-dashboard:${TAG}-2s-internal"
docker tag ${SOURCE_IMAGE_NAME}  ${TARGET_IMAGE_NAME}
docker push ${TARGET_IMAGE_NAME}

export DASHBOARD_TITLE=二枢APISIX-公网 && export FOOTER_INFO="VIP:10.0.102.102, 10.0.102.6/66" && make quick
SOURCE_IMAGE_NAME="apisix-dashboard:${TAG}"
TARGET_IMAGE_NAME="harbor.hexinpass.com/apache/apisix-dashboard:${TAG}-2s-internet"
docker tag ${SOURCE_IMAGE_NAME}  ${TARGET_IMAGE_NAME}
docker push ${TARGET_IMAGE_NAME}

export DASHBOARD_TITLE=明宇测试 && export FOOTER_INFO="明宇测试环境" && make quick
SOURCE_IMAGE_NAME="apisix-dashboard:${TAG}"
TARGET_IMAGE_NAME="harbor.hexinpass.com/apache/apisix-dashboard:${TAG}-my"
docker tag ${SOURCE_IMAGE_NAME}  ${TARGET_IMAGE_NAME}
docker push ${TARGET_IMAGE_NAME}
