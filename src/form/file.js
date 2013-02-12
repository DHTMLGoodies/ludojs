/**
 File upload component<br>
 This components submits the file to an iframe. The url of this iframe is by default.<br>
 LUDOJS_CONFIG.fileupload.url. You can override it with remote.url config property.

 The file upload component should be implemented this way:

 1) File is uploaded to the server<br>
 2) You copy the file to a temporary area and save a reference to it in a database<br>
 3) You return the reference to the file, example id of database row(e.g. 1000)<br>
 4) The reference(1000) will be sent back from the server and saved as value of file upload component.<br>

 A PHP implementation of the PHP code of this can be obtained by contacting post[at]dhtmlgoodies.com.

 @namespace form
 @class File
 @extends form.Element
 @constructor
 @param {Object} config
 @example
	 ...
	 children:[{
		 type:'form.File', label:'Pgn File', name:'pgnfile', required:true, labelButton:'Find Pgn file', buttonWidth:100
	 }]
 	 ...
 is example of code used to add a file components as child of a component.

 When the file is uploaded to the server(happens instantly when instantUpload is set to true), the name
 of the file will be sent in POST variable ludo-file-upload-name. The actual file should be available in the
 FILES array sent to the server.

 Example of code sent to server:
 	{
		ludo-file-upload-name : '<name of file>',
		'name-of-file-upload-component' : 'pgnfile'
    }


 Example of PHP Code used to handle the file:

 @example

	 if(isset($_POST['ludo-file-upload-name'])){
		 header('Content-Type: text/html; charset=utf-8');
		 $uploadInfo = FileUpload::uploadFile($_FILES[$_POST['ludo-file-upload-name']]);

		 $data = array('success' => true, 'message' => '', 'data' => $uploadInfo);

		 die(utf8_encode(json_encode($data)));
	 }
 Response from server may look like this:

 @example
	 {
	 	success : true,
	 	value : '100'
	 }

 where success indicates if the upload was successful and value is a reference to the file. When the form with this
 file upload component is later submitted,

 */
