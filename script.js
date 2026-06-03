// ==========================================
// 1. Three.js 기본 무대(씬) 및 카메라 세팅
// ==========================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

// 우주 공간에 깊이감을 주기 위해 안개(Fog) 효과 추가
scene.fog = new THREE.FogExp2(0x050510, 0.012);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 35, 55); // 첫 접속 시 카메라가 내려다보는 시작 위치

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// 디바이스 해상도에 맞춰 계단현상 방지
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// 마우스로 화면을 드래그하고 확대/축소할 수 있는 컨트롤 활성화
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 드래그를 놓았을 때 부드럽게 감속되는 효과
controls.dampingFactor = 0.05;
controls.maxDistance = 140;    // 너무 멀어져서 은하수가 안 보이는 것 방지
controls.minDistance = 6;      // 너무 가까워져서 뚫리는 것 방지

// ==========================================
// 2. 소용돌이치는 배경 은하수 별자리 생성
// ==========================================
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 6000; // 전체 배경 별들의 총 개수
const positions = new Float32Array(starsCount * 3);
const colors = new Float32Array(starsCount * 3);

for (let i = 0; i < starsCount; i++) {
    // 나선형 은하수를 만들기 위한 수학적 배치 공식
    const angle = i * 0.12;
    const radius = Math.pow(Math.random(), 2.2) * 65; // 중심부에 별이 조밀하게 모이게 유도
    
    // 자연스러운 은하수 형태를 위해 무작위 퍼짐(노이즈) 효과 적용
    const randomX = (Math.random() - 0.5) * 5 * (radius * 0.08);
    const randomY = (Math.random() - 0.5) * 3 * (radius * 0.04);
    const randomZ = (Math.random() - 0.5) * 5 * (radius * 0.08);

    positions[i * 3] = Math.cos(angle) * radius + randomX;
    positions[i * 3 + 1] = randomY;
    positions[i * 3 + 2] = Math.sin(angle) * radius + randomZ;

    // 은하수 별의 색상을 푸른빛, 흰색, 보라색으로 랜덤하게 혼합
    colors[i * 3] = 0.6 + Math.random() * 0.4;     // Red 성분
    colors[i * 3 + 1] = 0.6 + Math.random() * 0.4; // Green 성분
    colors[i * 3 + 2] = 0.9 + Math.random() * 0.1; // Blue 성분 (푸른 밤하늘 강조)
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// 입자(파티클) 스타일 정의
const starsMaterial = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending // 별빛이 겹치면 더 눈부시게 합쳐지는 효과
});

const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);


// ==========================================
// 3. ⭐ 여기에 두 분의 추억 데이터를 채워넣으세요 ⭐
// ==========================================
// 💡 가이드: 새로운 추억을 늘리고 싶다면 중괄호 블록{ } 전체를 복사해서 아래에 콤마(,)로 이어붙이세요.
const memories = [
    {
        id: 0,
        date: "2024.03.14",
        title: "우리 처음 마주한 날",
        // 💡 [사진 경로 팁]: 프로젝트 폴더 안에 images 폴더를 만들고 'meet.jpg' 식으로 넣어 경로를 변경하세요.
        // 현재는 임시로 테스트용 인터넷 이미지가 들어가 있습니다.
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500", 
        desc: "수많은 사람 중에서 너만 주위가 환해지면서 내 눈에 들어오더라. 우리가 연인이라는 은하수로 묶이게 된 첫 번째 기념비적인 날이야.",
        // 💡 [좌표 조정 팁]: 우주 공간 속 별의 절대 위치입니다. 서로 겹치지 않게 숫자를 분산시켜 주세요.
        position: { x: -18, y: 1, z: 12 },
        color: 0xffbb33 // 노란빛으로 활성화될 별
    },
    {
        id: 1,
        date: "2024.08.03",
        title: "여름밤, 바다와 너",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500",
        desc: "시원한 파도 소리를 들으며 모래사장 위에서 밤하늘을 올려다보았을 때, 네 곁에 있어 세상 누구보다 내 우주가 풍요롭다고 느꼈어.",
        position: { x: 22, y: -4, z: -18 },
        color: 0x00ffcc // 청록색(에메랄드) 빛의 별
    },
    {
        id: 2,
        date: "2025.12.25",
        title: "우리들의 따뜻했던 크리스마스",
        image: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=500",
        desc: "밖은 유난히 추웠지만, 작은 방 안에서 트리를 켜두고 캐럴을 들으며 함께 웃던 시간. 그 포근함이 저장되어 있는 핑크빛 별이야.",
        position: { x: 4, y: 6, z: 24 },
        color: 0xff5599 // 분홍빛의 별
    }
];


// ==========================================
// 4. 클릭이 가능한 '추억의 별' 구체 오브젝트 생성
// ==========================================
const memoryStars = [];

