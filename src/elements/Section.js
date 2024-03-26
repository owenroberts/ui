import { UICollection } from './Collection.js';
import { UIElement } from './Element.js';
import { UISelectButton } from './SelectButton.js';
import { UILabel } from './Label.js';
import { UINumber } from './Number.js';
import { UINumberStep } from './NumberStep.js';
import { UIToggleCheck } from './ToggleCheck.js';

export class UISection extends UICollection {
	constructor(params) {
		super(params);
		this.addClass('ui-section');

		// id necessary ??
		this.panels = new UICollection({ 
			id: params.id + '-panels', 
			class: 'panels'
		});
		this.panels.addBreak();

		const header = this.append(new UICollection({ id: params.id + '-header', class: 'section-header' }));

		this.selector = header.append(new UISelectButton({ 
			class: 'selector',
			callback: value => {
				params.addPanelToSection(value, this, params.gridArea);
			}
		}));
		
		this.append(this.panels);

		const wc = header.append(new UICollection({ class: 'width-collection' }));
		wc.append(new UILabel({ text: 'Width' }));
		this.maxWidth = wc.append(new UINumber({
			value: 500,
			callback: value => {
				this.setStyle('--max-width', value);
			}
		}));

		this.maxWidthToggle = wc.append(new UIToggleCheck({
			callback: value => {
				if (value) this.addClass('max-width');
				else this.removeClass('max-width');
			}
		}));

		this._isVisible = true;

		const sc = header.append(new UICollection({ 'class': 'scale-collection' }));
		sc.append(new UILabel({ text: 'Scale' }));
		this.baseFontSize = sc.append(new UINumberStep({
			value: 11,
			min: 10,
			max: 40,
			callback: value => {
				this.panels.setStyle('--ui-scale', +value);
			}
		}));
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

	load(settings) {
		this.maxWidth.update(settings.maxWidth);
		this.maxWidthToggle.update(settings.maxWidthToggle);
		if (settings.isVisible !== undefined) {
			if (settings.isVisible) this.removeClass('hidden');
			else this.addClass('hidden');
		}
	}

	get settings() {
		return {
			maxWidthToggle: this.maxWidthToggle.value,
			maxWidth: this.maxWidth.value,
			isVisible: !this.hasClass('hidden'),
			baseFontSize: this.baseFontSize.value,
		}
	}
}