/* 动画相关 */
var animateQueue = [],  // 动画队列
animate = function(elem, types, duration, callBack) {
	if(typeof duration == 'function'){
		callBack = duration;
		duration = null;
	}
	duration = duration || 300;

	var frap = 5,
		arg = arguments;

	var action = function(){
		var	width,
			left,
			startPos,
			distant,
			destination,
			moveDirection,
			curPos,
			type,
			speed,
			filter,
			newTypes = {};

		for(var i in types){
			if(i == 'left'){
				left = elem.offsetLeft;
				
				if(match = (types[i] + '').match(/^\s*([-+]*)(\=*)\s*(\d+)(%|px)*\s*$/)){
					//["-=100%", "-", "=", "100", "%", index: 0, input: "-=100%"]
					//["-100%", "-", "", "100", "%", index: 0, input: "-100%"]

					if(match[4] == '%'){
						// 百分比
						if(!width){
							width = elem.offsetParent.clientWidth;
						}
						type = '%',
						startPos = (left / width) * 100;  // 起点
					} else if(match[4] == 'px' || !match[4]){
						// 像素
						type = 'px',
						startPos = left;  // 起点
					}
				}
			} else if(i == 'opacity'){
				var o = getStyle(elem, 'opacity');
				type = '';
				startPos = o;
			}

			if(match[2] == '='){
				// 增/减量运动 '-= 100%'
				destination = match[1] == '-' ? startPos - match[3] : startPos + match[3]; // 目的地
			} else {
				destination = match[1] == '-' ? - match[3] : match[3]; // 目的地
			}

			distant = destination - startPos, // 剩余距离
			moveDirection = distant > 0 ? 1 : -1;

			speed = - new Number(distant / (duration / frap));
			
			newTypes[i] = {
				type: type,
				startPos: startPos,
				curPos: startPos,
				distant: distant,
				destination: destination,
				moveDirection: moveDirection,
				speed: speed
			}
		}
	
		var timer = setInterval(function(){
			duration -= frap;
			duration < 0 && (duration = 0);
			for(var i in newTypes) {
				newTypes[i].distant = newTypes[i].destination - newTypes[i].curPos; // 剩余距离
				// 到达目的地
				if(newTypes[i].distant <= 0 && newTypes[i].moveDirection > 0 || newTypes[i].distant >= 0 && newTypes[i].moveDirection < 0 || duration == 0){
					if(!duration){
						animateEnd(elem, timer, newTypes, callBack);
					} else {
						setTimeout(function(){
							animateEnd(elem, timer, newTypes, callBack);
						}, duration);
					}
					return;
				}
				newTypes[i].curPos = newTypes[i].curPos - newTypes[i].speed;
				if(!supportOpacity && i == 'opacity'){
					filter = getStyle(elem, 'filter');
					var opacityFilter = 'alpha(opacity=' + Math.floor(newTypes[i].curPos * 100) + ')';
					if(filter){
						filter = filter.replace(opacityReg, opacityFilter);
					} else {
						filter = opacityFilter;
					}
					elem.style.filter = filter;
				} else {
					elem.style[i] = newTypes[i].curPos + newTypes[i].type;	
				}
			}
		}, frap);

		return timer;
	}
	
	return start(addAnimate(elem, action));
},
start = function(elem){
	for(var i = 0; i < animateQueue.length; i ++){
		if(animateQueue[i].e === elem){
			if(animateQueue[i].a){
				// 已经有运动动画
				break;
			}
			// 开始动画
			var timer = animateQueue[i].f();
			animateQueue[i].a = true,
			animateQueue[i].t = timer;
		}
	}
	return elem;
}
stop = function(elem){
	for(var i = 0; i < animateQueue.length; i ++) {
		if(animateQueue[i].e === elem){
			if(animateQueue[i].t){
				clearInterval(animateQueue[i].t);	
			}
			animateQueue[i].f = null;
			animateQueue.splice(i, 1);
			i --;
		}
	}
	return elem;
},
animateEnd = function(elem, timer, newTypes, callBack){
	removeAnimate(timer);
	for(var i in newTypes){
		if(!supportOpacity && i == 'opacity'){
			var filter = getStyle(elem, 'filter'),
				opacityFilter = 'alpha(opacity=' + Math.floor(newTypes[i].destination * 100) + ')';
			if(filter){
				filter = filter.replace(opacityReg, opacityFilter);
			} else {
				filter = opacityFilter;
			}
			elem.style.filter = filter;
		} else {
			elem.style[i] = newTypes[i].destination + newTypes[i].type;
		}
	}
	if(typeof callBack == 'function'){
		callBack.apply(elem);
	}
	// 动画队列
	return start(elem);
},
addAnimate = function(elem, action){
	animateQueue.push({
		e: elem,
		f: action,
		a: false,
		t: null
	});
	return elem;
},
removeAnimate = function(timer){
	for(var i = 0; i < animateQueue.length; i ++) {
		if(animateQueue[i].t === timer){
			clearInterval(animateQueue[i].t);
			animateQueue[i].f = null;
			animateQueue.splice(i, 1);
			break;
		}
	}
}

