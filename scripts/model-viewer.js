document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("model-container");

  // Индикатор загрузки
  const loadingIndicator = document.createElement("div");
  loadingIndicator.className = "loading-indicator";
  loadingIndicator.textContent = "Загрузка модели...";
  container.appendChild(loadingIndicator);

  // Проверка поддержки WebGL
  if (!WebGLRenderingContext) {
    container.innerHTML =
      '<div class="error-message">Ваш браузер не поддерживает WebGL. Пожалуйста, обновите браузер или используйте другой.</div>';
    return;
  }

  // Инициализация сцены
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  // Создание камеры с фиксированным положением
  const camera = new THREE.PerspectiveCamera(
    60, // Более широкий угол обзора
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );

  // Фиксированное положение камеры (настраивайте по своему вкусу)
  camera.position.set(14, 7, -6); // x, y, z

  // Создание рендерера
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  // Освещение
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 15, 10);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  scene.add(directionalLight);

  // Инициализация OrbitControls ДО загрузки модели
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = true;

  // Фиксированные параметры управления (настраивайте по необходимости)
  controls.minDistance = 1; // Минимальное расстояние приближения
  controls.maxDistance = 20; // Максимальное расстояние отдаления
  controls.maxPolarAngle = Math.PI / 1.8; // Ограничение угла наклона

  // Загрузка модели
  const loader = new THREE.GLTFLoader();
  loader.load(
    "../models/scene.gltf",
    (gltf) => {
      // Удаляем индикатор загрузки
      container.removeChild(loadingIndicator);

      const model = gltf.scene;
      scene.add(model);

      // Добавляем рендерер после загрузки модели
      container.appendChild(renderer.domElement);

      // Обновляем цель управления камерой
      controls.update();
    },
    undefined,
    (error) => {
      console.error("Ошибка загрузки модели:", error);
      container.removeChild(loadingIndicator);
      container.innerHTML =
        '<div class="error-message">Ошибка загрузки 3D модели. Проверьте путь к файлу и консоль для деталей.</div>';
    }
  );

  // Ресайз контейнера
  const resizeObserver = new ResizeObserver(() => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
  resizeObserver.observe(container);

  // Анимация
  function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Обновление контролов
    renderer.render(scene, camera);
  }
  animate();
});
