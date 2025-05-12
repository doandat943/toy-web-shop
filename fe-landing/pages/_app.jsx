import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import 'bootstrap/dist/css/bootstrap.css';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Auth from '@/components/auth';
import Layout from '@/components/layout';
import '@/styles/globals.scss';
import { homeAPI } from '../config';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60
        }
    }
});

const App = ({ Component, pageProps }) => {
    const AuthComponent = Component.isAuth ? Auth : React.Fragment;
    const [websiteInfo, setWebsiteInfo] = useState({ website_name: 'elevenT' });

    useEffect(() => {
        const fetchWebsiteInfo = async () => {
            try {
                const response = await axios.get(`${homeAPI}/website-info/info`);
                setWebsiteInfo(response.data);
            } catch (error) {
                console.error('Error fetching website info:', error);
            }
        };

        fetchWebsiteInfo();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <Head>
                <title>{websiteInfo.website_name || 'elevenT'}</title>
                <link rel="icon" href="/img/favicon.ico" />
            </Head>
            <AuthComponent>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </AuthComponent>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider >
    )
}

export default App;
