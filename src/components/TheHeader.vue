<template>
	<header
		id="header"
		class="w-full bg-slate-700 shadow-md rounded-b-md"
	>
		<div class="flex items-center justify-between gap-4 py-2 px-4">
			<div class="flex flex-col">
				<div class="flex items-center gap-2 text-orange-300 font-bold">
					<span>🍌</span>
					<CountUp
						:start-val="prevBananas"
						:end-val="storeUser.user.bananas"
						:duration="0.8"
					/>
				</div>
			</div>
			<div class="text-gray-200">
				<div v-if="storeUser.user.username">{{ storeUser.user.username }}</div>
				<div v-else>{{ UNKNOWN_NAME }}</div>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { UNKNOWN_NAME } from '@/constants';
import { useUserStore } from '@/stores/useUserStore';
import { ref, watch } from 'vue';
import CountUp from 'vue-countup-v3';

const storeUser = useUserStore();

const prevBananas = ref(storeUser.user.bananas);

watch(
	() => storeUser.user.bananas,
	(_, oldValue) => {
		prevBananas.value = oldValue;
	},
	{ deep: true }
);
</script>
