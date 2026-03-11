import React from 'react';
import Layout from '@theme/Layout';
import styles from './styles.module.css';

export default function AboutMe(): JSX.Element {
    return (
        <Layout>
            <div className="container margin-vert--lg disable_numbered_headings">
                <div className="row">
                    <div className="col col--8 col--offset-2">
                        <div className={styles.aboutSection}>
                            <h2>关于我</h2>
                            <p>
                                从<code>2011</code>年入行，对技术有着浓厚的执着与热情。
                                对<code>Go</code>语言有着深入研究，擅长<code>AI</code>基础架构、云原生、微服务技术。
                                是 <a href="https://goframe.org" target="_blank" rel="noreferrer"><code>GoFrame</code></a>开源项目发起人，
                                这个面向企业级场景的 <code>Go</code> 开发框架在<code>GitHub</code>上积累了超过 <code>13K Star</code>，
                                被国内外大量公司用于生产环境。
                                在大中小厂都工作过，体会过职场的不易，感受过创业的艰辛。 
                                始终坚持在技术方向学习与深耕，不给自己设限。
                            </p>
                        </div>

                        <div className={styles.aboutSection}>
                            <h2>技术方向</h2>
                            <ul>
                                <li><code>AI</code>基础架构 / <code>LLM</code>工程化</li>
                                <li>云原生 / <code>Kubernetes</code></li>
                                <li><code>Go</code>语言 / 开源框架</li>
                                <li>微服务架构 / 分布式系统</li>
                            </ul>
                        </div>

                        <div className={styles.aboutSection}>
                            <h2>兴趣爱好</h2>
                            <p>
                                空闲时喜欢做做开源、登山和跑步。保持对世界的热爱。
                            </p>
                            <p><img src="/img/moutain1.png" alt="登山" /></p>
                        </div>

                        <div className={styles.aboutSection}>
                            <h2>联系方式</h2>
                            <p>目前定居于成都，欢迎与志同道合的朋友交流：</p>
                            <ul>
                                <li>在文章下方评论区留言</li>
                                <li>个人微信号：<code>389961817</code></li>
                                <li>GitHub：<a href="https://github.com/gqcn" target="_blank" rel="noreferrer">https://github.com/gqcn</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
