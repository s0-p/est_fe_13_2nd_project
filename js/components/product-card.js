import { addToCart, parseNumber } from './common.js';

function createProductCard(p) {
  const productCard = document.createElement('div');
  productCard.className = 'product_card display_flex flex_column';
  productCard.innerHTML = `
      <div class="swiper image_slider">
        <ul class="swiper-wrapper">
        </ul>
        <div class="actions display_flex flex_column justify_content_between align_items_end">
          <div class="top display_flex justify_content_end">
            <div class="badge display_none">BEST</div>
            <button class="wish_btn material-icons icon_24 border_round">favorite_border</button>
          </div>
          <div class="slider_btns display_none justify_content_between">
            <button class="image_prev material-icons">chevron_left</button>
            <button class="image_next material-icons">chevron_right</button>
          </div>
          <div class="bottom display_flex justify_content_between">
            <div class="read_only_pagers"></div>
            <a href="https://abr.ge/fd5dbs" class="ar_btn border_round display_inline_flex align_items_center">
              <span class="material-icons icon_16">fullscreen</span>
              <span class="mont_reg_14">AR</span>
            </a>
          </div>
        </div>
      </div>
      <div class="info display_flex flex_column">
        <div class="tags display_flex">
          <div class="tag pre_reg_12">키워드</div>
          <div class="tag pre_reg_12">키워드</div>
          <div class="tag pre_reg_12">키워드</div>
        </div>
        <div class="details display_flex flex_column">
          <div class="purchase display_flex justify_content_between">
            <div class="color_options display_flex">
              <div class="color border_round"></div>
              <div class="color border_round"></div>
              <div class="color border_round"></div>
            </div>
            <button class="cart_btn material-icons icon_24">add_shopping_cart</button>
          </div>
          <div class="summary display_flex justify_content_between">
            <div class="name pre_reg_14 truncate">${p.title}</div>
            <div class="price pre_bold_14">₩ ${p.price}</div>
          </div>
        </div>
      </div>
    `;

  const images_wrapper = productCard.querySelector('.image_slider ul');
  const MAX_IMAGES = 4;
  for (let i = 0; i < Math.min(p.detailImages.length, MAX_IMAGES); i++) {
    const li = document.createElement('li');
    li.className = 'swiper-slide';
    li.innerHTML = `<img src="${p.detailImages[i]}" alt="${p.title}" />`;
    // <li class="swiper-slide"><img src="" alt="" /></li>
    images_wrapper.append(li);

    const sliderBtns = productCard.querySelector('.slider_btns');
    productCard.addEventListener('mouseenter', () => {
      sliderBtns.classList.remove('display_none');
      sliderBtns.classList.add('display_flex');
    });
    productCard.addEventListener('mouseleave', () => {
      sliderBtns.classList.add('display_none');
      sliderBtns.classList.remove('display_flex');
    });
  }

  const actionTop = productCard.querySelector('.actions .top');
  const badge = actionTop.querySelector('.badge');
  if (parseNumber(p.reviewCount) >= 500) {
    badge.classList.remove('display_none');
    actionTop.classList.remove('justify_content_end');
    actionTop.classList.add('justify_content_between');
  }
  const wishBtn = actionTop.querySelector('.wish_btn');
  wishBtn.addEventListener('click', () => {
    wishBtn.textContent = wishBtn.textContent === 'favorite_border' ? 'favorite' : 'favorite_border';
  });

  const details = productCard.querySelector('.details');
  const cartBtn = details.querySelector('.cart_btn');
  const toastCart = document.querySelector('.toast_cart');
  const toastProductName = toastCart.querySelector('.message .product_name');
  cartBtn.addEventListener('click', () => {
    addToCart(p);

    toastProductName.textContent = p.title;
    toastCart.style.visibility = 'visible';

    toastCart.style.animation = 'none';
    void toastCart.offsetWidth;
    toastCart.style.animation = 'cart-fade 3s ease-in-out';
  });

  toastCart.addEventListener('animationend', () => {
    toastCart.style.animation = 'none';
    toastCart.style.visibility = 'hidden';
  });

  if (p.isSoldOut) {
    const price = details.querySelector('.price');
    price.textContent = '일시품절';
  }

  return productCard;
}

export default createProductCard;
