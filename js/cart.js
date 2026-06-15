// 임시 데이터
let cartItems = [
  {
    productIndex: '3024875',
    title: '하바나&블랙 RB2489 1441/R5 레이밴 선글라스',
    brand: 'Ray-Ban',
    price: 289000,
    thumbnail: 'https://image.rounz.com/_data/product/RAYBAN/RB2489-1441_R5/RB2489-1441_R5_03.JPG',
    quantity: 1,
  },
];

// 장바구니 상품 로드
const cartList = document.querySelector('.cart_product');
let cartHTML = [];

function renderCart() {
  cartList.querySelectorAll('product_item').forEach((item) => {
    item.remove();
  });
  if (cartItems === 0) {
    // cartItems 임시데이터
    cartHTML.push(
      `<article>
  장바구니가 비어있습니다.
</article>`,
    );
  } else {
    cartHTML = cartItems.map(
      // cartItems 임시데이터
      (item) =>
        `<article class="product_item">
              <img class="product_image" src="${item.thumbnail}" alt="${item.title}" />
              <div class="product_content">
                <div class="product_info">
                  <p class="product_brand pre_bold_14">${item.brand}</p>
                  <h2 class="product_name pre_reg_12">${item.title}</h2>
                  <p class="product_option pre_reg_12">
                    옵션 / 옵션 / 옵션
                    <button class="option_edit" type="button" aria-haspopup="dialog">수정</button>
                  </p>
                </div>
                <div class="product_footer">
                  <div class="quantity_control pre_reg_12">
                    <button type="button" class="minus_btn" aria-label="수량 감소">-</button>
                    <span id="quantity">${item.quantity}</span>
                    <button type="button" class="plus_btn" aria-label="수량 증가">+</button>
                  </div>
                  <p class="product_price pre_bold_14">₩${item.price}</p>
                </div>
              </div>
              <button class="delete_icon" type="button" aria-label="상품 삭제" aria-haspopup="dialog">
                <span class="material-icons icon_20 close_button" aria-hidden="true">close</span>
              </button>
        </article>`,
    );
  }
  cartList.insertAdjacentHTML('beforeend', cartHTML.join(''));
}
renderCart();

// 상단 장바구니 전체 수량 출력
const cart_total_count = document.querySelector('.shopping_bag_tab > span');
let cart_total = `로컬 스토리지에 담긴 장바구니 아이템 개수`; // 로컬스토리지에서 카트 읽어오는 함수 추가 해야됨.

function totalCartCount() {
  cart_total_count.textContent = `${cartItems.length}`; // 임시데이터로 테스트. cartItems => cart_total 로 나중에 변경
}
totalCartCount();

// 수량 증가, 감소
const quantity_control = document.querySelector('.quantity_control');
const quantityEl = document.querySelector('#quantity');

quantity_control.addEventListener('click', (e) => {
  const btn = e.target.closest('button');

  if (!btn) return;

  let currentQty = Number(quantityEl.textContent);

  if (btn.textContent === '-') {
    if (currentQty > 1) {
      currentQty--;
    }
  } else {
    currentQty++;
  }
  quantityEl.textContent = currentQty;
});

// 모달 열고 닫기
const modals = document.querySelectorAll('.modal');
const optionModal = document.querySelector('.option_modal');
const couponModal = document.querySelector('.coupon_modal');
const deleteModal = document.querySelector('.delete_modal');
const optionBtn = document.querySelector('.option_edit');
const couponBtn = document.querySelector('.coupon_button');
const closeBtn = document.querySelectorAll('.modal_close');
const deleteBtn = document.querySelector('.close_button');
const deleteCancel = document.querySelector('.cancel_button');
const deleteItem = document.querySelector('.confirm_delete_button');
// 모달 열기
optionBtn.addEventListener('click', () => {
  optionModal.removeAttribute('hidden');
});
couponBtn.addEventListener('click', () => {
  couponModal.removeAttribute('hidden');
});
deleteBtn.addEventListener('click', () => {
  deleteModal.removeAttribute('hidden');
});
// 모달 닫기
function closeModal(modal) {
  modal.setAttribute('hidden', '');
}

modals.forEach((modal) => {
  const dim = modal.querySelector('.modal_dim');
  dim.addEventListener('click', () => {
    closeModal(modal);
  });
});
document.querySelectorAll('.modal_close, .cancel_button').forEach((btn) => {
  const modal = btn.closest('.modal');
  btn.addEventListener('click', () => {
    closeModal(modal);
  });
});
