import * as React from 'react';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import DownloadOutlined from '@ant-design/icons/DownloadOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import classNames from 'classnames';
import CSSMotion from 'rc-motion';

import { ConfigContext } from '../../config-provider';
import Progress from '../../progress';
import Tooltip from '../../tooltip';
import type {
  ItemRender,
  UploadFile,
  UploadListProgressProps,
  UploadListType,
  UploadLocale,
} from '../interface';

export interface ListItemProps {
  prefixCls: string;
  className?: string;
  style?: React.CSSProperties;
  locale: UploadLocale;
  file: UploadFile;
  items: UploadFile[];
  listType?: UploadListType;
  isImgUrl?: (file: UploadFile) => boolean;
  showRemoveIcon?: boolean | ((file: UploadFile) => boolean);
  showDownloadIcon?: boolean | ((file: UploadFile) => boolean);
  showPreviewIcon?: boolean | ((file: UploadFile) => boolean);
  removeIcon?: React.ReactNode | ((file: UploadFile) => React.ReactNode);
  downloadIcon?: React.ReactNode | ((file: UploadFile) => React.ReactNode);
  previewIcon?: React.ReactNode | ((file: UploadFile) => React.ReactNode);
  extra?: React.ReactNode | ((file: UploadFile) => React.ReactNode);
  iconRender: (file: UploadFile) => React.ReactNode;
  actionIconRender: (
    customIcon: React.ReactNode,
    callback: () => void,
    prefixCls: string,
    title?: string,
    acceptUploadDisabled?: boolean,
  ) => React.ReactNode;
  itemRender?: ItemRender;
  onPreview: (file: UploadFile, e: React.SyntheticEvent<HTMLElement>) => void;
  onClose: (file: UploadFile) => void;
  onDownload: (file: UploadFile) => void;
  progress?: UploadListProgressProps;
}

