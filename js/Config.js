class Config {
	day = 1;
    food = 0;
	
	hours = 10;
	hoursPerDay = 10;
	hunger = 0;
	money = 0;	
	penalty = 10;
	preferences = {

	};
	promotion = [1, 10, 100];
	req = {
		hunger: null, sanity: null, thirst: null
	};
	restaurantOptions = ['vegan', 'mixed', 'carnivore'];
	restaurantModifier = [1.5, 1, 2];
	restaurants = [];
	sanity = 0;
    social = 1;
    socialClass = ['lower', 'middle', 'upper'];
	stores = [];
	thirst = 0;
	time = 200000;
    wages = [];
	water = 0;
	work = [false, false, false];
    constructor(){        
        let food = [], restaurants = [], stores =[];
		this.req.hunger = randNum(3, 6);
		this.req.thirst = randNum(2, 4);
		this.req.sanity = randNum(2, 5);
		food.push(randNum(0, this.restaurantOptions.length - 1));
        let storePrice = randNum(1, 2);
        let restaurantPrice = randNum(5, 10);
        for (let i = 0; i < 3; i++){
            this.stores.push(storePrice);
            this.restaurants.push(restaurantPrice);
            storePrice = randNum(storePrice * 2, storePrice * 3);
            restaurantPrice = randNum(restaurantPrice * 2, restaurantPrice * 3);
        }
		while(1){
			let option = randNum(0, this.restaurantOptions.length - 1);
			
			if (food[0] != option){
				food.push(option);
				break;
			}
		}
		restaurants.push(randNum(0, 2));
		stores.push(randNum(0, 2));
		while(1){
			let restaurantOption = randNum(0, 2);
			let storeOption = randNum(0, 2);
			if (storeOption != stores[0] && restaurantOption != restaurants[0]){
				restaurants.push(restaurantOption);
				stores.push(storeOption);
				break;
			}
		}
		this.preferences = {
			food: food, restaurants: restaurants, stores: stores
		};
        let wage = randNum(8, 12);
        for (let i in this.socialClass){            
            this.wages[i] = wage;
            wage = randNum(wage * 2, wage * 4);
        }
    }
}