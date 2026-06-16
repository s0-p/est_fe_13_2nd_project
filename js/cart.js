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

function saveCartItems(cartItems) {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}
console.log(cartItems);
// 장바구니 상품 로드
const cartList = document.querySelector('.cart_product');

function renderCart() {
  cartList.innerHTML = '';
  let cartHTML = [];
  // cartList.querySelectorAll('.product_item').forEach((item) => {
  //   item.remove();
  // });
  if (cartItems.length === 0) {
    // cartItems 임시데이터
    cartHTML.push(
      `<article class="empty_cart">
        장바구니가 비어있습니다.
        </article>`,
    );
  } else {
    cartHTML = cartItems.map(
      // cartItems 임시데이터
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

// 장바구니 총 상품 수량 합계 함수
// function getCartCount() {
//   const cart = readCart(); // 아직 함수 안만들었음 . 로컬에서 카트 읽어오는 함수
//   return cart.reduce((total, item) => total + item.quantity, 0);
// }

// 상단 장바구니 상품 전체 수량 출력
const cartCount = document.querySelector('.shopping_bag_tab > span');
let cart_total = `로컬 스토리지에 담긴 장바구니 아이템 개수`; // 로컬스토리지에서 카트 읽어오는 함수 추가 해야됨.

function totalCartCount() {
  cartCount.textContent = `${cartItems.length}`; // 임시데이터로 테스트. cartItems => cart_total 로 나중에 변경
}
totalCartCount();

// 수량 증가, 감소
cartList.addEventListener('click', (e) => {
  const plusBtn = e.target.closest('.plus_btn');
  const minusBtn = e.target.closest('.minus_btn');

  if (!plusBtn && !minusBtn) return;

  const item = cartItems[0];
  if (plusBtn) {
    tem.quantity++;
  }
  if (minusBtn && item.quantity > 1) {
    item.quantity--;
  }

  saveCartItems(cartItems);
  renderCart();
  totalCartCount();
  updateTotalAmount();
});

const productAmount = document.querySelector('.product_price');
const totalAmount = document.querySelectorAll('.total_price');
// 수량 변경 시 .total_price 에 총 가격 출력 , 임시데이터로 작성
function updateTotalAmount() {
  if (cartItems.length === 0) {
    totalAmount.forEach((e) => {
      e.textContent = '₩0';
    });
    return;
  }

  const item = cartItems[0];
  const total = Number(item.price) * item.quantity;

  totalAmount.forEach((e) => {
    e.textContent = `₩${total.toLocaleString()}`;
  });
}
updateTotalAmount();

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
const deleteItemBtn = document.querySelector('.confirm_delete_button');
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

// 상품 목록에서 삭제
deleteItemBtn.addEventListener('click', () => {
  cartItems = [];

  closeModal(deleteModal);
  renderCart();
  totalCartCount();
  updateTotalAmount();
  saveCartItems(cartItems);
});
