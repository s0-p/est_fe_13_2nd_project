import headerModule from './components/header.js';
import createProductCard from './components/product-card.js';
/* import * as footerModule from './components/footer.js'; */

headerModule();
/* renderFooter(); */

document.addEventListener('DOMContentLoaded', () => {
  // [1] 히어로 섹션 슬라이드
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

  // [2] 베스트 프레임 섹션 슬라이드
  const productSection = document.querySelector('.product_list_container');
  const productListWrapper = document.getElementById('product_list_wrapper');
  if (productSection && productListWrapper) {
    fetch('./data/products.json')
      .then((res) => res.json())
      .then((data) => {
        const products = Array.isArray(data) ? data : [];
        productListWrapper.innerHTML = '';
        products.slice(0, 8).forEach((p) => {
          const card = createProductCard(p);
          card.classList.add('swiper-slide');
          productListWrapper.appendChild(card);
        });

        new Swiper('.product_list_container', {
          slidesPerView: 1,
          grid: { rows: 2, fill: 'column' },
          spaceBetween: 20,
          grabCursor: true,
          breakpoints: {
            1024: { slidesPerView: 4, grid: { rows: 1 }, spaceBetween: 24 },
          },
        });

        // 드래그 가이드 애니메이션 (다시)
        const guide = productSection.querySelector('.drag_guide');
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && guide) {
                guide.classList.add('active');
                setTimeout(() => {
                  guide.classList.remove('active');
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
        observer.observe(productSection);
      })
      .catch((err) => console.error('Product List Error:', err));
  }

  // [3] 컬렉션(기획전) 섹션 로드
  const collectListWrap = document.querySelector('.collect_list_wrap');
  const collectSwiperWrapper = document.getElementById('collect_swiper_wrapper');

  if (collectListWrap && collectSwiperWrapper) {
    Promise.all([
      fetch('./data/collections_list.json').then((res) => res.json()),
      fetch('./data/products.json').then((res) => res.json()),
    ])
      .then(([collections, products]) => {
        collectSwiperWrapper.innerHTML = '';

        collections.forEach((collection, index) => {
          const targetProduct = Array.isArray(products) ? products[index % products.length] : products;

          let thumbImages = [];
          if (targetProduct?.detailImages && targetProduct.detailImages.length >= 3) {
            thumbImages = targetProduct.detailImages.slice(0, 3);
          } else {
            thumbImages = [
              targetProduct?.thumbnail || collection.image,
              (targetProduct?.detailImages && targetProduct.detailImages[0]) || collection.image,
              (targetProduct?.detailImages && targetProduct.detailImages[1]) || collection.image,
            ];
          }

          const finalBrandName = collection.brandName || targetProduct?.brand || 'RAY-BAN';
          const finalBrandDesc = collection.description || '선글라스 브랜드 설명입니다.';

          const card = document.createElement('article');
          card.className = 'collect_card swiper-slide';
          card.innerHTML = `
            <div class="collect_card_head">
              <div class="collect_card_info">
                <h3 class="collect_name">${collection.title} 🩷</h3>
                <span class="collect_meta">${collection.subtitle || ''}</span>
              </div>
              <a href="${collection.href}" class="collect_more pre_reg_12">더보기</a>
            </div>
            <div class="collect_main_image">
              <a href="${collection.href}"><img src="${collection.image}" alt="${collection.title}"></a>
            </div>
            <div class="collect_thumb_list">
              <ul>
                <li><a href="${collection.href}"><img src="${thumbImages[0] || ''}" alt="sub_img_1"></a></li>
                <li><a href="${collection.href}"><img src="${thumbImages[1] || ''}" alt="sub_img_2"></a></li>
                <li><a href="${collection.href}"><img src="${thumbImages[2] || ''}" alt="sub_img_3"></a></li>
              </ul>
            </div>
            <div class="collect_brand">
              <p class="collect_brand_name mont_bold_16">${finalBrandName}</p>
              <p class="collect_brand_desc pre_reg_16">${finalBrandDesc}</p>
            </div>
          `;
          collectSwiperWrapper.appendChild(card);
        });

        // Swiper 슬라이더 활성화
        new Swiper('.collect_list_wrap', {
          slidesPerView: 1,
          spaceBetween: 20,
          grabCursor: true,
          observer: true,
          observeParents: true,
          breakpoints: {
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          },
        });
      })
      .catch((err) => console.error('Collection Render Error:', err));
  }

  // [4] 셀럽픽 섹션 슬라이드
  const celebWrapper = document.getElementById('celeb-wrapper');

  if (celebWrapper) {
    fetch('./data/celeb.json')
      .then((res) => res.json())
      .then((data) => {
        celebWrapper.innerHTML = '';

        const validCelebPicks = data.celebPicks.filter(
          (item) => item.celeb !== null && item.celeb !== undefined && item.celeb !== '',
        );

        if (validCelebPicks.length === 0) {
          console.warn('출력할 수 있는 셀럽 데이터가 없습니다.');
          return;
        }

        validCelebPicks.forEach((item) => {
          const slide = document.createElement('div');
          slide.className = 'swiper-slide celeb_image';
          const linkHref = item.href ? item.href : 'javascript:void(0);';

          slide.innerHTML = `
            <a href="${linkHref}">
              <img src="${item.image}" alt="${item.celeb}" />
            </a>
          `;
          celebWrapper.appendChild(slide);
        });

        new Swiper('.main-celeb-swiper', {
          loop: true,
          allowTouchMove: true,
          speed: 4000,
          freeMode: {
            enabled: true,
            sticky: false,
          },
          autoplay: {
            delay: 0,
            disableOnInteraction: false,
          },
          breakpoints: {
            0: {
              slidesPerView: 3,
              spaceBetween: 12,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
          },
        });
      })
      .catch((err) => console.error('Celeb Slider Error:', err));
  }
});
