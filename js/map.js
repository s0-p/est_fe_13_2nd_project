document.addEventListener('DOMContentLoaded', function () {
  var mapContainer = document.getElementById('map');
  var storePosition = new kakao.maps.LatLng(37.4935506, 127.0310534); // 라운즈 강남점

  var mapOption = {
    center: storePosition,
    level: 4,
  };

  var map = new kakao.maps.Map(mapContainer, mapOption);

  // 마커 생성
  var marker = new kakao.maps.Marker({
    position: storePosition,
  });
  marker.setMap(map);

  var content = `
  <div class="customoverlay">
    <div class="map-overlay-card">
      <div class="card-body display_flex flex_column">
        <div class="card_header display_flex align_items_center">
          <button type="button" class="wish_btn material-icons icon_24 border_round" aria-label="관심 매장 등록">
          favorite_border
          </button>
          <strong class="store_name pre_bold_14">라운즈 강남역점</strong>
        </div>
        <address class="store_address pre_reg_12">서울 강남구 역삼로 109 1층</address>
        <span class="store-tel pre_reg_12">0507-1387-1041</span>
        </div>
      <a href="https://map.kakao.com/link/to/라운즈 강남역점,37.4935506,127.0310534" class="btn_detail_blue display_flex justify_content_center align_items_center pre_reg_14" target="_blank">상세보기</a>
    </div>
  </div>
  `;

  // 커스텀 오버레이 생성 및 지도에 표시
  var customOverlay = new kakao.maps.CustomOverlay({
    position: storePosition,
    content: content,
    yAnchor: 1.2, // 높이 조절
  });

  customOverlay.setMap(map);
});

// 관심 매장 등록 클릭 이벤트
const wishBtn = document.querySelector('.wish_btn');
wishBtn.addEventListener('click', () => {
  const isFavorite = wishBtn.textContent.trim() === 'favorite_border';

  wishBtn.textContent = isFavorite ? 'favorite' : 'favorite_border';

  wishBtn.setAttribute('aria-label', isFavorite ? '관심 매장 해제' : '관심 매장 등록');
});

// 매장 목록 열고 닫기
const toggleBtn = document.querySelector('.btn_toggle_list');
const storeListWrapper = document.querySelector('.store_list_wrapper');
const arrow = toggleBtn.querySelector('.arrow');

toggleBtn.addEventListener('click', () => {
  const isOpen = storeListWrapper.classList.toggle('active');

  toggleBtn.setAttribute('aria-expanded', isOpen);

  toggleBtn.childNodes[2].textContent = isOpen ? '매장 목록 닫기' : '매장 목록 열기';

  arrow.textContent = isOpen ? 'expand_less' : 'expand_more';
});
