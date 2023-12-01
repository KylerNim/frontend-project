document.addEventListener("DOMContentLoaded", function(arg) {
    ///////////////////////////////////////////////INTRO INTRO INTRO///////////////////////////////////////
    let introAudio = new Audio('resources\\gameMusic2.mp3');
    introAudio.volume = .05;
    introAudio.loop= true;
    introAudio.play();
    
    $('.introButton').click(()=>{
        $('.introScreen').addClass('hidden');
        introAudio.pause();
        let mainAudio = new Audio('resources\\gameMusic1.mp3');
        mainAudio.volume = .05;
        mainAudio.loop= true;
        mainAudio.play();
    })
    
    /////////////////////////////////////////////////Poke Setup Functions///////////////////////////////////////////
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
                    currentLevel++;
                    stageCalc();
                    loadStage();
                    updateStageBanner();
                    let sprite = data['sprites']['other']['official-artwork']['front_default'];
                    $('.enemyPoke').removeAttr('src').attr('src', sprite);
                    enemyObj.name = data['name'];
                    enemyObj.currentHP = hpScaling(data);
                    enemyObj.maxHP = hpScaling(data);
                    $('#enemyHealthBar').attr('value', hpScaling(data)).attr('max', hpScaling(data));
                    enemyObj.type = data['types']
                    console.log(enemyObj)
                    $('#name').text(data['name'])
                    $('#hp').text(hpScaling(data) + ' / ' + hpScaling(data) + ' hp')
                    $('.enemyPoke').css('pointer-events', 'auto')
                    console.log('LEVEL ' + currentLevel)
                    console.log('STAGE ' + currentStage)
                    loop = false;
                }
            }
        })
    }

    ////////////////////////////////////////////////////GACHA SHOP MENU////////////////////////////////////
    let gachaOff = true;
    let numberOfPokes = 0;
    
    $('.shopButton').click(()=>{
        $('.shop').toggleClass('hidden');
        ($('.shopButton').text() === 'GACHA SHOP') ? $('.shopButton').text('MENU') : $('.shopButton').text('GACHA SHOP');
    });
    $('.gachaButton').click(()=>{
        if (userStats.money >= 100) {
            buySound();
            let entryStr = randomPokedex().toString();
            $.get('https://pokeapi.co/api/v2/pokemon/' + entryStr, (data)=>{
                let sprite = data['sprites']['front_default'];
                let newImg = document.createElement('img');
                newImg.className = data['name'];
                document.querySelector('.inventory').appendChild(newImg);
                $('.' + data['name']).attr('src', sprite);
                numberOfPokes++
                if (gachaOff === true) {
                    gachaOff = false;
                    setInterval(()=>{
                        let passDam = numberOfPokes * 5
                        if (enemyObj.currentHP > 0) {
                            enemyObj.currentHP -= passDam;
                            hpUpdate();
                            deadCheck();
                        }
                    }, 1000);
                }
            })
        } else {
            errorSound();
        }
    })
    
    /////////////////////////////////////////////////Level Progression////////////////////////////////////////
    let currentLevel = 0;
    let currentStage = 0;
    let stageBeforeChange = true;
  
    let stageIndex = 0;

    ////////////////////////////////////////////////////Audio Play Functions//////////////////////////////////
    function buySound() {
        let buyAudio = new Audio('resources\\mixkit-coins-handling-1939.wav');
        buyAudio.volume = .2
        buyAudio.play();
    }
    function errorSound() {
        let errorAudio = new Audio('resources\\wrong-47985.mp3');
        errorAudio.volume = .2
        errorAudio.play();
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

    function hpUpdate() {
        $('#hp').text(enemyObj.currentHP + ' / ' + enemyObj.maxHP + ' hp');
        $('#enemyHealthBar').attr('value', enemyObj.currentHP)
    }
    function deadCheck() {
        if (enemyObj.currentHP <= 0) {
            userStats.money += rewardCalc();
            $('#money').text(userStats.money.toString() + '¢')
            pokeGeneration();
        }
    }
    function hpScaling(data) {
        let scaledHP = data['stats'][0]['base_stat'] * currentStage;
        return scaledHP;
    }
    function stageCalc() {
        if (currentLevel < 11) {
            currentStage = 1;
        } else if (currentLevel >= 11 && currentLevel < 100) {
            let stageStr = currentLevel.toString().charAt(0);
            currentStage = eval(stageStr) + 1;
        } else if (currentLevel === 100) {
            currentStage === 9;
        } else if (currentLevel > 100) {
            let stageStr = currentLevel.toString().slice(0, 2);
            currentStage = eval(stageStr) + 1;
        }
    }

    function loadStage() {
        if (stageBeforeChange === true) {
            stageIndex++;
            let backG = 'resources/backG' + stageIndex.toString() + '.png';
            $('.pokeContainer').css("background-image", "url(" + backG + ")");
            if (stageIndex > 9) {
                stageIndex = 0;
            }
            stageBeforeChange = false;
        } else if (currentLevel % 10 === 0) {
            stageBeforeChange = true;
        }
    }
    function updateStageBanner() {
        $('.stageText').text('Stage ' + currentStage + ' - ' + currentLevel);
    }

    ///////////////////////////////////////////////////Animation Functions///////////////////////////////////
    function enemyBlink() {
        $(".enemyPoke").stop(true)
        for (var i = 0; i < 3; i++ ) {
            $(".enemyPoke")
                .animate( { opacity: 0 }, 40 )
                .animate( { opacity: 1 }, 40 );
        }
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
        money: 100000,
        hp: 100,
        regen: 0,
        attack: 5,
        critChance: 1,
        critDamage: .30
    };
    ///////////////////////////////////////////////Click Handler for Enemy Poke/////////////////////////////
    $('.enemyPoke').click(()=>{
        enemyBlink();
        let hitAudio = new Audio('resources/mixkit-game-ball-tap-2073.wav')
        hitAudio.volume = .2;
        hitAudio.play();
        enemyObj.currentHP -= damageCalc();
        hpUpdate();
        deadCheck();
    })
    ////////////////////////////////////////////////Click Handler for Upgrades//////////////////////////////
    let attCost = 5;
    let critCCost = 5;
    let critDCost = 5;
    let critCCount = 1;
    let critDCount = 1;

    $('#upgradeAtt').click(()=>{
        if (userStats.money >= attCost) {
            buySound();
            userStats.money -= attCost; 
            userStats.attack += 5;
            attCost += 5;
            $('#money').text(userStats.money.toString() + '¢')
            $('#attack').text('lvl ' + userStats.attack/5);
            $('#upgradeAtt').text(attCost.toString() + '¢')
        } else {
            errorSound();
        }
    })
    $('#upgradeCritC').click(()=>{
        if (userStats.money >= critCCost) {
            buySound();
            userStats.money -= critCCost; 
            userStats.critChance += 1;
            critCCost += 5;
            critCCount += 1;
            $('#money').text(userStats.money.toString() + '¢')
            $('#critChance').text('lvl ' + critCCount);
            $('#upgradeCritC').text(critCCost.toString() + '¢')
        } else {
            errorSound();
        }
    })
    $('#upgradeCritD').click(()=>{
        if (userStats.money >= critDCost) {
            buySound();
            userStats.money -= critDCost; 
            userStats.critDamage += .01;
            critDCost += 5;
            critDCount += 1;
            $('#money').text(userStats.money.toString() + '¢')
            $('#critDamage').text('lvl ' + critDCount);
            $('#upgradeCritD').text(critDCost.toString() + '¢')
        } else {
            errorSound();
        }
    })


});