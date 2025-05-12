const express = require('express');

const adminRouter = require('./admin');
const customerRouter = require('./customer');
const colourRouter = require('./colour');
const sizeRouter = require('./size');
const categoryRouter = require('./category');
const productRouter = require('./product');
const product_variantRouter = require('./product_variant');
const order = require('./order');
const feedback = require('./feedback');
const about = require('./about');
const upload = require('./upload');
const website_info = require('./website_info');

function setRoute(server) {

    server.use('/api/admin', adminRouter);

    server.use('/api/customer', customerRouter);

    server.use('/api/colour', colourRouter);

    server.use('/api/size', sizeRouter);

    server.use('/api/category', categoryRouter);

    server.use('/api/product', productRouter);

    server.use('/api/product-variant', product_variantRouter);

    server.use('/api/order', order);

    server.use('/api/feedback', feedback);

    server.use('/api/about', about);

    server.use('/api/upload', upload);
    
    server.use('/api/website-info', website_info);

}

module.exports = setRoute;
