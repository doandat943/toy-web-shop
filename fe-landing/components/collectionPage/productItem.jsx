import { StarFilled } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

import { formatRate, formatPrice } from '@/helpers/format';

const ProductItem = (props) => {
    // Tính phần trăm giảm giá (nếu có old_price)
    const discount = props.old_price ? Math.round(((props.old_price - props.price) / props.old_price) * 100) : 0;
    
    // Độ tuổi (default hoặc từ props)
    const ageRange = props.age_range || "1-3 tuổi";
    
    // Tạo mảng sao đánh giá
    const renderStars = () => {
        const stars = [];
        const rating = props.rating || 5;
        for (let i = 0; i < 5; i++) {
            stars.push(
                <StarFilled 
                    key={i} 
                    className={i < rating ? "star-icon filled" : "star-icon"} 
                />
            );
        }
        return stars;
    };
    
    return (
        <div className="product-item col-6 col-md-4 col-lg-3 col-xl-3">
            <Link
                href={{
                    pathname: `/product/${props.product_id}`,
                    query: { colour: props.colour_id }
                }}
            >
                <div className='product-thumbnails position-relative'>
                    {/* Hiển thị độ tuổi */}
                    <div className="position-absolute age-range-badge">
                        {ageRange}
                    </div>
                    
                    {/* Hiển thị discount nếu có */}
                    {discount > 0 && (
                        <div className="position-absolute discount-badge">
                            -{discount}%
                        </div>
                    )}
                    
                    <Image 
                        className="img" 
                        src={props.img} 
                        fill 
                        sizes="(max-width: 576px) 50vw, (max-width: 768px) 33vw, (max-width: 992px) 25vw, 16vw"
                        priority={false}
                        quality={85}
                        alt={props.name} 
                    />
                    
                    {props.sizes && props.sizes.length > 0 && (
                        <div className="size-box position-absolute">
                            {props.sizes.map((item, index) => (
                                <span className="size-item d-inline-block text-center" key={index}>
                                    {item}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </Link>
            
            <div className="infor-product">
                {/* Đánh giá sao và số lượng */}
                <div className="rating-section mb-1">
                    <div className="stars-container">
                        {renderStars()}
                    </div>
                    <span className="review-count">({props.feedback_quantity || 0})</span>
                </div>
                
                <Link
                    href={{
                        pathname: `/product/${props.product_id}`,
                        query: { colour: props.colour_id }
                    }}
                >
                    <h6 className="product-name">{props.name}</h6>
                </Link>
                
                <div className="price-section">
                    <span className="price-current">{formatPrice(props.price)}đ</span>
                    {props.old_price && (
                        <span className="price-original">{formatPrice(props.old_price)}đ</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(ProductItem);
