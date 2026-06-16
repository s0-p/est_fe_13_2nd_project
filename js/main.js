import headerModule from './components/header.js';
import createProductCard from './components/product-card.js';

document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.getElementById('mainhero-wrapper');

  fetch('../data/main_page_sunglasses.json') // 원래 잘 작동하던 상대경로로 원상복구!
    .then((response) => {
      if (!response.ok) {
        throw new Error('JSON 데이터를 불러오는데 실패했어요');
      }
      return response.json();
    })
    .then((data) => {
      wrapper.innerHTML = '';

      data.banners.forEach((banner) => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide mainhero_item';

        slide.innerHTML = `
          <a href="${banner.href}" class="mainhero_link">
              <div class="mainhero_visual">
                <img src="${banner.imageUrl}" alt="${banner.text}" class="mainhero_img">
              </div>
              <div class="mainhero_inner">
                <h2 class="mainhero_title" style="white-space: pre-line;">${banner.text}</h2>
                
                <p class="mainhero_sub_text pre_reg_16">${banner.subText}</p>
              </div>
            </a>
          `;
        wrapper.appendChild(slide);
      });

      initSwiper();
    })
    .catch((error) => {
      console.error('에러 발생:', error);
    });
});

function initSwiper() {
  new Swiper('.mainhero', {
    loop: true,
    loopedSlides: 3,

    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },

    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
    },

    speed: 600,

    observer: true,
    observeParents: true,
  });
}
