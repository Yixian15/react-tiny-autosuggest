interface OptionObject {
  key: string;
  title: string;
  [key: string]: any;
}

export type Option = string | OptionObject;