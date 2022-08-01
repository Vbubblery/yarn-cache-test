export interface ICompany {
  [key: string]: IUser;
}

export interface ISite {
  [key: string]: IUser;
}
export interface IUser {
  id: string;
  company: string;
  sites: Array<string>;
}
