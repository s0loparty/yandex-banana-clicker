export default function isMobileLandscape(): boolean {
	const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
	const isLandscape = window.matchMedia('(orientation: landscape)').matches;
	return isMobile && isLandscape;
}
