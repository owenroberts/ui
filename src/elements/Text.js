import { UIElement } from './Element.js';
import { setKey, setInput } from './Behaviors.js';

export function UIText(params={}) {
	const ui = UIElement({ ...params, tag: 'input' });
	const callback = params.callback;
	// const getSet = setInput(ui, params, update);
	
	function keyHandler(value) {
		update(prompt(ui.prompt)); // where does prompt come from??
	}

	function update(value, uiOnly) {
		ui.value = value; // always set value before callback
		if (!uiOnly) callback(value);
		
		// this.el.blur(); // keep going back and forth on this??
		// 11.27.2019 to prevent settings not saving when something focused
	}

	// const { onPress } = setKey(ui, params.key, params.label);
	return Object.assign(ui,
		setKey(ui, params.key, params.label),
		setInput(ui, params, update),
		{ update, }
	);
}