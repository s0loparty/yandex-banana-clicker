export default function () {
	window.addEventListener(
		'contextmenu',
		(e) => {
			e.preventDefault();
		},
		false
	);
}
