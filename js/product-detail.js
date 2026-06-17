let productInfoSection = null;
let slideHero = null;
let slideHeroWrapper = null;
let slideOtherColor = null;
let slideOtherColorWrapper = null;
let slideSimilar = null;
let slideSimilarWrapper = null;
let imgSpecSizeWrapper = null;
let imgSpecMainWrapper = null;

document.addEventListener('DOMContentLoaded', () => {
  slideHeroWrapper = document.querySelector('.hero .swiper-wrapper');
  slideOtherColorWrapper = document.querySelector('.product_other_color .swiper-wrapper');
  slideSimilarWrapper = document.querySelector('.product_similar .swiper-wrapper');
  productInfoSection = document.querySelector('.product_info');
  imgSpecSizeWrapper = document.querySelector('.spec_image_wrapper > figure');
  imgSpecMainWrapper = document.querySelector('.spec_photos');

  initSwiper();
  initProduct();
});

/**
 * init swiper parameters
 */
function initSwiper() {
  slideHero = new Swiper('.slide_hero', {
    loop: true,
    speed: 2000,

    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
  });

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

    // filterCmsDescriptionImages(currentProduct.cmsDescriptionImages);

    renderSpec(currentProduct);
    renderSlide(currentProduct, 0);
    renderSlide(currentProduct, 1);
    const similarProducts = getSimilarProducts(currentProduct);
    renderSlide(similarProducts, 2);
    renderInfo(currentProduct);
  } catch (error) {
    console.error('제품 데이터를 로드 중 오류가 발생했습니다: ', error);
  }
}

/**
 * render info
 *
 * @param {*} data
 */
function renderInfo(data) {
  if (!productInfoSection || !data) return;

  const pureBrandName = parseBrand(data.brand, data.thumbnail);
  const shippingBadgeText = data.isSoldOut ? '품절' : '당일배송';

  const infoTemplate = `
    <div class="info_badge align_items_center pre_bold_10_auto">${shippingBadgeText}</div>
    
    <a href="${data.url || '#'}" class="info_brand display_flex align_items_center mont_reg_16">
      ${pureBrandName}
      <span class="material-icons icon_16">chevron_right</span>
    </a>
    
    <h1 class="info_title mont_bold_20">${data.title}</h1>
    
    <div class="info_meta display_flex pre_reg_12">
      <div class="meta_item display_flex align_items_center">
        <span class="material-icons icon_20">favorite_border</span>
        <span>찜 ${data.likeCount || 0}</span>
      </div>
      <div class="meta_item display_flex align_items_center">
        <span class="material-icons icon_20">chat</span>
        <span>후기 ${data.reviewCount || 0}</span>
      </div>
    </div>
    
    <div class="info_price_row display_flex justify_content_between align_items_center">
      <div class="price_discount_group display_flex align_items_center">
        <span class="price_original pre_reg_14">${data.retailPrice}원</span>
        <span class="price_discount pre_bold_14">${data.discountRate}%</span>
      </div>
      <div class="price_current mont_bold_20">${data.price}원</div>
    </div>
    
    <div class="info_benefit_accordion">
      <div class="info_benefit_heading display_flex justify_content_between">
        <div class="display_flex align_items_center pre_reg_12">
          신규 회원님 최대 할인 가격 <span class="material-icons icon_20">expand_more</span>
        </div>
        <div class="mont_bold_16">${data.memberMaxPrice}원</div>
      </div>
      <div class="panel_body display_none">
        <p>
          주문 시 원산지(${data.specifications['원산지'] || 'ITALY'}) 및 제조원(${data.specifications['제조원'] || 'LUXOTTICA'}) 규격을 반드시 확인해 주시기 바랍니다.
        </p>
        <p>쿠폰 할인율 및 적립금 혜택은 회원 등급에 따라 차등 적용될 수 있습니다.</p>
      </div>
    </div>
  `;

  productInfoSection.innerHTML = infoTemplate;
}

/**
 * render images in spec content
 *
 * @param {*} data
 */