ludo.form.File = new Class({
	Extends:ludo.form.LabelElement,
	type:'form.File',

	inputTag:'input',
	inputType:'file',

	/**
	 * Label of "Browse" button
	 * @attribute labelButton
	 * @type String
	 * @default "Browse"
	 */
	labelButton:'Browse',

	/**
	 * Label for "Remove" new file link
	 * @attribute labelRemove
	 * @type String
	 * @default Remove
	 */
	labelRemove:'Remove',
	/**
	 * Label for "Delete" new file link
	 * @attribute {String} labelDelete
	 * @default Delete
	 */
	labelDelete:'Delete',

	/**
	 * Private property for displayed file name. The file upload component is read only. It will only
	 * submit a value if a new file has been selected.
	 * @property valueForDisplay
	 * @private
	 */
	valueForDisplay:'',
	/**
	 * Upload instantly when selecting file. During upload the form component will be flagged
	 * as invalid, i.e. submit button will be disabled during file upload.
	 * @attribute instantUpload
	 * @type {Boolean}
	 * @default true
	 */
	instantUpload:true,

	uploadInProgress:false,

	/**
	 * false when a file has been selected but not uploaded. Happens
	 * when instantUpload is set to false
	 * @property fileUploadComplete
	 * @type {Boolean}
	 */
	fileUploadComplete:true,

	/*
	 * Property used to identify file upload components
	 */
	isFileUploadComponent:true,

	/**
	 * Width of browse button
	 * @attribute buttonWidth
	 * @type {Number}
	 * @default 80
	 */
	buttonWidth:80,

	/**
	 * Comma separated string of valid extensions, example : 'png,gif,bmp'
	 * @attribute accept
	 * @type String
	 */
	accept:undefined,


	ludoConfig:function (config) {
		this.parent(config);
		if (config.instantUpload !== undefined)this.instantUpload = config.instantUpload;
		if (config.labelButton !== undefined)this.labelButton = config.labelButton;
		if (config.labelRemove !== undefined)this.labelRemove = config.labelRemove;
		if (config.labelDelete !== undefined)this.labelDelete = config.labelDelete;
		if (config.buttonWidth !== undefined)this.buttonWidth = config.buttonWidth;
		if (config.accept !== undefined) {
			config.accept = config.accept.toLowerCase();
			this.accept = config.accept.split(/,/g);
		}

		if (config.value) {
			this.valueForDisplay = config.value;
		}
		this.value = '';
	},

	ludoRendered:function () {
		this.parent();

		var cell = new Element('td');
		cell.width = this.buttonWidth;
		cell.style.textAlign = 'right';
		this.els.inputRow.adopt(cell);
		cell.adopt(this.getFormEl());

		var btn = new ludo.form.Button({
			type:'form.Button',
			layout:{
				height:30,
				width:this.buttonWidth
			},
			value:this.labelButton,
			overflow:'hidden',
			renderTo:cell
		});

		var fe = this.getFormEl();
		fe.setStyles({
			opacity:0,
			'-moz-opacity':0,
			height:'100%',
			'position':'absolute',
			'right':0,
			top:0,
			'z-index':100000,
			cursor:'pointer',
			filter:'alpha(opacity=0)'
		});


		fe.addEvent('mouseover', btn.mouseOver.bind(btn));
		fe.addEvent('mouseout', btn.mouseOut.bind(btn));
		fe.addEvent('mousedown', btn.mouseDown.bind(btn));
		fe.addEvent('mouseup', btn.mouseUp.bind(btn));

		fe.addEvent('change', this.selectFile.bind(this));
		btn.getEl().adopt(fe);

		this.createIframe();
		this.createFormElementForComponent();

		if (this.valueForDisplay) {
			this.displayFileName();
		}
	},

	createFormElementForComponent:function () {
		var formEl = this.els.form = new Element('form');
		formEl.target = this.getIframeName();
		formEl.setProperty('method', 'post');
		formEl.setProperty('action', this.getUploadUrl());
		formEl.setProperty('enctype', 'multipart/form-data');
		formEl.setStyles({ margin:0, padding:0, border:0});
		this.getEl().adopt(formEl);
		formEl.adopt(this.getBody());

		this.addElToForm('ludo-file-upload-name',this.getName());
		this.addElToForm('request','FileUpload/save');

	},

	addElToForm:function(name,value){
		var el = new Element('input');
		el.type = 'hidden';
		el.name = name;
		el.value = value;
		this.els.form.adopt(el);
	},

	createIframe:function () {
		var el = this.els.iframe = new Element('iframe');
		el.name = this.iframeName = this.getIframeName();
		el.setStyles({
			width:1, height:1,
			visibility:'hidden',
			position:'absolute'
		});
		this.getEl().adopt(el);
		el.addEvent('load', this.onUploadComplete.bind(this));

	},

	getIframeName:function () {
		return 'iframe-' + this.getId();
	},

	onUploadComplete:function () {
		this.fileUploadComplete = true;

		if (window.frames[this.iframeName].location.href.indexOf('http:') == -1) {
			return;
		}
		try {
			var json = JSON.decode(window.frames[this.iframeName].document.body.innerHTML);
			if (json.success) {
				this.value = json.data.value;
				/**
				 * Event fired after a successful file upload, i.e. no server errors and json.success in
				 * response is true
				 * @event submit
				 * @param {Object} JSON from server (response.data)
				 * @param {Object} ludo.form.file
				 */
				this.fireEvent('submit', [json.data, this]);
			} else {
				/**
				 * Event fired after an unsuccessful file upload because json.success was false
				 * @event submitfail
				 * @param {Object} json from server
				 * @param {Object} ludo.form.file
				 */
				this.fireEvent('submitfail', [json, this]);
			}

			this.fireEvent('valid', ['', this]);
		} catch (e) {

			var html = '';
			try {
				html = window.frames[this.iframeName].document.body.innerHTML;
			} catch (e) {
			}
			/**
			 * Event fired when upload failed
			 * @event fail
			 * @param {Object} Exception
			 * @param {String} response from server
			 * @param {Object} ludo.form.file
			 */
			this.fireEvent('fail', [e, html, this]);

		}

		this.uploadInProgress = false;
		this.displayFileName();
	},

	isValid:function () {
		if (this.required && !this.getValue() && !this.hasFileToUpload()) {
			return false;
		}
		if (!this.hasValidExtension())return false;
		return !this.uploadInProgress;
	},

	hasValidExtension:function () {
		if (!this.hasFileToUpload() || this.accept === undefined) {
			return true;
		}

		return this.accept.indexOf(this.getExtension()) >= 0;

	},

	getExtension:function () {
		var file = this.getValue();
		var tokens = file.split(/\./g);
		var extension = tokens[tokens.length - 1].toLowerCase();
		return extension.toLowerCase();
	},

	getUploadUrl:function () {
		try {
			return ludo.config.getFileUploadUrl();
		} catch (e) {
			var url = this.getUrl();
			if (!url) {
				alert('No url defined for file upload, you should define url property or globally set ludo.appConfig.fileupload.url');
			}
			return url;
		}
	},

	selectFile:function () {
		this.value = this.valueForDisplay = this.getFormEl().get('value');
		this.fileUploadComplete = false;
		this.displayFileName();
		this.setDirty();
		if (this.instantUpload) {
			this.upload();
		}

	},

	displayFileName:function () {

		this.els.cellInput.set('html', '');
		this.els.cellInput.removeClass('ludo-input-file-name-new-file');
		this.els.cellInput.removeClass('ludo-input-file-name-initial');
		this.els.cellInput.removeClass('ludo-input-file-name-not-uploaded');
		if (this.valueForDisplay) {
			var span = new Element('span');
			span.set('html', this.valueForDisplay + ' ');
			this.els.cellInput.adopt(span);

			var deleteLink = new Element('a');
			deleteLink.addEvent('click', this.removeFile.bind(this));
			deleteLink.set('href', '#');
			var html = this.labelRemove;
			if (this.valueForDisplay == this.initialValue) {
				html = this.labelDelete;
				ludo.dom.addClass(this.els.cellInput, 'ludo-input-file-name-initial');
			} else {
				ludo.dom.addClass(this.els.cellInput, 'ludo-input-file-name-new-file');
			}
			if (!this.fileUploadComplete) {
				ludo.dom.addClass(this.els.cellInput, 'ludo-input-file-name-not-uploaded');
			}
			deleteLink.set('html', html);
			this.els.cellInput.adopt(deleteLink);
		}
	},
	resizeDOM:function () {
		/* No DOM resize nescessary for this component */
	},
	upload:function () {
		if (!this.hasValidExtension()) {
			return;
		}
		this.fireEvent('invalid', ['', this]);
		this.uploadInProgress = true;
		this.els.form.submit();
	},

	getValue:function () {
		return this.value;
	},
	/**
	 * setValue for file inputs is display only. File inputs are readonly
	 * @method setValue
	 * @param {Object} value
	 */
	setValue:function (value) {
		this.valueForDisplay = value;
		this.displayFileName();
		this.validate();
	},

	commit:function () {
		this.initialValue = this.valueForDisplay;
		this.displayFileName();
	},

	removeFile:function () {
		if (this.valueForDisplay == this.initialValue) {
			this.valueForDisplay = '';
		} else {
			this.valueForDisplay = this.initialValue;
		}
		this.value = '';
		this.displayFileName();
		this.validate();
		return false;
	},

	hasFileToUpload:function () {
		return !this.fileUploadComplete;
	},

	blur:function () {

	}
});
