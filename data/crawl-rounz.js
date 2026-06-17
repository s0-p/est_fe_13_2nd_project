const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// ==========================================
// 크롤러 설정 (환경에 맞게 조정 가능)
// ==========================================
const BASE_URL = 'https://rounz.com';
const LIMIT_PAGES = 10; // 테스트용: 각 카테고리별 수집할 페이지 수 (전체 수집하려면 null로 설정)
const LIMIT_DETAILS = 200; // 테스트용: 수집할 상세 페이지 개수 (전체 수집하려면 null로 설정)
const CONCURRENCY = 5; // 동시 요청 수 (차단 방지)
const DELAY_MS = 800; // 요청 간의 딜레이 시간 (밀리초)

// 딜레이 헬퍼 함수
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 동시성 처리를 위한 배치(Batch) 요청 함수
async function runBatches(tasks, concurrency, batchProcessor) {
  const results = [];
  for (let i = 0; i < tasks.length; i += concurrency) {
    const batch = tasks.slice(i, i + concurrency);
    console.log(`[Batch] ${i + 1} ~ ${Math.min(i + concurrency, tasks.length)} / 전체 ${tasks.length} 진행 중...`);
    const batchResults = await Promise.all(batch.map(batchProcessor));
    results.push(...batchResults);
    if (i + concurrency < tasks.length) {
      await delay(DELAY_MS);
    }
  }
  return results;
}

