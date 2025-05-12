import { Button, Card, Col, Form, Input, Row, Spin, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Header from '@/components/Header';
import { homeAPI, portalAPI } from '@/config';

const WebsiteInfoManagement = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [websiteInfo, setWebsiteInfo] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    useEffect(() => {
        const fetchWebsiteInfo = async () => {
            try {
                const response = await axios.get(`${portalAPI}/website-info/info`);
                setWebsiteInfo(response.data);
                form.setFieldsValue({
                    website_name: response.data.website_name,
                    website_logo: response.data.website_logo,
                    company_name: response.data.company_name,
                    company_info: response.data.company_info,
                    hotline: response.data.hotline,
                    hotline_hours: response.data.hotline_hours,
                    email: response.data.email,
                    facebook_link: response.data.facebook_link,
                    zalo_link: response.data.zalo_link,
                    tiktok_link: response.data.tiktok_link,
                    instagram_link: response.data.instagram_link,
                    youtube_link: response.data.youtube_link,
                });
                setLogoPreview(response.data.website_logo);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching website info:', error);
                message.error('Không thể tải thông tin website');
                setLoading(false);
            }
        };

        fetchWebsiteInfo();
    }, [form]);

    const handleLogoChange = (info) => {
        if (info.file) {
            setLogoFile(info.file);
            const reader = new FileReader();
            reader.onload = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(info.file);
        }
    };

    const uploadLogo = async () => {
        if (!logoFile) return null;

        const formData = new FormData();
        formData.append('image', logoFile);

        try {
            console.log('Uploading logo:', logoFile);
            const response = await axios.post(`${portalAPI}/upload/single`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Upload response:', response.data);
            
            if (response.data && response.data.path) {
                // Sử dụng đường dẫn được trả về từ server
                const path = response.data.path;
                message.success('Tải ảnh logo thành công');
                return path;
            } else {
                throw new Error('Path not found in response');
            }
        } catch (error) {
            console.error('Error uploading logo:', error);
            message.error('Không thể tải lên logo: ' + (error.response?.data || error.message));
            return null;
        }
    };

    const handleSubmit = async (values) => {
        setSaving(true);
        try {
            let logoPath = values.website_logo;
            if (logoFile) {
                const uploadedLogoPath = await uploadLogo();
                if (uploadedLogoPath) {
                    logoPath = uploadedLogoPath;
                }
            }

            const dataToSubmit = {
                ...values,
                website_info_id: websiteInfo?.website_info_id,
                website_logo: logoPath,
            };

            await axios.put(`${portalAPI}/website-info/update`, dataToSubmit);
            message.success('Cập nhật thông tin website thành công');
        } catch (error) {
            console.error('Error updating website info:', error);
            message.error('Không thể cập nhật thông tin website');
        } finally {
            setSaving(false);
        }
    };

    const uploadButton = (
        <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Tải lên</div>
        </div>
    );

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="website-info-management-page">
            <Header title="Quản lý thông tin website" />
            
            <Card title="Quản lý thông tin website" bordered={false}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={websiteInfo || {}}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="website_name"
                                label="Tên website"
                                rules={[{ required: true, message: 'Vui lòng nhập tên website' }]}
                            >
                                <Input placeholder="Nhập tên website" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="website_logo" label="Logo website" hidden>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Tải lên logo">
                                <Upload
                                    accept="image/*"
                                    listType="picture-card"
                                    showUploadList={false}
                                    beforeUpload={() => false}
                                    onChange={handleLogoChange}
                                >
                                    {logoPreview ? (
                                        <img
                                            src={logoPreview.startsWith('data:') ? logoPreview : `${homeAPI}/static${logoPreview}`}
                                            alt="Logo"
                                            style={{ width: '100%', maxHeight: '100px' }}
                                        />
                                    ) : (
                                        uploadButton
                                    )}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="company_name"
                                label="Tên công ty"
                                rules={[{ required: true, message: 'Vui lòng nhập tên công ty' }]}
                            >
                                <Input placeholder="Nhập tên công ty" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email' },
                                    { type: 'email', message: 'Email không hợp lệ' }
                                ]}
                            >
                                <Input placeholder="Nhập email liên hệ" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="hotline"
                                label="Hotline"
                                rules={[{ required: true, message: 'Vui lòng nhập số hotline' }]}
                            >
                                <Input placeholder="Nhập số hotline" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="hotline_hours"
                                label="Giờ làm việc"
                            >
                                <Input placeholder="Nhập giờ làm việc, ví dụ: (8:30-22:00)" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="company_info"
                        label="Thông tin công ty"
                        rules={[{ required: true, message: 'Vui lòng nhập thông tin công ty' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Nhập thông tin chi tiết về công ty" />
                    </Form.Item>

                    <h3>Liên kết mạng xã hội</h3>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="facebook_link" label="Facebook">
                                <Input placeholder="Nhập link Facebook" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="zalo_link" label="Zalo">
                                <Input placeholder="Nhập link Zalo" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="tiktok_link" label="TikTok">
                                <Input placeholder="Nhập link TikTok" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="instagram_link" label="Instagram">
                                <Input placeholder="Nhập link Instagram" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="youtube_link" label="YouTube">
                                <Input placeholder="Nhập link YouTube" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={saving}>
                            {saving ? 'Đang lưu...' : 'Lưu thông tin'}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default WebsiteInfoManagement; 