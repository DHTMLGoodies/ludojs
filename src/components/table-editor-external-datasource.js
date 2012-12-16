ludo.TableEditorExternalDb = new Class({
	Extends:ludo.TableEditor,
	type:'TableEditorExternalDb',
	selectionGrid:null,
	tableFormatter:null,
	externalData:{
		currentView:null
	},
	cache:false,
	tableCache:{},

	dialogTableStyles:null,

	tableId:null,


	ludoConfig:function (config) {
		this.parent(config);
		this.cache = config.cache || this.cache;
	},

	ludoDOM:function () {
		this.parent();
		this.createTableFormatter();
	},

	createTableFormatter:function (config) {
		this.tableFormatter = new ludo.TableFormatter({
			remote:{
				url:'get-table-data.php'
			},
			els:{
				table:this.els.table
			}
		});
	},

	getTableContextMenu:function () {
		return this.parent();
	},

	getContextMenuConfig:function (el) {
		var tableAutoFormat = { label:'Table auto format', action:'formatTable' };
		if (this.hasTableDataSourceId()) {
			ret = [tableAutoFormat];
		} else {
			var ret = this.parent(el);
			ret.push({ spacer:true });
			ret.push({ label:'Insert external data', action:'insertExternalData' });

			if (this.hasCellExternalData(el)) {
				ret.push({ label:'Clear external data', action:'clearExternalData' });
			}

			ret.push({ spacer:true });
			ret.push(tableAutoFormat);
		}
		return ret;
	},

	hasCellExternalData:function (cell) {
		return cell.getProperty('dataSourceId') ? true : false;
	},

	hasTableDataSourceId:function () {
		return this.els.table.getProperty('dataSourceId') ? true : false;
	},


	clearExternalDataFromCell:function () {
		this.activeCell.setProperty('dataSourceId', null);
		this.activeCell.setProperty('dataSourceCoordinate', null);
		this.makeCellEditable(this.activeCell);
	},

	showData:function () {
		this.parent();
		if (this.data.dataSourceId) {
			this.els.table.setProperty('dataSourceId', this.data.dataSourceId);
		} else {
			this.els.table.removeProperty('dataSourceId');
		}
		this.els.table.setProperty('orientation', this.data.orientation);

		this.tableFormatter.formatTable();

		if (this.hasTableDataSourceId()) {
			this.makeAllCellsUneditable();
			this.makeAllCellsInFirstRowEditable();
		}

		this.fireEvent('showdata', this);
	},

	makeAllCellsInFirstRowEditable:function () {
		var row = this.getFirstRow();
		if (!row) {
			return;
		}
		var cells = row.getElements('td');
		for (var i = 0, count = cells.length; i < count; i++) {
			this.makeCellEditable(cells[i]);
		}
		this.makeCellEditable(this.els.caption);

	},

	applyTableStyleId:function (styleId) {
		this.els.table.setProperty('tableStyleId', styleId);
		this.tableFormatter.formatTable();
	},

	clickOnContextMenu:function (menuItem, menu) {
		switch (menuItem.action) {
			case 'insertExternalData':
				this.insertExternalData();
				break;
			case 'clearExternalData':
				this.clearExternalDataFromCell();
				break;
			case 'formatTable' :
				this.getDialogTableStyles().show();
				break;
		}
		this.parent(menuItem, menu);
	},

	getDialogTableStyles:function () {
		if (!this.dialogTableStyles) {
			this.dialogTableStyles = new ludo.Window({
				els:{
					parent:document.body
				},
				title:'Select Table Style',
				resizable:false,
				buttons:[
					{
						value:'Apply',
						listeners:{
							'click':function (btn, cmp) {
								this.applyTableStyleId(ludo.CmpMgr.get('frm-available-table-styles').getValue())
								cmp.hide();
							}.bind(this)
						}
					},
					{
						value:'Cancel',
						listeners:{
							'click':function (btn, cmp) {
								cmp.hide();
							}
						}
					}
				],
				left:200,
				top:100,
				width:400,
				height:140,
				children:[
					{
						type:'Panel',
						fullScreen:true,
						title:'Table Styles',
						children:[
							{
								type:'form.Select',
								id:'frm-available-table-styles',

								remote:{
									url:'get-table-data.php',
									params:{
										'getStyleNames':1
									}
								}
							}
						]
					}
				]
			});
		}
		return this.dialogTableStyles;
	},

	insertExternalData:function () {
		if (!this.selectionGrid) {
			this.createSelectionGrid();
		}
		this.selectionGrid.show();
	},


	getData:function () {
		var ret = this.parent();
		ret.id = this.els.table.getProperty('id');
		ret.dataSourceId = this.getDataSourceId();
		ret.orientation = this.getOrientation();
		ret.border = this.getBorder();
		if (ret.dataSourceid) {
			ret.cells = [ ret.cells[0] ];
		}
		return ret;
	},
	getOrientation:function () {
		return this.els.table.getProperty('orientation');
	},

	getBorder:function () {
		return this.els.table.getProperty('border');
	},

	getDataSourceId:function () {
		return this.els.table.getProperty('dataSourceId');
	},

	loadTable:function (id) {
		this.tableId = id;
		if (this.isCacheEnabled() && this.tableCache[id]) {
			this.data = this.tableCache[id];
			this.showData();
		} else {
			this.setRemoteParam('id', id);
			this.load();
		}
	},

	insertJSON:function (json) {
		this.parent(json);
		if (this.isCacheEnabled()) {
			this.tableCache[this.tableId] = json.data;
		}

	},

	isCacheEnabled:function () {
		return this.cache ? true : false;
	},

	setOrientation:function (orientation) {
		this.els.table.setProperty('orientation', orientation);
	},

	getDataForCell:function (cell) {
		var ret = this.parent(cell);
		ret.dataSourceId = cell.getProperty('dataSourceId');
		ret.dataSourceCoordinate = cell.getProperty('dataSourceCoordinate');
		ret.cellStyle = ret.cellStyle.replace(/[^0-9]/g, '');
		return ret;
	},

	getNewCell:function (cellConfig) {
		cellConfig = cellConfig || {};

		var cell = this.parent(cellConfig);
		if (cellConfig.dataSourceId) {
			this.makeCellUneditable(cell);
			cell.setProperty('dataSourceId', cellConfig.dataSourceId);
			cell.setProperty('dataSourceCoordinate', cellConfig.dataSourceCoordinate);
		}
		return cell;

	},

	updateCells:function (data) {
		var indexOfCell = this.getIndexOfActiveCell();

		for (var i = 0; i < data.length; i++) {
			var indexOfRow = this.getIndexOfActiveRow();
			for (var j = 0; j < data[i].length; j++) {
				if (indexOfRow >= this.getCountRows()) {
					this.appendRow();
				}
				var cell = this.getCellAt(indexOfRow, indexOfCell);
				if (cell) {
					var cellObj = data[i][j];
					this.setCellText(cell, cellObj.text);
					cell.setProperty('dataSourceId', this.selectionGrid.getRemoteParam('id'));
					cell.setProperty('dataSourceCoordinate', cellObj.coordinate);
				}
				indexOfRow++;

			}
			indexOfCell++;
		}
	},


	createSelectionGrid:function () {

		this.selectionGrid = new ludo.SelectionGrid({
			title:'Grid demo',
			cls:'database-grid',
			els:{
				parent:document.body
			},

			resizable:true,
			closable:false,
			movable:true,
			left:50,
			top:50,
			width:500,
			height:500,

			buttons:[
				{
					value:'Cancel',
					listeners:{
						click:function (btn, cmp) {
							cmp.hide();
						}
					}
				},
				{
					value:'OK',
					listeners:{
						click:function (btn, cmp) {
							var selectedCells = cmp.getSelectedCells();
							this.updateCells(selectedCells);
							this.selectionGrid.hide();
						}.bind(this)
					}
				}
			],
			listeners:{
				menuclick:function (obj, gridObj) {
					gridObj.setRemoteParam('id', obj.id);
					gridObj.load();
					this.externalData.currentView = obj.id;
				}.bind(this),
				selection:function (obj) {
					obj.setStatusText(obj.getSelection().start + '-' + obj.getSelection().end);
				},
				clearselection:function (obj) {
					obj.setStatusText();
				}
			},
			weight:0,

			remote:{
				url:'db-view-controller.php',
				params:{
					'getData':1,
					'id':'1'
				},
				pleaseWaitMessage:'Loading content...',
				menuConfig:{
					url:'db-view-controller.php',
					refreshInterval:1000,
					params:{
						getMenu:1
					}
				}
			}
		});
	}

});