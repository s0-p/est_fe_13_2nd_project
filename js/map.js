import renderHeader from './components/header.js';
import renderFooter from './components/footer.js';
import renderSidebar from './components/side-bar-test.js';

renderHeader();
renderSidebar();
renderFooter();

let map;

document.addEventListener('DOMContentLoaded', function () {
  var mapContainer = document.getElementById('map');
  var storePosition = new kakao.maps.LatLng(37.4935506, 127.0310534); // 라운즈 강남점

  var mapOption = {
    center: storePosition,
    level: 4,
  };

  map = new kakao.maps.Map(mapContainer, mapOption);
});

let customOverlay;

function storeOverlay(store) {
  const position = new kakao.maps.LatLng(Number(store.latitude), Number(store.longitude));
  var content = `
  <div class="customoverlay""
     ondblclick="event.stopPropagation()">
    <div class="map-overlay-card">
      <div class="card-body display_flex flex_column">
        <div class="card_header display_flex align_items_center">
          <button 
          type="button" 
          class="wish_btn material-icons icon_24 border_round" 
          data-store-name="${store.name}"
          aria-label="관심 매장 등록">
          ${favoriteStores.has(store.name) ? 'favorite' : 'favorite_border'}
          </button>
          <strong class="store_name pre_bold_14">${store.name}</strong>
        </div>
        <address class="store_address pre_reg_12">${store.address}</address>
        <span class="store-tel pre_reg_12">${store.tel}</span>
        </div>
      <a href="${store.mapUrl}" class="btn_detail_blue display_flex justify_content_center align_items_center pre_reg_14" target="_blank">상세보기</a>
    </div>
  </div>
  `;
  // 커스텀 오버레이 생성 및 지도에 표시
  if (customOverlay) {
    customOverlay.setMap(null);
  }
  customOverlay = new kakao.maps.CustomOverlay({
    position,
    content,
    yAnchor: 1.2,
  });

  customOverlay.setMap(map);
}

// 키워드 버튼 클릭 이벤트
const filters = document.querySelector('.filters');
const keywordBtn = filters.querySelectorAll('.keyword');

keywordBtn.forEach((keyword) => {
  keyword.addEventListener('click', () => {
    keywordBtn.forEach((item) => {
      item.classList.remove('active');
    });

    keyword.classList.add('active');

    currentFilter = keyword.dataset.filter;

    applyFilter();
  });
});

// 매장 목록 열고 닫기
const toggleArea = document.querySelector('.list_toggle_bar');
const toggleBtn = document.querySelector('.btn_toggle_list');
const storeListWrapper = document.querySelector('.store_list_wrapper');
const arrow = toggleBtn.querySelector('.arrow');
const toggleText = document.querySelector('.toggle_text');

toggleBtn.addEventListener('click', () => {
  if (window.innerWidth >= 1280) return;
  const isOpen = storeListWrapper.classList.toggle('active');
  toggleArea.classList.toggle('active', isOpen);

  toggleBtn.setAttribute('aria-expanded', isOpen);

  toggleText.textContent = isOpen ? '매장 목록 닫기' : '매장 목록 열기';

  arrow.textContent = isOpen ? 'expand_less' : 'expand_more';
});

/* 데이터 불러오기 */
let stores = [];
let currentStore = null;

async function loadStores() {
  try {
    const response = await fetch('../data/stores.json');
    stores = await response.json();

    renderStoreList();
  } catch (error) {
    console.error('매장 데이터 로드 실패', error);
  }
}

loadStores();

// 필터 함수
const favoriteStores = new Set(JSON.parse(localStorage.getItem('favoriteStores')) || []);

let currentFilter = 'all';

function applyFilter() {
  let filteredStores = stores;

  if (currentFilter === 'favorite') {
    filteredStores = stores.filter((store) => favoriteStores.has(store.name));
  }

  if (currentFilter === 'reserve') {
    filteredStores = stores.filter((store) => store.reservation === true);
  }

  renderStoreList(filteredStores);
}

// 로컬 스토리지에 관심 매장 저장
document.addEventListener('click', (e) => {
  const wishBtn = e.target.closest('.wish_btn');
  if (!wishBtn) return;

  const storeName = wishBtn.dataset.storeName;
  if (!storeName) return;

  if (favoriteStores.has(storeName)) {
    favoriteStores.delete(storeName);
  } else {
    favoriteStores.add(storeName);
  }

  localStorage.setItem('favoriteStores', JSON.stringify([...favoriteStores]));

  applyFilter();

  if (currentStore) {
    storeOverlay(currentStore);
  }
});

// 목록 렌더링
const storeList = document.querySelector('.store_list');
let currentStores = [];

function renderStoreList(list = stores) {
  currentStores = list; // 현재 화면에 렌더링된 배열을 기억

  storeList.innerHTML = list // 화면에 출력
    .map(
      (store, index) => `
      <li class="store_item" data-index="${index}">
        <div class="store_header">
          <button
            type="button"
            class="wish_btn border_round material-icons icon_24"
            data-store-name="${store.name}"
            aria-label="관심 매장 등록"
          >
            ${favoriteStores.has(store.name) ? 'favorite' : 'favorite_border'}
          </button>

          <strong class="store_name display_block pre_bold_14">
            ${store.name}
          </strong>
        </div>

        <address class="store_address pre_reg_12">
          ${store.address}
        </address>

        <span class="store_tel pre_reg_12">
          ${store.tel}
        </span>
        <a href="${store.mapUrl}" class="btn_detail material-icons icon_16" aria-label="상세보기"> chevron_right </a>
      </li>
    `,
    )
    .join('');
}

// 클릭한 매장으로 이동
storeList.addEventListener('click', (e) => {
  if (e.target.closest('.wish_btn')) return;

  const item = e.target.closest('.store_item');
  if (!item) return;

  const store = currentStore[item.dataset.index];

  const position = new kakao.maps.LatLng(Number(store.latitude), Number(store.longitude));

  map.panTo(position);
  storeOverlay(store);
});

// 검색 기능
const searchInput = document.querySelector('#storeSearch');

searchInput.addEventListener('input', () => {
  const keyword = searchInput.value.trim().toLowerCase();

  const filteredStores = stores.filter((store) => store.name.toLowerCase().includes(keyword));

  renderStoreList(filteredStores);
});
