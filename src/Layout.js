/*
	layout for app
	ui is interface
*/

function Layout(ui, params) {
	const self = this;

	const container = new UICollection({ id: 'container' });
	this.default = new UISection({ id: 'ui', gridArea: 'default' }, ui);
	container.append(this.default);
	
	// this.interface.append(ui.panels); // adding main panels to the interface collection
	
	this.timeline = new UISection({ id: 'ui-timeline', gridArea: 'timeline' }, ui);
	container.append(this.timeline);
	this.main = new UISection({ id: 'main', gridArea: 'main' }, ui);

	window.toolTip = new UILabel({id: 'tool-tip'});
	this.default.append(window.toolTip);

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
		this.default.addSelectorOptions(panelList);
		this.timeline.addSelectorOptions(panelList);
		this.main.addSelectorOptions(panelList);
	};
}