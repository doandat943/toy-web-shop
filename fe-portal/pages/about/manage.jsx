import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Form, Button, message, Upload } from 'antd';

import Header from '@/components/Header';
import CKeditor from '@/components/CKEditor';
import { swtoast } from "@/mixins/swal.mixin";
import { homeAPI } from '@/config';
import { UploadOutlined } from '@ant-design/icons';

const AboutManagementPage = () => {
    const [form] = Form.useForm();
    const [aboutInfo, setAboutInfo] = useState(null);
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Các trường cho CKEditor
    const [content, setContent] = useState('');
    const [vision, setVision] = useState('');
    const [mission, setMission] = useState('');
    const [story, setStory] = useState('');
    
    const [bannerImage, setBannerImage] = useState('');
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        setEditorLoaded(true);
        fetchAboutInfo();
    }, []);

    const fetchAboutInfo = async () => {
        try {
            const response = await axios.get(`${homeAPI}/about/info`);
            setAboutInfo(response.data);
            
            // Cập nhật giá trị form
            form.setFieldsValue({
                title: response.data.title,
                banner_image: response.data.banner_image
            });
            
            // Cập nhật giá trị các trường CKEditor
            setContent(response.data.content || '');
            setVision(response.data.vision || '');
            setMission(response.data.mission || '');
            setStory(response.data.story || '');
            
            // Hiển thị ảnh preview
            if (response.data.banner_image) {
                setBannerImage(response.data.banner_image);
                setImagePreview(response.data.banner_image);
            }
        } catch (error) {
            console.error('Error fetching about info:', error);
            swtoast.error({ text: 'Lỗi khi tải thông tin' });
        }
    };

    const handleImageChange = (info) => {
        if (info.file.status === 'done') {
            const imageUrl = info.file.response.url || info.file.response.path;
            setBannerImage(imageUrl);
            setImagePreview(imageUrl);
            message.success(`${info.file.name} tải lên thành công`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} tải lên thất bại.`);
        }
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            
            const updateData = {
                about_id: aboutInfo?.about_id,
                title: values.title,
                content: content,
                vision: vision,
                mission: mission,
                story: story,
                banner_image: bannerImage
            };
            
            await axios.put(`${homeAPI}/about/update`, updateData);
            swtoast.success({ text: 'Cập nhật thông tin thành công' });
            await fetchAboutInfo(); // Làm mới thông tin
        } catch (error) {
            console.error('Error updating about info:', error);
            swtoast.error({ text: 'Lỗi khi cập nhật thông tin' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="about-management-page">
            <Header title="Quản lý trang giới thiệu" />
            
            <div className="about-management-form">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="p-4"
                >
                    <Form.Item
                        name="title"
                        label="Tiêu đề trang"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                    >
                        <Input placeholder="Nhập tiêu đề trang" />
                    </Form.Item>
                    
                    <Form.Item
                        name="banner_image"
                        label="Ảnh banner"
                    >
                        <div className="d-flex flex-column">
                            <Upload
                                name="image"
                                action={`${homeAPI}/upload/image`}
                                onChange={handleImageChange}
                                maxCount={1}
                                showUploadList={false}
                            >
                                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                            </Upload>
                            
                            {imagePreview && (
                                <div className="mt-3">
                                    <img 
                                        src={imagePreview} 
                                        alt="Banner Preview" 
                                        style={{ maxWidth: '100%', maxHeight: '200px' }} 
                                    />
                                </div>
                            )}
                        </div>
                    </Form.Item>
                    
                    <div className="mb-4">
                        <label className="form-label fw-bold">Nội dung chính</label>
                        <CKeditor
                            name="content"
                            value={content}
                            onChange={(data) => setContent(data)}
                            editorLoaded={editorLoaded}
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="form-label fw-bold">Tầm nhìn</label>
                        <CKeditor
                            name="vision"
                            value={vision}
                            onChange={(data) => setVision(data)}
                            editorLoaded={editorLoaded}
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="form-label fw-bold">Sứ mệnh</label>
                        <CKeditor
                            name="mission"
                            value={mission}
                            onChange={(data) => setMission(data)}
                            editorLoaded={editorLoaded}
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="form-label fw-bold">Câu chuyện của chúng tôi</label>
                        <CKeditor
                            name="story"
                            value={story}
                            onChange={(data) => setStory(data)}
                            editorLoaded={editorLoaded}
                        />
                    </div>
                    
                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={loading}
                            className="btn-dark"
                        >
                            Cập nhật thông tin
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default AboutManagementPage; 