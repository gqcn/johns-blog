import React from 'react';
import Layout from '@theme/Layout';
import styles from './styles.module.css';

export default function AboutMe(): JSX.Element {
    return (
        <Layout>
            <div className="container margin-vert--lg">
                <div className="row">
                    <div className="col col--8 col--offset-2">
                        <div className={styles.aboutSection}>
                            <h2>技术之路</h2>
                            <p>
                                从<code>2011</code>年入行，对技术有着浓厚的热情。
                                对<code>Go</code>语言有着深入研究，
                                是 <a href="https://goframe.org" target="_blank" rel="noreferrer">GoFrame</a> 开源项目的发起人和主要贡献者。
                                擅长技术架构、云原生、微服务、<code>DevOps</code>技术。
                                在大中小厂工作过，感受过创业的不易，
                                始终坚持在技术方向学习与深耕，不给自己设限。
                            </p>
                        </div>

                        <div className={styles.aboutSection}>
                            <h2>兴趣爱好</h2>
                            <p>
                                在空闲的时间里，我喜欢做做开源项目、登山与跑步。保持对世界的热爱。
                            </p>
                            <p><img src="/img/moutain1.png" alt="登山" /></p>
                        </div>

                        <div className={styles.aboutSection}>
                            <h2>联系方式</h2>
                            <p> 非常欢迎志同道合的朋友，可以通过以下方式与我交流：</p>
                            <ul>
                                <li>在文章下方评论区留言</li>
                                <li>个人微信号：<code>389961817</code></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