function renderSpec(data) {
  if (!imgSpecSizeWrapper || !imgSpecMainWrapper) return;
  if (!data || !data.cmsDescriptionImages) return;

  // {
  //   sizeImages: [],
  //   productImages: [],
  //   brandImages: []
  // }
  const filteredResults = filterCmsDescriptionImages(data.cmsDescriptionImages);

  if (filteredResults.sizeImages && filteredResults.sizeImages.length > 0) {
    imgSpecSizeWrapper.innerHTML = `
      <img
        src="${filteredResults.sizeImages[0]}"
        alt="${data.title || '제품'} 상세 수치 이미지"
        class="spec_image"
      />`;
  } else {
    imgSpecSizeWrapper.innerHTML = ''; // 데이터가 없으면 비워주기
  }

  const productTemplate = filteredResults.productImages
    .map(
      (spec) => `
        <li>
          <img
            src="${spec}"
            alt="${data.title || '제품'} 이미지"
            class="spec_image"
          />
        </li>`,
    )
    .join('');

  const brandTemplate = filteredResults.brandImages
    .map(
      (spec) => `
        <li>
          <img
            src="${spec}"
            alt="${data.title || '제품'} 브랜드 이미지"
            class="spec_image"
          />
        </li>`,
    )
    .join('');

  imgSpecMainWrapper.innerHTML = productTemplate + brandTemplate;
}

/**
 * render slides
 *
 * @param {*} data
 * @param {number} code
 *
 * ******** code ********
 * 0: slide(hero)
 * 1: slide(other color)
 * 2: slide(similar)
 */