// 이미지 다운로드 유틸리티 함수
async function downloadFile(url, filename) {
  try {
    // 상대경로일 경우 절대경로로 변환
    let targetUrl = url;
    if (targetUrl.startsWith('./')) {
      targetUrl = `${BASE_URL}${targetUrl.substring(1)}`;
    } else if (targetUrl.startsWith('/')) {
      targetUrl = `${BASE_URL}${targetUrl}`;
    }

    const response = await axios({
      method: 'get',
      url: targetUrl,
      responseType: 'stream',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    const writer = fs.createWriteStream(path.join(__dirname, filename));
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`[다운로드 실패] ${url} -> ${filename}:`, error.message);
  }
}

// 1. 메인 페이지 크롤링 (https://rounz.com/home.php?categoryIndex=1001)
async function crawlMain() {
  console.log('\n[1/6] 메인 페이지 수집 시작...');
  try {
    const response = await axios.get(`${BASE_URL}/home.php?categoryIndex=1001`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    const $ = cheerio.load(response.data);
    const mainData = {
      banners: [],
      menus: [],
      timeSale: [],
      promotions: [],
    };

    // 1-1. 메인 배너 슬라이드
    $('.main_slide ul a').each((i, elem) => {
      const href = $(elem).attr('href');
      const imageUrl = $(elem).find('.thumb img').attr('src');
      const text = $(elem).find('.txt p').text().replace(/\s+/g, ' ').trim();
      mainData.banners.push({ href, imageUrl, text });
    });

    // 1-4. 제니 컬렉션 등 프로모션 섹션
    const elem = $('.template.type_preview');
    $('.template.type_preview').each((i, elem) => {
      const promoTitle = $(elem).find('.title_wrap h2').text().trim();
      const promoSubtitle = $(elem).find('p').first().text().trim();
      const promoLink = $(elem).find('.btn_more').attr('href');
      const mainImage = $(elem).find('.btn_more img').attr('src') || $(elem).find('.btn_more video').attr('poster');

      const previewProducts = [];
      $(elem)
        .find('ul.list li')
        .each((j, item) => {
          const href = $(item).find('a').attr('href');
          const productIndex = href ? href.split('productIndex=')[1] : null;
          const thumbnail = $(item).find('.thumb img').attr('src') || $(item).find('.thumb img').attr('data-src');
          const brand = $(item).find('dl dt').text().trim();
          const title = $(item).find('dl .title').text().trim();
          const price = $(item).find('dl .discount_price strong').text().trim();
          const discountRate = $(item).find('dl .discount_rate i').text().trim();

          previewProducts.push({ productIndex, brand, title, price, discountRate, href, thumbnail });
        });

      mainData.promotions.push({
        title: promoTitle,
        subtitle: promoSubtitle,
        mainImage,
        promoLink,
        products: previewProducts,
      });
    });

    fs.writeFileSync(path.join(__dirname, 'main_page_sunglasses.json'), JSON.stringify(mainData, null, 2), 'utf-8');
    console.log('[성공] 메인 페이지 데이터 저장 완료: main_page_sunglasses.json');
    return mainData;
  } catch (error) {
    console.error('[오류] 메인 페이지 수집 중 에러 발생:', error.message);
    return null;
  }
}

// 3. 기획전 페이지 4059 크롤링 (https://rounz.com/collection.php?collectionIndex=4059)
// 슬라이드 섹션 + 셀럽들이 선택한 #아이웨어 섹션
async function crawlCollection4059() {
  console.log('\n[3/6] 기획전 4059 (셀럽 픽 아이웨어) 페이지 수집 시작...');
  try {
    const response = await axios.get(`${BASE_URL}/collection.php?collectionIndex=4059`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    const $ = cheerio.load(response.data);
    const collectionData = {
      slides: [],
      celebPicks: [],
    };

    // 슬라이드 섹션 - swiper 복제본 중복 제거를 위해 Set 사용
    const seenSlideUrls = new Set();
    $('[class*="slide"] img, .swiper-slide img, .visual_slide img').each((i, img) => {
      const src =
        $(img).attr('src') ||
        $(img).attr('data-src') ||
        $(img).attr('data-lazy-src') ||
        $(img).attr('data-original') ||
        '';

      if (!src || seenSlideUrls.has(src) || !src.includes('image.rounz.com')) return;
      seenSlideUrls.add(src);

      const link = $(img).closest('a');
      collectionData.slides.push({
        image: src.startsWith('http') ? src : `${BASE_URL}${src}`,
        alt: $(img).attr('alt') || null,
        href: link.length ? link.attr('href') || null : null,
      });
    });

    // 셀럽들이 선택한 #아이웨어 섹션 - 상품 이미지 경로 기준으로 카드 파싱
    $('img[src*="_data/product"]').each((i, img) => {
      const src = $(img).attr('src') || $(img).attr('data-src') || '';
      if (!src) return;

      const card = $(img).closest('li').length ? $(img).closest('li') : $(img).closest('div');

      const texts = [];
      card
        .find('*')
        .addBack()
        .contents()
        .filter(function () {
          return this.nodeType === 3;
        })
        .each(function () {
          const t = $(this).text().trim();
          if (t) texts.push(t);
        });

      const celebRaw = texts.find((t) => t.startsWith('#'));
      const ci = texts.indexOf(celebRaw);
      const brand = ci >= 0 && texts[ci + 1] ? texts[ci + 1] : null;
      const productName = ci >= 0 && texts[ci + 2] ? texts[ci + 2] : null;

      const link = $(img).closest('a');
      collectionData.celebPicks.push({
        celeb: celebRaw ? celebRaw.replace('#', '').trim() : null,
        brand,
        productName,
        image: src.startsWith('http') ? src : `${BASE_URL}${src}`,
        href: link.length ? link.attr('href') || null : null,
      });
    });

    fs.writeFileSync(path.join(__dirname, 'celeb.json'), JSON.stringify(collectionData, null, 2), 'utf-8');
    console.log(
      `[성공] 기획전 4059 데이터 저장 완료: celeb.json` +
        ` (슬라이드 ${collectionData.slides.length}개 / 셀럽픽 ${collectionData.celebPicks.length}개)`,
    );
    return collectionData;
  } catch (error) {
    console.error('[오류] 기획전 4059 수집 중 에러 발생:', error.message);
    return null;
  }
}

// 2. 8216 얼굴 분석 비디오 페이지 크롤링 (https://rounz.com/collection.php?collectionIndex=8216)
async function crawlCollection8216() {
  console.log('\n[2/6] 기획전 8216 (얼굴형 추천) 페이지 수집 시작...');
  try {
    const response = await axios.get(`${BASE_URL}/collection.php?collectionIndex=8216`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    const $ = cheerio.load(response.data);
    const collectionData = {
      // title: $('title').text().trim(),
      // headerTitle: $('.top_details .intro h2').text().trim() || '안경 찾지 말고 먼저 추천 받자!',
      // description: $('.top_details .intro p').text().trim() || 'AI 얼굴형 분석하고 어울리는 안경 추천 받기',
      // introBgImage: 'https://image.rounz.com/newrounz/collection/240925/img_intro.jpg',
      sections: [],
    };

    const arSection = $('.suggest1 section.suggest_1');
    // $('.suggest1 section').each((i, elem) => {
    // const sectionTitle = $(elem).find('h2').text().replace(/\s+/g, ' ').trim();
    // const sectionSubtitle = $(elem).find('h3').text().replace(/\s+/g, ' ').trim();
    // const paragraphs = [];
    // $(elem)
    //   .find('p')
    //   .each((j, p) => {
    //     paragraphs.push($(p).text().replace(/\s+/g, ' ').trim());
    //   });

    const videoUrl = $(arSection).find('video').attr('src');
    // const images = [];
    // $(arSection)
    //   .find('img')
    //   .each((j, img) => {
    //     const src = $(img).attr('src');
    //     if (src) images.push(src);
    //   });

    const background = $('.suggest1 section.suggest_1 .suggest_btn');
    const styleContent = $('style').text();
    const bgUrl = styleContent.match(/\.suggest_btn\s*{[^}]*background:\s*url\(['"]?([^'")\s]+)['"]?\)/)?.[1] || null;
    // const buttons = [];
    // $(elem)
    //   .find('a')
    //   .each((j, a) => {
    //     const text = $(a).text().trim();
    //     const href = $(a).attr('href');
    //     if (href) buttons.push({ text, href });
    //   });

    if (videoUrl || bgUrl) {
      // sectionTitle || sectionSubtitle || paragraphs.length > 0 ||
      collectionData.sections.push({
        // sectionTitle,
        // sectionSubtitle,
        // paragraphs,
        videoUrl,
        bgUrl,
        // images,
        // buttons,
      });
    }
    // });

    fs.writeFileSync(
      path.join(__dirname, 'face-shape-analysis.json'),
      JSON.stringify(collectionData, null, 2),
      'utf-8',
    );
    console.log('[성공] 기획전 8216 데이터 저장 완료: face-shape-analysis.json');
    return collectionData;
  } catch (error) {
    console.error('[오류] 기획전 8216 수집 중 에러 발생:', error.message);
    return null;
  }
}

// 4. 제휴 안경원 크롤링 (https://rounz.com/find_store.php)
async function crawlStores() {
  console.log('\n[4/6] 제휴 안경원 목록 수집 시작...');
  try {
    const response = await axios.get(`${BASE_URL}/find_store.php`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    const $ = cheerio.load(response.data);
    const stores = [];

    $('.find_store .menu_contents').each((i, elem) => {
      const contentsType = $(elem).attr('data-contents');
      const storeType = contentsType === 'offline_store' ? '직영 안경원' : '파트너 안경원';

      $(elem)
        .find('.location ul.list li')
        .each((j, li) => {
          const name = $(li).find('strong').text().trim();
          const description = $(li).find('em').text().trim();
          const address = $(li).find('p').text().trim();
          const tel = $(li).find('i').text().trim();
          const mapUrl = $(li).find('a.map').attr('href');
          const imageUrl = $(li).find('.thumb img').attr('src');

          stores.push({
            storeType,
            name,
            description,
            address,
            tel,
            mapUrl,
            imageUrl,
          });
        });
    });

    fs.writeFileSync(path.join(__dirname, 'stores.json'), JSON.stringify(stores, null, 2), 'utf-8');
    console.log(`[성공] 안경원 데이터 저장 완료 (총 ${stores.length}개): stores.json`);
    return stores;
  } catch (error) {
    console.error('[오류] 안경원 수집 중 에러 발생:', error.message);
    return null;
  }
}

// 5. 상품 목록 페이지 크롤링 (glasses=1002, sunglasses=1001)
async function crawlProductLists() {
  console.log('\n[5/6] 상품 목록 페이지 수집 시작...');
  const categories = [
    { index: '1001', name: '선글라스' },
    { index: '1002', name: '안경테' },
  ];

  let allProducts = [];

  for (const cat of categories) {
    console.log(`\n[카테고리] ${cat.name} 목록 수집 중...`);
    let page = 1;
    let hasNext = true;

    while (hasNext) {
      const url = `${BASE_URL}/product_list.php?categoryIndex=${cat.index}&page=${page}`;
      console.log(`- ${cat.name} Page ${page} 요청 중...`);

      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        });
        const $ = cheerio.load(response.data);
        const listItems = $('.template.type_big_single ul.list li');

        if (listItems.length === 0) {
          console.log(`- ${cat.name} 수집할 제품이 더 이상 없습니다. 완료.`);
          break;
        }

        listItems.each((i, elem) => {
          const href = $(elem).find('a').attr('href');
          const productIndex = href ? href.split('productIndex=')[1] : null;
          const thumbnail = $(elem).find('.thumb img').attr('src') || $(elem).find('.thumb img').attr('data-src');

          const $dt = $(elem).find('dl dt');

          const brand = $dt.contents().first().text().trim();
          const modelName = $dt.contents().last().text().trim();

          const title = $(elem).find('dl .title').text().trim();

          const isSoldOut = $(elem).find('dl .price strong').text().includes('품절');
          const priceText = $(elem).find('dl .price_wrap .discount_price strong').text().trim();
          const discountRate = $(elem).find('dl .price_wrap .discount_rate i').text().trim();

          const likeCount = $(elem).find('dl .btn .like i').text().trim();
          const reviewCount = $(elem).find('dl .btn .review span').text().trim();

          if (productIndex) {
            allProducts.push({
              category: cat.name,
              categoryIndex: cat.index,
              productIndex,
              brand,
              modelName,
              title,
              isSoldOut,
              price: priceText,
              discountRate,
              likeCount,
              reviewCount,
              url: `${BASE_URL}/${href}`,
              thumbnail,
            });
          }
        });

        if (LIMIT_PAGES && page >= LIMIT_PAGES) {
          console.log(`- 설정된 LIMIT_PAGES (${LIMIT_PAGES}) 에 도달하여 다음 페이지 수집을 중단합니다.`);
          break;
        }

        const nextButton = $('.paging li a.btn.next');
        if (nextButton.length === 0 || nextButton.hasClass('off')) {
          hasNext = false;
        } else {
          page++;
          await delay(DELAY_MS);
        }
      } catch (error) {
        console.error(`[오류] ${cat.name} Page ${page} 수집 중 에러:`, error.message);
        break;
      }
    }
  }

  console.log(`\n[성공] 상품 목록 수집 완료 (총 ${allProducts.length}개 상품 발견)`);
  return allProducts;
}

// 6. 상품 상세 페이지 크롤링
async function crawlProductDetails(productList) {
  console.log('\n[6/6] 상품 상세 정보 수집 시작...');
  const limit = LIMIT_DETAILS ? Math.min(LIMIT_DETAILS, productList.length) : productList.length;
  const productsToCrawl = productList.slice(0, limit);
  console.log(`- 총 ${productList.length}개 중 ${limit}개 상품의 상세 페이지 정보를 수집합니다.`);

  const fetchDetail = async (product) => {
    const detailUrl = `${BASE_URL}/product.php?productIndex=${product.productIndex}`;
    try {
      const response = await axios.get(detailUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      const $ = cheerio.load(response.data);

      const detailImages = [];
      $('.slider_wrap ul.thumb li img').each((i, img) => {
        const src = $(img).attr('src');
        if (src) detailImages.push(src);
      });

      const cmsDescriptionImages = [];
      $('.detail_view_img img').each((i, img) => {
        const src = $(img).attr('src');
        if (src) cmsDescriptionImages.push(src);
      });

      const retailPrice = $('dd.price.thin strong i').text().trim();
      const memberMaxPrice = $('dd.price.discount_max strong i').text().trim();

      const specifications = {};
      $('.folding_box .info table tr').each((i, tr) => {
        const key = $(tr).find('th').text().trim();
        const value = $(tr).find('td').text().trim();
        if (key) {
          specifications[key] = value;
        }
      });

      const otherColors = [];
      $('#products_other_color .list li a').each((i, a) => {
        const href = $(a).attr('href');
        const colorProductIndex = href ? href.split('productIndex=')[1] : null;
        const colorName = $(a).find('dl dt').attr('title') || $(a).find('dl dt').text().trim();
        const image = $(a).find('.thumb img').attr('src');
        if (colorProductIndex) {
          otherColors.push({ colorProductIndex, colorName, image });
        }
      });

      console.log(`[완료] Product Index: ${product.productIndex} -> ${product.title.slice(0, 15)}...`);

      return {
        ...product,
        detailUrl,
        detailImages,
        cmsDescriptionImages,
        retailPrice,
        memberMaxPrice,
        specifications,
        otherColors,
      };
    } catch (error) {
      console.error(`[오류] Product Index ${product.productIndex} 수집 실패:`, error.message);
      return {
        ...product,
        detailUrl,
        error: error.message,
      };
    }
  };

  const detailedProducts = await runBatches(productsToCrawl, CONCURRENCY, fetchDetail);

  fs.writeFileSync(path.join(__dirname, 'products.json'), JSON.stringify(detailedProducts, null, 2), 'utf-8');
  console.log(`\n[성공] 상품 상세 데이터 저장 완료: products.json`);
}

// 7. 기획전 목록 페이지 크롤링 (https://rounz.com/collection_list.php)
async function crawlCollectionsList() {
  console.log('\n[추가] 기획전 전체 목록 페이지 수집 시작...');
  try {
    const response = await axios.get(`${BASE_URL}/collection_list.php`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    const $ = cheerio.load(response.data);
    const collections = [];

    const listItems = $('.collection_list ul li, .template.type_collection ul.list li, .magazine_list ul li');
    const targets = listItems.length > 0 ? listItems : $('.contents a[href*="collectionIndex="]').parent();

    targets.each((i, elem) => {
      const $anchor = $(elem).find('a').first().length ? $(elem).find('a').first() : $(elem).closest('a');
      const href = $anchor.attr('href') || '';

      let collectionId = null;
      const idMatch = href.match(/collectionIndex=(\d+)/);
      if (idMatch && idMatch[1]) {
        collectionId = idMatch[1]; // 예: "9145"
      }

      const $img = $(elem).find('img');
      const imageUrl = $img.attr('src') || $img.attr('data-src') || $img.attr('data-original') || '';

      let title = $(elem).find('.title, dt, .tit, h3').text().trim();
      let subtitle = $(elem).find('.subtitle, dd, .desc, p').text().trim();

      if (!title) {
        title = $img.attr('alt') || `라운즈 기획전 ${collectionId || i + 1}`;
      }

      if (imageUrl && !imageUrl.includes('blank.gif')) {
        const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`;
        const fullHref = href ? (href.startsWith('http') ? href : `${BASE_URL}/${href}`) : null;

        collections.push({
          collectionId,
          title: title.replace(/\s+/g, ' '),
          subtitle: subtitle.replace(/\s+/g, ' '), 
          image: fullImageUrl,
          href: fullHref
        });
      }
    });

    fs.writeFileSync(
      path.join(__dirname, 'collections_list.json'), 
      JSON.stringify(collections, null, 2), 
      'utf-8'
    );
    
    console.log(`[성공] 기획전 목록 데이터 저장 완료 (총 ${collections.length}개 발견 / ID 추출 완료): collections_list.json`);
    return collections;

  } catch (error) {
    console.error('[오류] 기획전 목록 수집 중 에러 발생:', error.message);
    return null;
  }
}

// 전체 실행 오케스트레이터
async function run() {
  console.log('==========================================');
  console.log('   ROUNZ.COM 크롤러 작동을 시작합니다.   ');
  console.log('==========================================');

  // 1. 메인 페이지
  await crawlMain();
  await delay(DELAY_MS);

  // 2-1. 기획전 페이지 4059 (셀럽 픽 아이웨어)
  await crawlCollection4059();
  await delay(DELAY_MS);

  // 2. 기획전 페이지 (얼굴형 추천)
  await crawlCollection8216();
  await delay(DELAY_MS);

  // 4. 안경점 페이지
  await crawlStores();
  await delay(DELAY_MS);

  // 5. 상품 목록 페이지 수집
  const products = await crawlProductLists();
  await delay(DELAY_MS);

  // 6. 상품 상세 페이지 수집
  if (products && products.length > 0) {
    await crawlProductDetails(products);
  }

  // 7. 기획전 목록 페이지 수집
  await crawlCollectionsList();
  await delay(DELAY_MS);

  console.log('\n==========================================');
  console.log('   모든 수집이 정상적으로 끝났습니다!   ');
  console.log('==========================================');
}

run();
