// Fillters
const filters = document.querySelector('.filters');

// keyword filters
const keywordFilters = filters.querySelectorAll('.keyword');
keywordFilters.forEach((keyword) => {
  keyword.addEventListener('click', () => {
    keyword.classList.toggle('active');
  });
});

// Sort
const sortBtn = filters.querySelector('.sort_btn');
const currentSortOption = sortBtn.querySelector('div:last-child');
const sortOptionsWrapper = filters.querySelector('.sort_panel');
const sortOptions = sortOptionsWrapper.querySelectorAll('li');

sortBtn.addEventListener('click', () => {
  sortOptionsWrapper.style.display = 'block';
});
sortOptions.forEach((option) => {
  option.addEventListener('click', () => {
    const label = option.querySelector('label');
    currentSortOption.innerText = label.textContent;

    const input = option.querySelector('input');
    input.setAttribute('checked', true);

    sortOptionsWrapper.style.display = 'none';
  });
});
// Detailed filter
const filterBtn = filters.querySelector('.filter_btn');
const filterModal = document.querySelector('.filter_modal_wrapper');
filterBtn.addEventListener('click', () => {
  filterModal.classList.remove('display_none');
  filterModal.classList.add('display_flex');
});

const filterOptions = filterModal.querySelectorAll('.filter_option');
filterOptions.forEach((option) => {
  option.addEventListener('click', () => {
    option.classList.toggle('active');
  });
});

const filterModalClosebtn = filterModal.querySelector('.close_btn');
filterModalClosebtn.addEventListener('click', () => {
  filterModal.classList.remove('display_flex');
  filterModal.classList.add('display_none');
});

const filterBtnsWrapper = filterModal.querySelector('.btns_wrapper');
const filterResetBtn = filterBtnsWrapper.querySelector('.reset_btn');
filterResetBtn.addEventListener('click', () => {
  filterOptions.forEach((option) => {
    option.classList.remove('active');
  });
});
const filterApplyBtn = filterBtnsWrapper.querySelector('.apply_btn');
filterApplyBtn.addEventListener('click', () => {
  filterModal.classList.remove('display_flex');
  filterModal.classList.add('display_none');
});
