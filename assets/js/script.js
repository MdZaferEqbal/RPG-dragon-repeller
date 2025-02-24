let xp = 0;
let health = 100;
let gold = 50;
let currentWepon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const xpText = document.getElementById('xpText');
const healthText = document.getElementById('healthText');
const goldText = document.getElementById('goldText');

const button1 = document.getElementById('button1');
const button2 = document.getElementById('button2');
const button3 = document.getElementById('button3');

const monsterStats = document.getElementById('monsterStats');
const monsterNameText = document.getElementById('monsterName');
const monsterHealthText = document.getElementById('monsterHealth');

let audio = document.getElementById('audio');
const volumeController = document.getElementById('volume-controller');

const text = document.getElementById('text');

const weapons = [
    {
        name: "stick",
        power: 5
    },
    {
        name: "dagger",
        power: 30
    },
    {
        name: "claw hammer",
        power: 50
    },
    {
        name: "sword",
        power: 100
    }
];

const monsters = [
    {
        name: "slime",
        level: 2,
        health: 15
    },
    {
        name: "fanged beast",
        level: 8,
        health: 60
    },
    {
        name: "dragon",
        level: 20,
        health: 300
    }
];

const locations = [
    {
        name: "town square",
        "button text": [
            "Go to store <i class='fa-solid fa-store'></i>", 
            "Go to cave <i class='fa-solid fa-person-running'></i>", 
            "Fight dragon <i class='fa-solid fa-dragon'></i>"
        ],
        "button functions": [goStore, goCave, fightDragon],
        text: "You are in town square. You see a sign says \"store\""
    },
    {
        name: "store",
        "button text": [
            "Buy 10 health <i class='fa-solid fa-heart'></i> (10 gold)", 
            "Buy weapon <i class='fa-solid fa-gun'></i> (30 gold)", 
            "Go to town square <i class='fa-solid fa-gopuram'></i>"
        ],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "You entered the store."
    },
    {
        name: "cave",
        "button text": [
            "Flight Slime <i class='fa-solid fa-locust'></i>", 
            "Fight Fanged Beast <i class='fa-brands fa-wolf-pack-battalion'></i>", 
            "Go to town square <i class='fa-solid fa-gopuram'></i>"
        ],
        "button functions": [fightSlime, fightBeast, goTown],
        text: "You entered the cave. You see some monsters."
    },
    {
        name: "fight",
        "button text": [
            "Attack <i class='fa-solid fa-bomb'></i>", 
            "Dodge <i class='fa-solid fa-user-ninja'></i>", 
            "Run <i class='fa-solid fa-person-running'></i>"
        ],
        "button functions": [attack, dodge, goTown],
        text: "You are fighting a monsters."
    },
    {
        name: "kill monster",
        "button text": [
            "Go to town square <i class='fa-solid fa-gopuram'></i>", 
            "Go to town square <i class='fa-solid fa-gopuram'></i>", 
            "Go to town square <i class='fa-solid fa-gopuram'></i>"
        ],
        "button functions": [goTown, goTown, easterEgg],
        text: 'The monster screams "Arg!" as it dies. You gain experience points and gold.'
    },
    {
        name: "lose",
        "button text": [
            "Replay? <i class='fa-solid fa-rotate-right'></i>", 
            "REPLAY? <i class='fa-solid fa-rotate-right'></i>", 
            "REPLAY??? <i class='fa-solid fa-rotate-right'></i>"
        ],
        "button functions": [restart, restart, restart],
        text: 'You died. 💀'
    },
    {
        name: "win",
        "button text": [
            "Replay? <i class='fa-solid fa-rotate-right'></i>", 
            "REPLAY? <i class='fa-solid fa-rotate-right'></i>", 
            "REPLAY??? <i class='fa-solid fa-rotate-right'></i>"
        ],
        "button functions": [restart, restart, restart],
        text: 'You defeated the dragon! YOU WIN THE GAME. 🤠'
    },
    {
        name: "easter egg",
        "button text": [
            "<i class='fa-solid fa-2'></i>", 
            "<i class='fa-solid fa-8'></i>", 
            "Go to town square <i class='fa-solid fa-gopuram'></i>"
        ],
        "button functions": [pickTwo, pickEight, goTown],
        text: 'You found a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win'
    }
];

/**
 * Initialize buttons
*/
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

/**
 * Initialize functions
*/
function volumeControl() {
    if (audio.muted) {
        audio.muted = false;
        volumeController.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
    } else {
        audio.muted = true;
        volumeController.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;
    }
}

