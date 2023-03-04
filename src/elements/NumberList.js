class UINumberList extends UIListAdd {
	constructor(params) {
		super(params);
		this.addClass('number-list');

		const add = new UIButton({
			text: '+',
			callback: () => {
				this.list.push(0);
				this.addItem(this.list.length - 1, 0);
				this.callback(this.list);
			}
		});

		this.append(add);
		this.addItems();
	}

	addItem(index, value) {
		const n = new UINumberStep({
			value: value,
			callback: value => {
				this.list[index] = +value;
				if (this.callback) this.callback(this.list);
			}
		});
		this.append(n, 'n' + index);
	}

}

UI.Elements.UINumberList = UINumberList;