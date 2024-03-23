import { UIElement } from './Element.js';
import { setKey, setInput } from './Behaviors.js';

export function UIRange(params={}) {
	const ui = UIElement({ ...params, tag: 'input' });
	const callback = params.callback;
	const { get, set } = setInput(ui, { ...params, type: 'range' }, update);

	const [min, max] = params.range ? 
		[...params.range] : 
		[params.min, params.max];
	setRange(min, max);

	function setRange(min, max) {
		ui.el.min = min;
		ui.el.max = max;	
	}

	function update(value) {
		ui.el.value = value;
		ui.el.blur();
		callback(value);
	}

	function setStep(step) {
		ui.el.step = step;
	}

	const { onPress } = setKey(ui, params.key, ui.getText());
	return Object.assign(ui, {
		get,
		set,
		update,
		setRange,
		setStep,
		onPress,
		keyHandler(value) { update(+prompt(params.prompt)); }
	});
}