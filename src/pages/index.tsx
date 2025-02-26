import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ContributorsSVG from '@site/static/img/contributors.svg';
import Layout from '@theme/Layout';

function HomepageHeader() {
    return (
        <header>
            <div className="container logo-container">
                <div className="container mt-40 text-center">
                    <p>
                        这里是我的个人博客，主要用于记录一些学习笔记，以及生活感悟。
                    </p>
                    <p>
                        欢迎大家的来访，如果有任何问题，欢迎留言交流。
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
