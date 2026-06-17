class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
  <div class="footer_box">
    <div class="footer_cta">
      <h2 class="pre_bold_14">라운즈 플래그십 스토어</h2>
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
          <img src="../images/footer_1.png" alt="">
          <img src="../images/footer_2.png" alt="">
          <img src="../images/footer_3.png" alt="">
          <img src="../images/footer_4.png" alt="">
        </div>
      </div>
      <div class="footer_info">
        <div class="footer_info_item">
          <p class="pre_bold_14">(주)라운즈 ROUNZ 사업자정보</p>
          <p class="material-icons icon_16">arrow_right</p>
        </div>
        <div class="footer_info_item2">
          <p class="pre_reg_12">상호명 : 주식회사 라운즈</p>
          <p class="pre_reg_12">대표 : 김세민, 김명섭</p>
          <p class="pre_reg_12">플래그십 스토어 : <a class="pre_reg_12" href="">서울시 강남구 역삼로 109 1층 (라운즈 강남역점)</a>
          <a class="pre_reg_12" href="">경기도 성남시 분당구 판교역로 192번길 12 1층 (라운즈 판교점)</a></p>
          <p class="pre_reg_12">사업자 주소 : <a class="pre_reg_12" href="">서울특별시 강남구 강남대로94길 34, K&Y빌딩 4층</a></p>
          <p class="pre_reg_12">사업자등록번호 : 119-86-02418</p>
          <p class="pre_reg_12">통신판매업 신고 : 2016-서울강남-03811호</p>
          <p class="pre_reg_12">개인정보관리책임자 : 김명섭</p>
          <p class="pre_reg_12">&copy;ROUNZ</p>
        </div>
      </div>
    </div>
  </div>
</footer>
    `;

    // 클릭 이벤트 리스너 바인딩
    const toggleBtn = this.querySelector('.footer_info_item');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        toggleBtn.classList.toggle('active');
      });
    }
  }
}

customElements.define('custom-footer', CustomFooter);


/*
<link rel="stylesheet" href="../css/footer.css" />

<custom-footer></custom-footer>

<script src="../js/components/footer.js"></script>
*/