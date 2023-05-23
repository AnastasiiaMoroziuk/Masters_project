export class TheWatcher {
    constructor() {
        this.message = [];
      }

      createMessage = (sendCorrectInfo, trueState, allStates, count) => {
        switch (sendCorrectInfo) {
            case true: // includes trueState 
            {
                this.message = [];
                this.message.push(trueState);
                while(this.message.length < count) {
                    var element = allStates[Math.floor(Math.random() * allStates.length)];
                    if( !this.message.includes(element)) this.message.push(element);
                }
               this.message = this.message.sort(() => Math.random() - 0.5);
               return;
            }

            case false: // doesn't include trueState 
            {
                this.message = [];
                while(this.message.length < count) {
                    var element = allStates[Math.floor(Math.random() * allStates.length)];
                    if( !this.message.includes(element) && element !== trueState ) this.message.push(element);
                }
                this.message = this.message.sort(() => Math.random() - 0.5);
                return;
            }
            
        }
    }


    createMessageRandomLength = (sendCorrectInfo, trueState, allStates, prob) => {
        this.message = [];
        if(sendCorrectInfo) {
            this.message.push(trueState);
        }

        let statesWithProb = [];
        allStates.forEach((state) => {
            let pair = {
                element: state,
                prob: Math.random()
            }
            statesWithProb.push(pair);
        });

        statesWithProb.forEach((pair) => {
            if(pair.prob < prob && !this.message.includes(pair.element)) this.message.push(pair.element);
        });
        if(!sendCorrectInfo) this.message = this.message.filter(el => el !== trueState);
        this.message = this.message.sort(() => Math.random() - 0.5);        
    }
    
}

   
