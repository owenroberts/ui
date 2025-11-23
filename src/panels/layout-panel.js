import { UIPanel } from '../oi.js';

export class LayoutPanel extends UIPanel {
	constructor(params) {
		super({ ...params, id: 'layout' });

		const layout = this.ui.layout;

		this.addRef({
			obj: layout.timeline,
			ref: 'isVisible',
			label: 'Timeline',
			face: "timelineLayout",
		});

		this.addRef({
			label: "▶/◀",
			value: false,
			face: "rightLeftLayout",
			callback: value => {
				if (value) layout.container.addClass('RL');
				else layout.container.removeClass('RL');
			}
		});

		this.addRef({
			label: "▼/▲",
			value: false,
			face: "upLayout",
			callback: value => {
				if (value) layout.container.addClass('UP');
				else layout.container.removeClass('UP');
			}
		});
	}
}