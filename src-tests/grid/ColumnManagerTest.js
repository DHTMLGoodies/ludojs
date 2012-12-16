TestCase("ColumnManagerTest", {

	getManager:function(config) {
		config = config || {};
		return new ludo.grid.ColumnManager(config);

	},
	"test_should_be_able_to_specify_fill_view":function () {
		// given
		var manager = this.getManager({
			stretchLastColumn:true
		});
		// then
		assertTrue(manager.hasLastColumnDynamicWidth());
	},
	"test_should_be_able_to_specify_columns":function () {
		// given
		var manager = this.getManager({
			columns:{
				country:{
					heading:'Country'
				}
			}
		});

		// then
		assertNotUndefined(manager.getColumn('country'));
		assertEquals('Country', manager.getColumn('country').heading);
	},
	"test_should_be_able_to_get_column_keys":function () {
		// given
		var manager = this.getManager({
			columns:{
				country:{
					heading:'Country'
				},
				population:{
					heading:'Population'
				}
			}
		});

		// when
		var keys = manager.getLeafKeys();

		// then
		assertEquals(2, keys.length);
		assertEquals('country', keys[0]);
		assertEquals('population', keys[1]);
	},
	"test_should_be_able_to_get_visible_columns":function () {
		// given
		var manager = this.getManager({
			columns:{
				country:{
					heading:'Country'
				},
				population:{
					heading:'Population'
				},
				capital:{
					heading:'Capital',
					hidden:true
				}
			}
		});

		// when
		var columns = manager.getVisibleColumns();

		// then
		assertNotUndefined(columns.country);
		assertNotUndefined(columns.population);
		assertUndefined(columns.capital);
	},
	"test_should_be_able_to_get_heading_of_column":function () {
		// given
		var manager = this.getManager({
			columns:{
				country:{
					heading:'Country'
				},
				population:{
					heading:'Population'
				}
			}
		});
		// when
		var heading = manager.getHeadingFor('country');

		// then
		assertEquals('Country', heading);

	},
	"test_should_be_able_to_get_width_of_column":function () {
		// given
		var manager = this.getManager({
			columns:{
				country:{
					heading:'Country',
					width:200
				},
				population:{
					heading:'Population'
				}
			}
		});
		// when
		var width = manager.getWidthOf('country');

		// then
		assertEquals(200, width);

	},
	"test_should_be_able_to_move_column_up":function () {
		// given
		var manager = this.getManager({
			columns:{
				country:{
					heading:'Country'
				},
				population:{
					heading:'Population'
				},
				capital:{
					heading:'Capital'
				},
				area:{
					heading:'Area'
				}
			}
		});

		// when
		manager.insertColumnBefore('capital', 'population');
		var columns = manager.getLeafKeys();

		// then
		assertEquals('country', columns[0]);
		assertEquals('capital', columns[1]);
		assertEquals('population', columns[2]);
		assertEquals('area', columns[3]);
		assertEquals(4, columns.length);
	},
	"test_should_be_able_to_move_column_down":function () {
		// given
		var manager = this.getManager({
			columns:{
				country:{
					heading:'Country'
				},
				population:{
					heading:'Population'
				},
				capital:{
					heading:'Capital'
				},
				area:{
					heading:'Area'
				}
			}
		});

		// when
		manager.insertColumnBefore('country', 'area');
		var columns = manager.getLeafKeys();

		// then
		assertEquals('population', columns[0]);
		assertEquals('capital', columns[1]);
		assertEquals('country', columns[2]);
		assertEquals('area', columns[3]);
		assertEquals(4, columns.length);
	},
	"test_should_be_able_to_insert_columns_after":function () {
		// given
		var manager = this.getManager({
			columns:{
				country:{
					heading:'Country'
				},
				population:{
					heading:'Population'
				},
				capital:{
					heading:'Capital'
				},
				area:{
					heading:'Area'
				}
			}
		});

		// when
		manager.insertColumnAfter('country', 'area');
		var columns = manager.getLeafKeys();

		// then
		assertEquals('population', columns[0]);
		assertEquals('capital', columns[1]);
		assertEquals('area', columns[2]);
		assertEquals('country', columns[3]);
		assertEquals(4, columns.length);
	},
	"test_should_fire_move_column_event_when_moving_column":function () {
		// given
		var manager = this.getManager({
			columns:{
				country:{
					heading:'Country'
				},
				population:{
					heading:'Population'
				},
				capital:{
					heading:'Capital'
				},
				area:{
					heading:'Area'
				}
			}
		});
		var eventFired = false;

		// when
		manager.addEvent('movecolumn', function () {
			eventFired = true;
		});
		manager.insertColumnBefore('country', 'area');

		// then
		assertTrue(eventFired);
	},
	"test_should_be_able_to_determine_last_visible_column":function () {
		// given
		var manager = this.getManager({
			columns:{
				country:{
					heading:'Country'
				},
				population:{
					heading:'Population'
				},
				capital:{
					heading:'Capital'
				},
				area:{
					heading:'Area',
					hidden:true
				}
			}
		});

		// Then
		assertTrue(manager.isLastVisibleColumn('capital'));
	},
	"test_should_be_able_to_hide_column":function () {
		// given
		var manager = this.getManager({
			columns:{
				country:{
					heading:'Country'
				},
				population:{
					heading:'Population'
				},
				capital:{
					heading:'Capital'
				},
				area:{
					heading:'Area',
					hidden:true
				}
			}
		});
		var eventFired = false;

		// when
		manager.addEvent('hidecolumn', function () {
			eventFired = true;
		});

		manager.hideColumn('capital');

		// then
		assertTrue(eventFired);
		assertTrue(manager.isLastVisibleColumn('population'));
	},
	"test_should_be_able_to_show_column":function () {
		// given
		var manager = this.getManager({
			columns:{
				country:{
					heading:'Country'
				},
				population:{
					heading:'Population'
				},
				capital:{
					heading:'Capital'
				},
				area:{
					heading:'Area',
					hidden:true
				}
			}
		});
		var eventFired = false;

		// when
		manager.addEvent('showcolumn', function () {
			eventFired = true;
		});

		manager.showColumn('area');

		// then
		assertTrue(eventFired);
		assertTrue(manager.isLastVisibleColumn('area'));
	},
	"test_should_register_default_values_for_columns":function () {
		// given
		var manager = this.getManager({
			columns:{
				country:{
					heading:'Country'
				},
				population:{
					heading:'Population'
				},
				capital:{
					heading:'Capital'
				},
				area:{
					heading:'Area',
					hidden:true
				}
			}
		});

		// then
		assertNotUndefined(manager.getMinWidthOf('country'));
		assertNotUndefined(manager.getMaxWidthOf('country'));
		assertNotUndefined(manager.getWidthOf('country'));

	},
	"test_should_find_total_width_of_columns":function () {
		// given
		var manager = this.getManager({
			columns:{
				country:{
					heading:'Country',
					width:150
				},
				population:{
					heading:'Population',
					width:100
				},
				capital:{
					heading:'Capital',
					width:120
				},
				area:{
					heading:'Area',
					hidden:true,
					width:200
				}
			}
		});

		// then
		assertEquals(150 + 100 + 120, manager.getTotalWidth());
	},
	"test_should_be_able_to_set_width_of_column":function () {
		// given
		var manager = this.getManager({
			columns:{
				country:{
					heading:'Country',
					width:150
				},
				population:{
					heading:'Population',
					width:100
				},
				capital:{
					heading:'Capital',
					width:120
				},
				area:{
					heading:'Area',
					hidden:true,
					width:200
				}
			}
		});

		// when
		manager.setWidth('population', 220);

		// then
		assertEquals(220, manager.getWidthOf('population'));

	},
	"test_should_be_able_to_find_min_pos":function () {
		// given
		var manager = this.getManager({
			columns:{
				country:{
					heading:'Country',
					width:150,
					minWidth:100
				},
				population:{
					heading:'Population',
					width:100,
					minWidth:30
				},
				capital:{
					heading:'Capital',
					width:120,
					minWidth:40
				},
				area:{
					heading:'Area',
					hidden:true,
					width:200
				}
			}
		});

		// when
		var minPos = manager.getMinPosOf('capital');

		// then
		assertEquals(150 + 100 + 40, minPos);

	},
	"test_should_be_able_to_find_max_pos":function () {
		// given
		var manager = this.getManager({
			columns:{
				country:{
					heading:'Country',
					width:150,
					minWidth:100
				},
				population:{
					heading:'Population',
					width:100,
					minWidth:30
				},
				capital:{
					heading:'Capital',
					width:120,
					minWidth:40,
					maxWidth:200
				},
				area:{
					heading:'Area',
					hidden:true,
					width:200
				}
			}
		});

		// when
		var minPos = manager.getMaxPosOf('capital');

		// then
		assertEquals(150 + 100 + 200, minPos);

	},
	"test_should_be_able_to_determine_resizable_columns":function () {
		// given
		var manager = this.getManager({
			stretchLastColumn:true,
			columns:{
				country:{
					heading:'Country',
					width:150,
					minWidth:100
				},
				population:{
					heading:'Population',
					width:100,
					minWidth:30
				},
				capital:{
					heading:'Capital',
					width:120,
					minWidth:40,
					maxWidth:200
				},
				area:{
					heading:'Area',
					width:200
				}
			}
		});

		// then
		assertTrue(manager.isResizable('capital'));
		assertFalse('last column when stretch last column should not be resizable', manager.isResizable('area'));

		// when
		manager.hideColumn('area');

		// then
		assertFalse(manager.isResizable('capital'));
	},
	"test_should_find_last_visible":function () {
		// given
		var manager = this.getManager({
			stretchLastColumn:true,
			columns:{
				country:{
					heading:'Country',
					width:150,
					minWidth:100
				},
				population:{
					heading:'Population',
					width:100,
					minWidth:30
				},
				capital:{
					heading:'Capital',
					width:120,
					minWidth:40,
					maxWidth:200
				},
				area:{
					heading:'Area',
					width:200
				}
			}
		});

		// then
		assertEquals('area', manager.getLastVisible());
	},
	"test_should_be_able_to_increase_width":function () {
		// given
		var manager = this.getManager({
			stretchLastColumn:true,
			columns:{
				country:{
					heading:'Country',
					width:150,
					minWidth:100
				},
				population:{
					heading:'Population',
					width:100,
					minWidth:30
				},
				capital:{
					heading:'Capital',
					width:120,
					minWidth:40,
					maxWidth:200
				},
				area:{
					heading:'Area',
					width:200
				}
			}
		});

		// when
		manager.increaseWithFor('population', 50);

		// then
		assertEquals(150, manager.getWidthOf('population'))
	},
	"test_should_be_able_to_group_columns":function () {
		// given
		var manager = this.getManager({
			columns:{
				price:{
					heading:'Price',
					columns:{
						discountPrice:{
							heading:'Our price'
						},
						ordinaryPrice:{
							heading:'Ordinary price'
						}
					}
				}, label:{

				},
				description:{

				}
			}
		});

		// when
		var keys = manager.getLeafKeys();

		// then
		assertEquals(4, keys.length);
		assertEquals('discountPrice', keys[0]);
		assertEquals('ordinaryPrice', keys[1]);
		assertEquals('label', keys[2]);
		assertEquals('description', keys[3]);
	},
	"test_should_be_able_to_get_width_of_group":function () {
		// given
		var manager = this.getManager({
			columns:{
				price:{
					heading:'Price',
					columns:{
						discountPrice:{
							heading:'Our price',
							width:200
						},
						ordinaryPrice:{
							heading:'Ordinary price',
							width:150
						}
					}
				}
			}
		});

		// when
		var width = manager.getWidthOf('price');

		// then
		assertEquals(350, width);


		// given
		manager = this.getManager({
			columns:{
				info:{
					columns:{
						price:{
							heading:'Price',
							columns:{
								discountPrice:{
									heading:'Our price',
									width:200
								},
								ordinaryPrice:{
									heading:'Ordinary price',
									width:150
								}
							}
						},
						taxes:{
							width:250
						}

					}
				}

			}
		});

		// when
		width = manager.getWidthOf('info');

		// then
		assertEquals(600, width);

	},
	"test_should_register_parent_group_when_grouping":function () {
		// given
		var manager = this.getManager({
			columns:{
				price:{
					heading:'Price',
					columns:{
						discountPrice:{
							heading:'Our price',
							width:200
						},
						ordinaryPrice:{
							heading:'Ordinary price',
							width:150
						}
					}
				}
			}
		});

		// when
		var column = manager.getColumn('discountPrice');

		// then
		assertEquals('price', column.group);

	},
	"test_should_hide_columns_when_hiding_groups":function () {
		// given
		var manager = this.getManager({
			columns:{
				country:{

				},
				city:{

				},
				price:{
					heading:'Price',
					hidden:true,
					columns:{
						discountPrice:{
							heading:'Our price',
							width:200
						},
						ordinaryPrice:{
							heading:'Ordinary price',
							width:150
						}
					}
				}

			}
		});

		// then
		assertTrue(manager.isHidden('discountPrice'));
		assertTrue(manager.isLastVisibleColumn('city'));

	},
	"test_should_be_able_to_return_number_of_children_in_a_group":function () {
		// given
		var manager = this.getManager({
			columns:{
				country:{

				},
				city:{

				},
				price:{
					heading:'Price',
					columns:{
						discountPrice:{
							heading:'Our price',
							width:200
						},
						ordinaryPrice:{
							heading:'Ordinary price',
							width:150
						}
					}
				}

			}
		});

		// then
		assertEquals(2, manager.getChildCount('price'));

	},
	"test_should_not_be_able_to_move_last_column_in_a_group":function () {
		// given
		var manager = this.getManager({
			columns:{
				price:{
					heading:'Price',
					columns:{
						ordinaryPrice:{
							heading:'Ordinary price',
							width:150,
							movable:true
						}
					}
				}
			}
		});

		// then
		assertFalse(manager.isMovable('ordinaryPrice'));
	},
	"test_should_find_columns_in_same_group":function () {
		// given
		var manager = this.getManager({
			columns:{
				firstColumn:{

				},
				price:{
					heading:'Price',
					columns:{
						ordinaryPrice:{
							heading:'Ordinary price',
							width:150,
							movable:true
						},
						discountPrice:{

						}
					}
				}
			}
		});

		// then
		assertTrue(manager.isInSameGroup('ordinaryPrice', 'discountPrice'));
	},
	"test_should_be_able_to_move_column_away_from_a_group":function () {
		// given
		var manager = this.getManager({
			columns:{
				firstColumn:{

				},
				price:{
					heading:'Price',
					columns:{
						ordinaryPrice:{
							heading:'Ordinary price',
							width:150,
							movable:true
						},
						discountPrice:{

						}
					}
				}
			}
		});
		assertEquals(2, manager.getChildCount('price'));
		// when
		manager.insertColumnBefore('ordinaryPrice', 'firstColumn');
		var keys = manager.getLeafKeys();

		// then
		assertEquals(1, manager.getChildCount('price'));

		assertEquals('ordinaryPrice', keys[0]);
		assertEquals('firstColumn', keys[1]);
		assertEquals('discountPrice', keys[2]);
	},
	"test_should_be_able_to_remove_column_from_group":function () {
		// given
		var manager = this.getManager({
			columns:{
				firstColumn:{

				},
				price:{
					heading:'Price',
					columns:{
						ordinaryPrice:{
							heading:'Ordinary price',
							width:150,
							movable:true
						},
						discountPrice:{

						}
					}
				}
			}
		});

		// when
		manager.removeFromGroup('discountPrice');

		// then
		assertEquals(1, manager.getChildCount('price'));
		assertUndefined(manager.getColumn('discountPrice').group);
	},
	"test_should_be_able_to_move_column_within_a_group":function () {
		// given
		var manager = this.getManager({
			columns:{
				firstColumn:{

				},
				price:{
					heading:'Price',
					columns:{
						ordinaryPrice:{
							heading:'Ordinary price',
							width:150,
							movable:true
						},
						discountPrice:{

						}
					}
				}
			}
		});

		// when
		manager.insertColumnBefore('discountPrice', 'ordinaryPrice');
		var keys = manager.getLeafKeys();

		// then
		assertEquals('discountPrice', keys[1]);
		assertEquals('ordinaryPrice', keys[2]);

	},
	"test_should_be_able_to_get_id_of_columns_in_group":function () {
		// given
		var manager = this.getManager({
			columns:{
				firstColumn:{

				},
				price:{
					heading:'Price',
					columns:{
						ordinaryPrice:{
							heading:'Ordinary price',
							width:150,
							movable:true
						},
						discountPrice:{

						}
					}
				}
			}
		});

		// when
		var children = manager.getIdOfChildren('price');

		// then
		assertEquals(2, children.length);

	},
	"test_should_be_able_to_get_last_visible":function () {
		var manager = this.getManager({
			columns:{
				info:{
					columns:{
						'country':{
							heading:'Country',
							removable:false,
							sortable:true,
							movable:true,
							width:200,
							renderer:function (val) {
								return '<span style="color:blue">' + val + '</span>';
							}
						},
						'capital':{
							heading:'Capital',
							sortable:true,
							removable:true,
							movable:true,
							width:150
						}
					}
				},
				population:{
					heading:'Population',
					movable:true,
					removable:true
				}
			}
		});

		// when
		manager.insertColumnAfter('capital', 'population');

		// then
		assertEquals('capital', manager.getLastVisible());

	},
	"test_should_be_able_to_move_group_before_column":function () {
		// given
		var manager = this.getManager({
			columns:{
				firstColumn:{

				},
				price:{
					heading:'Price',
					columns:{
						ordinaryPrice:{
							heading:'Ordinary price',
							width:150,
							movable:true
						},
						discountPrice:{

						}
					}
				}
			}
		});

		// when
		manager.insertColumnBefore('price', 'firstColumn');
		var keys = manager.getLeafKeys();

		// then
		assertEquals('ordinaryPrice', keys[0]);
		assertEquals('discountPrice', keys[1]);
		assertEquals('firstColumn', keys[2]);


	},
	"test_should_be_able_to_move_group_after_column":function () {
		// given
		var manager = this.getManager({
			columns:{
				price:{
					heading:'Price',
					columns:{
						ordinaryPrice:{
							heading:'Ordinary price',
							width:150,
							movable:true
						},
						discountPrice:{

						}
					}
				},
				notLastColumn:{},
				lastColumn:{}
			}
		});

		// when
		manager.insertColumnAfter('price', 'lastColumn');
		var keys = manager.getLeafKeys();

		// then
		assertEquals('notLastColumn', keys[0]);
		assertEquals('lastColumn', keys[1]);
		assertEquals('ordinaryPrice', keys[2]);
		assertEquals('discountPrice', keys[3]);
	},
	"test_should_be_able_to_move_column_into_a_group":function () {
		// given
		var manager = this.getManager({
			columns:{
				price:{
					heading:'Price',
					columns:{
						ordinaryPrice:{
							heading:'Ordinary price',
							width:150,
							movable:true
						},
						discountPrice:{

						}
					}
				},
				notLastColumn:{},
				lastColumn:{}
			}
		});
		// when
		manager.insertColumnAfter('notLastColumn', 'ordinaryPrice');

		// then
		assertTrue(manager.isInAGroup('notLastColumn'));
		assertEquals(3, Object.keys(manager.getColumnsInGroup('price')).length);
	},
	"test_should_be_able_to_get_width_after_moving_column_into_a_group":function () {
		// given
		var manager = this.getManager({
			columns:{
				price:{
					heading:'Price',
					columns:{
						ordinaryPrice:{
							heading:'Ordinary price',
							width:150,
							movable:true
						},
						discountPrice:{
							width:120
						}
					}
				},
				notLastColumn:{ width:100 },
				lastColumn:{}
			}
		});
		// then
		assertEquals(270, manager.getWidthOf('price'));

		// when
		manager.insertColumnAfter('notLastColumn', 'ordinaryPrice');

		// then
		assertEquals(370, manager.getWidthOf('price'));
	},
	"test_should_be_able_to_insert_column_after_a_group":function () {

		var manager = this.getManager({
			columns:{
				info:{
					heading:'Country and Capital',
					headerAlign:'center',
					columns:{
						'country':{
							heading:'Country',
							removable:false,
							sortable:true,
							movable:true,
							width:200,
							renderer:function (val) {
								return '<span style="color:blue">' + val + '</span>';
							}
						},
						'capital':{
							heading:'Capital',
							sortable:true,
							removable:true,
							movable:true,
							width:150
						}
					}
				},
				population:{
					heading:'Population',
					movable:true,
					removable:true
				}
			}
		});

		// when
		var index = manager.getInsertionPoint('info', 'after');
		assertEquals(manager.columnKeys.indexOf('capital'), index);

		manager.insertColumnAfter('population', 'info');

		var row1 = manager.getColumnsInRow(0);
		assertEquals('info', row1[0]);
		assertEquals('population', row1[1]);

		var row2 = manager.getColumnsInRow(1);
		assertEquals('country', row2[0]);
		assertEquals('capital', row2[1]);
		assertEquals('population', row2[2]);
		assertFalse(manager.isInAGroup('population'));

	},
	"test_should_be_able_to_get_min_width_of_group":function () {
		// given
		var manager = this.getManager({
			columns:{
				price:{
					heading:'Price',
					columns:{
						ordinaryPrice:{
							heading:'Ordinary price',
							minWidth:170,
							movable:true
						},
						discountPrice:{
							minWidth:200
						}
					}
				},
				notLastColumn:{},
				lastColumn:{}
			}
		});

		// Then
		assertEquals(370, manager.getMinWidthOf('price'));

		// given
		manager = this.getManager({
			columns:{
				summary:{
					columns:{
						price:{
							heading:'Price',
							columns:{
								ordinaryPrice:{
									heading:'Ordinary price',
									minWidth:170,
									movable:true
								},
								discountPrice:{
									minWidth:200
								}
							}
						},
						info:{
							minWidth:200
						}
					}
				},
				notLastColumn:{},
				lastColumn:{}
			}
		});

		// Then
		assertEquals(570, manager.getMinWidthOf('summary'));


	},
	"test_should_be_able_to_get_number_of_header_rows":function () {
		// given
		var manager = this.getManager({
			columns:{
				summary:{
					columns:{
						price:{
							heading:'Price',
							columns:{
								ordinaryPrice:{
									heading:'Ordinary price',
									minWidth:170,
									movable:true
								},
								discountPrice:{
									minWidth:200
								}
							}
						},
						info:{
							minWidth:200
						}
					}
				},
				notLastColumn:{},
				lastColumn:{}
			}
		});

		// then
		assertEquals(3, manager.getCountRows());

		// given
		manager = this.getManager({
			columns:{
				price:{
					heading:'Price',
					columns:{
						ordinaryPrice:{
							heading:'Ordinary price',
							minWidth:170,
							movable:true
						},
						discountPrice:{
							minWidth:200
						}
					}
				},
				notLastColumn:{},
				lastColumn:{}
			}
		});
		// then
		assertEquals(2, manager.getCountRows());

		// given
		manager = this.getManager({
			columns:{
				price:{
				},
				notLastColumn:{},
				lastColumn:{}
			}
		});
		// then
		assertEquals(1, manager.getCountRows());
	},
	"test_should_be_able_to_retrieve_row_span_of_columns":function () {
		// given
		var manager = this.getManager({
			columns:{
				summary:{
					columns:{
						price:{
							heading:'Price',
							columns:{
								ordinaryPrice:{
									heading:'Ordinary price',
									minWidth:170,
									movable:true
								},
								discountPrice:{
									minWidth:200
								}
							}
						},
						info:{
							minWidth:200
						}
					}
				},
				notLastColumn:{},
				lastColumn:{}
			}
		});

		// then
		assertEquals('Key: info', 2, manager.getRowSpanOf('info'));
		assertEquals('Key: ordinaryPrice', 1, manager.getRowSpanOf('ordinaryPrice'));
		assertEquals('Key: price', 1, manager.getRowSpanOf('price'));
		assertEquals('Key: summary', 1, manager.getRowSpanOf('summary'));
		assertEquals('Key: summary', 3, manager.getRowSpanOf('notLastColumn'));

	},
	"test_should_be_able_to_retrieve_header_columns_in_specific_row":function () {
		// given
		var manager = this.getManager({
			columns:{
				summary:{
					columns:{
						price:{
							heading:'Price',
							columns:{
								ordinaryPrice:{
									heading:'Ordinary price',
									minWidth:170,
									movable:true
								},
								discountPrice:{
									minWidth:200
								}
							}
						},
						info:{
							minWidth:200
						}
					}
				},
				notLastColumn:{},
				lastColumn:{}
			}
		});

		// when
		var columns = manager.getColumnsInRow(0);

		// then
		assertEquals(3, columns.length);
		assertEquals('summary', columns[0]);
		assertEquals('notLastColumn', columns[1]);
		assertEquals('lastColumn', columns[2]);

		// when
		columns = manager.getColumnsInRow(1);

		// then
		assertEquals(4, columns.length);
		assertEquals('price', columns[0]);
		assertEquals('info', columns[1]);
		assertEquals('notLastColumn', columns[2]);
		assertEquals('lastColumn', columns[3]);


		// when
		columns = manager.getColumnsInRow(2);

		// then
		assertEquals(5, columns.length);
		assertEquals('ordinaryPrice', columns[0]);
		assertEquals('discountPrice', columns[1]);
		assertEquals('info', columns[2]);
		assertEquals('notLastColumn', columns[3]);
		assertEquals('lastColumn', columns[4]);


	}
});