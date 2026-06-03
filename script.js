// ==========================================
// 1. Three.js 기본 무대(씬) 및 카메라 세팅
// ==========================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

// 우주 공간 깊이감을 위한 안개(Fog) - 짙은 네이비 톤
scene.fog = new THREE.FogExp2(0x050510, 0.012);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 40, 65); // 처음 시작 시 은하수를 내려다보는 각도

const renderer = new THREE.WebGLRenderer({ antialias: false }); // 파티클 위주라 안티앨리어싱을 끄는 것이 최적화에 유리합니다
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 고해상도 모니터 최적화 제한
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 150;
controls.minDistance = 10;

// ==========================================
// 2. [최적화 & 화려함] 둥근 빛무리 텍스처 자체 생성 (외부 이미지 불필요)
// ==========================================
function createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); // 중심은 밝게
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // 테두리는 투명하게 스며들듯
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(canvas);
}
const particleTexture = createGlowTexture();

// ==========================================
// 3. [업그레이드] 나선형 은하수(Milky Way) 생성
// ==========================================
const galaxyParameters = {
    count: 15000,       // 별의 총 개수 (최적화되어 있어 1.5만개도 거뜬합니다)
    size: 0.6,          // 개별 별의 크기
    radius: 70,         // 은하수의 전체 반지름
    branches: 4,        // 나선형 팔의 개수 (은하수 느낌의 핵심!)
    spin: 1.5,          // 팔이 휘어지는 정도
    randomness: 3.5,    // 별들이 흩어지는 정도
    insideColor: '#ffbba3', // 중심부 색상 (따뜻한 핑크골드/살구색)
    outsideColor: '#3a5cff' // 외곽부 색상 (차갑고 신비로운 딥블루)
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

    // 중심에 가까울수록 덜 흩어지고(밀집), 멀어질수록 많이 흩어지게 설정
    const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * galaxyParameters.randomness * radius;
    const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * galaxyParameters.randomness * radius * 0.3; // Y축은 납작하게
    const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * galaxyParameters.randomness * radius;

    positions[i3]     = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    // 중심부에서 외곽으로 갈수록 색상이 부드럽게 섞임 (그라데이션 효과)
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
    map: particleTexture, // 생성한 둥근 텍스처 적용
    depthWrite: false,    // 파티클끼리 가리는 현상 방지 (최적화)
    blending: THREE.AdditiveBlending // 겹칠수록 밝게 빛나는 효과
});

const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);


// ==========================================
// 4. ⭐ [데이터 입력] 두 분의 추억 데이터를 채워넣으세요 ⭐
// ==========================================
/* 💡 [가이드 - 추억 추가하는 법] 
  1. 아래 중괄호 { 부터 } 까지 통째로 복사해서 쉼표(,) 뒤에 붙여넣으세요.
  2. id 숫자는 안 겹치게 1씩 늘려주세요.
  3. position(x, y, z) 값은 -50 ~ 50 사이의 숫자로 적당히 퍼트려주세요.
*/
const memories = [
    {
        id: 0,
        date: "2024.03.14",
        title: "우리 처음 마주한 날",
        // 💡 [사진 변경]: "https://..." 부분을 지우고 "images/photo1.jpg" 처럼 내 폴더 안의 사진 이름으로 바꾸세요!
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500", 
        // 💡 [내용 변경]: 줄바꿈을 원하시면 <br>을 중간에 적어주세요.
        desc: "수많은 사람 중에서 너만 주위가 환해지면서 내 눈에 들어오더라. 우리가 연인이라는 은하수로 묶이게 된 첫 번째 기념비적인 날이야.",
        position: { x: -20, y: 3, z: 15 },
        color: 0xffdd55 // 밝은 골드
    },
    {
        id: 1,
        date: "2024.08.03",
        title: "여름밤, 바다와 너",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500",
        desc: "시원한 파도 소리를 들으며 모래사장 위에서 밤하늘을 올려다보았을 때, 네 곁에 있어 세상 누구보다 내 우주가 풍요롭다고 느꼈어.",
        position: { x: 28, y: -5, z: -15 },
        color: 0x00ffcc // 에메랄드 민트
    },
    {
        id: 2,
        date: "2025.12.25",
        title: "우리들의 따뜻했던 크리스마스",
        image: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=500",
        desc: "밖은 유난히 추웠지만, 작은 방 안에서 트리를 켜두고 캐럴을 들으며 함께 웃던 시간. 그 포근함이 저장되어 있는 핑크빛 별이야.",
        position: { x: 8, y: 6, z: 30 },
        color: 0xff66aa // 로맨틱 핑크
    }
];


