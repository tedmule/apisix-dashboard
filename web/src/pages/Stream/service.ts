/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { identity, pickBy } from 'lodash';
import { request } from 'umi';

import { transformLabelList } from '@/helpers';

import { transformStreamData, transformStepData, transformUpstreamNodes } from './transform';

export const create = (data: StreamModule.RequestData, mode?: StreamModule.RequestMode) =>
  request(`/stream_routes`, {
    method: 'POST',
    data: mode === 'RawData' ? data : transformStepData(data),
  });

export const update = (
  sid: string,
  data: StreamModule.RequestData,
  mode?: StreamModule.RequestMode,
) =>
  request(`/stream_routes/${sid}`, {
    method: 'PUT',
    data: mode === 'RawData' ? data : transformStepData(data),
  });

export const fetchItem = (sid: number) =>
  request(`/stream_routes/${sid}`).then((data) => transformStreamData(data.data));

export const fetchList = ({ current = 1, pageSize = 10, ...res }) => {
  const { server_addr = '', server_port = '', id = '', desc = '' } = res;

  return request<Res<ResListData<StreamModule.ResponseBody>>>('/stream_routes', {
    params: {
      server_addr,
      server_port,
      page: current,
      page_size: pageSize,
      desc,
      id,
    },
  }).then(({ data }) => {
    return {
      data: data.rows,
      total: data.total_size,
    };
  });
};

export const remove = (sid: string[]) => request(`/stream_routes/${sid}`, { method: 'DELETE' });

export const checkUniqueName = (name = '', exclude = '') =>
  request('/notexist/routes', {
    params: pickBy(
      {
        name,
        exclude,
      },
      identity,
    ),
  });

export const fetchUpstreamItem = (sid: string) => {
  return request(`/upstreams/${sid}`).then(({ nodes, timeout, id }) => {
    return {
      upstreamHostList: transformUpstreamNodes(nodes),
      timeout,
      upstream_id: id,
    };
  });
};

export const checkHostWithSSL = (hosts: string[]) =>
  request('/check_ssl_exists', {
    method: 'POST',
    data: { hosts },
  });

export const fetchLabelList = () =>
  request('/labels/route').then(({ data }) => transformLabelList(data.rows) as LabelList);

export const updateRouteStatus = (sid: string, status: StreamModule.RouteStatus) =>
  request(`/streams/${sid}`, {
    method: 'PATCH',
    data: { status },
  });

export const debugRoute = (headers: any, data: StreamModule.debugRequest) => {
  return request('/debug-request-forwarding', {
    method: 'post',
    data,
    headers,
  });
};

export const fetchServiceList = () =>
  request('/services').then(({ data }) => ({
    data: data.rows,
    total: data.total_size,
  }));

export const importRoutes = (formData: FormData) => {
  return request('/import/routes', {
    method: 'POST',
    data: formData,
    requestType: 'form',
  });
};
