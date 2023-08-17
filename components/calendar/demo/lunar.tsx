import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import React from 'react';
import type { CellRenderInfo } from 'rc-picker/lib/interface';
import lunisolar from 'lunisolar';
import zhCn from 'lunisolar/locale/zh-cn';
import { createStyles } from 'antd-style';
import classNames from 'classnames';
import { Calendar, Col, Radio, Row, Select } from 'antd';
import type { CalendarMode } from 'antd/es/calendar/generateCalendar';

lunisolar.locale(zhCn);

const useStyle = createStyles(({ token, css, cx }) => {
  const lunar = css`
    color: ${token.colorTextTertiary};
    font-size: ${token.fontSizeSM}px;
  `;
  return {
    wrapper: css`
          width: 40vw;
          border: 1px solid ${token.colorBorderSecondary};
          border-radius: ${token.borderRadiusLG};
          padding: 5px;
        `,
    dateCell: css`
          position: relative;
          &:before {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
            max-width: 40px;
            max-height: 40px;
            background: transparent;
            transition: background 300ms;
            border-radius: ${token.borderRadiusXS}px;
          }
          &:hover:before {
            background: rgba(0, 0, 0, 0.04);
          }
        `,
    text: css`
          position: relative;
          z-index: 1;
      `,
    lunar,
    current: css`
            color: ${token.colorTextLightSolid};
            &:before {
              background: ${token.colorPrimary};
            }
            &:hover:before {
              background: ${token.colorPrimary};
              opacity: .8;
            }
            .${cx(lunar)} {
              color: ${token.colorTextLightSolid};
              opacity: .9;
            }
          `,
    monthCell: css`
          width: 120px;
          color: ${token.colorTextBase};
          border-radius: ${token.borderRadiusXS}px;
          padding: 5px 0;
          &:hover {
            background: rgba(0, 0, 0, 0.04);
          }
        `,
    monthCellCurrent: css`
          color: ${token.colorTextLightSolid};
          background: ${token.colorPrimary};
          &:hover {
            background: ${token.colorPrimary};
            opacity: .8;
          }
        `,
  };
});

const App: React.FC = () => {
  const { styles } = useStyle();

  const [selectDate, setSelectDate] = React.useState<Dayjs>(dayjs());

  const onPanelChange = (value: Dayjs, mode: CalendarMode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
    setSelectDate(value);
  };

  const cellRender = (date: Dayjs, info: CellRenderInfo<Dayjs>) => {
    const d = lunisolar(date.toDate());
    const lunar = d.lunar.getDayName();
    const solarTerm = d.solarTerm?.name;
    if (info.type === 'date') {
      return (
        <div
          className={classNames(styles.dateCell, {
            [styles.current]: date.isSame(dayjs(), 'date'),
          })}
        >
          <div className={styles.text}>
            {date.get('date')}
            {info.type === 'date' && <div className={styles.lunar}>{solarTerm || lunar}</div>}
          </div>
        </div>
      );
    }

    if (info.type === 'month') {
      // Due to the fact that a solar month is part of the lunar month X and part of the lunar month X+1,
      // when rendering a month, always take X as the lunar month of the month
      const d2 = lunisolar(new Date(date.get('year'), date.get('month')));
      const month = d2.lunar.getMonthName();
      return (
        <div
          className={classNames(styles.monthCell, {
            [styles.monthCellCurrent]: selectDate.isSame(date, 'month'),
          })}
        >
          {date.get('month') + 1}月（{month}）
        </div>
      );
    }
  };

  const getYearLabel = (year: number) => {
    const d = lunisolar(new Date(year + 1, 0));
    return `${year}年（${d.format('cYcZ年')}）`;
  };

  const getMonthLabel = (month: number, value: Dayjs) => {
    const d = lunisolar(new Date(value.year(), month));
    const lunar = d.lunar.getMonthName();
    return `${month + 1}月（${lunar}）`;
  };

  return (
    <div className={styles.wrapper}>
      <Calendar
        fullCellRender={cellRender}
        fullscreen={false}
        onPanelChange={onPanelChange}
        headerRender={({ value, type, onChange, onTypeChange }) => {
          const start = 0;
          const end = 12;
          const monthOptions = [];

          let current = value.clone();
          const localeData = value.localeData();
          const months = [];
          for (let i = 0; i < 12; i++) {
            current = current.month(i);
            months.push(localeData.monthsShort(current));
          }

          for (let i = start; i < end; i++) {
            monthOptions.push(
              <Select.Option key={i} value={i} className="month-item">
                {getMonthLabel(i, value)}
              </Select.Option>,
            );
          }

          const year = value.year();
          const month = value.month();
          const options = [];
          for (let i = year - 10; i < year + 10; i += 1) {
            options.push(
              <Select.Option key={i} value={i} className="year-item">
                {getYearLabel(i)}
              </Select.Option>,
            );
          }
          return (
            <Row gutter={8} style={{ padding: '10px' }}>
              <Col>
                <Select
                  size="small"
                  dropdownMatchSelectWidth={false}
                  className="my-year-select"
                  value={year}
                  onChange={(newYear) => {
                    const now = value.clone().year(newYear);
                    onChange(now);
                  }}
                >
                  {options}
                </Select>
              </Col>
              <Col>
                <Select
                  size="small"
                  dropdownMatchSelectWidth={false}
                  value={month}
                  onChange={(newMonth) => {
                    const now = value.clone().month(newMonth);
                    onChange(now);
                  }}
                >
                  {monthOptions}
                </Select>
              </Col>
              <Col>
                <Radio.Group
                  size="small"
                  onChange={(e) => onTypeChange(e.target.value)}
                  value={type}
                >
                  <Radio.Button value="month">月</Radio.Button>
                  <Radio.Button value="year">年</Radio.Button>
                </Radio.Group>
              </Col>
            </Row>
          );
        }}
      />
    </div>
  );
};

export default App;
