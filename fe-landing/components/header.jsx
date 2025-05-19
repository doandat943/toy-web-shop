import { swalert, swtoast } from '@/mixins/swal.mixin';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { 
    FaAngleDown, 
    FaShoppingBag, 
    FaChild, 
    FaGift, 
    FaBirthdayCake, 
    FaQuestionCircle, 
    FaUser, 
    FaSearch,
    FaTruck
} from 'react-icons/fa';

import logo from '@/public/img/logo.png';
import queries from '@/queries';
import customerService from '@/services/customerService';
import useCustomerStore from '@/store/customerStore';
import Login from './login';
import Register from './register';

const Header = () => {
    const [isLogInOpen, setIsLogInOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const isLoggedIn = useCustomerStore((state) => state.isLoggedIn);
    const setCustomerLogout = useCustomerStore((state) => state.setCustomerLogout);
    const [searchTerm, setSearchTerm] = useState('');

    const { isError, error, data } = useQuery({
        ...queries.categories.list()
    });
    if (isError) console.log(error);
    const categoryList = data?.data;

    const toClose = () => {
        setIsLogInOpen(false);
        setIsRegisterOpen(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Xử lý tìm kiếm tại đây
        console.log('Searching for:', searchTerm);
        // Chuyển hướng đến trang kết quả tìm kiếm
        // window.location.href = `/search?q=${searchTerm}`;
    };

    return (
        <div className="header-wrapper position-relation toy-header">
            {!isLoggedIn && (
                <>
                    <div className={!isLogInOpen ? `${'d-none'}` : ''}>
                        <Login
                            toRegister={() => {
                                setIsLogInOpen(false);
                                setIsRegisterOpen(true);
                            }}
                            toClose={toClose}
                        />
                    </div>
                    <div className={!isRegisterOpen ? `${'d-none'}` : ''}>
                        <Register
                            toLogin={() => {
                                setIsRegisterOpen(false);
                                setIsLogInOpen(true);
                            }}
                            toClose={toClose}
                        />
                    </div>
                </>
            )}
            
            {/* Thông báo top */}
            <div className="toy-announcement">
                <div className="container">
                    <p>🎁 Freeship cho đơn hàng từ 500K! Quà tặng đặc biệt cho bé khi mua 2 sản phẩm trở lên</p>
                </div>
            </div>

            {/* Top header with actions */}
            <div className="top-header">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-3">
                            <div className="logo-box">
                                <Link href="/">
                                    <Image className="logo" src={logo} alt="KidsToyLand - Đồ chơi an toàn cho bé" width={150} height={60} />
                                </Link>
                            </div>
                        </div>

                        <div className="col-md-5">
                            <div className="search-container">
                                <form onSubmit={handleSearch} className="search-form">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control search-input"
                                            placeholder="Nhập từ khóa để tìm kiếm (ví dụ: lắp ráp, mô hình, ba lô...)"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <button className="btn search-btn" type="submit">
                                            <FaSearch />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="top-actions">
                                <div className="top-action-item">
                                    <Link href="/shipping-policy" className="top-action-link">
                                        <FaTruck className="top-action-icon" />
                                        <span className="top-action-text">Chính sách giao hàng</span>
                                    </Link>
                                </div>
                                
                                {!isLoggedIn ? (
                                    <div className="top-action-item">
                                        <a 
                                            href="#" 
                                            className="top-action-link"
                                            onClick={() => setIsLogInOpen(true)}
                                        >
                                            <FaUser className="top-action-icon" />
                                            <span className="top-action-text">Đăng nhập</span>
                                        </a>
                                    </div>
                                ) : (
                                    <div className="top-action-item dropdown">
                                        <a href="#" className="top-action-link">
                                            <FaUser className="top-action-icon" />
                                            <span className="top-action-text">Tài khoản</span>
                                        </a>
                                        <ul className="top-action-dropdown">
                                            <li><Link href="/account/infor">Thông tin tài khoản</Link></li>
                                            <li>
                                                <a href="#" onClick={() => {
                                                    swalert
                                                        .fire({
                                                            allowOutsideClick: false,
                                                            allowEscapeKey: false,
                                                            showCancelButton: true,
                                                            showLoaderOnConfirm: true,
                                                            preConfirm: async () => {
                                                                try {
                                                                    await customerService.logout();
                                                                    return { isError: false };
                                                                } catch (error) {
                                                                    console.log(error);
                                                                    return { isError: true };
                                                                }
                                                            },
                                                            title: 'Đăng xuất',
                                                            icon: 'warning',
                                                            text: 'Bạn muốn đăng xuất?',
                                                        })
                                                        .then(async (result) => {
                                                            if (result.isConfirmed && !result.value?.isError) {
                                                                setCustomerLogout();
                                                                swtoast.success({ text: 'Đăng xuất thành công!' });
                                                            } else if (result.isConfirmed && result.value?.isError) {
                                                                setCustomerLogout();
                                                                swtoast.success({ text: 'Đăng xuất thành công!' });
                                                            }
                                                        });
                                                }}>Đăng xuất</a>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                                
                                <div className="top-action-item">
                                    <Link href="/cart" className="top-action-link cart-link">
                                        <FaShoppingBag className="top-action-icon" />
                                        <span className="top-action-text">Giỏ hàng</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Main navigation menu */}
            <div className="main-header">
                <div className="container">
                    <nav className="main-nav">
                        <ul className="main-menu">
                            <li className="menu-item fw-bold text-uppercase position-relative">
                                <Link href="/collections" className="d-flex align-items-center">
                                    <FaChild className="menu-icon" /> Tất cả đồ chơi
                                </Link>
                            </li>
                            
                            <li className="menu-item fw-bold text-uppercase position-relative dropdown">
                                <a href="#" className="d-flex align-items-center">
                                    Theo độ tuổi <FaAngleDown className="ms-1" />
                                </a>
                                <ul className="sub-menu position-absolute">
                                    <li><Link href="/collections?age=infant">0-1 tuổi</Link></li>
                                    <li><Link href="/collections?age=toddler">1-3 tuổi</Link></li>
                                    <li><Link href="/collections?age=preschool">3-6 tuổi</Link></li>
                                    <li><Link href="/collections?age=school">6-12 tuổi</Link></li>
                                </ul>
                            </li>
                            
                            <li className="menu-item fw-bold text-uppercase position-relative">
                                <Link href="/gift-finder" className="d-flex align-items-center">
                                    <FaGift className="menu-icon" /> Tìm quà
                                </Link>
                            </li>

                            <li className="menu-item fw-bold text-uppercase position-relative">
                                <Link href="/birthday-club" className="d-flex align-items-center">
                                    <FaBirthdayCake className="menu-icon" /> Sinh nhật
                                </Link>
                            </li>

                            <li className="menu-item fw-bold text-uppercase position-relative">
                                <Link href="/about-us" className="d-flex align-items-center">
                                    <FaQuestionCircle className="menu-icon" /> Giới thiệu
                                </Link>
                            </li>
                            
                            {categoryList &&
                                categoryList.map((categoryLevel1, index) => {
                                    return (
                                        <li
                                            className="menu-item fw-bold text-uppercase position-relative"
                                            key={index}
                                        >
                                            <Link href="#" className="d-flex align-items-center">
                                                {categoryLevel1.title}
                                                <FaAngleDown className="ms-1" />
                                            </Link>
                                            <ul className="sub-menu position-absolute">
                                                {categoryLevel1.children &&
                                                    categoryLevel1.children.map((category, index) => {
                                                        return (
                                                            <li key={index} className="w-100">
                                                                <Link
                                                                    href={{
                                                                        pathname: '/collections',
                                                                        query: {
                                                                            category: category.category_id
                                                                        }
                                                                    }}
                                                                >
                                                                    {category.title}
                                                                </Link>
                                                            </li>
                                                        );
                                                    })}
                                            </ul>
                                        </li>
                                    );
                                })}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Header;
