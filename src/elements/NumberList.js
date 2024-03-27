import { UICollection } from './Collection.js';
import { ListMixins } from './Behaviors.js';
import { UIButton } from './Button.js';
import { UINumberStep } from './NumberStep.js';

export class UINumberList extends UICollection {
	constructor(params) {
		super(params);
		this.addClass('number-list');
		Object.assign(this, ListMixins);
		this.setup(params) // creates list, ui
		this.addItems();
	}

	addItem(index, value) {
		const n = this.append(new UINumberStep({
			value: value,
			callback: value => {
				this.list[index] = +value;
				this.callback(this.list);
			}
		}), 'n' + index);
	}
}