/*
	function handle saving local files
*/

function FilesIO(app, params) {

	let saveFilesEnabled = false;
	let fileName = undefined;
	let titleDisplay;

	

	function connect() {

		const panel = app.ui.getPanel('fio', { label: 'Files IO' });
		titleDisplay = app.ui.addUI({ id: 'title', value: fileName, type: 'UIText' });

		app.ui.addCallbacks([
			{ callback: saveLocal, key: 's', text: 'Save Local' },
			{ callback: loadLocal, key: 'l', text: 'Load Local', },
			{ callback: listLocal, key: 'ctrl-l', text: 'List Local' },
			{ callback: clearLocal, key: 'alt-c', text: 'Clear Local', },
			{ callback: saveFile, key: 'alt-s', text: 'Save File' },

		]);
	}


	return { 
		connect, loadFile, loadJSON,
		getTitle: () => { return titleDisplay.value; },
	};
}