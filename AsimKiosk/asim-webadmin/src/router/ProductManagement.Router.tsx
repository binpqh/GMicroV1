import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CreateProduct from '../pages/ProductManagement/Components/CreateProduct';

const ProductManagement = React.lazy(
  () => import('../pages/ProductManagement')
);
const DetailProduct = React.lazy(
  () => import('../pages/ProductManagement/Components/DetailProduct')
);

export default function ProductManagementRouter() {
  return (
    <Routes>
      <Route path="/" element={<ProductManagement />}></Route>
      <Route path="/createProduct" element={<CreateProduct />}></Route>
      <Route path="/:productCode" element={<DetailProduct />}></Route>
    </Routes>
  );
}
