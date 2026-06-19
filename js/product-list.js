import headerModule from './components/header.js';
import renderFooter from './components/footer.js';
import renderSidebar from './components/side-bar.js';
import createProductCard from './components/product-card.js';
import { parseNumber } from './components/common.js';
headerModule();
renderFooter();
renderSidebar();

const productList = document.querySelector('.product_list');
const DATA_PATH = `./data/products.json`;
const LIMIT = 12;
let skip = 0;
let isLoading = false;

let products = null;
let filteredData = [];
let brands = [];
let origins = [];
let selectedCategory = [];
let selectedBrands = [];
let selectedOrigin = [];

// Fillters
const filters = document.querySelector('.filters');

// keyword filters
const keywordInputs = filters.querySelectorAll(`.keyword_filters input[name$='category'`);
const available = filters.querySelector(`.keyword_filters input[name$='available'`);
let isAvailable = false;
// Sort
const sortBtn = filters.querySelector('.sort_btn');
const currentSortOption = sortBtn.querySelector('div:last-child');
const sortOptionsWrapper = filters.querySelector('.sort_panel');
const sortOptions = sortOptionsWrapper.querySelectorAll('li');
let selectedSortOption = 'latest';

// Detailed filter
const filterBtn = filters.querySelector('.filter_btn');
const filterModal = document.querySelector('.filter_modal_wrapper');
const filterModalClosebtn = filterModal.querySelector('.close_btn');
const filterBtnsWrapper = filterModal.querySelector('.btns_wrapper');
const filterResetBtn = filterBtnsWrapper.querySelector('.reset_btn');
const filterApplyBtn = filterBtnsWrapper.querySelector('.apply_btn');

const moreBtn = document.querySelector('.more_btn');

await fetchData();
renderProducts(products);

// Data Load
async function fetchData() {
  if (isLoading) return;
  isLoading = true;
  try {
    const res = await fetch(DATA_PATH);
    if (!res.ok) throw new Error(`DATA_PATH:${res.status}`);
    products = await res.json();
    filteredData = products;

    brands = [...new Set(products.map((p) => p.brand))];
    origins = [...new Set(products.map((p) => p.specifications['원산지']))];
  } catch (err) {
    console.log(err);
  } finally {
    isLoading = false;
  }
}
// renderProducts
function renderProducts(data) {
  const productCount = document.querySelector('.product_count');
  productCount.textContent = `${data.length} 개 상품`;
  const count = Math.min(skip + LIMIT, data.length);
  let frag = document.createDocumentFragment();

  for (let i = skip; i < count; i++) {
    let card = createProductCard(data[i]);
    frag.appendChild(card);

    // Swiper Slide
    let swiper = new Swiper(card.querySelector('.image_slider'), {
      slidesPerView: 1,
      spaceBetween: 1,
      loop: true,
      observer: true,
      observeParents: true,
      navigation: {
        nextEl: card.querySelector('.image_next'),
        prevEl: card.querySelector('.image_prev'),
      },
      pagination: {
        el: card.querySelector('.read_only_pagers'),
        clickable: false,
        bulletClass: 'read_only_pager',
        bulletActiveClass: 'read_only_pager_active',
      },
      allowTouchMove: true,
      simulateTouch: true,
      mousewheel: true,
      keyboard: true,
    });
  }

  productList.appendChild(frag);
  skip += LIMIT;
  moreBtn.disabled = count >= data.length;
}
function clearProductList() {
  skip = 0;
  moreBtn.disabled = false;
  productList.innerHTML = ``;
}
function sortData(data, option) {
  let sortedData = [...data];
  switch (option) {
    case 'latest':
      sortedData.sort((a, b) => products.indexOf(a) - products.indexOf(b));
      break;
    case 'popularity':
      sortedData.sort((a, b) => parseNumber(b.likeCount) - parseNumber(a.likeCount));
      break;
    case 'lowest_price':
      sortedData.sort((a, b) => {
        if (a.isSoldOut) return 1;
        if (b.isSoldOut) return -1;
        return parseNumber(a.price) - parseNumber(b.price);
      });
      break;
    case 'highest_price':
      sortedData.sort((a, b) => {
        if (a.isSoldOut) return 1;
        if (b.isSoldOut) return -1;
        return parseNumber(b.price) - parseNumber(a.price);
      });
      break;
    case 'most_reviews':
      sortedData.sort((a, b) => parseNumber(b.reviewCount) - parseNumber(a.reviewCount));
      break;
    default:
      break;
  }
  return sortedData;
}

// Keyword filters
keywordInputs.forEach((input) => {
  input.addEventListener('click', () => {
    input.parentElement.classList.toggle('active');
    const value = input.nextElementSibling.textContent;
    if (input.parentElement.classList.contains('active')) {
      selectedCategory.push(value);
    } else {
      selectedCategory = selectedCategory.filter((e) => e !== value);
    }
    filterData(filteredData);
  });
});

