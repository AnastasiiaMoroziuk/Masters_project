export class TheObject {

  constructor( statesNumber ) {
    this.statesNumber = statesNumber;
    this.allStates = [];
    this.currentState;
  }

    initAllStates = () => {
      for (let i = 0; i < this.statesNumber; i++) {
        this.allStates.push(i);
    }
  }

    calculateNewState = () => {
      this.currentState = this.allStates[Math.floor(Math.random() * this.allStates.length)];
  }

}
