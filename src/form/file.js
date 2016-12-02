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

 @namespace ludo.form
 @class ludo.form.File
 @augments ludo.form.Element
 
 @param {Object} config
 @param {String} config.labelButton Label for button, default: "Browse"
 @param {String} config.labelRemove Remove existing file label, default: "Remove"
 @param {Boolean} config.instantUpload  Upload instantly when selecting file. During upload the form component will be flagged
 as invalid, i.e. submit button will be disabled during file upload.
 @param {Number} config.buttonWidth Width of browse button in pixels.
 @param {String} config.accept Comma separated string of valid extensions, example : 'png,gif,bmp'
 @fires ludo.form.File#submit Fired after successful file upload. Arguments: 1) {Object} Json from server, 2) ludo.form.File
 @fires ludo.form.File#submitFail Fired after failed file upload, i.e. server responded with a JSON object where success was false({ "success": false }). Arguments: 1) {Object} Json from server, 2) ludo.form.File
 @fires ludo.form.File#fail Fired on other failures than submitFail, example: server error. Arguments: 1) String response from server, 2) ludo.form.File
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
	Extends:ludo.form.Element,
	type:'form.File',

	inputTag:'input',
	inputType:'file',


	labelButton:'Browse',


	labelRemove:'Remove',

	labelDelete:'Delete',


	valueForDisplay:'',

	instantUpload:true,

	uploadInProgress:false,

	fileUpparseNewData:true,


	isFileUploadComponent:true,


	buttonWidth:80,

	accept:undefined,

    resource:'FileUpload',

	__construct:function (config) {
		this.parent(config);
        this.setConfigParams(config, ['resource','instantUpload','labelButton','labelRemove','labelDelete','buttonWidth']);
		if (config.accept) {
			this.accept = config.accept.toLowerCase().split(/,/g);
		}
		if (config.value) {
			this.valueForDisplay = config.value;
		}
		this.value = '';
	},

	__rendered:function () {
		this.parent();

		var cell = $('<div>');
		cell.width(this.buttonWidth);
		cell.css('textAlign', 'right');
		this.getBody().append(cell);
		cell.append(this.getFormEl());

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
		fe.css({
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

		fe.on('mouseover', btn.mouseOver.bind(btn));
		fe.on('mouseout', btn.mouseOut.bind(btn));
		fe.on('mousedown', btn.mouseDown.bind(btn));
		fe.on('mouseup', btn.mouseUp.bind(btn));
		fe.on('change', this.selectFile.bind(this));



		btn.getEl().append(fe);

		this.createIframe();
		this.createFormElementForComponent();

		if (this.valueForDisplay) {
			this.displayFileName();
		}
	},

	createFormElementForComponent:function () {
		var formEl = this.els.form = $('<form method="post action="' + this.getUploadUrl() + '" enctype="multipart/form-data" target="' + this.getIframeName() + '">');

		formEl.css({ margin:0, padding:0, border:0});
		this.getEl().append(formEl);
		formEl.append(this.getBody());

		this.addElToForm('ludo-file-upload-name',this.getName());
		this.addElToForm('request', this.getResource() + '/save');

	},

    getResource:function(){
        return this.resource || 'FileUpload';
    },

	addElToForm:function(name,value){
		var el =$('<input type="hidden" name="' + name + '">');
		el.val(value);
		this.els.form.append(el);
	},

	createIframe:function () {
		this.iframeName = this.getIframeName();
		var el = this.els.iframe = $('<iframe name="' + this.iframeName + '">');
		el.css({
			width:1, height:1,
			visibility:'hidden',
			position:'absolute'
		});
		this.getEl().append(el);
		el.on('load', this.onUpparseNewData.bind(this));

	},

	getIframeName:function () {
		return 'iframe-' + this.getId();
	},

	onUpparseNewData:function () {
		this.fileUpparseNewData = true;
		if (window.frames[this.iframeName].location.href.indexOf('http:') == -1) {
			return;
		}
		try {
			var json = JSON.parse(window.frames[this.iframeName].document.body.innerHTML);
			if (json.success) {
				this.value = json.response;
				this.fireEvent('submit', [json.response, this]);
			} else {
				this.fireEvent('submitfail', [json, this]);
			}
			this.fireEvent('valid', ['', this]);
		} catch (e) {
			var html = '';
			try {
				html = window.frames[this.iframeName].document.body.innerHTML;
			} catch (e) {
			}
			this.fireEvent('fail', [e, html, this]);

		}

		this.uploadInProgress = false;
		this.displayFileName();

        this.validate();
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
		var file = this._get();
		var tokens = file.split(/\./g);
        return tokens.pop().toLowerCase();
	},

	getUploadUrl:function () {
        var url = ludo.config.getFileUploadUrl() || this.getUrl();
        if (!url) {
            ludo.util.warn('No url defined for file upload. You can define it with the code ludo.config.setFileUploadUrl(url)');
        }
		return url;
	},

	selectFile:function () {
		this.value = this.valueForDisplay = this.getFormEl().get('value');
		this.fileUpparseNewData = false;
		this.displayFileName();
		this.setDirty();
		if (this.instantUpload) {
			this.upload();
		}

	},

	displayFileName:function () {
        var ci = this.els.cellInput;
		ci.html( '');
		ci.removeClass('ludo-input-file-name-new-file');
		ci.removeClass('ludo-input-file-name-initial');
		ci.removeClass('ludo-input-file-name-not-uploaded');
		if (this.valueForDisplay) {

            var span = ludo.dom.create({
                tag:'span',
                html : this.valueForDisplay + ' ',
                renderTo:ci
            });

			var deleteLink = new Element('a');
			deleteLink.addEvent('click', this.removeFile.bind(this));
			deleteLink.set('href', '#');
			var html = this.labelRemove;
			if (this.valueForDisplay == this.initialValue) {
				html = this.labelDelete;
				ci.addClass('ludo-input-file-name-initial');
			} else {
				ci.addClass('ludo-input-file-name-new-file');
			}
			if (!this.fileUpparseNewData) {
				ci.addClass('ludo-input-file-name-not-uploaded');
			}
			deleteLink.html( html);
			ci.append(deleteLink);
		}
	},
	resizeDOM:function () {
		/* No DOM resize necessary for this component */
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
		console.warn("Use of deprecated getValue");
		console.trace();
		return this.value;
	},


	_get:function(){
		return this.value;
	},
	/*
	 * setValue for file inputs is display only. File inputs are readonly
	 * @function setValue
	 * @param {Object} value
	 *
	 */
	setValue:function (value) {
		console.warn("Use of deprecated setValue");
		this.valueForDisplay = value;
		this.displayFileName();
		this.validate();
	},

	/**
	 * "set" is readonly for file inputs. It will update the displayed file name, not the file input it's self.
	 * Method without arguments returns the file input value
	 * @function val
	 * @param {Object} value
	 * @memberof ludo.form.File.prototype
	 */
	val:function(value){
		if(arguments.length == 0){
			return this._get();
		}

		this.valueForDisplay = value;
		this.displayFileName();
		this.validate();
	},

	commit:function () {
		this.initialValue = this.valueForDisplay;
		this.displayFileName();
	},

	removeFile:function () {
        this.valueForDisplay = this.valueForDisplay === this.initialValue ? '' : this.initialValue;
		this.value = '';
		this.displayFileName();
		this.validate();
		return false;
	},

	hasFileToUpload:function () {
		return !this.fileUpparseNewData;
	},

	blur:function () {

	},

    supportsInlineLabel:function(){
        return false;
    }
});
