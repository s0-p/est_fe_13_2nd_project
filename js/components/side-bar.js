function renderSidebar() {
  createSidebar();
  // 화면 크기가 변할 때마다 사이드바 구조를 다시 그리도록 바인딩
  window.addEventListener('resize', createSidebar);
}

function createSidebar() {
  // 기존에 있던 사이드바 그릇 제거 (중복 생성 및 이벤트 중첩 방지)
  const oldSidebar = document.getElementById('floating_sidebar');
  oldSidebar?.remove();

  // 1. 데이터 정의
  const menuData = [
    {
      icon: './images/side_bar_2.png',
      text: '라운즈 플래그십 스토어',
      link: '#',
    },
    {
      icon: './images/side_bar_3.png',
      text: '내 주변 안경원 찾기',
      link: './map.html',
    },
    {
      icon: './images/side_bar_4.png',
      text: '채팅 바로가기',
      link: '#',
    },
  ];

  // 2. 새 사이드바 컨테이너 생성
  const newSidebar = document.createElement('div');
  newSidebar.id = 'floating_sidebar';

  const screenWidth = window.innerWidth;

  // 3. 스크린 크기에 따라 클래스명만 분기 (CSS 스타일링 제어용)
  if (screenWidth < 1280) {
    newSidebar.innerHTML = `
      <div class="side_bar mobile_version">
        <button class="top_btn" aria-label="위로 가기">
          <img src="./images/side_bar_1.png" alt="위로 가기">
        </button>

        ${menuData
          .map(
            (item) => `
          <div class="menu_item">
            <button type="button" class="icon" aria-label="${item.text}">
              <img src="${item.icon}" alt="">
            </button>
            <a href="${item.link}" class="text pre_bold_14">
              ${item.text}
            </a>
          </div>
        `,
          )
          .join('')}
      </div>
    `;
  } else {
    newSidebar.innerHTML = `
      <div class="side_bar pc_version">
        <button class="top_btn" aria-label="위로 가기">
          <img src="./images/side_bar_1.png" alt="위로 가기">
        </button>

        ${menuData
          .map(
            (item) => `
          <div class="menu_item">
            <button type="button" class="icon" aria-label="${item.text}">
              <img src="${item.icon}" alt="">
            </button>
            <a href="${item.link}" class="text pre_bold_14">
              ${item.text}
            </a>
          </div>
        `,
          )
          .join('')}
      </div>
    `;
  }

  // 4. body 최하단에 생성된 사이드바 주입
  document.body.appendChild(newSidebar);

  // 5. 컴포넌트 내부 기능 바인딩 (이제 모든 화면 크기에서 작동합니다)
  bindSidebarEvents(newSidebar);
}

// 이벤트 핸들러 통합 함수
function bindSidebarEvents(container) {
  const sidebar = container.querySelector('.side_bar');
  const topBtn = container.querySelector('.top_btn');
  const menuItems = container.querySelectorAll('.menu_item');
  const icons = container.querySelectorAll('.icon');

  // [공통기능] 맨 위로 부드럽게 스크롤 이동
  topBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  // [모든 사이즈 적용] 메뉴 열기 / 닫기 아코디언 토글
  icons.forEach((icon, index) => {
    icon.addEventListener('click', () => {
      const currentMenu = menuItems[index];

      // 이미 열려있다면 닫기
      if (currentMenu.classList.contains('active')) {
        currentMenu.classList.remove('active');
        return;
      }

      // 다른 열려있는 메뉴들은 닫아주기 (싱글 아코디언 모드)
      menuItems.forEach((item) => {
        item.classList.remove('active');
      });

      // 현재 선택한 메뉴 활성화
      currentMenu.classList.add('active');
    });
  });

  // [모든 사이즈 적용] 스크롤 방향 감지 (내리면 숨기고 올리면 보여주기)
  let lastScroll = window.scrollY;

  window.addEventListener('scroll', () => {
    // 리사이즈로 인해 엘리먼트가 다시 그려져 소멸한 경우 에러 방지 처리
    if (!document.body.contains(sidebar)) return;

    const currentScroll = window.scrollY;

    // 스크롤 방향 감지 후 클래스 제어
    if (currentScroll > lastScroll) {
      sidebar.classList.add('hide');
    } else {
      sidebar.classList.remove('hide');
    }

    lastScroll = currentScroll;
  });
}

export default renderSidebar;
