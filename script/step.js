/************************************************
* STEPANDO (Step)                               *
* Author: Sebastian Ríos Ernst                  *
* Start date: 22/12/2012						*
* Version date: 03/11/2013                      *
* Version:0.2.0                                 *
*************************************************/

//STEP CLASS
var Step = function(ref, question, type, option, next, info) {

	//variables
	var stepRef = ref;                  //Step reference
	var stepQuestion = question;        //Step question
	var stepType = type;                //Step type
	var stepOption = option;            //Step option
	var stepNext = next;                //Step option
	var stepInfo = info;                //Step info
	var stepAnswer = '';                //Step answer

	//methods
	//public method getStepData returns the step asked data
	this.getStepData = function(stepData) {
		stepData = stepData.toLowerCase();
		var answer;
		switch(stepData) {
            case 'reference':
                answer = stepRef;
                break;
            case 'question':
                answer = stepQuestion;
                break;
            case 'type':
                answer = stepType;
                break;
            case 'option':
                answer = stepOption;
                break;
            case 'next':
                answer = stepNext;
                break;
            case 'info':
                answer = stepInfo;
                break;
            case 'answer':
                answer = stepAnswer;
                break;
		}
		return answer;
	};

	//public method setStepAnswer modifies de step answer
	this.setStepAnswer = function(answer) {
		stepAnswer = answer;
	};
};

//addStep method that adds a step to the step array
var addStep = function( stepRef, stepQuestion, stepType, stepOption, nextStep, stepInfo) {
	activeSequence.addStep( stepRef, stepQuestion, stepType, stepOption, nextStep, stepInfo);
};

//getAnswer function returns the step answer to a given reference
var getAnswer = function(ref) {
    var step = activeSequence.getStepByRef(ref);
    return step.getStepData('answer');
};