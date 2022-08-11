class UIDrag extends UIText {
	constructor(params) {
		super(params);
		this.addClass('drag');
		const self = this;

		const drag = { 
			x: 0, // position when clicked
			y: 0, 
			timeout: 5, 
			timer: 0, // timeout so it doesn't go nuts
			prev: 0, // -1 or 1
			active: false,
		}; 

		function mouseDown(ev) {
			drag.x = ev.pageX;
			drag.y = ev.pageY;
			drag.active = true;
			document.addEventListener('mousemove', mouseMove);
			document.addEventListener('mouseup', mouseUp);
		}

		function mouseMove(ev) {
			if (!drag.active) return;

			const delta = { x: ev.pageX - drag.x, y: ev.pageY - drag.y };
			const dir = Math.abs(delta.x) > Math.abs(delta.y) ? 'x' : 'y';

			if (Math.abs(delta[dir]) > 10 && drag.timer === 0) {
				const m = dir === 'x' ? 1 : -1; // multiplier for x/y
				if (params.drag) params.drag(m * Math.sign(delta[dir]));
				drag.timer = drag.timeout;
				drag.x = ev.pageX;
				drag.y = ev.pageY;
			} else if (drag.timer > 0) {
				drag.timer--;
			}
		}

		function mouseUp(ev) {
			if (!drag.active) return;
			drag.active = false;
			drag.x = 0;
			drag.y = 0;
			self.el.blur();
			document.removeEventListener('mousemove', mouseMove);
			document.removeEventListener('mouseup', mouseUp);
		}

		this.el.addEventListener('mousedown', mouseDown);

		if (params.value !== undefined) this.value = params.value;
	}
}