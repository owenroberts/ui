import { UICollection } from './Collection.js';
import { UIButton } from './Button.js';

export class UIListAdd extends UICollection {
	constructor(params) {
		super(params);
		this.list = [...params.list];
		if (params.callback) this.callback = params.callback;

		const remove = new UIButton({
			text: 'X',
			class: 'left-end',
			callback: () => {
				if (this.list.length > 0) {
					this.removeK('n' + (this.list.length - 1));
					this.list.pop();
				}
				this.callback(this.list);
			}
		});

		this.append(remove);

		
	}

	addItems() {
		for (let i = 0; i < this.list.length; i++) {
			this.addItem(i, this.list[i]);
		}
	}

	set(list) {
		for (let i = this.list.length - 1; i >= 0; i--) {
			this.removeK('n' + i);
		}

		this.list = list;

		for (let i = 0; i < this.list.length; i++) {
			this.addItem(i, this.list[i]);
		}
	}
}