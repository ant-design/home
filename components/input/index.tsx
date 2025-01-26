import InputGroup from './Group';
import InternalInput from './Input';
import OTP from './OTP';
import Password from './Password';
import Search from './Search';
import TextArea from './TextArea';

export type {
  InputGroupProps,
  /** @deprecated Please use `InputGroupProps` */
  InputGroupProps as GroupProps,
} from './Group';
export type { InputProps, InputRef } from './Input';
export type { PasswordProps } from './Password';
export type { SearchProps } from './Search';
export type { TextAreaProps } from './TextArea';

type CompoundedComponent = typeof InternalInput & {
  Group: typeof InputGroup;
  Search: typeof Search;
  TextArea: typeof TextArea;
  Password: typeof Password;
  OTP: typeof OTP;
};

const Input = InternalInput as CompoundedComponent;

Input.Group = InputGroup;
Input.Search = Search;
Input.TextArea = TextArea;
Input.Password = Password;
Input.OTP = OTP;

export default Input;
