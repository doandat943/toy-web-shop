import React, { useState } from 'react';
import { Modal, Upload, Input, Button, Tooltip, message } from 'antd';
import { PlusOutlined, LinkOutlined } from '@ant-design/icons';
import axios from 'axios';

const UploadImageBox = ({ index, productVariantList, setProductVariantList }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);

    const getBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

    const handleCancel = () => setPreviewOpen(false);
    const handleUrlModalCancel = () => setIsUrlModalOpen(false);
    const showUrlModal = () => setIsUrlModalOpen(true);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList }) => {
        let productVariantListClone = [...productVariantList];
        let fileListClone = [...fileList];
        for (let i = 0; i < fileListClone.length; i++) {
            fileListClone[i].status = 'done';
        }
        productVariantListClone[index].fileList = fileListClone;
        setProductVariantList(productVariantListClone);
    };

    const handleUrlChange = (e) => {
        setImageUrl(e.target.value);
    };

    const addImageFromUrl = async () => {
        if (!imageUrl) {
            message.error("Vui lòng nhập URL hình ảnh");
            return;
        }

        try {
            // Create a unique name based on URL
            const fileName = `url_image_${Date.now()}`;
            
            // Add to file list with URL
            let productVariantListClone = [...productVariantList];
            let fileListClone = [...productVariantListClone[index].fileList];
            
            // Add the URL directly
            fileListClone.push({
                uid: fileName,
                name: fileName,
                status: 'done',
                url: imageUrl,
                // Store the URL for backend processing
                isExternalUrl: true,
                externalUrl: imageUrl
            });
            
            productVariantListClone[index].fileList = fileListClone;
            setProductVariantList(productVariantListClone);
            
            setImageUrl('');
            setIsUrlModalOpen(false);
            message.success("Đã thêm hình ảnh từ URL");
        } catch (error) {
            console.error("Error adding image from URL:", error);
            message.error("Không thể thêm hình ảnh từ URL");
        }
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>
                Upload
            </div>
        </div>
    );

    return (
        <div className="upload-image-box">
            <div className="upload-buttons">
                <Button 
                    className="url-upload-button" 
                    icon={<LinkOutlined />} 
                    onClick={showUrlModal}
                    style={{ 
                        marginBottom: '10px',
                        height: '40px',
                        borderRadius: '8px',
                        border: '1px dashed #d9d9d9',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%'
                    }}
                >
                    Thêm ảnh từ URL
                </Button>
                
                <Upload
                    listType="picture-card"
                    fileList={productVariantList[index].fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    multiple={true}
                >
                    {productVariantList[index].fileList && productVariantList[index].fileList.length >= 6 ? null : uploadButton}
                </Upload>
            </div>
            
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
            
            <Modal
                title="Thêm ảnh từ URL"
                open={isUrlModalOpen}
                onCancel={handleUrlModalCancel}
                footer={[
                    <Button key="cancel" onClick={handleUrlModalCancel}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={addImageFromUrl}>
                        Thêm
                    </Button>
                ]}
            >
                <Input
                    placeholder="Nhập URL hình ảnh"
                    value={imageUrl}
                    onChange={handleUrlChange}
                    style={{ width: '100%' }}
                />
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
                    Lưu ý: URL phải trỏ trực tiếp đến file hình ảnh (jpg, png, gif, webp, v.v.)
                </div>
            </Modal>
        </div>
    );
};

export default UploadImageBox;
