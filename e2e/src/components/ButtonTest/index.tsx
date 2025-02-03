import {useState} from 'react';
import { Button, FloatButton } from 'antd';
import Wrapper from '../Wrapper';
import './button.css';

export default function ButtonTest() {
  const [name, setName] = useState('');

  const clickHandler = () => {
    setName('Clicked');
  }

  return (
    <Wrapper name='Button Components'>
      <div className='button-wrapper'>
        <Button danger loading={name === 'Clicked'} onClick={clickHandler}>Danger Button</Button>
        <Button loading={true}>Loading Button</Button>
        <Button type="primary">Primary Button</Button>
        <Button shape="circle">Circle C</Button>
        <FloatButton tooltip={<div>Float Button</div>} description='FloatBtn' />
        <span className='button-result'>{name}</span>
        <span className='float-button-result'>{name}</span>
      </div>
    </Wrapper>
  )
}
