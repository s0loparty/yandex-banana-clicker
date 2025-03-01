<template>
	<div class="grow overflow-x-scroll p-2 w-full">
		<div
			v-if="!lbStore.entries?.length"
			class="flex items-center justify-center mt-4 p-4 text-center bg-gray-700 rounded-md text-red-400"
		>
			Топ игроков временно недоступен
		</div>
		<div
			v-else
			class="w-full"
		>
			<ul class="w-full flex flex-col gap-y-2">
				<li
					v-for="(entry, index) in lbStore.entries"
					:class="itemClasses(entry.player.uniqueID)"
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
							{{
								entry.player.scopePermissions.public_name === 'not_set'
									? UNKNOWN_NAME
									: entry.player.publicName
							}}
						</div>
					</div>
					<div class="text-yellow-400 text-lg font-semibold">
						{{ entry.score }} 🍌
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
import { computed, watchEffect } from 'vue';
import PopupAuthorize from '@/components/PopupAuthorize.vue';
import { useUserStore } from '@/stores/useUserStore';
import { useLeaderboardStore } from '@/stores/useLeaderboardStore';
import { UNKNOWN_NAME } from '@/constants';

const userStore = useUserStore();
const lbStore = useLeaderboardStore();

watchEffect(() => {
	console.log('entries', lbStore.entries);
});

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
</script>
