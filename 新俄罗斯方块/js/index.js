"use strict"
var cvs = document.getElementById('cvs');

cvs.setAttribute('width', baseHorizontalWidth + infoWidth),
cvs.setAttribute('height', baseVerticalHeight);

var	shapeFactory = new ShapeFactory(), // 形状工厂
	score = new Score(baseVerticalUnit),
	view = new View(cvs, shapeFactory, score),  // 视图
	game = new Game(shapeFactory, view, score);
	
shapeFactory.init();
view.init();
game.newGame();