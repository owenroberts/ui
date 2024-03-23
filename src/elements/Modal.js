import { UICollection } from './Collection.js';
import { UIElement } from './Element.js';
import { UIButton } from './Button.js';
import { UILabel } from './Label.js';

export function UIModal(params={}) {
	const ui = UICollection(params);
	ui.addClass('modal');
	const callback = params.callback;
	if (params.class) ui.addClass(params.class);
	ui.add(new UILabel({ text: params.title }));

	// better way to do this ?? 
	document.getElementById('container').appendChild(ui.el);

	const titleBreak = ui.add(new UIElement({ class: 'break' }));

	const submit = ui.add(new UIButton({
		text: "Submit",
		callback: function() {
			if (params.callback) params.callback();
			clear();
		}
	}));
	params.app.ui.keys['enter'] = submit;

	const cancel = ui.add(new UIButton({
		text: "x",
		callback: ev => {
			clear();
			if (params.onClear) params.onClear(); // used ???
		}
	}));
	params.app.ui.keys['escape'] = cancel;

	ui.add(new UIElement({ class: "break" }));

	let x = Math.max(16, params.position.x - 100);
	let y = Math.max(16, params.position.y - 20);

	ui.setProp('left', `${x}px`);
	ui.setProp('top', `${y}px`);

	function adjustPosition() {
		let x = parseInt(ui.el.style.left);
		let y = parseInt(ui.el.style.top);
		let w = parseInt(ui.el.clientWidth);
		let h = parseInt(ui.el.clientHeight);

		if (x + w > window.innerWidth) {
			ui.el.style.left = `${window.innerWidth - w - 20}px`;
		}

		if (y + h > window.innerHeight) {
			ui.el.style.top = `${window.innerHeight - h - 20}px`;
		}
	}

	function add(component) {
		if (Array.isArray(component.html)) {
			component.html.forEach(el => {
				ui.el.insertBefore(el, titleBreak.el);
			});
		} else {
			ui.el.insertBefore(component.el, titleBreak.el);
		}
		adjustPosition();
	}

	function addBreak(label) {
		ui.add(new UIElement({ class: "break" }));
		if (label) addLabel(label);
		adjustPosition();
	}

	function addLabel(labelText) {
		ui.add(new UILabel({ text: labelText }));
		adjustPosition();
	}

	function clear() {
		ui.el.remove();
	}

	return Object.assign(ui, { clear, add, addBreak, addLabel });
}