/* class相关 */
var clazzRegPrefix = '(\\s|^)(',
	clazzRegSuffix = ')(\\s|$)',
addClass = function(elem, clazz){
	if(!elem.nodeName){
		// nodeList
		for(var i = 0; i < elem.length; i ++) {
			addClass(elem[i], clazz);
		}

		return elem;
	}
	var clazzReg = new RegExp(clazzRegPrefix + clazz + clazzRegSuffix, 'ig');
	if(!clazzReg.test(elem.className)){
		elem.className = elem.className + " " + clazz;
	}
	return elem;
},
removeClass = function(elem, clazz){
	if(!elem.nodeName){
		// nodeList
		for(var i = 0; i < elem.length; i ++) {
			removeClass(elem[i], clazz);
		}

		return elem;
	}
	var clazzReg = new RegExp(clazzRegPrefix + clazz + clazzRegSuffix, 'ig');
	elem.className = elem.className.replace(clazzReg, '$1$3');
	return elem;
},
hasClass = function(elem, clazz){
	clazz = new RegExp(clazzRegPrefix + clazz + clazzRegSuffix, 'ig');
	return clazz.test(elem.className);
},
filterClass = function(elems, clazz){
	clazz = new RegExp(clazzRegPrefix + clazz + clazzRegSuffix, 'ig');
	if(elems.nodeName){
		return clazz.test(elems.className) ? [elems] : [];
	}
	var nodeList = [];
	for(var i = 0; i < elems.length; i ++) {
		if(clazz.test(elems[i].className)){
			nodeList.push(elems[i]);
		}
	}

	return nodeList;
}

/* CSS相关 */
var opacityReg = /alpha\(opacity\=(\d{1,3})\)/,
getStyles = function(elem){
	if(elem.currentStyle) {
		return elem.currentStyle;
	} else if(window.getComputedStyle) {
		  return window.getComputedStyle(elem , null);
	}
},
getStyle = function(elem, style){
	var styleResult = getStyles(elem)[style];
	if(style == 'opacity'){
		if(styleResult == undefined){
			// 低版本IE
			styleResult = getStyle(elem, 'filter');
			var opacityMatcher = styleResult.match(opacityMatcher);
			if(opacityMatcher[0]){
				styleResult = match[1] / 100;
			} else {
				styleResult = 1;
			}
		}
	}
	return styleResult;
},
supportOpacity = getStyles(document.body)['opacity'] != undefined;

/* 事件相关 */
var fnProxyList = [],  // 低版本IE用于解绑事件的数组
addEvent = function(elem, evt, fn){
	if(elem.length){
		for(var i = 0; i < elem.length; i ++) {
			addEvent(elem[i], evt, fn);
		}
		return;
	}
	if(elem.addEventListener){
		elem.addEventListener(evt, fn);
	} else {
		// 存储fn以便后面解绑
		var fnProxy = function(e){
			e = getEvent(e);
			fn.call(elem, e);
		};
		fnProxy.fn = fn,
		hasBind = false;;
		for(var i = 0; i < fnProxyList.length; i ++) {
			if(fnProxyList[i].proxy.fn === fn){
				fnProxyList.bindTimes ++;
				hasBind = true;
				break;
			}
		}
		if(!hasBind){
			fnProxyList.push({
				proxy: fnProxy,
				bindTimes: 1  // 绑定次数
			});	
		}
		elem.attachEvent('on' + evt, fnProxy);
	}
},
removeEvent = function(elem, evt, fn){
	if(elem.length){
		for(var i = 0; i < elem.length; i ++) {
			removeEvent(elem[i], evt, fn);
		}
		return;
	}
	if(elem.removeEventListener){
		elem.removeEventListener(evt, fn);
	} else {
		// 找到对应的fn
		for(var i = 0; i < fnProxyList.length; i ++) {
			if(fnProxyList[i].proxy.fn === fn){
				elem.detachEvent('on' + evt, fnProxyList[i].proxy);
				fnProxyList[i].bindTimes --;
				if(fnProxyList[i].bindTimes == 0){
					fnProxyList.splice(i, 1);  // 移除相关代理
				}
				break;
			}
		}
	}
},
getEvent = function(e){
	e = e || window.event;
	if(!e.preventDefault){
		e.preventDefault = function(){
			e.returnValue = false;
		}
	}
	if(!e.stopPropagation){
		e.stopPropagation = function(){
			e.cancelBubble = true;
		}
	}
	return e;
}

