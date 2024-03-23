import { UIElement } from './Element.js';
import { addDrag, setInput } from './Behaviors.js';

export function UIDrag(params={}) {
	const ui = UIElement({ ... params, tag: 'input' });
	ui.addClass('drag');
	// ui.el.type = 'text';
	// if (params.value !== undefined) update(params.value);
	
	// add imput .... 
	
	addDrag(ui, params, value => {
		params.onDrag(value);
	});

	function update(value) {
		ui.el.placeholder =value;
		ui.el.value = '';
	}

	const { get, set } = setInput(ui, params, update);
	
	return Object.assign(ui, { get, set, update });
}