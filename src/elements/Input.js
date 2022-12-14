class UIInput extends UIElement {
	constructor(params) {
		params.tag = "input";
		super(params);
		this.callback = params.callback;
		this.args = params.args || [];
		if (params.key) this.setKey(params.key, params.label);
		if (params.value) this.value = params.value;
	}
}

UI.Elements.UIInput = UIInput;