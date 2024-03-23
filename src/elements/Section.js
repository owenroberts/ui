import { UICollection } from './Collection.js';
import { UIElement } from './Element.js';
import { UISelectButton } from './SelectButton.js';
import { UILabel } from './Label.js';
import { UINumber } from './Number.js';
import { UINumberStep } from './NumberStep.js';
import { UIToggleCheck } from './ToggleCheck.js';

export function UISection(params={}) {
	const ui = UICollection(params);
	ui.addClass("ui-section");

	// id necessary ??
	const panels = new UICollection({ 
		id: params.id + '-panels',
		class: 'panels'
	});
	// break between panels
	panels.addBreak();

	const header = new UICollection({
		id: params.id + '-header', 
		class: 'section-header',
	});

	const selector = header.add(new UISelectButton({ 
		class: 'selector',
		callback: value => {
			params.addPanelToSection(value, ui, params.gridArea);
		}
	}));

	ui.append(header);
	ui.append(panels);

	const wc = header.append(new UICollection({ class: 'width-collection' }));
	wc.append(new UILabel({ text: 'Width' }));
	const maxWidth = wc.append(new UINumber({
		value: 500,
		callback: value => {
			ui.setProp('--max-width', value);
		}
	}));
	const maxWidthToggle = wc.append(new UIToggleCheck({
		callback: value => {
			if (value) ui.addClass('max-width');
			else ui.removeClass('max-width');
		}
	}));

	const sc = new header.append(UICollection({ 'class': 'scale-collection' }));
	sc.append(new UILabel({ text: 'Scale' }));
	const baseFontSize = sc.append(new UINumberStep({
		value: 11,
		min: 10,
		max: 40,
		callback: value => {
			panels.setProp('--ui-scale', +value);
		}
	}));

	function addSelectorOptions(panelList) {
		panelList.forEach(p => {
			const [option, label] = p;
			selector.addOption(option, label);
		});
	}

	function addSelectorOption(key, label) {
		selector.addOption(key, label);
	}

	return Object.assign(ui, {
		addSelectorOption,
		addSelectorOptions,
		load(settings) {
			maxWidth.update(settings.maxWidth);
			maxWidthToggle.update(settings.maxWidthToggle);
			if (settings.isVisible !== undefined) {
				if (settings.isVisible) ui.removeClass('hidden');
				else ui.addClass('hidden');
			}
		},
		get panels() { return panels; },
		// get isVisible() { return !ui.hasClass('hidden'); },
		// set isVisible(value) {
		// 	if (value) ui.removeClass('hidden');
		// 	else ui.addClass('hidden');
		// },
		get settings() {
			return {
				maxWidthToggle: maxWidthToggle.get(),
				maxWidth: maxWidth.get(),
				isVisible: !ui.hasClass('hidden'),
				baseFontSize: baseFontSize.get(),
			};
		}
	});
}