import { assert } from '../../../cool/cool.js';

import { UICollection } from './Collection.js';
import { UIInput } from './Input.js';
import { UIInputStep } from './InputStep.js';
import { UINumberStep } from './NumberStep.js';
import { UISelect } from './Select.js';
import { UIButton } from './Button.js';
import { UITree } from './Tree.js';

export class UIList extends UICollection {
	
	constructor(params) {
		super(params);

		// clone? maybe change if doing pass by ref later
		this.list = [...params.list];
		this.options = params.options ?? []; // maybe better default
		this.itemClass = params.itemClass ?? UIInput;
		if (params.class) this.addClass(params.class);
		this.callback = params.callback;

		// add or append ??
		this.append(new UIButton({
			text: 'x',
			class: 'left-end',
			callback: () => {
				this.set([]);
				this.callback(this.list);
			}
		}));

		this.append(new UIButton({
			text: '*',
			class: 'middle',
			callback: () => {
				if (this.options.length === 0) return;
				this.set([...this.options]);
				this.callback(this.list);
			}
		}));

		this.append(new UIButton({
			text: '-',
			class: 'middle',
			callback: () => {
				if (this.list.length > 0) {
					this.tree.pop();
					this.list.pop();
				}
				this.callback(this.list);
			}
		}));

		this.append(new UIButton({
			text: '+',
			class: 'right-end',
			callback: () => {
				this.addItem(this.options?.[0] ?? 0);
				this.callback(this.list);
			}
		}));

		this.addBreak();
		this.tree = this.add(new UITree({ title: "Items", isOpen: true }));

		this.addItemUIs();
	}

	set(list) {
		assert(Array.isArray(list), `set requires array, got ${list}, ${typeof list}`);

		this.tree.clear();
		this.list = list;

		for (let i = 0; i < this.list.length; i++) {
			this.addItemUI(i, this.list[i]);
		}
	}

	addItem(value) {
		this.list.push(value);
		this.addItemUI(this.list.length - 1, value);
		this.callback(this.list);
	}

	addItemUI(index, value) {
		this.tree.add(new this.itemClass({
			value: value,
			options: this.options,
			callback: value => {
				this.list[index] = value;
				this.callback(this.list);
			}
		}), 'n' + index );
	}

	addItemUIs() {
		for (let i = 0; i < this.list.length; i++) {
			this.addItemUI(i, this.list[i]);
		}
	}
}