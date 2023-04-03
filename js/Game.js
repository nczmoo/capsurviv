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
		this.config.social += storeID;
		this.config.hours --;
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
		this.config.day++;
		this.config.hours = this.config.hoursPerDay;
		this.config.time -= this.config.hoursPerDay;
		let currentPenalty = 0;
		this.consume('food');
		if (this.config.hunger < this.config.req.hunger){
			currentPenalty += (1 - (this.config.hunger / this.config.req.hunger )) * this.config.penalty;
		}
		this.consume('water');
		if (this.config.thirst < this.config.req.thirst){
			currentPenalty += (1 - (this.config.thirst / this.config.req.thirst )) * this.config.penalty;
		}
		let losing = this.config.time * (currentPenalty / 100);
		ui.status("You lost " + losing.toLocaleString() + " hours from thirst and/or hunger.");
		this.config.time -= losing;
	}

	noStore(storeID, what){		
		if (this.buyingFromStores[storeID][what] < 1){
			return;
		}
		this.buyingFromStores[storeID][what]--;
		this.spendingAtStores[storeID] -= this.config.stores[storeID];
	}

	promote(socialID){
		if (this.config.social < this.config.promotion[socialID]){
			return;
		}
		this.config.social -= this.config.promotion[socialID];
		this.config.promotion[socialID] *= 2;
		if (!this.config.work[socialID] ){
			this.config.work[socialID] = true;
			ui.status("You can now work here.");
			return;
		}
		let newWage = this.config.wages[socialID] * 1.01;
		ui.status("Your wage went from $" + this.config.wages[socialID] + " to $" + newWage);
		this.config.wages[socialID] = newWage;
	}

	work(socialClassID){
		if (this.config.hours < 1){
			return;
		}
		this.config.money += this.config.wages[socialClassID];
		this.config.hours --;
	}

	yesStore(storeID, what){
		
		if (this.config.money < this.spendingAtStores[storeID] + this.config.stores[storeID]){
			return;
		}
		this.buyingFromStores[storeID][what]++;
		this.spendingAtStores[storeID] += this.config.stores[storeID];
	}


}
