var CoverSlider = require('/lib/coverSlider');

var window = Ti.UI.createWindow();

var menu = (require('/ui/menu')).createMenuView({

});
window.add(menu);

var home = (require('/ui/home')).createHomeView({
	width:320,
	height:460
});
window.add(home);

var settings = (require('/ui/settings')).createSettingsView({
	width:320,
	height:460,
	visible:false
});
window.add(settings);

var detail = Ti.UI.createView({
	backgroundColor:'#333'
});
window.add(detail);

var covers = [home, settings];

var coverSlider = CoverSlider.createCoverSlider({
	left:menu,
	cover:covers[0],
	right:detail
});

Ti.App.addEventListener('app:changeCover', function(e){
	if(covers[e.index]){
		coverSlider.changeCover(covers[e.index]);
	}
});

Ti.App.addEventListener('app:toggleCover', function(e){
	if(coverSlider.current() === 'cover'){
		coverSlider.slideCover('left');
	}else{
		coverSlider.slideCover('cover');
	}
});

window.open();

