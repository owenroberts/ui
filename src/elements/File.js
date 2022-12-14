class UIFile extends UIButton {
	constructor(params) {
		super(params);
		this.multiple = params.multiple || false;
		this.promptDefault = params.promptDefault;
		this.fileType = params.fileType || 'application/json';
	}

	/* bc button doesn't have an update func */
	keyHandler() {
		const { callback, promptDefault, multiple, fileType } = this;
		
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
						callback(data, fileName, filePath);
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
}

UI.Elements.UIFile = UIFile;