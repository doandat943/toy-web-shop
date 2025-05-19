import { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Select, Slider, Button, Radio, Card, Row, Col, Steps } from 'antd';
import { FaGift, FaBirthdayCake, FaStar, FaChild, FaQuestionCircle } from 'react-icons/fa';

const { Option } = Select;
const { Step } = Steps;

export default function GiftFinder() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        age: null,
        occasion: null,
        interests: [],
        budget: [200000, 500000],
        gender: 'any'
    });
    
    const handleFormChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    
    const nextStep = () => {
        setCurrentStep(currentStep + 1);
    };
    
    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };
    
    const handleSubmit = () => {
        // Chuyển hướng đến trang collections với các bộ lọc
        const query = {};
        
        if (formData.age) {
            query.age = formData.age;
        }
        
        if (formData.interests && formData.interests.length > 0) {
            query.type = formData.interests.join(',');
        }
        
        // Thêm các tham số khác nếu cần
        router.push({
            pathname: '/collections',
            query
        });
    };
    
    const occasions = [
        { value: 'birthday', label: 'Sinh nhật', icon: <FaBirthdayCake /> },
        { value: 'achievement', label: 'Thưởng thành tích', icon: <FaStar /> },
        { value: 'holiday', label: 'Lễ/Tết', icon: <FaGift /> },
        { value: 'development', label: 'Phát triển kỹ năng', icon: <FaChild /> },
        { value: 'other', label: 'Khác', icon: <FaQuestionCircle /> }
    ];
    
    const interests = [
        { value: 'educational', label: 'Giáo dục' },
        { value: 'physical', label: 'Vận động' },
        { value: 'building', label: 'Xây dựng' },
        { value: 'arts', label: 'Nghệ thuật' },
        { value: 'cognitive', label: 'Trí tuệ' },
        { value: 'outdoor', label: 'Ngoài trời' }
    ];
    
    const ageGroups = [
        { value: 'infant', label: '0-1 tuổi' },
        { value: 'toddler', label: '1-3 tuổi' },
        { value: 'preschool', label: '3-6 tuổi' },
        { value: 'school', label: '6-12 tuổi' }
    ];
    
    return (
        <div className="gift-finder-page container pt-5 mt-5">
            <div className="row justify-content-center">
                <div className="col-md-10 col-lg-8">
                    <div className="gift-finder-header text-center mb-5">
                        <h1 className="gift-finder-title">Tìm quà tặng hoàn hảo</h1>
                        <p className="gift-finder-subtitle">
                            Trả lời một vài câu hỏi để chúng tôi gợi ý món quà phù hợp nhất cho bé
                        </p>
                        
                        <Steps current={currentStep} className="gift-finder-steps mb-5">
                            <Step title="Độ tuổi" description="Tuổi của bé" />
                            <Step title="Dịp tặng" description="Dịp đặc biệt" />
                            <Step title="Sở thích" description="Bé thích gì" />
                            <Step title="Ngân sách" description="Khoảng giá" />
                        </Steps>
                    </div>
                    
                    <Card className="gift-finder-card">
                        {currentStep === 0 && (
                            <div className="step-content">
                                <h3 className="step-title">Bé bao nhiêu tuổi?</h3>
                                <p className="step-description">Độ tuổi của bé sẽ giúp chúng tôi gợi ý đồ chơi phù hợp với giai đoạn phát triển</p>
                                
                                <div className="age-selection my-4">
                                    <Row gutter={16}>
                                        {ageGroups.map(age => (
                                            <Col span={12} md={6} key={age.value}>
                                                <Card 
                                                    hoverable
                                                    className={`age-card text-center ${formData.age === age.value ? 'selected' : ''}`}
                                                    onClick={() => handleFormChange('age', age.value)}
                                                >
                                                    <FaChild className="age-icon" />
                                                    <div className="age-label">{age.label}</div>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                                
                                <div className="d-flex justify-content-between mt-4">
                                    <Button type="default" disabled>Quay lại</Button>
                                    <Button 
                                        type="primary" 
                                        onClick={nextStep}
                                        disabled={!formData.age}
                                    >
                                        Tiếp tục
                                    </Button>
                                </div>
                            </div>
                        )}
                        
                        {currentStep === 1 && (
                            <div className="step-content">
                                <h3 className="step-title">Dịp tặng quà đặc biệt</h3>
                                <p className="step-description">Cho chúng tôi biết dịp đặc biệt bạn đang tìm quà</p>
                                
                                <div className="occasion-selection my-4">
                                    <Row gutter={[16, 16]}>
                                        {occasions.map(occasion => (
                                            <Col span={12} key={occasion.value}>
                                                <Card 
                                                    hoverable
                                                    className={`occasion-card ${formData.occasion === occasion.value ? 'selected' : ''}`}
                                                    onClick={() => handleFormChange('occasion', occasion.value)}
                                                >
                                                    <div className="d-flex align-items-center">
                                                        <div className="occasion-icon me-3">
                                                            {occasion.icon}
                                                        </div>
                                                        <div className="occasion-label">{occasion.label}</div>
                                                    </div>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                                
                                <div className="d-flex justify-content-between mt-4">
                                    <Button type="default" onClick={prevStep}>Quay lại</Button>
                                    <Button 
                                        type="primary" 
                                        onClick={nextStep}
                                        disabled={!formData.occasion}
                                    >
                                        Tiếp tục
                                    </Button>
                                </div>
                            </div>
                        )}
                        
                        {currentStep === 2 && (
                            <div className="step-content">
                                <h3 className="step-title">Sở thích của bé</h3>
                                <p className="step-description">Bé thích hoạt động nào? (Có thể chọn nhiều)</p>
                                
                                <div className="interests-selection my-4">
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="Chọn những sở thích của bé"
                                        value={formData.interests}
                                        onChange={(value) => handleFormChange('interests', value)}
                                        optionLabelProp="label"
                                    >
                                        {interests.map(interest => (
                                            <Option key={interest.value} value={interest.value} label={interest.label}>
                                                <div className="interest-option">
                                                    {interest.label}
                                                </div>
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                                
                                <div className="gender-selection my-4">
                                    <h5>Giới tính</h5>
                                    <Radio.Group
                                        value={formData.gender}
                                        onChange={(e) => handleFormChange('gender', e.target.value)}
                                    >
                                        <Radio value="any">Không phân biệt</Radio>
                                        <Radio value="boy">Bé trai</Radio>
                                        <Radio value="girl">Bé gái</Radio>
                                    </Radio.Group>
                                </div>
                                
                                <div className="d-flex justify-content-between mt-4">
                                    <Button type="default" onClick={prevStep}>Quay lại</Button>
                                    <Button 
                                        type="primary" 
                                        onClick={nextStep}
                                        disabled={formData.interests.length === 0}
                                    >
                                        Tiếp tục
                                    </Button>
                                </div>
                            </div>
                        )}
                        
                        {currentStep === 3 && (
                            <div className="step-content">
                                <h3 className="step-title">Ngân sách</h3>
                                <p className="step-description">Khoảng giá bạn muốn chi cho món quà này</p>
                                
                                <div className="budget-selection my-4">
                                    <Slider
                                        range
                                        min={50000}
                                        max={2000000}
                                        step={50000}
                                        value={formData.budget}
                                        onChange={(value) => handleFormChange('budget', value)}
                                        tipFormatter={(value) => `${value.toLocaleString()}đ`}
                                    />
                                    <div className="d-flex justify-content-between mt-2 mb-4">
                                        <span>{formData.budget[0].toLocaleString()}đ</span>
                                        <span>{formData.budget[1].toLocaleString()}đ</span>
                                    </div>
                                </div>
                                
                                <div className="d-flex justify-content-between mt-4">
                                    <Button type="default" onClick={prevStep}>Quay lại</Button>
                                    <Button 
                                        type="primary" 
                                        onClick={handleSubmit}
                                    >
                                        Tìm quà tặng
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
} 