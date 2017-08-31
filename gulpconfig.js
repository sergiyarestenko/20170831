    "use strict";
const   os = require('os'),
        browser = os.platform() === 'linux' ? 'google-chrome' : (os.platform() === 'darwin' ? 'google chrome' : (os.platform() === 'win32' ? 'chrome' : 'firefox'));

module.exports = {
    port: 8000,
    browser: browser,
    paths: {
        src: "./src",
        build: "./build",
        html: "./src/*.html",
        stylesheets: "./src/main.less",
        less:"./src/main.less",
        js: './src/app.js',
        img: './src/img/**/*.*'
    },
    browserSync: {
        proxy: `http://localhost:8000/index.html`,
        files: ['build/**/*.*'],
        browser: browser,
        port: 8001
    }
};