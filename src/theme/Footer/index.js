import React from 'react';
import Footer from '@theme-original/Footer';

export default function CustomFooter(props) {
  React.useEffect(() => {
    const icpNumber = '';
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