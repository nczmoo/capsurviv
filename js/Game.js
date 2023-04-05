class Game{
	config = new Config();
	buyingFromStores = [];
	spendingAtStores = [];
	
	constructor(){
		for (let i = 0; i < this.config.stores.length; i++){
			this.buyingFromStores.push({food: 0, water: 0});
			this.spendingAtStores.push(0);
		}
	}

	buyStore(storeID){
		if (this.config.money < this.spendingAtStores[storeID] || this.config.hours < 1){
			return;
		}
		this.config.food += this.buyingFromStores[storeID].food;
		this.config.water += this.buyingFromStores[storeID].water;
		this.config.money -= this.spendingAtStores[storeID];
		this.spendingAtStores[storeID] = 0;
		this.buyingFromStores[storeID].water = 0;
		this.buyingFromStores[storeID].food = 0;
		this.config.social += Number(storeID);
		this.config.sanity += this.sanityCheck(storeID, 'stores');		
		this.timePasses(1);
	}

	consume(foodOrWater){
		let req = 'thirst';
		if (foodOrWater == 'food'){
			req = 'hunger';
		}
		if (this.config[foodOrWater] >= this.config.req[req]){
			this.config[req] += this.config.req[req];
			this.config[foodOrWater] -= this.config.req[req];
			return;		
		}
		this.config.hunger -= this.config[foodOrWater];
		this.config[foodOrWater] = 0;
	}

	nextDay(){
		let txt = '';
		this.config.day++;
		this.config.hours = this.config.hoursPerDay;
		if (this.config.sanity < this.config.req.sanity){
			this.config.hours -= this.config.req.sanity - this.config.sanity;
			txt += "You lost " + (this.config.req.sanity - this.config.sanity) + " hour(s) from today because of your sanity.";
		}
		this.config.time -= this.config.hoursPerDay;
		this.config.sanity--;
		let currentPenalty = 0;
		this.consume('food');
		if (this.config.hunger < this.config.req.hunger){
			currentPenalty += (1 - (this.config.hunger / this.config.req.hunger )) * this.config.penalty;
		}
		this.config.hunger = 0;
		this.consume('water');
		if (this.config.thirst < this.config.req.thirst){
			currentPenalty += (1 - (this.config.thirst / this.config.req.thirst )) * this.config.penalty;
		}
		this.config.thirst = 0;
		let losing = this.config.time * (currentPenalty / 100);
		if (losing > 0){
			txt += " You lost " + losing.toLocaleString() + " hours from thirst and/or hunger.";
		}
		for (let i in this.config.work){
			if (this.config.workToday[i] - 8 > 0){
				this.config.workRep[i] += this.config.workToday[i] - 8;
			}
			this.config.workToday[i] = 0;
		}

		for (let i in this.config.recreation){
			this.config.recreationToday[i] = 0;
		}
		
		ui.status(txt);
		this.config.time -= losing;
	}

	noStore(storeID, what, quantity){	
		quantity = Number(quantity);	
		if (this.buyingFromStores[storeID][what] < quantity){
			return;
		}
		this.buyingFromStores[storeID][what] -= quantity;
		this.spendingAtStores[storeID] -= this.config.stores[storeID] * quantity;
	}

	promote(socialID){
		if (this.config.social + this.config.workRep[socialID] < this.config.promotion[socialID]){
			return;
		}
		ui.delta('social', 'red', "-" + this.config.promotion[socialID]);		
		
		this.config.workRep[socialID] -= this.config.promotion[socialID];		
		if (this.config.workRep[socialID] < 0){
			this.config.social += this.config.workRep[socialID];
			this.config.workRep[socialID] = 0;
		}
		this.config.promotion[socialID] *= 2;				
		this.timePasses(1);
		ui.delta('hours', 'red', "-1");
		if (!this.config.work[socialID] ){
			this.config.work[socialID] = true;
			ui.status("You can now work at this " + this.config.socialClass[socialID] + "-class job.");
			return;
		}
		let newWage = this.config.wages[socialID] * (1 + this.config.raise);
		ui.status("Your wage went from $" + this.config.wages[socialID] + " to $" + newWage);
		this.config.wages[socialID] = newWage;
		
	}

	recreation(id){		
		if (this.config.money < this.config.recreationCosts[id] || this.config.hours < this.config.recreationHours[id]){
			return;
		}
		let sanityDelta = (Number(game.sanityCheck(id, 'recreation')) + 1)
		if (this.config.recreation[id] == 'clubbing'){
			let socialBonus = randNum (4, 8);
			this.config.social += socialBonus;
			ui.delta('social', 'green', "+" + socialBonus);
		}
		this.config.money -= this.config.recreationCosts[id];		
		this.timePasses(this.config.recreationHours[id]);
		this.config.sanity += sanityDelta;
		this.config.recreationToday[id]++;

		ui.delta('sanity', 'green', "+" + sanityDelta);
		ui.delta('hours', 'red', "-" + this.config.recreationHours[id]);
		ui.delta('money', 'red', "-" + this.config.recreationCosts[id]);
	}

	sanityCheck(id, where){
		id = Number(id);
		if (where == 'recreation'){
			let recSanity =  this.config.preferences[where].indexOf(id) + 1 - this.config.recreationToday[id];
			if (recSanity < -1){
				recSanity = -1;
			}
			return recSanity;
		}
		if (!this.config.preferences[where].includes(id)){			
			return 0;
		}
		return this.config.preferences[where].indexOf(id) + 1;
	}
	
	timePasses(n){
		ui.delta('hours', 'red', '-' + n);
		this.config.hours -= n;
		if ($("#autoNext").is(':checked') && this.config.hours < 1){
			this.nextDay();			
		}
	}

	work(socialClassID){
		if (this.config.hours < 1){
			return;
		}
		if (!ui.storesShown){
			$("#stores").removeClass('d-none');
			ui.storesShown = true;
		}
		this.config.money += this.config.wages[socialClassID];
		this.timePasses(1);
		this.config.workToday[socialClassID]++;
		ui.delta('money', 'green', "+" + this.config.wages[socialClassID]);
	}

	yesStore(storeID, what, quantity){
		quantity = Number(quantity);
		if (this.config.money < this.spendingAtStores[storeID] + (this.config.stores[storeID] * quantity )){
			return;
		}
		this.buyingFromStores[storeID][what] += quantity;
		this.spendingAtStores[storeID] += this.config.stores[storeID] * quantity;
	}

	zeroStore(storeID, what){
		if (this.buyingFromStores[storeID][what] < 1){
			return;
		}
		this.spendingAtStores[storeID] -= this.config.stores[storeID] * this.buyingFromStores[storeID][what];
		this.buyingFromStores[storeID][what] = 0;		
	}
}
