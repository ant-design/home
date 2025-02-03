import React from 'react';

import type { UploadFile, UploadProps } from '..';
import Upload from '..';
import { act, fireEvent, render, waitFakeTimer, waitFor } from '../../../tests/utils';
import type { FormInstance } from '../../form';
import Form from '../../form';
import type { UploadListProps, UploadLocale } from '../interface';
import UploadList from '../UploadList';
import { previewImage } from '../utils';
import { setup, teardown } from './mock';
import { errorRequest, successRequest } from './requests';

const fileList: UploadProps['fileList'] = [
  {
    uid: '-1',
    name: 'xxx.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
  },
  {
    uid: '-2',
    name: 'yyy.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
];

describe('Upload List', () => {
  // Mock for rc-util raf
  window.requestAnimationFrame = (callback) => window.setTimeout(callback, 16);
  window.cancelAnimationFrame = (id) => window.clearTimeout(id);

  // jsdom not support `createObjectURL` yet. Let's handle this.
  const originCreateObjectURL = window.URL.createObjectURL;
  window.URL.createObjectURL = jest.fn(() => '');
  const originRevokeObjectURL = window.URL.revokeObjectURL;
  window.URL.revokeObjectURL = jest.fn(() => '');

  // Mock dom
  let size = { width: 0, height: 0 };
  function setSize(width: number, height: number) {
    size = { width, height };
  }
  const mockWidthGet = jest.spyOn(Image.prototype, 'width', 'get');
  const mockHeightGet = jest.spyOn(Image.prototype, 'height', 'get');
  const mockSrcSet = jest.spyOn(Image.prototype, 'src', 'set');

  let drawImageCallback: jest.Mock | null = null;
  function hookDrawImageCall(callback: jest.Mock) {
    drawImageCallback = callback;
  }
  const mockGetCanvasContext = jest.spyOn(HTMLCanvasElement.prototype, 'getContext');
  const mockToDataURL = jest.spyOn(HTMLCanvasElement.prototype, 'toDataURL');

  // HTMLCanvasElement.prototype

  beforeEach(() => {
    jest.useFakeTimers();
    return setup();
  });
  afterEach(() => {
    teardown();
    drawImageCallback = null;
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  let open: jest.MockInstance<any, any[]>;
  beforeAll(() => {
    open = jest.spyOn(window, 'open').mockImplementation(() => null);
    mockWidthGet.mockImplementation(() => size.width);
    mockHeightGet.mockImplementation(() => size.height);
    mockSrcSet.mockImplementation(function fn() {
      // @ts-ignore
      this.onload?.();
    });

    mockGetCanvasContext.mockReturnValue({
      drawImage(...args) {
        if (drawImageCallback) {
          drawImageCallback(...args);
        }
      },
    } as RenderingContext);
    mockToDataURL.mockReturnValue('data:image/png;base64,');
  });

  afterAll(() => {
    window.URL.createObjectURL = originCreateObjectURL;
    window.URL.revokeObjectURL = originRevokeObjectURL;
    mockWidthGet.mockRestore();
    mockHeightGet.mockRestore();
    mockSrcSet.mockRestore();
    mockGetCanvasContext.mockRestore();
    mockToDataURL.mockRestore();
    open.mockRestore();
  });

  // https://github.com/ant-design/ant-design/issues/4653
  it('should use file.thumbUrl for <img /> in priority', () => {
    const { container: wrapper, unmount } = render(
      <Upload defaultFileList={fileList} listType="picture">
        <button type="button">upload</button>
      </Upload>,
    );
    fileList.forEach((file, i) => {
      const linkNode = wrapper.querySelectorAll('.ant-upload-list-item-thumbnail')[i];
      const imgNode = wrapper.querySelectorAll('.ant-upload-list-item-thumbnail img')[i];
      expect(linkNode.getAttribute('href')).toBe(file.url);
      expect(imgNode.getAttribute('src')).toBe(file.thumbUrl);
    });
    unmount();
  });

  // https://github.com/ant-design/ant-design/issues/7269
  it('should remove correct item when uid is 0', async () => {
    const list = [
      {
        uid: '0',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
      },
      {
        uid: '1',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
      },
    ];
    const { container, unmount } = render(
      <Upload defaultFileList={list as UploadProps['defaultFileList']}>
        <button type="button">upload</button>
      </Upload>,
    );
    expect(container.querySelectorAll('.ant-upload-list-item').length).toBe(2);
    fireEvent.click(
      container.querySelectorAll('.ant-upload-list-item')[0].querySelector('.anticon-delete')!,
    );

    // Upload use Promise to wait remove action. Let's wait this also.
    await waitFakeTimer();

    // Progress motion to done
    // React 17 will reach deadline, so we need check if already done
    if (container.querySelector('.ant-upload-animate-leave-active')) {
      fireEvent.animationEnd(container.querySelector('.ant-upload-animate-leave-active')!);
    }

    await waitFakeTimer();

    expect(container.querySelectorAll('.ant-upload-list-item-container')).toHaveLength(1);

    unmount();
  });

  it('should be uploading when upload a file', async () => {
    const done = jest.fn();
    // biome-ignore lint/style/useConst: test only
    let wrapper: ReturnType<typeof render>;
    let latestFileList: UploadFile<any>[] | null = null;
    const onChange: UploadProps['onChange'] = async ({ file, fileList: eventFileList }) => {
      expect(eventFileList === latestFileList).toBeFalsy();
      if (file.status === 'uploading') {
        await Promise.resolve();
        expect(wrapper.container.firstChild).toMatchSnapshot();
      }
      if (file.status === 'done') {
        done();
      }

      latestFileList = eventFileList;
    };
    wrapper = render(
      <Upload
        action="http://jsonplaceholder.typicode.com/posts/"
        onChange={onChange}
        customRequest={successRequest}
      >
        <button type="button">upload</button>
      </Upload>,
    );
    fireEvent.change(wrapper.container.querySelector('input')!, {
      target: { files: [{ name: 'foo.png' }] },
    });
    await waitFakeTimer();

    expect(done).toHaveBeenCalled();

    wrapper.unmount();
  });

  it('handle error', async () => {
    const onChange = jest.fn();

    const {
      container: wrapper,
      unmount,
      baseElement,
    } = render(
      <Upload
        action="http://jsonplaceholder.typicode.com/posts/"
        onChange={onChange}
        customRequest={errorRequest}
      >
        <button type="button">upload</button>
      </Upload>,
    );
    fireEvent.change(wrapper.querySelector('input')!, {
      target: { files: [{ name: 'foo.png' }] },
    });

    await waitFakeTimer();

    // Wait twice since `errorRequest` also use timeout for mock

    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        file: expect.objectContaining({ status: 'error' }),
      }),
    );
    if (wrapper.querySelector('.ant-upload-animate-appear-active')) {
      fireEvent.animationEnd(wrapper.querySelector('.ant-upload-animate-appear-active')!);
    }

    await waitFakeTimer();
    expect(wrapper.firstChild).toMatchSnapshot();

    // Error message
    fireEvent.mouseEnter(wrapper.querySelector('.ant-upload-list-item')!);

    await waitFakeTimer();
    expect(baseElement.querySelector('.ant-tooltip')).not.toHaveClass('.ant-tooltip-hidden');

    unmount();
  });

  it('does concat fileList when beforeUpload returns false', async () => {
    const handleChange = jest.fn();
    const ref = React.createRef<any>();
    const { container: wrapper, unmount } = render(
      <Upload
        ref={ref}
        listType="picture"
        defaultFileList={fileList}
        onChange={handleChange}
        beforeUpload={() => false}
      >
        <button type="button">upload</button>
      </Upload>,
    );
    fireEvent.change(wrapper.querySelector('input')!, {
      target: { files: [{ name: 'foo.png' }] },
    });

    await waitFakeTimer();

    expect(ref.current.fileList.length).toBe(fileList.length + 1);
    expect(handleChange.mock.calls[0][0].fileList).toHaveLength(3);

    unmount();
  });

  it('In the case of listType=picture, the error status does not show the download.', () => {
    (global as any).testName =
      'In the case of listType=picture, the error status does not show the download.';
    const file = { status: 'error', uid: 'file' };
    const { container: wrapper, unmount } = render(
      <Upload
        listType="picture"
        fileList={[file] as UploadProps['fileList']}
        showUploadList={{ showDownloadIcon: true }}
      >
        <button type="button">upload</button>
      </Upload>,
    );

    // Has error item className
    fireEvent.mouseEnter(wrapper.querySelector('.ant-upload-list-item-error')!);

    expect(wrapper.querySelectorAll('div.ant-upload-list-item i.anticon-download').length).toBe(0);

    unmount();
  });

  it('In the case of listType=picture-card, the error status does not show the download.', () => {
    (global as any).testName =
      'In the case of listType=picture-card, the error status does not show the download.';
    const file = { status: 'error', uid: 'file' };
    const { container: wrapper, unmount } = render(
      <Upload
        listType="picture-card"
        fileList={[file] as UploadProps['fileList']}
        showUploadList={{ showDownloadIcon: true }}
      >
        <button type="button">upload</button>
      </Upload>,
    );
    expect(wrapper.querySelectorAll('div.ant-upload-list-item i.anticon-download').length).toBe(0);

    unmount();
  });

  it('In the case of listType=text, the error status does not show the download.', () => {
    const file = { status: 'error', uid: 'file' };
    const { container: wrapper, unmount } = render(
      <Upload
        listType="text"
        fileList={[file] as UploadProps['fileList']}
        showUploadList={{ showDownloadIcon: true }}
      >
        <button type="button">upload</button>
      </Upload>,
    );
    expect(wrapper.querySelectorAll('div.ant-upload-list-item i.anticon-download').length).toBe(0);

    unmount();
  });

  it('should support onPreview', () => {
    const handlePreview = jest.fn();
    const { container: wrapper, unmount } = render(
      <Upload listType="picture-card" defaultFileList={fileList} onPreview={handlePreview}>
        <button type="button">upload</button>
      </Upload>,
    );
    fireEvent.click(wrapper.querySelectorAll('.anticon-eye')[0]);
    expect(handlePreview).toHaveBeenCalledWith(fileList[0]);
    fireEvent.click(wrapper.querySelectorAll('.anticon-eye')[1]);
    expect(handlePreview).toHaveBeenCalledWith(fileList[1]);

    unmount();
  });

  it('should support onRemove', async () => {
    const handleRemove = jest.fn();
    const handleChange = jest.fn();
    const { container: wrapper, unmount } = render(
      <Upload
        listType="picture-card"
        defaultFileList={fileList}
        onRemove={handleRemove}
        onChange={handleChange}
      >
        <button type="button">upload</button>
      </Upload>,
    );
    fireEvent.click(wrapper.querySelectorAll('.anticon-delete')[0]);
    expect(handleRemove).toHaveBeenCalledWith(fileList[0]);
    fireEvent.click(wrapper.querySelectorAll('.anticon-delete')[1]);
    expect(handleRemove).toHaveBeenCalledWith(fileList[1]);
    await waitFakeTimer();
    expect(handleChange).toHaveBeenCalledTimes(2);

    unmount();
  });

  it('should support onDownload', async () => {
    const handleDownload = jest.fn();
    const { container: wrapper, unmount } = render(
      <Upload
        listType="picture-card"
        defaultFileList={[
          {
            uid: '0',
            name: 'xxx.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          },
        ]}
        onDownload={handleDownload}
        showUploadList={{
          showDownloadIcon: true,
        }}
      >
        <button type="button">upload</button>
      </Upload>,
    );
    fireEvent.click(wrapper.querySelectorAll('.anticon-download')[0]);
    expect(handleDownload).toHaveBeenCalled();

    unmount();
  });

  it('should support no onDownload', async () => {
    const { container: wrapper, unmount } = render(
      <Upload
        listType="picture-card"
        defaultFileList={[
          {
            uid: '0',
            name: 'xxx.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          },
        ]}
        showUploadList={{
          showDownloadIcon: true,
        }}
      >
        <button type="button">upload</button>
      </Upload>,
    );
    fireEvent.click(wrapper.querySelectorAll('.anticon-download')[0]);

    unmount();
  });

  describe('should generate thumbUrl from file', () => {
    [
      { width: 100, height: 200, name: 'height large than width' },
      { width: 200, height: 100, name: 'width large than height' },
    ].forEach(({ width, height, name }) => {
      it(name, async () => {
        setSize(width, height);
        const onDrawImage = jest.fn();
        hookDrawImageCall(onDrawImage);

        const handlePreview = jest.fn();
        const newFileList: UploadProps['fileList'] = [...fileList];
        const newFile = {
          ...fileList[0],
          uid: '-3',
          originFileObj: new File([], 'xxx.png', { type: 'image/png' }),
        };
        delete newFile.thumbUrl;
        newFileList.push(newFile as UploadFile);
        const ref = React.createRef<any>();
        const { unmount } = render(
          <Upload
            ref={ref}
            listType="picture-card"
            defaultFileList={newFileList}
            onPreview={handlePreview}
          >
            <button type="button">upload</button>
          </Upload>,
        );
        await waitFakeTimer();

        expect(ref.current.fileList[2].thumbUrl).not.toBe(undefined);
        expect(onDrawImage).toHaveBeenCalled();

        // Offset check
        const [, offsetX, offsetY] = onDrawImage.mock.calls[0];
        expect((width > height ? offsetX : offsetY) === 0).toBeTruthy();
        unmount();
      });
    });
  });

  it('should non-image format file preview', () => {
    const list = [
      {
        name: 'not-image',
        status: 'done',
        uid: '-3',
        url: 'https://cdn.xxx.com/aaa.zip',
        thumbUrl: 'data:application/zip;base64,UEsDBAoAAAAAADYZYkwAAAAAAAAAAAAAAAAdAAk',
        originFileObj: new File([], 'aaa.zip'),
      },
      {
        name: 'image',
        status: 'done',
        uid: '-4',
        url: 'https://cdn.xxx.com/aaa',
      },
      {
        name: 'not-image',
        status: 'done',
        uid: '-5',
        url: 'https://cdn.xxx.com/aaa.xx',
      },
      {
        name: 'not-image',
        status: 'done',
        uid: '-6',
        url: 'https://cdn.xxx.com/aaa.png/xx.xx',
      },
      {
        name: 'image',
        status: 'done',
        uid: '-7',
        url: 'https://cdn.xxx.com/xx.xx/aaa.png',
      },
      {
        name: 'image',
        status: 'done',
        uid: '-8',
        url: 'https://cdn.xxx.com/xx.xx/aaa.png',
        thumbUrl: 'data:image/png;base64,UEsDBAoAAAAAADYZYkwAAAAAAAAAAAAAAAAdAAk',
      },
      {
        name: 'image',
        status: 'done',
        uid: '-9',
        url: 'https://cdn.xxx.com/xx.xx/aaa.png?query=123',
      },
      {
        name: 'image',
        status: 'done',
        uid: '-10',
        url: 'https://cdn.xxx.com/xx.xx/aaa.png#anchor',
      },
      {
        name: 'image',
        status: 'done',
        uid: '-11',
        url: 'https://cdn.xxx.com/xx.xx/aaa.png?query=some.query.with.dot',
      },
      {
        name: 'image',
        status: 'done',
        uid: '-12',
        url: 'https://publish-pic-cpu.baidu.com/1296beb3-50d9-4276-885f-52645cbb378e.jpeg@w_228%2ch_152',
        type: 'image/png',
      },
    ];

    const { container: wrapper, unmount } = render(
      <Upload listType="picture" defaultFileList={list as UploadProps['defaultFileList']}>
        <button type="button">upload</button>
      </Upload>,
    );
    expect(wrapper.firstChild).toMatchSnapshot();

    unmount();
  });

  it('not crash when uploading not provides percent', async () => {
    const { unmount } = render(
      <Upload
        listType="picture"
        defaultFileList={
          [{ name: 'bamboo.png', status: 'uploading' }] as UploadProps['defaultFileList']
        }
      />,
    );

    await waitFakeTimer();

    unmount();
  });

  it('should support showRemoveIcon and showPreviewIcon', () => {
    const list = [
      {
        name: 'image',
        status: 'uploading',
        uid: '-4',
        url: 'https://cdn.xxx.com/aaa',
      },
      {
        name: 'image',
        status: 'done',
        uid: '-5',
        url: 'https://cdn.xxx.com/aaa',
      },
    ];

    const { container: wrapper, unmount } = render(
      <Upload
        listType="picture"
        defaultFileList={list as UploadProps['defaultFileList']}
        showUploadList={{
          showRemoveIcon: false,
          showPreviewIcon: false,
        }}
      >
        <button type="button">upload</button>
      </Upload>,
    );
    expect(wrapper.firstChild).toMatchSnapshot();

    unmount();
  });

  // https://github.com/ant-design/ant-design/issues/27519
  // https://github.com/ant-design/ant-design/issues/45735
  it('should show remove icon when showRemoveIcon is true', () => {
    const list = [
      {
        name: 'image',
        status: 'uploading',
        uid: '-4',
        url: 'https://cdn.xxx.com/aaa',
      },
    ];

    const { container: wrapper, unmount } = render(
      <Upload
        listType="picture"
        defaultFileList={list as UploadProps['defaultFileList']}
        showUploadList={{
          showRemoveIcon: true,
        }}
        disabled
      >
        <button type="button">upload</button>
      </Upload>,
    );
    expect(wrapper.querySelector('.anticon-delete')).toBeTruthy();
    unmount();
  });

  it('disabled should not affect preview and download icon', () => {
    const list = [
      {
        name: 'image',
        status: 'done',
        uid: '-4',
        url: 'https://cdn.xxx.com/aaa',
      },
    ];

    const { container: wrapper, unmount } = render(
      <Upload
        listType="picture-card"
        defaultFileList={list as UploadProps['defaultFileList']}
        showUploadList={{
          showPreviewIcon: true,
          showDownloadIcon: true,
          showRemoveIcon: true,
        }}
        disabled
      >
        <button type="button">upload</button>
      </Upload>,
    );
    // preview icon
    expect(
      wrapper.querySelectorAll('.ant-upload-list-item-actions > *')[0].hasAttribute('disabled'),
    ).toBeFalsy();
    // download icon

    expect(
      wrapper.querySelectorAll('.ant-upload-list-item-actions > *')[1].hasAttribute('disabled'),
    ).toBeTruthy();
    // delete icon
    expect(
      wrapper.querySelectorAll('.ant-upload-list-item-actions > *')[2].hasAttribute('disabled'),
    ).toBeTruthy();
    unmount();
  });

  it('should support custom onClick in custom icon', async () => {
    const handleRemove = jest.fn();
    const handleChange = jest.fn();
    const myClick = jest.fn();
    const { container: wrapper, unmount } = render(
      <Upload
        listType="picture-card"
        defaultFileList={fileList}
        onRemove={handleRemove}
        onChange={handleChange}
        showUploadList={{
          showRemoveIcon: true,
          removeIcon: (
            <i className="custom-delete" onClick={myClick}>
              RM
            </i>
          ),
        }}
      >
        <button type="button">upload</button>
      </Upload>,
    );
    fireEvent.click(wrapper.querySelectorAll('.custom-delete')[0]);
    expect(handleRemove).toHaveBeenCalledWith(fileList[0]);
    expect(myClick).toHaveBeenCalled();
    fireEvent.click(wrapper.querySelectorAll('.custom-delete')[1]);
    expect(handleRemove).toHaveBeenCalledWith(fileList[1]);
    expect(myClick).toHaveBeenCalled();
    await waitFakeTimer();
    expect(handleChange).toHaveBeenCalledTimes(2);

    unmount();
  });

  it('should support showXxxIcon functions', () => {
    const list = [
      {
        name: 'image',
        status: 'uploading',
        uid: '-4',
        url: 'https://cdn.xxx.com/aaa',
        response: {
          protected: true,
        },
      },
      {
        name: 'image',
        status: 'done',
        uid: '-5',
        url: 'https://cdn.xxx.com/aaa',
      },
      {
        name: 'image',
        status: 'done',
        uid: '-5',
        url: 'https://cdn.xxx.com/aaa',
        response: {
          protected: true,
        },
      },
    ];

    const { container: wrapper, unmount } = render(
      <Upload
        defaultFileList={list as UploadProps['defaultFileList']}
        showUploadList={{
          showRemoveIcon: (file) => file.response?.protected,
          showDownloadIcon: (file) => file.response?.protected,
          showPreviewIcon: (file) => file.response?.protected,
          removeIcon: <i>RM</i>,
          downloadIcon: <i>DL</i>,
          previewIcon: <i>PV</i>,
        }}
      >
        <button type="button">upload</button>
      </Upload>,
    );
    expect(wrapper.firstChild).toMatchSnapshot();
    unmount();
  });

  it('should support removeIcon and downloadIcon', () => {
    const list = [
      {
        name: 'image',
        status: 'uploading',
        uid: '-4',
        url: 'https://cdn.xxx.com/aaa',
      },
      {
        name: 'image',
        status: 'done',
        uid: '-5',
        url: 'https://cdn.xxx.com/aaa',
      },
    ];

    const { container: wrapper, unmount } = render(
      <Upload
        listType="picture"
        defaultFileList={list as UploadProps['defaultFileList']}
        showUploadList={{
          showRemoveIcon: true,
          showDownloadIcon: true,
          showPreviewIcon: true,
          removeIcon: <i>RM</i>,
          downloadIcon: <i>DL</i>,
          previewIcon: <i>PV</i>,
        }}
      >
        <button type="button">upload</button>
      </Upload>,
    );
    expect(wrapper.firstChild).toMatchSnapshot();
    unmount();

    const { container: wrapper2, unmount: unmount2 } = render(
      <Upload
        listType="picture"
        defaultFileList={list as UploadProps['defaultFileList']}
        showUploadList={{
          showRemoveIcon: true,
          showDownloadIcon: true,
          showPreviewIcon: true,
          removeIcon: () => <i>RM</i>,
          downloadIcon: () => <i>DL</i>,
          previewIcon: () => <i>PV</i>,
        }}
      >
        <button type="button">upload</button>
      </Upload>,
    );
    expect(wrapper2.firstChild).toMatchSnapshot();
    unmount2();
  });

  // https://github.com/ant-design/ant-design/issues/7762
  it('work with form validation', async () => {
    let formRef: FormInstance;

    const TestForm: React.FC = () => {
      const [form] = Form.useForm();
      formRef = form;

      return (
        <Form form={form}>
          <Form.Item
            name="file"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
            rules={[
              {
                required: true,
                async validator(_, value) {
                  if (!value || value.length === 0) {
                    throw new Error('file required');
                  }
                },
              },
            ]}
          >
            <Upload beforeUpload={() => false}>
              <button type="button">upload</button>
            </Upload>
          </Form.Item>
        </Form>
      );
    };

    const { container, unmount } = render(<TestForm />);

    fireEvent.submit(container.querySelector('form')!);
    await waitFakeTimer();
    expect(formRef!.getFieldError(['file'])).toEqual(['file required']);

    fireEvent.change(container.querySelector('input')!, {
      target: { files: [{ name: 'foo.png' }] },
    });

    fireEvent.submit(container.querySelector('form')!);
    await waitFakeTimer();
    expect(formRef!.getFieldError(['file'])).toEqual([]);

    unmount();
  });

  it('return when prop onPreview not exists', () => {
    const ref = React.createRef<any>();
    const { unmount } = render(
      <UploadList ref={ref} locale={undefined as unknown as UploadLocale} />,
    );
    expect(ref.current?.handlePreview?.()).toBe(undefined);
    unmount();
  });

  it('return when prop onDownload not exists', () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    const items = [{ uid: 'upload-list-item', url: '' }];
    const ref = React.createRef<any>();
    const showUploadList = { showUploadList: { showDownloadIcon: true } };
    const { unmount } = render(
      <UploadList
        ref={ref}
        items={items as UploadListProps['items']}
        locale={{ downloadFile: '' }}
        {...showUploadList}
      />,
    );
    expect(ref.current?.handleDownload?.(file)).toBe(undefined);
    unmount();
  });

  it('previewFile should work correctly', async () => {
    const items = [{ uid: 'upload-list-item', url: '' }];
    const previewFunc = jest.fn(previewImage);
    const { container: wrapper, unmount } = render(
      <Upload
        fileList={items as UploadProps['fileList']}
        previewFile={previewFunc}
        locale={{ previewFile: '' }}
        listType="picture-card"
      />,
    );

    fireEvent.change(wrapper.querySelector('input')!, {
      target: { files: [{ name: 'foo.png' }] },
    });

    await waitFakeTimer();

    expect(wrapper.querySelector('.ant-upload-list-item-thumbnail')?.getAttribute('href')).toBe(
      null,
    );

    unmount();
  });

  it('downloadFile should work correctly', async () => {
    const downloadFunc = jest.fn();
    const items = [{ uid: 'upload-list-item', name: 'test', url: '', status: 'done' }];
    const { container: wrapper, unmount } = render(
      <UploadList
        showDownloadIcon
        listType="picture-card"
        items={items as UploadListProps['items']}
        onDownload={downloadFunc}
        locale={{ downloadFile: 'Download file' }}
      />,
    );

    // Not throw
    const btn = wrapper.querySelector('.ant-btn');
    expect(btn?.getAttribute('title')).toBe('Download file');
    fireEvent.click(btn!);
    expect(downloadFunc).toHaveBeenCalled();

    unmount();
  });

  it('extname should work correctly when url not exists', () => {
    const items = [{ uid: 'upload-list-item', url: '' }];
    const { container: wrapper, unmount } = render(
      <UploadList
        listType="picture-card"
        items={items as UploadListProps['items']}
        locale={{ previewFile: '' }}
      />,
    );
    expect(wrapper.querySelectorAll('.ant-upload-list-item-thumbnail').length).toBe(1);
    unmount();
  });

  it('extname should work correctly when url exists', (done) => {
    const items = [{ status: 'done', uid: 'upload-list-item', url: '/example' }];
    const { container: wrapper, unmount } = render(
      <UploadList
        listType="picture"
        onDownload={(file) => {
          expect(file.url).toBe('/example');
          unmount();
          done();
        }}
        items={items as UploadListProps['items']}
        locale={{ downloadFile: '' }}
        showDownloadIcon
      />,
    );
    fireEvent.click(wrapper.querySelector('div.ant-upload-list-item .anticon-download')!);
  });

  it('when picture-card is loading, icon should render correctly', () => {
    const items = [{ status: 'uploading', uid: 'upload-list-item' }];
    const { container: wrapper, unmount } = render(
      <UploadList
        listType="picture-card"
        items={items as UploadListProps['items']}
        locale={{ uploading: 'uploading' }}
      />,
    );
    expect(wrapper.querySelectorAll('.ant-upload-list-item-thumbnail')?.length).toBe(1);
    expect(wrapper.querySelector('.ant-upload-list-item-thumbnail')?.textContent).toBe('uploading');

    unmount();
  });

  it('onPreview should be called, when url exists', () => {
    const onPreview = jest.fn();
    const items = [{ thumbUrl: 'thumbUrl', url: 'url', uid: 'upload-list-item' }];
    const {
      container: wrapper,
      rerender,
      unmount,
    } = render(
      <UploadList
        listType="picture-card"
        items={items as UploadListProps['items']}
        locale={{ uploading: 'uploading' }}
        onPreview={onPreview}
      />,
    );
    fireEvent.click(wrapper.querySelector('.ant-upload-list-item-thumbnail')!);
    expect(onPreview).toHaveBeenCalled();
    fireEvent.click(wrapper.querySelector('.ant-upload-list-item-name')!);
    expect(onPreview).toHaveBeenCalled();
    rerender(
      <UploadList
        listType="picture-card"
        items={[{ thumbUrl: 'thumbUrl', uid: 'upload-list-item' }] as UploadListProps['items']}
        locale={{ uploading: 'uploading' }}
        onPreview={onPreview}
      />,
    );
    fireEvent.click(wrapper.querySelector('.ant-upload-list-item-name')!);
    expect(onPreview).toHaveBeenCalled();

    unmount();
  });

  it('upload image file should be converted to the base64', async () => {
    const mockFile = new File([''], 'foo.png', {
      type: 'image/png',
    });

    const previewFunc = jest.fn(previewImage);

    const { unmount } = render(
      <Upload
        fileList={[{ originFileObj: mockFile }] as UploadProps['fileList']}
        previewFile={previewFunc}
        locale={{ uploading: 'uploading' }}
        listType="picture-card"
      />,
    );

    await waitFor(() => {
      expect(previewFunc).toHaveBeenCalled();
    });
    await previewFunc(mockFile).then((dataUrl) => {
      expect(dataUrl).toEqual('data:image/png;base64,');
    });
    unmount();
  });

  it('upload svg file with <foreignObject> should not have CORS error', async () => {
    const mockFile = new File(
      [
        '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><foreignObject x="20" y="20" width="160" height="160"><div xmlns="http://www.w3.org/1999/xhtml">Test</div></foreignObject></svg>',
      ],
      'bar.svg',
      { type: 'image/svg+xml' },
    );

    const previewFunc = jest.fn(previewImage);

    const { unmount } = render(
      <Upload
        fileList={[{ originFileObj: mockFile }] as UploadProps['fileList']}
        previewFile={previewFunc}
        locale={{ uploading: 'uploading' }}
        listType="picture-card"
      />,
    );

    await waitFor(() => {
      expect(previewFunc).toHaveBeenCalled();
    });
    await previewFunc(mockFile).then((dataUrl) => {
      expect(dataUrl).toEqual('data:image/png;base64,');
    });
    unmount();
  });

  it('upload gif file should be converted to the image/gif base64', async () => {
    const mockFile = new File([''], 'foo.gif', {
      type: 'image/gif',
    });

    const previewFunc = jest.fn(previewImage);

    const { unmount } = render(
      <Upload
        fileList={[{ originFileObj: mockFile }] as UploadProps['fileList']}
        previewFile={previewFunc}
        locale={{ uploading: 'uploading' }}
        listType="picture-card"
      />,
    );

    await waitFor(() => {
      expect(previewFunc).toHaveBeenCalled();
    });
    await previewFunc(mockFile).then((dataUrl) => {
      expect(dataUrl).toEqual('data:image/gif;base64,');
    });
    unmount();
  });

  it("upload non image file shouldn't be converted to the base64", async () => {
    const mockFile = new File([''], 'foo.7z', {
      type: 'application/x-7z-compressed',
    });
    const previewFunc = jest.fn(previewImage);

    const { unmount } = render(
      <Upload
        fileList={[{ originFileObj: mockFile }] as UploadProps['fileList']}
        previewFile={previewFunc}
        locale={{ uploading: 'uploading' }}
        listType="picture-card"
      />,
    );

    await waitFor(() => {
      expect(previewFunc).toHaveBeenCalled();
    });
    await previewFunc(mockFile).then((dataUrl) => {
      expect(dataUrl).toBe('');
    });

    unmount();
  });

  describe('customize previewFile support', () => {
    function test(name: string, renderInstance: () => File | Blob) {
      it(name, async () => {
        const mockThumbnail = 'mock-image';
        const previewFile = jest.fn(() => Promise.resolve(mockThumbnail));
        const file = {
          ...fileList?.[0],
          originFileObj: renderInstance(),
        };
        delete file.thumbUrl;
        const ref = React.createRef<any>();
        const { container: wrapper, unmount } = render(
          <Upload
            ref={ref}
            listType="picture"
            defaultFileList={[file] as UploadProps['defaultFileList']}
            previewFile={previewFile}
          >
            <button type="button">button</button>
          </Upload>,
        );
        expect(previewFile).toHaveBeenCalledWith(file.originFileObj);
        await waitFakeTimer();

        expect(
          wrapper.querySelector('.ant-upload-list-item-thumbnail img')?.getAttribute('src'),
        ).toBe(mockThumbnail);

        unmount();
      });
    }
    test('File', () => new File([], 'xxx.png'));
    test('Blob', () => new Blob());
  });

  // https://github.com/ant-design/ant-design/issues/22958
  describe('customize isImageUrl support', () => {
    const list = [
      ...fileList,
      {
        uid: '0',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        thumbUrl:
          'http://image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg@!panda_style?spm=a2c4g.11186623.2.17.4dc56b29BHokyg&file=example.jpg@!panda_style',
      },
    ];
    it('should not render <img /> when file.thumbUrl use "!" as separator', () => {
      const { container: wrapper, unmount } = render(
        <Upload listType="picture-card" fileList={list as UploadProps['fileList']}>
          <button type="button">button</button>
        </Upload>,
      );
      const imgNode = wrapper.querySelectorAll('.ant-upload-list-item-thumbnail img');
      expect(imgNode.length).toBe(2);
      unmount();
    });
    it('should render <img /> when custom imageUrl return true', () => {
      const isImageUrl = jest.fn(() => true);
      const { container: wrapper, unmount } = render(
        <Upload
          listType="picture-card"
          fileList={list as UploadProps['fileList']}
          isImageUrl={isImageUrl}
        >
          <button type="button">button</button>
        </Upload>,
      );
      const imgNode = wrapper.querySelectorAll('.ant-upload-list-item-thumbnail img');
      expect(isImageUrl).toHaveBeenCalled();
      expect(imgNode.length).toBe(3);
      unmount();
    });
    it('should not render <img /> when custom imageUrl return false', () => {
      const isImageUrl = jest.fn(() => false);
      const { container: wrapper, unmount } = render(
        <Upload
          listType="picture-card"
          fileList={list as UploadProps['fileList']}
          isImageUrl={isImageUrl}
        >
          <button type="button">button</button>
        </Upload>,
      );
      const imgNode = wrapper.querySelectorAll('.ant-upload-list-item-thumbnail img');
      expect(isImageUrl).toHaveBeenCalled();
      expect(imgNode.length).toBe(0);
      unmount();
    });
  });
  describe('thumbUrl support for non-image', () => {
    const nonImageFile = new File([''], 'foo.7z', { type: 'application/x-7z-compressed' });
    it('should render <img /> when upload non-image file and configure thumbUrl in onChange', async () => {
      const thumbUrl =
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
      // biome-ignore lint/style/useConst: test only
      let wrapper: ReturnType<typeof render>;
      const onChange = jest.fn<void, Record<'fileList', UploadProps['fileList']>[]>(
        ({ fileList: files }) => {
          const newFileList = files?.map<UploadFile<any>>((item) => ({ ...item, thumbUrl }));

          wrapper.rerender(
            <Upload
              action="http://jsonplaceholder.typicode.com/posts/"
              listType="picture-card"
              fileList={newFileList}
              onChange={onChange}
              customRequest={successRequest}
            >
              <button type="button">upload</button>
            </Upload>,
          );
        },
      );

      wrapper = render(
        <Upload
          action="http://jsonplaceholder.typicode.com/posts/"
          listType="picture-card"
          fileList={[]}
          onChange={onChange}
          customRequest={successRequest}
        >
          <button type="button">upload</button>
        </Upload>,
      );
      const imgNode = wrapper.container.querySelectorAll('.ant-upload-list-item-thumbnail img');
      expect(imgNode.length).toBe(0);

      // Simulate change is a timeout change
      fireEvent.change(wrapper.container.querySelector('input')!, {
        target: { files: [nonImageFile] },
      });

      // Wait for `rc-upload` process file
      await waitFakeTimer();
      // Basic called times
      expect(onChange).toHaveBeenCalled();

      // Check for images
      await waitFakeTimer();
      const afterImgNode = wrapper.container.querySelectorAll(
        '.ant-upload-list-item-thumbnail img',
      );
      expect(afterImgNode.length).toBeTruthy();

      wrapper.unmount();
    });

    it('should not render <img /> when upload non-image file without thumbUrl in onChange', async () => {
      (global as any).testName =
        'should not render <img /> when upload non-image file without thumbUrl in onChange';
      // biome-ignore lint/style/useConst: test only
      let wrapper: ReturnType<typeof render>;
      const onChange = jest.fn<void, Record<'fileList', UploadProps['fileList']>[]>(
        ({ fileList: files }) => {
          wrapper.rerender(
            <Upload
              action="http://jsonplaceholder.typicode.com/posts/"
              listType="picture-card"
              fileList={files}
              onChange={onChange}
              customRequest={successRequest}
            >
              <button type="button">upload</button>
            </Upload>,
          );
        },
      );
      wrapper = render(
        <Upload
          action="http://jsonplaceholder.typicode.com/posts/"
          listType="picture-card"
          fileList={[]}
          onChange={onChange}
          customRequest={successRequest}
        >
          <button type="button">upload</button>
        </Upload>,
      );
      const imgNode = wrapper.container.querySelectorAll('.ant-upload-list-item-thumbnail img');
      expect(imgNode.length).toBe(0);
      fireEvent.change(wrapper.container.querySelector('input')!, {
        target: { files: [nonImageFile] },
      });

      await waitFakeTimer();
      expect(onChange).toHaveBeenCalled();
      expect(wrapper.container.querySelectorAll('.ant-upload-list-item-thumbnail img').length).toBe(
        0,
      );
    });
  });

  it('[deprecated] should support transformFile', (done) => {
    jest.useRealTimers();
    // biome-ignore lint/style/useConst: test only
    let wrapper: ReturnType<typeof render>;
    let lastFile: UploadFile;

    const handleTransformFile = jest.fn();
    const onChange: UploadProps['onChange'] = ({ file }) => {
      if (file.status === 'done') {
        expect(file).not.toBe(lastFile);
        expect(handleTransformFile).toHaveBeenCalled();
        wrapper.unmount();
        done();
      }

      lastFile = file;
    };
    wrapper = render(
      <Upload
        action="http://jsonplaceholder.typicode.com/posts/"
        transformFile={handleTransformFile}
        onChange={onChange}
        customRequest={successRequest}
      >
        <button type="button">upload</button>
      </Upload>,
    );
    fireEvent.change(wrapper.container.querySelector('input')!, {
      target: { files: [{ name: 'foo.png' }] },
    });
  });

  it('should render button inside UploadList when listStyle is picture-card', () => {
    const {
      container: wrapper,
      rerender,
      unmount,
    } = render(
      <Upload
        action="http://jsonplaceholder.typicode.com/posts/"
        listType="picture-card"
        fileList={[
          {
            uid: '0',
            name: 'xxx.png',
          },
        ]}
        showUploadList
      >
        <button className="trigger" type="button">
          upload
        </button>
      </Upload>,
    );
    expect(wrapper.querySelectorAll('.ant-upload-list button.trigger').length).toBeGreaterThan(0);
    rerender(
      <Upload
        action="http://jsonplaceholder.typicode.com/posts/"
        listType="picture-card"
        fileList={[
          {
            uid: '0',
            name: 'xxx.png',
          },
        ]}
        showUploadList={false}
      >
        <button className="trigger" type="button">
          upload
        </button>
      </Upload>,
    );
    expect(wrapper.querySelectorAll('.ant-upload-list button.trigger').length).toBe(0);

    unmount();
  });

  // https://github.com/ant-design/ant-design/issues/26536
  it('multiple file upload should keep the internal fileList async', async () => {
    const uploadRef = React.createRef<any>();

    const MyUpload: React.FC = () => {
      const [testFileList, setTestFileList] = React.useState<UploadFile[]>([]);

      return (
        <Upload
          ref={uploadRef}
          fileList={testFileList}
          action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
          multiple
          onChange={(info) => {
            setTestFileList([...info.fileList]);
          }}
        >
          <button type="button">Upload</button>
        </Upload>
      );
    };

    const { unmount } = render(<MyUpload />);

    // Mock async update in a frame
    const fileNames = ['light', 'bamboo', 'little'];

    act(() => {
      uploadRef.current.onBatchStart(
        fileNames.map((fileName) => {
          const file = new File([], fileName);
          (file as any).uid = fileName;
          return { file, parsedFile: file };
        }),
      );
    });

    expect(uploadRef.current.fileList).toHaveLength(fileNames.length);

    await waitFakeTimer();
    expect(uploadRef.current.fileList).toHaveLength(fileNames.length);

    unmount();
  });

  it('itemRender', () => {
    const onDownload = jest.fn();
    const onRemove = jest.fn();
    const onPreview = jest.fn();
    const itemRender: UploadListProps['itemRender'] = (_, file, currFileList, actions) => {
      const { name, status, uid, url } = file;
      const index = currFileList.indexOf(file);
      return (
        <div className="custom-item-render">
          <span>
            {`uid:${uid} name: ${name} status: ${status} url: ${url}  ${index + 1}/${
              currFileList.length
            }`}
          </span>
          <span onClick={actions.remove} className="custom-item-render-action-remove">
            remove
          </span>
          <span onClick={actions.download} className="custom-item-render-action-download">
            download
          </span>
          <span onClick={actions.preview} className="custom-item-render-action-preview">
            preview
          </span>
        </div>
      );
    };
    const { container: wrapper, unmount } = render(
      <UploadList
        onDownload={onDownload}
        onPreview={onPreview}
        onRemove={onRemove}
        locale={{}}
        items={fileList}
        itemRender={itemRender}
      />,
    );
    expect(wrapper.firstChild).toMatchSnapshot();

    fireEvent.click(wrapper.querySelectorAll('.custom-item-render-action-remove')[0]);
    expect(onRemove.mock.calls[0][0]).toEqual(fileList[0]);

    fireEvent.click(wrapper.querySelectorAll('.custom-item-render-action-download')[0]);
    expect(onDownload.mock.calls[0][0]).toEqual(fileList[0]);

    fireEvent.click(wrapper.querySelectorAll('.custom-item-render-action-preview')[0]);
    expect(onPreview.mock.calls[0][0]).toEqual(fileList[0]);

    unmount();
  });

  it('LIST_IGNORE should not add in list', async () => {
    const beforeUpload = jest.fn(() => Upload.LIST_IGNORE);
    const { container: wrapper, unmount } = render(<Upload beforeUpload={beforeUpload} />);

    fireEvent.change(wrapper.querySelector('input')!, {
      target: { files: [{ file: 'foo.png' }] },
    });

    await waitFakeTimer();

    expect(beforeUpload).toHaveBeenCalled();
    expect(wrapper.querySelectorAll('.ant-upload-list-text-container')).toHaveLength(0);

    unmount();
  });

  it('Not crash when fileList is null', () => {
    const defaultWrapper = render(
      <Upload defaultFileList={null as unknown as UploadProps['defaultFileList']} />,
    );
    defaultWrapper.unmount();

    const wrapper = render(<Upload fileList={null as unknown as UploadProps['defaultFileList']} />);
    wrapper.unmount();
  });

  it('should not exist crossorigin attribute when does not set file.crossorigin in case of listType="picture"', () => {
    const list = [
      {
        uid: '0',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
      },
    ];

    const { container: wrapper, unmount } = render(
      <Upload fileList={list as UploadProps['fileList']} listType="picture">
        <button type="button">upload</button>
      </Upload>,
    );
    list.forEach((_, i) => {
      const imgNode = wrapper.querySelectorAll('.ant-upload-list-item-thumbnail img')[i];
      expect(imgNode.getAttribute('crossOrigin')).toBe(null);
    });
    unmount();
  });

  it('should exist crossorigin attribute when set file.crossorigin in case of listType="picture"', () => {
    const list = [
      {
        uid: '0',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
        crossOrigin: '',
      },
      {
        uid: '1',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
        crossOrigin: 'anonymous',
      },
      {
        uid: '2',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
        crossOrigin: 'use-credentials',
      },
    ];

    const { container: wrapper, unmount } = render(
      <Upload fileList={list as UploadProps['fileList']} listType="picture">
        <button type="button">upload</button>
      </Upload>,
    );
    list.forEach((file, i) => {
      const imgNode = wrapper.querySelectorAll('.ant-upload-list-item-thumbnail img')[i];
      expect(imgNode.getAttribute('crossOrigin')).not.toBe(undefined);
      expect(imgNode.getAttribute('crossOrigin')).toBe(file.crossOrigin);
    });
    unmount();
  });

  it('should not exist crossorigin attribute when does not set file.crossorigin in case of listType="picture-card"', () => {
    const list = [
      {
        uid: '0',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
      },
    ];

    const { container: wrapper, unmount } = render(
      <Upload fileList={list as UploadProps['fileList']} listType="picture">
        <button type="button">upload</button>
      </Upload>,
    );
    list.forEach((_, i) => {
      const imgNode = wrapper.querySelectorAll('.ant-upload-list-item-thumbnail img')[i];
      expect(imgNode.getAttribute('crossOrigin')).toBe(null);
    });
    unmount();
  });

  it('should exist crossorigin attribute when set file.crossorigin in case of listType="picture-card"', () => {
    const list = [
      {
        uid: '0',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
        crossOrigin: '',
      },
      {
        uid: '1',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
        crossOrigin: 'anonymous',
      },
      {
        uid: '2',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
        crossOrigin: 'use-credentials',
      },
    ];

    const { container: wrapper, unmount } = render(
      <Upload fileList={list as UploadProps['fileList']} listType="picture">
        <button type="button">upload</button>
      </Upload>,
    );
    list.forEach((file, i) => {
      const imgNode = wrapper.querySelectorAll('.ant-upload-list-item-thumbnail img')[i];
      expect(imgNode.getAttribute('crossOrigin')).not.toBe(undefined);
      expect(imgNode.getAttribute('crossOrigin')).toBe(file.crossOrigin);
    });
    unmount();
  });

  describe('should not display upload file-select button when listType is picture-card and children is empty', () => {
    it('when showUploadList is true', () => {
      const list = [
        {
          uid: '0',
          name: 'xxx.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
        },
      ];
      const { container: wrapper, unmount } = render(
        <Upload fileList={list as UploadProps['defaultFileList']} listType="picture-card" />,
      );
      expect(wrapper.querySelectorAll('.ant-upload-select').length).toBe(1);
      expect(wrapper.querySelector<HTMLDivElement>('.ant-upload-select')).toHaveClass(
        'ant-upload-hidden',
      );
      unmount();
    });

    // https://github.com/ant-design/ant-design/issues/36183
    it('when showUploadList is false', () => {
      const list = [
        {
          uid: '0',
          name: 'xxx.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
        },
      ];
      const { container: wrapper, unmount } = render(
        <Upload
          fileList={list as UploadProps['fileList']}
          showUploadList={false}
          listType="picture-card"
        />,
      );
      expect(wrapper.querySelectorAll('.ant-upload-select').length).toBe(1);
      expect(wrapper.querySelector<HTMLDivElement>('.ant-upload-select')).toHaveClass(
        'ant-upload-hidden',
      );
      unmount();
    });
  });

  // https://github.com/ant-design/ant-design/issues/36286
  it('remove should keep origin className', async () => {
    const onChange = jest.fn();
    const list = [
      {
        uid: '0',
        name: 'xxx.png',
        status: 'error',
      },
    ];
    const { container } = render(
      <Upload
        fileList={list as UploadProps['fileList']}
        listType="picture-card"
        onChange={onChange}
      />,
    );

    fireEvent.click(container.querySelector('.anticon-delete')!);

    await waitFakeTimer();

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        file: expect.objectContaining({ status: 'removed' }),
      }),
    );

    expect(container.querySelector('.ant-upload-list-item-error')).toBeTruthy();
  });

  // https://github.com/ant-design/ant-design/issues/42056
  describe('when form is disabled but upload is not', () => {
    it('should not disable remove button', () => {
      const { container } = render(
        <Form name="base" disabled>
          <Form.Item name="upload">
            <Upload
              disabled={false}
              defaultFileList={[
                {
                  uid: '1',
                  name: 'zzz.png',
                  status: 'error',
                  url: 'http://www.baidu.com/zzz.png',
                },
              ]}
            />
          </Form.Item>
        </Form>,
      );

      const removeButton = container.querySelector('.ant-upload-list-item-actions > button');
      expect(removeButton).toBeTruthy();
      expect(removeButton).not.toBeDisabled();
    });
  });
});
