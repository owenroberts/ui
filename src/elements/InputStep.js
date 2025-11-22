import { UICollection } from './Collection.js';
import { UIDrag } from './Drag.js';
import { UIButton } from './Button.js';

export class UIInputStep extends UICollection {
	constructor(params) {
		super(params);
		this.addClass('input-step');

		this.obj = params.obj;
		this.ref = params.ref;
		this.options = params.options ?? [];
		this.index = params.options.indexOf(this.obj[this.ref]); 
		this.callback = params.callback;

		this.textInput = this.add(new UIDrag({
			value: this.options[this.index],
			class: 'left-end',
			onDrag: value => {
				if (this.index + value < 0) return;
				if (this.index + value > this.options.length) return;
				this.index += value;
				this.update();
			},
			callback: value => {
				this.update();
				// this.update(this.value); // handle mis types on app end
			}
		}));

		this.add(this.textInput);

		this.add(new UIButton({
			text: '▼',
			class: 'middle',
			callback: () => {
				if (this.index === 0) return; 
				this.index -= 1;
				this.update();
			}
		}));

		this.add(new UIButton({
			text: '▲',
			class: 'right-end',
			callback: () => {
				if (this.index === this.options.length - 1) return; 
				this.index += 1;
				this.update();
			}
		}));
	}

	update() {
		this.obj[this.ref] = this.options[this.index];
		this.textInput.value = this.options[this.index];
	}
}