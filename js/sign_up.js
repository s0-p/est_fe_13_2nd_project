import renderFooter from './components/footer.js';
renderFooter();

const allCheck = document.getElementById('all_check');
const subChecks = document.querySelectorAll('.sub_check');

const signupBtn = document.querySelector('.login_bt');

const modal = document.getElementById('terms_modal');
const modalTitle = modal.querySelector('h3');
const modalBody = modal.querySelector('.modal_body');
const closeBtn = modal.querySelector('.close_btn');



allCheck.addEventListener('change', () => {
  subChecks.forEach(check => {
    check.checked = allCheck.checked;
  });
});

subChecks.forEach(check => {
  check.addEventListener('change', () => {
    allCheck.checked = [...subChecks].every(item => item.checked);
  });
});

signupBtn.addEventListener('click', () => {
  const name = document.getElementById('name').value.trim();
  const userId = document.getElementById('user_id').value.trim();
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('password_confirm').value;

  // 이름 검사
  if (!name) {
    alert('이름을 입력해주세요.');
    return;
  }

  // 아이디 검사
  if (!userId) {
    alert('아이디를 입력해주세요.');
    return;
  }

  // 비밀번호 검사
  if (!password) {
    alert('비밀번호를 입력해주세요.');
    return;
  }

  // 비밀번호 확인 검사
  if (!passwordConfirm) {
    alert('비밀번호 확인을 입력해주세요.');
    return;
  }

  // 비밀번호 일치 검사
  if (password !== passwordConfirm) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  // 필수 약관 검사
  const requiredChecks = [
    document.getElementById('terms_check'),
    document.getElementById('privacy_check'),
    document.getElementById('age_check')
  ];

  const isValid = requiredChecks.every(check => check.checked);

  if (!isValid) {
    alert('필수 약관에 모두 동의해주세요.');
    return;
  }

  // 회원가입 완료 화면
  const signUp = document.querySelector('.sign_up');

  signUp.innerHTML = `
    <div class="signup_complete">
      <img src="../images/Completion.png" alt="">
      <button
        type="button"
        class="login_bt pre_bold_20"
        onclick="location.href='./sign-in.html'"
      >
       홈으로 이동
      </button>
    </div>
  `;
});


const termsData = {
  terms: {
    title: '이용약관',
    content: `
      <h4>제1조 (목적)</h4>
      <p>
        본 약관은 ROUNZ(이하 "회사")가 제공하는 서비스의 이용과 관련하여
        회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
      </p>

      <h4>제2조 (회원가입)</h4>
      <p>
        회원은 회사가 정한 가입 절차에 따라 회원정보를 기입하고 본 약관에
        동의함으로써 회원가입을 신청할 수 있습니다.
      </p>

      <h4>제3조 (서비스 이용)</h4>
      <p>
        회원은 관련 법령 및 본 약관을 준수하여 서비스를 이용하여야 하며,
        타인의 권리를 침해하거나 서비스 운영을 방해하는 행위를 해서는 안 됩니다.
      </p>

      <h4>제4조 (회원의 의무)</h4>
      <p>
        회원은 자신의 계정 정보를 안전하게 관리해야 하며, 계정의 부정 사용으로
        발생하는 문제에 대해 책임을 질 수 있습니다.
      </p>

      <h4>제5조 (서비스 제공 및 변경)</h4>
      <p>
        회사는 서비스의 품질 향상 및 운영상 필요에 따라 서비스의 일부 또는
        전부를 변경할 수 있습니다.
      </p>

      <h4>제6조 (서비스 이용 제한)</h4>
      <p>
        회사는 회원이 본 약관을 위반하는 경우 사전 통지 없이 서비스 이용을
        제한하거나 회원 자격을 박탈할 수 있습니다.
      </p>

      <h4>제7조 (면책조항)</h4>
      <p>
        회사는 천재지변, 시스템 장애 등 불가항력적인 사유로 인하여 서비스를
        제공할 수 없는 경우 책임을 지지 않습니다.
      </p>
    `
  },

  privacy: {
    title: '개인정보 처리방침',
    content: `
      <h4>1. 수집하는 개인정보 항목</h4>
      <p>
        회사는 회원가입, 서비스 제공 및 고객 상담을 위하여 다음과 같은
        개인정보를 수집할 수 있습니다.
      </p>
      <ul>
        <li>이름</li>
        <li>아이디</li>
        <li>비밀번호</li>
        <li>이메일 주소</li>
        <li>휴대전화 번호</li>
      </ul>

      <h4>2. 개인정보 수집 및 이용 목적</h4>
      <ul>
        <li>회원 식별 및 본인 확인</li>
        <li>서비스 제공 및 운영</li>
        <li>고객 문의 응대</li>
        <li>이벤트 및 프로모션 안내</li>
      </ul>

      <h4>3. 개인정보 보유 및 이용기간</h4>
      <p>
        회원 탈퇴 시까지 개인정보를 보유하며, 관계 법령에 따라 보존이 필요한
        경우 해당 기간 동안 보관합니다.
      </p>

      <h4>4. 개인정보의 제3자 제공</h4>
      <p>
        회사는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다.
        단, 법령에 의한 요청이 있는 경우 예외로 합니다.
      </p>

      <h4>5. 개인정보 보호</h4>
      <p>
        회사는 개인정보 보호를 위해 암호화, 접근 제한 등 합리적인 보안 조치를
        시행하고 있습니다.
      </p>

      <h4>6. 이용자의 권리</h4>
      <p>
        이용자는 언제든지 자신의 개인정보를 조회, 수정, 삭제 요청할 수 있으며,
        회원 탈퇴를 통해 개인정보 처리 동의를 철회할 수 있습니다.
      </p>
    `
  },

  marketing: {
    title: '마케팅 정보 수신 동의',
    content: `
      <h4>마케팅 정보 수신 안내</h4>
      <p>
        회사는 회원에게 다양한 혜택과 이벤트 정보를 제공하기 위하여
        마케팅 정보를 발송할 수 있습니다.
      </p>

      <h4>수신 항목</h4>
      <ul>
        <li>신규 서비스 출시 안내</li>
        <li>할인 쿠폰 및 프로모션</li>
        <li>이벤트 및 경품 행사</li>
        <li>맞춤형 상품 추천</li>
      </ul>

      <h4>수신 방법</h4>
      <ul>
        <li>이메일</li>
        <li>SMS</li>
        <li>앱 푸시 알림</li>
      </ul>

      <h4>동의 거부 권리</h4>
      <p>
        회원은 마케팅 정보 수신에 동의하지 않을 권리가 있으며,
        동의하지 않더라도 서비스 이용에는 제한이 없습니다.
      </p>

      <h4>동의 철회</h4>
      <p>
        회원은 마이페이지 또는 고객센터를 통해 언제든지 마케팅 정보 수신
        동의를 철회할 수 있습니다.
      </p>
    `
  }
};

document.querySelectorAll('.view_btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.type;

    modalTitle.textContent = termsData[type].title;
    modalBody.innerHTML = termsData[type].content;

    modal.classList.add('active');
  });
});

closeBtn.addEventListener('click', () => {
  modal.classList.remove('active');
});

modal.addEventListener('click', e => {
  if (e.target === modal) {
    modal.classList.remove('active');
  }
});
