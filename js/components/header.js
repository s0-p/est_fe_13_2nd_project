function renderHeader() {
  createHeader();
  window.addEventListener('resize', createHeader);
}
function createHeader() {
  const header = document.createElement('header');
  header.className = 'header_default display_flex justify_content_space_between align_items_center';
  let screenWidth = window.innerWidth;
  if (screenWidth < 1280) {
    header.innerHTML = `
      <div class="display_flex align_items_center">
        <div class="hamberger display_flex flex_column">
          <div class="top_line"></div>
          <div class="bottom_line"></div>
        </div>
        <a class="material-icons icon_24">search</a>
      </div>
      <a href="/index.html"><h1>ROUNZ</h1></a>
      <div class="display_flex align_items_center">
        <a href="/sub/sign-in.html" class="material-icons icon_24">person</a>
        <a href="/sub/cart.html" class="material-icons icon_24">local_mall</a>
      </div>
    `;
  } else {
    header.innerHTML = `
      <div class="nav_wrapper display_flex">
        <div class="pre_reg_16">선글라스</div>
        <div class="pre_reg_16">안경테</div>
        <div class="mont_reg_16">BEST</div>
        <div class="pre_reg_16">브랜드</div>
        <div class="pre_reg_16">라운즈 <span class="mont_reg_16">Only</span></div>
        <div class="pre_reg_16">더 알아보기</div>
      </div>
      <a href="/index.html"><h1>ROUNZ</h1></a>
      <div class="display_flex align_items_center">
        <div class="display_flex align_items_center">
          <div class="pre_reg_16">검색어</div>
          <a class="material-icons icon_24">search</a>
        </div>
        <a href="/sub/sign-in.html" class="material-icons icon_24">person</a>
        <a href="/sub/cart.html" class="material-icons icon_24">local_mall</a>
      </div>
      `;
  }
  document.querySelector('header')?.remove();
  document.body.prepend(header);
}
export default renderHeader;
