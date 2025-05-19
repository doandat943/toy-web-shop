import Slider from '@/components/slider';
import { GiftOutlined, SafetyOutlined, SmileOutlined, RocketOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="homepage toy-shop">
            <div className="container-fluid g-0">
                <Slider />
            </div>
            
            {/* Danh mục nổi bật */}
            <div className="featured-categories container mt-5">
                <h2 className="text-center mb-4 toy-title">Khám phá thế giới đồ chơi</h2>
                <div className="row g-4">
                    <div className="col-md-3 col-6">
                        <Link href="/collections?age=infant" className="category-card">
                            <div className="category-icon">
                                <SmileOutlined />
                            </div>
                            <h4>Đồ chơi cho bé 0-1 tuổi</h4>
                            <p>Kích thích giác quan và phát triển vận động</p>
                        </Link>
                    </div>
                    <div className="col-md-3 col-6">
                        <Link href="/collections?age=toddler" className="category-card">
                            <div className="category-icon">
                                <RocketOutlined />
                            </div>
                            <h4>Đồ chơi cho bé 1-3 tuổi</h4>
                            <p>Phát triển trí tưởng tượng và kỹ năng vận động</p>
                        </Link>
                    </div>
                    <div className="col-md-3 col-6">
                        <Link href="/collections?age=preschool" className="category-card">
                            <div className="category-icon">
                                <SafetyOutlined />
                            </div>
                            <h4>Đồ chơi cho bé 3-6 tuổi</h4>
                            <p>Phát triển trí tuệ và kỹ năng xã hội</p>
                        </Link>
                    </div>
                    <div className="col-md-3 col-6">
                        <Link href="/collections?age=school" className="category-card">
                            <div className="category-icon">
                                <GiftOutlined />
                            </div>
                            <h4>Đồ chơi cho bé 6-12 tuổi</h4>
                            <p>Khám phá, sáng tạo và giải trí</p>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Banner quảng cáo chính */}
            <div className="homepage-featured container-fluid g-0 mt-5">
                <div className="row g-0">
                    <div className="homepage-featured-left col-md-5 bg-primary text-light">
                        <h2 className="content_h2">
                            Đồ chơi giáo dục <br /> Phát triển toàn diện
                        </h2>
                        <p className="content_p">
                            Đồ chơi được thiết kế bởi chuyên gia giáo dục <br />
                            phát triển kỹ năng toàn diện cho trẻ
                        </p>
                        <div>
                            <button className="btn btn-light">Khám phá ngay</button>
                        </div>
                    </div>
                    <div className="homepage-featured-right col-md-7 position-relative">
                        <Image src={'/img/homepage/toys-banner.jpg'} fill alt="educational-toys" 
                               style={{objectFit: 'cover'}} />
                    </div>
                </div>
            </div>

            {/* Chia theo loại đồ chơi */}
            <div className="toy-categories container mt-5">
                <h2 className="text-center mb-4 toy-title">Đồ chơi theo sở thích</h2>
                <div className="row">
                    <div className="col-md-6">
                        <div className="toy-category-card position-relative">
                            <Image src={'/img/homepage/building-toys.jpg'} width={500} height={300} 
                                   alt="building-toys" style={{objectFit: 'cover', borderRadius: '15px'}} />
                            <div className="toy-category-content position-absolute">
                                <h3>Đồ chơi xây dựng</h3>
                                <p>
                                    Phát triển khả năng tư duy không gian và sáng tạo
                                </p>
                                <div>
                                    <button className="btn btn-primary">Xem thêm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="toy-category-card position-relative">
                            <Image src={'/img/homepage/outdoor-toys.jpg'} width={500} height={300} 
                                   alt="outdoor-toys" style={{objectFit: 'cover', borderRadius: '15px'}} />
                            <div className="toy-category-content position-absolute">
                                <h3>Đồ chơi vận động</h3>
                                <p>
                                    Phát triển thể chất và vui chơi ngoài trời
                                </p>
                                <div>
                                    <button className="btn btn-success">Xem thêm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Giá trị của đồ chơi */}
            <div className="toy-values container mt-5 mb-5">
                <h2 className="text-center mb-4 toy-title">Vì sao chọn chúng tôi?</h2>
                <div className="row">
                    <div className="col-md-4">
                        <div className="value-card text-center">
                            <div className="value-icon">
                                <SafetyOutlined style={{ fontSize: '48px', color: '#FF6B6B' }} />
                            </div>
                            <h4>An toàn tuyệt đối</h4>
                            <p>Đạt chuẩn an toàn quốc tế, không chứa chất độc hại</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="value-card text-center">
                            <div className="value-icon">
                                <SmileOutlined style={{ fontSize: '48px', color: '#4ECDC4' }} />
                            </div>
                            <h4>Phát triển toàn diện</h4>
                            <p>Được thiết kế để phát triển nhiều kỹ năng cho trẻ</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="value-card text-center">
                            <div className="value-icon">
                                <GiftOutlined style={{ fontSize: '48px', color: '#FFD166' }} />
                            </div>
                            <h4>Quà tặng ý nghĩa</h4>
                            <p>Đồ chơi là món quà mang giá trị giáo dục cho trẻ</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
