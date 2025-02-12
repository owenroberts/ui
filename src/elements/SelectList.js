import { UICollection } from './Collection.js';
import { ListMixins } from './Behaviors.js';
import { UISelect } from './Select.js';

export class UISelectList extends UICollection {
	constructor(params) {
		super(params);
		this.options = params.options;
		this.addClass('select-list');
		Object.assign(this, ListMixins);
		this.setup(params) // creates list, ui
		this.addItems();
	}

	addItem(index, value) {
		const n = this.append(new UISelect({
			value: value,
			options: this.options,
			callback: value => {
				this.list[index] = value;
				this.callback(this.list);
			}
		}), 'n' + index);
	}
}