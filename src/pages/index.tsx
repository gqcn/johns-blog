import Layout from '@theme/Layout';

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
        <HomepageHeader />
            <div className="mt-20"></div>
        </Layout>
    );
}
