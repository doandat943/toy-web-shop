import { useQuery } from '@tanstack/react-query';
import { Empty, Breadcrumb, Select, Radio } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import ProductItem from '@/components/collectionPage/productItem';
import queries from '@/queries';

// Mẫu độ tuổi để hiển thị (sẽ được gán ngẫu nhiên cho sản phẩm nếu không có dữ liệu thực)
const AGE_RANGES = ["0-3 tuổi", "1-3 tuổi", "3-4 tuổi", "2-6 tuổi", "2-5 tuổi"];

// Bộ lọc độ tuổi 
const AGE_FILTERS = [
    { label: "Tất cả", value: "all" },
    { label: "0-3 tuổi", value: "0-3" },
    { label: "1-3 tuổi", value: "1-3" },
    { label: "2-5 tuổi", value: "2-5" },
    { label: "Trên 2 tuổi", value: "2+" }
];

// Bộ lọc sắp xếp
const SORT_OPTIONS = [
    { label: "Mới nhất", value: "newest" },
    { label: "Giá tăng dần", value: "price_asc" },
    { label: "Giá giảm dần", value: "price_desc" },
    { label: "Bán chạy nhất", value: "bestseller" }
];

// Lợi ích của đồ chơi
const BENEFITS = [
    {
        title: "Thời gian chất lượng",
        icon: "/img/icons/time.png",
        description: "Mỗi ngày bận rộn cùng bé vui Kalo Play sẽ giúp con bạn phát triển tư duy, ngôn ngữ theo từng giai đoạn."
    },
    {
        title: "Đồ chơi phù hợp",
        icon: "/img/icons/toys.png",
        description: "Tích hợp nghiên cứu khoa học vào đồ chơi, đảm bảo trẻ có trải nghiệm học hấp dẫn và bổ ích."
    },
    {
        title: "An toàn và bền vững",
        icon: "/img/icons/safety.png",
        description: "KaloToys sử dụng gỗ Plywood cao cấp, công nghệ in UV để đảm bảo đồ bền và an toàn cho bé."
    },
    {
        title: "Hoàn tiền trong 7 ngày",
        icon: "/img/icons/refund.png",
        description: "Nếu mẹ không hài lòng với sản phẩm của KaloToys, chúng tôi sẽn sàng hoàn tiền với mọi lý do."
    }
];