const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
  (
    {
      prefixCls,
      className,
      style,
      locale,
      listType,
      file,
      items,
      progress: progressProps,
      iconRender,
      actionIconRender,
      itemRender,
      isImgUrl,
      showPreviewIcon,
      showRemoveIcon,
      showDownloadIcon,
      previewIcon: customPreviewIcon,
      removeIcon: customRemoveIcon,
      downloadIcon: customDownloadIcon,
      extra: customExtra,
      onPreview,
      onDownload,
      onClose,
    },
    ref,
  ) => {
    // Status: which will ignore `removed` status
    const { status } = file;
    const [mergedStatus, setMergedStatus] = React.useState(status);
    React.useEffect(() => {
      if (status !== 'removed') {
        setMergedStatus(status);
      }
    }, [status]);

    // Delay to show the progress bar
    const [showProgress, setShowProgress] = React.useState(false);
    React.useEffect(() => {
      const timer = setTimeout(() => {
        setShowProgress(true);
      }, 300);
      return () => {
        clearTimeout(timer);
      };
    }, []);

    const iconNode = iconRender(file);
    let icon = <div className={`${prefixCls}-icon`}>{iconNode}</div>;
    if (listType === 'picture' || listType === 'picture-card' || listType === 'picture-circle') {
      if (mergedStatus === 'uploading' || (!file.thumbUrl && !file.url)) {
        const uploadingClassName = classNames(`${prefixCls}-list-item-thumbnail`, {
          [`${prefixCls}-list-item-file`]: mergedStatus !== 'uploading',
        });
        icon = <div className={uploadingClassName}>{iconNode}</div>;
      } else {
        const thumbnail = isImgUrl?.(file) ? (
          <img
            src={file.thumbUrl || file.url}
            alt={file.name}
            className={`${prefixCls}-list-item-image`}
            crossOrigin={file.crossOrigin}
          />
        ) : (
          iconNode
        );
        const aClassName = classNames(`${prefixCls}-list-item-thumbnail`, {
          [`${prefixCls}-list-item-file`]: isImgUrl && !isImgUrl(file),
        });
        icon = (
          <a
            className={aClassName}
            onClick={(e) => onPreview(file, e)}
            href={file.url || file.thumbUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {thumbnail}
          </a>
        );
      }
    }

    const listItemClassName = classNames(
      `${prefixCls}-list-item`,
      `${prefixCls}-list-item-${mergedStatus}`,
    );
    const linkProps =
      typeof file.linkProps === 'string' ? JSON.parse(file.linkProps) : file.linkProps;

    const removeIcon = (
      typeof showRemoveIcon === 'function'
        ? showRemoveIcon(file)
        : showRemoveIcon
    )
      ? actionIconRender(
          (typeof customRemoveIcon === 'function' ? customRemoveIcon(file) : customRemoveIcon) || (
            <DeleteOutlined />
          ),
          () => onClose(file),
          prefixCls,
          locale.removeFile,
          // acceptUploadDisabled is true, only remove icon will follow Upload disabled prop
          // https://github.com/ant-design/ant-design/issues/46171
          true,
        )
      : null;

    const downloadIcon =
      (typeof showDownloadIcon === 'function' ? showDownloadIcon(file) : showDownloadIcon) &&
      mergedStatus === 'done'
        ? actionIconRender(
            (typeof customDownloadIcon === 'function'
              ? customDownloadIcon(file)
              : customDownloadIcon) || <DownloadOutlined />,
            () => onDownload(file),
            prefixCls,
            locale.downloadFile,
            // acceptUploadDisabled is true, hope download icon will follow Upload disabled prop
            true,
          )
        : null;
    const downloadOrDelete = listType !== 'picture-card' && listType !== 'picture-circle' && (
      <span
        key="download-delete"
        className={classNames(`${prefixCls}-list-item-actions`, {
          picture: listType === 'picture',
        })}
      >
        {downloadIcon}
        {removeIcon}
      </span>
    );

    const extraContent = typeof customExtra === 'function' ? customExtra(file) : customExtra;
    const extra = extraContent && (
      <span className={`${prefixCls}-list-item-extra`}>{extraContent}</span>
    );

    const listItemNameClass = classNames(`${prefixCls}-list-item-name`);
    const fileName = file.url ? (
      <a
        key="view"
        target="_blank"
        rel="noopener noreferrer"
        className={listItemNameClass}
        title={file.name}
        {...linkProps}
        href={file.url}
        onClick={(e) => onPreview(file, e)}
      >
        {file.name}
        {extra}
      </a>
    ) : (
      <span
        key="view"
        className={listItemNameClass}
        onClick={(e) => onPreview(file, e)}
        title={file.name}
      >
        {file.name}
        {extra}
      </span>
    );

    const previewIcon =
      (typeof showPreviewIcon === 'function' ? showPreviewIcon(file) : showPreviewIcon) &&
      (file.url || file.thumbUrl) ? (
        <a
          href={file.url || file.thumbUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => onPreview(file, e)}
          title={locale.previewFile}
        >
          {typeof customPreviewIcon === 'function'
            ? customPreviewIcon(file)
            : customPreviewIcon || <EyeOutlined />}
        </a>
      ) : null;

    const pictureCardActions = (listType === 'picture-card' || listType === 'picture-circle') &&
      mergedStatus !== 'uploading' && (
        <span className={`${prefixCls}-list-item-actions`}>
          {previewIcon}
          {mergedStatus === 'done' && downloadIcon}
          {removeIcon}
        </span>
      );

    const { getPrefixCls } = React.useContext(ConfigContext);
    const rootPrefixCls = getPrefixCls();

    const dom = (
      <div className={listItemClassName}>
        {icon}
        {fileName}
        {downloadOrDelete}
        {pictureCardActions}
        {showProgress && (
          <CSSMotion
            motionName={`${rootPrefixCls}-fade`}
            visible={mergedStatus === 'uploading'}
            motionDeadline={2000}
          >
            {({ className: motionClassName }) => {
              // show loading icon if upload progress listener is disabled
              const loadingProgress =
                'percent' in file ? (
                  <Progress
                    {...progressProps}
                    type="line"
                    percent={file.percent}
                    aria-label={file['aria-label']}
                    aria-labelledby={file['aria-labelledby']}
                  />
                ) : null;

              return (
                <div className={classNames(`${prefixCls}-list-item-progress`, motionClassName)}>
                  {loadingProgress}
                </div>
              );
            }}
          </CSSMotion>
        )}
      </div>
    );

    const message =
      file.response && typeof file.response === 'string'
        ? file.response
        : file.error?.statusText || file.error?.message || locale.uploadError;
    const item =
      mergedStatus === 'error' ? (
        <Tooltip title={message} getPopupContainer={(node) => node.parentNode as HTMLElement}>
          {dom}
        </Tooltip>
      ) : (
        dom
      );

    return (
      <div
        className={classNames(`${prefixCls}-list-item-container`, className)}
        style={style}
        ref={ref}
      >
        {itemRender
          ? itemRender(item, file, items, {
              download: onDownload.bind(null, file),
              preview: onPreview.bind(null, file) as any,
              remove: onClose.bind(null, file),
            })
          : item}
      </div>
    );
  },
);

export default ListItem;
