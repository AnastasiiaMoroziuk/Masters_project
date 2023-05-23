import { TheObject } from "./object.js";
import { TheUser } from "./user.js";
import { TheWatcher } from "./watcher.js";


// const iterations = 100;

let prior_message_count = 20; 
let message_count = 20; 

const alpha = 10;
const beta = 1;

const resultsArray = [];
const object1 = new TheObject(100);
object1.initAllStates();
console.log("---------------------------------------------------------");
console.log(`Всі можливі стани обʼєкта: { 0, 1, 2, 3, ... , 96, 97, 98, 99 }`);


const gameStage = (sendCorrectMessage, trust, iterations) => {
    object1.calculateNewState();
    console.log(`Поточний стан обʼєкта:  ${object1.currentState}`);

    const watcher = new TheWatcher();
    const user = new TheUser()
   
    

    let wins_prior_1 = 0;
    let wins_post_1 = 0;
    let priorLenght = 0;
    let messageLenght = 0;
    for (let i = 0; i < iterations; i++) {
        //watcher.createMessage(sendCorrectMessage, object1.currentState, object1.allStates, message_count);
        watcher.createMessageRandomLength(sendCorrectMessage, object1.currentState, object1.allStates, 0.2);
        messageLenght += watcher.message.length;

        //user.getPriorData(object1.currentState, prior_message_count, object1.allStates);
        user.getPriorDataRandomLength(object1.allStates,  object1.currentState, 0.2);
        priorLenght += user.priorData.length;

        user.choosePossibleState(user.priorData, object1.allStates, true);
        if(user.isGuessedState(object1.currentState)) {
            wins_prior_1++;
        };
    
        user.choosePossibleState(watcher.message, object1.allStates, trust);
        if(user.isGuessedState(object1.currentState)) {
            wins_post_1++;
        };

    }
    
    let p_1 = wins_prior_1/iterations;
    let q_1 = wins_post_1/iterations; 

    priorLenght = priorLenght/iterations;
    messageLenght = messageLenght/iterations;
    
    console.log(`Середній розмір апріорних даних: ${priorLenght}`);
    console.log(`Середній розмір повідомлення спостерігача:  ${messageLenght}`);

    console.log(`Кількість вгадувань з апріорною інформацією: ${wins_prior_1}`);
    console.log(`Кількість вгадувань з апостеріорною інформацією:  ${wins_post_1}`);
    
    let prior_gain_1 = user.caclulateGain(alpha, beta, p_1);
    let post_gain_1 = user.caclulateGain(alpha, beta, q_1)
    
    console.log(`Апріорний дохід: ${prior_gain_1}`);
    console.log(`Апостеріорний дохід:  ${post_gain_1}`);
    
    let value_1 = post_gain_1 - prior_gain_1;
    
    console.log(`Цінність інформації/втрати:  ${value_1}`);


    let stageResults = {
        trueState: object1.currentState,
        winsPrior: wins_prior_1,
        winsPost: wins_post_1,
        gainPrior: prior_gain_1,
        gainPost: post_gain_1,
        value: value_1,
        sendCorrectMessage: sendCorrectMessage,
        trust: trust
    };

    resultsArray.push(stageResults);
}



console.log(`\n---------------------------- Етап ${1} ----------------------------`)
console.log(`Спостерігач надсилає дезинформуюче повідомлення, користувач не знає стратегії спостерігача`)
gameStage(false, true, 20);
console.log(`\n---------------------------- Етап ${2} ----------------------------`)
console.log(`Спостерігач надсилає дезинформуюче повідомлення, користувач знає стратегію спостерігача`)
gameStage(false, false, 50);
console.log(`\n---------------------------- Етап ${3} ----------------------------`)
console.log(`Спостерігач надсилає повідомлення з істинним станом, користувач не знає стратегію спостерігача`)
gameStage(true, false, 20);
console.log(`\n---------------------------- Етап ${4} ----------------------------`)
console.log(`Спостерігач надсилає повідомлення з істинним станом, користувач знає стратегію спостерігача`)
gameStage(true, true, 20);