const CollectionPage = () => {
    const router = useRouter();
    const { category } = router.query;
    const [uniqueProducts, setUniqueProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [ageFilter, setAgeFilter] = useState("all");
    const [sortOption, setSortOption] = useState("newest");
    const [categoryTitle, setCategoryTitle] = useState("Bảng bận rộn");

    const { isError, error, data, isLoading } = useQuery(queries.products.list(category));
    if (isError) console.log(error);
    
    useEffect(() => {
        // Set category title based on URL or use default
        if (category) {
            setCategoryTitle(category === "bang-ban-ron" ? "Bảng bận rộn" : 
                             category === "do-choi-montessori" ? "Đồ chơi Montessori" : 
                             "Tất cả sản phẩm");
        }
        
        if (data?.data && data.data.length > 0) {
            // Group products by product_id and take only the first variant of each product
            const productMap = new Map();
            
            data.data.forEach(product => {
                if (!productMap.has(product.product_id)) {
                    // Tính giá gốc (giả sử giá gốc cao hơn 10-40% so với giá hiện tại)
                    const discountPercent = Math.floor(Math.random() * 31) + 10; // 10-40%
                    const oldPrice = product.price ? Math.round(product.price * (100 / (100 - discountPercent))) : null;
                    
                    // Gán độ tuổi ngẫu nhiên
                    const ageRangeIndex = Math.floor(Math.random() * AGE_RANGES.length);
                    
                    // Gộp dữ liệu
                    const enhancedProduct = {
                        ...product,
                        old_price: oldPrice,
                        age_range: AGE_RANGES[ageRangeIndex]
                    };
                    
                    productMap.set(product.product_id, enhancedProduct);
                }
            });
            
            // Convert Map values to array
            const uniqueProductList = Array.from(productMap.values());
            setUniqueProducts(uniqueProductList);
            setFilteredProducts(uniqueProductList);
        } else {
            setUniqueProducts([]);
            setFilteredProducts([]);
        }
    }, [data, category]);
    
    // Filter products when ageFilter or sortOption changes
    useEffect(() => {
        if (uniqueProducts.length > 0) {
            let filtered = [...uniqueProducts];
            
            // Apply age filter
            if (ageFilter !== "all") {
                filtered = filtered.filter(product => {
                    // Simple string matching - in a real app, you'd want more robust filtering
                    return product.age_range && product.age_range.includes(ageFilter.replace("+", ""));
                });
            }
            
            // Apply sorting
            switch(sortOption) {
                case "price_asc":
                    filtered.sort((a, b) => a.price - b.price);
                    break;
                case "price_desc":
                    filtered.sort((a, b) => b.price - a.price);
                    break;
                case "bestseller":
                    // In a real app, you'd have a sales count or popularity metric
                    // Here we're just randomizing
                    filtered.sort(() => Math.random() - 0.5);
                    break;
                case "newest":
                default:
                    // Assume newest is the default order from the API
                    break;
            }
            
            setFilteredProducts(filtered);
        }
    }, [ageFilter, sortOption, uniqueProducts]);

    return (
        <div className="collection-page container pt-4">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-3">
                <Breadcrumb.Item>
                    <Link href="/">Trang chủ</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{categoryTitle}</Breadcrumb.Item>
            </Breadcrumb>
            
            {/* Page Title */}
            <div className="collection-header mb-4">
                <h1 className="collection-title">{categoryTitle}</h1>
                <p className="collection-description">
                    Đồ chơi phù hợp cho bé từ 0-6 tuổi, kích thích phát triển trí tuệ và kỹ năng
                </p>
            </div>
            
            {/* Filter Section */}
            <div className="filter-section mb-4">
                <div className="row align-items-center">
                    <div className="col-md-6 mb-3 mb-md-0">
                        <span className="filter-label me-2">Lọc theo độ tuổi:</span>
                        <Radio.Group 
                            options={AGE_FILTERS} 
                            value={ageFilter}
                            onChange={e => setAgeFilter(e.target.value)}
                            optionType="button"
                            buttonStyle="solid"
                            className="age-filter"
                        />
                    </div>
                    <div className="col-md-6 text-md-end">
                        <span className="filter-label me-2">Sắp xếp:</span>
                        <Select
                            value={sortOption}
                            onChange={value => setSortOption(value)}
                            options={SORT_OPTIONS}
                            style={{ width: 150 }}
                        />
                    </div>
                </div>
            </div>
            
            {/* Product List */}
            <div className="product-list row">
                {isLoading ? (
                    <div className="d-flex" style={{ width: '100%', height: '400px' }}>
                        <div className="m-auto">Đang tải sản phẩm...</div>
                    </div>
                ) : filteredProducts && filteredProducts.length ? (
                    filteredProducts.map((product) => {
                        return (
                            <ProductItem
                                key={product.product_id}
                                product_id={product.product_id}
                                name={product.product_name}
                                img={product.product_image}
                                price={product.price}
                                old_price={product.old_price}
                                age_range={product.age_range}
                                colour_id={product.colour_id}
                                sizes={product.sizes || []}
                                rating={product.rating}
                                feedback_quantity={product.feedback_quantity}
                            />
                        );
                    })
                ) : (
                    <div className="d-flex" style={{ width: '100%', height: '400px' }}>
                        <Empty 
                            style={{ margin: 'auto' }} 
                            description="Không tìm thấy sản phẩm phù hợp với bộ lọc" 
                        />
                    </div>
                )}
            </div>
            
            {/* Benefits Section */}
            <div className="benefits-section mt-5">
                <h2 className="text-center mb-4">Dành thời gian cùng con khám phá niềm vui mỗi ngày</h2>
                <div className="row">
                    {BENEFITS.map((benefit, index) => (
                        <div className="col-md-3 mb-4" key={index}>
                            <div className="benefit-item">
                                <div className="benefit-icon text-center mb-3">
                                    <Image 
                                        src={benefit.icon} 
                                        alt={benefit.title} 
                                        width={60} 
                                        height={60} 
                                        className="img-fluid"
                                    />
                                </div>
                                <h3 className="benefit-title text-center mb-2">{benefit.title}</h3>
                                <p className="benefit-description text-center">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="text-center mt-4 mb-5">
                    <a href="/collections" className="btn-shop-now">Mua ngay</a>
                </div>
            </div>
        </div>
    );
};

export default CollectionPage;
