export interface IAdsVideo {
  id: string;
  priority: number;
  name: string;
  path: string | null;
  url: string | null;
  isShow: boolean;
}
export interface IAddVideo {
  Name: string;
  File: any;
  Url: string;
  Priority: string;
}
export interface IPriority {
  id: string;
  priority: number;
}
