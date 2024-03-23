import { UICollection } from './Collection.js';
import { UISelect } from './Select.js';
import { UIButton } from './Button.js';

export function UISelectButton(params={}) {
	const ui = UICollection(params);
	const callback = params.callback;

	const select = ui.append(new UISelect({
		options: params.options,
		callback: function() {
			// do nothing ? to prevent error 
		}
	}), 'select');

	const btn = ui.append(new UIButton({
		text: "+",
		css: { 'margin-left': '1px' },
		callback: () => {
			callback(select.get());
		}
	}));

	if (params.btns) {
		params.btns.forEach(btn => {
			const b = ui.append(new UIButton({
				text: btn.text,
				css: { 'margin-left': '1px' },
				callback: () => {
					btn.callback(select.get());
				}
			}));
		});
	}

	return Object.assign(ui, {
		addOption(value, label) { select.addOption(value, label)},
		
	})
}