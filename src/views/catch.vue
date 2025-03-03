<template>
	<div
		ref="gameArea"
		class="relative grow overflow-hidde overflow-hidden bg-cover bg-no-repeat bg-center"
		:style="{ backgroundImage: `url(${CatchBananasBg})` }"
		@mousemove="handleMouseMove"
	>
		<!-- start  popup -->
		<div
			v-show="isShowStartPopup"
			class="absolute inset-0 w-full h-full bg-black/80 z-50"
		>
			<div
				class="absolute space-y-5 left-1/2 -translate-x-1/2 top-1/4 w-[80%] sm:w-[60%] p-4 sm:p-6 rounded-xl bg-slate-700 shadow-black/80 shadow-[0_0_5px]"
			>
				<div>
					<div class="uppercase text-center text-white font-bold text-xl">
						{{ TIMER_FOR_GAME_IN_SECONDS }} секунд на ловлю бананов
					</div>
					<p class="text-base text-center text-gray-300">
						Двигай мартышку влево/вправо и хватай бананы!
					</p>
				</div>

				<p class="text-base text-center text-orange-400">
					Из-за пропуска бананов счёт может уйти в минус! <br />
					Будьте быстры как ветер!
				</p>

				<div>
					<div class="text-green-600 text-center text-lg">
						Поймал банан +{{ INCREMENT_FOR_ONE_BANANA }} 🍌
					</div>
					<div class="text-red-600 text-center text-lg">
						Пропустил банан -{{ DECREMENT_FOR_ONE_BANANA }} 🍌
					</div>
				</div>

				<button
					class="bg-yellow-600 text-white rounded-md px-4 py-2 block mx-auto"
					@click="startGame"
				>
					ПОГНАЛИ
				</button>
			</div>
		</div>

		<!-- finish popup -->
		<div
			v-show="isShowFinishPopup"
			class="absolute inset-0 w-full h-full bg-black/80 z-50"
		>
			<div
				class="absolute space-y-5 left-1/2 -translate-x-1/2 top-1/4 w-[80%] sm:w-1/2 p-4 sm:p-6 rounded-xl bg-slate-700 shadow-black/80 shadow-[0_0_5px]"
			>
				<div class="uppercase text-white text-xl font-bold text-center">
					Конец игры
				</div>
				<div class="text-lg text-center">
					<div class="text-green-600">Мартышка поймала {{ caughtBananas }} 🍌</div>
					<div class="text-yellow-500">За это вы получаете {{ score }} 🍌</div>
				</div>
				<button
					class="bg-yellow-600 text-white rounded-md px-4 py-2 block mx-auto"
					@click="handleFinishGame"
				>
					СУПЕР
				</button>
			</div>
		</div>

		<!-- game timer -->
		<div
			v-show="!isShowStartPopup"
			class="absolute top-[5%] left-1/2 -translate-x-1/2 text-[70px] text-yellow-500/80 shadow-md font-extrabold"
		>
			{{ timerGameInSeconds }}
		</div>

		<!-- Корзинка (игрок) -->
		<div
			class="absolute -bottom-4 h-[90px] w-[100px] rounded-t-md flex items-center justify-center transition-transform duration-75 ease-linear"
			:style="{
				left: playerX + 'px',
				transform: 'translateX(-50%)',
			}"
		>
			<img
				:src="Monkey"
				alt="monkey"
			/>
		</div>

		<!-- Падающие бананы -->
		<div
			v-for="banana in bananas"
			:key="banana.id"
			class="absolute w-10 h-10"
			:style="{
				top: banana.y + 'px',
				left: banana.x + 'px',
			}"
		>
			<!-- Можно вставить картинку банана -->
			<img
				:src="SmallBanana"
				alt="banana"
				class="w-full h-full object-contain"
			/>
			<div
				:class="[
					`pointer-events-none w-full h-full object-contain bg-[url(${SmallBanana})]`,
				]"
				draggable="false"
			></div>
		</div>

		<!-- Панель управления/результаты -->
		<div class="absolute top-0 left-0 m-2 p-2 bg-white shadow rounded">
			<p>Счёт: {{ score }}</p>
			<p>Поймано бананов: {{ caughtBananas }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, useTemplateRef, computed } from 'vue';
import SmallBanana from '@/assets/images/small-banana.png';
import Monkey from '@/assets/images/monkey.webp';
import SoundNyam from '@/assets/sounds/nyam.mp3';
import CatchBananasBg from '@/assets/images/catch-bananas.webp';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'vue-router';

interface Banana {
	id: number;
	x: number;
	y: number;
	speed: number; // Скорость падения
}

const router = useRouter();
const userStore = useUserStore();
const gameArea = useTemplateRef('gameArea');

// сколько добавлять бананов за 1 пойманный банан
const INCREMENT_FOR_ONE_BANANA = 10;
// сколько отнимать бананов за 1 пропущенный банан
const DECREMENT_FOR_ONE_BANANA = 20;
// таймер игры
const TIMER_FOR_GAME_IN_SECONDS = 30;

const timerGameInSeconds = ref(TIMER_FOR_GAME_IN_SECONDS);
const timerGameId = ref<ReturnType<typeof setInterval>>();

const isShowStartPopup = ref(true);
const isShowFinishPopup = ref(false);

