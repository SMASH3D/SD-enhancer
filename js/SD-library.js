//########################## START OF CONFIG ##########################

//Ordered by descending preference for fleet composition
var cargoShips = ['MercuryBigShipCargo', 'LightCargo', 'HeavyCargo'];
var recyclerShips = ['GigaRecycler', 'Recycler'];

//########################## END OF CONFIG ##########################

var civilShips = cargoShips.concat(recyclerShips);
civilShips.push('ColonyShip', 'SpyProbe', 'Phantom');

var tier1MilitaryShips = ['LightFighter', 'HeavyFighter', 'UltraHunter', 'Cruiser'];
var tier2MilitaryShips = ['Battleship', 'PlanetBomber', 'StarFighter'];
var tier3MilitaryShips = ['NemesianDestrutor', 'BattleFortress', 'BattleCruiser'];
var militaryShips = tier1MilitaryShips.concat(tier1MilitaryShips, tier2MilitaryShips, tier3MilitaryShips);

//percentages to values used in calculations
var speedsMap = [];
speedsMap[1] = 1;
speedsMap[5] = 2;
speedsMap[10] = 3;
speedsMap[20] = 4;
speedsMap[30] = 5;
speedsMap[40] = 6;
speedsMap[50] = 7;
speedsMap[60] = 8;
speedsMap[70] = 9;
speedsMap[80] = 10;
speedsMap[90] = 11;
speedsMap[100] = 12;

var techs = {
    140: {
        img: "./styles/theme/default/gebaeude/140.gif",
        name:{
            EN: "Astrophysics",
            FR: "Astrophysique",
        },
        id: "140"
    },
    141: {
        img: "./styles/theme/default/gebaeude/141.gif",
        name:{
            EN: "Microelectronics",
            FR: "Microelectronique",
        },
        id: "141"
    },
    142: {
        img: "./styles/theme/default/gebaeude/142.gif",
        name:{
            EN: "Cristallography",
            FR: "Cristallographie",
        },
        id: "142"
    },
    143: {
        img: "./styles/theme/default/gebaeude/143.gif",
        name:{
            EN: "Macrostructures",
            FR: "Macrostructures",
        },
        id: "143"
    },
    113: {
        img: "./styles/theme/default/gebaeude/113.gif",
        name:{
            EN: "Energy Technology",
            FR: "Energie",
        },
        id: "113"
    },
    106: {
        img: "./styles/theme/default/gebaeude/106.gif",
        name:{
            EN: "Spy Technology",
            FR: "Espionnage",
        },
        id: "106"
    },
    109: {
        img: "./styles/theme/default/gebaeude/109.gif",
        name:{
            EN: "Weapons Technology",
            FR: "Equipement",
        },
        id: "109"
    },
    110: {
        img: "./styles/theme/default/gebaeude/110.gif",
        name:{
            EN: "Shield Technology",
            FR: "Bouclier",
        },
        id: "110"
    },
    111: {
        img: "./styles/theme/default/gebaeude/111.gif",
        name:{
            EN: "Armour Technology",
            FR: "Blindage",
        },
        id: "111"
    },
    120: {
        img: "./styles/theme/default/gebaeude/120.gif",
        name:{
            EN: "Laser Technology",
            FR: "Laser",
        },
        id: "120"
    },
    121: {
        img: "./styles/theme/default/gebaeude/121.gif",
        name:{
            EN: "Ion Technology",
            FR: "Ions",
        },
        id: "121"
    },
    122: {
        img: "./styles/theme/default/gebaeude/122.gif",
        name:{
            EN: "Plasma Technology",
            FR: "Plasma",
        },
        id: "122"
    },
    123: {
        img: "./styles/theme/default/gebaeude/123.gif",
        name:{
            EN: "Intergalactic Research Network",
            FR: "Centrale de Recherche",
        },
        id: "123"
    },
    199: {
        img: "./styles/theme/default/gebaeude/199.gif",
        name:{
            EN: "Graviton Research",
            FR: "Graviton",
        },
        id: "199"
    },
    108: {
        img: "./styles/theme/default/gebaeude/108.gif",
        name:{
            EN: "Computer Technology",
            FR: "Base Avancée",
        },
        id: "108"
    },
    115: {
        img: "./styles/theme/default/gebaeude/115.gif",
        name:{
            EN: "Combustion Engine",
            FR: "Combustion",
        },
        bonusPerLevel: 0.1,
        id: "115"
    },
    117: {
        img: "./styles/theme/default/gebaeude/117.gif",
        name:{
            EN: "Impulsion Engine",
            FR: "Impulsion",
        },
        bonusPerLevel: 0.2,
        id: "117"
    },
    118: {
        img: "./styles/theme/default/gebaeude/118.gif",
        name:{
            EN: "Hyperspace Engine",
            FR: "Energie inertielle",
        },
        bonusPerLevel: 0.3,
        id: "118"
    },
    131: {
        img: "./styles/theme/default/gebaeude/131.gif",
        name:{
            EN: "Improved Rhenium Production",
            FR: "Production de Rhénium",
        },
        id: "131"
    },
    132: {
        img: "./styles/theme/default/gebaeude/132.gif",
        name:{
            EN: "Improved Selenium Production",
            FR: "Fabrication de Sélénium",
        },
        id: "132"
    },
    133: {
        img: "./styles/theme/default/gebaeude/133.gif",
        name:{
            EN: "Improved Nitrogen Production",
            FR: "Extraction d'Azote",
        },
        id: "133"
    },
    134: {
        img: "./styles/theme/default/gebaeude/134.gif",
        name:{
            EN: "Colonization",
            FR: "Colonisation",
        },
        id: "134"
    },
    124: {
        img: "./styles/theme/default/gebaeude/124.gif",
        name:{
            EN: "Expedition Research",
            FR: "Extraction",
        },
        id: "124"
    },
    114: {
        img: "./styles/theme/default/gebaeude/114.gif",
        name:{
            EN: "Hyperspace Technology",
            FR: "Antimatière",
        },
        id: "114"
    }
};


