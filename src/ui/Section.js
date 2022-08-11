class UISection extends UICollection {
	constructor(params, ui) {
		super(params);
		this.addClass('ui-section');

		// id necessary ??
		this.panels = new UICollection({ id: params.id + '-panels', class: 'panels' });
		this.panels.append(new UIElement({ class: 'break' })); // break between panels

		const header = new UICollection({ class: 'section-header' });

		this.selector = new UISelectButton({ 
			class: 'selector',
			callback: value => {
				const panel = ui.panels[value];
				this.panels.append(panel);
				panel.gridArea = params.gridArea;
				panel.dock();
			}
		});
		header.append(this.selector);
		this.append(header);
		this.append(this.panels);

		const widthCollection = new UICollection({ class: 'width-collection' });
		header.append(widthCollection);
		widthCollection.append(new UILabel({ text: 'Width' }));
		this.maxWidth = new UINumber({
			value: 500,
			callback: value => {
				this.setProp('--max-width', value);
			}
		});
		widthCollection.append(this.maxWidth);
		this.maxWidthToggle = new UIToggleCheck({
			callback: value => {
				if (value) this.addClass('max-width');
				else this.removeClass('max-width');
			}
		});
		widthCollection.append(this.maxWidthToggle);
	}

	addSelectorOptions(panelList) {
		panelList.forEach(p => {
			const [option, label] = p;
			this.selector.select.addOption(option, false, label);
		});
	}

	get settings() {
		return {
			maxWidthToggle: this.maxWidthToggle.value,
			maxWidth: this.maxWidth.value
		}
	}
}