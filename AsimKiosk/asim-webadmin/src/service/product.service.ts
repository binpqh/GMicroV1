import { IAddVideo, IPriority } from '../interface/IAdsVideo';
import axiosClient from '../api/AxiosClient';
import { ILoginInput } from '../interface/IAuth';
import {
  IAddProduct,
  TProductDropdown,
  TProductAll,
  TProduct,
  TUpdateProductItem,
} from '../interface/IProduct';
import { IResponse } from '../interface';

const ProductApi = {
  getAll() {
    const url = '/Product/all';
    return axiosClient.get<IResponse<TProductAll[]>>(url);
  },

  getProductDropdown() {
    const url = '/Product/dropdownProductCode';
    return axiosClient.get<IResponse<TProductDropdown[]>>(url);
  },

  getProductByProductCode(productCode: string) {
    const url = `/Product/get?productCode=${productCode}`;
    return axiosClient.get<IResponse<TProduct>>(url);
  },

  CreateProduct(data: IAddProduct) {
    // console.log('call :::', data);

    var bodyFormData = new FormData();
    // thông tin chung
    bodyFormData.append('ProductName', data.productName);
    bodyFormData.append('ProductCode', data.productCode);

    data.productIcon && bodyFormData.append('ProductIcon', data.productIcon[0].originFileObj);
    bodyFormData.append('Hotline', data.hotline);
    data.isRequireSerialNumber &&
      bodyFormData.append('IsRequireSerialNumber', `${data.isRequireSerialNumber}`);

    //màu
    bodyFormData.append('ColorCodePrimary', data.colorCodePrimary);
    data.colorCodeSecondary && bodyFormData.append('ColorCodeSecondary', data.colorCodeSecondary);

    bodyFormData.append('VietnameseContent.Title', data['vietnameseContent.Title']);
    bodyFormData.append(
      'VietnameseContent.ProductPreviewImage',
      data['vietnameseContent.ProductPreviewImage'][0].originFileObj
    );
    bodyFormData.append('EnglishContent.Title', data['englishContent.Title']);
    bodyFormData.append(
      'EnglishContent.ProductPreviewImage',
      data['englishContent.ProductPreviewImage'][0].originFileObj
    );

    data.Information &&
      data.Information.length > 0 &&
      data.Information.map((info, index) => {
        // English
        bodyFormData.append('EnglishContent.Heading', info['englishContent.Heading']);
        bodyFormData.append('EnglishContent.SubHeading', info['englishContent.SubHeading']);

        info['englishContent.Description'] &&
          info['englishContent.Description'].length > 0 &&
          info['englishContent.Description'].map((descEN, index) =>
            bodyFormData.append(`EnglishContent.Description[${index}]`, descEN)
          );
        // Vietnamese
        bodyFormData.append('VietnameseContent.Heading', info['vietnameseContent.Heading']);
        bodyFormData.append('VietnameseContent.SubHeading', info['vietnameseContent.SubHeading']);
        info['vietnameseContent.Description'] &&
          info['vietnameseContent.Description'].length > 0 &&
          info['vietnameseContent.Description'].map((descEN, index) =>
            bodyFormData.append(`VietnameseContent.Description[${index}]`, descEN)
          );
      });

    data.items &&
      data.items.map((item, index) => {
        // English
        bodyFormData.append(
          `EnglishContent.Items[${index}].CodeTitle`,
          item['itemEnglish.codeTitle']
        );
        bodyFormData.append(`EnglishContent.Items[${index}].CodeItem`, item.codeItem);
        bodyFormData.append(
          `EnglishContent.Items[${index}].Icon`,
          item['englishContent.itemIcon'][0].originFileObj
        );
        bodyFormData.append(
          `EnglishContent.Items[${index}].Price`,
          item['itemEnglish.price'].toString()
        );

        bodyFormData.append(
          `EnglishContent.Items[${index}].Note`,
          item['itemEnglish.note'] ? item['itemEnglish.note'] : ''
        );
        item['itemEnglish.description'] &&
          item['itemEnglish.description'].length > 0 &&
          item['itemEnglish.description'].map((descEN, index2) =>
            bodyFormData.append(`EnglishContent.Items[${index}].Description[${index2}]`, descEN)
          );

        // Vietnamese
        bodyFormData.append(
          `VietnameseContent.Items[${index}].CodeTitle`,
          item['itemVietnamese.codeTitle']
        );
        bodyFormData.append(`VietnameseContent.Items[${index}].CodeItem`, item.codeItem);
        bodyFormData.append(
          `VietnameseContent.Items[${index}].Icon`,
          item['itemVietnamese.itemIcon'][0].originFileObj
        );
        bodyFormData.append(
          `VietnameseContent.Items[${index}].Price`,
          item['itemVietnamese.price'].toString()
        );
        bodyFormData.append(
          `VietnameseContent.Items[${index}].Note`,
          item['itemVietnamese.note'] ? item['itemVietnamese.note'] : ''
        );
        item['itemVietnamese.description'] &&
          item['itemVietnamese.description'].length > 0 &&
          item['itemVietnamese.description'].map((descEN, index2) =>
            bodyFormData.append(`VietnameseContent.Items[${index}].Description[${index2}]`, descEN)
          );
      });

    // Only shows up in devtool (not here in this code snippet)
    // console.table([...bodyFormData]);
    const url = `/Product/create`;
    return axiosClient.post(url, bodyFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  UpdateProduct(data: IAddProduct, productCode: string) {
    console.log('call :::', data);

    var bodyFormData = new FormData();
    // thông tin chung
    bodyFormData.append('ProductName', data.productName);
    bodyFormData.append('ProductCode', productCode);

    data.productIcon && bodyFormData.append('ProductIcon', data.productIcon[0].originFileObj);
    bodyFormData.append('Hotline', data.hotline);

    bodyFormData.append('IsRequireSerialNumber', `${data.isRequireSerialNumber}`);

    // màu;
    bodyFormData.append('ColorCodePrimary', data.colorCodePrimary);
    data.colorCodeSecondary && bodyFormData.append('ColorCodeSecondary', data.colorCodeSecondary);

    bodyFormData.append('VietnameseContent.Title', data['vietnameseContent.Title']);

    bodyFormData.append(
      'VietnameseContent.ProductPreviewImage',
      data['vietnameseContent.ProductPreviewImage'][0].originFileObj
    );
    bodyFormData.append('EnglishContent.Title', data['englishContent.Title']);
    bodyFormData.append(
      'EnglishContent.ProductPreviewImage',
      data['englishContent.ProductPreviewImage'][0].originFileObj
    );

    data.Information &&
      data.Information.length > 0 &&
      data.Information.map((info, index) => {
        // English
        bodyFormData.append('EnglishContent.Heading', info['englishContent.Heading']);
        bodyFormData.append('EnglishContent.SubHeading', info['englishContent.SubHeading']);

        info['englishContent.Description'] &&
          info['englishContent.Description'].length > 0 &&
          info['englishContent.Description'].map((descEN, index) =>
            bodyFormData.append(`EnglishContent.Description[${index}]`, descEN)
          );
        // Vietnamese
        bodyFormData.append('VietnameseContent.Heading', info['vietnameseContent.Heading']);
        bodyFormData.append('VietnameseContent.SubHeading', info['vietnameseContent.SubHeading']);
        info['vietnameseContent.Description'] &&
          info['vietnameseContent.Description'].length > 0 &&
          info['vietnameseContent.Description'].map((descEN, index) =>
            bodyFormData.append(`VietnameseContent.Description[${index}]`, descEN)
          );
      });

    // Only shows up in devtool (not here in this code snippet)
    console.table([...bodyFormData]);
    const url = `/Product/update?productCode=${productCode}`;
    return axiosClient.put(url, bodyFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  UpdateProductItem(data: { items: Required<TUpdateProductItem[]> }, productCode: string) {
    var bodyFormData = new FormData();
    console.log('call :::', data);
    data.items &&
      data.items.map((item, index) => {
        // English
        item['itemEnglish.id'] &&
          bodyFormData.append(`EnglishItems[${index}].Id`, item['itemEnglish.id']);
        item['itemEnglish.codeTitle'] &&
          bodyFormData.append(`EnglishItems[${index}].CodeTitle`, item['itemEnglish.codeTitle']);
        bodyFormData.append(`EnglishItems[${index}].CodeItem`, item.codeItem);

        bodyFormData.append(
          `EnglishItems[${index}].Icon`,
          item['itemEnglish.itemIcon'][0].originFileObj
        );

        item['itemEnglish.price'] &&
          bodyFormData.append(`EnglishItems[${index}].Price`, item['itemEnglish.price'].toString());

        bodyFormData.append(
          `EnglishItems[${index}].Note`,
          item['itemEnglish.note'] ? item['itemEnglish.note'] : ''
        );
        item['itemEnglish.description'] &&
          item['itemEnglish.description'].length > 0 &&
          item['itemEnglish.description'].map((descEN, index2) =>
            bodyFormData.append(`EnglishItems[${index}].Description[${index2}]`, descEN)
          );

        // Vietnamese
        item['itemVietnamese.id'] &&
          bodyFormData.append(`VietnameseItems[${index}].Id`, item['itemVietnamese.id']);
        item['itemVietnamese.codeTitle'] &&
          bodyFormData.append(
            `VietnameseItems[${index}].CodeTitle`,
            item['itemVietnamese.codeTitle']
          );
        bodyFormData.append(`VietnameseItems[${index}].CodeItem`, item.codeItem);
        bodyFormData.append(
          `VietnameseItems[${index}].Icon`,
          item['itemVietnamese.itemIcon'][0].originFileObj
        );
        item['itemVietnamese.price'] &&
          bodyFormData.append(
            `VietnameseItems[${index}].Price`,
            item['itemVietnamese.price'].toString()
          );
        bodyFormData.append(
          `VietnameseItems[${index}].Note`,
          item['itemVietnamese.note'] ? item['itemVietnamese.note'] : ''
        );
        item['itemVietnamese.description'] &&
          item['itemVietnamese.description'].length > 0 &&
          item['itemVietnamese.description'].map((descEN, index2) =>
            bodyFormData.append(`VietnameseItems[${index}].Description[${index2}]`, descEN)
          );
      });

    // Only shows up in devtool (not here in this code snippet)
    console.table([...bodyFormData]);
    const url = `/Product/updateItems?productCode=${productCode}`;
    return axiosClient.putForm(url, bodyFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  AddProductItem(data: { items: Required<TUpdateProductItem[]> }, productCode: string) {
    var bodyFormData = new FormData();
    console.log('call :::', data);
    data.items &&
      data.items.map((item, index) => {
        // English
        item['itemEnglish.codeTitle'] &&
          bodyFormData.append(`EnglishItems[${index}].CodeTitle`, item['itemEnglish.codeTitle']);
        bodyFormData.append(`EnglishItems[${index}].CodeItem`, item.codeItem);
        item['itemEnglish.itemIcon'][0] &&
          bodyFormData.append(
            `EnglishItems[${index}].Icon`,
            item['itemEnglish.itemIcon'][0].originFileObj
          );
        item['itemEnglish.price'] &&
          bodyFormData.append(`EnglishItems[${index}].Price`, item['itemEnglish.price'].toString());

        bodyFormData.append(
          `EnglishItems[${index}].Note`,
          item['itemEnglish.note'] ? item['itemEnglish.note'] : ''
        );
        item['itemEnglish.description'] &&
          item['itemEnglish.description'].length > 0 &&
          item['itemEnglish.description'].map((descEN, index2) =>
            bodyFormData.append(`EnglishItems[${index}].Description[${index2}]`, descEN)
          );

        // Vietnamese
        item['itemVietnamese.codeTitle'] &&
          bodyFormData.append(
            `VietnameseItems[${index}].CodeTitle`,
            item['itemVietnamese.codeTitle']
          );
        bodyFormData.append(`VietnameseItems[${index}].CodeItem`, item.codeItem);
        bodyFormData.append(
          `VietnameseItems[${index}].Icon`,
          item['itemVietnamese.itemIcon'][0].originFileObj
        );
        item['itemVietnamese.price'] &&
          bodyFormData.append(
            `VietnameseItems[${index}].Price`,
            item['itemVietnamese.price'].toString()
          );
        bodyFormData.append(
          `VietnameseItems[${index}].Note`,
          item['itemVietnamese.note'] ? item['itemVietnamese.note'] : ''
        );
        item['itemVietnamese.description'] &&
          item['itemVietnamese.description'].length > 0 &&
          item['itemVietnamese.description'].map((descEN, index2) =>
            bodyFormData.append(`VietnameseItems[${index}].Description[${index2}]`, descEN)
          );
      });

    // Only shows up in devtool (not here in this code snippet)
    console.table([...bodyFormData]);
    const url = `/Product/addItems?productCode=${productCode}`;
    return axiosClient.post(url, bodyFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
export default ProductApi;