function update(location) {
    monsterStats.style.display = "none";

    button1.innerHTML = location["button text"][0];
    button2.innerHTML = location["button text"][1];
    button3.innerHTML = location["button text"][2];

    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];

    text.innerText = location.text;
}

function goTown() {
    audio.src = "assets/audio/background-audio.mp3";
    audio.load();
    audio.play();
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
}

function goCave() {
    update(locations[2]);
}

function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterNameText.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
    audio.src = "assets/audio/attacking.mp3";
    audio.load();
    audio.play();
}

function buyHealth() {
    if (gold >= 10) {
        gold -= 10;
        health += 10;
    
        goldText.innerText = gold;
        healthText.innerText = health;
    } else {
        text.innerText = "You don't have enough gold to buy health.";
    }
}

function buyWeapon() {
    if ( currentWepon < weapons.length - 1 ) {
        if ( gold >= 30 ) {
            gold -= 30;
            currentWepon += 1;
    
            goldText.innerText = gold;
            let newWeapon = weapons[currentWepon].name;
            text.innerText = "You now have a \"" + newWeapon + "\".";
            inventory.push(newWeapon);
            text.innerText += " In your inventory you have: " + inventory;
        } else {
            text.innerText = "You don't have enough gold to buy weapon.";
        }
    } else {
        text.innerText = "You already have the most powerful weapon.";
        button2.innerText = "Sell weapon for 15 gold."
        button2.onclick = sellWeapon;
    }
}

function sellWeapon() {
    if ( inventory.length > 1 ) {
        gold += 15;
        goldText.innerText = gold;

        let currentWeapon = inventory.shift();

        text.innerText = "You sold a " + currentWeapon + " for 15 golds.";
        text.innerText += " In your inventory you have: " + inventory + ".";
    } else {
        text.innerText = "Don't sell your only weapon."
    }
}

function fightSlime() {
    fighting = 0;
    goFight();
}

function fightBeast() {
    fighting = 1;
    goFight();
}

function fightDragon() {
    fighting = 2;
    goFight();
}

function attack() {
    text.innerText = "The " + monsters[fighting].name + " attacks.";
    text.innerText += "You attack it with your " + weapons[currentWepon].name + ".";

    if ( isMonsterHit() ) {
        health -= getMonsterAttackValue(monsters[fighting].level);
    } else {
        text.innerText = "You missed!";
    }

    monsterHealth -= weapons[currentWepon].power + Math.floor(Math.random() * xp) + 1;

    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;

    if ( health <= 0 ) {
        lose();
    } else if ( monsterHealth <= 0 ) {
        fighting === 2 ? winGame() : defeatedMonster();
    }

    if ( Math.random() > 0.1 && inventory.length !== 1 ) {
        text.innerText += "Your broked your " + inventory.pop() + " weapon.";
        currentWepon--;
    }
}

function getMonsterAttackValue(level) {
    let hit = ( level * 5 ) - Math.floor(Math.random() * xp);
    return hit;
}

function isMonsterHit() {
    return Math.random() > 0.2 || health < 20;
}

function dodge() {
    text.innerText = "You dodged an attack from " + monsters[fighting].name + ".";
}

function defeatedMonster() {
    audio.src = "assets/audio/victory.mp3";
    audio.load();
    audio.play();

    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;

    goldText.innerText = gold;
    xpText.innerText = xp;

    update(locations[4]);
}

function lose() {
    audio.src = "assets/audio/died.mp3";
    audio.load();
    audio.play();
    update(locations[5]);
}

function winGame() {
    update(locations[6]);
}

function restart() {
    xp = 0;
    health = 100;
    gold = 50;
    currentWepon = 0;
    inventory = ["stick"];
    goldText.innerText = gold;
    xpText.innerText = xp;
    healthText.innerText = health;
    goTown();
}

function easterEgg() {
    audio.src = "assets/audio/background-audio.mp3";
    audio.load();
    audio.play();
    update(locations[7]);
}

function pickTwo() {
    pick(2);
}

function pickEight() {
    pick(8);
}

function pick(guess) {
    let numbers = [];

    while ( numbers.length < 10 ) {
        numbers.push(Math.floor(Math.random() * 11));
    }

    text.innerText = "You picked " + guess + ". Here are the random numbers:\n";

    for ( let i = 0; i < numbers.length; i++ ) {
        text.innerText += numbers[i] + "\n"
    }

    if ( numbers.indexOf(guess) !== -1 ) {
        text.innerText += "Right! You win 20 golds!";

        gold += 20;
        goldText.innerText = gold;
    } else {
        text.innerText += "Wrong! You lose 10 health."

        health -= 10;
        healthText.innerText = health;

        if ( health <= 0 ) {
            lose();
        }
    }
}
