import { StarFilled } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import { FaChild, FaCubes } from 'react-icons/fa';

import { formatRate } from '@/helpers/format';

const ProductItem = (props) => {
    // Hàm lấy label cho loại đồ chơi
    const getToyTypeLabel = (type) => {
        switch(type) {
            case 'educational': return 'Giáo dục';
            case 'physical': return 'Vận động';
            case 'building': return 'Xây dựng';
            case 'arts': return 'Nghệ thuật';
            case 'cognitive': return 'Trí tuệ';
            case 'outdoor': return 'Ngoài trời';
            default: return type;
        }
    };
    
    return (
        <div className="product-item col-6 col-md-4 col-lg-3">
            <div className="product-card">
                <Link
                    href={{
                        pathname: `/product/${props.product_id}`,
                        query: { colour: props.colour_id }
                    }}
                >
                    <div className='product-thumbnails position-relative'>
                        <Image className="img" src={props.img} fill alt={props.name} />
                        <div className="position-absolute rate-box">
                            <span className="d-flex justify-content-start align-items-center">
                                <span className="rating d-flex justify-content-start align-items-center">
                                    {formatRate(props.rating)}
                                </span>
                                <StarFilled className="d-flex justify-content-start align-items-center" />
                                <span className="feedback_quantity text-primary d-flex justify-content-start align-items-center">
                                    ⟮{props.feedback_quantity}⟯
                                </span>
                            </span>
                        </div>
                        
                        {/* Badge cho độ tuổi và loại đồ chơi */}
                        {props.ageRange && (
                            <div className="age-badge">
                                <FaChild /> {props.ageRange}
                            </div>
                        )}
                        
                        {/* Size box */}
                        <div className="size-box position-absolute">
                            {props.sizes && props.sizes.map((item, index) => {
                                return (
                                    <span className="size-item d-inline-block text-center" key={index}>
                                        {item}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </Link>
                
                <div className="infor-product">
                    <Link
                        href={{
                            pathname: `/product/${props.product_id}`,
                            query: { colour: props.colour_id }
                        }}
                    >
                        <h6>{props.name}</h6>
                    </Link>
                    
                    {/* Thông tin loại đồ chơi */}
                    {props.toyType && (
                        <div className="toy-type">
                            <FaCubes /> {getToyTypeLabel(props.toyType)}
                        </div>
                    )}
                    
                    <div className="d-flex justify-content-between align-items-center mt-2">
                        <p className="price-after text-danger fw-bold mb-0">{props.price}đ</p>
                        
                        {/* Thêm nút "Thêm vào giỏ" */}
                        <button className="btn btn-sm btn-add-cart">
                            <i className="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(ProductItem);
