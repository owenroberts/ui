import { UIElement } from './Element.js';
import { UIButton } from './Button.js';
import { UICollection } from './Collection.js';
import { setKey, setCallback } from './Behaviors.js';

export function UIColor(params={}) {
	const ui = UIElement({ ...params, tag: 'input' });
	ui.setType("color");

	const { callback } = setCallback(ui, params);
	const colors = [];
	const palette = new UICollection();
	let current;

	ui.el.addEventListener('input', ev => {
		setColor(ev.target.value);
	});

	ui.el.addEventListener('focus', ev => {
		addColor(current);
	});

	function addColor(color) {
		if (!colors) return; // called by value update before it exists
		if (!colors.includes(color) && color) {
			colors.push(color);
			const btn = new UIButton({
				text: color,
				css: { "background": color },
				value: color,
				callback: () => { update(color); }
			});
			palette.add(btn);
		}
	}

	/* to set color without constantly updating "current" */
	function setColor(value) {
		current = value;
		callback(value);
	}

	function update(value, uiOnly) {
		if (!uiOnly) setColor(value);
		ui.el.value = value; // actual use of el value
	}	

	const { onPress } = setKey(ui, params.key, params.label);
	return Object.assign(ui, {
		onPress,
		update,
		set(val) {
			addColor(val);
			current = val;
		},
		getHTML() { return [ui.el, palette.el]; },
	});
}