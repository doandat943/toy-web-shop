import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import { Input, InputNumber, Empty, Alert, Spin, Button } from 'antd'

import Header from '@/components/Header';
import Category from '@/components/Category';
import CKeditor from '@/components/CKEditor';
import RowProductVariant from '@/components/UpdateProductPage/RowProductVariant';
import Loading from '@/components/Loading';
import { swtoast } from "@/mixins/swal.mixin";
import { homeAPI } from '@/config'

const fakeProductDetail = {
    product_id: 1,
    product_name: 'Áo Nam Active Pro',
    category_id: 3,
    category_name: 'Áo T-Shirt',
    price: 179000,
    description: '<h1>Đây là một cái áo<h1>',
    product_variant_list: [
        {
            product_variant_id: 1,
            colour_id: 1,
            colour_name: 'Trắng',
            size_id: 1,
            size_name: 'S',
            quantity: 4,
            product_images: [
                { path: 'http://localhost:8080/static/images/35bd44e7-3969-4a28-9c32-077b9f85162c.jpg' },
                { path: 'http://localhost:8080/static/images/35bd44e7-3969-4a28-9c32-077b9f85162c.jpg' },
                { path: 'http://localhost:8080/static/images/35bd44e7-3969-4a28-9c32-077b9f85162c.jpg' },
            ]
        },
        {
            product_variant_id: 2,
            colour_id: 2,
            colour_name: 'Đen',
            size_id: 2,
            size_name: 'M',
            quantity: 13,
            product_images: [
                { path: 'http://localhost:8080/static/images/35bd44e7-3969-4a28-9c32-077b9f85162c.jpg' },
                { path: 'http://localhost:8080/static/images/35bd44e7-3969-4a28-9c32-077b9f85162c.jpg' },
                { path: 'http://localhost:8080/static/images/35bd44e7-3969-4a28-9c32-077b9f85162c.jpg' },
            ]
        },
    ]
}

