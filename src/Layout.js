/*
	layout for app
	ui is interface
*/

function Layout(app, params) {

	const container = new UICollection({ id: 'container' });
	
	const defaultUI = new UISection({ id: 'ui', gridArea: 'default', addPanelToSection });
	container.append(defaultUI);
	
	const timeline = new UISection({ id: 'ui-timeline', gridArea: 'timeline', addPanelToSection });
	container.append(timeline);
	
	const main = new UISection({ id: 'main', gridArea: 'main', addPanelToSection });

	const ToolTip = new UILabel({ id: 'tool-tip' });
	defaultUI.append(ToolTip);
	window.ToolTip = ToolTip; // better way to do this?

	function addPanelToSection(panelName, section, gridArea) {
		const panel = app.ui.panels[panelName];
		section.panels.append(panel);
		panel.gridArea = gridArea;
		panel.dock();
	}

	function addSelectPanels(panelList) {
		defaultUI.addSelectorOptions(panelList);
		timeline.addSelectorOptions(panelList);
		main.addSelectorOptions(panelList);
	}

	function addSelectOption(key, label) {
		defaultUI.addSelectorOption(key, label);
		timeline.addSelectorOption(key, label);
		main.addSelectorOption(key, label);
	}

	function getSettings() {
		return {
			default: defaultUI.settings,
			timeline: timeline.settings,
			main: main.settings,
		};
	}

	function init() {
		const panel = app.ui.createPanel('layout');
		
		app.ui.addProp('timelineLayout', {
			type: 'UIToggleCheck', // remove UI eventually ??
			value: true,
			label: 'Timeline',
			callback: value => {
				timeline.isVisible = value;
			}
		}, panel);

		app.ui.addProp('rightLayout', {
			type: 'UIToggleCheck',
			value: false,
			label: "▶/◀",
			callback: value => {
				if (value) container.addClass('RL');
				else container.removeClass('RL');
			}
		}, panel);

		app.ui.addProp('upLayout', {
			type: 'UIToggleCheck',
			value: false,
			label: "▼/▲",
			callback: value => {
				if (value) container.addClass('UP');
				else container.removeClass('UP');
			}
		}, panel);
	}

	return { default: defaultUI, timeline, main, init, addSelectPanels, addSelectOption, getSettings };
}