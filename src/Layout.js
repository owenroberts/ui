/*
	layout for app
	ui is interface
*/

function Layout(ui, params) {
	const self = this;

	const container = new UICollection({ id: 'container' });
	const interface = new UICollection({ id: 'interface' });
	container.append(interface);
	const selector = new UICollection({ id: 'selector' });
	interface.append(selector);
	interface.append(ui.panels);
	
	const uiTimeline = new UICollection({ id: 'ui-timeline' });
	container.append(uiTimeline);
	const timelineArea = new UICollection({ id: 'timeline-panels', class: 'panels' });
	uiTimeline.append(timelineArea);

	const uiMain = new UICollection({ id: 'main' });
	const mainArea = new UICollection({ id: 'main-panels' });
	uiMain.append(mainArea);

	window.toolTip = new UILabel({id: 'tool-tip'});
	interface.append(window.toolTip);

	this.toggleTimelineView = function(isOn) {
		const area = isOn ? timelineArea : ui.panels;
		for (const p in ui.panels) {
			if (ui.panels[p].gridArea === 'timeline') {
				area.append(ui.panels[p]);
			}
		}
	};

	this.toggleRL = function(isOn) {
		if (isOn) container.addClass('RL');
		else container.removeClass('RL');
	};

	this.addSelectPanels = function(panelList) {
		console.log(self.panel.layout.uiSelect)
		panelList.forEach(p => {
			const [option, label] = p;
			self.panel.layout.uiSelect.addOption(option, false, label);
		});
	};

	this.dockPanel = function(section) {
		console.log(self.panel.layout.uiSelect.value)
		const panel = ui.panels[self.panel.layout.uiSelect.value];
		console.log(panel);
		panel.dock();
		if (panel.gridArea !== section) {
			panel.gridArea = section;
			if (section === 'default') ui.panels.append(panel);
			// if (section === 'timeline') timelineArea.append(panel);
			if (section === 'main') mainArea.append(panel);
		}
		if (section === 'timeline') self.toggleTimelineView(true);
	};

}