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

	function addPanelToSection(panelName, section) {
		const panel = app.ui.panels[panelName];
		section.panels.append(panel);
		panel.gridArea = params.gridArea;
		panel.dock();
	}

	function toggleTimeline(isOn) {
		self.timeline.isVisible = isOn;
	}

	function toggleRL(isOn) {
		if (isOn) container.addClass('RL');
		else container.removeClass('RL');
	}

	function toggleUP(isOn) {
		if (isOn) container.addClass('UP');
		else container.removeClass('UP');
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

	return { default: defaultUI, timeline, main, toggleTimeline, toggleRL, toggleUP, addSelectPanels, addSelectOption, getSettings };
}