class UISelectButton extends UICollection {
	constructor(params) {
		super(params);
		if (params.callback) this.callback = params.callback;
		this.addClass('ui-collection');


		const select = new UISelect({
			options: params.options,
			callback: function() {
				// do nothing ? to prevent error 
			}
		});

		const btn = new UIButton({
			text: "+",
			css: { 'margin-left': '1px' },
			callback: () => {
				if (this.callback) this.callback(select.value);
			}
		});

		this.append(select, 'select');
		this.append(btn);

		if (params.btns) {
			params.btns.forEach(btn => {
				const b = new UIButton({
					text: btn.text,
					css: { 'margin-left': '1px' },
					callback: () => {
						btn.callback(select.value);
					}
				});
				this.append(b);
			});
		}

	}
}