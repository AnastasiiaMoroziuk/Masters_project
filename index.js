import { TheObject } from "./object.js";
import { TheUser } from "./user.js";
import { TheWatcher } from "./watcher.js";

const object1 = new TheObject(100);

object1.initAllStates();
console.log("---------------------------------------------------------");
console.log(`Всі можливі стани обʼєкта: ${object1.allStates}`);
object1.calculateNewState();
console.log(`Поточний стан обʼєкта:  ${object1.currentState}`);


const watcher = new TheWatcher();

// watcher.createMessage(true, object1.currentState, object1.allStates, 20);

watcher.createMessageRandomLength(true, object1.currentState, object1.allStates, 0.2);
// console.log(watcher.message);
console.log(`\nПовідомлення сформоване спостерігачем з істинним станом:  ${watcher.message}`);


const user = new TheUser();
user.getPriorDataRandomLength(object1.allStates,  object1.currentState, 0.2);
// console.log(user.priorData);

// user.getPriorData(object1.currentState, 20, object1.allStates);
console.log(`\nАпріорна інформація користувача:  ${user.priorData}`);

let possibleStates = user.priorData.filter(item => watcher.message.includes(item));
console.log(`Можливі стани:  ${possibleStates}\n`);

let priorGain = user.caclulateGain(10, 1, 1/user.priorData.length);
console.log(`Апріорний дохід користувача:  ${priorGain}`);

let postGain = user.caclulateGain(10, 1, 1/possibleStates.length);
console.log(`Апостеріорний дохід користувача:  ${postGain}`);

console.log(`Цінність інформації:  ${postGain - priorGain}`);

user.choosePossibleState(watcher.message, object1.allStates, true);
console.log(`Обраний стан  ${user.chosenState}`);
console.log(`Стан обрано ${user.isGuessedState(object1.currentState) ? "правильно" : "неправильно"}`);
