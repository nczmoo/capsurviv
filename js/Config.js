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
	raise = .03;
	req = {
		hunger: null, sanity: null, thirst: null
	};
	recreation = ['park', 'clubbing', 'movies'];
	recreationCosts = [0, null, null ];
	recreationHours = [1, 4, 3];
	recreationToday = [0, 0, 0];
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
	workRep = [0, 0, 0];
	workToday = [0, 0, 0];
    constructor(){        
		this.recreationCosts[this.recreation.indexOf('clubbing')] = randNum (50, 100);
		this.recreationCosts[this.recreation.indexOf('movies')] = randNum (15, 30);
        let food = [], restaurants = [], stores =[], recreation = [];
		this.req.hunger = randNum(3, 6);
		this.req.thirst = randNum(2, 4);
		this.req.sanity = randNum(2, 3);
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
		recreation.push(randNum(0, this.recreation.length - 1));
		while(1){
			let recreationOption = randNum(0, this.recreation.length - 1);
			let restaurantOption = randNum(0, 2);
			let storeOption = randNum(0, 2);
			if (storeOption != stores[0] && restaurantOption != restaurants[0] && recreationOption != recreation[0]){
				recreation.push(recreationOption);
				restaurants.push(restaurantOption);
				stores.push(storeOption);
				break;
			}
		}
		this.preferences = {
			food: food, recreation: recreation, restaurants: restaurants, stores: stores
		};
        let wage = randNum(8, 12);
        for (let i in this.socialClass){            
            this.wages[i] = wage;
            wage = randNum(wage * 2, wage * 4);
        }
    }
}