import { UICollection } from './Collection.js';
import { UIDrag } from './Drag.js';
import { UIButton } from './Button.js';
import { setCallback } from './Behaviors.js';

export function UINumberStep(params={}) {
	const ui = UICollection();
	ui.addClass('number-step');

	const { callback } = setCallback(ui, params);

	const step = +(params.step ?? 1);

	const min = params.range ? 
		+params.range[0] :
		+(params.min ?? 0);
	const max = params.range ? 
		+params.range[1] :
		+(params.max ?? 1000);

	const numberInput = new UIDrag({
		...params,
		class: 'middle',
		onDrag: val => { update(value + step * val); },
		callback: val => {
			// not DRY repeated in Number.js
			if (typeof val === 'string') {
				if (val.match(/\D/)) {
					try {
						val = eval(val);
					} catch(e) {
						alert("Please enter a numerical value or mathematical expression.");
						return;
					}
				}
			}
			update(+val);
		}
	});

	ui.add(new UIButton({
		text: '◀',
		class: 'left-end',
		callback: () => {
			update(+numberInput.get() - step);
		}
	}));

	ui.add(numberInput);

	ui.add(new UIButton({
		text: '▶',
		class: 'right-end',
		callback: () => {
			update(+numberInput.get() + step);
		}
	}));


	function update(value, uiOnly) {
		// DRY??
		if (value === undefined) value = prompt(params.prompt);
		if (value === undefined || value === null || value === '') {
			console.trace();
			return alert('No value entered.');
			// still need this? is this debug?
		} else {
			value = +value;
		}

		if (value < min) value = min;
		if (value > max) value = max;
		numberInput.set(value);
		if (!uiOnly) callback(value);
	}

	return Object.assign(ui, {
		update,
		keyHandler(val) { update(+prompt(params.prompt)); },
		getHTML() { return ui.el },
		get() { return numberInput.get() },
		set(val) { numberInput.set(val); },
		get value() { return numberInput.get(); },
		set value(val) { numberInput.set(val); }.
	});
}