/* 工具相关 */
/*
var getIndex = function(list, elem){
	if(typeof list.indexOf == 'function'){
		return list.indexOf(elem);
	}
	for(var i = 0; i < list.length; i ++) {
		if(list[i] === elem){
			return i;
		}
	}
	return -1;
}
*/
if (typeof Array.prototype.indexOf != "function") {
	Array.prototype.indexOf = function (searchElement, fromIndex) {
		var index = -1;
		fromIndex = fromIndex * 1 || 0;

		for (var k = 0, length = this.length; k < length; k++) {
			if (k >= fromIndex && this[k] === searchElement) {
				index = k;
				break;
			}
		}
		return index;
	}
}

/* 轮播函数 */
function Banner(banner_main, banner_page){
	this.banner_main = banner_main;
	this.banner_page = banner_page;

	this.banner_principle = document.getElementById('principle').getElementsByTagName('ul')[0];;  // 仅用于演示
	
	this.banner_main_li = this.banner_main.getElementsByTagName('li');
	this.banner_page_li = this.banner_page.getElementsByTagName('li');

	this.banner_principle_li = this.banner_principle.getElementsByTagName('li');  // 仅用于演示
	
	this.bannerLiLength = this.banner_main_li.length; 
	this.bannerUnitWidth = 100 / this.bannerLiLength;
	this.currentIndex = 0;

	this.bannerStop;
	this.timer;
}
// 自动轮播
Banner.prototype.auto = function(){
	var _this = this;
	addClass(this.banner_page_li[_this.currentIndex], 'cur');
	
	(function(){
		var arg = arguments;
		_this.timer = setTimeout(function(){
			if(_this.bannerStop) return;

			_this.currentIndex ++;

			if(_this.currentIndex == _this.bannerLiLength) _this.currentIndex = 0;

			addClass(removeClass(_this.banner_page_li, 'cur')[_this.currentIndex], 'cur');

			/* 仅用于演示 */
			animate(_this.banner_principle, {
				left: '-=' + '100%'	
			}, function(){
				if(!_this.currentIndex) {
					this.style.left = 0;
					_this.banner_principle_li[0].style.left = 0;
				} else if(_this.currentIndex == _this.bannerLiLength - 1) {
					_this.banner_principle_li[0].style.left = (_this.bannerLiLength * _this.bannerUnitWidth) + '%';
				}
			});

			animate(_this.banner_main, {
				left: '-=' + '100%'	
			}, function(){
				if(!_this.currentIndex) {
					this.style.left = 0;
					_this.banner_main_li[0].style.left = 0;
				} else if(_this.currentIndex == _this.bannerLiLength - 1) {
					_this.banner_main_li[0].style.left = (_this.bannerLiLength * _this.bannerUnitWidth) + '%';
				}

				arg.callee();
			});
		}, 2000);
	})();
}
// 手动轮播
Banner.prototype.hand = function(){
	var _this = this;

	addEvent(this.banner_page_li, 'mouseover', function(){
		clearTimeout(_this.timer);
		_this.bannerStop = true;

		if(hasClass(this, 'cur')){
			return;
		}

		removeClass(filterClass(_this.banner_page_li, 'cur'), 'cur');
		addClass(this, 'cur');

		var index = [].indexOf.call(_this.banner_page_li, this);

		if(index == 0 || index == 1) {
			_this.banner_main_li[0].style.left = 0;

			_this.banner_principle_li[0].style.left = 0; // 仅用于演示
		}

		_this.currentIndex = index;

		/* 仅用于演示 */
		animate(stop(_this.banner_principle), {
			left: '-' + index * 100 + '%'	
		}, function(){
			if(_this.currentIndex >= _this.bannerLiLength - 1) {
				_this.banner_principle_li[0].style.left = (_this.bannerLiLength * _this.bannerUnitWidth) + '%';
			} 
		});

		animate(stop(_this.banner_main), {
			left: '-' + index * 100 + '%'	
		}, function(){
			if(_this.currentIndex >= _this.bannerLiLength - 1) {
				_this.banner_main_li[0].style.left = (_this.bannerLiLength * _this.bannerUnitWidth) + '%';
			} 
		});
	});

	addEvent(this.banner_page_li, 'mouseout', function(){
		_this.bannerStop = false;
		_this.auto();
	});
}

var banner = document.getElementById('banner');
banner = banner.getElementsByTagName('ul')[0];
var pager = document.getElementById('pager');
pager = pager.getElementsByTagName('ul')[0];

var b = new Banner(banner, pager);
b.auto();
b.hand();