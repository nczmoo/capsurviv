$(document).on('click', '', function(e){

});

$(document).on('click', '.verb0', function(e){
	console.log(e.target.id);
	game[e.target.id]();
});

$(document).on('click', '.verb1', function(e){
	
	game[e.target.id.split('-')[0]](e.target.id.split('-')[1]);
});

$(document).on('click', '.verb2', function(e){
	
	game[e.target.id.split('-')[0]](e.target.id.split('-')[1], e.target.id.split('-')[2]);
});

$(document).on('click', '.verb3', function(e){
	
	game[e.target.id.split('-')[0]](e.target.id.split('-')[1], e.target.id.split('-')[2], e.target.id.split('-')[3]);
});

$(document).on('click', 'button', function(e){
	ui.refresh()
})
