class UIToggle extends UIButton {
	constructor(params) {
		super(params);
		this.onText = params.onText || params.text;
		this.offText = params.offText || params.text;
		this.isOn = params.isOn || params.value || false;
		// if (params.isOn) this.toggle();
		super.text = this.isOn ? this.onText : this.offText;
		this.addClass('toggle');
	}

	update(isOn, uiOnly) {
		if (isOn !== this.isOn) {
			if (this.isOn === undefined) this.isOn = isOn;
			if (!uiOnly) this.callback(isOn);
			this.set(isOn);
		}
	}

	keyHandler() {
		this.set(!this.isOn);
		this.callback(this.value);
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
}

UI.Elements.UIToggle = UIToggle;