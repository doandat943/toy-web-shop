import { Carousel } from 'antd';
import Image from 'next/image';

const CarouselFade = ({ imageList }) => {
    return (
        <Carousel>
            {imageList &&
                imageList.map((image, index) => {
                    return (
                        <div key={index}>
                            <div className="product-carousel-item position-relative" style={{ paddingTop: '100%' }}>
                                <Image 
                                    className="rounded" 
                                    src={image} 
                                    fill 
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    priority={index === 0}
                                    quality={90}
                                    style={{ objectFit: 'contain' }}
                                    alt={`Product image ${index + 1}`} 
                                />
                            </div>
                        </div>
                    );
                })}
        </Carousel>
    );
};

export default CarouselFade;
