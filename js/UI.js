class UI{
	colorDelay = 500;
	deltaTimeouts = [];

	flashDelay = 1500;
	storesShown = false;
	constructor(){

	}

	refresh(){
		let eachOne = ['day', 'food', 'hours', 'hunger', 'money', 'sanity', 'social', 'thirst', 'time', 'water'];	
		for (let i in game.config.req){
			$("#" + i + "Req").html(game.config.req[i]);
			if (game.config[i] < game.config.req[i]){
				$("#" + i).addClass('text-danger');
				$("#" + i).removeClass('text-success');
			} else if (game.config[i] >= game.config.req[i]){
				$("#" + i).addClass('text-success');
				$("#" + i).removeClass('text-danger');
			}
		}
		if (game.config.food + game.config.hunger >= game.config.req.hunger){
			$("#hunger").addClass('text-success');
			$("#hunger").removeClass('text-danger');
		}
		if (game.config.water + game.config.thirst >= game.config.req.thirst){
			$("#thirst").addClass('text-success');
			$("#thirst").removeClass('text-danger');
		}
		for (let i of eachOne){
			$("#" + i).html(game.config[i].toLocaleString());
		}
		this.populateRecreation();
		this.populateRestaurants();
		this.populateStores();
		this.populateWork();

	}

	delta(id, color, quantity){
		$("#" + id + "Delta").html("(" + quantity + ")");
		$("#" + id + "Delta").removeClass('d-none');
		if (color == 'green'){
			$("#" + id + "Delta").addClass('text-success');
			$("#" + id + "Delta").removeClass('text-danger');
		} else if (color == 'red'){
			$("#" + id + "Delta").removeClass('text-success');
			$("#" + id + "Delta").addClass('text-danger');			
		}
		this.deltaTimeouts[id] = setTimeout(function(){
			$("#" + id + "Delta").addClass('d-none');
		}, this.colorDelay);
	}
	flash(selector, color){
		$(selector).addClass('fw-bold');
		setTimeout(function(){
			$(selector).removeClass('fw-bold');
		}, this.flashDelay);
		if (color == 'red'){
			$(selector).addClass('text-danger');
			setTimeout(function(){
				$(selector).removeClass('text-danger');
			}, this.colorDelay);
		} else if (color == 'green'){
			$(selector).addClass('text-success');
			setTimeout(function(){
				$(selector).removeClass('text-success');
			}, this.colorDelay);
		}
		
	}

	populateRecreation(){		
		let txt = "<div class='fw-bold'>recreation</div>";
		for (let i in game.config.recreation){
			let recDisabled = '';
			let rec = game.config.recreation[i];			
			let socialCaption = " and 4-8 social";
			if (game.config.money < game.config.recreationCosts[i] 
				|| game.config.hours < game.config.recreationHours[i]){
				recDisabled = ' disabled ';
			}
			txt += "<div class='ms-3'>"
				+ "<button id='recreation-" + i + "' class='verb1 btn btn-lg btn-secondary' " + recDisabled + ">" + rec + "</button>"
				+ "</div><div class='ms-4'>("
				+ " -$" + game.config.recreationCosts[i]
				+ " -" + game.config.recreationHours[i] + "h)"
				+ " +" + (Number(game.sanityCheck(i, 'recreation')) + 1) + " sanity";
			if (rec == 'clubbing'){
				txt += socialCaption;
			}
			txt += "</div>";
		}
		$("#recreation").html(txt);
	}

	populateRestaurants(){
		let txt = "<div class='fw-bold mt-3'>restaurants ("
		
		for (let foodOption in game.config.restaurantOptions){
			let food = game.config.restaurantOptions[foodOption];			
			txt += " " + food + " +" + game.sanityCheck(foodOption, 'food') + " sanity " ;
			if (foodOption != game.config.restaurantOptions.length - 1){
				txt += "/";
			}
		}

		txt += ")</div>";
		for (let i = 0; i < 3; i++){			
			let buyRestaurant = '';

			if (game.config.hours < i + 1){
				buyRestaurant = ' disabled ';
			}
			txt += "<div class='ms-3'>Restaurant" 
			+ " -" + (Number(i) + 1) + "h"
			+ " +" + (Number(i) + 1) + " social"
			+ " +" + game.sanityCheck(i, 'restaurants') + " sanity "
			+ "</div>"
			+ "<div class='ms-5'>";
			for (let foodOption in game.config.restaurantOptions){
				let food = game.config.restaurantOptions[foodOption];
				if (game.config.restaurantModifier[foodOption] * game.config.restaurants[i]){
					buyRestaurant = ' disabled ';
				}
				txt += "<button id='buyRestaurant-" + i + "-" + food +"' " + buyRestaurant + ">" + food  + " -$" 
				+ (game.config.restaurantModifier[foodOption] * game.config.restaurants[i]) + "</button>"
			}
			txt += "</div>"
		}
		$("#restaurants").html(txt);
	}

	populateStores(){
		let txt = "<div class='fw-bold mt-3'>stores (<span class='text-danger'>-1h</span>)</div><div class='row'>";
		for (let i = 0; i < 3; i++){
			let yesStore = ' ', yesStore5 = '', buyStore = '';
			let noStoreFood = ' ', noStoreFood5 = ' ', noStoreWater = ' ', noStoreWater5 = '';
			
			if (game.buyingFromStores[i].food < 1){
				noStoreFood = ' disabled ';
			}
			if (game.buyingFromStores[i].food < 5){
				noStoreFood5 = ' disabled ';
			}
			if (game.buyingFromStores[i].water < 1){
				noStoreWater = ' disabled ';
			}
			if (game.buyingFromStores[i].water < 5){
				noStoreWater5 = ' disabled ';
			}
			if (game.config.money < game.spendingAtStores[i] + game.config.stores[i] ){
				yesStore = ' disabled ';
			}
			if (game.config.money < game.spendingAtStores[i] + (game.config.stores[i] * 5)){
				yesStore5 = ' disabled ';
			}
			if (game.spendingAtStores[i] < 1 || game.config.hours < 1){
				buyStore = ' disabled ';
			}
			txt += "<div class='col-lg'><div class='ms-3 mb-3 '>Store #" + (Number(i) + 1) + " ($" + game.config.stores[i].toLocaleString() + ") " 
			
			+ " +" + i + " social"
			+ " +" + game.sanityCheck(i, 'stores') + " sanity "
			+ " <button id='buyStore-" + i + "' class='verb1 btn btn-lg btn-danger' " + buyStore + ">buy</button>"
			+ " <span id='spendingAtStore-" + i + "' class='text-danger me-3'>"
			+ "-$" + game.spendingAtStores[i].toLocaleString()
			+ "</span>"
			+ "</div><div class='ms-5'>" 
			+ "<button id='noStore-" + i + "-food-5' class='verb3 btn btn-lg btn-outline-danger' " + noStoreFood5 + ">-5</button>"
			+ "<button id='noStore-" + i + "-food-1' class='verb3 btn btn-lg btn-outline-danger' " + noStoreFood + ">-1</button>"
			+ "<button id='zeroStore-" + i + "-food' class='verb2 btn btn-lg btn-outline-warning' " + noStoreFood + ">[ 0 ]</button>"
			+ "<button id='yesStore-" + i + "-food-1' class='verb3 btn btn-lg btn-outline-success' " + yesStore + ">+1</button>"			
			+ "<button id='yesStore-" + i + "-food-5' class='verb3 btn btn-lg btn-outline-success' " + yesStore5 + ">+5</button>"
			+ " food: <span id='storeFood-" + i + "'>" + game.buyingFromStores[i].food +  "</span>" 			
			+ "</div><div class='ms-5 mb-5'>"
			+ "<button id='noStore-" + i + "-water-5' class='verb3 btn btn-lg btn-outline-danger' " + noStoreWater5 + ">-5</button>"
			+ "<button id='noStore-" + i + "-water-1' class='verb3 btn btn-lg btn-outline-danger' " + noStoreWater + ">-1</button>"
			+ "<button id='zeroStore-" + i + "-water' class='verb2 btn btn-lg btn-outline-warning' " + noStoreWater + ">[ 0 ]</button>"
			+ "<button id='yesStore-" + i + "-water-1' class='verb3 btn btn-lg btn-outline-success' " + yesStore + ">+1</button>"
			+ "<button id='yesStore-" + i + "-water-5' class='verb3 btn btn-lg btn-outline-success' " + yesStore5 + ">+5</button>"
			
			+ " water: <span id='storeWater-" + i + "'>" + game.buyingFromStores[i].water +  "</span>" 
			+ "</div></div>"
		}
		txt += "</div>";
		$("#stores").html(txt);
	}

	populateWork(){
		let txt = "<div class='fw-bold mt-3'>work (<span class='text-danger'>-1h</span>)</div>";
		for (let i = 0; i < 3; i++){
			let promoteDisabled = '', workDisabled = '';
			if (!game.config.work[i] || game.config.hours < 1){
				workDisabled = ' disabled ';
			}
			if (game.config.social + game.config.workRep[i] < game.config.promotion[i] || game.config.hours < 1){
				promoteDisabled = ' disabled ';
			}
			txt += "<div class='ms-3 mt-3'>"
				+ game.config.socialClass[i] + "-class: "
				+ "</div><div class='ms-5'>"
				+ "<button id='promote-" + i + "' class='verb1 ms-1 btn btn-lg btn-success' " + promoteDisabled 
				+ ">promote [-" + game.config.promotion[i] +" social]</button>"
				+ "<button id='work-" + i + "' class='verb1 btn btn-lg btn-primary' " + workDisabled + ">work"
				+ " +$" + game.config.wages[i].toLocaleString() + "</button>"			
				+ "</div>";
			if (game.config.work[i]){
				let deltaCaption = '[+0]';
				if (game.config.workToday[i] > 8){
					deltaCaption = "[+" + (game.config.workToday[i] - 8) + "]";
				}
				txt += "<div class='ms-5'>"
					
					+ game.config.workRep[i] 					
					+ " rep" + deltaCaption 
					+ " " + game.config.workToday[i] + "h "
					+ "</div>";
			}
		}
		$("#work").html(txt);
	}

	status(msg){
		$("#status").html(msg);
	}
}
