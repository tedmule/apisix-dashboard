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
import { Form, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { UploadFile } from 'antd/lib/upload/interface';
import React, { useState } from 'react';
import { useIntl } from 'umi';

import CertificateForm from '@/pages/SSL/components/CertificateForm';
import type { UploadType } from '@/pages/SSL/components/CertificateUploader';
import CertificateUploader from '@/pages/SSL/components/CertificateUploader';
import { SSLModule } from '../../typing'

type CreateType = 'Upload' | 'Input';

type Props = {
  form: FormInstance;
};

const Step: React.FC<Props> = ({ form }) => {
  console.log('Step1 form values: ', form.getFieldsValue());

  const [publicKeyList, setPublicKeyList] = useState<UploadFile[]>([]);
  const [privateKeyList, setPrivateKeyList] = useState<UploadFile[]>([]);
  const [caCertList, setCaCertList] = useState<UploadFile[]>([]);
  const [createType, setCreateType] = useState<CreateType>('Upload');

  const { formatMessage } = useIntl();

  const onRemove = (type: UploadType) => {
    if (type === 'PUBLIC_KEY') {
      form.setFieldsValue({
        cert: '',
        sni: '',
        expireTime: undefined,
      });
      setPublicKeyList([]);
    } else if (type === 'PRIVATE_KEY') {
      form.setFieldsValue({ key: '' });
      setPrivateKeyList([]);
    } else {
      form.setFieldsValue({ ca: '' })
      setCaCertList([]);
    }
  };

  const handleSuccess = ({
    cert,
    key,
    ca,
    ...rest
  }: Partial<SSLModule.UploadPrivateSuccessData & SSLModule.UploadPublicSuccessData & SSLModule.UploadCaSuccessData>) => {
    console.log('------rest')
    console.log(rest);
    if (cert) {
      setPublicKeyList(rest.publicKeyList!);
      form.setFieldsValue({ cert });
    } else if (key) {
      form.setFieldsValue({ key });
      setPrivateKeyList(rest.privateKeyList!);
    } else {
      setCaCertList(rest.caList!)
      form.setFieldsValue({ ca })
    }

    // // Handle mtls and enablemTLS
    // if (mtls !== undefined) {
    //   form.setFieldsValue({ mtls });
    // }
    // if (enablemTLS !== undefined) {
    //   form.setFieldsValue({ enablemTLS });
    // }
  };
  return (
    <>
      <Form.Item label={formatMessage({ id: 'page.ssl.form.itemLabel.way' })} required>
        <Select
          placeholder={formatMessage({ id: 'page.ssl.select.placeholder.selectCreateWays' })}
          defaultValue="Upload"
          onChange={(value: CreateType) => {
            form.setFieldsValue({
              key: '',
              cert: '',
              ca: '',
              sni: '',
              expireTime: undefined,
            });
            setCreateType(value);
          }}
          style={{ width: 100 }}
        >
          <Select.Option value="Input">
            {formatMessage({ id: 'page.ssl.selectOption.input' })}
          </Select.Option>
          <Select.Option value="Upload">{formatMessage({ id: 'page.ssl.upload' })}</Select.Option>
        </Select>
      </Form.Item>
      <div style={createType === 'Input' ? {} : { display: 'none' }}>
        <CertificateForm mode="EDIT" form={form} />
      </div>
      {Boolean(createType === 'Upload') && (
        <CertificateUploader
          onSuccess={handleSuccess}
          onRemove={onRemove}
          data={{ publicKeyList, privateKeyList, caCertList }}
        />
      )}
    </>
  );
};
export default Step;
