class UIPanel extends UICollection {
	constructor(params) {
		super({ id: `${params.id}-panel` });
		this.id = params.id;
		this.isPanel = true;
		this.addClass("panel");
		this.addClass("undocked");
		this.gridArea = 'default';
		
		this.rows = [];

		this.header = new UIRow();
		this.header.addClass('header');
		this.append(this.header);

		this.open = new UIToggle({
			onText: "－",
			offText: "＋",
			class: "toggle",
			isOn: true, // default open
			callback: isOn => {
				if (!isOn) this.addClass('closed');
				else this.removeClass('closed');
			}
		});
		this.header.append(this.open);

		this.header.append(new UILabel({ text: params.label }));

		this.header.append(new UIButton({
			text: 'X',
			class: 'undock-btn',
			callback: this.undock.bind(this)
		}));

		this.orderBtn = new UIButton({
			text: this.order || "0",
			class: "order-btn",
			callback: () => {
				this.order = +this.el.style.order + 1;
				this.orderBtn.text = this.order;
			}
		});
		this.header.append(this.orderBtn);

		this.header.append(new UIButton({
			text: "[]",
			class: "block-btn",
			callback: () =>  {
				if (this.el.classList.contains('block')) 
					this.el.classList.remove('block');
				else 
					this.el.classList.add('block');
			}	
		}));

		this.header.append(new UIButton({
			text: "<",
			class: "headless-btn",
			callback: () => {
				if (this.el.classList.contains('headless')) 
					this.el.classList.remove('headless');
				else 
					this.el.classList.add('headless');
			}
		}));
	}

	set order(n) {
		this.orderBtn.text = n || "0";
		this.el.style.order = n;
	}

	get order() {
		return this.el.style.order;
	}

	get isDocked() {
		return !this.el.classList.contains('undocked');
	}

	get isBlock() {
		return this.el.classList.contains('block');
	}

	get isHeadless() {
		return this.el.classList.contains('headless');
	}

	get isOpen() {
		return this.open.value;
	}

	get settings() {
		return {
			open: this.isOpen,
			docked: this.isDocked,
			order: this.order,
			block: this.isBlock,
			headless: this.isHeadless,
			gridArea: this.gridArea,
		};
	}

	get lastRow() {
		if (this.rows.length === 0) return this.addRow();
		return this.rows[this.rows.length - 1];
	}

	close() {
		this.addClass('closed');
		this.open.set(false);
	}

	block() {
		this.el.classList.add('block');
	}

	headless() {
		this.el.classList.add('headless');
	}

	dock() {
		this.removeClass('undocked');
	}

	undock() {
		this.addClass('undocked');
	}

	addRow(k, className) {
		const row = new UIRow({ id: k, class: className,  });
		this.append(row, k);
		this.rows.push(row);
		return row;
	}

	removeRow(row) {
		const index = this.rows.indexOf(row);
		this.rows.splice(index, 1);
		this.remove(row);
	}

	add(ui, k, _row) { // flip row and k?
		// if (ui.prompt == "Go To Frame") console.log(ui)
		let row = _row 
			|| this.rows[this.rows.length - 1]
			|| this.addRow();
		row.append(ui, k);
		return ui;
	}

	setup(settings) {
		if (settings.docked) this.dock();
		else this.undock();
		
		if (!settings.open) this.close();
		
		if (settings.block) this.block();
		if (settings.headless) this.headless();
		
		this.order = settings.order;
		this.gridArea = settings.gridArea;
	}
}

UI.Elements.UIPanel = UIPanel;