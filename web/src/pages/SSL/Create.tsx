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
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Steps } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { history, useIntl } from 'umi';

import ActionBar from '@/components/ActionBar';
import Step1 from '@/pages/SSL/components/Step1';
import Step2 from '@/pages/SSL/components/Step2';
import { create, update, verifyKeyPaire } from '@/pages/SSL/service';
import styles from '@/pages/SSL/style.less';

const Page: React.FC = (props) => {
  const [step, setStep] = useState(1);
  const [form] = Form.useForm();
  const { id } = (props as any).match.params;
  const { formatMessage } = useIntl();

  const onValidateForm = () => {
    let keyPaire = { cert: '', key: '' };
    form
      .validateFields()
      .then((value) => {
        keyPaire = { cert: value.cert, key: value.key };
        return verifyKeyPaire(value.cert, value.key);
      })
      .then(({ data }) => {
        // prefer manually entered snis (from the upload UI) when present
        const manual = form.getFieldValue('manual_snis_values');
        const currentSnis = Array.isArray(manual) && manual.length > 0 ? manual : form.getFieldValue('snis');
        form.setFieldsValue({
          ...form.getFieldsValue(true),
          ...keyPaire,
          snis: (Array.isArray(currentSnis) && currentSnis.length > 0) ? currentSnis : data.snis,
          // mtls: data.mtls,
          expireTime: moment.unix(Number(data.validity_end)).format('YYYY-MM-DD HH:mm:ss'),
        });
        setStep(2);
      });
  };

  const [submitLoading, setSubmitLoading] = useState(false);

  const submit = () => {
    setSubmitLoading(true);
    const data = form.getFieldsValue();
    const sslProtocols = form.getFieldValue('ssl_protocols') || data.ssl_protocols;

    let sslData: any = {
      cert: data.cert!,
      key: data.key!,
    };
    if (Array.isArray(sslProtocols) && sslProtocols.length > 0) {
      sslData.ssl_protocols = sslProtocols;
    }
    // prefer manual snis if provided
    const manual = form.getFieldValue('manual_snis_values');
    const snisSource = Array.isArray(manual) && manual.length > 0 ? manual : data.snis;
    const snisArr: string[] = Array.isArray(snisSource)
      ? snisSource
      : snisSource
      ? String(snisSource)
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      : [];

    if (data.enablemTLS) {
      sslData = {
        ...sslData,
        client: {
          ca: data.ca,
          depth: 2,
        },
        snis: [data.mtls],
      };
    } else {
      sslData = {
        ...sslData,
        snis: snisArr,
      };
    }

    (id ? update(id, sslData) : create(sslData))
      .then(() => {
        history.replace('/ssl/list');
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  const handleStepChange = (nextStep: number) => {
    switch (nextStep) {
      case 1:
        setStep(nextStep);
        break;
      case 2:
        onValidateForm();
        break;
      case 3:
        submit();
        break;
      default:
        break;
    }
  };

  return (
    <>
      <PageHeaderWrapper
        title={`${(props as any).match.params.id
          ? formatMessage({ id: 'component.global.edit' })
          : formatMessage({ id: 'component.global.create' })
          }${formatMessage({ id: 'menu.ssl' })}`}
      >
        <Card bordered={false}>
          <Steps current={step - 1} className={styles.steps}>
            {[
              formatMessage({ id: 'page.ssl.steps.stepTitle.completeCertInfo' }),
              formatMessage({ id: 'component.global.steps.stepTitle.preview' }),
            ].map((item) => (
              <Steps.Step title={item} key={item} />
            ))}
          </Steps>
          {Boolean(step === 1) && <Step1 form={form} />}
          {Boolean(step === 2) && <Step2 form={form} />}
        </Card>
      </PageHeaderWrapper>
      <ActionBar loading={submitLoading} step={step} lastStep={2} onChange={handleStepChange} />
    </>
  );
};

export default Page;
