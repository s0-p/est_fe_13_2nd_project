// 임시 데이터
let cartItems = [
  {
    productIndex: '11536',
    title: '레이밴 선글라스 클럽마스터',
    brand: 'Ray-Ban',
    price: 204800,
    thumbnail: '"https://image.rounz.com/_data/product/RAYBAN/RB3016-W0365(51)/RB3016-W0365(51)_11.jpg"',
    quantity: 1,
  },
];

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
const optionModal = document.querySelector('.option_modal');
const couponModal = document.querySelector('.coupon_modal');
const deleteModal = document.querySelector('.delete_modal');
const optionBtn = document.querySelector('.option_edit');
const couponBtn = document.querySelector('.coupon_button');
const deleteBtn = document.querySelector('.close_button');

optionBtn.addEventListener('click', () => {
  optionModal.removeAttribute('hidden');
});
couponBtn.addEventListener('click', () => {
  couponModal.removeAttribute('hidden');
});
deleteBtn.addEventListener('click', () => {
  deleteModal.removeAttribute('hidden');
});
