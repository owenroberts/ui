import { UICollection, UISelect, UIButton } from '../oi.js';

export class UISelectButton extends UICollection {
	constructor(params) {
		super(params);
		
		const callback = params.callback;

		this.select = this.append(new UISelect({
			options: params.options,
			callback: () => {
				// do nothing ? to prevent error 
			}
		}));

		const btn = this.append(new UIButton({
			text: "+",
			css: { 'margin-left': '1px' },
			callback: () => {
				callback(this.select.value);
			}
		}));

		if (params.btns) {
			params.btns.forEach(btn => {
				const b = new UIButton({
					text: btn.text,
					css: { 'margin-left': '1px' },
					callback: () => {
						btn.callback(this.select.value);
					}
				});
				this.append(b);
			});
		}
	}
}