var frenchFullShipNames = [];
frenchFullShipNames['Transporteur leger'] = 'ship202';
frenchFullShipNames['Transporteur lourd'] = 'ship203';
frenchFullShipNames['Cargo planetaire'] = 'ship229';
frenchFullShipNames['Colonisateur'] = 'ship208';
frenchFullShipNames['Recycleur'] = 'ship209';
frenchFullShipNames['Recycleur ultime'] = 'ship219';
frenchFullShipNames['Drone Espion'] = 'ship210';
frenchFullShipNames['Extracteur'] = 'ship225';
frenchFullShipNames['Chasseur leger'] = 'ship204';
frenchFullShipNames['Chasseur lourd'] = 'ship205';
frenchFullShipNames['Chasseur Interstellaire'] = 'ship227';
frenchFullShipNames['Intercepteur'] = 'ship206';
frenchFullShipNames['Cuirasse'] = 'ship207';
frenchFullShipNames['Bombardier'] = 'ship211';
frenchFullShipNames['Vaisseau mere'] = 'ship213';
frenchFullShipNames['Station spatiale'] = 'ship228';
frenchFullShipNames['Etoile de la mort'] = 'ship214';
frenchFullShipNames['Exterminateur'] = 'ship215';
frenchFullShipNames['Phantom'] = 'ship226';


var shipMap = {
    LightCargo : 'ship202',
    HeavyCargo : 'ship203',
    MercuryBigShipCargo : 'ship229',
    ColonyShip : 'ship208',
    Recycler : 'ship209',
    GigaRecycler : 'ship219',
    SpyProbe : 'ship210',
    Extractor : 'ship225',
    LightFighter: 'ship204',
    HeavyFighter: 'ship205',
    UltraHunter: 'ship227',
    Cruiser: 'ship206',
    Battleship: 'ship207',
    PlanetBomber: 'ship211',
    StarFighter: 'ship213',
    NemesianDestrutor: 'ship228',
    BattleFortress: 'ship214',
    BattleCruiser: 'ship215',
    Phantom : 'ship226',
};

