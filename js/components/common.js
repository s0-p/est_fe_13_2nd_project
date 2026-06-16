// 로컬스토리지에서 장바구니 읽기
let cartItems = getCartItems();
function getCartItems() {
  return JSON.parse(localStorage.getItem('cartItems')) || [];
}

//로컬스토리지에서 장바구니 쓰기
function saveCartItems(cartItems) {
  window.localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

//장바구니 버튼 클릭 시 장바구니 추가
export function addToCart(product, qty = 1) {
  if (!product) return;

  const cartItems = getCartItems();

  //이미 담긴 상품 확인
  const existingItem = cartItems.find((item) => item.productIndex === product.productIndex);

  if (existingItem) {
    //그 상품 수량 증가
    existingItem.qty += qty;
  } else {
    //새 상품 추가, 수량 1
    cart.push({
      productIndex: currentProduct.productIndex,
      title: currentProduct.title,
      brand: currentProduct.brand,
      price: currentProduct.price,
      thumbnail: currentProduct.thumbnail,
      qty: qty,
    });
  }
  saveCartItems(cartItems);

  // totalCartCount();
}
