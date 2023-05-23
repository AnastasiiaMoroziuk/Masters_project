import { TheObject } from "./object.js";
import { TheUser } from "./user.js";
import { TheWatcher } from "./watcher.js";


const iterations = 20;

let prior_message_count = 20; 
let message_count = 20; 

const alpha = 10;
const beta = 1;

const object1 = new TheObject(20);
object1.initAllStates();
console.log("---------------------------------------------------------");
// console.log(`Всі можливі стани обʼєкта: ${object1.allStates}`);



const gameStage = (sendCorrectMessage, trust, iterations=100, resultsArray, change) => {
    
    object1.calculateNewState();
    // console.log(`Поточний стан обʼєкта:  ${object1.currentState}`);

    const watcher = new TheWatcher();
    const user = new TheUser()
   
    let priorLenght = 0;
    let messageLenght = 0;

    let wins_prior_1 = 0;
    let wins_post_1 = 0;
    
    for (let i = 0; i < iterations; i++) {
        // watcher.createMessage(sendCorrectMessage, object1.currentState, object1.allStates, 20);
        // user.getPriorData(object1.currentState, 20, object1.allStates);

        watcher.createMessageRandomLength(sendCorrectMessage, object1.currentState, object1.allStates, 0.2);
        messageLenght += watcher.message.length;

        user.getPriorDataRandomLength(object1.allStates,  object1.currentState, 0.2);
        priorLenght += user.priorData.length;

        user.choosePossibleState(user.priorData, object1.allStates, true);
        if(user.isGuessedState(object1.currentState)) {
            wins_prior_1++;
        };
        if (i >= change) trust = !trust;
        user.choosePossibleState(watcher.message, object1.allStates, trust);
        if(user.isGuessedState(object1.currentState)) {
            wins_post_1++;
        };

    }
    
    let p_1 = wins_prior_1/iterations;
    let q_1 = wins_post_1/iterations; 

    priorLenght = priorLenght/iterations;
    messageLenght = messageLenght/iterations;
    
    let prior_gain_1 = user.caclulateGain(alpha, beta, p_1);
    let post_gain_1 = user.caclulateGain(alpha, beta, q_1)
    
    let value_1 = post_gain_1 - prior_gain_1;
    
    let stageResults = {
        trueState: object1.currentState,
        winsPrior: wins_prior_1,
        winsPost: wins_post_1,
        gainPrior: prior_gain_1,
        gainPost: post_gain_1,
        value: value_1,
        sendCorrectMessage: sendCorrectMessage,
        trust: trust,
        priorLenght: priorLenght,
        messageLenght: messageLenght
    };

    resultsArray.push(stageResults);
}



const resultsArray1 = [];
const resultsArray2 = [];
const resultsArray3 = [];
const resultsArray4 = [];

for (let i = 0; i < iterations; i++) {

    gameStage(false, true, 100, resultsArray1, 101);
    gameStage(false, false, 100, resultsArray2, 101);
    gameStage(true, false, 100, resultsArray3, 101);
    gameStage(true, true, 100, resultsArray4, 101);
}

// console.log("stage|watcher send correct|user trusts|x_0 lenght|x lenght|wins prior|wins post|gain prior|gain post| value");
// console.log("------------------------------------------------------------------------------------------------------------");
// resultsArray1.forEach((x, index) => {
//     console.log(` ${(index+1).toString().padEnd(4)}|   ${x.sendCorrectMessage.toString().padEnd(16)} |   ${x.trust.toString().padEnd(7)} | ${x.priorLenght.toFixed(3).padEnd(8)} | ${x.messageLenght.toFixed(3).padEnd(6)} |  ${x.winsPrior.toString().padEnd(7)} |  ${x.winsPost.toString().padEnd(6)} |  ${x.gainPrior.toFixed(3).padEnd(7)} |  ${x.gainPost.toFixed(3).padEnd(6)} | ${x.value.toFixed(3)}`);
// })


let av1 = resultsArray1.reduce((a,b) => a + b.value, 0)/iterations;
let av2 = resultsArray2.reduce((a,b) => a + b.value, 0)/iterations;
let av3 = resultsArray3.reduce((a,b) => a + b.value, 0)/iterations;
let av4 = resultsArray4.reduce((a,b) => a + b.value, 0)/iterations;
console.log("Експеримент 1:\n");
console.log("Середня цінність інформації на етапі 1: " + av1);
console.log("Середня цінність інформації на етапі 2: " + av2);
console.log("Середня цінність інформації на етапі 3: " + av3);
console.log("Середня цінність інформації на етапі 4: " + av4);

console.log(`\nЦінність інформації за всі етапи: ${(av1 + av2 + av3 + av4)}`);


console.log("------------------------------------------------------------------------------------------------------------");

const resultsArray1_1 = [];
const resultsArray2_1 = [];
const resultsArray3_1 = [];
const resultsArray4_1 = [];

for (let i = 0; i < iterations; i++) {

    gameStage(false, true, 100, resultsArray1_1, 50);
    gameStage(false, false, 100, resultsArray2_1, 101);
    gameStage(true, false, 100, resultsArray3_1, 50);
    gameStage(true, true, 100, resultsArray4_1, 101);
}

// console.log("stage|watcher send correct|user trusts|x_0 lenght|x lenght|wins prior|wins post|gain prior|gain post| value");
// console.log("------------------------------------------------------------------------------------------------------------");
// resultsArray1.forEach((x, index) => {
//     console.log(` ${(index+1).toString().padEnd(4)}|   ${x.sendCorrectMessage.toString().padEnd(16)} |   ${x.trust.toString().padEnd(7)} | ${x.priorLenght.toFixed(3).padEnd(8)} | ${x.messageLenght.toFixed(3).padEnd(6)} |  ${x.winsPrior.toString().padEnd(7)} |  ${x.winsPost.toString().padEnd(6)} |  ${x.gainPrior.toFixed(3).padEnd(7)} |  ${x.gainPost.toFixed(3).padEnd(6)} | ${x.value.toFixed(3)}`);
// })

console.log("Експеримент 2:\n");

let av1_1 = resultsArray1_1.reduce((a,b) => a + b.value, 0)/iterations;
let av2_1 = resultsArray2_1.reduce((a,b) => a + b.value, 0)/iterations;
let av3_1 = resultsArray3_1.reduce((a,b) => a + b.value, 0)/iterations;
let av4_1 = resultsArray4_1.reduce((a,b) => a + b.value, 0)/iterations;

console.log("Середня цінність інформації на етапі 1: " + av1_1);
console.log("Середня цінність інформації на етапі 2: " + av2_1);
console.log("Середня цінність інформації на етапі 3: " + av3_1);
console.log("Середня цінність інформації на етапі 4: " + av4_1);

console.log(`\nЦінність інформації за всі етапи: ${(av1_1 + av2_1 + av3_1 + av4_1)}`);