ludo.tree.FilterTree = new Class({
	Extends:ludo.View,
	type:'tree.FilterTree',
	treeConfig:undefined,
	inputConfig:undefined,
	selectedRecord:undefined,
	layout:{
		type:'cols'
	},
	treePanel:undefined,
	input:undefined,

	ludoConfig:function (config) {

		this.parent(config);
		this.inputConfig = config.inputConfig;
		this.treeConfig = config.treeConfig;
		this.buttonConfig = config.buttonConfig;
		this.treeConfig.type = 'tree.Tree';
		this.inputConfig.type = 'form.Text';
		this.inputConfig.weight=1;
		this.buttonConfig.type = 'form.Button';
	},

	ludoEvents:function () {
		this.parent();

		$(document.body).on('click', this.autoHide.bind(this));
	},

	ludoDOM:function () {
		this.parent();
		this.getEl().addClass('ludo-filter-tree')
	},

	toggleInput:function () {

	},

	ludoRendered:function () {
		this.parent();

		this.viewField = this.addChild({
			cls:'ludo-Filter-Tree-Value',
			weight:1
		});

		this.input = this.addChild(this.inputConfig);
		this.input.addEvent('focus', this.showTree.bind(this));
		this.input.addEvent('focus', this.selectInputText.bind(this));
		this.input.addEvent('blur', this.blurInput.bind(this));
		this.input.addEvent('key_up', this.filter.bind(this));

		this.button = this.addChild(this.buttonConfig);
		this.button.addEvent('click', this.submit.bind(this));

		this.treePanel = new ludo.Window({
			cls:'ludo-Filter-Tree-Window',
			width:this.treeConfig.width,
			minWidth:this.fieldWidth,
			height:this.treeConfig.height,
			resizeTop:false,
			resizeLeft:false,
			titleBar:false,
			els:{
				parent:document.body
			},
			layout:'fill',
			children:[this.treeConfig]
		});
		this.treePanel.hide();
		this.treePanel.children[0].addEvent('click', this.selectRecord.bind(this));

		this.resize.delay(100, this);

		var hiddenEl = this.els.hiddenEl = $('<div>');
		hiddenEl.id = 'el-' + String.uniqueID();
		hiddenEl.setStyles({
			position:'absolute',
			top:this.input.getEl().offsetTop,
			left:this.input.getEl().getStyle('width'),
			'margin-left':'-15px',
			height:'25px',
			width:15,
			cursor:'pointer',
			'z-index':100
		});
		hiddenEl.addEvent('click', this.arrowClick.bind(this));

		this.getBody().append(hiddenEl);
	},

	arrowClick:function () {
		if (this.treePanel.isHidden()) {
			this.selectInputText();
			this.showTree();
		} else {
			this.hideTree();
		}
	},

	selectInputText:function () {
		this.input.getFormEl().select();
	},
	blurInput:function () {
		this.input.getFormEl().removeClass('ludo-filter-tree-input-active');
	},

	autoHide:function (e) {
		var el = e.target;
		if (el.id == this.input.getFormEl().id) {
			return;
		}
		if (el.id == this.els.hiddenEl.id) {
			return;
		}
		if (!el.getParent('#' + this.input.getFormEl().id) && !el.getParent('#' + this.treePanel.id)) {
			this.treePanel.hide();
		}

	},

	hideTree:function () {
		this.treePanel.hide();
	},

	filter:function () {
		this.treePanel.show();
		this.treePanel.children[0].filter(this.input.getValue());
	},

	showTree:function () {
		this.input.getFormEl().addClass('ludo-filter-tree-input-active');
		this.treePanel.show();
		this.positionTree();
	},

	setValue:function (value) {
		this.input.setValue(value);
	},
	positionTree:function () {
		var pos = this.input.getEl().getCoordinates();
		this.treePanel.setPosition({
			left:pos.left,
			top:pos.top + this.input.getFormEl().getSize().y
		});
	},

	submit:function () {

		if (!this.getSelectedRecord()) {
			return;
		}
		this.fireEvent('submit', [this, this.getSelectedRecord()]);
	},

	selectRecord:function () {
		this.fireEvent('selectrecord', [this, this.treePanel.children[0].getSelectedRecord()]);
	},

	getSelectedRecord:function () {
		return this.treePanel.children[0].getSelectedRecord();
	},

	getParentRecord:function (record) {
		return this.treePanel.children[0].getParentRecord(record);
	}
});

