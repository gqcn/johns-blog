/**
 * Docusaurus plugin to inject hidden image for WeChat share
 * This runs during build time and modifies the static HTML
 */
module.exports = function (context, options) {
    return {
        name: 'wechat-share-plugin',
        injectHtmlTags() {
            return {
                // Inject at the beginning of <body>
                preBodyTags: [
                    {
                        tagName: 'img',
                        attributes: {
                            src: 'https://johng.cn/img/favicon.png',
                            alt: 'WeChat Share Thumbnail',
                            style: 'position:absolute;top:0;left:0;width:300px;height:300px;visibility:hidden;pointer-events:none;z-index:-1;',
                            loading: 'eager',
                        },
                    },
                ],
            };
        },
    };
};
