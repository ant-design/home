import React, { useState } from 'react';
import type { CountdownProps } from 'antd';
import { Button, Col, Row, Statistic } from 'antd';

const { Countdown } = Statistic;

const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30; // Dayjs is also OK

const onFinish: CountdownProps['onFinish'] = () => {
  console.log('finished!');
};

const onChange: CountdownProps['onChange'] = (val) => {
  if (typeof val === 'number' && 4.95 * 1000 < val && val < 5 * 1000) {
    console.log('changed!');
  }
};

const App: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Countdown title="Countdown" value={deadline} onFinish={onFinish} isPaused={isPaused} />
      </Col>
      <Col span={12}>
        <Countdown title="Million Seconds" value={deadline} format="HH:mm:ss:SSS" />
      </Col>
      <Col span={12}>
        <Countdown title="Day Level" value={deadline} format="D 天 H 时 m 分 s 秒" />
      </Col>
      <Col span={12}>
        <Countdown
          title="Countdown with Start / Pause"
          value={deadline}
          onFinish={onFinish}
          isPaused={isPaused}
        />
        <Button type="primary" onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? 'Start' : 'Pause'}
        </Button>
      </Col>
      <Col span={12}>
        <Countdown title="Countdown" value={Date.now() + 10 * 1000} onChange={onChange} />
      </Col>
    </Row>
  );
};

export default App;
