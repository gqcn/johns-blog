import Layout from '@theme/Layout';

function HomepageHeader() {
    return (
        <header>
            <div className="container logo-container">
                <div className="container mt-40 text-center">
                    <p>
                        欢迎大家来访交流，这里是我的个人博客，主要用于记录技术探索、学习心得及生活感悟。
                    </p>
                </div>
            </div>
        </header>
    );
}

export default function Home(): JSX.Element {
    return (
        <Layout>
        <HomepageHeader />
            <div className="mt-20"></div>
        </Layout>
    );
}
