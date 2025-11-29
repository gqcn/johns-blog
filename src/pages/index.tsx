import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import StructuredData from '@site/src/components/StructuredData';

// Structured data for SEO
const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: "John's Blog",
    description: '专注AI技术、云原生技术、Kubernetes、Volcano、Go开发的技术博客',
    url: 'https://johng.cn',
    author: {
        '@type': 'Person',
        name: 'John Guo',
        url: 'https://johng.cn/aboutme'
    },
    inLanguage: 'zh-CN',
    keywords: 'AI技术,GPU虚拟化,Volcano,Kubernetes,云原生,GoFrame,Golang,微服务架构,分布式系统',
};

function HomepageHeader() {
    return (
        <header>
            <div className="container logo-container">
                <div className="container mt-40 text-center">
                    <p>
                        个人博客，用于记录技术探索、学习心得、工作笔记及生活感悟。
                    </p>
                </div>
            </div>
        </header>
    );
}

export default function Home(): JSX.Element {
    return (
        <Layout>
            <Head>
                <title>John's Blog</title>
                <meta name="description" content="专注AI技术、云原生技术、Kubernetes、Volcano、Go开发的技术博客。分享分布式系统、GPU虚拟化、微服务架构等实战经验与深度技术文章。" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="John's Blog - AI技术与云原生技术博客" />
                <meta property="og:description" content="专注AI技术、云原生技术、Kubernetes、Volcano、Go开发。分享分布式系统、GPU虚拟化、微服务架构等实战经验。" />
                <meta property="og:url" content="https://johng.cn/" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="John's Blog - AI技术与云原生技术博客" />
                <meta name="twitter:description" content="专注AI技术、云原生技术、Kubernetes、Volcano、Go开发。" />
                <link rel="canonical" href="https://johng.cn/" />
            </Head>
            <StructuredData data={structuredData} />
            <HomepageHeader />
            <div className="mt-20"></div>
        </Layout>
    );
}
