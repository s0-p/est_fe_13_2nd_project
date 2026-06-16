function createProductCard(p) {
  const productCard = document.createElement('a');
  productCard.className = 'product_card display_flex flex_column';
  productCard.innerHTML = `
      <div class="swiper image_slider">
        <ul class="swiper-wrapper">
        </ul>
        <div class="actions display_flex flex_column justify_content_between align_items_end">
          <div class="top display_flex justify_content_between">
            <div class="badge gradient_text">New</div>
            <div class="whish_btn material-icons icon_24 border_round">favorite_border</div>
          </div>
          <div class="slider_btns display_flex justify_content_between">
            <div class="image_prev material-icons">chevron_left</div>
            <div class="image_next material-icons">chevron_right</div>
          </div>
          <div class="bottom display_flex justify_content_between">
            <div class="read_only_pagers"></div>
            <div class="ar_btn border_round display_inline_flex align_items_center">
              <span class="material-icons icon_16">fullscreen</span>
              <span class="mont_reg_14">AR</span>
            </div>
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
            <div class="cart_btn material-icons icon_24">add_shopping_cart</div>
          </div>
          <div class="summary display_flex justify_content_between">
            <div class="name pre_reg_14 truncate">${p.title}</div>
            <div class="price pre_reg_14">₩ ${p.price}</div>
          </div>
        </div>
      </div>
    `;

  const images_wrapper = productCard.querySelector('.image_slider ul');
  const MAX_IMAGES = 4;
  for (let i = 0; i < Math.min(p.detailImages.length, MAX_IMAGES); i++) {
    const li = document.createElement('li');
    li.className = 'swiper-slide';
    li.innerHTML = `<img src="${p.detailImages[i]}" alt="" />`;
    // <li class="swiper-slide"><img src="" alt="" /></li>
    images_wrapper.append(li);
  }

  return productCard;
}

function renderSkeleton() {}
export default createProductCard;
