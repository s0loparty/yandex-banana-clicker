<template>
	<div class="grow overflow-x-scroll p-2">
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
			<div
				v-for="background in BACKGROUNDS"
				:key="background.id"
				class="rounded-md relative group"
			>
				<img
					:src="background.source"
					class="object-cover w-full rounded-md h-64 sm:min-h-[360px]"
				/>
				<div class="absolute inset-0 flex items-end justify-end">
					<div
						class="bg-black/80 p-2 rounded-md w-full group-hover:bg-transparent transition-colors duration-500"
					>
						<p
							class="text-white text-sm sm:text-base group-hover:opacity-0 transition-opacity duration-500"
						>
							{{ background.description }}
						</p>

						<!-- если фон куплен -->
						<button
							v-if="payed(background.id)"
							class="px-4 py-1 rounded text-white bg-blue-400 mt-2 disabled:bg-slate-700"
							:disabled="playerStore.player.currentBackgroundId === background.id"
							@click="setBackground(background.id)"
						>
							{{
								playerStore.player.currentBackgroundId === background.id
									? 'текущий'
									: 'применить'
							}}
						</button>

						<!-- если фон не куплен -->
						<button
							v-else
							class="px-4 py-1 rounded text-white bg-green-600 mt-2 disabled:bg-green-900 disabled:text-white/50"
							:disabled="notCanPayBackgroundByPrice(background.price)"
							@click="payBackground(background.id)"
						>
							получить за {{ background.price }} 🍌
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import useConfetti from '@/composable/useConfetti';
import usePayBackground from '@/composable/usePayBackground';
import { BACKGROUNDS } from '@/constants/backgrounds';
import useAdvStore from '@/stores/useAdvStore';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { onMounted } from 'vue';

const playerStore = usePlayerStore();
const { handlePay, notCanPayBackgroundByPrice, payed, setBackground } =
	usePayBackground();
const { backgroundsEffect } = useConfetti();
const { showFullscreenAdv } = useAdvStore();

const payBackground = (id: number) => {
	handlePay(id);
	backgroundsEffect();
};

onMounted(showFullscreenAdv);
</script>
