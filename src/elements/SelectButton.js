import { UICollection } from './Collection.js';
import { UISelect } from './Select.js';
import { UIButton } from './Button.js';

export class UISelectButton extends UICollection {
	constructor(params) {
		super(params);
		
		const callback = params.callback;

		const select = this.append(new UISelect({
			options: params.options,
			callback: function() {
				// do nothing ? to prevent error 
			}
		}), 'select');

		const btn = this.append(new UIButton({
			text: "+",
			css: { 'margin-left': '1px' },
			callback: () => {
				callback(select.value);
			}
		}));

		if (params.btns) {
			params.btns.forEach(btn => {
				const b = new UIButton({
					text: btn.text,
					css: { 'margin-left': '1px' },
					callback: () => {
						btn.callback(select.value);
					}
				});
				this.append(b);
			});
		}
	}
}