function renderSlide(data, code) {
  let slideTemplate = [];

  switch (code) {
    case 0:
      if (!slideHeroWrapper) return;
      if (!data || !data.detailImages) return;

      const textAlt = `${data.title} 히어로 슬라이드 이미지`;
      slideTemplate = data.detailImages
        .map(
          (product, idx) => `<div class="swiper-slide">
              <img
                src=${data.detailImages[idx]}
                alt="RB3774D 001/87(55) 골드 메탈 선글라스"
              />
            </div>`,
        )
        .join('');
      slideHeroWrapper.innerHTML = slideTemplate;

      break;

    case 1:
      if (!slideOtherColorWrapper) return;
      if (!data || !data.otherColors) return;

      slideTemplate = data.otherColors
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
      slideOtherColorWrapper.innerHTML = slideTemplate;

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

      slideTemplate = data
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
                  <strong class="info_code mont_bold_14">${parseBrandWithLineBreak(product.brand, product.thumbnail)}</strong>
                  <p class="info_description mont_reg_14">${product.title || 'null'}</p>
                </div>
              </article>`,
        )
        .join('');
      slideSimilarWrapper.innerHTML = slideTemplate;

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

/**
 * filter cms description images
 *
 * @param {Array} images - 원본 cmsDescriptionImages 배열
 * @returns {Object} 브랜드, 사이즈, 제품 이미지 배열을 갖는 배열 객체
 */
function filterCmsDescriptionImages(images) {
  const result = {
    sizeImages: [], // 1. 사이즈 규격 이미지 배열
    productImages: [], // 2. 제품 이미지 배열
    brandImages: [], // 3. 브랜드 이미지 배열
  };

  if (!images || !Array.isArray(images)) return result;

  images.forEach((url) => {
    const lowerUrl = url.toLowerCase();

    // 규칙 1. 브랜드 이미지 분리 ('BRAND' 문자열 포함)
    if (lowerUrl.includes('brand')) {
      result.brandImages.push(url);
      return;
    }

    // 규칙 2. 사이즈 규격 이미지 분리 (확장자 제외하고 '_size'로 끝남)
    // 정규식 설명: _size 뒤에 .jpg나 .png 등 확장자가 붙어 끝나는 구조 매칭
    if (/_size\.[a-z]+$/i.test(lowerUrl)) {
      result.sizeImages.push(url);
      return;
    }

    // 규칙 3. 제품 이미지 분리 ('detail' 포함하면서 '_숫자'로 끝남)
    // 정규식 설명: _ 뒤에 숫자가 붙고 확장자로 끝나는 구조 매칭 (예: _01.jpg, _02.png)
    if (lowerUrl.includes('detail') && /_[0-9]+\.[a-z]+$/i.test(lowerUrl)) {
      result.productImages.push(url);
      return;
    }
  });

  console.log(result);

  return result;
}

/**
 * seperate modelName from brand
 *
 * @param {string} brandStr - 원본 brand 문자열 (예: "Ray-BanRB3447N 001(53)")
 * @param {string} thumbnailUrl - 원본 thumbnail URL (예: "https://.../product/RAYBAN/...")
 * @returns {string} 줄바꿈 처리가 완료된 문자열
 */
function parseBrand(brandStr, thumbnailUrl) {
  if (!brandStr || !thumbnailUrl) return brandStr;

  let splitIndex = getBrandNameSplitIndex(brandStr, thumbnailUrl);
  if (splitIndex !== -1) {
    const brandName = brandStr.substring(0, splitIndex).trim();
    return `${brandName}`;
  }

  return '';
}

/**
 * line split modelName from brand
 *
 * @param {string} brandStr - 원본 brand 문자열 (예: "Ray-BanRB3447N 001(53)")
 * @param {string} thumbnailUrl - 원본 thumbnail URL (예: "https://.../product/RAYBAN/...")
 * @returns {string} 줄바꿈 처리가 완료된 문자열
 */
function parseBrandWithLineBreak(brandStr, thumbnailUrl) {
  if (!brandStr || !thumbnailUrl) return brandStr;

  let splitIndex = getBrandNameSplitIndex(brandStr, thumbnailUrl);
  if (splitIndex !== -1) {
    const brandName = brandStr.substring(0, splitIndex).trim();
    const modelCode = brandStr.substring(splitIndex).trim();
    return `${brandName}<br />${modelCode}`;
  }
}

/**
 * seperate modelName from brand
 *
 * @param {string} brandStr - 원본 brand 문자열 (예: "Ray-BanRB3447N 001(53)")
 * @param {string} thumbnailUrl - 원본 thumbnail URL (예: "https://.../product/RAYBAN/...")
 * @returns {number} 분리 지점 인덱스
 */
function getBrandNameSplitIndex(brandStr, thumbnailUrl) {
  if (!brandStr || !thumbnailUrl) return brandStr;

  try {
    // 1. 정규식을 활용해 thumbnailUrl의 'product/' 바로 뒤에 나오는 대문자 브랜드명 문자열을 추출합니다.
    const brandMatch = thumbnailUrl.match(/product\/([^\/]+)/);

    if (brandMatch && brandMatch[1]) {
      const extractedBrand = brandMatch[1]; // 예: "RAYBAN"

      // 2. 추출한 브랜드명을 정규식 패턴으로 만듭니다. (중간의 하이픈 등 특수문자 제거 후 글자만 매칭)
      // Ray-Ban과 RAYBAN을 매칭하기 위해 알파벳만 남기는 정규식을 씁니다.
      const normalizedBrand = extractedBrand.replace(/[^a-zA-Z]/g, ''); // "RAYBAN"

      // 원본 brand 문자열에서도 알파벳만 임시로 매칭할 수 있도록 인덱스를 탐색합니다.
      let splitIndex = -1;

      // brandStr의 글자 수만큼 돌면서 대소문자 무시하고 원본 문자열에서 브랜드명이 끝나는 지점을 찾습니다.
      let currentClean = '';
      for (let i = 0; i < brandStr.length; i++) {
        const char = brandStr[i];
        if (/[a-zA-Z]/.test(char)) {
          currentClean += char.toUpperCase();
        }

        // 원본에서 글자만 추린 게 썸네일 브랜드명과 일치하게 되는 순간의 인덱스 확보
        if (currentClean === normalizedBrand) {
          splitIndex = i + 1;
          break;
        }
      }

      return splitIndex;
    }
  } catch (error) {
    console.error('브랜드 문자열 파싱 중 에러 발생:', error);
    return -1;
  }
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
