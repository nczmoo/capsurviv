class UI{

	constructor(){

	}

	refresh(){
		let eachOne = ['day', 'food', 'hours', 'hunger', 'money', 'social', 'thirst', 'time', 'water'];	
		for (let i in game.config.req){
			$("#" + i + "Req").html(game.config.req[i]);
		}
		for (let i of eachOne){
			$("#" + i).html(game.config[i].toLocaleString());
		}
		this.populateStores();
		this.populateWork();
	}

	populateStores(){
		let txt = '';
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
			txt += "<div class='ms-3 mt-3'>Store #" + (Number(i) + 1) + " ($" + game.config.stores[i].toLocaleString() + ")"
			+ " <button id='buyStore-" + i + "' class='verb1' " + buyStore + ">buy</button>"
			+ " $<span id='spendingAtStore-" + i + "' class='text-danger me-3'>-"
			+ game.spendingAtStores[i].toLocaleString()
			+ "</span>"
			+ "+" + i + " social"
			+ "</div>"
			+ "<div class='ms-5'>" 
			+ "<button id='noStore-" + i + "-food' class='verb2' " + noStoreFood + ">-</button>"
			+ "<button id='yesStore-" + i + "-food' class='verb2' " + yesStore + ">+</button>"			
			+ " food: <span id='storeFood-" + i + "'>" + game.buyingFromStores[i].food +  "</span>" 			
			+ "</div><div class='ms-5'>"
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
