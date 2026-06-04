// ==========================================
// 1. Three.js 기본 무대(씬) 및 카메라 세팅
// ==========================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(0x050510, 0.012);

// 처음 시작 카메라 시점 상수로 정의 (초기화 시 재사용)
const START_CAM_POS = { x: 0, y: 40, z: 65 };

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(START_CAM_POS.x, START_CAM_POS.y, START_CAM_POS.z);

const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 150;
controls.minDistance = 10;

// ==========================================
// 2. 둥근 빛무리 텍스처 자체 생성 (최적화 기술)
// ==========================================
function createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(canvas);
}
const particleTexture = createGlowTexture();

// ==========================================
// 3. 나선형 은하수(Milky Way) 생성
// ==========================================
const galaxyParameters = {
    count: 15000,       
    size: 0.6,          
    radius: 70,         
    branches: 4,        
    spin: 1.5,          
    randomness: 3.5,    
    insideColor: '#ffbba3', 
    outsideColor: '#3a5cff' 
};

const starsGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(galaxyParameters.count * 3);
const colors = new Float32Array(galaxyParameters.count * 3);

const colorInside = new THREE.Color(galaxyParameters.insideColor);
const colorOutside = new THREE.Color(galaxyParameters.outsideColor);

for(let i = 0; i < galaxyParameters.count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * galaxyParameters.radius;
    const branchAngle = ((i % galaxyParameters.branches) / galaxyParameters.branches) * Math.PI * 2;
    const spinAngle = radius * galaxyParameters.spin;

    const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * galaxyParameters.randomness * radius;
    const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * galaxyParameters.randomness * radius * 0.3;
    const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * galaxyParameters.randomness * radius;

    positions[i3]     = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / galaxyParameters.radius);
    
    colors[i3]     = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const starsMaterial = new THREE.PointsMaterial({
    size: galaxyParameters.size,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    map: particleTexture,
    depthWrite: false,    
    blending: THREE.AdditiveBlending 
});

const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);


// ==========================================
// 4. ⭐ [데이터 입력] 두 분의 추억 데이터를 채워넣으세요 ⭐
// ==========================================
/* 💡 [가이드 - 추억 행성 추가 방식] 
  - 아래의 중괄호 { 부터 } 까지 통째로 복사해서 대괄호 내부에 콤마(,)로 늘려주시면 됩니다.
  - position은 -45에서 45 사이의 무작위 값으로 설정하면 행성이 은하수 전역에 배치됩니다.
*/
const memories = [
    {
        id: 0,
        date: "2026.06.06",
        title: "우리가 처음 만난 날",
        // 💡 [사진 경로 팁]: 추후 본인 깃허브 폴더에 이미지 저장 후 "images/photo1.jpg" 등으로 변경 가능!
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500", 
        desc: "우리가 연인이라는 은하수로 묶이게 된 날은 아니지만, 이후 처음 만난 첫 번째 기념비적인 날이야.",
        position: { x: -20, y: 3, z: 15 },
        color: 0xffdd55 // 행성 핵심 색상 (골드 행성)
    },
    {
        id: 1,
        date: "2026.06.06",
        title: "바다와 너",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500",
        desc: "이 넓은 바다 처럼, 우리의 추억의 은하수도 넓어지기를.",
        position: { x: 28, y: -5, z: -15 },
        color: 0x00ffcc // 청록 에메랄드 행성
    },
    {
        id: 2,
        date: "2026.06.06",
        title: "우리들의 반지",
        image: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=500",
        desc: "자주 만나지 못하더라도, 우리는 언제나 함께 있어.",
        position: { x: 8, y: 6, z: 30 },
        color: 0xff66aa // 로맨틱 핑크 행성
    },
    {
        id: 3,
        date: "2026.06.06",
        title: "너가 준 꽃다발",
        image: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=500",
        desc: "장미 77송이 만들어줘서 고마워. 우리의 이야기에 행운이 함께하기를.",
        position: { x: -10, y: 10, z: -25 },
        color: 0xff0000 // 장미와 같은 레드 행성
    }
];


// ==========================================
// 5. [비주얼 업그레이드] 디테일한 추억 행성(구체 + 아우라 링) 생성
// ==========================================
const memoryStars = [];