// Позиция игрока (корзинки) по оси X
const playerX = ref(200);
const playerWidth = 100; // ширина корзинки
const playerHeight = 70; // высота корзинки

// Массив падающих бананов
const bananas = ref<Banana[]>([]);

// Счёт/результаты
const score = ref(0);
const caughtBananas = ref(0);

// Идентификатор анимации
const animationFrameId = ref(0);
// Генерация ID для бананов
const bananaIdCounter = ref(0);

// Игровые параметры
const gameWidth = computed(() => {
	return gameArea.value?.getBoundingClientRect().width ?? 600;
});
const gameHeight = computed(() => {
	return gameArea.value?.getBoundingClientRect().height ?? 600;
});
const bananaWidth = 40; // Размер банана (в пикселях), совпадает с w-10 Tailwind
const bananaHeight = 40; // h-10

// Обновляем позиции бананов
function updateBananas() {
	bananas.value.forEach((banana) => {
		banana.y += banana.speed; // банан падает вниз
	});

	// Удаляем бананы, которые упали за пределы экрана
	bananas.value = bananas.value.filter((banana) => {
		// Если банан за нижней границей, штраф или просто удаляем
		if (banana.y > gameHeight.value) {
			// к примеру, штраф за пропуск
			score.value -= DECREMENT_FOR_ONE_BANANA;
			return false;
		}
		return true;
	});
}

// Создание бананов
function spawnBanana() {
	bananaIdCounter.value++;
	bananas.value.push({
		id: bananaIdCounter.value,
		x: Math.random() * (gameWidth.value - bananaWidth), // случайная позиция
		y: -bananaHeight, // чуть выше экрана
		speed: 2 + Math.random() * 5, // случайная скорость
	});
}
function checkCollisions() {
	bananas.value.forEach((banana) => {
		const bananaCenterX = banana.x + bananaWidth / 2;
		const bananaBottomY = banana.y + bananaHeight;

		// Проверяем, коснулся ли банан верхней границы корзинки
		const basketTopY = gameHeight.value - playerHeight; // корзинка привязана к нижней границе
		const basketLeftX = playerX.value - playerWidth / 2;
		const basketRightX = playerX.value + playerWidth / 2;

		// Условие: если банан «пересёк» верх корзинки, и его X попадает в диапазон корзинки
		if (
			bananaBottomY >= basketTopY && // банан достиг верха корзинки
			bananaCenterX >= basketLeftX &&
			bananaCenterX <= basketRightX
		) {
			// Считаем банан пойманным
			caughtBananas.value++;
			score.value += INCREMENT_FOR_ONE_BANANA; // добавим очки
			// Удаляем его из массива
			bananas.value = bananas.value.filter((b) => b.id !== banana.id);

			playNyamSound();
		}
	});
}

function playNyamSound() {
	if (userStore.soundEffects) {
		new Audio(SoundNyam).play();
	}
}

// Случайная генерация бананов (например, каждые ~ 1-2 секунды)
let lastSpawnTime = 0;
function maybeSpawnBanana() {
	const now = performance.now();
	// Если прошло больше 700мс с момента последнего спавна – создаём банан
	if (now - lastSpawnTime > 400) {
		spawnBanana();
		lastSpawnTime = now;
	}
}

// Запуск анимации
function startGame() {
	isShowStartPopup.value = false;

	timerGameId.value = setInterval(() => {
		if (timerGameInSeconds.value === 0) {
			clearInterval(timerGameId.value);
			stopGame();

			isShowFinishPopup.value = true;
			return;
		}

		timerGameInSeconds.value = timerGameInSeconds.value - 1;
	}, 1000);

	// Очищаем прошлые данные
	bananas.value = [];
	score.value = 0;
	caughtBananas.value = 0;
	cancelAnimationFrame(animationFrameId.value);
	spawnBanana(); // Создадим первый банан
	animationFrameId.value = requestAnimationFrame(gameLoop);
}

// Остановка анимации
function stopGame() {
	cancelAnimationFrame(animationFrameId.value);
}

// Основной игровой цикл
function gameLoop() {
	updateBananas();
	checkCollisions();
	maybeSpawnBanana();
	animationFrameId.value = requestAnimationFrame(gameLoop);
}

// Управление корзинкой (мышь)
function handleMouseMove(e: MouseEvent) {
	if (!gameArea.value || isShowStartPopup.value || isShowFinishPopup.value) return;
	const rect = gameArea.value.getBoundingClientRect();
	const mouseX = e.clientX - rect.left;
	playerX.value = Math.max(
		Math.min(mouseX, gameWidth.value - playerWidth / 2),
		playerWidth / 2
	);
}

// Управление корзинкой (клавиши)
function handleKeyDown(e: KeyboardEvent) {
	const step = 15;
	if (e.key === 'ArrowLeft' || e.key === 'a') {
		playerX.value = Math.max(playerX.value - step, playerWidth / 2);
	} else if (e.key === 'ArrowRight' || e.key === 'd') {
		playerX.value = Math.min(playerX.value + step, gameWidth.value - playerWidth / 2);
	}
}

const saveBanans = () => {
	userStore.user.bananas += score.value;
};

const handleFinishGame = () => {
	saveBanans();
	router.push('/');
};

onMounted(() => {
	document.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
	saveBanans();

	document.removeEventListener('keydown', handleKeyDown);
	cancelAnimationFrame(animationFrameId.value);
});
</script>