// ==========================================
// 5. 클릭이 가능한 '추억의 별' 구체 오브젝트 생성
// ==========================================
const memoryStars = [];

memories.forEach(data => {
    // 배경 은하수보다 눈에 확 띄도록 크기와 발광력을 조정
    const geo = new THREE.SphereGeometry(1.0, 32, 32);
    const mat = new THREE.MeshBasicMaterial({ color: data.color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(data.position.x, data.position.y, data.position.z);
    mesh.userData = data; // 별 안에 데이터 저장
    scene.add(mesh);
    memoryStars.push(mesh);

    // 특별한 별 주변의 커다란 후광(Aura) 효과
    const glowGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.position.set(data.position.x, data.position.y, data.position.z);
    
    // 후광 효과를 배열에 같이 묶어서 애니메이션 때 부풀어 오르게 함
    mesh.userData.glow = glowMesh;
    scene.add(glowMesh);
});


// ==========================================
// 6. 마우스 클릭 위치 레이캐스팅 (Raycaster) 감지
// ==========================================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    if (!document.getElementById('popup').classList.contains('hidden')) return;

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
// 7. 클릭한 별로 카메라 부드럽게 이동(줌인) 및 팝업 표출
// ==========================================
function zoomToStar(targetPosition, data) {
    controls.enabled = false; 

    // 카메라가 멈출 최종 위치 (별 앞쪽 약간 위)
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
            // HTML 텍스트 및 이미지 교체
            document.getElementById('popup-date').innerText = data.date;
            document.getElementById('popup-title').innerText = data.title;
            document.getElementById('popup-img').src = data.image;
            // innerHTML을 사용해 <br> 태그(줄바꿈) 적용 가능하게 함
            document.getElementById('popup-desc').innerHTML = data.desc; 
            
            document.getElementById('popup').classList.remove('hidden');
            controls.enabled = true; 
        })
        .start();
}


// ==========================================
// 8. 팝업창 닫기 액션 및 시점 복구
// ==========================================
document.getElementById('popup-close').addEventListener('click', () => {
    document.getElementById('popup').classList.add('hidden');
    
    // 초점(Target)을 다시 우주 중심(0, 0, 0)으로 복구
    new TWEEN.Tween(controls.target)
        .to({ x: 0, y: 0, z: 0 }, 1200)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
});


// ==========================================
// 9. 매 프레임 화면을 다시 그려주는 실시간 애니메이션 루프
// ==========================================
function animate(time) {
    requestAnimationFrame(animate);
    
    TWEEN.update(); 
    
    // 💡 최적화 포인트: 수만 개의 별 좌표를 하나하나 바꾸지 않고, 은하수 덩어리 자체를 회전시킴
    starField.rotation.y += 0.0003; 
    
    // 추억의 별들만 따로 후광이 숨쉬듯 깜빡이는 애니메이션 적용
    memoryStars.forEach((star, index) => {
        const glow = star.userData.glow;
        if(glow) {
            const pulse = 1 + Math.sin(time * 0.003 + index) * 0.2;
            glow.scale.set(pulse, pulse, pulse);
        }
    });

    controls.update(); 
    renderer.render(scene, camera); 
}

animate();


// ==========================================
// 10. 브라우저 창 크기가 조절될 때 (반응형)
// ==========================================
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
