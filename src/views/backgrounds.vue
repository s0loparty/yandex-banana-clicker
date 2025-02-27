<template>
	<div class="grow overflow-x-scroll p-2">
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
			<div
				v-for="background in BACKGROUNDS"
				:key="background.id"
				class="rounded-md relative"
			>
				<img
					:src="background.source"
					class="object-cover w-full rounded-md h-64 sm:min-h-[388px]"
				/>
				<div class="absolute inset-0 flex items-end justify-end p-2">
					<div class="bg-black/80 p-2 rounded-md w-full">
						<p class="text-white text-sm sm:text-base">
							{{ background.description }}
						</p>

						<!-- если фон куплен -->
						<button
							v-if="payed(background.id)"
							class="px-4 py-1 rounded text-white bg-blue-400 mt-2 disabled:hidden"
							:disabled="user.currentBackgroundId === background.id"
							@click="setBackground(background.id)"
						>
							применить
						</button>

						<!-- если фон не куплен -->
						<button
							v-else
							class="px-4 py-1 rounded text-black bg-yellow-300 mt-2 disabled:bg-slate-700 disabled:text-black"
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
import { BACKGROUNDS } from '@/constants';
import { useUserStore } from '@/stores/useUserStore';
import { storeToRefs } from 'pinia';

const { user } = storeToRefs(useUserStore());
const { handlePay, notCanPayBackgroundByPrice, payed, setBackground } =
	usePayBackground();
const { backgroundsEffect } = useConfetti();

const payBackground = (id: number) => {
	handlePay(id);
	backgroundsEffect();
};
</script>
