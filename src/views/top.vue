<template>
	<div class="grow overflow-x-scroll p-2 w-full">
		<div
			v-if="topPlayers === null"
			class="flex items-center justify-center py-14"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				class="size-12 animate-spin stroke-white"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
				/>
			</svg>
		</div>
		<div
			v-else
			class="w-full"
		>
			<ul class="w-full flex flex-col gap-y-2">
				<li
					v-for="(player, index) in topPlayers"
					:class="itemClasses(player.id)"
				>
					<div class="flex items-center gap-x-4">
						<div class="text-white font-semibold">
							<img
								v-if="index < 4"
								:src="rankIcon(index + 1)"
								class="w-12 h-12"
							/>
							<div
								v-else
								class="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center"
								style="text-shadow: 0 0 5px black"
							>
								{{ index + 1 }}
							</div>
						</div>
						<div class="text-white font-semibold text-lg">
							{{ player.username }}
						</div>
					</div>
					<div class="text-yellow-400 text-lg font-semibold">
						{{ player.score }} 🍌
					</div>
				</li>
			</ul>
		</div>
	</div>
	<PopupAuthorize />
</template>

<script setup lang="ts">
import Top from '@/assets/icons/top.png';
import Top1 from '@/assets/icons/top1.png';
import Top2 from '@/assets/icons/top2.png';
import Top3 from '@/assets/icons/top3.png';
import useFirebase from '@/composable/useFirebase';
import { Player } from '@/types/firebase';
import { computed, onMounted, ref } from 'vue';
import PopupAuthorize from '@/components/PopupAuthorize.vue';
import { useUserStore } from '@/stores/useUserStore';

const userStore = useUserStore();
const { getTopPlayers } = useFirebase();

const topPlayers = ref<Player[] | null>(null);

const rankIcon = computed(() => {
	return (rank: number) => {
		if (rank === 1) {
			return Top1;
		} else if (rank === 2) {
			return Top2;
		} else if (rank === 3) {
			return Top3;
		} else {
			return Top;
		}
	};
});

const itemClasses = computed(() => {
	return (id: string) => {
		return [
			{ 'border border-yellow-400': userStore.user.id === id },
			'p-2 rounded-md border border-transparent flex items-center justify-between gap-x-4 bg-slate-600 hover:bg-slate-700',
		];
	};
});

onMounted(async () => {
	topPlayers.value = await getTopPlayers();
});
</script>
