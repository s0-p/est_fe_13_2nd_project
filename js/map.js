document.addEventListener('DOMContentLoaded', function () {
  var mapContainer = document.getElementById('map');
  var storePosition = new kakao.maps.LatLng(37.4935506, 127.0310534); // 라운즈 강남점

  var mapOption = {
    center: storePosition,
    level: 3,
  };

  var map = new kakao.maps.Map(mapContainer, mapOption);

  // 1. 마커 생성
  var marker = new kakao.maps.Marker({
    position: storePosition,
  });
  marker.setMap(map);

  var content = `
    <div class="map-overlay-card">
      <div class="card-body">
        <button type="button" class="btn-favorite" aria-label="관심 매장 등록"></button>
        <strong class="store-name">라운즈 강남역점</strong>
        <address class="store-address">서울 강남구 역삼로 109 1층</address>
        <span class="store-tel">0507-1387-1041</span>
      </div>
      <a href="https://map.kakao.com/link/to/라운즈 강남역점,37.4935506,127.0310534" class="btn-detail-blue" target="_blank">상세보기</a>
    </div>
  `;

  // 3. 커스텀 오버레이 생성 및 지도에 표시
  var customOverlay = new kakao.maps.CustomOverlay({
    position: storePosition,
    content: content,
    yAnchor: 1.2, // 마커 정중앙 살짝 위에 안착하도록 높이 조절
  });

  customOverlay.setMap(map);
});

/* 
     줌 인/아웃 및 레벨 표시 함수. 
     HTML에 id="maplevel"을 가진 엘리먼트가 없다면 displayLevel()에서 
     에러가 날 수 있음.
 */
displayLevel();

function zoomIn() {
  var level = map.getLevel();
  map.setLevel(level - 1);
  displayLevel();
}

function zoomOut() {
  var level = map.getLevel();
  map.setLevel(level + 1);
  displayLevel();
}

function displayLevel() {
  var levelEl = document.getElementById('maplevel');
  if (levelEl) {
    // 엘리먼트가 존재할 때만 실행되도록 안전장치 추가
    levelEl.innerHTML = '현재 지도 레벨은 ' + map.getLevel() + ' 레벨 입니다.';
  }
}

// var mapContainer = document.getElementById('#map'), // 지도를 표시할 div
//   mapOption = {
//     center: new kakao.maps.LatLng(37.4935506, 127.0310534), // 지도의 중심좌표
//     level: 3, // 지도의 확대 레벨
//   };

// var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// // 지도 레벨을 표시합니다
// displayLevel();

// // 지도 레벨은 지도의 확대 수준을 의미합니다
// // 지도 레벨은 1부터 14레벨이 있으며 숫자가 작을수록 지도 확대 수준이 높습니다
// function zoomIn() {
//   // 현재 지도의 레벨을 얻어옵니다
//   var level = map.getLevel();

//   // 지도를 1레벨 내립니다 (지도가 확대됩니다)
//   map.setLevel(level - 1);

//   // 지도 레벨을 표시합니다
//   displayLevel();
// }

// function zoomOut() {
//   // 현재 지도의 레벨을 얻어옵니다
//   var level = map.getLevel();

//   // 지도를 1레벨 올립니다 (지도가 축소됩니다)
//   map.setLevel(level + 1);

//   // 지도 레벨을 표시합니다
//   displayLevel();
// }

// function displayLevel() {
//   var levelEl = document.getElementById('maplevel');
//   levelEl.innerHTML = '현재 지도 레벨은 ' + map.getLevel() + ' 레벨 입니다.';
// }

// // 마커가 표시될 위치입니다
// var markerPosition = new kakao.maps.LatLng(37.4935506, 127.0310534);

// // 마커를 생성합니다
// var marker = new kakao.maps.Marker({
//   position: markerPosition,
// });

// // 마커가 지도 위에 표시되도록 설정합니다
// marker.setMap(map);

// var iwContent =
//     '<div style="padding:5px;">Hello World! <br><a href="https://map.kakao.com/link/map/Hello World!,33.450701,126.570667" style="color:blue" target="_blank">큰지도보기</a> <a href="https://map.kakao.com/link/to/Hello World!,37.4935506,127.0310534" style="color:blue" target="_blank">길찾기</a></div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
//   iwPosition = new kakao.maps.LatLng(33.450701, 126.570667); //인포윈도우 표시 위치입니다

// // 인포윈도우를 생성합니다
// var infowindow = new kakao.maps.InfoWindow({
//   position: iwPosition,
//   content: iwContent,
// });

// // 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
// infowindow.open(map, marker);
