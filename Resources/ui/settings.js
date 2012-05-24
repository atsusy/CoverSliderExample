exports.createSettingsView = function(args){
	var view = Ti.UI.createView({
		backgroundColor:'white'
	});

	// 2.0ならバッチレイアウト使うべきところ...
	if(args){
		for(var arg in args){
			view[arg] = args[arg]
		}
	}

	var flexSpace = Ti.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});

	var title = Ti.UI.createLabel({
		text:'Setting',
		color:'white',
		shadowColor:'#666',
		shadowOffset:{x:0.0, y:1.0},
		font:{
			fontSize:24,
			fontWeight:'bold'
		}
	});

	var toMenu = Ti.UI.createButton({
	  	style:Ti.UI.iPhone.SystemButtonStyle.DONE,
		image:'/images/menu.png',
		width:32,
		height:32,
	});

	var bar = Ti.UI.createToolbar({
		items:[toMenu, flexSpace, title, flexSpace],
		top:0,
		barColor:'#f32',
		height:44,
	});
	view.add(bar);

	toMenu.addEventListener('click', function(){
		Ti.App.fireEvent('app:toggleCover');
	});

	return view;
};