import { TheObject } from "./object.js";
import { TheUser } from "./user.js";
import { TheWatcher } from "./watcher.js";


let prior_message_count = 20; 
let message_count = 20; 

const alpha = 10;
const beta = 1;

const object1 = new TheObject(100);
object1.initAllStates();
// console.log("---------------------------------------------------------");
// console.log(`Всі можливі стани обʼєкта: ${object1.allStates}`);
const iterationsArray = [ 1, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const gameStage = (sendCorrectMessage, trust, resultsArray, iterations, isRandomLength = true, prob = 0.2) => {
    object1.calculateNewState();
    // console.log(`Поточний стан о бʼєкта:  ${object1.currentState}`);

    const watcher = new TheWatcher();
    const user = new TheUser()
   
    

    let priorLenght = 0;
    let messageLenght = 0;
    
    let wins_prior_1 = 0;
    let wins_post_1 = 0;
    let actual = 0;
    watcher.createMessageRandomLength(sendCorrectMessage, object1.currentState, object1.allStates, prob);
    for (let i = 0; i < iterations; i++) {
        if(isRandomLength) {
            // watcher.createMessageRandomLength(sendCorrectMessage, object1.currentState, object1.allStates, prob);
        messageLenght += watcher.message.length;

        user.getPriorDataRandomLength(object1.allStates,  object1.currentState, prob);
        priorLenght += user.priorData.length;

        } else {
            watcher.createMessage(sendCorrectMessage, object1.currentState, object1.allStates, message_count);
            user.getPriorData(object1.currentState, prior_message_count, object1.allStates);
        }
        
        user.choosePossibleState(user.priorData, object1.allStates, true);
        if(user.isGuessedState(object1.currentState)) {
            wins_prior_1++;
        };
    
        user.choosePossibleState(watcher.message, object1.allStates, trust);
        if(user.isGuessedState(object1.currentState)) {
            wins_post_1++;
        };

        actual++;
    }

    priorLenght = priorLenght/iterations;
    messageLenght = messageLenght/iterations;
    
    let p_1 = wins_prior_1/iterations;
    let q_1 = wins_post_1/iterations; 
    
    // console.log(`Кількість вгадувань з апріорною інформацією: ${wins_prior_1}`);
    // console.log(`Кількість вгадувань з апостеріорною інформацією:  ${wins_post_1}`);
    
    let prior_gain_1 = user.caclulateGain(alpha, beta, p_1);
    let post_gain_1 = user.caclulateGain(alpha, beta, q_1)
    
    // console.log(`Апріорний дохід: ${prior_gain_1}`);
    // console.log(`Апостеріорний дохід:  ${post_gain_1}`);
    
    let value_1 = post_gain_1 - prior_gain_1;
    
    // console.log(`Цінність інформації/втрати:  ${value_1}`);


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
var prob = 100;
var prob1 = 100;
var prob2 = 100;
var prob3 = 100;
var prob4 = 100;
iterationsArray.forEach((x, ind) => {
const resultsArray1 = [];
const resultsArray2 = [];
const resultsArray3 = [];
const resultsArray4 = [];
console.log(`\n-----------------------------------------------------------------------------------------------------------------------------------------`)
// console.log(`\n---------------------------- Етап ${1} ----------------------------`)
for(let i = 0; i < prob; i++) {
    gameStage(false, true, resultsArray1, x);
}
// console.log(resultsArray);

let negativeValueCount1 = 0;
let zeroValueCount1 = 0;
let positiveValueCount1 = 0;
resultsArray1.forEach((item,index) => {
    if(item.value < 0) negativeValueCount1++;
    if(item.value === 0) zeroValueCount1++;
    if(item.value > 0) positiveValueCount1++;
}
);

const str1 = negativeValueCount1 > positiveValueCount1 ? 
`Етап1: Користувач визначив дезинформацію з ймовірністю ${negativeValueCount1/prob} для ${x} повідомлень` :
`Етап1: Користувач впевнився в своїй стратегії та отримує додатній дохід з ймовірністю ${positiveValueCount1/prob} для ${x} повідомлень`;
let avgValue1 = resultsArray1.reduce((a,b) => a + b.value, 0);
console.log(`${str1}. Середня цінність ${((avgValue1)/prob).toFixed(4)}`);


// console.log(`\n---------------------------- Етап ${2} ----------------------------`)

for(let i = 0; i < prob; i++) {
    gameStage(false, false, resultsArray2, x);
}
// console.log(resultsArray);

let negativeValueCount2 = 0;
let zeroValueCount2 = 0;
let positiveValueCount2 = 0;
resultsArray2.forEach((item,index) => {
    if(item.value < 0) negativeValueCount2++;
    if(item.value === 0) zeroValueCount2++;
    if(item.value > 0) positiveValueCount2++;
}
);
// користувач посилаэ дезинформацію, 
//console.log(`Етап2: Користувач визначив дезинформацію з ймовірністю ${negativeValueCount2/prob} для ${x} повідомлень`);
const str2 = negativeValueCount2 > positiveValueCount2 ? 
`Етап2: Користувач визначив дезинформацію з ймовірністю ${negativeValueCount2/prob} для ${x} повідомлень` :
`Етап2: Користувач впевнився в своїй стратегії та отримує додатній дохід з ймовірністю ${positiveValueCount2/prob} для ${x} повідомлень`
let avgValue2 = resultsArray2.reduce((a,b) => a + b.value, 0);
console.log(`${str2}. Середня цінність ${((avgValue2)/prob).toFixed(4)}`);

// console.log(`\n---------------------------- Етап ${3} ----------------------------`)for(let i = 0; i < 100; i++) {
    for(let i = 0; i < prob; i++) {
        gameStage(true, false, resultsArray3, x);
    }
let negativeValueCount3 = 0;
let zeroValueCount3 = 0;
let positiveValueCount3 = 0;
resultsArray3.forEach((item,index) => {
    if(item.value < 0) negativeValueCount3++;
    if(item.value === 0) zeroValueCount3++;
    if(item.value > 0) positiveValueCount3++;
}
);
// користувач посилає дезинформацію, 
// console.log(`Етап3: Користувач визначив дезинформацію з ймовірністю ${negativeValueCount3/prob} для ${x} повідомлень`);

let str3 = negativeValueCount3 > positiveValueCount3 ? 
`Етап3: Користувач визначив дезинформацію з ймовірністю ${negativeValueCount3/prob} для ${x} повідомлень` :
`Етап3: Користувач впевнився в своїй стратегії та отримує додатній дохід з ймовірністю ${positiveValueCount3/prob} для ${x} повідомлень`
let avgValue3 = resultsArray3.reduce((a,b) => a + b.value, 0);
console.log(`${str3}. Середня цінність ${((avgValue3)/prob).toFixed(4)}`);

// console.log(`\n---------------------------- Етап ${4} ----------------------------`)
for(let i = 0; i < prob; i++) {
    gameStage(true, true, resultsArray4, x);
}
let negativeValueCount4 = 0;
let zeroValueCount4 = 0;
let positiveValueCount4 = 0;
resultsArray4.forEach((item,index) => {
if(item.value < 0) negativeValueCount4++;
if(item.value === 0) zeroValueCount4++;
if(item.value > 0) positiveValueCount4++;
}
);

// console.log(`Етап4: Користувач визначив дезинформацію з ймовірністю ${negativeValueCount/prob} для ${x} повідомлень`);
let str4 = negativeValueCount4 > positiveValueCount4 ? 
`Етап4: Користувач визначив дезинформацію з ймовірністю ${negativeValueCount4/prob} для ${x} повідомлень` :
`Етап4: Користувач впевнився в своїй стратегії та отримує додатній дохід з ймовірністю ${positiveValueCount4/prob} для ${x} повідомлень`
let avgValue4 = resultsArray4.reduce((a,b) => a + b.value, 0);
console.log(`${str4}. Середня цінність ${((avgValue4)/prob).toFixed(4)}`);


console.log(`Середня цінність ${(((avgValue4)/prob + (avgValue3)/prob + (avgValue2)/prob +(avgValue1)/prob)/4).toFixed(4)}`);
})