memories.forEach(data => {
    // 1. 행성 본체 (행성다운 질감 표현을 위해 와이어프레임 구조를 약간 가미하여 몽환적으로 빌드)
    const geo = new THREE.SphereGeometry(1.1, 32, 32);
    const mat = new THREE.MeshBasicMaterial({ 
        color: data.color,
        wireframe: false
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(data.position.x, data.position.y, data.position.z);
    mesh.userData = data; 
    scene.add(mesh);
    memoryStars.push(mesh);

    // 2. 행성을 감싸는 신비로운 대기층 오버레이 (화려함 극대화)
    const atmosphereGeo = new THREE.SphereGeometry(1.3, 16, 16);
    const atmosphereMat = new THREE.MeshBasicMaterial({
        color: data.color,
        wireframe: true, // 격자 무늬가 스스로 자전하며 우주 테크니컬 그래픽 느낌을 줍니다
        transparent: true,
        opacity: 0.25
    });
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    mesh.add(atmosphere); // 본체 행성에 종속시켜 함께 움직이도록 바인딩
    mesh.userData.atmosphere = atmosphere;

    // 3. 행성 주변 멀리 퍼지는 은은한 후광(Aura) 효과
    const glowGeo = new THREE.SphereGeometry(2.8, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.13,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.position.set(data.position.x, data.position.y, data.position.z);
    
    mesh.userData.glow = glowMesh;
    scene.add(glowMesh);
});


// ==========================================
// 6. 마우스 클릭 위치 레이캐스팅 감지
// ==========================================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    // 만약 타이틀 클릭 영역이거나 팝업창이 뜬 상태면 레이캐스터 이벤트 무시
    if (event.target.id === 'main-title' || !document.getElementById('popup').classList.contains('hidden')) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(memoryStars);

    if (intersects.length > 0) {
        const clickedStar = intersects[0].object;
        const memoryData = clickedStar.userData;
        zoomToStar(clickedStar.position, memoryData);
    }
});


// ==========================================
// 7. 클릭한 행성으로 카메라 부드럽게 이동(줌인)
// ==========================================
function zoomToStar(targetPosition, data) {
    controls.enabled = false; 

    const targetCamX = targetPosition.x;
    const targetCamY = targetPosition.y + 2.5;
    const targetCamZ = targetPosition.z + 8;

    new TWEEN.Tween(camera.position)
        .to({ x: targetCamX, y: targetCamY, z: targetCamZ }, 1500)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(() => {
            controls.target.copy(targetPosition); 
        })
        .onComplete(() => {
            document.getElementById('popup-date').innerText = data.date;
            document.getElementById('popup-title').innerText = data.title;
            document.getElementById('popup-img').src = data.image;
            document.getElementById('popup-desc').innerHTML = data.desc; 
            
            document.getElementById('popup').classList.remove('hidden');
            controls.enabled = true; 
        })
        .start();
}


// ==========================================
// 8. 팝업창 닫기 액션 및 시점 정렬
// ==========================================
document.getElementById('popup-close').addEventListener('click', () => {
    document.getElementById('popup').classList.add('hidden');
    
    new TWEEN.Tween(controls.target)
        .to({ x: 0, y: 0, z: 0 }, 1200)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
});


// ==========================================
// 9. 🌟 [신규 기능] 메인 타이틀 클릭 시 처음 홈 화면 시점으로 복구
// ==========================================
document.getElementById('main-title').addEventListener('click', () => {
    // 혹시 팝업창이 열려있다면 즉시 닫기 처리
    document.getElementById('popup').classList.add('hidden');
    controls.enabled = false; // 카메라 강제 리셋 애니메이션 중 마우스 컨트롤 제어 차단

    // 1. 카메라 시점 타겟을 우주 중심(0,0,0)으로 부드럽게 스무딩 복구
    new TWEEN.Tween(controls.target)
        .to({ x: 0, y: 0, z: 0 }, 1500)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();

    // 2. 카메라의 우주 공간 절대 좌표를 처음 상태로 되돌리는 애니메이션 
    new TWEEN.Tween(camera.position)
        .to({ x: START_CAM_POS.x, y: START_CAM_POS.y, z: START_CAM_POS.z }, 1500)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onComplete(() => {
            controls.enabled = true; // 애니메이션 끝나면 유저 회전 조작 다시 허용
        })
        .start();
});


// ==========================================
// 10. 실시간 프레임 애니메이션 루프
// ==========================================
function animate(time) {
    requestAnimationFrame(animate);
    
    TWEEN.update(); 
    
    // 배경 은하수를 자체 축 기준 우아하게 지속 회전
    starField.rotation.y += 0.0003; 
    
    // 각 행성 및 행성의 가상 대기 그리드 회전 및 반짝임 연출
    memoryStars.forEach((star, index) => {
        // 행성 본체 천천히 자전
        star.rotation.y += 0.005;

        // 대기권 그리드 레이어는 본체와 반대 방향으로 교차 자전시켜 유동감 증가
        const atmos = star.userData.atmosphere;
        if(atmos) {
            atmos.rotation.x += 0.01;
            atmos.rotation.y -= 0.01;
        }

        // 주변을 아우르는 후광 맥박(Pulse) 이펙트 연산
        const glow = star.userData.glow;
        if(glow) {
            const pulse = 1 + Math.sin(time * 0.003 + index) * 0.15;
            glow.scale.set(pulse, pulse, pulse);
        }
    });

    controls.update(); 
    renderer.render(scene, camera); 
}

animate();


// ==========================================
// 11. 브라우저 창 리사이즈 대응
// ==========================================
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
// ==========================================
// 12. [보안 기능] 우클릭, 드래그, 개발자 도구(F12) 등 차단
// ==========================================

// 1. 마우스 우클릭(컨텍스트 메뉴) 방지
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// 2. 화면 내 요소 드래그 앤 드롭 방지
window.addEventListener('dragstart', (e) => {
    e.preventDefault();
});

// 3. 주요 단축키 차단 (F12, 소스 보기, 개발자 도구 등)
window.addEventListener('keydown', (e) => {
    // F12 키 차단
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
    }
    
    // Ctrl + Shift + I (개발자 도구) / Ctrl + Shift + J 차단
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
    }
    
    // Ctrl + Shift + C (요소 검사) 차단
    if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
    }
    
    // Ctrl + U (페이지 소스 보기) 차단
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
    }
});
