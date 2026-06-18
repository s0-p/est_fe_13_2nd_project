function renderHeader() {
  createHeader();
  window.addEventListener('resize', createHeader);
}
function createHeader() {
  const oldHeader = document.querySelector('header');
  oldHeader?.remove();
  const oldNav = document.querySelector('nav');
  oldNav?.remove();

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
  document.body.prepend(newHeader);

  createNav();
}
function createNav() {
  const header = document.querySelector('header');

  const newNav = document.createElement('nav');
  newNav.className = 'glassmorphism display_none';
  newNav.innerHTML = `
    <div class="container display_flex justify_content_center">
      <div class="menu_wrapper display_flex flex_column">
        <ul class="navs display_flex flex_column">
          <li class="display_flex align_items_center">
            <div class="circle border_round"></div>
            <input type="radio" id="sunglass" name="menu" value="sunglass" checked />
            <label for="sunglass" class="pre_reg_14 active">선글라스</label>
          </li>
          <li class="display_flex align_items_center">
            <div class="circle border_round display_none"></div>
            <input type="radio" id="galsses_frame" name="menu" value="galsses_frame" />
            <label for="galsses_frame" class="pre_reg_14">안경테</label>
          </li>
          <li class="display_flex align_items_center">
            <div class="circle border_round display_none"></div>
            <input type="radio" id="best" name="menu" value="best" />
            <label for="best" class="mont_reg_14">BEST</label>
          </li>
          <li class="display_flex align_items_center">
            <div class="circle border_round display_none"></div>
            <input type="radio" id="brand" name="menu" value="brand" />
            <label for="brand" class="mont_reg_14">브랜드</label>
          </li>
          <li class="display_flex align_items_center">
            <div class="circle border_round display_none"></div>
            <input type="radio" id="rounz_only" name="menu" value="rounz_only" />
            <label for="rounz_only" class="pre_reg_14">라운즈 <span class="mont_reg_14">Only</span></label>
          </li>
        </ul>
        <div class="links display_flex flex_column">
          <a href="/sub/map.html" class="pre_reg_14 gradient_text display_flex align_items_center">안경원<span class="material-icons icon_16">arrow_forward</span></a>
          <a href="" class="pre_reg_14 gradient_text display_flex align_items_center">신상품<span class="material-icons icon_16">arrow_forward</span></a>
          <a href="" class="pre_reg_14 gradient_text display_flex align_items_center">기획전<span class="material-icons icon_16">arrow_forward</span></a>
          <a href="" class="pre_reg_14 gradient_text display_flex align_items_center">시리즈<span class="material-icons icon_16">arrow_forward</span></a>
          <a href="" class="pre_reg_14 gradient_text display_flex align_items_center">라운즈 소개<span class="material-icons icon_16">arrow_forward</span></a>
          <a href="" class="pre_reg_14 gradient_text display_flex align_items_center">고객센터<span class="material-icons icon_16">arrow_forward</span></a>
        </div>
      </div>
      <div class="tab display_flex flex_column">
        <div class="categories_wrapper display_flex justify_content_between">
          <div class="categories display_flex col_gutter_gap">
            <div class="pre_reg_14">
              모양
              <div></div>
            </div>
            <div class="pre_reg_14">브랜드</div>
          </div>
          <a href="/sub/product-list.html" class="pre_reg_14">전체보기</a>
        </div>
        <div class="type_wrapper display_grid justify_content_between">
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
      const lines = hamberger.querySelectorAll('div');
      lines.forEach((line) => {
        line.classList.toggle('active');
      });
    });
  } else {
  }

  const currentNav = document.querySelector('nav');
  const navs = currentNav.querySelectorAll('.menu_wrapper .navs li input');
  navs.forEach((nav) => {
    nav.addEventListener('click', () => {
      navs.forEach((nav) => {
        if (nav.nextElementSibling.classList.contains('active')) {
          const circle = nav.previousElementSibling;
          circle.classList.toggle('display_none');
          const label = nav.nextElementSibling;
          label.classList.toggle('active');
        }
      });
      const circle = nav.previousElementSibling;
      circle.classList.toggle('display_none');
      const label = nav.nextElementSibling;
      label.classList.toggle('active');
    });
  });
}
export default renderHeader;
