document.addEventListener('DOMContentLoaded', function () {
  // 1. 지도를 표시할 div (샵 '#' 제거 완료)
  var mapContainer = document.getElementById('map');

  // 라운즈 강남역점 좌표 (37.4935506, 127.0310534)
  var storePosition = new kakao.maps.LatLng(37.4935506, 127.0310534);

  var mapOption = {
    center: storePosition, // 지도의 중심좌표를 라운즈로 설정
    level: 3, // 지도의 확대 레벨
  };

  // 지도를 생성합니다
  var map = new kakao.maps.Map(mapContainer, mapOption);

  // 마커를 생성하고 지도 위에 표시합니다
  var marker = new kakao.maps.Marker({
    position: storePosition,
  });
  marker.setMap(map);

  // 2. 인포윈도우(말풍선) 콘텐츠를 라운즈 디자인/정보에 맞게 수정
  // 카카오맵 길찾기 링크에도 라운즈 좌표를 정확히 주입했습니다.
  var iwContent = `
    <div class="map-overlay-card" style="padding:10px; min-width:200px;">
      <strong style="display:block; font-size:14px; margin-bottom:4px;">라운즈 강남역점</strong>
      <span style="display:block; font-size:12px; color:#666; margin-bottom:8px;">서울 강남구 역삼로 109 1층</span>
      <div style="font-size:12px;">
        <a href="https://map.kakao.com/link/map/라운즈 강남역점,37.4935506,127.0310534" style="color:blue; margin-right:8px;" target="_blank">큰지도보기</a>
        <a href="https://map.kakao.com/link/to/라운즈 강남역점,37.4935506,127.0310534" style="color:blue;" target="_blank">길찾기</a>
      </div>
    </div>
  `;

  // 인포윈도우를 생성합니다 (위치는 마커와 동일하게 storePosition 설정)
  var infowindow = new kakao.maps.InfoWindow({
    position: storePosition,
    content: iwContent,
  });

  // 마커 위에 인포윈도우를 표시합니다
  infowindow.open(map, marker);

  /* =================================================================
     아래는 줌 인/아웃 및 레벨 표시 함수입니다. 
     HTML에 id="maplevel"을 가진 엘리먼트가 없다면 displayLevel()에서 
     에러가 날 수 있으니, 필요 없다면 이 아랫부분은 지우셔도 됩니다.
  ==================================================================== */
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
});
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
