// 로컬스토리지에서 장바구니 읽기
export function getCartItems() {
  try {
    return JSON.parse(localStorage.getItem('cartItems')) || [];
  } catch (error) {
    console.error('장바구니 데이터를 읽는 중 오류 발생', error);
    return [];
  }
}

//로컬스토리지에서 장바구니 쓰기
export function saveCartItems(cartItems) {
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
    existingItem.quantity += qty;
  } else {
    //새 상품 추가, 수량 1
    cartItems.push({
      productIndex: product.productIndex,
      title: product.title,
      brand: product.brand,
      price: Number(product.price.replaceAll(',', '')),
      thumbnail: product.thumbnail,
      quantity: qty,
    });
  }
  saveCartItems(cartItems);

  // totalCartCount();
}
