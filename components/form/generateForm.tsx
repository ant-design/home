import warning from '../_util/warning';
import { FormProvider } from './context';
import ErrorList from './ErrorList';
import InternalForm, { useForm, useWatch } from './Form';
import Item from './FormItem';
import List from './FormList';
import useFormInstance from './hooks/useFormInstance';

export function generateForm<T = any>() {
  type InternalFormType = typeof InternalForm<T>;

  type CompoundedComponent = InternalFormType & {
    useForm: typeof useForm<T>;
    useFormInstance: typeof useFormInstance<T>;
    useWatch: typeof useWatch;
    Item: typeof Item<T>;
    List: typeof List;
    ErrorList: typeof ErrorList;
    Provider: typeof FormProvider;

    /** @deprecated Only for warning usage. Do not use. */
    create: () => void;
  };

  const Form = InternalForm as CompoundedComponent;

  Form.Item = Item;
  Form.List = List;
  Form.ErrorList = ErrorList;
  Form.useForm = useForm;
  Form.useFormInstance = useFormInstance;
  Form.useWatch = useWatch;
  Form.Provider = FormProvider;
  Form.create = () => {
    warning(
      false,
      'Form',
      'antd v4 removed `Form.create`. Please remove or use `@ant-design/compatible` instead.',
    );
  };
  return Form;
}
