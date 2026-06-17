import headerModule from './components/header.js';
import createProductCard from './components/product-card.js';

headerModule();

document.addEventListener('DOMContentLoaded', () => {
  // 메인 히어로 슬라이드
  const heroWrapper = document.getElementById('mainhero-wrapper');

  if (heroWrapper) {
    fetch('./data/main_page_sunglasses.json')
      .then((res) => res.json())
      .then((data) => {
        heroWrapper.innerHTML = '';
        data.banners.forEach((banner) => {
          const slide = document.createElement('div');
          slide.className = 'swiper-slide mainhero_item';
          slide.innerHTML = `
            <a href="${banner.href}" class="mainhero_link">
              <div class="mainhero_visual">
                <img src="${banner.imageUrl}" alt="${banner.text}" class="mainhero_img">
              </div>
              <div class="mainhero_inner">
                <h2 class="mainhero_title">${banner.text}</h2>
                <p class="mainhero_sub_text pre_reg_16">${banner.subText || ''}</p>
              </div>
            </a>
          `;
          heroWrapper.appendChild(slide);
        });

        new Swiper('.mainhero', {
          loop: true,
          autoplay: { delay: 3000, disableOnInteraction: false },
          pagination: { el: '.mainhero .swiper-pagination', type: 'fraction' },
          speed: 600,
        });
      })
      .catch((err) => console.error('Hero Slider Error:', err));
  }

  // 베스트 프레임(상품 목록) 슬라이드
  const productSection = document.querySelector('.product_list_container');
  const productListWrapper = document.getElementById('product_list_wrapper');

  if (productSection && productListWrapper) {
    fetch('./data/products.json')
      .then((res) => res.json())
      .then((products) => {
        productListWrapper.innerHTML = '';

        products.slice(0, 8).forEach((p) => {
          const card = createProductCard(p);
          card.classList.add('swiper-slide');
          productListWrapper.appendChild(card);

          const inner = card.querySelector('.image_slider');
          if (inner) {
            new Swiper(inner, {
              nested: true,
              navigation: {
                nextEl: card.querySelector('.image_next'),
                prevEl: card.querySelector('.image_prev'),
              },
            });
          }
        });

        new Swiper('.product_list_container', {
          slidesPerView: 2,
          spaceBetween: 20,
          grabCursor: true,

          breakpoints: {
            // 1024px 이상 (데스크탑)
            1024: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          },
        });
        const guide = productSection.querySelector('.drag_guide');
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && guide) {
                guide.classList.add('active');

                setTimeout(() => {
                  guide.classList.remove('active');
                  // ★ 중요: 완전히 사라진 후 자리를 차지하지 않게 제거
                  setTimeout(() => {
                    guide.style.display = 'none';
                  }, 500);
                }, 2000);

                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.5 },
        );
      });
  }
});
