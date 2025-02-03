import { Col, Descriptions, Row } from 'antd';
import ButtonTest from './components/ButtonTest';
import ViewsComs from './components/ViewsComs';
import Wrapper, { Item } from './components/Wrapper';
import BreadcrumbCom from './components/Breadcrumb';
import DropdownCom from './components/DropdownCom';
import MenuCom from './components/MenuCom';
import StepsCom from './components/StepsCom';
import PaginationCom from './components/PaginationCom';
import CascaderCom from './components/CascaderCom';
import CheckboxCom from './components/CheckboxCom';
import DatePickerCom from './components/DatePickerCom';
import InputCom from './components/InputCom';
import RateCom from './components/RateCom';
import FormCom from './components/FormCom';
import SelectCom from './components/SelectCom';
import BadgeCom from './components/BadgeCom';
import CalendarCom from './components/CalendarCom';
import DescriptionsCom from './components/DescriptionsCom';
import StatisticCom from './components/StatisticCom';
import TagCom from './components/TagCom';
import TimelineCom from './components/TimelineCom';



import './App.css';

function App() {
  return (
    <div className="App">

<Wrapper name='View Data'>
        <Row>
          <Col span={15}>
            <Item title='integrated  Form and Menu'>
              <Row>
                <Col span={10}>
                  <MenuCom></MenuCom>
                </Col>
                <Col span={14}>
                  <FormCom></FormCom>
                </Col>
              </Row>
            </Item>
          </Col>

          <Col span={9}>
            <Item title='Calendar'>
              <CalendarCom></CalendarCom>
            </Item>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <Item title='Descriptions'>
              <DescriptionsCom></DescriptionsCom>
            </Item>
          </Col>

          <Col span={12}>
            <Item title='Statistic'>
              <StatisticCom></StatisticCom>
            </Item>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <Item title='Tag'>
              <TagCom></TagCom>
            </Item>
          </Col>

          <Col span={12}>
            <Item title='Timeline'>
              <TimelineCom></TimelineCom>
            </Item>
          </Col>
        </Row>




      </Wrapper>




      <Wrapper name='导航类'>
        <Item title='Menu'>
          <MenuCom></MenuCom>
        </Item>
        <Item title='Dropdown'>
          <DropdownCom />
        </Item>
        <Item title='Steps'>
          <StepsCom />
        </Item>
        <Item title='Pagination'>
          <PaginationCom />
        </Item>
        <Item title='Breadcrumb'>
          <BreadcrumbCom />
        </Item>
      </Wrapper>

      <Wrapper name='Input Data类'>
        <Item title='Cascader'>
          <CascaderCom />
        </Item>
        <Row>
          <Col span={12}>
            <Item title='Checkbox'>
              <CheckboxCom />
            </Item>
          </Col>
          <Col span={12}>
            <Item title='DatePicker'>
              <DatePickerCom />
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item title='Input'>
              <InputCom />
            </Item>
          </Col>
          <Col span={12}>
            <Item title='Rate'>
              <RateCom />
            </Item>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <Item title='Form'>
              <FormCom></FormCom>
            </Item>
          </Col>
          <Col span={12}>
            <Item title='Select'>
              <SelectCom></SelectCom>
            </Item>
          </Col>
        </Row>
      </Wrapper>

    



      <ButtonTest></ButtonTest>
      <ViewsComs></ViewsComs>
    </div>
  );
}

export default App;
