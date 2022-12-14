class UISection extends UICollection {
	constructor(params) {
		super(params);
		this.addClass('ui-section');

		// id necessary ??
		this.panels = new UICollection({ id: params.id + '-panels', class: 'panels' });
		this.panels.append(new UIElement({ class: 'break' })); // break between panels

		const header = new UICollection({ id: params.id + '-header', class: 'section-header' });

		this.selector = new UISelectButton({ 
			class: 'selector',
			callback: value => {
				params.addPanelToSection(value, this, params.gridArea);
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

		this._isVisible = true;

		const scaleCollection = new UICollection({ 'class': 'scale-collection' });
		header.append(scaleCollection);
		scaleCollection.append(new UILabel({ text: 'Scale' }));
		this.baseFontSize = new UINumberStep({
			value: 11,
			min: 10,
			max: 40,
			callback: value => {
				this.panels.setProp('--ui-scale', +value);
			}
		});
		scaleCollection.append(this.baseFontSize);
	}

	addSelectorOptions(panelList) {
		panelList.forEach(p => {
			const [option, label] = p;
			this.selector.select.addOption(option, label);
		});
	}

	addSelectorOption(key, label) {
		this.selector.select.addOption(key, label);
	}

	get isVisible() {
		return this._isVisible;
	}

	set isVisible(value) {
		this._isVisible = value;
		if (!value) this.addClass('hidden');
		else this.removeClass('hidden');
	}

	get settings() {
		return {
			maxWidthToggle: this.maxWidthToggle.value,
			maxWidth: this.maxWidth.value,
			isVisible: this.isVisible,
			baseFontSize: this.baseFontSize.value,
		}
	}
}

UI.Elements.UISection = UISection;