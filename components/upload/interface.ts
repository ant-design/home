import type * as React from 'react';
import type {
  RcFile as OriRcFile,
  UploadRequestOption as RcCustomRequestOptions,
  UploadProps as RcUploadProps,
} from 'rc-upload/lib/interface';

import type { ProgressAriaProps, ProgressProps } from '../progress';

export interface RcFile extends OriRcFile {
  readonly lastModifiedDate: Date;
}

export type UploadFileStatus = 'error' | 'done' | 'uploading' | 'removed';

export interface HttpRequestHeader {
  [key: string]: string;
}

export interface UploadFile<T = any> extends ProgressAriaProps {
  uid: string;
  size?: number;
  name: string;
  fileName?: string;
  lastModified?: number;
  lastModifiedDate?: Date;
  url?: string;
  status?: UploadFileStatus;
  percent?: number;
  thumbUrl?: string;
  crossOrigin?: React.ImgHTMLAttributes<HTMLImageElement>['crossOrigin'];
  originFileObj?: RcFile;
  response?: T;
  error?: any;
  linkProps?: any;
  type?: string;
  xhr?: T;
  preview?: string;
  metadata?: any;
}

export interface InternalUploadFile<T = any> extends UploadFile<T> {
  originFileObj: RcFile;
}

export interface UploadChangeParam<T = UploadFile> {
  // https://github.com/ant-design/ant-design/issues/14420
  file: T;
  fileList: T[];
  event?: { percent: number };
}

export interface ShowUploadListInterface<T = any> {
  extra?: React.ReactNode | ((file: UploadFile<T>) => React.ReactNode);
  showRemoveIcon?: boolean | ((file: UploadFile<T>) => boolean);
  showPreviewIcon?: boolean | ((file: UploadFile<T>) => boolean);
  showDownloadIcon?: boolean | ((file: UploadFile<T>) => boolean);
  removeIcon?: React.ReactNode | ((file: UploadFile<T>) => React.ReactNode);
  downloadIcon?: React.ReactNode | ((file: UploadFile<T>) => React.ReactNode);
  previewIcon?: React.ReactNode | ((file: UploadFile<T>) => React.ReactNode);
}

export interface UploadLocale {
  uploading?: string;
  removeFile?: string;
  downloadFile?: string;
  uploadError?: string;
  previewFile?: string;
}

export type UploadType = 'drag' | 'select';
export type UploadListType = 'text' | 'picture' | 'picture-card' | 'picture-circle';
export type UploadListProgressProps = Omit<ProgressProps, 'percent' | 'type'>;

export type ItemRender<T = any> = (
  originNode: React.ReactElement,
  file: UploadFile<T>,
  fileList: Array<UploadFile<T>>,
  actions: {
    download: () => void;
    preview: () => void;
    remove: () => void;
  },
) => React.ReactNode;

type PreviewFileHandler = (file: File | Blob) => PromiseLike<string>;
type TransformFileHandler = (
  file: RcFile,
) => string | Blob | File | PromiseLike<string | Blob | File>;
type BeforeUploadValueType = void | boolean | string | Blob | File;

export interface UploadProps<T = any> extends Pick<RcUploadProps, 'capture' | 'hasControlInside'> {
  type?: UploadType;
  name?: string;
  defaultFileList?: Array<UploadFile<T>>;
  fileList?: Array<UploadFile<T>>;
  action?: string | ((file: RcFile) => string) | ((file: RcFile) => PromiseLike<string>);
  directory?: boolean;
  data?:
    | Record<string, unknown>
    | ((file: UploadFile<T>) => Record<string, unknown> | Promise<Record<string, unknown>>);
  method?: 'POST' | 'PUT' | 'PATCH' | 'post' | 'put' | 'patch';
  headers?: HttpRequestHeader;
  showUploadList?: boolean | ShowUploadListInterface;
  multiple?: boolean;
  accept?: string;
  beforeUpload?: (
    file: RcFile,
    fileList: RcFile[],
  ) => BeforeUploadValueType | Promise<BeforeUploadValueType>;
  onChange?: (info: UploadChangeParam<UploadFile<T>>) => void;
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  listType?: UploadListType;
  className?: string;
  rootClassName?: string;
  onPreview?: (file: UploadFile<T>) => void;
  onDownload?: (file: UploadFile<T>) => void;
  onRemove?: (file: UploadFile<T>) => void | boolean | Promise<void | boolean>;
  supportServerRender?: boolean;
  style?: React.CSSProperties;
  disabled?: boolean;
  prefixCls?: string;
  customRequest?: (options: RcCustomRequestOptions<T>) => void;
  withCredentials?: boolean;
  openFileDialogOnClick?: boolean;
  locale?: UploadLocale;
  id?: string;
  previewFile?: PreviewFileHandler;
  /** @deprecated Please use `beforeUpload` directly */
  transformFile?: TransformFileHandler;
  iconRender?: (file: UploadFile<T>, listType?: UploadListType) => React.ReactNode;
  isImageUrl?: (file: UploadFile<T>) => boolean;
  progress?: UploadListProgressProps;
  itemRender?: ItemRender<T>;
  /** Config max count of `fileList`. Will replace current one when `maxCount` is 1 */
  maxCount?: number;
  children?: React.ReactNode;
}

export interface UploadState<T = any> {
  fileList: UploadFile<T>[];
  dragState: string;
}

export interface UploadListProps<T = any> {
  listType?: UploadListType;
  onPreview?: (file: UploadFile<T>) => void;
  onDownload?: (file: UploadFile<T>) => void;
  onRemove?: (file: UploadFile<T>) => void | boolean;
  items?: Array<UploadFile<T>>;
  progress?: UploadListProgressProps;
  prefixCls?: string;
  className?: string;
  showRemoveIcon?: boolean | ((file: UploadFile<T>) => boolean);
  showDownloadIcon?: boolean | ((file: UploadFile<T>) => boolean);
  showPreviewIcon?: boolean | ((file: UploadFile<T>) => boolean);
  removeIcon?: React.ReactNode | ((file: UploadFile<T>) => React.ReactNode);
  downloadIcon?: React.ReactNode | ((file: UploadFile<T>) => React.ReactNode);
  previewIcon?: React.ReactNode | ((file: UploadFile<T>) => React.ReactNode);
  extra?: React.ReactNode | ((file: UploadFile<T>) => React.ReactNode);
  locale: UploadLocale;
  previewFile?: PreviewFileHandler;
  iconRender?: (file: UploadFile<T>, listType?: UploadListType) => React.ReactNode;
  isImageUrl?: (file: UploadFile<T>) => boolean;
  appendAction?: React.ReactNode;
  appendActionVisible?: boolean;
  itemRender?: ItemRender<T>;
  /**
   * @internal Only the internal remove button is provided for use
   */
  disabled?: boolean;
}
