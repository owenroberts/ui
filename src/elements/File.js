import { UIElement } from './Element.js';
import { setKey } from './Behaviors.js';

export function UIFile(params={}) {
	const ui = UIElement({ ...params, tag: 'button' });
	ui.addClass(params.btnClass ?? 'btn');
	ui.setText(ui.getText() ?? params.text);

	const { onPress } = setKey(ui, params.key, ui.getText());
	ui.el.addEventListener('click', loadFile);

	const multiple = params.multiple ?? false;
	const promptDefault = params.promptDefault ?? '';
	const fileType = params.fileType ?? 'application/json';

	/* bc button doesn't have an update func */
	function loadFile() {
		// const { callback, promptDefault, multiple, fileType } = this;
		function readFile(files, directoryPath) {
			for (let i = 0, f; f = files[i]; i++) {
				if (!f.type.match(fileType)) continue;
				const reader = new FileReader();
				reader.onload = (function(theFile) {
					return function(e) {
						const filePath = '/' + directoryPath + '/' + f.name;
						const fileName = f.name.split('.')[0];
						let data;
						if (fileType === 'application/json') data = JSON.parse(e.target.result);
						else data = e.target.result;
						params.callback(data, fileName, filePath);
					};
				})(f);
				reader.readAsText(f);
			}
		}

		const openFile = document.createElement('input');
		openFile.type = "file";
		openFile.multiple = multiple;
		openFile.click();
		openFile.onchange = function() {
			let directoryPath = prompt('Directory?', promptDefault);
			readFile(openFile.files, directoryPath);
		};
	}

	return Object.assign(ui, {
		callback: loadFile,
		keyHandler: loadFile,
		onPress,
	});
}