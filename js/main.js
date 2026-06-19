import headerModule from './components/header.js';
import renderFooter from './components/footer.js';
import createProductCard from './components/product-card.js';
import renderSidebar from './components/side-bar.js';

headerModule();
renderFooter();
renderSidebar();

// [A] 페이지가 로드된 후 실행될 화면 렌더링 코드들
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

  // [2] ベ스트 프레임 섹션
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
          let thumbImages = [];

          if (targetProduct?.detailImages && targetProduct.detailImages.length >= 3) {
            thumbImages = targetProduct.detailImages.slice(0, 3);
          } else {
            thumbImages = [
              targetProduct?.thumbnail || collection.image,
              targetProduct?.detailImages?.[0] || collection.image,
              targetProduct?.detailImages?.[1] || collection.image,
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

// 로컬스토리지에서 장바구니 읽기
export function getCartItems() {
  try {
    return JSON.parse(localStorage.getItem('cartItems')) || [];
  } catch (error) {
    console.error('장바구니 데이터를 읽는 중 오류 발생', error);
    return [];
  }
}

// 로컬스토리지에서 장바구니 쓰기
export function saveCartItems(cartItems) {
  window.localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// 장바구니 버튼 클릭 시 장바구니 추가
export function addToCart(product, qty = 1) {
  if (!product) {
    alert('올바르지 않은 접근입니다. 메인으로 이동합니다.');
    window.location.href = './index.html';
    return;
  }

  // 품절 체크
  if (product.stock === 0 || product.isSoldOut === true || String(product.price).includes('품절')) {
    alert('품절된 상품입니다.');
    return;
  }

  // 데이터 추가
  const cartItems = getCartItems();
  const existingItem = cartItems.find((item) => item.productIndex === product.productIndex);

  if (existingItem) {
    existingItem.quantity += qty;
  } else {
    cartItems.push({
      productIndex: product.productIndex,
      title: product.title,
      brand: product.brand,
      price: Number(String(product.price).replaceAll(',', '')),
      thumbnail: product.thumbnail,
      quantity: qty,
    });
  }
  saveCartItems(cartItems);

  alert('장바구니에 상품을 추가하였습니다.');
}
scroll;
