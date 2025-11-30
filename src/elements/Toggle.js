import { assert } from '../../../cool/cool.js';
import { UIElement } from './Element.js';

export class UIToggle extends UIElement {
	constructor(params) {
		super({ ...params, tag: 'button' });
		this.addClass(params.btnClass ?? "btn"); /* for diff types of button */
		this.addClass('toggle');

		this.obj = params.obj;
		this.ref = params.ref;
		this.callback = params.callback;
		this.onText = params.onText ?? params.text;
		this.offText = params.offText ?? params.text;
		this.value = params.value ?? false;

		this.display();
		this.el.addEventListener('click', () => {
			this.toggle();
		});
	}

	update(value, uiOnly) {
		assert(typeof value === "boolean", `UIToggle expects boolean value, got ${value}`);
		this.value = value ?? this.value;
		if (this.callback) this.callback(this.value);
		if (this.obj && this.ref) this.obj[this.ref] = this.value;
		this.display();
	}

	keyHandler() {
		this.toggle();
	}

	display() {
		if (this.value) {
			this.text = this.onText;
			this.addClass('on');
		} else {
			this.text = this.offText;
			this.removeClass('on');
		}
	}
	
	toggle() {
		this.update(!this.value);
	}
}