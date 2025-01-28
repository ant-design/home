import React from 'react';
import { Col, ConfigProvider, Flex, Row, Tag, theme, Typography } from 'antd';
import { createStyles, css } from 'antd-style';
import classnames from 'classnames';

const MARK_BORDER_SIZE = 2;

const useStyle = createStyles(({ token }, markPos: [number, number, number, number]) => ({
  container: css`
    position: relative;
  `,
  colWrap: css`
    border-right: 1px solid ${token.colorBorderSecondary};
    display: flex;
    justify-content: center;
    align-items: center;
    padding: ${token.paddingMD}px;
    overflow: hidden;
  `,
  listWrap: css`
    display: flex;
    flex-direction: column;
    list-style: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
  `,
  listItem: css`
    cursor: pointer;
    padding: ${token.paddingSM}px;
    transition: background-color ${token.motionDurationFast} ease;
    &:hover {
      background-color: ${token.controlItemBgHover};
    }
    &:not(:first-of-type) {
      border-top: 1px solid ${token.colorBorderSecondary};
    }
  `,
  marker: css`
    position: absolute;
    border: ${MARK_BORDER_SIZE}px solid ${token.colorWarning};
    box-sizing: border-box;
    z-index: 999999;
    box-shadow: 0 0 0 1px #fff;
    pointer-events: none;
    inset-inline-start: ${markPos[0] - MARK_BORDER_SIZE}px;
    top: ${markPos[1] - MARK_BORDER_SIZE}px;
    width: ${markPos[2] + MARK_BORDER_SIZE * 2}px;
    height: ${markPos[3] + MARK_BORDER_SIZE * 2}px;
  `,
  markerActive: css`
    opacity: 1;
  `,
  markerNotActive: css`
    opacity: 0;
  `,
  markerMotion: css`
    transition:
      opacity ${token.motionDurationSlow} ease,
      all ${token.motionDurationSlow} ease;
  `,
  markerNotMotion: css`
    transition: opacity ${token.motionDurationSlow} ease;
  `,
}));

export interface SemanticPreviewProps {
  semantics: { name: string; desc: string; version?: string }[];
  children: React.ReactElement<any>;
  height?: number;
  component?: string;
}

const SemanticPreview: React.FC<SemanticPreviewProps> = (props) => {
  const { semantics = [], children, height, component } = props;
  const { token } = theme.useToken();

  // ======================= Semantic =======================
  const getMarkClassName = React.useCallback(
    (semanticKey: string) => `semantic-mark-${semanticKey}`,
    [],
  );
  const getComponentClassName = React.useCallback(
    (semanticKey: string) => (semanticKey === 'root' ? component : `${component}-${semanticKey}`),
    [],
  );

  const semanticClassNames = React.useMemo<Record<string, string>>(() => {
    const classNames: Record<string, string> = {};

    semantics.forEach((semantic) => {
      classNames[semantic.name] = getMarkClassName(semantic.name);
    });

    return classNames;
  }, [semantics]);

  const cloneNode = React.cloneElement(children, {
    classNames: semanticClassNames,
  });

  // ======================== Hover =========================
  const containerRef = React.useRef<HTMLDivElement>(null);

  const timerRef = React.useRef<ReturnType<typeof setTimeout>>(null);

  const [positionMotion, setPositionMotion] = React.useState<boolean>(false);
  const [hoverSemantic, setHoverSemantic] = React.useState<string | null>(null);
  const [markPos, setMarkPos] = React.useState<[number, number, number, number]>([0, 0, 0, 0]);

  const { styles } = useStyle(markPos);

  React.useEffect(() => {
    if (hoverSemantic) {
      const targetClassName = component
        ? getComponentClassName(hoverSemantic)
        : getMarkClassName(hoverSemantic);
      const targetElement = containerRef.current?.querySelector<HTMLElement>(`.${targetClassName}`);
      const containerRect = containerRef.current?.getBoundingClientRect();
      const targetRect = targetElement?.getBoundingClientRect();

      setMarkPos([
        (targetRect?.left || 0) - (containerRect?.left || 0),
        (targetRect?.top || 0) - (containerRect?.top || 0),
        targetRect?.width || 0,
        targetRect?.height || 0,
      ]);

      timerRef.current = setTimeout(() => {
        setPositionMotion(true);
      }, 10);
    } else {
      timerRef.current = setTimeout(() => {
        setPositionMotion(false);
      }, 500);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [hoverSemantic]);

  // ======================== Render ========================
  return (
    <div className={classnames(styles.container)} ref={containerRef}>
      <Row style={{ minHeight: height }}>
        <Col span={16} className={classnames(styles.colWrap)}>
          <ConfigProvider theme={{ token: { motion: false } }}>{cloneNode}</ConfigProvider>
        </Col>
        <Col span={8}>
          <ul className={classnames(styles.listWrap)}>
            {semantics.map<React.ReactNode>((semantic) => (
              <li
                key={semantic.name}
                className={classnames(styles.listItem)}
                onMouseEnter={() => setHoverSemantic(semantic.name)}
                onMouseLeave={() => setHoverSemantic(null)}
              >
                <Flex vertical gap="small">
                  <Flex gap="small" align="center">
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      {semantic.name}
                    </Typography.Title>
                    {semantic.version && <Tag color="blue">{semantic.version}</Tag>}
                  </Flex>
                  <Typography.Paragraph style={{ margin: 0, fontSize: token.fontSizeSM }}>
                    {semantic.desc}
                  </Typography.Paragraph>
                </Flex>
              </li>
            ))}
          </ul>
        </Col>
      </Row>
      <div
        className={classnames(
          styles.marker,
          hoverSemantic ? styles.markerActive : styles.markerNotActive,
          positionMotion ? styles.markerMotion : styles.markerNotMotion,
        )}
      />
    </div>
  );
};

export default SemanticPreview;
