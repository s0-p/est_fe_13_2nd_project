let slideOtherColorWrapper = null;
let slideSimilarWrapper = null;
let slideOtherColor = null;
let slideSimilar = null;

document.addEventListener('DOMContentLoaded', () => {
  slideOtherColorWrapper = document.querySelector('.product_other_color .swiper-wrapper');
  slideSimilarWrapper = document.querySelector('.product_similar .swiper-wrapper');

  initSwiper();
  initProduct();
});

/**
 * init swiper parameters
 */
function initSwiper() {
  slideOtherColor = new Swiper('.slide_other_color', {
    loop: true,
    speed: 2000,
    slidesPerView: 2,
    slidesPerGroup: 2,
    spaceBetween: 16,

    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },

    // Responsive breakpoints
    breakpoints: {
      // when window width is >= 320px
      768: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 16,
      },
    },
  });

  slideSimilar = new Swiper('.slide_similar', {
    loop: true,
    speed: 2000,
    slidesPerView: 2,
    slidesPerGroup: 2,
    spaceBetween: 16,

    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },

    // Responsive breakpoints
    breakpoints: {
      // when window width is >= 320px
      768: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 16,
      },
    },
  });
}

/**
 * fetch product
 */
let productsJson = null;
let productsList = null;
async function initProduct() {
  try {
    const response = await fetch('../data/products.json');
    productsJson = await response.json();
    productsList = Array.isArray(productsJson) ? productsJson : [productsJson];

    /**test */
    const currentProduct = productsList[0];
    /**test */

    renderContent();
    renderSlide(currentProduct, 1);
    const similarProducts = getSimilarProducts(currentProduct);
    renderSlide(similarProducts, 2);
  } catch (error) {
    console.error('제품 데이터를 로드 중 오류가 발생했습니다: ', error);
  }
}

/**
 * render images in content
 */
function renderContent() {}

/**
 * render slides
 *
 * @param {*} data
 * @param {number} code
 *
 * ******** code ********
 * 1: slide(other color)
 * 2: slide(similar)
 */
function renderSlide(data, code) {
  let cardTemplate = '';

  switch (code) {
    case 1:
      if (!slideOtherColorWrapper) return;
      if (!data || !data.otherColors) return;

      cardTemplate = data.otherColors
        .map(
          (product) => `
          <article class="swiper-slide card_ui display_flex flex_column">
                <div class="card_ui_img_wrapper">
                  <a href="${product.url || '#'}">
                    <img
                      src="${product.image}"
                      alt="${product.title || 'null'}"
                    />
                  </a>
                </div>
                <div class="card_ui_info_wrapper">
                  <strong class="info_code mont_bold_14">${product.colorName}</strong>
                  <p class="info_description mont_reg_14">레이밴 선글라스 클럽마스터 RB3016 W0366 51mm</p>
                </div>
              </article>`,
        )
        .join('');
      slideOtherColorWrapper.innerHTML = cardTemplate;

      if (slideOtherColor) {
        const cardCount = data.otherColors.length;

        if (cardCount < 3) {
          slideOtherColor.params.loop = false;
          slideOtherColor.params.autoplay.enabled = false;
          slideOtherColor.autoplay.stop();
        }

        slideOtherColor.update();
      }
      break;

    case 2:
      if (!slideSimilarWrapper) return;
      if (!data) return;

      cardTemplate = data
        .map(
          (product) => `
          <article class="swiper-slide card_ui display_flex flex_column">
                <div class="card_ui_img_wrapper">
                  <a href="${product.url || '#'}">
                    <img
                      src="${product.thumbnail}"
                      alt="${product.title || 'null'}"
                    />
                  </a>
                </div>
                <div class="card_ui_info_wrapper">
                  <strong class="info_code mont_bold_14">${product.brand}</strong>
                  <p class="info_description mont_reg_14">${product.title || 'null'}</p>
                </div>
              </article>`,
        )
        .join('');
      slideSimilarWrapper.innerHTML = cardTemplate;

      if (slideSimilar) {
        const cardCount = data.length;

        if (cardCount < 3) {
          slideSimilar.params.loop = false;
          slideSimilar.params.autoplay.enabled = false;
          slideSimilar.autoplay.stop();
        }

        slideSimilar.update();
      }
      break;

    default:
      break;
  }
}

/**
 * filter similar products
 *
 * @param {Object} currentProduct
 * @returns {Array}
 */
function getSimilarProducts(currentProduct) {
  if (!productsList || productsList.length === 0) return [];

  return (
    productsList
      // 1. [필터링] 카테고리 인덱스가 일치하면서, 현재 보고 있는 상품 본인은 제외
      .filter(
        (product) =>
          product.categoryIndex === currentProduct.categoryIndex &&
          product.productIndex !== currentProduct.productIndex,
      )
      // 2. [정렬] likeCount 많은 순
      .sort((a, b) => {
        const likeA = parseInt(a.likeCount.replace(/,/g, ''), 10) || 0;
        const likeB = parseInt(b.likeCount.replace(/,/g, ''), 10) || 0;

        return likeB - likeA;
      })
      // 3. [자르기] 상위 6개만 추출
      .slice(0, 6)
  );
}

// const cardImageLink = document.querySelector('.card_ui img');
// const prevOtherColor = document.querySelector('.prev_other_color');
// const nextOtherColor = document.querySelector('.next_other_color');

// cardImageLink.addEventListener('click', (e) => {
//   e.preventDefault();
// });

// prevOtherColor.addEventListener('click', () => {
//   slideBasic.slidePrev();
// });
// nextOtherColor.addEventListener('click', () => {
//   slideBasic.slideNext();
// });
