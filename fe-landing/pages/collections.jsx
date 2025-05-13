import { useQuery } from '@tanstack/react-query';
import { Empty } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import ProductItem from '@/components/collectionPage/productItem';
import queries from '@/queries';

const CollectionPage = () => {
    const router = useRouter();
    const { category } = router.query;
    const [uniqueProducts, setUniqueProducts] = useState([]);

    const { isError, error, data, isLoading } = useQuery(queries.products.list(category));
    if (isError) console.log(error);
    
    useEffect(() => {
        if (data?.data && data.data.length > 0) {
            // Group products by product_id and take only the first variant of each product
            const productMap = new Map();
            
            data.data.forEach(product => {
                if (!productMap.has(product.product_id)) {
                    productMap.set(product.product_id, product);
                }
            });
            
            // Convert Map values to array
            const uniqueProductList = Array.from(productMap.values());
            setUniqueProducts(uniqueProductList);
        } else {
            setUniqueProducts([]);
        }
    }, [data]);

    return (
        <div className="product-page container pt-4">
            <div className="product-list row">
                {isLoading ? (
                    <div className="d-flex" style={{ width: '100%', height: '400px' }}>
                        <div className="m-auto">Đang tải sản phẩm...</div>
                    </div>
                ) : uniqueProducts && uniqueProducts.length ? (
                    uniqueProducts.map((product, index) => {
                        return (
                            <ProductItem
                                key={product.product_id}
                                product_id={product.product_id}
                                name={product.product_name}
                                img={product.product_image}
                                price={product.price}
                                colour_id={product.colour_id}
                                sizes={product.sizes || []}
                                rating={product.rating}
                                feedback_quantity={product.feedback_quantity}
                            />
                        );
                    })
                ) : (
                    <div className="d-flex" style={{ width: '100%', height: '400px' }}>
                        <Empty style={{ margin: 'auto' }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollectionPage;
