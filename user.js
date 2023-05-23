export class TheUser {
    constructor() {
        this.priorData = [];
        this.chosenState;
    }

    getPriorData = (trueState, count, allStates) => {
        this.priorData = [];
        this.priorData.push(trueState);
        while(this.priorData.length < count) {
          var element = allStates[Math.floor(Math.random() * allStates.length)];
          if( !this.priorData.includes(element)) this.priorData.push(element);
        }
        
        this.priorData = this.priorData.sort(() => Math.random() - 0.5);
      }

    caclulateGain = (alpha, beta, probability) => {
        return alpha * probability + (1 - probability) * beta;
    }

    choosePossibleState = (message, allStates, trust ) => {
        if(!trust) {
            message = allStates.filter(x => !message.includes(x));
        } 
        //console.log(`o(x):   ${message}`);
        let possibleStates = this.priorData.filter(x => message.includes(x));
        //console.log(`Можливі стани:   ${possibleStates}`);
        
        this.chosenState = possibleStates[Math.floor(Math.random() * possibleStates.length)];
        if(possibleStates.length === 0 ) {
            return false;
        }
        //console.log(`Кандидат на істинний стан:  ${this.chosenState}`)
    }

    isGuessedState = (trueState) => {
        if(!trueState) return false;
        return trueState === this.chosenState;
    }


    getPriorDataRandomLength = (allStates, trueState, prob) => {
        this.priorData = [];
        this.priorData.push(trueState);
        let statesWithProb = [];
        allStates.forEach((state) => {
            let pair = {
                element: state,
                prob: Math.random()
            }
            statesWithProb.push(pair);
        });

        statesWithProb.forEach((pair) => {
            if(pair.prob < prob && !this.priorData.includes(pair.element)) this.priorData.push(pair.element);
        });
        this.priorData = this.priorData.sort(() => Math.random() - 0.5);
    }
 }