var ships = {
    ship202:{
        id:202,
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
        baseSpeed: 5000,
        baseSpeed2: 10000,
        propulsion: 115,
        propulsion2: "117#5",
        consumption: 10,
        consumption2: 20
    },
    ship203:{
        id:203,
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
        propulsion: 115,
        consumption: 50,
    },
    ship229:{
        id:229,
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
        propulsion: 117,
        consumption: 125,
    },
    ship208:{
        id:208,
        structure: 30000,
        shield: 100,
        attack: 50,
        rhenium: 10000,
        selenium: 20000,
        nitrogen: 10000,
        codename: 'CS',
        name:{
            EN: 'Colony Ship',
            FR: 'Colonisateur',
        },
        capacity: 7500,
        baseSpeed: 2500,
        propulsion: 117,
        consumption: 1000,
    },
    ship209:{
        id:209,
        structure: 16000,
        shield: 45,
        attack: 1,
        rhenium: 10000,
        selenium: 6000,
        nitrogen: 2000,
        codename: 'RECY',
        name:{
            EN: 'Recycler',
            FR: 'Recycleur',
        },
        capacity: 25000,
        baseSpeed: 2000,
        propulsion: 115,
        consumption: 150,
    },
    ship219:{
        id:219,
        structure: 160000,
        shield: 475,
        attack: 1,
        rhenium: 100000,
        selenium: 60000,
        nitrogen: 20000,
        codename: 'RECU',
        name:{
            EN: 'Giga Recycler',
            FR: 'Recycleur Ultime',
        },
        capacity: 275000,
        baseSpeed: 2500,
        propulsion: 115,
        consumption: 300,
    },
    ship210:{
        id:210,
        structure: 1000,
        shield: 0,
        attack: 0,
        rhenium: 0,
        selenium: 1000,
        nitrogen: 0,
        codename: 'SB',
        name:{
            EN: 'Spy Probe',
            FR: 'Drone Espion',
        },
        capacity: 5,
        baseSpeed: 100000000,
        propulsion: 115,
        consumption: 1,
    },
    ship225:{
        id:225,
        structure: 100000,
        shield: 325,
        attack: 1,
        rhenium: 50000,
        selenium: 50000,
        nitrogen: 25000,
        codename: 'EXT',
        name:{
            EN: 'Extractor',
            FR: 'Extracteur',
        },
        capacity: 10000,
        baseSpeed: 500,
        propulsion: 117,
        consumption: 150,
    },
    ship204:{
        id:204,
        structure:4000,
        shield:10,
        attack:50,
        rhenium:3000,
        selenium:1000,
        nitrogen:0,
        codename: 'LF',
        name:{
            EN:'Light Fighter',
            FR:'Chasseur Léger',
        },
        capacity:50,
        baseSpeed:12500,
        propulsion:115,
        propulsion2:"",
        consumption:20,
    },
    ship205:{
        id:205,
        structure:10000,
        shield:25,
        attack:125,
        rhenium:6000,
        selenium:4000,
        nitrogen:0,
        codename: 'HF',
        name:{
            EN:'Heavy Fighter',
            FR:'Chasseur Lourd',
        },
        capacity:100,
        baseSpeed:10000,
        propulsion:117,
        propulsion2:"",
        consumption:75,
    },
    ship227:{
        id:227,
        structure:22500,
        shield:75,
        attack:350,
        rhenium:15000,
        selenium:7500,
        nitrogen:0,
        codename: 'UH',
        name:{
            EN:'Ultra Hunter',
            FR:'Chasseur Interstellaire',
        },
        capacity:3000,
        baseSpeed:7500,
        propulsion:118,
        propulsion2:"",
        consumption:150,
    },
    ship206:{
        id:206,
        structure:27000,
        shield:85,
        attack:375,
        rhenium:20000,
        selenium:7000,
        nitrogen:2000,
        codename: 'CR',
        name:{
            EN:'Cruiser',
            FR:'Intercepteur',
        },
        capacity:800,
        baseSpeed:15000,
        propulsion:117,
        propulsion2:"",
        consumption:300,
    },
    ship207:{
        id:207,
        structure:60000,
        shield:150,
        attack:750,
        rhenium:45000,
        selenium:15000,
        nitrogen:0,
        name:{
            EN:'Battleship',
            FR:'Cuirassé',
        },
        capacity:1500,
        baseSpeed:10000,
        propulsion:118,
        propulsion2:"",
        consumption:250,
    },
    ship211:{
        id:211,
        structure:75000,
        shield:255,
        attack:1125,
        rhenium:50000,
        selenium:25000,
        nitrogen:15000,
        name:{
            EN:'Planet Bomber',
            FR:'Bombardier',
        },
        capacity:500,
        baseSpeed:4000,
        propulsion:117,
        propulsion2:"118#8",
        consumption:1000,
    },
    ship213:{
        id:213,
        structure:110000,
        shield:350,
        attack:1575,
        rhenium:60000,
        selenium:50000,
        nitrogen:15000,
        name:{
            EN:'Star Fighter',
            FR:'Vaisseau mère',
        },
        capacity:2000,
        baseSpeed:5000,
        propulsion:118,
        propulsion2:"",
        consumption:1000,
    },
    ship228:{
        id:228,
        structure:175000,
        shield:1150,
        attack:2250,
        rhenium:100000,
        selenium:75000,
        nitrogen:25000,
        name:{
            EN:'Nemesian Destructor',
            FR:'Station Spatiale',
        },
        capacity:5000,
        baseSpeed:4500,
        propulsion:118,
        propulsion2:"",
        consumption:800,
    },
    ship214:{
        id:214,
        structure:9000000,
        shield:55000,
        attack:110000,
        rhenium:5000000,
        selenium:4000000,
        nitrogen:1000000,
        name:{
            EN:'Battle Fortress',
            FR:'Etoile de la mort',
        },
        capacity:50000,
        baseSpeed:200,
        propulsion:118,
        propulsion2:"",
        consumption:1,
    },
    ship215:{
        id:215,
        structure:17000000,
        shield:130000,
        attack:250000,
        rhenium:10000000,
        selenium:7000000,
        nitrogen:3500000,
        codename: 'BC',
        name:{
            EN:'Battle cruiser',
            FR:'Exterminateur',
        },
        capacity:75000,
        baseSpeed:1000,
        propulsion:118,
        propulsion2:"",
        consumption:250,
    },
    ship226:{
        id:226,
        structure:40000,
        shield:125,
        attack:1,
        rhenium:20000,
        selenium:20000,
        nitrogen:10000,
        codename: 'PH',
        name:{
            EN:'Phantom',
            FR:'Phantom',
        },
        capacity:4000,
        baseSpeed:1,
        propulsion:117,
        propulsion2:"",
        consumption:200,
    },

};

