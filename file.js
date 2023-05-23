import { TheObject } from "./object.js";
import { TheUser } from "./user.js";
import { TheWatcher } from "./watcher.js";

let n=100
let q_1 = 0.2;
let q_2 = 0.2;
let t = 1;
let bettaErr = 0.5;


const calculateGainMt = (q_1, q_2, n, alpha, beta, t) => {
    return (alpha*(1/q_1*q_2*n) + beta*(1 - (1/q_1*q_2*n)))*t
}

const calculateMt = (q_1, q_2, n, bettaErr) => {
    let res = (1 - (1 - ((1 - q_1*q_2)**n))/(q_1*q_2*n));
    let Mt = Math.log(bettaErr)/Math.log(res);
    return Math.ceil(Mt);
}


const t_theor = [];
t_theor.push(calculateMt(q_1, q_2, 100, bettaErr));
t_theor.push(calculateMt(q_1, 1 - q_2, 100, bettaErr));
t_theor.push(calculateMt(q_1, 1 - q_2, 100, bettaErr));
t_theor.push(calculateMt(q_1, q_2, 100, bettaErr));

t_theor.forEach((el,ind) => console.log(`Mt_${ind+1} = ${el}. Кількість повідомлень аби вгадати стан з ймов 0.5`))



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

    // console.log(`Кількість вгадувань з апріорною інформацією: ${wins_prior_1}`);
    console.log(`Кількість вгадувань з апостеріорною інформацією:  ${wins_post_1}`);
    
    // let prior_gain_1 = user.caclulateGain(alpha, beta, p_1);
    let post_gain_1 = user.caclulateGain(alpha, beta, q_1)
    
    // console.log(`Апріорний дохід: ${prior_gain_1}`);
    console.log(`Середній апостеріорний дохід:  ${post_gain_1}`);
    
    //let value_1 = post_gain_1 - prior_gain_1;
    
    //console.log(`Цінність інформації/втрати:  ${value_1}`);


    let stageResults = {
        trueState: object1.currentState,
        winsPrior: wins_prior_1,
        winsPost: wins_post_1,
        //gainPrior: prior_gain_1,
        gainPost: post_gain_1,
        //value: value_1,
        sendCorrectMessage: sendCorrectMessage,
        trust: trust
    };

    resultsArray.push(stageResults);
}


console.log(`\n---------------------------- Етап ${1} ----------------------------`)
gameStage(false, true, 3);
// console.log(resultsArray[0].gainPost * 3)

console.log(`\n---------------------------- Етап ${2} ----------------------------`)
gameStage(false, false, 11);
// console.log(resultsArray[1].gainPost * 11)

console.log(`\n---------------------------- Етап ${3} ----------------------------`)
gameStage(true, false, 11);
// console.log(resultsArray[2].gainPost * 11)

console.log(`\n---------------------------- Етап ${4} ----------------------------`)
gameStage(true, true, 3);
// console.log(resultsArray[3].gainPost * 3)