import useAdminStore from '@/store/adminStore';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Section from './Section';

const Layout = ({ children }) => {
    const router = useRouter();
    const isLoggedIn = useAdminStore((state) => state.isLoggedIn);
    const [isMounted, setIsMounted] = useState(false);

    // Handle initial mounting
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Handle login redirection only after component is mounted in client
    useEffect(() => {
        if (isMounted && !isLoggedIn && router.pathname !== '/login') {
            // Use regular navigation to avoid potential issues
            window.location.href = '/login';
        }
    }, [isLoggedIn, router.pathname, isMounted]);

    // Special detection for the NewTab issue
    useEffect(() => {
        if (isMounted && router.pathname === '/NewTab') {
            window.location.href = '/';
        }
    }, [router.pathname, isMounted]);

    if (!isMounted) {
        return null; // Don't render anything during SSR to avoid hydration issues
    }

    return (
        <>
            {router.pathname === '/login'
                ? children
                : isLoggedIn && (
                    <>
                        <Head>
                            <title>Toy Shop Admin</title>
                            <meta name="description" content="Toy Shop Admin Portal" />
                            <meta name="viewport" content="width=device-width, initial-scale=1" />
                            <link rel="icon" href="/favicon.ico" />
                        </Head>
                        <div className="overflow-hidden">
                            <div className="row">
                                <div className="col-3">
                                    <Section />
                                </div>
                                <div className="cont col-9" style={{ paddingRight: '36px' }}>
                                    {children}
                                </div>
                            </div>
                        </div>
                    </>
                )}
        </>
    );
};

export default Layout;
