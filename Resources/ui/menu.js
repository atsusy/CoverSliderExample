exports.createMenuView = function(args){
	var menuView = Ti.UI.createView({
	});

	var createTableViewRow = function(rowData){
		var row = Ti.UI.createTableViewRow({
			height:44,
			backgroundColor:'transparent',
			backgroundImage:'/images/row_bg.png'
		});

		var title = Ti.UI.createLabel({
			color:'white',
			left:8,
			width:Ti.UI.FILL,
			height:Ti.UI.FILL,
			text:rowData.title,
			font:{
				fontFamily:'Arial-BoldMT',
				fontWeight:'bold',
				fontSize:19
			}
		});
		row.add(title);

		if(rowData.hasDetail){
			var detail = Ti.UI.createImageView({
				right:90,
				image:'/images/arrow.png'
			});
			row.add(detail);
		}

		row.addEventListener('singletap', function(e){
			Ti.App.fireEvent('app:changeCover', e);
		});

		return row;
	};

	var menuTable = Ti.UI.createTableView({
		backgroundImage:'/images/table_bg.png',
		allowsSelection:false,
		separatorStyle:Ti.UI.iPhone.TableViewSeparatorStyle.NONE
	});
	menuView.add(menuTable);

	var rowDatas = [
		{ title:'Home', hasDetail:true },
		{ title:'Settings', hasDetail:true },
		{ title:'Logout' },
	];
	
	menuTable.data = rowDatas.map(function(rowData){
		return createTableViewRow(rowData);
	});

	return menuView;	
};

