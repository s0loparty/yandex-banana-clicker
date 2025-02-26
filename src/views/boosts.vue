<template>
	<div class="grow overflow-x-scroll">
		<div class="grid grid-cols-1 gap-2 p-2">
			<div
				v-for="(boost, idx) in BOOSTS"
				:key="boost.label"
				:class="boostItemClasses(boost)"
				:style="`--tw-animate-delay: 5${idx}0ms`"
			>
				<div>
					<div :style="{ color: boost.color }">
						{{ boost.label }} {{ boost.icon }}
					</div>
					<div class="text-yellow-400">Цена {{ boost.price }} 🍌</div>
					<div class="text-white/80">
						Дополнительные бананы ⚡️ {{ boost.bananas }}
					</div>
					<div class="text-[12px] text-gray-400">
						{{ boost.description }}
					</div>
				</div>
				<div
					v-if="!isBoostPayed(boost)"
					class="relative"
				>
					<CirclePing v-show="bananas >= boost.price" />
					<button
						:class="[
							'px-4 py-1 rounded text-black',
							bananas < boost.price ? 'bg-slate-700' : 'bg-yellow-300',
						]"
						:disabled="bananas < boost.price"
						@click="handlePayBoost(boost)"
					>
						получить
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/useUserStore';
import usePayBoost from '@/composable/usePayBoost';
import useConfetti from '@/composable/useConfetti';
import useAdvStore from '@/stores/useAdvStore';
import CirclePing from '@/components/ui/CirclePing.vue';
import { BOOSTS } from '@/constants';

const storeUser = useUserStore();

const { handlePay, isBoostPayed } = usePayBoost();
const { bananasEffect } = useConfetti();

const { showFullscreenAdv } = useAdvStore();

const bananas = computed(() => storeUser.user.bananas);

const handlePayBoost = (boost: IBoostStore) => {
	handlePay(boost);
	bananasEffect();
};

const boostItemClasses = computed(() => {
	return (boost: IBoostStore) => {
		return [
			{ 'opacity-50 pointer-events-none': isBoostPayed(boost) },
			'rounded shadow-md text-sm bg-slate-600 flex items-center justify-between gap-2 px-2 py-1',
		];
	};
});

onMounted(showFullscreenAdv);
</script>
