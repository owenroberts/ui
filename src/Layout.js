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
	interface.append(this.panels);
	const uiTimeline = new UICollection({ id: 'ui-timeline' });
	container.append(uiTimeline);
	const timelineArea = new UICollection({ id: 'timeline-panels', class: 'panels' });
	uiTimeline.append(timelineArea);

	if (params.useMain) {

	}

	window.toolTip = new UILabel({id: 'tool-tip'});
	interface.append(window.toolTip);

	this.toggleTimelineView = function(isOn) {
		const area = isOn ? timelineArea : self.panels;
		for (const p in self.panels) {
			if (self.panels[p].gridArea === 'timeline') {
				area.append(self.panels[p]);
			}
		}
	};


}