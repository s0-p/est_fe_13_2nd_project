const fs = require('fs');
const axios = require('axios');

const INPUT_FILE = 'stores.json'; // ⚠️ 파일명이 store.json인지 stores.json인지 꼭 확인하세요!
const OUTPUT_FILE = 'stores.json';

// ⚠️여기에 카카오 개발자 센터에서 복사한 REST API 키를 입력하세요!
const KAKAO_REST_API_KEY = 'e3940c62f14ec2384c6169ceac086548'; 

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 카카오 로컬 API를 이용해 주소를 위도와 경도로 변환합니다.
 */
async function getCoordsFromKakao(address) {
    try {
        // 주소 뒤의 괄호 유도 문구(예: 4번 출구 등)를 제거하여 검색 정확도 상향
        const cleanAddress = address.replace(/\s*\(.*?\)\s*/g, ' ').trim();

        const response = await axios.get('https://dapi.kakao.com/v2/local/search/address.json', {
            headers: {
                'Authorization': `KakaoAK ${KAKAO_REST_API_KEY}`,
                'Origin': 'http://localhost'
            },
            params: {
                query: cleanAddress
            },
            timeout: 5000
        });

        const documents = response.data?.documents;
        if (documents && documents.length > 0) {
            // 카카오 API 결과에서 x는 경도(longitude), y는 위도(latitude)입니다.
            const lng = documents[0].x;
            const lat = documents[0].y;
            return { latitude: lat, longitude: lng };
        }
    } catch (error) {
        if (error.response) {
            console.error(`❌ 카카오 API 에러 (${address}) - 상태코드: ${error.response.status}`);
            console.error(`   상세 원인:`, error.response.data);
        } else {
            console.error(`❌ 네트워크 에러 (${address}):`, error.message);
        }
    }
    return { latitude: null, longitude: null };
}

async function main() {
    if (KAKAO_REST_API_KEY === '여기에_복사한_REST_API_키_입력') {
        console.error("❌ 코드 상단의 KAKAO_REST_API_KEY 값을 입력해주세요!");
        return;
    }

    if (!fs.existsSync(INPUT_FILE)) {
        console.error(`❌ '${INPUT_FILE}' 파일이 존재하지 않습니다. 본인의 데이터 파일명(예: stores.json)과 일치하는지 확인해 주세요.`);
        return;
    }

    const stores = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));
    console.log(`총 ${stores.length}개의 매장 데이터를 카카오 API로 변환합니다...`);

    for (let i = 0; i < stores.length; i++) {
        const store = stores[i];
        const name = store.name;
        const address = store.address;

        if (address) {
            console.log(`[${i + 1}/${stores.length}] '${name}' 좌표 변환 중...`);
            const { latitude, longitude } = await getCoordsFromKakao(address);
            
            store.latitude = latitude;
            store.longitude = longitude;

            if (latitude && longitude) {
                console.log(`   => 성공! 위도: ${latitude}, 경도: ${longitude}`);
            } else {
                console.log(`   => ⚠️ 좌표를 찾을 수 없습니다. (주소 텍스트 확인 필요)`);
            }
        } else {
            store.latitude = null;
            store.longitude = null;
            console.log(`[${i + 1}/${stores.length}] '${name}' - 주소가 없습니다.`);
        }

        // 정식 API이므로 짧게 0.1초만 대기
        await sleep(100);
    }

    // 파일로 저장
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(stores, null, 2), 'utf-8');
    console.log('\n========================================');
    console.log(`🎉 카카오 API 변환 성공! 결과 파일: ${OUTPUT_FILE}`);
    console.log('========================================');
}

main();