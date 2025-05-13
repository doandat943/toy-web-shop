import { StarFilled } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

import { formatRate, formatPrice } from '@/helpers/format';

const ProductItem = (props) => {
    return (
        <div className="product-item col-6 col-md-4 col-lg-3 col-xl-2">
            <Link
                href={{
                    pathname: `/product/${props.product_id}`,
                    query: { colour: props.colour_id }
                }}
            >
                <div className='product-thumbnails position-relative'>
                    <Image 
                        className="img" 
                        src={props.img} 
                        fill 
                        sizes="(max-width: 576px) 50vw, (max-width: 768px) 33vw, (max-width: 992px) 25vw, 16vw"
                        priority={false}
                        quality={85}
                        alt={props.name} 
                    />
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
                <Link
                    href={{
                        pathname: `/product/${props.product_id}`,
                        query: { colour: props.colour_id }
                    }}
                >
                    <h6 className="product-name">{props.name}</h6>
                </Link>
                <div className="d-flex justify-content-start">
                    <p className="price-after text-danger fw-bold">{formatPrice(props.price)}đ</p>
                </div>
            </div>
        </div>
    );
};

export default memo(ProductItem);
