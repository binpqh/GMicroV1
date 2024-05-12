import { StatusEnumString } from '../Constant/Status';

export interface IProductItemAdd {
  'itemVietnamese.codeTitle': string;
  'itemEnglish.codeTitle': string;
  'itemEnglish.note': string;
  'itemVietnamese.note': string;
  codeItem: string;
  'itemVietnamese.price': number;
  'itemEnglish.price': number;
  'itemVietnamese.itemIcon': any; // hình
  'englishContent.itemIcon': any; // hình
  'itemVietnamese.description': string[];
  'itemEnglish.description': string[];
}

export interface IProductInformation {
  'vietnameseContent.Heading': string;
  'englishContent.Heading': string;
  'vietnameseContent.SubHeading': string;
  'englishContent.SubHeading': string;
  'vietnameseContent.Description': string[];
  'englishContent.Description': string[];
}

export interface IAddProduct {
  productName: string;
  productCode: string;

  colorCodePrimary: string;
  colorCodeSecondary?: string;
  productIcon: any; // hình
  hotline: string;
  isRequireSerialNumber: boolean;
  'vietnameseContent.Title': string;
  'vietnameseContent.ProductPreviewImage': any; // hình
  'englishContent.Title': string;
  'englishContent.ProductPreviewImage': any; // hình

  Information: IProductInformation[];
  items: IProductItemAdd[];
}

export type TProductDropdown = {
  productCode: string;
  itemCodes: string[];
};
export type TProductAll = {
  id: string;
  productName: string;
  productCode: string;
  productIcon: string; // URL IMG
};

export type TProductHeading = {
  heading?: string;
  subHeading?: string;
  description?: string[];
  id: string;
};

export type TProductItem = {
  codeTitle: string;
  codeItem: string;
  iconItem: string; // IMG
  price: number;
  description: string[];
  note?: string;
  createdAt: string;
  id: string;
};

export type TProductContent = {
  productTitle: string;
  heading: TProductHeading;
  items: TProductItem[];
  previewImage: string; // IMG
};

export type TProduct = {
  id: string;
  productName: string;
  productCode: string;
  productIcon: string; // IMG
  colorCodePrimary: string;
  colorCodeSecondary?: string;
  hotline: string;
  isRequireSerialNumber: boolean;
  englishContent: TProductContent;
  vietnameseContent: TProductContent;
  status: StatusEnumString.Active | StatusEnumString.Inactive;
};

export type TUpdateProductItemVI = {
  'itemVietnamese.codeTitle': string;
  'itemVietnamese.note'?: string;
  codeItem: string;
  'itemVietnamese.id': string;
  'itemVietnamese.price': number;
  'itemVietnamese.itemIcon'?: any; // hình
  'itemVietnamese.description': string[];
};
export type TUpdateProductItemEN = {
  'itemEnglish.codeTitle': string;
  'itemEnglish.note'?: string;
  codeItem: string;
  'itemEnglish.id': string;
  'itemEnglish.price': number;
  'itemEnglish.itemIcon'?: any; // hình
  'itemEnglish.description': string[];
};
export type TUpdateProductItem1 = {
  itemVI: TUpdateProductItemVI[];
  iTemEN: TUpdateProductItemEN[];
};

export type TUpdateProductItem = {
  codeItem: string;
  'itemEnglish.id'?: string ;
  'itemEnglish.codeTitle'?: string;
  'itemEnglish.note'?: string;
  'itemEnglish.price'?: number;
  'itemEnglish.itemIcon'?: any; // hình
  'itemEnglish.description'?: string[];

  'itemVietnamese.id'?: string;
  'itemVietnamese.codeTitle'?: string;
  'itemVietnamese.note'?: string;
  'itemVietnamese.price'?: number;
  'itemVietnamese.itemIcon'?: any; // hình
  'itemVietnamese.description'?: string[];
};