const UpdateProductPage = () => {
    const { product_id } = Router.query

    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('')
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [apiCallInProgress, setApiCallInProgress] = useState(false);
    const [debugInfo, setDebugInfo] = useState('');

    const [productVariantList, setProductVariantList] = useState([]);
    const [rowProductVariant, setRowProductVariant] = useState([]);

    useEffect(() => {
        setEditorLoaded(true);
    }, []);

    useEffect(() => {
        const getProductDetail = async () => {
            // Kiểm tra product_id hợp lệ
            if (!product_id) {
                setError("ID sản phẩm không được cung cấp");
                setDebugInfo("Router.query.product_id: " + JSON.stringify(Router.query));
                return;
            }

            try {
                setIsLoading(true);
                setApiCallInProgress(true);
                setError(null);
                
                // In ra ID sản phẩm đang được yêu cầu để debug
                console.log("Đang tải sản phẩm ID:", product_id);
                setDebugInfo(`Đang gọi API: ${homeAPI}/product/admin/detail/${product_id}`);
                
                const result = await axios.get(`${homeAPI}/product/admin/detail/${product_id}`);
                
                // Kiểm tra kết quả API trả về
                console.log("API response:", result);
                setDebugInfo(debugInfo + `\nAPI trả về status: ${result.status}`);
                
                if (result && result.data) {
                    setProductId(result.data.product_id);
                    setProductName(result.data.product_name);
                    setCategoryId(result.data.category_id);
                    setCategoryName(result.data.category_name);
                    setPrice(result.data.price);
                    setDescription(result.data.description);
                    
                    // Kiểm tra product_variant_list có tồn tại không
                    if (result.data.product_variant_list) {
                        setProductVariantList(await convertProductVariantList(result.data.product_variant_list || []));
                    } else {
                        setDebugInfo(debugInfo + "\nKhông có danh sách variant trong dữ liệu sản phẩm");
                        setProductVariantList([]);
                    }
                } else {
                    console.error("Không có dữ liệu sản phẩm trả về");
                    setDebugInfo(debugInfo + "\nKhông có dữ liệu sản phẩm trả về từ API");
                    setError("Không tìm thấy thông tin sản phẩm!");
                }
            } catch (err) {
                console.error("Chi tiết lỗi:", err);
                let errorMsg = "Lỗi không xác định";

                // Hiển thị thêm thông tin lỗi chi tiết
                if (err.response) {
                    // Lỗi từ server với response
                    errorMsg = `Lỗi server: ${err.response.status}`;
                    console.error("Lỗi từ server:", err.response.status, err.response.data);
                    setDebugInfo(debugInfo + `\nLỗi API: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
                    
                    if (err.response.status === 400 || err.response.status === 404) {
                        errorMsg = "Không tìm thấy sản phẩm hoặc sản phẩm đã bị xóa";
                    } else if (err.response.status === 401 || err.response.status === 403) {
                        errorMsg = "Bạn không có quyền truy cập dữ liệu này";
                    } else if (err.response.status === 500) {
                        errorMsg = "Lỗi máy chủ nội bộ. Vui lòng thử lại sau.";
                    }
                } else if (err.request) {
                    // Lỗi không nhận được response
                    console.error("Không nhận được phản hồi từ server");
                    setDebugInfo(debugInfo + "\nKhông nhận được phản hồi từ server");
                    errorMsg = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối!";
                } else {
                    // Lỗi khác
                    console.error("Lỗi không xác định:", err.message);
                    setDebugInfo(debugInfo + `\nLỗi không xác định: ${err.message}`);
                    errorMsg = "Lỗi khi tải thông tin sản phẩm: " + err.message;
                }
                
                setError(errorMsg);
                swtoast.error({ text: errorMsg });
            } finally {
                setIsLoading(false);
                setApiCallInProgress(false);
            }
        }
        
        if (product_id) getProductDetail();
    }, [product_id]);

    useEffect(() => {
        let rowProductVariantTemp = [];
        for (let i in productVariantList) {
            rowProductVariantTemp.push(
                <RowProductVariant
                    key={i}
                    index={i}
                    productVariantList={productVariantList}
                    setProductVariantList={setProductVariantList}
                    setIsLoading={setIsLoading}
                    refreshPage={refreshPage}
                />
            );
        }
        setRowProductVariant(rowProductVariantTemp);
    }, [productVariantList]);

    const convertProductVariantList = async (productVariantList) => {
        if (!Array.isArray(productVariantList)) {
            console.error("product_variant_list không phải là mảng:", productVariantList);
            return [];
        }
        
        let productVariantListTemp = []
        for (let productVariant of productVariantList) {
            try {
                if (!productVariant || !productVariant.product_images) {
                    console.error("Variant không hợp lệ:", productVariant);
                    continue;
                }
                
                let productImages = productVariant.product_images;
                let fileList = [];
                
                if (Array.isArray(productImages)) {
                    for (let image of productImages) {
                        if (!image || !image.path) continue;
                        
                        try {
                            // Extract filename from path
                            let path = image.path;
                            let name = path.split('/').pop();
                            
                            // Create a file entry that will be recognized by Ant Design's Upload component
                            fileList.push({
                                uid: name,
                                name: name,
                                status: 'done',
                                url: path,
                                // Mark as existing URL - this is important for knowing it's already on server
                                isExternalUrl: true,
                                externalUrl: path
                            });
                        } catch (err) {
                            console.error("Lỗi xử lý ảnh:", err);
                        }
                    }
                }
                
                productVariantListTemp.push({
                    productVariantId: productVariant.product_variant_id,
                    colourId: productVariant.colour_id,
                    colourName: productVariant.colour_name || '',
                    sizeId: productVariant.size_id,
                    sizeName: productVariant.size_name || '',
                    quantity: productVariant.quantity || 0,
                    fileList
                });
            } catch (err) {
                console.error("Lỗi xử lý variant:", err);
            }
        }

        return productVariantListTemp;
    }

    const refreshPage = async () => {
        if (product_id) {
            try {
                setIsLoading(true);
                const result = await axios.get(`${homeAPI}/product/admin/detail/${product_id}`)
                if (result && result.data) {
                    setProductId(result.data.product_id);
                    setProductName(result.data.product_name);
                    setCategoryId(result.data.category_id);
                    setCategoryName(result.data.category_name);
                    setPrice(result.data.price);
                    setDescription(result.data.description);
                    
                    if (result.data.product_variant_list) {
                        setProductVariantList(await convertProductVariantList(result.data.product_variant_list));
                    } else {
                        setProductVariantList([]);
                    }
                } else {
                    swtoast.error({ text: 'Không tìm thấy thông tin sản phẩm!' });
                }
                setIsLoading(false);
            } catch (err) {
                console.error("Error refreshing page:", err);
                setIsLoading(false);
                
                if (err.response && err.response.status === 400) {
                    swtoast.error({ text: 'Không tìm thấy thông tin sản phẩm hoặc sản phẩm đã bị xóa' });
                } else {
                    swtoast.error({ text: 'Lỗi khi tải thông tin sản phẩm. Vui lòng thử lại sau!' });
                }
            }
        }
    }

    const updateProduct = async () => {
        if (Validate()) {
            try {
                setIsLoading(true)
                let updateProduct = {
                    product_id: productId,
                    product_name: productName,
                    category_id: categoryId,
                    price,
                    description
                }
                let result = await axios.put(`${homeAPI}/product/update`, updateProduct);
                console.log(result.data);
                for (let productVariant of productVariantList) {
                    let dataProductVariant = new FormData();
                    dataProductVariant.append('product_variant_id', productVariant.productVariantId);
                    dataProductVariant.append('quantity', productVariant.quantity);
                    
                    // Extract URLs from fileList items that have isExternalUrl flag
                    const imageUrls = [];
                    
                    for (let file of productVariant.fileList) {
                        if (file.isExternalUrl) {
                            // Add external URL to our URL array
                            imageUrls.push(file.externalUrl);
                        } else {
                            // Add regular file to FormData
                            dataProductVariant.append('product_images', file.originFileObj);
                        }
                    }
                    
                    // Add image URLs as JSON string if we have any
                    if (imageUrls.length > 0) {
                        dataProductVariant.append('imageUrls', JSON.stringify(imageUrls));
                    }
                    
                    let rsult = await axios.put(
                        `${homeAPI}/product-variant/update`,
                        dataProductVariant,
                        {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        }
                    );
                    console.log(rsult.data);
                }
                setIsLoading(false)
                swtoast.success({ text: 'Cập nhập sản phẩm thành công!' })
                refreshPage()
            } catch (err) {
                console.log(err);
                setIsLoading(false)
                swtoast.error({ text: 'Đã xảy ra lỗi khi cập nhật sản phẩm!' })
            }
        }
    }

    const Validate = () => {
        if (!productName) {
            swtoast.error({ text: 'Tên sản phẩm không được bỏ trống' })
            return false
        }
        if (!categoryId) {
            swtoast.error({ text: 'Danh mục sản phẩm không được bỏ trống' })
            return false
        }
        if (!price) {
            swtoast.error({ text: 'Giá sản phẩm không được bỏ trống' })
            return false
        }
        if (!description) {
            swtoast.error({ text: 'Mô tả sản phẩm không được bỏ trống' })
            return false
        }
        if (!productVariantList.length) {
            swtoast.error({ text: 'Sản phẩm phải có ít nhất 1 biến thể' })
            return false
        }
        for (const productVariant of productVariantList) {
            if (!productVariant.quantity) {
                swtoast.error({ text: 'Biến thể sản phẩm phải có ít nhất một tồn kho' })
                return false
            }
            if (!productVariant.fileList.length) {
                swtoast.error({ text: 'Biến thể sản phẩm phải có ít nhất một ảnh' })
                return false
            }
        }
        return true
    }

    if (!product_id) {
        return (
            <div className='update-product-page'>
                <Header title="Cập nhật sản phẩm" />
                <div className="update-product-form">
                    <Alert
                        message="Thiếu thông tin sản phẩm"
                        description="Không tìm thấy ID sản phẩm. Vui lòng quay lại trang danh sách sản phẩm và chọn sản phẩm cần chỉnh sửa."
                        type="error"
                        showIcon
                        action={
                            <Button 
                                size="small" 
                                danger
                                onClick={() => Router.push('/product/manage')}
                            >
                                Quay lại danh sách
                            </Button>
                        }
                    />
                </div>
            </div>
        );
    }

    return (
        <div className='update-product-page'>
            <Header title="Cập nhật sản phẩm" />
            <div className="update-product-form">
                {error ? (
                    <Alert
                        message="Lỗi tải dữ liệu sản phẩm"
                        description={error}
                        type="error"
                        showIcon
                        style={{ marginBottom: '20px' }}
                        action={
                            <Button 
                                size="small" 
                                danger
                                onClick={refreshPage}
                                disabled={apiCallInProgress}
                            >
                                Tải lại
                            </Button>
                        }
                    />
                ) : null}
                
                {process.env.NODE_ENV !== 'production' && debugInfo && (
                    <div className="debug-info" style={{ 
                        margin: '10px 0', 
                        padding: '10px', 
                        background: '#f0f0f0', 
                        border: '1px dashed #ccc',
                        whiteSpace: 'pre-wrap'
                    }}>
                        <h4>Debug Info:</h4>
                        <code>{debugInfo}</code>
                    </div>
                )}

                <Alert
                    message="Hướng dẫn thêm ảnh sản phẩm"
                    description="Bạn có thể thêm ảnh bằng cách nhập URL hình ảnh trực tiếp. Hỗ trợ các định dạng như jpg, png, gif, webp, v.v."
                    type="info"
                    showIcon
                    style={{ marginBottom: '20px' }}
                />
                
                {apiCallInProgress ? (
                    <div className="text-center py-5">
                        <Spin size="large" tip="Đang tải thông tin sản phẩm..." />
                    </div>
                ) : (
                    <>
                        {/* // Input Ten san pham */}
                        <div className="row">
                            <div className="col-6">
                                <label htmlFor='product-name' className="fw-bold">Tên sản phẩm:</label>
                                <Input
                                    id='product-name' placeholder='Nhập tên sản phẩm'
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                />
                            </div>
                        </div>
                        {/* // Component danh muc */}
                        <div className="row">
                            <div className="col-6">
                                <label htmlFor='product-category' className="fw-bold">Danh mục:</label>
                                <Category setCategoryId={setCategoryId} categoryName={categoryName} setCategoryName={setCategoryName} />
                            </div>
                            <div className="col-6">
                                <label htmlFor='product-price' className="fw-bold">Giá sản phẩm:</label>
                                <br />
                                <InputNumber
                                    id='product-price' placeholder='Nhập giá sản phẩm'
                                    value={price === 0 ? null : price}
                                    style={{ width: '100%' }}
                                    onChange={setPrice}
                                />
                            </div>
                        </div>
                        {/* // Mo ta san pham = CKEditor */}
                        <div className="description">
                            <label htmlFor='description' className="fw-bold">Mô tả sản phẩm:</label>
                            <div className="ckeditor-box">
                                <CKeditor
                                    Placeholder={{ placeholder: "Mô tả ..." }}
                                    name="description"
                                    id="description"
                                    form="add-product-form"
                                    data={description}
                                    onChange={(data) => {
                                        setDescription(data);
                                    }}
                                    editorLoaded={editorLoaded}
                                />
                            </div>
                        </div>
                        {/* dung Selected colour va Seleted size de tao bang Product-Variant */}
                        <div>
                            <label htmlFor='enter-name' className="fw-bold">Danh sách lựa chọn:</label>
                            <table className="table w-100 table-hover align-middle table-bordered">
                                <thead>
                                    <tr className='row-product-variant'>
                                        <th className='col-colour text-center' scope="col">Màu</th>
                                        <th className='col-size text-center' scope="col">Size</th>
                                        <th className='col-quantity text-center' scope="col">Tồn kho</th>
                                        <th className='col-image text-center' scope="col">Ảnh</th>
                                        <th className='col-delete text-center' scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rowProductVariant.length ? rowProductVariant : <tr><td colSpan={5}><Empty /></td></tr>}
                                </tbody>
                            </table>
                        </div>
                        <div className="btn-box text-left">
                            <button className='text-light bg-dark' onClick={updateProduct}>
                                Cập nhật sản phẩm
                            </button>
                        </div>
                    </>
                )}
            </div>
            {isLoading && <Loading />}
        </div>
    )
}

export default UpdateProductPage