import { UIElement } from './Element.js';
import { setKey, addCallback } from './Behaviors.js';

export function UIDragButton(params={}) {
	params.tag = "button";
	const ui = UIElement(params);
	ui.addClass(params.btnClass ?? 'btn');
	ui.text = ui.el.textConent ?? params.text ?? params.onText;

	const { callback } = addCallback(ui, params, 'click');
	const { onPress } = setKey(ui, params.key, ui.text);

	let x = 0, y = 0;
	let dragging = false;

	ui.el.addEventListener('mousemove', ev => {
		if (x) dragging = true;
	});

	ui.el.addEventListener('mousedown', ev => {
		x = ev.pageX;
	});

	// this is all fucked ...
	// i don't think i use this anymore ... 
	document.addEventListener('mouseup', ev => {
		if (dragging) {
			const delta = ev.pageX - x;
			if (Math.abs(delta) > 10) {
				callback(
					delta > 0 ? 1 : -1, 
					Math.abs(Math.ceil(delta / lns.timeline.frameWidth))
				);
			}
		}
		this.dragging = false;
		this.down.x = 0;
	});

	return Object.assign(ui, {
		keyHandler() { callback() },
		callback,
		onPress,
	});
}

