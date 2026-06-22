import renderHeader from './components/header.js';
import renderFooter from './components/footer.js';
import createProductCard from './components/product-card.js';
import renderSidebar from './components/side-bar.js';
import { addToCart } from './components/common.js';

renderHeader();
renderFooter();
renderSidebar();

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

  // [2] 베스트 프레임 섹션
  const productSection = document.querySelector('.product_list_container');
  const productListWrapper = document.getElementById('product_list_wrapper');

  if (productSection && productListWrapper) {
    fetch('./data/products.json')
      .then((res) => res.json())
      .then((data) => {
        const products = Array.isArray(data) ? data : [];
        productListWrapper.innerHTML = '';

        products.slice(0, 4).forEach((p, index) => {
          const card = createProductCard(p);
          const tags = card.querySelector('.tags');

          if (tags) {
            tags.innerHTML = `
              <div class="tag pre_reg_12">${p.brand}</div>
              <div class="tag pre_reg_12">${p.category}</div>
              <div class="tag pre_reg_12">
                ${parseInt(p.reviewCount.replace(/,/g, '')) >= 500 ? 'BEST' : '추천'}
              </div>
            `;
          }

          productListWrapper.appendChild(card);

          const cartBtn =
            card.querySelector('.btn_cart') || card.querySelector('.cart_btn') || card.querySelector('button');
          if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();

              addToCart(p, 1);

              alert('장바구니에 상품을 추가하였습니다.');
            });
          }

          const imageSlider = card.querySelector('.image_slider');
          if (imageSlider) {
            new Swiper(imageSlider, {
              slidesPerView: 1,
              loop: false,
              navigation: {
                nextEl: card.querySelector('.image_next'),
                prevEl: card.querySelector('.image_prev'),
              },
            });
          }
        });
      })
      .catch((err) => console.error('Product Fetch Error:', err));
  }

  // [3] 컬렉션(기획전) 섹션 로드
  const collectListWrap = document.querySelector('.collect_list_wrap');
  const collectSwiperWrapper = document.getElementById('collect_swiper_wrapper');
  const collectSection = document.getElementById('main_collect');

  let swiper = null;
  let guideShownOnce = false;
  const dragGuide = document.getElementById('collect_drag_guide');

  function showGuide() {
    if (!dragGuide) return;
    dragGuide.classList.add('show');
    dragGuide.classList.remove('hide');
    clearTimeout(dragGuide._timer);
    dragGuide._timer = setTimeout(() => {
      dragGuide.classList.add('hide');
      dragGuide.classList.remove('show');
    }, 1500);
  }

  if (collectListWrap && collectSwiperWrapper) {
    Promise.all([
      fetch('./data/collections_list.json').then((res) => res.json()),
      fetch('./data/products.json').then((res) => res.json()),
    ])
      .then(([collections, products]) => {
        collectSwiperWrapper.innerHTML = '';

        collections.forEach((collection, index) => {
          const targetProduct = Array.isArray(products) ? products[index % products.length] : products;

          // ---------------- 여기서부터 바뀐 코드 삽입 ----------------
          let thumbImages = [];

          // 1. 해당 상품에서 쓸 수 있는 모든 이미지 주소를 한 바구니에 다 모읍니다.
          const allAvailableImages = [];

          if (targetProduct?.thumbnail) {
            allAvailableImages.push(targetProduct.thumbnail);
          }
          if (Array.isArray(targetProduct?.detailImages)) {
            allAvailableImages.push(...targetProduct.detailImages);
          }

          // 만약 모아둔 이미지가 하나도 없다면 기획전 대표 이미지를 기본값으로 지정
          if (allAvailableImages.length === 0) {
            allAvailableImages.push(collection.image);
          }

          // 2. 피셔-예이츠(Fisher-Yates) 셔플 알고리즘으로 이미지 배열을 무작위로 뒤섞습니다.
          for (let i = allAvailableImages.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allAvailableImages[i], allAvailableImages[j]] = [allAvailableImages[j], allAvailableImages[i]];
          }

          // 3. 뒤섞인 배열에서 앞에서부터 딱 3개만 잘라옵니다.
          thumbImages = allAvailableImages.slice(0, 3);

          // 4. 만약 전체 이미지 종류가 부족해서 3개가 안 채워졌다면, 채워질 때까지 첫 번째 이미지를 복사해서 채웁니다 (에러 방지)
          while (thumbImages.length < 3) {
            thumbImages.push(thumbImages[0] || collection.image);
          }
          // ---------------- 여기까지 바뀐 코드 삽입 ----------------

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
              <a href="${collection.href}">
                <img src="${collection.image}" alt="${collection.title}">
              </a>
            </div>
            <div class="collect_thumb_list">
              <ul>
                <li><a href="${collection.href}"><img src="${thumbImages[0] || ''}" alt=""></a></li>
                <li><a href="${collection.href}"><img src="${thumbImages[1] || ''}" alt=""></a></li>
                <li><a href="${collection.href}"><img src="${thumbImages[2] || ''}" alt=""></a></li>
              </ul>
            </div>
            <div class="collect_brand">
              <p class="collect_brand_name mont_bold_16">${finalBrandName}</p>
              <p class="collect_brand_desc pre_reg_16">${finalBrandDesc}</p>
            </div>
          `;
          collectSwiperWrapper.appendChild(card);
        });

        swiper = new Swiper('.collect_list_wrap', {
          slidesPerView: 1,
          spaceBetween: 20,
          grabCursor: true,
          observer: true,
          observeParents: true,
          breakpoints: {
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          },
          on: {
            init() {
              setTimeout(() => {
                showGuide();
                guideShownOnce = true;
              }, 800);
            },
            touchStart() {
              if (dragGuide) {
                dragGuide.classList.add('hide');
              }
            },
          },
        });

        if (collectSection) {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting && guideShownOnce) {
                  showGuide();
                }
              });
            },
            { threshold: 0.6 },
          );
          observer.observe(collectSection);
        }
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
          freeMode: { enabled: true, sticky: false },
          autoplay: { delay: 0, disableOnInteraction: false },
          breakpoints: {
            0: { slidesPerView: 3, spaceBetween: 12 },
            768: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 5, spaceBetween: 20 },
          },
        });
      })
      .catch((err) => console.error('Celeb Slider Error:', err));
  }
});
