import { swalert, swtoast } from '@/mixins/swal.mixin';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaAngleDown, FaShoppingBag, FaSearch, FaPhone, FaEnvelope, FaUserAlt } from 'react-icons/fa';
import axios from 'axios';

import logo from '@/public/img/logo.png';
import queries from '@/queries';
import customerService from '@/services/customerService';
import useCustomerStore from '@/store/customerStore';
import Login from './login';
import Register from './register';
import { homeAPI } from '@/config';

const Header = () => {
    const [isLogInOpen, setIsLogInOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const isLoggedIn = useCustomerStore((state) => state.isLoggedIn);
    const setCustomerLogout = useCustomerStore((state) => state.setCustomerLogout);
    const [websiteInfo, setWebsiteInfo] = useState(null);
    const [websiteLogo, setWebsiteLogo] = useState(logo);

    // Fetch website info
    useEffect(() => {
        const fetchWebsiteInfo = async () => {
            try {
                const response = await axios.get(`${homeAPI}/website-info/info`);
                setWebsiteInfo(response.data);
                if (response.data?.website_logo) {
                    // Set dynamic logo if available
                    setWebsiteLogo(`${homeAPI}/static${response.data.website_logo}`);
                }
            } catch (error) {
                console.error('Error fetching website info:', error);
            }
        };

        fetchWebsiteInfo();
    }, []);

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
        // Implement search functionality
        if (searchQuery.trim()) {
            window.location.href = `/collections?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <div className="header-wrapper">
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
            
            {/* Top info bar */}
            <div className="top-bar">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 d-flex align-items-center">
                            <div className="contact-info">
                                <span className="phone me-3"><FaPhone className="me-1" /> Hotline: 1800-123-4567</span>
                                <span className="email"><FaEnvelope className="me-1" /> Email: info@kalotoys.com</span>
                            </div>
                        </div>
                        <div className="col-md-6 d-flex justify-content-end align-items-center">
                            <div className="top-menu">
                                <ul className="list-inline mb-0">
                                    <li className="list-inline-item">
                                        <Link href="/about-us">Về chúng tôi</Link>
                                    </li>
                                    <li className="list-inline-item">
                                        <Link href="/contact">Liên hệ</Link>
                                    </li>
                                    {!isLoggedIn ? (
                                        <li className="list-inline-item">
                                            <a href="#" onClick={() => setIsLogInOpen(true)}>
                                                <FaUserAlt className="me-1" /> Đăng nhập
                                            </a>
                                        </li>
                                    ) : (
                                        <>
                                            <li className="list-inline-item">
                                                <Link href="/account/infor">
                                                    <FaUserAlt className="me-1" /> Tài khoản
                                                </Link>
                                            </li>
                                            <li className="list-inline-item">
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
                                                }}>
                                                    Đăng xuất
                                                </a>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Main header */}
            <div className="main-header">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-3">
                            <div className="logo-box">
                                <Link href="/">
                                    <Image 
                                        className="logo" 
                                        src={websiteLogo} 
                                        alt={websiteInfo?.website_name || "Kalo Toys"} 
                                        width={150} 
                                        height={60} 
                                    />
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <form className="search-form" onSubmit={handleSearch}>
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Tìm kiếm sản phẩm..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button className="btn search-btn" type="submit">
                                        <FaSearch />
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="col-md-3 text-end">
                            <Link href="/cart" className="cart-icon">
                                <FaShoppingBag />
                                <span className="cart-count">0</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Main menu */}
            <div className="main-menu">
                <div className="container">
                    <ul className="menu d-flex">
                        <li className="menu-item">
                            <Link href="/" className="menu-link">
                                Trang chủ
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link href="/collections" className="menu-link">
                                Tất cả sản phẩm
                            </Link>
                        </li>
                        {categoryList &&
                            categoryList.map((categoryLevel1, index) => (
                                <li className="menu-item" key={index}>
                                    <Link href="#" className="menu-link">
                                        {categoryLevel1.title}
                                        <FaAngleDown className="ms-1" />
                                    </Link>
                                    <ul className="sub-menu">
                                        {categoryLevel1.children &&
                                            categoryLevel1.children.map((category, idx) => (
                                                <li key={idx} className="sub-menu-item">
                                                    <Link
                                                        href={{
                                                            pathname: '/collections',
                                                            query: {
                                                                category: category.category_id
                                                            }
                                                        }}
                                                        className="sub-menu-link"
                                                    >
                                                        {category.title}
                                                    </Link>
                                                </li>
                                            ))}
                                    </ul>
                                </li>
                            ))}
                        <li className="menu-item">
                            <Link href="/about-us" className="menu-link">
                                Về chúng tôi
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link href="/contact" className="menu-link">
                                Liên hệ
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Header;
