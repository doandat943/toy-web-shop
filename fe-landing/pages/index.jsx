import Slider from '@/components/slider';
import { ShoppingOutlined, GiftOutlined, CustomerServiceOutlined, TagOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import queries from '@/queries';

export default function HomePage() {
    const { data: productsData } = useQuery({
        ...queries.products.list()
    });
    
    const products = productsData?.data || [];

    // Toy categories with icons
    const toyCategories = [
        { name: "Đồ chơi mới", icon: <ShoppingOutlined />, href: "/collections" },
        { name: "Đồ chơi giáo dục", icon: <GiftOutlined />, href: "/collections" },
        { name: "Đồ chơi phổ biến", icon: <TagOutlined />, href: "/collections" },
        { name: "Liên hệ chúng tôi", icon: <CustomerServiceOutlined />, href: "/about-us" }
    ];

    // Product sections
    const productSections = [
        { title: "Đồ chơi trí tuệ", href: "/collections" },
        { title: "Đồ chơi tập nói", href: "/collections" },
        { title: "Đồ chơi vận động", href: "/collections" },
        { title: "Sản phẩm nổi bật", href: "/collections" },
    ];

    // Benefits
    const benefits = [
        { 
            title: "Giao hàng miễn phí", 
            description: "Áp dụng cho đơn hàng trên 500k trong phạm vi 10km", 
            icon: "/img/icons/shipping.png" 
        },
        { 
            title: "Hỗ trợ trực tuyến", 
            description: "Hỗ trợ 24/7 qua điện thoại và email", 
            icon: "/img/icons/support.png" 
        },
        { 
            title: "Thanh toán đa dạng", 
            description: "Hỗ trợ thanh toán qua thẻ, chuyển khoản, COD", 
            icon: "/img/icons/payment.png" 
        },
        { 
            title: "Quà tặng hấp dẫn", 
            description: "Nhận quà hấp dẫn khi mua sắm tại Kalo Toys", 
            icon: "/img/icons/gift.png" 
        }
    ];

    return (
        <div className="homepage">
            {/* Main slider */}
            <div className="main-banner">
                <Slider />
                <div className="promo-banner">
                    <h2>VUI ĐÙA MỖI NGÀY</h2>
                    <h3>CHỌN ĐỒ CHƠI LIỀN TAY</h3>
                    <div className="discount-badge">-25%</div>
                    <button className="shop-now-btn">MUA NGAY</button>
                </div>
            </div>

            {/* Featured products section */}
            <div className="featured-products container py-4">
                <h2 className="section-title text-center mb-4">Đã đặt niềm tin vững chắc vào website</h2>
                <div className="row">
                    {products.slice(0, 4).map((product, index) => (
                        <div className="col-md-3 mb-4" key={index}>
                            <div className="product-card">
                                <div className="product-image position-relative">
                                    <Link href={`/product/${product.product_id}`}>
                                        {product.product_image && (
                                            <Image 
                                                src={product.product_image} 
                                                alt={product.product_name} 
                                                width={250}
                                                height={250}
                                                layout="responsive"
                                                className="img-fluid"
                                            />
                                        )}
                                    </Link>
                                    <div className="social-icons">
                                        <span className="icon fb">f</span>
                                        <span className="icon insta">i</span>
                                        <span className="icon cart">c</span>
                                    </div>
                                </div>
                                <div className="product-info p-2 text-center">
                                    <h5 className="product-title">
                                        <Link href={`/product/${product.product_id}`}>
                                            {product.product_name}
                                        </Link>
                                    </h5>
                                    <div className="product-price">
                                        <span className="price">{product.price?.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                    <button className="add-to-cart-btn">Thêm vào giỏ</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Categories with icons */}
            <div className="categories-section container-fluid py-4">
                <div className="container">
                    <h3 className="text-center mb-4">Hội ứng bé - tìm đồ chơi</h3>
                    <div className="row">
                        {toyCategories.map((category, index) => (
                            <div className="col-md-3 text-center mb-3" key={index}>
                                <Link href={category.href} className="category-item">
                                    <div className="category-icon">
                                        {category.icon}
                                    </div>
                                    <p className="category-name">{category.name}</p>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Brand logos */}
            <div className="brands-section container py-3">
                <h3 className="text-center mb-3">Bằng chứng dẫn</h3>
                <div className="row">
                    {[1, 2, 3, 4, 5].map((brand) => (
                        <div className="col text-center" key={brand}>
                            <div className="brand-logo">
                                <span className="circle-logo">Logo {brand}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Multiple product sections */}
            {productSections.map((section, sectionIndex) => (
                <div className="product-section container py-4" key={sectionIndex}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="section-title">{section.title}</h3>
                        <Link href={section.href} className="view-all-btn">Xem tất cả</Link>
                    </div>
                    <div className="row">
                        {products.slice(0, 4).map((product, index) => (
                            <div className="col-md-3 mb-4" key={index}>
                                <div className="product-card">
                                    <div className="product-image position-relative">
                                        <Link href={`/product/${product.product_id}`}>
                                            {product.product_image && (
                                                <Image 
                                                    src={product.product_image} 
                                                    alt={product.product_name} 
                                                    width={250}
                                                    height={250}
                                                    layout="responsive"
                                                    className="img-fluid"
                                                />
                                            )}
                                        </Link>
                                        <div className="social-icons">
                                            <span className="icon fb">f</span>
                                            <span className="icon insta">i</span>
                                            <span className="icon cart">c</span>
                                        </div>
                                    </div>
                                    <div className="product-info p-2 text-center">
                                        <h5 className="product-title">
                                            <Link href={`/product/${product.product_id}`}>
                                                {product.product_name}
                                            </Link>
                                        </h5>
                                        <div className="product-price">
                                            <span className="price">{product.price?.toLocaleString('vi-VN')} đ</span>
                                        </div>
                                        <button className="add-to-cart-btn">Thêm vào giỏ</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Trust section */}
            <div className="trust-section container-fluid py-5 bg-light">
                <div className="container">
                    <h3 className="text-center mb-5">Tự vui hàng chính phúc trẻ giỏi</h3>
                    <p className="text-center mb-5">
                        Đồ chơi trẻ em KALO TOYS cung cấp đồ chơi trẻ em nhập khẩu chính hãng <br/>
                        Đủ tiêu chuẩn an toàn cho bé yêu, kích thích phát triển trí tuệ, cảm quan, vận động
                    </p>
                    <div className="row">
                        {benefits.map((benefit, index) => (
                            <div className="col-md-3 text-center mb-4" key={index}>
                                <div className="benefit-icon">
                                    <Image 
                                        src={benefit.icon} 
                                        alt={benefit.title} 
                                        width={50}
                                        height={50}
                                        className="img-fluid"
                                    />
                                </div>
                                <h5 className="benefit-title mt-3">{benefit.title}</h5>
                                <p className="benefit-desc">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
