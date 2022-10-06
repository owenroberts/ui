class UINumberList extends UICollection {
	constructor(params) {
		super(params);
		this.addClass('number-list');
		this.list = [...params.list];
		if (params.callback) this.callback = params.callback;

		const add = new UIButton({
			text: '+',
			callback: () => {
				this.addNumber(this.list.length, 0);
			}
		});

		const remove = new UIButton({
			text: 'X',
			callback: () => {
				this.list.pop();
				this.removeK('n' + this.list.length);
			}
		});
		
		this.append(remove);
		this.append(add);

		for (let i = 0; i < this.list.length; i++) {
			this.addNumber(i, this.list[i]);
		}

	}

	addNumber(index, value) {
		const n = new UINumber({
			value: value,
			callback: value => {
				this.list[index] = +value;
				if (this.callback) this.callback(this.list);
			}
		});
		this.append(n, 'n' + index);
	}

}