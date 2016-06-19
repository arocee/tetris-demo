"use strict";
/**
*  Canvas绘图类
*  @author zhuhongyang
*  @date 2016/3/20
*/
function Canvas(cvs) {
	if(typeof cvs == 'string') {
		cvs = document.querySelector(cvs);
	}
	if(!cvs || typeof cvs != 'object' || !cvs.nodeName || cvs.nodeName.toLowerCase() != 'canvas'){
		throw new TypeError('必须传入一个CANVAS对象或选择器');
	}
	this.cvs = cvs;
	this.ctx = cvs.getContext('2d'),
	this.width = cvs.width,
	this.height = cvs.height;

	this.ctx.beginPath();

	return this;
}
Canvas.prototype.reset = function(w, h){
	if(w) this.cvs.width = w;
	if(h) this.cvs.height = h;

	this.width = cvs.width,
	this.height = cvs.height;

	return this;
}
/**
	设置属性
*/
Canvas.prototype.decorate = function(decorateParam, drawFn, context){
	var deg = decorateParam.deg,
		rc = decorateParam.rc,  // o, l, t, r, b, c
		fillStyle = decorateParam.fillStyle,
		strokeStyle = decorateParam.strokeStyle,
		x0 = decorateParam.x0 || 0,
		y0 = decorateParam.y0 || 0,
		
		/* 阴影 */
		shadowBlur = decorateParam.shadowBlur,
		shadowColor = decorateParam.shadowColor,
		shadowOffsetX = decorateParam.shadowOffsetX,
		shadowOffsetY = decorateParam.shadowOffsetY,
		
		opacity = decorateParam.opacity,
		scale = decorateParam.scale,
		
		lineCap = decorateParam.lineCap,
		lineJoin = decorateParam.lineJoin,
		miterLimit = decorateParam.miterLimit,
		lineWidth = decorateParam.lineWidth;

	if(typeof scale == 'number' || typeof scale == 'string'){
		scale = [scale, scale];
	}

	if(typeof fillStyle != 'undefined'){
		this.ctx.fillStyle = setStyle.bind(this)(fillStyle);
	}
	if(typeof strokeStyle != 'undefined'){
		this.ctx.strokeStyle = setStyle.bind(this)(strokeStyle);
	}

	if(typeof deg != 'undefined'){
		var rotateDeg = deg * Math.PI / 180,
			center = getRotateOrigin({
				rc: rc,
				x: x0,
				y: y0
			});
	}

	if(typeof rc != 'undefined'){
		this.ctx.translate(center.x, center.y);
		this.ctx.rotate(rotateDeg);
		this.ctx.translate(-center.x, -center.y);
	}

	if(typeof lineCap != 'undefined' || typeof lineWidth != 'undefined'
		|| typeof lineJoin != 'undefined' || typeof miterLimit != 'undefined'){
		this.ctx.lineCap = lineCap;
		this.ctx.lineWidth = lineWidth;
		this.ctx.lineJoin = lineJoin;
		this.ctx.miterLimit = miterLimit;
	}

	if(typeof shadowBlur != 'undefined' || typeof shadowColor != 'undefined' 
		|| typeof shadowOffsetX != 'undefined' || typeof shadowOffsetY != 'undefined'){
		this.ctx.shadowBlur = shadowBlur,
		this.ctx.shadowColor = shadowColor,
		this.ctx.shadowOffsetX = shadowOffsetX,
		this.ctx.shadowOffsetY = shadowOffsetY;
	}

	if(typeof opacity != 'undefined'){
		this.ctx.globalAlpha = opacity;
	}

	if(typeof scale != 'undefined'){
		this.ctx.scale(scale[0], scale[1]);
	}

	if(context){
		drawFn.bind(context)();
	} else {
		drawFn();
	}

	if(typeof rc != 'undefined'){
		this.ctx.rotate(- rotateDeg);
	}

	if(typeof scale != 'undefined'){
		this.ctx.scale(1 /scale[0], 1 / scale[1]);
	}

	if(typeof opacity != 'undefined'){
		this.ctx.globalAlpha = 1;
	}
		
	function getRotateOrigin(pos){
		var center = {};
		switch(pos.rc) {
			case 't':
				center.x = pos.x,
				center.y = pos.y;
				break;
			case 'r':
				center.x = pos.x + pos.w,
				center.y = pos.y;
				break;
			case 'c':
				center.x = pos.x + pos.w / 2,
				center.y = pos.y + pos.h / 2;
				break;
			case 'b':
				center.x = pos.x + pos.w,
				center.y = pos.y + pos.h;
				break;
			case 'l':
				center.x = pos.x,
				center.y = pos.y + pos.h;
				break;
			default:
				center.x = 0,
				center.y = 0;
		}

		return center;
	}

	function setStyle(style) {
		if(typeof style != 'undefined') {
			if(typeof style == 'object') {
				if(style.url){
					// 图片 style = {url: 图片路径, repeat: 渲染方式 repeat|repeat-x|repeat-y|no-repeat}
					var img = new Image();
					img.src = style.url;
					var pat = this.ctx.createPattern(img, style.repeat);
					return pat;
				} else {
					// 渐变
					if(style.r1){
						// 圆形渐变 style = {x0: 渐变的开始圆的 x 坐标, y0: 渐变的开始圆的 y 坐标, r0: 开始圆的半径, x1: 渐变的结束圆的 x 坐标, y1: 渐变的结束圆的 y 坐标, r1: 结束圆的半径, c0: 起始颜色, c1: 结束颜色}
						var x0 = style.x0,
							y0 = style.y0,
							r0 = style.r0,
							x1 = style.x1,
							y1 = style.y1,
							r1 = style.r1;
						
						var grd = this.ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
						grd.addColorStop(0, style.c0);
						grd.addColorStop(1, style.c1);
					} else {
						// 线性渐变 style = {x0: 渐变开始点的 x 坐标, y0: 渐变开始点的 y 坐标, x1: 渐变结束点的 x 坐标, y1: 渐变结束点的 y 坐标, c1: 开始的颜色, c2: 结束的颜色}
						var x0 = style.x0,
							y0 = style.y0,
							x1 = style.x1,
							y1 = style.y1;

						var grd = this.ctx.createLinearGradient(x0, y0, x1, y1);
						grd.addColorStop(0, style.c0);
						grd.addColorStop(1, style.c1);
					}

					return grd;
				}
			} else {
				return style;
			}
		}
	}
}
/**
	绘制图片
	@param: imageParam = {
		x0: 初始X轴坐标, 
		y0: 初始Y轴坐标, 
		width: 绘图宽度, 
		height: 绘图高度, 
		url: 图片路径, 
		deg: 旋转角度, 
		rc: 旋转中心点,
		shadowBlur: 阴影距离, 
		shadowColor: 阴影颜色,
		shadowOffsetX: 阴影水平偏移,
		shadowOffsetY: 阴影垂直偏移,
		opacity: 透明度,
		scale: 缩放
	}
*/
Canvas.prototype.drawImage = function(imageParam){
	var image = new Image(),
		url = imageParam.url,
		that = this; 
	image.onload = function() {
		that.drawBufferedImage(image, imageParam);
	} 
	image.src = url;

	return this;
}
/**
	绘制已缓冲图片
*/
Canvas.prototype.drawBufferedImage = function(image, imageParam){
	var x0 = imageParam.x0 || 0,
		y0 = imageParam.y0 || 0,
		width = imageParam.width,
		height = imageParam.height,
		that = this;

	var scale = image.width / image.height;

	if(typeof width == 'undefined' && typeof height == 'undefined'){
		width = image.width;
		height = image.height;
	} else if(typeof width == 'undefined'){
		width = height * scale;
	} else if(typeof height == 'undefined'){
		height = width / scale;				
	}
	this.ctx.save();
	this.decorate(imageParam, function(){
		that.ctx.drawImage(image, x0, y0, width, height);
	});
	this.ctx.restore();
}
/**
	画缓存
*/
Canvas.prototype.drawCache = function(cacheCanvas, property){
	var x0 = property.x0 || 0,
		y0 = property.y0 || 0;

	this.ctx.drawImage(cacheCanvas , x0 , y0);
	return this;
}
/**
	绘制矩形
	@param rectParam = {
		x0: 初始X轴坐标, 
		y0: 初始Y轴坐标, 
		width: 矩形宽度, 
		height: 矩形高度, 
		fillStyle: 填充样式,
		strokeStyle: 描边样式,
		lineWidth: 描边线宽
		isClear: 是否清除
		deg: 旋转角度, 
		rc: 旋转中心点,
		shadowBlur: 阴影距离, 
		shadowColor: 阴影颜色,
		shadowOffsetX: 阴影水平偏移,
		shadowOffsetY: 阴影垂直偏移,
		opacity: 透明度,
		scale: 缩放
	}
*/
Canvas.prototype.drawRect = function(rectParam){
	var x0 = rectParam.x0 || 0,
		y0 = rectParam.y0 || 0,
		width = rectParam.width || rectParam.height,
		height = rectParam.height || rectParam.width,
		fillStyle = rectParam.fillStyle,
		strokeStyle = rectParam.strokeStyle,
		lineWidth = rectParam.lineWidth,
		isClear = rectParam.isClear;

	this.decorate(rectParam, function(){
		if(typeof fillStyle != 'undefined') {
			this.ctx.fillRect(x0, y0, width, height);
		}
		if(typeof strokeStyle != 'undefined' || typeof lineWidth != 'undefined'){
			this.ctx.strokeRect(x0, y0, width, height);
		}
		if(isClear){
			this.ctx.clearRect(x0, y0, width, height);
		}
	}, this);

	return this;
}
/**
	绘制直线
	@param lineParam = {
		path: 路径集合,
		isClose: 是否封闭，
		lineCap: 端点形状 butt 平直的边缘|round 圆形线帽|square 正方形线帽,
		lineJoin: 设置或返回所创建边角的类型，当两条线交汇时 bevel 创建斜角|round 创建圆角|miter 默认。创建尖角,
		miterLimit: 设置或返回最大斜接长度,
		strokeStyle: 描边样式,
		fillStyle: 填充样式,
		lineWidth: 描边线宽,
		shadowBlur: 阴影距离, 
		shadowColor: 阴影颜色,
		shadowOffsetX: 阴影水平偏移,
		shadowOffsetY: 阴影垂直偏移,
		opacity: 透明度,
		scale: 缩放
	}
*/
Canvas.prototype.drawLine = function(lineParam){
	var path = lineParam.path || [],
		isClose = !!lineParam.isClose,
		strokeStyle = lineParam.strokeStyle,
		fillStyle = lineParam.fillStyle;

	this.decorate(lineParam, function(){
		for(var i = 0; i < path.length; i ++) {
			if(i == 0){
				this.ctx.moveTo(path[i].x, path[i].y);  // 设置路径起点
			} else {
				this.ctx.lineTo(path[i].x, path[i].y);  // 绘制一条到的直线
			}
		}
		if(isClose){
			this.ctx.closePath();
		}
		if(fillStyle){
			this.ctx.fill();
		}
		if(strokeStyle){
			this.ctx.stroke();  // 进行线的着色，这时整条线才变得可见
		}
	}, this);
	
	return this;
}
/**
	绘制文字
	@param textParam = {
		x0: 初始X轴坐标, 
		y0: 初始Y轴坐标, 
		text: 要绘制的文字, 
		font: font-style font-variant font-weight font-size/line-height font-family, 
		textAlign: 对齐方式（start 默认， end， center， left， right）, 
		fillStyle: 填充样式,
		strokeStyle: 描边样式,
		lineWidth: 描边线宽
		textBaseline：文本基线（alphabetic 默认，top，hanging，middle，ideographic，bottom）,
		deg: 旋转角度, 
		rc: 旋转中心点,
		shadowBlur: 阴影距离, 
		shadowColor: 阴影颜色,
		shadowOffsetX: 阴影水平偏移,
		shadowOffsetY: 阴影垂直偏移,
		opacity: 透明度,
		scale: 缩放,
		isMeasure: 是否返回字体宽度
	}
*/
Canvas.prototype.drawText = function(textParam){
	var x0 = textParam.x0 || 0,
		y0 = textParam.y0 || 0,
		fillStyle = textParam.fillStyle,
		strokeStyle = textParam.strokeStyle,
		lineWidth = textParam.lineWidth,	
		text = textParam.text,
		font = textParam.font,
		textAlign = textParam.textAlign,
		textBaseline = textParam.textBaseline,
		isMeasure = textParam.isMeasure;

	this.decorate(textParam, function(){
		if(font) this.ctx.font = font; // 设置字体
		if(textAlign) this.ctx.textAlign = textAlign; // 设置对齐方式
		if(textBaseline) this.ctx.textBaseline = textBaseline;

		if(fillStyle){ 
			this.ctx.fillText(text, x0, y0);  // 设置字体内容，以及在画布上的位置
		}
		if(strokeStyle || lineWidth){
			this.ctx.strokeText(text, x0, y0);  // 绘制空心字
		}
	}, this);

	if(isMeasure){
		return this.ctx.measureText(text).width;
	}

	return this;
}
/**
	绘制弧线（圆）
	@param arcParam = {
		x0: 圆的中心x坐标,
		y0: 圆的中心y坐标，
		r: 圆的半径,
		sAngle: 起始角，以弧度计（弧的圆形的三点钟位置是 0 度）,
		eAngle: 结束角，以弧度计，
		counterclockwise: 可选。规定应该逆时针还是顺时针绘图。False = 顺时针，true = 逆时针,
		fillStyle: 填充样式,
		lineCap: 端点形状 butt 平直的边缘|round 圆形线帽|square 正方形线帽,
		strokeStyle: 描边样式,
		lineWidth: 描边线宽,
		shadowBlur: 阴影距离, 
		shadowColor: 阴影颜色,
		shadowOffsetX: 阴影水平偏移,
		shadowOffsetY: 阴影垂直偏移,
		opacity: 透明度,
		scale: 缩放
	}
	如果要绘制圆形 请设置sAngle为0，eAngle为360
*/
Canvas.prototype.drawArc = function(arcParam){
	var x0 = arcParam.x0 || 0,
		y0 = arcParam.y0 || 0,
		fillStyle = arcParam.fillStyle,
		lineCap = arcParam.lineCap,
		strokeStyle = arcParam.strokeStyle,
		lineWidth = arcParam.lineWidth,
		counterclockwise = !!arcParam.counterclockwise,
		eAngle = arcParam.eAngle,
		sAngle = arcParam.sAngle,
		r = arcParam.r;

		eAngle = eAngle * Math.PI / 180,
		sAngle = sAngle * Math.PI / 180;

		this.decorate(arcParam, function(){
			this.ctx.arc(x0 ,y0, r, sAngle, eAngle, counterclockwise);

			if(fillStyle){
				this.ctx.fill();
			}
			if(typeof strokeStyle != 'undefined' || typeof lineWidth != 'undefined' || typeof lineCap != 'undefined'){
				this.ctx.stroke();
			}
		}, this);

		return this;
}
/**
	指定点是否在当前路径中
*/
Canvas.prototype.isPointInPath = function(x, y){
	return this.ctx.isPointInPath(x, y);
}
/**
	剪切区域
*/
Canvas.prototype.clip = function(x, y, w, h){
	this.ctx.rect(x, y, w, h);
	this.ctx.stroke();
	this.ctx.clip();

	return this;
}
/**
	清除画布
*/
Canvas.prototype.clearArea = function(w, h){
	var width = w || this.cvs.width,
		height = h || this.cvs.height;
	this.ctx.clearRect(0, 0, width, height);
	return this;
}
/**
	创建ImageData对象
	@param imageDataParam = {
		width: ImageData的宽,
		height: ImageData的高,
		x0: ImageData 对象左上角的 x 坐标，以像素计,
		y0: ImageData 对象左上角的 y 坐标，以像素计,
		x: 可选。水平值（x），以像素计，在画布上放置图像的位置,
		y: 可选。水平值（y），以像素计，在画布上放置图像的位置,
		w: 可选。在画布上绘制图像所使用的宽度,
		h: 可选。在画布上绘制图像所使用的高度,
		r: 红,
		g: 绿,
		b: 蓝,
		a: 透明度
	}
	对于 ImageData 对象中的每个像素，都存在着四方面的信息，即 RGBA 值：
	R - 红色 (0-255)
	G - 绿色 (0-255)
	B - 蓝色 (0-255)
	A - alpha 通道 (0-255; 0 是透明的，255 是完全可见的)
	因此 ，transparent black 表示 (0,0,0,0)。
	color/alpha 以数组形式存在，并且既然数组包含了每个像素的四条信息，数组的大小是 ImageData 对象的四倍。（获得数组大小有更简单的办法，就是使用 ImageDataObject.data.length）
	包含 color/alpha 信息的数组存储于 ImageData 对象的 data 属性中。
*/
Canvas.prototype.createImageData = function(imageDataParam){
	var x0 = imageDataParam.x0 || 0,
		y0 = imageDataParam.y0 || 0,
		width = imageDataParam.width || imageDataParam.height || 1,
		height = imageDataParam.height || width,
		x = imageDataParam.x,
		y = imageDataParam.y,
		w = imageDataParam.w,
		h = imageDataParam.h,
		r = imageDataParam.r || 0,
		g = imageDataParam.g || 0,
		b = imageDataParam.b || 0,
		a = imageDataParam.a || 255;

	var imgData = this.ctx.createImageData(width, height);	
	/*
	for (var i = 0; i < imgData.data.length; i += 4){
		imgData.data[i + 0] = r;
		imgData.data[i + 1] = g;
		imgData.data[i + 2] = b;
		imgData.data[i + 3] = a;
	}
	*/
	/* context.putImageData(imgData, x, y, dirtyX, dirtyY, dirtyWidth, dirtyHeight); */
	this.ctx.putImageData(imgData, x0, y0, x, y, w, h);

	return imgData;
}
/**
	创建与指定的另一个 ImageData 对象尺寸相同的新 ImageData 对象（不会复制图像数据）
*/
Canvas.prototype.copyImageData = function(imgData){
	var newImgData = this.ctx.createImageData(imageData);
	// TODO
	return newImgData;
}
/**
	返回 ImageData 对象，该对象拷贝了画布指定矩形的像素数据
	@param posParam = {
		x0: 开始复制的左上角位置的 x 坐标,
		y0: 开始复制的左上角位置的 y 坐标,
		width: 将要复制的矩形区域的宽度,
		height: 将要复制的矩形区域的高度
	}
*/
Canvas.prototype.getImageData = function(posParam){
	var x0 = posParam.x0 || 0,
		y0 = posParam.y0 || 0,
		width = posParam.width || posParam.height || 1,
		height = posParam.height || width;
	
	var imgData = this.ctx.getImageData(x0, y0, width, height);
	return imgData;
}
/**
	将图像数据放回画布上
	@param posParam = {
		x0: ImageData 对象左上角的 x 坐标，以像素计,
		y0: ImageData 对象左上角的 y 坐标，以像素计,
		x: 可选。水平值（x），以像素计，在画布上放置图像的位置, 
		y: 可选。水平值（y），以像素计，在画布上放置图像的位置,
		width 可选。在画布上绘制图像所使用的宽度, 
		height 可选。在画布上绘制图像所使用的高度
	}
*/
Canvas.prototype.putImageData = function(imgData, posParam){
	var x0 = posParam.x0 || 0,
		y0 = posParam.y0 || 0,
		width = posParam.width || posParam.height || this.width,
		height = posParam.height || this.height,
		x = posParam.x || x0,
		y = posParam.y || y0;

	this.ctx.putImageData(imgData, x0, y0, x, y, width, height);
}
/**
	获取指定位置的颜色
	@param cordParam = {
		x0: 所获取颜色的canvas x 坐标,
		y0: 所获取颜色的canvas y 坐标,
	}
*/
Canvas.prototype.getRectColor = function(cordParam, imgData){
	var x0 = cordParam.x0 || 0,
		y0 = cordParam.y0 || 0;
	
	x0 = parseInt(x0),
	y0 = parseInt(y0);

	imgData = imgData || this.getImageData({
		width: this.width,
		height: this.height
	});
	var i = ((y0 * this.width) + x0) * 4;
	return getHex(imgData.data, i);

	function getHex(data, i) {
		//  Builds a CSS color string from the RGB value (ignore alpha)
		return ("#" + d2Hex(data[i]) + d2Hex(data[i + 1]) + d2Hex(data[i + 2]));

		function d2Hex(d) {
			// Converts a decimal number to a two digit Hex value
			var hex = Number(d).toString(16);
			while (hex.length < 2) {
				hex = "0" + hex;
			}
			return hex.toUpperCase();
		}
	}
}
/**
 图片压缩并转base64编码
 @param compressParam = {
	prefix: 图片输出格式 -- jpeg、png、gif,
	quality: 图片压缩质量(0, 1],
	size: 图片最大尺寸,
	sizeType: 最大尺寸类型 —— 宽度w ：高度h,
 }
 */
