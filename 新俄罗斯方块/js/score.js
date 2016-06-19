"use strict"
/**
*  分数类
*  @author zhuhongyang
*
**/
function Score(floor){
	if(Score.unique){
        return Score.unique; 
    }
	Object.defineProperty(Score, 'unique', {
		value: this
	});

	this.highScore = 0;
	this.floor = floor;
}
Score.prototype.addScore = function(score) {
	this.highScore += score;
}
Score.prototype.decreaseScore = function(score){
	this.highScore >= score ? (this.highScore - score) : 0;
}
Score.prototype.evaluateScore = function(floor){
	this.addScore(Math.floor(floor * (10 + floor * 90 / this.floor)));
}
Score.prototype.reset = function(){
	this.highScore = 0;
}