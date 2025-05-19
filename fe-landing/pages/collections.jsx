import { useQuery } from '@tanstack/react-query';
import { Empty, Slider, Checkbox, Button, Tag, Drawer, Divider } from 'antd';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { FaFilter, FaTimes, FaChild, FaStar, FaTag, FaSort } from 'react-icons/fa';

import ProductItem from '@/components/collectionPage/productItem';
import queries from '@/queries';

const CollectionPage = () => {
    const router = useRouter();
    const { category, age } = router.query;
    const [openFilter, setOpenFilter] = useState(false);
    const [filters, setFilters] = useState({
        ageRange: age ? [getAgeRangeFromParam(age)] : [],
        toyTypes: [],
        safetyRating: 0,
        priceRange: [0, 2000000],
        sortBy: 'newest'
    });
    
    const [activeFilters, setActiveFilters] = useState([]);
    
    // Handle initial URL params
    useEffect(() => {
        if (age) {
            setFilters(prev => ({
                ...prev,
                ageRange: [getAgeRangeFromParam(age)]
            }));
            
            setActiveFilters(prev => {
                const newFilters = [...prev];
                const ageLabel = getAgeLabel(age);
                if (!newFilters.find(f => f.key === 'age')) {
                    newFilters.push({ key: 'age', value: age, label: `Độ tuổi: ${ageLabel}` });
                }
                return newFilters;
            });
        }
    }, [age]);
    
    // Helper function to convert age param to age range
    function getAgeRangeFromParam(ageParam) {
        switch(ageParam) {
            case 'infant': return '0-1';
            case 'toddler': return '1-3';
            case 'preschool': return '3-6';
            case 'school': return '6-12';
            default: return '';
        }
    }
    
    // Helper function to get age label
    function getAgeLabel(ageParam) {
        switch(ageParam) {
            case 'infant': return '0-1 tuổi';
            case 'toddler': return '1-3 tuổi';
            case 'preschool': return '3-6 tuổi';
            case 'school': return '6-12 tuổi';
            default: return '';
        }
    }
    
    // Handle filters change
    const handleFilterChange = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value }));
    };
    
    // Apply filters
    const applyFilters = () => {
        const newActiveFilters = [];
        
        // Add age filters
        if (filters.ageRange.length > 0) {
            filters.ageRange.forEach(range => {
                const ageParam = getAgeParamFromRange(range);
                newActiveFilters.push({
                    key: 'age',
                    value: ageParam,
                    label: `Độ tuổi: ${range} tuổi`
                });
            });
        }
        
        // Add toy type filters
        if (filters.toyTypes.length > 0) {
            filters.toyTypes.forEach(type => {
                newActiveFilters.push({
                    key: 'toyType',
                    value: type,
                    label: `Loại: ${type}`
                });
            });
        }
        
        // Add safety rating filter
        if (filters.safetyRating > 0) {
            newActiveFilters.push({
                key: 'safetyRating',
                value: filters.safetyRating,
                label: `An toàn: ${filters.safetyRating}★`
            });
        }
        
        // Add price range filter if not default
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000000) {
            newActiveFilters.push({
                key: 'priceRange',
                value: filters.priceRange,
                label: `Giá: ${filters.priceRange[0].toLocaleString()}đ - ${filters.priceRange[1].toLocaleString()}đ`
            });
        }
        
        setActiveFilters(newActiveFilters);
        setOpenFilter(false);
        
        // Update URL with filters
        const query = { ...router.query };
        
        // Handle age filter in URL
        if (filters.ageRange.length > 0) {
            const ageParam = getAgeParamFromRange(filters.ageRange[0]);
            query.age = ageParam;
        } else {
            delete query.age;
        }
        
        // Add other filters if needed
        if (filters.toyTypes.length > 0) {
            query.type = filters.toyTypes.join(',');
        } else {
            delete query.type;
        }
        
        router.push({
            pathname: router.pathname,
            query
        }, undefined, { shallow: true });
    };
    
    // Helper function to convert age range to param
    function getAgeParamFromRange(range) {
        switch(range) {
            case '0-1': return 'infant';
            case '1-3': return 'toddler';
            case '3-6': return 'preschool';
            case '6-12': return 'school';
            default: return '';
        }
    }
    
    // Remove a filter
    const removeFilter = (filterKey, filterValue) => {
        setActiveFilters(prev => prev.filter(f => !(f.key === filterKey && f.value === filterValue)));
        
        if (filterKey === 'age') {
            setFilters(prev => ({
                ...prev,
                ageRange: prev.ageRange.filter(r => getAgeParamFromRange(r) !== filterValue)
            }));
            
            const query = { ...router.query };
            delete query.age;
            router.push({
                pathname: router.pathname,
                query
            }, undefined, { shallow: true });
        }
        
        if (filterKey === 'toyType') {
            setFilters(prev => ({
                ...prev,
                toyTypes: prev.toyTypes.filter(t => t !== filterValue)
            }));
            
            const query = { ...router.query };
            if (query.type) {
                const types = query.type.split(',').filter(t => t !== filterValue);
                if (types.length > 0) {
                    query.type = types.join(',');
                } else {
                    delete query.type;
                }
                router.push({
                    pathname: router.pathname,
                    query
                }, undefined, { shallow: true });
            }
        }
    };
    
    // Clear all filters
    const clearAllFilters = () => {
        setActiveFilters([]);
        setFilters({
            ageRange: [],
            toyTypes: [],
            safetyRating: 0,
            priceRange: [0, 2000000],
            sortBy: 'newest'
        });
        
        router.push({
            pathname: router.pathname,
            query: category ? { category } : {}
        }, undefined, { shallow: true });
    };

    const { isError, error, data } = useQuery(queries.products.list(category));
    if (isError) console.log(error);
    const allProducts = data?.data || [];
    
    // Apply filters to products
    const filteredProducts = allProducts.filter(product => {
        let matchesFilters = true;
        
        // Filter by age
        if (activeFilters.some(f => f.key === 'age')) {
            const ageFilters = activeFilters.filter(f => f.key === 'age').map(f => f.value);
            const productMinAge = product.recommended_age_min || 0;
            const productMaxAge = product.recommended_age_max || 144; // 12 years in months
            
            const ageMatches = ageFilters.some(ageFilter => {
                switch(ageFilter) {
                    case 'infant': // 0-1 years (0-12 months)
                        return productMinAge <= 12 && (productMaxAge >= 0);
                    case 'toddler': // 1-3 years (12-36 months)
                        return productMinAge <= 36 && productMaxAge >= 12;
                    case 'preschool': // 3-6 years (36-72 months)
                        return productMinAge <= 72 && productMaxAge >= 36;
                    case 'school': // 6-12 years (72-144 months)
                        return productMinAge <= 144 && productMaxAge >= 72;
                    default:
                        return true;
                }
            });
            
            if (!ageMatches) matchesFilters = false;
        }
        
        // Filter by toy type
        if (activeFilters.some(f => f.key === 'toyType')) {
            const typeFilters = activeFilters.filter(f => f.key === 'toyType').map(f => f.value);
            if (!typeFilters.includes(product.toy_type)) matchesFilters = false;
        }
        
        // Filter by price range
        if (activeFilters.some(f => f.key === 'priceRange')) {
            const priceFilter = activeFilters.find(f => f.key === 'priceRange').value;
            const productPrice = product.price || 0;
            if (productPrice < priceFilter[0] || productPrice > priceFilter[1]) {
                matchesFilters = false;
            }
        }
        
        return matchesFilters;
    });
    
    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch(filters.sortBy) {
            case 'priceAsc':
                return (a.price || 0) - (b.price || 0);
            case 'priceDesc':
                return (b.price || 0) - (a.price || 0);
            case 'rating':
                return (b.rating || 0) - (a.rating || 0);
            case 'newest':
            default:
                return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        }
    });
    
    // Toy type options
    const toyTypeOptions = [
        { label: 'Đồ chơi giáo dục', value: 'educational' },
        { label: 'Đồ chơi vận động', value: 'physical' },
        { label: 'Đồ chơi xây dựng', value: 'building' },
        { label: 'Đồ chơi nghệ thuật', value: 'arts' },
        { label: 'Đồ chơi phát triển trí tuệ', value: 'cognitive' },
        { label: 'Đồ chơi ngoài trời', value: 'outdoor' }
    ];
    
    // Age range options
    const ageRangeOptions = [
        { label: '0-1 tuổi', value: '0-1' },
        { label: '1-3 tuổi', value: '1-3' },
        { label: '3-6 tuổi', value: '3-6' },
        { label: '6-12 tuổi', value: '6-12' }
    ];

    return (
        <div className="product-page container-fluid pt-5 mt-5">
            <div className="container">
                <div className="collection-header mb-4">
                    <h1 className="collection-title mb-3">Đồ chơi trẻ em</h1>
                    <p className="collection-description">
                        Khám phá bộ sưu tập đồ chơi an toàn, giáo dục và phù hợp với sự phát triển của trẻ
                    </p>
                    
                    {/* Filter button for mobile */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <Button 
                            type="primary" 
                            className="filter-button"
                            onClick={() => setOpenFilter(true)}
                            icon={<FaFilter />}
                        >
                            Lọc sản phẩm
                        </Button>
                        
                        <div className="sort-select">
                            <span className="me-2"><FaSort /> Sắp xếp:</span>
                            <select 
                                className="form-select form-select-sm d-inline-block w-auto"
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="priceAsc">Giá tăng dần</option>
                                <option value="priceDesc">Giá giảm dần</option>
                                <option value="rating">Đánh giá cao</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Active filters */}
                    {activeFilters.length > 0 && (
                        <div className="active-filters mb-3">
                            <div className="d-flex flex-wrap align-items-center">
                                <span className="me-2">Bộ lọc đang dùng:</span>
                                {activeFilters.map((filter, index) => (
                                    <Tag 
                                        key={index}
                                        closable
                                        className="filter-tag"
                                        onClose={() => removeFilter(filter.key, filter.value)}
                                    >
                                        {filter.label}
                                    </Tag>
                                ))}
                                <Button 
                                    type="text" 
                                    size="small"
                                    onClick={clearAllFilters}
                                    className="clear-filters"
                                >
                                    Xóa tất cả
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Filter drawer */}
                <Drawer
                    title="Lọc sản phẩm"
                    placement="right"
                    onClose={() => setOpenFilter(false)}
                    open={openFilter}
                    footer={
                        <div className="d-flex justify-content-between">
                            <Button onClick={clearAllFilters}>Xóa tất cả</Button>
                            <Button type="primary" onClick={applyFilters}>Áp dụng</Button>
                        </div>
                    }
                >
                    <div className="filter-section">
                        <h6 className="filter-title"><FaChild className="me-2" /> Độ tuổi</h6>
                        <Checkbox.Group 
                            options={ageRangeOptions} 
                            value={filters.ageRange}
                            onChange={(values) => handleFilterChange('ageRange', values)}
                        />
                    </div>
                    
                    <Divider />
                    
                    <div className="filter-section">
                        <h6 className="filter-title"><FaTag className="me-2" /> Loại đồ chơi</h6>
                        <Checkbox.Group 
                            options={toyTypeOptions} 
                            value={filters.toyTypes}
                            onChange={(values) => handleFilterChange('toyTypes', values)}
                        />
                    </div>
                    
                    <Divider />
                    
                    <div className="filter-section">
                        <h6 className="filter-title"><FaStar className="me-2" /> Giá (đ)</h6>
                        <Slider
                            range
                            min={0}
                            max={2000000}
                            step={50000}
                            value={filters.priceRange}
                            onChange={(value) => handleFilterChange('priceRange', value)}
                            tipFormatter={(value) => `${value.toLocaleString()}đ`}
                        />
                        <div className="d-flex justify-content-between">
                            <span>{filters.priceRange[0].toLocaleString()}đ</span>
                            <span>{filters.priceRange[1].toLocaleString()}đ</span>
                        </div>
                    </div>
                </Drawer>
                
                <div className="row">
                    <div className="product-list row">
                        {sortedProducts && sortedProducts.length ? (
                            sortedProducts.map((product, index) => {
                                return (
                                    <ProductItem
                                        key={index}
                                        product_id={product.product_id}
                                        name={product.product_name}
                                        img={product.product_image}
                                        price={product.price}
                                        colour_id={product.colour_id}
                                        sizes={product.sizes}
                                        rating={product.rating}
                                        feedback_quantity={product.feedback_quantity}
                                        ageRange={`${product.recommended_age_min || 0}-${product.recommended_age_max || 144} tháng`}
                                        toyType={product.toy_type}
                                    />
                                );
                            })
                        ) : (
                            <div className="d-flex" style={{ width: '100%', height: '400px' }}>
                                <Empty 
                                    style={{ margin: 'auto' }}
                                    description="Không tìm thấy sản phẩm phù hợp"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectionPage;
