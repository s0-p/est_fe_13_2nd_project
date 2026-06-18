import headerModule from './components/header.js';
import createProductCard from './components/product-card.js';
import { parseNumber } from './components/common.js';
headerModule();

const productList = document.querySelector('.product_list');
const DATA_PATH = `../data/products.json`;
const LIMIT = 12;
let skip = 0;
let isLoading = false;

let products = null;
let filteredData = [];
let brands = [];
let origins = [];
let selectedCategory = [];

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
let seletedSortOption = 'latest';

// Detailed filter
const filterBtn = filters.querySelector('.filter_btn');
const filterModal = document.querySelector('.filter_modal_wrapper');
const filterOptions = filterModal.querySelectorAll('.filter_option');
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
      sortedData = data;
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
function renderSkeleton(count = LIMIT) {
  for (let i = 0; i < count; i++) {
    const skeletonCard = document.createElement('article');
    skeletonCard.className = 'skeleton_card display_flex flex_column';
    skeletonCard.innerHTML = `
      <div class="media skeleton"></div>
      <div class="content display_flex flex_column">
        <div class="skeleton line" style="width: 40%"></div>
        <div class="skeleton line" style="width: 55%"></div>
        <div class="skeleton line" style="width: 70%"></div>
      </div>
    `;
    productList.appendChild(skeletonCard);
  }
}
function clearSkeleton() {
  const skeletonCardList = productList.querySelectorAll('.skeleton_card');
  skeletonCardList.forEach((card) => {
    card.remove();
  });
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
  console.log(selectedCategory);
  let filteredResult = [...products.filter((p) => selectedCategory.includes(p.category))];
  filteredData = filteredResult.length ? filteredResult : products;
  console.log(filteredData);
  if (isAvailable) {
    filteredResult = [...filteredData.filter((p) => !p.isSoldOut)];
    filteredData = filteredResult.length ? filteredResult : products;
  }

  filteredData = sortData(filteredData, seletedSortOption);

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
    seletedSortOption = selectedOption.value;
    sortOptionsWrapper.style.display = 'none';

    filterData(filteredData);
    console.log(filteredData);
  });
});

filterBtn.addEventListener('click', () => {
  filterModal.classList.remove('display_none');
  filterModal.classList.add('display_flex');
});

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
});

// More Load Products
moreBtn.addEventListener('click', () => {
  renderProducts(filteredData);
});
