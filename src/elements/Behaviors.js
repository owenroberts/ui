/*
	ui mixins ... 
	need to be things that aren't in base types (element, collection) but are in different inheritence trees
*/

import { UIButton } from './Button.js';

const KeyMixins = {
	setKey(key, title) {
		// console.log('set key this', this);
		this.title = `${ title ? title : '' } ~ ${ key }`;
		this.el.addEventListener('mouseenter', () => { this.onPress(false); });
		this.el.addEventListener('mouseleave', () => { this.onRelease(); });
	},
	onPress(triggerRelease) {
		this.addClass('triggered');
		
		if (window.ToolTip) {
			window.ToolTip.text = `${ this.title }`;
			window.ToolTip.addClass('visible');
		}
		
		if (triggerRelease === true) {
			setTimeout(() => { this.onRelease() }, 400);
		}
	},
	onRelease() {
		this.removeClass('triggered');
		if (window.ToolTip) {
			window.ToolTip.removeClass('visible');
		}
	}
};

const NumberMixins = {
	formatNumberInput(value) {
		if (typeof value === 'string') {
			if (value.match(/\D/)) {
				try {
					value = eval(value);
				} catch(e) {
					alert("Please enter a numerical value or mathematical expression.");
					return;
				}
			}
		}
		return value;
	}
};

const ListMixins = {
	setup(params) {
		
		this.list = [...params.list];
		this.callback = params.callback;
		
		const remove = this.append(new UIButton({
			text: 'X',
			class: 'left-end',
			callback: () => {
				if (this.list.length > 0) {
					this.removeK('n' + (this.list.length - 1));
					this.list.pop();
				}
				this.callback(this.list);
			}
		}));

		const add = this.append(new UIButton({
			text: '+',
			callback: () => {
				this.list.push('');
				this.addItem(this.list.length - 1, 0);
				this.callback(this.list);
			}
		}));
	},
	addItems() {
		for (let i = 0; i < this.list.length; i++) {
			this.addItem(i, this.list[i]);
		}
	},
	set(list) {
		for (let i = this.list.length - 1; i >= 0; i--) {
			this.removeK('n' + i);
		}

		this.list = list;

		for (let i = 0; i < this.list.length; i++) {
			this.addItem(i, this.list[i]);
		}
	}
};

export { KeyMixins, NumberMixins, ListMixins };