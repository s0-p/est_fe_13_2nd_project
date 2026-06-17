document.addEventListener("DOMContentLoaded", () => {

  const menuData = [
    {
      icon: "../images/img_try_store 1.png",
      text: "라운즈 플래그십 스토어",
      link: "#"
    },
    {
      icon: "../images/icon_try 2.png",
      text: "내 주변 안경원 찾기",
      link: "#"
    },
    {
      icon: "../images/icon_try 1.png",
      text: "채팅 바로가기",
      link: "#"
    }
  ];

  const container = document.getElementById("floating_sidebar");

  container.innerHTML = `
    <div class="side_bar">

      <button class="top_btn">
        <img src="../images/icon_info_arrow 1.png" alt="">
      </button>

      ${menuData.map(item => `
        <div class="menu_item">

          <button type="button" class="icon">
            <img src="${item.icon}" alt="">
          </button>

          <a href="${item.link}" class="text pre_bold_14">
            ${item.text}
          </a>

        </div>
      `).join("")}

    </div>
  `;

  const sidebar = container.querySelector(".side_bar");
  const topBtn = container.querySelector(".top_btn");
  const menuItems = container.querySelectorAll(".menu_item");
  const icons = container.querySelectorAll(".icon");

  // 맨 위 이동
  topBtn.addEventListener("click", () => {

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  });

  // 메뉴 열기 / 닫기
  icons.forEach((icon, index) => {

    icon.addEventListener("click", () => {

      const currentMenu = menuItems[index];

      if(currentMenu.classList.contains("active")){

        currentMenu.classList.remove("active");
        return;

      }

      menuItems.forEach(item => {
        item.classList.remove("active");
      });

      currentMenu.classList.add("active");

    });

  });

  // 스크롤 방향 감지
  let lastScroll = window.scrollY;

  window.addEventListener("scroll", () => {

    const currentScroll = window.scrollY;

    if(currentScroll > lastScroll){

      sidebar.classList.add("hide");
    }else{

      sidebar.classList.remove("hide");
    }

    lastScroll = currentScroll;

  });

});


/*
<link rel="stylesheet" href="../css/side-bar-test.css" />

<div id="floating_sidebar"></div>

<script type="module" src="../js/components/side-bar-test.js"></script>
*/