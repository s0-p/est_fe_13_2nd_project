function renderHeader() {
  createHeader();
  window.addEventListener('resize', createHeader);
}
function createHeader() {
  const header = document.querySelector('header');

  const newHeader = document.createElement('header');
  newHeader.className = 'header_default display_flex justify_content_between align_items_center';
  const screenWidth = window.innerWidth;
  if (screenWidth < 1280) {
    newHeader.innerHTML = `
      <div class="display_flex align_items_center col_gutter_gap">
        <button class="hamberger display_flex flex_column">
          <div class="top_line"></div>
          <div class="bottom_line"></div>
        </button>
        <button class="material-icons icon_24">search</button>
      </div>
      <a href="/index.html"><h1>ROUNZ</h1></a>
      <div class="display_flex align_items_center col_gutter_gap">
        <a href="/sub/sign-in.html" class="material-icons icon_24">person</a>
        <a href="/sub/cart.html" class="material-icons icon_24">local_mall</a>
      </div>
    `;
  } else {
    newHeader.innerHTML = `
      <div class="nav_wrapper display_flex col_gutter_gap">
        <div class="pre_reg_16">선글라스</div>
        <div class="pre_reg_16">안경테</div>
        <div class="mont_reg_16">BEST</div>
        <div class="pre_reg_16">브랜드</div>
        <div class="pre_reg_16">라운즈 <span class="mont_reg_16">Only</span></div>
        <div class="pre_reg_16">더 알아보기</div>
      </div>
      <a href="/index.html"><h1>ROUNZ</h1></a>
      <div class="display_flex align_items_center col_gutter_gap">
        <div class="display_flex align_items_center">
          <div class="pre_reg_16">검색어</div>
          <a class="material-icons icon_24">search</a>
        </div>
        <a href="/sub/sign-in.html" class="material-icons icon_24">person</a>
        <a href="/sub/cart.html" class="material-icons icon_24">local_mall</a>
      </div>
      `;
  }
  header?.remove();
  document.body.prepend(newHeader);

  createNav();
}
function createNav() {
  const header = document.querySelector('header');
  const nav = document.querySelector('nav');
  nav?.remove();

  const newNav = document.createElement('nav');
  newNav.className = 'glassmorphism display_none';
  newNav.innerHTML = `
    <div class="container display_flex justify_content_center">
      <div class="menu_wrapper display_flex flex_column">
        <div class="navs display_flex flex_column">
          <div class="pre_reg_14">선글라스</div>
          <div class="pre_reg_14">안경테</div>
          <div class="pre_reg_14">BEST</div>
          <div class="pre_reg_14">브랜드</div>
          <div class="pre_reg_14">라운즈 <span class="mont_reg_14">Only</span></div>
        </div>
        <div class="links display_flex flex_column">
          <div class="pre_reg_14 gradient_text">안경원<span class="material-icons icon_16">arrow_forward</span></div>
          <div class="pre_reg_14 gradient_text">안경원<span class="material-icons icon_16">arrow_forward</span></div>
          <div class="pre_reg_14 gradient_text">안경원<span class="material-icons icon_16">arrow_forward</span></div>
          <div class="pre_reg_14 gradient_text">안경원<span class="material-icons icon_16">arrow_forward</span></div>
          <div class="pre_reg_14 gradient_text">안경원<span class="material-icons icon_16">arrow_forward</span></div>
          <div class="pre_reg_14 gradient_text">안경원<span class="material-icons icon_16">arrow_forward</span></div>
        </div>
      </div>
      <div class="tab display_flex flex_column">
        <div class="categories_wrapper display_flex justify_content_between">
          <div class="categories display_flex col_gutter_gap">
            <div class="pre_reg_14">모양</div>
            <div class="pre_reg_14">브랜드</div>
          </div>
          <a href="/sub/product-list.html" class="pre_reg_14">전체보기</a>
        </div>
        <div class="type_wrapper display_grid">
          <div class="type_round display_flex flex_column align_items_center">
            <div class="type_image border_round"></div>
            <div class="type_text pre_reg_12">유형</div>
          </div>
          <div class="type_round display_flex flex_column align_items_center">
            <div class="type_image border_round"></div>
            <div class="type_text pre_reg_12">유형</div>
          </div>
          <div class="type_round display_flex flex_column align_items_center">
            <div class="type_image border_round"></div>
            <div class="type_text pre_reg_12">유형</div>
          </div>
          <div class="type_round display_flex flex_column align_items_center">
            <div class="type_image border_round"></div>
            <div class="type_text pre_reg_12">유형</div>
          </div>
        </div>
      </div>
    </div>
  `;
  header.after(newNav);

  const screenWidth = window.innerWidth;
  if (screenWidth < 1280) {
    const hamberger = document.querySelector('header .hamberger');
    hamberger.addEventListener('click', () => {
      newNav.classList.toggle('display_none');
    });
  } else {
  }
}
export default renderHeader;
