document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.getElementById('mainhero-wrapper');

  const createSlide = (banner) => {
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
    return slide;
  };

  const initSwiper = () => {
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
      preventClicks: false,
      preventClicksPropagation: false,
    });
  };

  fetch('./data/main_page_sunglasses.json')
    .then((response) => {
      if (!response.ok) throw new Error('JSON 데이터를 불러오는데 실패했어요');
      return response.json();
    })
    .then((data) => {
      wrapper.innerHTML = '';

      const fragment = document.createDocumentFragment();
      data.banners.forEach((banner) => fragment.appendChild(createSlide(banner)));
      wrapper.appendChild(fragment);

      initSwiper();
    })
    .catch((error) => {
      console.error('에러 발생:', error);
      wrapper.innerHTML = '<p class="error_msg">콘텐츠를 불러오지 못했습니다.</p>';
    });
});
