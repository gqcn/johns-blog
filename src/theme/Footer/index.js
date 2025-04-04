import React from 'react';
import Footer from '@theme-original/Footer';

export default function CustomFooter(props) {
  React.useEffect(() => {
    const icpNumber = '<a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">蜀ICP备2024111610号</a >';
    if (icpNumber) {
      const footerElement = document.querySelector('.footer__bottom');
      if (footerElement) {
        const icpElement = document.createElement('div');
        icpElement.className = "mt-2 beian"
        icpElement.innerHTML = icpNumber;
        footerElement.appendChild(icpElement);
      }
    }
  }, []);

  return <Footer {...props} />;
}