available.addEventListener('click', () => {
  available.parentElement.classList.toggle('active');
  isAvailable = !isAvailable;

  filterData();
});
function filterData() {
  console.log('선택된 카테고리:', selectedCategory);
  console.log('선택된 브랜드:', selectedBrands);
  console.log('선택된 원산지:', selectedOrigin);

  filteredData = [...products];

  // Category filter
  if (selectedCategory && selectedCategory.length > 0) {
    filteredData = filteredData.filter((p) => selectedCategory.includes(p.category));
  }

  // Brand filter
  if (selectedBrands && selectedBrands.length > 0) {
    filteredData = filteredData.filter((p) => selectedBrands.includes(p.brand));
  }

  // Origin filter
  if (selectedOrigin && selectedOrigin.length > 0) {
    filteredData = filteredData.filter((p) => selectedOrigin.includes(p.specifications['원산지']));
  }

  // isAvailable filter (품절 제외)
  if (isAvailable) {
    filteredData = filteredData.filter((p) => !p.isSoldOut);
  }

  // sort
  filteredData = sortData(filteredData, selectedSortOption);

  console.log('최종 필터링된 데이터:', filteredData);

  clearProductList();
  renderProducts(filteredData);
}

// Sort
sortBtn.addEventListener('click', () => {
  sortOptionsWrapper.style.display = 'block';
});
sortOptions.forEach((option) => {
  option.addEventListener('click', () => {
    const label = option.querySelector('label');
    currentSortOption.innerText = label.textContent;

    sortOptions.forEach((o) => {
      o.querySelector('input').checked = false;
    });
    const selectedOption = option.querySelector('input');
    selectedOption.checked = true;
    selectedSortOption = selectedOption.value;
    sortOptionsWrapper.style.display = 'none';

    filterData(filteredData);
    console.log(filteredData);
  });
});

function createDetailFilterOptions() {
  const brandFilter = filterModal
    .querySelector('.filter_type.brand')
    .closest('.filter_set')
    .querySelector('.filter_options_wrapper');

  brands.forEach((b) => {
    const optionElem = document.createElement('div');
    optionElem.className = 'filter_option pre_reg_18 border_round display_inline_block';
    optionElem.textContent = `${b}`;
    brandFilter.appendChild(optionElem);
  });
  const brandFilterOptions = brandFilter.querySelectorAll('.filter_option');
  brandFilterOptions.forEach((brandOption) => {
    brandOption.addEventListener('click', () => {
      brandOption.classList.toggle('active');
      if (brandOption.classList.contains('active')) {
        selectedBrands.push(brandOption.textContent);
      } else {
        selectedBrands = selectedBrands.filter((e) => e !== brandOption.textContent);
      }
    });
  });

  const originFilter = filterModal
    .querySelector('.filter_type.origin')
    .closest('.filter_set')
    .querySelector('.filter_options_wrapper');

  origins.forEach((o) => {
    const optionElem = document.createElement('div');
    optionElem.className = 'filter_option pre_reg_18 border_round display_inline_block';
    optionElem.textContent = `${o}`;
    originFilter.appendChild(optionElem);
  });
  const originFilterOptions = originFilter.querySelectorAll('.filter_option');
  originFilterOptions.forEach((originOption) => {
    originOption.addEventListener('click', () => {
      originOption.classList.toggle('active');
      if (originOption.classList.contains('active')) {
        selectedOrigin.push(originOption.textContent);
      } else {
        selectedOrigin = selectedOrigin.filter((e) => e !== originOption.textContent);
      }
    });
  });
}

let isFilterOptionsCreated = false;
filterBtn.addEventListener('click', () => {
  filterModal.classList.remove('display_none');
  filterModal.classList.add('display_flex');
  !isFilterOptionsCreated && createDetailFilterOptions();
  isFilterOptionsCreated = true;
});

const filterOptions = filterModal.querySelectorAll('.filter_option');
filterOptions.forEach((option) => {
  option.addEventListener('click', () => {
    option.classList.toggle('active');
  });
});

filterModalClosebtn.addEventListener('click', () => {
  filterModal.classList.remove('display_flex');
  filterModal.classList.add('display_none');
});

filterResetBtn.addEventListener('click', () => {
  filterOptions.forEach((option) => {
    option.classList.remove('active');
  });
});
filterApplyBtn.addEventListener('click', () => {
  filterModal.classList.remove('display_flex');
  filterModal.classList.add('display_none');
  filterData();
});

// More Load Products
moreBtn.addEventListener('click', () => {
  renderProducts(filteredData);
});
