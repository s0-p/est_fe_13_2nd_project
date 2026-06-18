import { getBasePath } from './common.js';

function renderFooter() {
  createFooter();
  // 화면 크기가 변할 때마다 푸터를 다시 그리도록 바인딩 (필요 시 반응형 분기 확장 가능)
  window.addEventListener('resize', createFooter);
}

function createFooter() {
  const base = getBasePath();

  // 기존에 생성되어 있던 푸터 엘리먼트 제거 (중복 생성 및 이벤트 중첩 방지)
  const oldFooter = document.querySelector('footer');
  oldFooter?.remove();

  // 1. 새 푸터 태그 생성
  const newFooter = document.createElement('footer');

  // 2. HTML 구조 주입
  newFooter.innerHTML = `
    <div class="footer_box">
      <div class="footer_cta">
        <a href="${base}sub/map.html" class="pre_reg_14">라운즈 플래그십 스토어</a>
      </div>
      <div class="footer_content">
        <div class="footer_menu_container">
          <div class="footer_menu">
            <div class="footer_menu_item">
              <p class="pre_reg_12">고객센터</p>
              <p class="pre_bold_14">개인정보처리방침</p>
              <p class="pre_reg_12">이용약관</p>
            </div>
            <div class="footer_menu_item">
              <p class="pre_reg_12">라운즈맵</p>
              <p class="pre_reg_12">라운즈 해외</p>
              <p class="pre_reg_12">라운즈 파트너스</p>
              <p class="pre_reg_12">글라스 박스</p>
              <p class="pre_reg_12">가맹문의</p>
            </div>
            <p class="pre_reg_12">사업자 정보 확인</p>
          </div>
          <div class="footer_sns">
            <img src="${base}images/footer_1.png" alt="">
            <img src="${base}images/footer_2.png" alt="">
            <img src="${base}images/footer_3.png" alt="">
            <img src="${base}images/footer_4.png" alt="">
          </div>
        </div>
        <div class="footer_info">
          <div class="footer_info_item" style="cursor: pointer;">
            <p class="pre_bold_14">(주)라운즈 ROUNZ 사업자정보</p>
            <p class="material-icons icon_16">arrow_right</p>
          </div>
          <div class="footer_info_item2">
            <p class="pre_reg_12">상호명 : 주식회사 라운즈</p>
            <p class="pre_reg_12">대표 : 김세민, 김명섭</p>
            <p class="pre_reg_12">플래그십 스토어 : 
              <a class="pre_reg_12" href="https://m.map.naver.com/search?query=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C%20%EA%B0%95%EB%82%A8%EA%B5%AC%20%EC%97%AD%EC%82%BC%EB%8F%99%20831-45&sm=hty&style=v5">서울시 강남구 역삼로 109 1층 (라운즈 강남역점)</a>
              <a class="pre_reg_12" href="https://m.map.naver.com/search?query=%EA%B2%BD%EA%B8%B0%EB%8F%84%20%EC%84%B1%EB%82%A8%EC%8B%9C%20%EB%B6%84%EB%8B%B9%EA%B5%AC%20%ED%8C%90%EA%B5%90%EC%97%AD%EB%A1%9C%20192%EB%B2%88%EA%B8%B8%2012%201%EC%B8%B5&sm=hty&style=v5">경기도 성남시 분당구 판교역로 192번길 12 1층 (라운즈 판교점)</a>
            </p>
            <p class="pre_reg_12">사업자 주소 : <a class="pre_reg_12" href="https://m.map.naver.com/search?query=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C%20%EA%B0%95%EB%82%A8%EA%B5%AC%20%EA%B0%95%EB%82%A8%EB%8C%80%EB%A1%9C94%EA%B8%B8%2034%2C%20K%26Y%EB%B9%8C%EB%94%A9%204%EC%B8%B5&sm=hty&style=v5">서울특별시 강남구 강남대로94길 34, K&Y빌딩 4층</a></p>
            <p class="pre_reg_12">사업자등록번호 : 119-86-02418</p>
            <p class="pre_reg_12">통신판매업 신고 : 2016-서울강남-03811호</p>
            <p class="pre_reg_12">개인정보관리책임자 : 김명섭</p>
            <p class="pre_reg_12">&copy;ROUNZ</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // 3. body 최하단에 생성된 푸터 주입
  document.body.appendChild(newFooter);

  // 4. 컴포넌트 내부 기능 바인딩 (사업자 정보 토글)
  bindFooterEvents(newFooter);
}

// 이벤트 핸들러 바인딩 함수
function bindFooterEvents(container) {
  const toggleBtn = container.querySelector('.footer_info_item');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      toggleBtn.classList.toggle('active');
    });
  }
}

export default renderFooter;
