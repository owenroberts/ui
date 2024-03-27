import { UIButton } from './Button.js';
import { UIText } from './Text.js';
import { UICollection } from './Collection.js';
import { ListMixins } from './Behaviors.js';

export class UIInputList extends UICollection {
	constructor(params) {
		super(params);
		this.addClass('input-list');
		Object.assign(this, ListMixins);
		this.setup(params) // creates list, ui
		this.addItems();
	}

	pushItem(value) {
		this.list.push(value);
		this.addItem(this.list.length - 1, value);
	}

	addItem(index, value) {
		const n = this.append(new UIText({
			value: value,
			callback: value => {
				this.list[index] = value;
				this.callback(this.list);
			}
		}),'n' + index);
	}
}