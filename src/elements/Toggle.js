import { UIElement } from './Element.js';
import { KeyMixins } from './Behaviors.js';

export class UIToggle extends UIElement {
	constructor(params) {
		super({ ...params, tag: 'button' });
		this.addClass('btn');
		this.addClass('toggle');

		this.callback = params.callback;
		this.onText = params.onText ?? params.text;
		this.offText = params.offText ?? params.text;
		this.isOn = params.isOn ?? params.value ?? false;
		if (this.isOn) this.on();

		// why super??
		super.text = this.isOn ? this.onText : this.offText;

		this.el.addEventListener('click', () => {
			this.keyHandler();
		});

		if (params.key) {
			Object.assign(this, KeyMixins);
			this.setKey(params.key, this.text);
		}
	}

	update(isOn, uiOnly) {
		if (isOn !== this.isOn) {
			if (this.isOn === undefined) this.isOn = isOn;
			if (!uiOnly) this.callback(isOn);
			this.set(isOn);
		}
	}

	keyHandler() {
		// key press/click is a toggle
		this.set(!this.isOn);
		this.callback(this.isOn);
	}

	set(isOn) {
		this.isOn = isOn;
		if (isOn) this.on();
		else this.off();
	}

	toggle() {
		this.isOn = !this.isOn;
		if (this.isOn) this.on();
		else this.off();
	}

	on() {
		this.text = this.onText;
		this.addClass('on');
	}

	off() {
		this.text = this.offText;
		this.removeClass('on');
	}

	get value() {
		return this.isOn;
	}

	set value(value) {
		this.set(value);
	}
}