"use strict"
/**
*  视图类
*  @author zhuhongyang
*  @date 2016/3/20
*/
function View(cvs, shapeFactory, score){
    if(View.unique){
        return View.unique; 
    }
	Object.defineProperty(View, 'unique', {
		value: this
	});

	this.painter = new Canvas(cvs),
	this.shapeFactory = shapeFactory,
	this.score = score;
}
View.prototype = {
	constructor: View,
	drawFrap: drawCircle,
	cache: {},
	init: function(){
		// 绘制缓存canvas
		/* 游戏主内容区 */
		var cvs = document.createElement("canvas");
		cvs.width = 1.1 * baseHorizontalWidth,
		cvs.height = 1.1 * baseVerticalHeight;
		var canvas = new Canvas(cvs);
		canvas.drawRect({
			x0: 0,
			y0: 0,
			width: baseHorizontalWidth, 
			height: baseVerticalHeight,
			fillStyle: gameBgColor,
			strokeStyle: borderColor
		});

		this.cache['gameBg'] = cvs;

		/* 游戏信息区 */
		cvs = document.createElement("canvas");
		cvs.width = 1.1 * infoWidth,
		cvs.height = 1.1 * baseVerticalHeight;
		canvas = new Canvas(cvs);
		canvas.drawRect({
			x0: 0,
			y0: 0,
			width: infoWidth, 
			height: baseVerticalHeight,
			fillStyle: infoBgColor,
			strokeStyle: borderColor
		});
		this.cache['infoBg'] = cvs;

		/* 暂停文字 */
		cvs = document.createElement("canvas");
		cvs.width = 60,
		cvs.height = 30,
		canvas = new Canvas(cvs);
		canvas.drawText({
			y0: 15,
			text: '暂停中',
			font: 'bold 18px Microsoft Yahei',
			textAlign: 'left',
			strokeStyle: '#262626', 
		});
		this.cache['pause'] = cvs;

		/* 操作说明文字 */
		cvs = document.createElement("canvas");
		cvs.width = infoWidth,
		cvs.height = 120;
		canvas = new Canvas(cvs);
		canvas.drawText({
			y0: 10,
			text: '←、A： 向左，',
			font: 'bold 12px Microsoft Yahei',
			textAlign: 'left',
			fillStyle: '#262626', 
		});
		canvas.drawText({
			y0: 30,
			text: '→、D： 向右，',
			font: 'bold 12px Microsoft Yahei',
			textAlign: 'left',
			fillStyle: '#262626', 
		});
		canvas.drawText({
			y0: 50,
			text: '↑、W： 改变方向，',
			font: 'bold 12px Microsoft Yahei',
			textAlign: 'left',
			fillStyle: '#262626', 
		});
		canvas.drawText({
			y0: 70,
			text: '↓、S： 加速下落，',
			font: 'bold 12px Microsoft Yahei',
			textAlign: 'left',
			fillStyle: '#262626', 
		});
		canvas.drawText({
			y0: 90,
			text: 'P：暂停',
			font: 'bold 12px Microsoft Yahei',
			textAlign: 'left',
			fillStyle: '#262626', 
		});
		this.cache['tip'] = cvs;

		/* 方块 */
		var that = this;
		this.shapeFactory.colors.forEach(function(color){
			cvs = document.createElement("canvas");
			cvs.width = 1.1 * baseSize,
			cvs.height = 1.1 * baseSize;
			canvas = new Canvas(cvs);
			canvas.drawRect({
				x0: 0,
				y0: 0,
				width: baseSize, 
				fillStyle: color,
				strokeStyle: borderColor
			});
			that.cache[color] = cvs;
		});

		cvs = document.createElement("canvas");
		cvs.width = 1.1 * baseSize,
		cvs.height = 1.1 * baseSize;
		canvas = new Canvas(cvs);
		canvas.drawRect({
			x0: 0,
			y0: 0,
			width: baseSize, 
			fillStyle: 'white',
			opacity: .4
		});
		that.cache['o'] = cvs;

		cvs = canvas = null;

		/* 实现元素的闪烁显示TODO */
		this.lighting = false;
		var lightCounter = 0;
		setInterval(function(){
			if(++ lightCounter % 10 > lightFrequency){
				that.lighting = false;
			} else {
				that.lighting = true;			
			}
		}, 100);
	},
	draw: function(isPause){
		this.painter.drawCache(this.cache['gameBg'] ,{
			x0: 0,
			y0: 0
		});

		this.painter.drawCache(this.cache['infoBg'] ,{
			x0: baseHorizontalWidth,
			y0: 0
		});
		
		// 画形状
		var that = this

		this.shapeFactory.panelContatainer.forEach(function(shapeBox){
			shapeBox.boxes.forEach(function(shape){
				shape.forEach(function(box){
					if(!box.active) return true;

					that.painter.drawCache(that.cache[box.bgColor] ,{
						x0: (box.x + baseLeft) * box.baseSize,
						y0: (box.y + baseTop) * box.baseSize
					});
				});
			});
		});

		/* 激活的形状 */
		this.shapeFactory.currentShapeContainer.forEach(function(shape){
			shape.boxes.forEach(function(box){
				//if(!box.active) return true;
				
				if(!box.active) {
					that.painter.drawCache(that.cache['o'] ,{
						x0: (box.x + shape.x + baseLeft) * box.baseSize,
						y0: (box.y + shape.y + baseTop) * box.baseSize 
					});
					return;
				}
				

				that.painter.drawCache(that.cache[box.bgColor] ,{
					x0: (box.x + shape.x + baseLeft) * box.baseSize,
					y0: (box.y + shape.y + baseTop) * box.baseSize 
				});
			});
		});

		/* 下一个形状 */
		this.shapeFactory.nextShapeContainer.forEach(function(shape){
			shape.boxes.forEach(function(box){
				if(!box.active) return true;

				that.painter.drawCache(that.cache[box.bgColor] ,{
					x0: (box.x + baseLeft + baseHorizontalUnit + 1) * box.baseSize,
					y0: (box.y + baseTop + 2) * box.baseSize 
				});
			});
		});

		/* 画分数 */
		that.painter.drawText({
			x0: (baseLeft + baseHorizontalUnit + .5) *baseSize,
			y0: (baseTop + 8) * baseSize,
			text: that.score.highScore >= 99999 ? '99999+' : that.score.highScore,
			font: 'bold 40px Microsoft Yahei',
			textAlign: 'left',
			fillStyle: '#262626', 
		});

		/* 画提示 */
		this.painter.drawCache(that.cache['tip'], {
			x0: (baseLeft + baseHorizontalUnit + .5) *baseSize,
			y0: (baseTop + 10) * baseSize
		});

		if(isPause && this.lighting){
			// 暂停
			that.painter.drawCache(that.cache['pause'] ,{
				x0: (baseLeft + baseHorizontalUnit - 2.5) *baseSize,
				y0: (baseTop + 1) * baseSize
			});
		}
	}
}