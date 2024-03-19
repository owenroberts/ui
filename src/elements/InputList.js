import { UIButton } from './Button.js';
import { UIText } from './Text.js';
import { UIListAdd } from './ListAdd.js';

export class UIInputList extends UIListAdd {
	constructor(params) {
		super(params);
		this.addClass('input-list');

		const add = new UIButton({
			text: '+',
			callback: () => {
				this.list.push('');
				this.addItem(this.list.length - 1, 0);
				this.callback(this.list);
			}
		});

		this.append(add);
		this.addItems();
	}

	pushItem(value) {
		this.list.push(value);
		this.addItem(this.list.length - 1, value);
	}

	addItem(index, value) {
		const n = new UIText({
			value: value,
			callback: value => {
				this.list[index] = value;
				if (this.callback) this.callback(this.list);
			}
		});
		this.append(n, 'n' + index);
	}
}