import React, { useState, useEffect } from 'react';
import { Empty, Spin, Alert } from 'antd'
import axios from 'axios'

import Header from '@/components/Header'
import Heading from '@/components/Heading'
import ProductAdmin from '@/components/ProductManagementPage/ProductAdmin'
import Router from 'next/router'
import { swtoast } from "@/mixins/swal.mixin";

// const fakeData = [
//     {
//         product_id: 1,
//         product_variant_id: 1,
//         product_name: 'Áo Thun Active ProMax',
//         product_image: 'https://media.istockphoto.com/id/991436974/vi/vec-to/m%E1%BB%99t-s%E1%BB%91-th%C3%B9ng-h%C3%A0ng-gi%E1%BA%A5y-%C4%91%C6%B0%E1%BB%A3c-v%E1%BA%ADn-chuy%E1%BB%83n-b%E1%BA%B1ng-tr%E1%BB%B1c-th%C4%83ng-h%C3%ACnh-minh-h%E1%BB%8Da-vector.jpg?s=2048x2048&w=is&k=20&c=fEuc9_188HXkaeQdyWa6mVA4EUuAk4eyxia8-0x4Tg8=',
//         colour_name: 'Trắng', size_name: 'S',
//         price: 0, quantity: 0, state: true, created_at: '2023-03-04T03:50:21.000Z'
//     },
//     {
//         product_id: 1,
//         product_variant_id: 1,
//         product_name: 'Áo Thun Active ProMax',
//         product_image: 'https://media.istockphoto.com/id/991436974/vi/vec-to/m%E1%BB%99t-s%E1%BB%91-th%C3%B9ng-h%C3%A0ng-gi%E1%BA%A5y-%C4%91%C6%B0%E1%BB%A3c-v%E1%BA%ADn-chuy%E1%BB%83n-b%E1%BA%B1ng-tr%E1%BB%B1c-th%C4%83ng-h%C3%ACnh-minh-h%E1%BB%8Da-vector.jpg?s=2048x2048&w=is&k=20&c=fEuc9_188HXkaeQdyWa6mVA4EUuAk4eyxia8-0x4Tg8=',
//         colour_name: 'Trắng', size_name: 'S',
//         price: 0, quantity: 0, state: false, created_at: '2023-03-04T03:50:21.000Z'
//     },
// ];

const ProductManagementPage = () => {
    const [listProductVariant, setListProductVariant] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getListProductVariant();
    }, [])

    const getListProductVariant = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log("Đang tải danh sách sản phẩm...");
            
            const result = await axios.get('http://localhost:8080/api/product/admin/list');
            
            console.log("Kết quả API:", result.data);
            
            if (Array.isArray(result.data)) {
                setListProductVariant(result.data);
            } else {
                console.error("Dữ liệu không đúng định dạng:", result.data);
                setListProductVariant([]);
                setError("Dữ liệu sản phẩm không đúng định dạng");
            }
        } catch (err) {
            console.error("Lỗi khi tải sản phẩm:", err);
            setListProductVariant([]);
            
            if (err.response) {
                // Lỗi từ server với response
                setError(`Lỗi máy chủ: ${err.response.status} - ${err.response.data || 'Không có thông báo lỗi'}`);
            } else if (err.request) {
                // Lỗi không nhận được response
                setError("Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối và thử lại.");
            } else {
                // Lỗi khác
                setError(`Đã xảy ra lỗi: ${err.message}`);
            }
            
            swtoast.error({ text: 'Lỗi khi tải danh sách sản phẩm. Vui lòng thử lại sau!' });
        } finally {
            setLoading(false);
        }
    }

    const refreshProductVariantTable = async () => {
        await getListProductVariant();
    }

    return (
        <div className="product-manager">
            <Header title="Quản lý sản phẩm" />
            <div className="wrapper manager-box">
                <div className="to-add-product-page">
                    <button onClick={() => Router.push('/product/create')} className="to-add-product-page-btn">
                        Thêm sản phẩm
                    </button>
                </div>
                <Heading title="Tất cả sản phẩm" />
                
                {error && (
                    <Alert
                        message="Lỗi tải dữ liệu"
                        description={error}
                        type="error"
                        showIcon
                        style={{ marginBottom: '20px' }}
                        action={
                            <button 
                                onClick={getListProductVariant} 
                                className="btn btn-sm btn-danger"
                                disabled={loading}
                            >
                                Tải lại
                            </button>
                        }
                    />
                )}
                
                <div className="wrapper-product-admin table-responsive">
                    <table className='table product-admin w-100'>
                        <thead className="w-100 align-middle text-center">
                            <tr className="fs-6 w-100">
                                <th title='Tên sản phẩm' className="name col-infor-product">
                                    Sản phẩm
                                </th>
                                <th title='Giá sản phẩm' className="col-price">Giá</th>
                                <th title='Tồn kho' className="col-quantity">Tồn kho</th>
                                <th title="Thời gian tạo" className="col-createAt">Ngày tạo</th>
                                <th title="Trạng thái" className="col-state">Trạng thái</th>
                                <th title="Thao tác" className="col-action manipulation">Thao tác</th>
                            </tr>
                        </thead>
                    </table>
                    
                    {loading ? (
                        <div className="text-center py-5">
                            <Spin size="large" tip="Đang tải dữ liệu sản phẩm..." />
                        </div>
                    ) : listProductVariant.length ? (
                        listProductVariant.map((productVariant, index) => (
                            <ProductAdmin
                                key={index}
                                product_id={productVariant.product_id}
                                product_variant_id={productVariant.product_variant_id}
                                product_name={productVariant.product_name}
                                product_image={productVariant.product_image}
                                colour_name={productVariant.colour_name}
                                size_name={productVariant.size_name}
                                price={productVariant.price}
                                quantity={productVariant.quantity}
                                state={productVariant.state}
                                created_at={productVariant.created_at}
                                refreshProductVariantTable={refreshProductVariantTable}
                            />
                        ))
                    ) : (
                        <table className="table w-100 table-hover align-middle table-bordered" style={{ height: "400px" }}>
                            <tbody>
                                <tr><td colSpan={6}><Empty description="Không tìm thấy sản phẩm nào" /></td></tr>
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductManagementPage