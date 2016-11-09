TestCase("ViewTest", {


	"test listeners should have this assigned to the class": function(){
		// given
		var that;
		var v = new ludo.View({
			renderTo:document.body,
			listeners:{
				'render': function(){
					that = this;
				}
			}
		});

		// then
		assertEquals(that, v);
	},


	"test should dispose all children": function(){
		// given
		var dialog = this.getDialog('myDialog');
		dialog.getForm();

		// when
		dialog.remove();

		// then
		assertNotUndefined(dialog);
		assertNull(dialog.getEl());


		this.assertNoEvents(dialog);
		this.assertNoEvents(dialog.getLayout());
		this.assertNoEvents(ludo.get('myDialog-saveButton'));
		this.assertNoEvents(ludo.get('myDialog-cancelButton'));
		assertUndefined(dialog.formManager);

	},

	assertNoEvents:function(obj){
		if(!obj || !obj.$events)return;
		var events = obj.$events;
		if(!events)return;
		for(var key in events){
			if(events.hasOwnProperty(key)){
				for(var i=0;i<events[key].length;i++){
					assertUndefined(events[key][i]);
				}
			}
		}

		if(obj.getBody && obj.els && obj.getBody()){
			this.assertNoEvents(obj.getBody());
		}
		if(obj.els && obj.getEl && obj.getEl()){
			this.assertNoEvents(obj.getEl());
		}
	},

	getDialog:function(id){
		return new ludo.dialog.Dialog({
			title:'New global list style',
			id:id,
			form:{
				'resource':'BulletStyleGlobal',
				url:'../portal-controller.php',
				listeners:{
					'success' : function(){
						new ludo.Notification({
							html : 'New style has been saved successfully'
						});
					}
				}
			},
			layout:{
				width:400,
				height:200,
				type:'linear',
				orientation:'vertical'
			},
			children:[
				{
					type:'form.Text', label:'Style name', name:'STYLE_NAME',required:true
				},
				{
					type:'form.Color', label:'Bullet color', name:'BULLET_COLOR',required:true
				}
			],
			buttonBar:[
				{ type:'form.SubmitButton', value:'Save', id:id + '-saveButton' },
				{ type:'form.CancelButton', value:'Cancel', id:id + '-cancelButton' }
			]
		});
	}

});