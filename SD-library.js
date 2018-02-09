//########################## START OF CONFIG ##########################

//Ordered by descending preference for fleet composition
var cargoShips = ['MercuryBigShipCargo', 'LightCargo', 'HeavyCargo'];
var recyclerShips = ['GigaRecycler', 'Recycler'];

//########################## END OF CONFIG ##########################

var civilShips = cargoShips.concat(recyclerShips);
civilShips.push('ColonyShip', 'SpyProbe', 'Phantom');

var tier1MilitaryShips = ['LightFighter', 'HeavyFighter', 'Cruiser'];
var tier2MilitaryShips = ['Battleship', 'PlanetBomber', 'StarFighter'];
var tier3MilitaryShips = ['BattleFortress', 'BattleCruiser'];
var militaryShips = tier1MilitaryShips.concat(tier1MilitaryShips, tier2MilitaryShips, tier3MilitaryShips);


var shipMap = {
    LightCargo : 'ship202',
    HeavyCargo : 'ship203',
    MercuryBigShipCargo : 'ship229',
    ColonyShip : 'ship208',
    Recycler : 'ship209',
    GigaRecycler : 'ship219',
    Extractor : 'ship225',
    /*HeavyFighter: 'ship205',
    Cruiser: 'ship206',
    Battleship: 'ship207',
    PlanetBomber: 'ship211',
    StarFighter: 'ship213',
    BattleFortress: 'ship214',
    BattleCruiser: 'ship215',
    Phantom : 'ship226',*/
};

var ships = {
    ship202:{
        structure: 4000,
        shield: 10,
        attack: 5,
        rhenium: 2000,
        selenium: 2000,
        nitrogen: 0,
        codename: 'LC',
        name:{
            EN: 'Light Cargo',
            FR: 'Transporteur Léger',
        },
        capacity: 12000,
        baseSpeed: 10000,
        propulsion: "impulsion",
        consumption: 20
    },
    ship203:{
        structure: 12000,
        shield: 30,
        attack: 15,
        rhenium: 6000,
        selenium: 6000,
        nitrogen: 0,
        codename: 'HC',
        name:{
            EN: 'Heavy Cargo',
            FR: 'Transporteur Lourd',
        },
        capacity: 35000,
        baseSpeed: 7500,
        propulsion: "combustion",
        consumption: 50,
    },
    ship229:{
        structure: 45000,
        shield: 115,
        attack: 40,
        rhenium: 25000,
        selenium: 20000,
        nitrogen: 1500,
        codename: 'MBSC',
        name:{
            EN: 'Mercury Big Ship Cargo',
            FR: 'Cargo Planétaire',
        },
        capacity: 100000,
        baseSpeed: 12500,
        propulsion: "impulsion",
        consumption: 125,
    },
    ship208:{
        structure: 30000,
        shield: 100,
        attack: 50,
        rhenium: 10000,
        selenium: 20000,
        nitrogen: 10000,
        name:{
            EN: 'Colony Ship',
            FR: 'Colonisateur',
        },
        capacity: 7500,
        baseSpeed: 2500,
        propulsion: "impulsion",
        consumption: 1000,
    },
    ship209:{
        structure: 16000,
        shield: 45,
        attack: 1,
        rhenium: 10000,
        selenium: 6000,
        nitrogen: 2000,
        name:{
            EN: 'Recycler',
            FR: 'Recycleur',
        },
        capacity: 25000,
        baseSpeed: 2000,
        propulsion: "combustion",
        consumption: 150,
    },
    ship219:{
        structure: 160000,
        shield: 475,
        attack: 1,
        rhenium: 100000,
        selenium: 60000,
        nitrogen: 20000,
        name:{
            EN: 'Giga Recycler',
            FR: 'Recycleur Ultime',
        },
        capacity: 275000,
        baseSpeed: 2500,
        propulsion: "inertia",
        consumption: 300,
    },
    ship225:{
        structure: 100000,
        shield: 325,
        attack: 1,
        rhenium: 50000,
        selenium: 50000,
        nitrogen: 25000,
        name:{
            EN: 'Extractor',
            FR: 'Extracteur',
        },
        capacity: 10000,
        baseSpeed: 500,
        propulsion: "impulsion",
        consumption: 150,
    },
};

