/////////////////////////////////////////////////Poke Setup Functions///////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function(arg) {

    function randomPokedex() {
    let pokeEntry = Math.floor(Math.random() * 1015);
    return pokeEntry;
    }

    function pokeGeneration() {
        let entryStr = randomPokedex().toString();
        $('.enemyPoke').css('pointer-events', 'none')
        $.get('https://pokeapi.co/api/v2/pokemon/' + entryStr, (data)=>{
            let loop = true;
            while (loop === true) {
                if (data['sprites']['other']['official-artwork']['front_default'] !== null) {
                    console.log(data['name']);
                    console.log(data);
                    let sprite = data['sprites']['other']['official-artwork']['front_default'];
                    $('.enemyPoke').removeAttr('src').attr('src', sprite);
                    enemyObj.name = data['name'];
                    enemyObj.currentHP = data['stats'][0]['base_stat'];
                    enemyObj.maxHP = data['stats'][0]['base_stat'];
                    enemyObj.type = data['types']
                    console.log(enemyObj)
                    $('#name').text(data['name'])
                    $('#hp').text(data['stats'][0]['base_stat'] + ' / ' +data['stats'][0]['base_stat'] + ' hp')
                    $('.enemyPoke').css('pointer-events', 'auto')
                    loop = false;
                }
            }
        })
    }

    
  ///////////////////////////////////////////////////Calculation Functions//////////////////////////////////  
    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
  
    function damageCalc() {
        let num = (userStats.attack) + critCalc();
        return num;
    }
    function critCalc() {
        let chance = getRandomIntInclusive(1,100);
        if (chance > userStats.critChance) {
            return 0;
        } else {
            console.log('CRIT!!!!')
            return (userStats.attack * userStats.critDamage);
        }
    }
    function rewardCalc() {
        let num = 2;
        return num;
    }

    function enemyScaling() {
        //////WIP//////WIP//////WIP///////
    }

    ///////////////////////////////////////////////////Global Enemy Obj//////////////////////////////////////
    let enemyObj = {
        name: undefined,
        currentHP: undefined,
        maxHP: undefined,
        type: undefined,
    }

    //Generate initial PokeEnemy///////
    pokeGeneration();
    ///////////////////////////////////////////////////Stats&Money////////////////////////////////////////////
    let userStats = {
        money: 0,
        hp: 100,
        regen: 0,
        attack: 5,
        critChance: 1,
        critDamage: .30
    };
    ///////////////////////////////////////////////Click Handler for Enemy Poke/////////////////////////////
    $('.enemyPoke').click(()=>{
        let hitAudio = new Audio('resources/mixkit-game-ball-tap-2073.wav')
        hitAudio.volume = .2;
        hitAudio.play();
        enemyObj.currentHP -= damageCalc();
        $('#hp').text(enemyObj.currentHP + ' / ' + enemyObj.maxHP + ' hp');
        if (enemyObj.currentHP <= 0) {
            userStats.money += rewardCalc();
            $('#money').text(userStats.money.toString() + '¢')
            pokeGeneration();
        }
    })
    ////////////////////////////////////////////////Click Handler for Upgrades//////////////////////////////
    let attCost = 5;
    let critCCost = 5;
    let critDCost = 5;
    let critCCount = 1;
    let critDCount = 1;

    $('#upgradeAtt').click(()=>{
        if (userStats.money >= attCost) {
            let buyAudio = new Audio('resources\\mixkit-coins-handling-1939.wav');
            buyAudio.volume = .2
            buyAudio.play();
            userStats.money -= attCost; 
            userStats.attack += 5;
            attCost += 5;
            $('#money').text(userStats.money.toString() + '¢')
            $('#attack').text('lvl ' + userStats.attack/5);
            $('#upgradeAtt').text(attCost.toString() + '¢')
        } else {
            let errorAudio = new Audio('resources\\wrong-47985.mp3');
            errorAudio.volume = .2
            errorAudio.play();
        }
    })
    $('#upgradeCritC').click(()=>{
        if (userStats.money >= critCCost) {
            let buyAudio = new Audio('resources\\mixkit-coins-handling-1939.wav');
            buyAudio.volume = .2
            buyAudio.play();
            userStats.money -= critCCost; 
            userStats.critChance += 1;
            critCCost += 5;
            critCCount += 1;
            $('#money').text(userStats.money.toString() + '¢')
            $('#critChance').text('lvl ' + critCCount);
            $('#upgradeCritC').text(critCCost.toString() + '¢')
        } else {
            let errorAudio = new Audio('resources\\wrong-47985.mp3');
            errorAudio.volume = .2
            errorAudio.play();
        }
    })
    $('#upgradeCritD').click(()=>{
        if (userStats.money >= critDCost) {
            let buyAudio = new Audio('resources\\mixkit-coins-handling-1939.wav');
            buyAudio.volume = .2
            buyAudio.play();
            userStats.money -= critDCost; 
            userStats.critDamage += .01;
            critDCost += 5;
            critDCount += 1;
            $('#money').text(userStats.money.toString() + '¢')
            $('#critDamage').text('lvl ' + critDCount);
            $('#upgradeCritD').text(critDCost.toString() + '¢')
        } else {
            let errorAudio = new Audio('resources\\wrong-47985.mp3');
            errorAudio.volume = .2
            errorAudio.play();
        }
    })


});