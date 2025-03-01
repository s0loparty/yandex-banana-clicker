<template>
	<footer class="w-full bg-slate-700 rounded-t-md">
		<div class="p-4 items-center gap-4 flex flex-wrap justify-center">
			<FooterLinkItem path="/"> 🍌 ИГРАТЬ </FooterLinkItem>
			<FooterLinkItem
				path="/boosts"
				class="relative"
			>
				<CirclePing v-if="canBuyBoost" />
				🔥 БУСТЫ
			</FooterLinkItem>
			<FooterLinkItem
				path="/backgrounds"
				class="relative"
			>
				<CirclePing v-if="canBuyBackground" />
				🌈 ФОНЫ
			</FooterLinkItem>
			<FooterLinkItem path="/top"> ⭐ ТОП </FooterLinkItem>

			<ButtonSoundEffects />
		</div>
	</footer>
</template>

<script setup lang="ts">
import ButtonSoundEffects from '@/components/ui/ButtonSoundEffects.vue';
import CirclePing from './ui/CirclePing.vue';
import usePayBackground from '@/composable/usePayBackground';
import usePayBoost from '@/composable/usePayBoost';
import FooterLinkItem from './FooterLinkItem.vue';

const { canBuyBoost } = usePayBoost();
const { canBuyBackground } = usePayBackground();
</script>
