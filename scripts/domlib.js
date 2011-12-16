if (!document.getElementById) window.location="http://www.webstandards.org/upgrade/"
ie=(document.all)?true:false; mac=(navigator.platform.indexOf("Mac") != -1)? true:false;
function DomElement(i,s) {
	exist=this.elm=document.getElementById(i)
	if (!this.elm) this.elm=document.createElement("DIV")
	this.elm.id=i
	this.obj=i+"Object"
	eval(this.obj+"=this")
	if (!s && !exist) this.elm.style.position='absolute'
	else this.elm.className=s

	this.style=this.elm.style
	DomElement.stack[DomElement.stack.length]=this
	return this
}
DomElement.stack=new Array()
DomElement.destroy=function() {
	for (var i=DomElement.stack.length-1; i>-1; i--) {
		DomElement.stack[i].style=null
		DomElement.stack[i].elm.id=null
		DomElement.stack[i].elm=null
	}
}
DomElement.prototype.setHTML=function(s) { this.elm.innerHTML=s }
DomElement.prototype.appendChild=function(o) { this.elm.appendChild(o.elm) }
DomElement.prototype.setXY=function(x,y) { this.style.left=x; this.style.top=y }
DomElement.prototype.setWH=function(w,h) { this.style.width=w; this.style.height=h }
DomElement.prototype.getX=function() { return this.elm.offsetLeft }
DomElement.prototype.getY=function() { return this.elm.offsetTop }
DomElement.prototype.getW=function() { return this.elm.offsetWidth }
DomElement.prototype.getH=function() { return this.elm.offsetHeight }
DomElement.prototype.killEvents=function() {
	if (ie) {
		this.elm.onmouseup=function(e){ event.cancelBubble=true }
		this.elm.onmouseout=function(e){ event.cancelBubble=true }
		this.elm.onmouseover=function(e){ event.cancelBubble=true }
		this.elm.onmousedown=function(e){ event.cancelBubble=true }
		this.elm.oncontextmenu=function(){ return false };
	} else {
		this.elm.addEventListener('mouseup',function(e){ e.cancelBubble=true },false)
		this.elm.addEventListener('mouseout',function(e){ e.cancelBubble=true },false)
		this.elm.addEventListener('mouseover',function(e){ e.cancelBubble=true },false)
		this.elm.addEventListener('mousedown',function(e){ e.cancelBubble=true },false)
	}
}
DomElement.prototype.addEventListener=function(evType,fn,useCapture){
	if (evType.indexOf('mouse')==0) {
		if (ie) return this.elm.attachEvent("on"+evType, fn)
		else {
			this.elm.addEventListener(evType,fn,useCapture)
			return true
		}
	} else eval(this["on"+evType]=fn)
} 
DomElement.prototype.removeEventListener=function(evType,fn,useCapture){
	if (evType.indexOf('mouse')==0) {
		if (ie) return this.elm.detachEvent("on"+evType,fn)
		else {
			this.elm.removeEventListener(evType,fn,useCapture)
			return true
		}
	} else eval(this["on"+evType]=null)
} 
DomElement.prototype.invokeEvent=function(evType,args) {
	var ret=true
	if(this["on"+evType]) ret=this["on"+evType](args)
	if(ret && this.parent) this.parent.invokeEvent(evType,args)
}
function getContainerLayerOf(element) {
	if(!element) return null
	if(ie) while (element.tagName!='DIV' && element.parentDomElement && element.parentDomElement!=element) element=element.parentDomElement;
	else while (element.tagName!='DIV' && element.parentNode && element.parentNode!=element) element=element.parentNode;
	return element
}
function documentWidth() { return document.body.clientWidth }
function documentHeight() { return document.body.clientHeight }
onunload=DomElement.destroy