import { UICollection } from './Collection.js';
import { UIDrag } from './Drag.js';
import { UIButton } from './Button.js';

export function UIListStep(params={}) {
	const ui = UICollection(params);
	ui.addClass('list-step');
	ui.addClass('ui-collection');

	const callback = params.callback;
	const list = params.list ?? [];
	let index = params.value !== undefined ? 
		params.list.indexOf(params.value) : 0;

	const textInput = new UIDrag({
		value: params.value,
		class: 'left-end',
		onDrag: value => {
			if (index + value >= 0 && index + value < list.length) {
				index += value;
			}
			update(list[index]);
		},
		callback: value => {
			update(value); // handle mis types on app end
		}
	});

	const stepDown = new UIButton({
		text: '▼',
		class: 'middle',
		callback: () => {
			if (index > 0) index -= 1;
			update(list[index]);
		}
	});

	const stepUp = new UIButton({
		text: '▲',
		class: 'right-end',
		callback: () => {
			if (index < list.length - 1) index += 1;
			update(list[index]);
		}
	});

	ui.add(textInput);
	ui.add(stepDown);
	ui.add(stepUp);

	function update(value, uiOnly) {
		if (!list.includes(value)) return;
		textInput.el.placeholder = value; // always set value before callback
		if (!uiOnly && callback) {
			if (params.args) callback(value, ...params.args);
			else callback(value);
		}
	}

	return Object.assign(ui, { 
		update,
		get value() { return textInput.el.placeholder; }, // this is weird ... 
		set value(value) {
			if (!list.includes(value)) return;
			index = list.indexOf(value);
			textInput.value = value;
		}
	});
}