memories.forEach(data => {
    // 마우스로 선택하기 편하도록 적당한 지름의 구체(Sphere) 생성
    const geo = new THREE.SphereGeometry(0.7, 16, 16);
    // 스스로 자체 발광하는 특성의 재질 사용
    const mat = new THREE.MeshBasicMaterial({ color: data.color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(data.position.x, data.position.y, data.position.z);
    
    // 데이터 보존: 클릭했을 때 꺼내 쓸 수 있도록 데이터 객체를 오브젝트 내부에 심어둡니다.
    mesh.userData = data;
    
    scene.add(mesh);
    memoryStars.push(mesh); // 클릭 감지 대상 리스트에 등록

    // 별 주위에 은은하게 퍼지는 아우라(빛무리) 레이어 추가 효과
    const glowGeo = new THREE.SphereGeometry(1.4, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.position.set(data.position.x, data.position.y, data.position.z);
    scene.add(glowMesh);
});


// ==========================================
// 5. 마우스 클릭 위치 레이캐스팅 (Raycaster) 감지
// ==========================================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    // 만약 이미 추억 팝업창이 화면에 열려있는 상태라면 별 클릭이 중복 처리되지 않게 차단
    if (!document.getElementById('popup').classList.contains('hidden')) return;

    // 브라우저 2D 좌표를 Three.js 3D 정규화 좌표(-1 ~ 1)로 맵핑 변환
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    // 내가 심어둔 '추억의 별'들과 광선이 부딪혔는지 판정
    const intersects = raycaster.intersectObjects(memoryStars);

    if (intersects.length > 0) {
        const clickedStar = intersects[0].object;
        const memoryData = clickedStar.userData;
        
        // 카메라가 해당 별로 매끄럽게 전진하는 함수 호출
        zoomToStar(clickedStar.position, memoryData);
    }
});


// ==========================================
// 6. 클릭한 별로 카메라 부드럽게 이동(줌인) 및 팝업 표출
// ==========================================
function zoomToStar(targetPosition, data) {
    controls.enabled = false; // 카메라 강제 이동 중에 사용자의 드래그 컨트롤 일시 비활성화

    // 별의 위치보다 약간 앞쪽에 안착할 카메라의 목표 최종 좌표 계산
    const targetCamX = targetPosition.x;
    const targetCamY = targetPosition.y + 1.8;
    const targetCamZ = targetPosition.z + 5.5;

    // TWEEN 라이브러리로 1.4초 동안 카메라를 부드럽게 목표 지점으로 이동시킴
    new TWEEN.Tween(camera.position)
        .to({ x: targetCamX, y: targetCamY, z: targetCamZ }, 1400)
        .easing(TWEEN.Easing.Cubic.Out) // 점차 감속되는 우아한 무빙 곡선
        .onUpdate(() => {
            controls.target.copy(targetPosition); // 초점을 별의 중심으로 고정 유지
        })
        .onComplete(() => {
            // 카메라가 별 앞에 완전히 도착하면 HTML 요소에 데이터 바인딩 후 팝업 해제
            document.getElementById('popup-date').innerText = data.date;
            document.getElementById('popup-title').innerText = data.title;
            document.getElementById('popup-img').src = data.image;
            document.getElementById('popup-desc').innerText = data.desc;
            
            document.getElementById('popup').classList.remove('hidden');
            controls.enabled = true; // 유저 제어권 복구
        })
        .start();
}


// ==========================================
// 7. 팝업창 닫기 액션 및 시점 복구
// ==========================================
document.getElementById('popup-close').addEventListener('click', () => {
    document.getElementById('popup').classList.add('hidden');
    
    // 카메라는 제자리에 두되, 초점(Target)을 다시 우주 한가운데(0, 0, 0)로 부드럽게 정렬 복구
    new TWEEN.Tween(controls.target)
        .to({ x: 0, y: 0, z: 0 }, 1000)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
});


// ==========================================
// 8. 매 프레임 화면을 다시 그려주는 실시간 애니메이션 루프
// ==========================================
function animate(time) {
    requestAnimationFrame(animate);
    
    TWEEN.update(); // 예약된 애니메이션들의 프레임 상태 갱신
    
    // 배경 은하수를 축 기준으로 아주 미세하게 회전시켜 살아있는 공간감 연출
    starField.rotation.y += 0.0004;
    
    // 우리가 박아둔 추억의 별들이 스스로 자전하고 미세하게 숨쉬듯 깜빡거리게 함
    memoryStars.forEach((star, index) => {
        star.rotation.x += 0.008;
        star.rotation.y += 0.012;
        
        // 사인 파형을 이용하여 시간차별로 크기가 살짝 불어났다 줄어드는 반짝임 연출
        const pulseScale = 1 + Math.sin(time * 0.0025 + index) * 0.07;
        star.scale.set(pulseScale, pulseScale, pulseScale);
    });

    controls.update(); // OrbitControls 물리 연산 업데이트
    renderer.render(scene, camera); // 최종 씬 그리기
}

animate();


// ==========================================
// 9. 브라우저 창 크기가 조절될 때 (화면 비율 리사이징 대응)
// ==========================================
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
