class UI{
	colorDelay = 500;
	deltaTimeouts = [];

	flashDelay = 1500;
	constructor(){

	}

	refresh(){
		let eachOne = ['day', 'food', 'hours', 'hunger', 'money', 'sanity', 'social', 'thirst', 'time', 'water'];	
		for (let i in game.config.req){
			$("#" + i + "Req").html(game.config.req[i]);
			if (game.config[i] < game.config.req[i]){
				$("#" + i).addClass('text-danger');
				$("#" + i).removeClass('text-success');
			} else if (game.config[i] > game.config.req[i]){
				$("#" + i).addClass('text-success');
				$("#" + i).removeClass('text-danger');
			}
		}
		if (game.config.food + game.config.hunger > game.config.req.hunger){
			$("#hunger").addClass('text-success');
			$("#hunger").removeClass('text-danger');
		}
		if (game.config.water + game.config.thirst > game.config.req.thirst){
			$("#thirst").addClass('text-success');
			$("#thirst").removeClass('text-danger');
		}
		for (let i of eachOne){
			$("#" + i).html(game.config[i].toLocaleString());
		}
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
		console.log(selector, color);
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

	populateRestaurants(){
		let txt = "<div class='fw-bold mt-3'>restaurants ("
		
		for (let foodOption in game.config.restaurantOptions){
			let food = game.config.restaurantOptions[foodOption];
			console.log(game.config.preferences.food);
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
		let txt = "<div class='fw-bold mt-3'>stores (<span class='text-danger'>-1h</span>)</div>";
		for (let i = 0; i < 3; i++){
			let yesStore = ' ', noStoreFood = ' ', noStoreWater = ' ', buyStore = '';
			if (game.buyingFromStores[i].food < 1){
				noStoreFood = ' disabled ';
			}
			if (game.buyingFromStores[i].water < 1){
				noStoreWater = ' disabled ';
			}
			if (game.config.money < game.spendingAtStores[i] + game.config.stores[i]){
				yesStore = ' disabled ';
			}
			if (game.spendingAtStores[i] < 1 || game.config.hours < 1){
				buyStore = ' disabled ';
			}
			txt += "<div class='ms-3'>Store #" + (Number(i) + 1) + " ($" + game.config.stores[i].toLocaleString() + ")"
			+ " <button id='buyStore-" + i + "' class='verb1' " + buyStore + ">buy</button>"
			+ " $<span id='spendingAtStore-" + i + "' class='text-danger me-3'>-"
			+ game.spendingAtStores[i].toLocaleString()
			+ "</span>"
			+ " +" + i + " social"
			+ " +" + game.sanityCheck(i, 'stores') + " sanity "
			+ "</div>"
			+ "<div class='ms-5'>" 
			+ "<button id='noStore-" + i + "-food' class='verb2' " + noStoreFood + ">-</button>"
			+ "<button id='yesStore-" + i + "-food' class='verb2' " + yesStore + ">+</button>"			
			+ " food: <span id='storeFood-" + i + "'>" + game.buyingFromStores[i].food +  "</span>" 			
			+ "</div><div class='ms-5 mb-3'>"
			+ "<button id='noStore-" + i + "-water' class='verb2' " + noStoreWater + ">-</button>"
			+ "<button id='yesStore-" + i + "-water' class='verb2' " + yesStore + ">+</button>"
			
			+ " water: <span id='storeWater-" + i + "'>" + game.buyingFromStores[i].water +  "</span>" 
			+ "</div>"
		}
		$("#stores").html(txt);
	}

	populateWork(){
		let txt = "<div class='fw-bold mt-3'>work</div>";
		for (let i = 0; i < 3; i++){
			let promoteDisabled = '', workDisabled = '';
			if (!game.config.work[i] || game.config.hours < 1){
				workDisabled = ' disabled ';
			}
			if (game.config.social < game.config.promotion[i]){
				promoteDisabled = ' disabled ';
			}
			txt += "<div class='ms-3'>"

				+ "<button id='promote-" + i + "' class='verb1' " + promoteDisabled 
				+ ">&uarr; [-" + game.config.promotion[i] +" social]</button>"
				+ "<button id='work-" + i + "' class='verb1' " + workDisabled + ">work(" + game.config.socialClass[i] 
				+ ")</button> 1h -> +$" + game.config.wages[i].toLocaleString() 
				+ "</div>"
		}
		$("#work").html(txt);
	}

	status(msg){
		$("#status").html(msg);
	}
}
