// 임시 데이터
// let cartItems = [
//   {
//     productIndex: '3024875',
//     title: '하바나&블랙 RB2489 1441/R5 레이밴 선글라스',
//     brand: 'Ray-Ban',
//     price: '289000',
//     thumbnail: 'https://image.rounz.com/_data/product/RAYBAN/RB2489-1441_R5/RB2489-1441_R5_03.JPG',
//     quantity: 1,
//   },
// ];

let cartItems = getCartItems();
function getCartItems() {
  return JSON.parse(localStorage.getItem('cartItems')) || [];
}
console.log(cartItems);
function saveCartItems(cartItems) {
  window.localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// 장바구니 상품 로드
const cartList = document.querySelector('.cart_product');

function renderCart() {
  cartList.innerHTML = '';
  let cartHTML = [];
  if (cartItems.length === 0) {
    // cartItems 임시데이터
    cartHTML.push(
      `<article class="empty_cart">
        장바구니가 비어있습니다.
        </article>`,
    );
  } else {
    cartHTML = cartItems.map(
      (item) =>
        `<article class="product_item" data-product-index="${item.productIndex}">
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
                    <span class="quantity">${item.quantity}</span>
                    <button type="button" class="plus_btn" aria-label="수량 증가">+</button>
                  </div>
                  <p class="product_price pre_bold_14">₩${item.price.toLocaleString()}</p>
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

// 쿠폰 목업 데이터
const coupons = [
  {
    id: 1,
    name: '신규 회원 쿠폰',
    discount: 5000,
  },
  {
    id: 2,
    name: '여름 할인 쿠폰',
    discount: 10000,
  },
];
let selectedCoupon = null;

const couponList = document.querySelector('.coupon_select');
const discountPrice = document.querySelectorAll('.discount_price');

function renderCoupon() {
  couponList.innerHTML =
    `<option value="">
        쿠폰을 선택해주세요
      </option>` +
    coupons
      .map((coupon) => `<option value="${coupon.id}">${coupon.name} (-${coupon.discount.toLocaleString()}원)</option>`)
      .join('');
}
renderCoupon();

couponList.addEventListener('change', (e) => {
  const couponId = Number(e.target.value);

  selectedCoupon = coupons.find((coupon) => coupon.id === couponId);

  if (!selectedCoupon) {
    discountPrice.forEach((item) => {
      item.textContent = '₩---,---';
    });
    return;
  }
  discountPrice.forEach((item) => {
    item.textContent = `-₩${selectedCoupon.discount.toLocaleString()}`;
  });
});

// 장바구니 총 상품 수량 합계 함수
// function getCartCount() {
//   const cart = getCartItems()
//   return cart.reduce((total, item) => total + item.quantity, 0);
// }

// 상단 장바구니 상품 전체 수량 출력
const cartCount = document.querySelector('.shopping_bag_tab > span');

function totalCartCount() {
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  cartCount.textContent = totalQuantity;
}
totalCartCount();

// 수량 증가, 감소
cartList.addEventListener('click', (e) => {
  const plusBtn = e.target.closest('.plus_btn');
  const minusBtn = e.target.closest('.minus_btn');

  if (!plusBtn && !minusBtn) return;

  const item = cartItems[0]; //
  if (plusBtn) {
    item.quantity++;
  }
  if (minusBtn && item.quantity > 1) {
    item.quantity--;
  }

  saveCartItems(cartItems);
  renderCart();
  totalCartCount();
  updateTotalAmount();
});

// 수량 변경 시 총 금액 계산 (할인 전, 할인 후)
const productAmount = document.querySelector('.product_price');
const totalAmount = document.querySelectorAll('.total_price');
const bfDiscount = document.querySelector('.before_discount_price');

function updateTotalAmount() {
  if (cartItems.length === 0) {
    bfDiscount.textContent = '₩0';

    totalAmount.forEach((e) => {
      e.textContent = '₩0';
    });
    return;
  }

  // const item = cartItems[0];
  const total = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const discount = selectedCoupon?.discount || 0;
  const finalTotal = total - discount;

  bfDiscount.textContent = `₩${total.toLocaleString()}`; // 할인 전

  totalAmount.forEach((e) => {
    e.textContent = `₩${finalTotal.toLocaleString()}`;
  }); // 할인 후
}
updateTotalAmount();

// 모달 열고 닫기
const modals = document.querySelectorAll('.modal');
const optionModal = document.querySelector('.option_modal');
const couponModal = document.querySelector('.coupon_modal');
const deleteModal = document.querySelector('.delete_modal');
const couponBtn = document.querySelector('.coupon_button');
const closeBtn = document.querySelectorAll('.modal_close');
const deleteCancel = document.querySelector('.cancel_button');
const deleteItemBtn = document.querySelector('.confirm_delete_button');
const applyBtn = document.querySelectorAll('.apply_button');

// 모달 열기
cartList.addEventListener('click', (e) => {
  const optionBtn = e.target.closest('.option_edit');
  const deleteBtn = e.target.closest('.close_button');

  if (optionBtn) {
    optionModal.removeAttribute('hidden');
  }
  if (deleteBtn) {
    deleteModal.removeAttribute('hidden');
  }
});
couponBtn.addEventListener('click', () => {
  couponModal.removeAttribute('hidden');
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
// 쿠폰 모달 닫고 할인가 계산
applyBtn.forEach((btn) => {
  btn.addEventListener('click', () => {
    // if (!selectedCoupon) {
    //   alert('쿠폰을 선택해주세요');
    //   return;
    // }
    closeModal(couponModal);
    closeModal(optionModal);
    updateTotalAmount();
  });
});

// 상품 목록에서 삭제
let selectedDeleteId = null;

cartList.addEventListener('click', (e) => {
  const deleteBtn = e.target.closest('.close_button');
  if (!deleteBtn) return;

  const productItem = deleteBtn.closest('.product_item');
  const productIndex = Number(productItem.dataset.productIndex);

  deleteModal.removeAttribute('hidden');

  selectedDeleteId = productIndex;
});
deleteItemBtn.addEventListener('click', () => {
  cartItems = cartItems.filter((item) => item.productIndex !== selectedDeleteId);

  saveCartItems(cartItems);
  renderCart();
  totalCartCount();
  updateTotalAmount();
  closeModal(deleteModal);
});
