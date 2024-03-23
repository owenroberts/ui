import { UICollection } from './Collection.js';
import { setCallback } from './Behaviors.js';
import { UIDrag } from './Drag.js';
import { UILabel } from './Label.js';

export function UIChance(params={}) {
	const ui = UICollection(params);
	ui.addClass('value-bg');

	const value = params.value;
	const min = params.min ?? 0;
	const max = params.max ?? 1;
	const step = params.step ?? 0.01;
	const total = max - min;
	
	// is add callback more of an event thing ?? 
	const { callback } = setCallback(ui, params);

	function update(val, uiOnly) {
		if (val < min) val = min;
		if (val > max) val = max;
		value = +val.toFixed(3);
		drag.set(value);
		updateStyle();
		if (uiOnly) return;
		callback(value);
	}

	function updateStyle() {
		const pct = Math.round((value - min) / total * 100);
		ui.setProp('--value-percent', pct);
	}

	const drag = new UIDrag({
		value: value,
		onDrag: change => { update(value + step * change); },
		callback: value => { update(+value); }
	});

	ui.add(new UILabel({ text: params.label }));
	ui.add(drag);
	updateStyle();

	return Object.assign(ui, { update });
}