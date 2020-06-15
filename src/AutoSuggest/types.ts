interface OptionObject {
  key: string;
  value: any;
  [key: string]: any;
}

export type Option = string | OptionObject;