/*
	layout for app
	ui is interface
*/

function Layout(app, params) {

	const container = new UICollection({ id: 'container' });
	const sections = {}; // use this instead ... figure out usemain
	
	const defaultUI = new UISection({ id: 'ui', gridArea: 'default', addPanelToSection });
	container.append(defaultUI);
	
	const timeline = new UISection({ id: 'ui-timeline', gridArea: 'timeline', addPanelToSection });
	container.append(timeline);
	
	const main = new UISection({ id: 'main', gridArea: 'main', addPanelToSection });

	defaultUI.append(ToolTip);

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

	function connect() {
		
		app.ui.addProps({

			'timelineLayout': {
				type: 'UIToggleCheck', // remove UI eventually ??
				value: true,
				label: 'Timeline',
				callback: value => { timeline.isVisible = value; }
			},

			'rightLayout': {
				type: 'UIToggleCheck',
				value: false,
				label: "▶/◀",
				callback: value => {
					if (value) container.addClass('RL');
					else container.removeClass('RL');
				}
			},

			'upLayout': {
				type: 'UIToggleCheck',
				value: false,
				label: "▼/▲",
				callback: value => {
					if (value) container.addClass('UP');
					else container.removeClass('UP');
				}
			}, 
		}, 'layout');
	}

	return { default: defaultUI, timeline, main, connect, addSelectPanels, addSelectOption, getSettings };
}