import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { Row, Col, Spin } from 'antd';

import { homeAPI } from '../config.jsx';

const AboutUs = () => {
    const [aboutInfo, setAboutInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAboutInfo = async () => {
            try {
                const response = await axios.get(`${homeAPI}/about/info`);
                setAboutInfo(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching about info:', error);
                setLoading(false);
            }
        };

        fetchAboutInfo();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="about-us-page">
            <Head>
                <title>{aboutInfo?.title || 'Về chúng tôi'}</title>
                <meta name="description" content="Thông tin về cửa hàng đồ chơi của chúng tôi" />
            </Head>

            <div className="banner" style={{ backgroundImage: `url(${aboutInfo?.banner_image || '/images/default-banner.jpg'})` }}>
                <div className="container">
                    <h1 className="banner-title">{aboutInfo?.title || 'Về Chúng Tôi'}</h1>
                </div>
            </div>

            <div className="about-content py-5">
                <div className="container">
                    <Row gutter={[32, 32]}>
                        <Col xs={24} md={24}>
                            <div className="about-section">
                                <div className="section-content" dangerouslySetInnerHTML={{ __html: aboutInfo?.content || '' }}></div>
                            </div>
                        </Col>

                        <Col xs={24} md={12}>
                            <div className="about-section">
                                <h2 className="section-title">Tầm Nhìn</h2>
                                <div className="section-content" dangerouslySetInnerHTML={{ __html: aboutInfo?.vision || '' }}></div>
                            </div>
                        </Col>

                        <Col xs={24} md={12}>
                            <div className="about-section">
                                <h2 className="section-title">Sứ Mệnh</h2>
                                <div className="section-content" dangerouslySetInnerHTML={{ __html: aboutInfo?.mission || '' }}></div>
                            </div>
                        </Col>

                        <Col xs={24}>
                            <div className="about-section">
                                <h2 className="section-title">Câu Chuyện Của Chúng Tôi</h2>
                                <div className="section-content" dangerouslySetInnerHTML={{ __html: aboutInfo?.story || '' }}></div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            <style jsx>{`
                .banner {
                    height: 300px;
                    background-size: cover;
                    background-position: center;
                    display: flex;
                    align-items: center;
                    position: relative;
                }
                
                .banner::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                }
                
                .banner-title {
                    color: white;
                    font-size: 36px;
                    font-weight: bold;
                    position: relative;
                    z-index: 1;
                }
                
                .about-section {
                    margin-bottom: 2rem;
                }
                
                .section-title {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 1rem;
                    color: #333;
                    border-bottom: 2px solid #f0f0f0;
                    padding-bottom: 0.5rem;
                }
                
                .section-content {
                    font-size: 16px;
                    line-height: 1.6;
                }
            `}</style>
        </div>
    );
};

export default AboutUs; 