Canvas.prototype.base64 = function(image, compressParam){
	var prefix = !compressParam.prefix ? 'image/jpeg' : compressParam.prefix.substring(0, 6) == 'image/' ? compressParam.prefix : 'image/' + compressParam.prefix, // TODO 获取图片格式
		quality = !isNaN(compressParam.quality) ? compressParam.quality : 1,
		sizeType = compressParam.sizeType || 'w',
		size = !isNaN(compressParam.size) ? compressParam.size : (sizeType == 'w' ? image.width : image.height);

	var cvs = document.createElement('canvas'),
		isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
		imageData,
		width, height;

	// 首先计算出图片应该的宽高
	if(sizeType == 'w'){
		if(image.width <= size){
			width = image.width,
			height = image.height;	
		} else {
			width = size,
			height = image.height / image.width * size;
		}
	} else if(sizeType == 'h'){
		if(image.height <= size){
			width = image.width,
			height = image.height;	
		} else {
			height = size,
			width = image.width / image.height * size;
		}
	}

	if(isiOS && typeof MegaPixImage != 'undefined'){
		var mpImg = new MegaPixImage(image);
			mpImg.render(cvs, { 
				width: width, 
				height: height 
			});
	} else {
		cvs.width = width,
		cvs.height = height;

		cvs.getContext('2d').drawImage(image, 0, 0, cvs.width, cvs.height);
	}

	imageData = cvs.toDataURL(prefix, quality);

	return imageData;
}