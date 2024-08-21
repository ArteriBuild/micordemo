var daffWebControls = {};		//all our controls that have client side 'APIs'  will register their controls within this object

//Appends class name to element (if not already there)
function daffControl_AppendToClassName(element, className) 
{
    var current = element.className;
    if (current)
    {
		if (current.indexOf(className) < 0)
		{
			if (current.charAt(current.length - 1) != ' ')
				current += ' ';
			
			current += className;
        }
    }
    else 
        current = className;

    element.className = current;
}

//strip class name from element
function daffControl_RemoveFromClassName(element, className)
{
    var current = element.className;
    if (current)
    {
    
        if (current == className)
            element.className = "";											//lose everything (had no other class)
        else
        {
			element.className = element.className.replace(className, "");	//remove any instance of class name
			element.className = element.className.replace("/\s+$/g", "");	//remove any trailing whitespace
		}
    }
}

//calculates the absolute offset of an element from the top of the screen
function daffControl_AbsoluteOffsetTop(element)
{
    var offset = element.offsetTop; 

	if (element.offsetParent)
	{
		var parent = element.offsetParent;
		while (parent)
		{
			offset += parent.offsetTop;
			parent = parent.offsetParent;
		}
    }
    
    return offset;
}

//calculates the absolute offset of an element from the left of the screen
function daffControl_AbsoluteOffsetLeft(element)
{
    var offset = element.offsetLeft; 

	if (element.offsetParent)
	{
		var parent = element.offsetParent;
		while (parent)
		{
			offset += parent.offsetLeft;
			parent = parent.offsetParent;
		}
    }
    
    return offset;
}

//Get mouse position from the left of the screen (includes scrolling etc...)
function daffControl_GetMouseX(e)
{
    if (!e) var e = window.event;
    
	if (e.pageX)
	    return e.pageX;
	else if (e.clientX)
	    return e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
}

//Gets the aboluste position of the mouse from the top of the screen (scrolling etc...)
function daffControl_GetMouseY(e)
{
    if (!e) var e = window.event;
    
	if (e.pageY)
		return e.pageY;
	else if (e.clientY)
		return e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
}

//Gets the first item of the specified node name after the specified element
function daffControl_NextItem(item, nodeName)
{
    var next = item.nextSibling
	while (next != null) 
	{
		if (next.nodeName == nodeName)
		    return next;
		next = next.nextSibling
	}
	return null;
}

//Gets the first item of the specified node name before the specified element
function daffControl_PreviousItem(item, nodeName)
{
	var previous = item.previousSibling;
	while (previous != null)
	{
		if (previous.nodeName == nodeName)
		    return previous;
		previous = previous.previousSibling;
	}
	return null;
}

//moves element a before element b in the document
function daffControl_MoveBefore(a, b)
{
	var parent = a.parentNode;
	parent.removeChild(a);
	parent.insertBefore(a, b);
}

// Get the ancestor element of any tag name.
function daffControl_GetParentByTagName(element, tag)
{
	var lTag = tag.toLowerCase();
    while (element != null && element.tagName.toLowerCase() != lTag)
    {
        element = element.parentNode;
    }
    return element;
}

//Cross browser event raising
function daffControl_RaiseEvent(obj, eventType, bubbles, cancelable, eventCategory)
{
	if (document.createEvent && obj.dispatchEvent)		//standards complient
	{
		var eventObj;
		
		if (window.KeyEvent && eventType && eventType.match(/^key.*/i)) //Mozilla is annoying... does keyevents instead of UI events
			eventObj = document.createEvent('KeyEvents');
		else
			eventObj = eventCategory ? document.createEvent(eventCategory) : document.createEvent('HTMLEvents');	//Possible values: UIEvents, MouseEvents, MutationEvents, HTMLEvents
  
		if (eventObj)
		{	
			eventObj.initEvent(eventType, bubbles, cancelable);
			obj.dispatchEvent(eventObj);
		}
	}
	else if (obj.fireEvent)
		obj.fireEvent('on' + eventType);				//easy ie
}

// Cross browser event handler registration
function daffControl_AddEvent(obj, eventType, handler, useCapture)
{
	if (obj.addEventListener)
	{
		obj.addEventListener(eventType, handler, useCapture);
		return true;
	}
	else if (obj.attachEvent)
		return obj.attachEvent('on' + eventType, handler);
}

//Using attachEvent or addEventListener the submit event only fires when a user submits (not when javascript does, eg __doPostback)
//Attaching in this way however will fire it. Split out of AddEvent to maintain consistency and also because cannot be bothered
//doing a RemoveSubmitEvent() yet
function daffControl_AddSubmitEvent(obj, handler)
{
	var oldSubmit = obj.onsubmit;
	if (typeof(oldSubmit) != 'function')
		obj.onsubmit = handler;
	else
		obj.onsubmit = function(){ 
			var x = oldSubmit();		//run the original event handler
			var y = handler();			//run the new event handler
			if (x == null) x = true;	//if original did not return anything, call it true
			if (y == null) y = true;	//if new did not return anything, call it true
				
			return x && y;				//return the result of both
		};
}

// Cross browser event handler deregistration
function daffControl_RemoveEvent(obj, eventType, handler, useCapture)
{
	if (obj.removeEventListener)
	{
		obj.removeEventListener(eventType, handler, useCapture);
		return true;
	}
	else if (obj.detachEvent)
		return obj.detachEvent('on' + eventType, handler);
} 

//Fix for the fact that scope gets lost when attaching events - taken from:
//http://amix.dk/blog/viewEntry/139 (very nice!) - note: name and formating changed by us
function daffControl_GetRealScope(fn)
{
	var scope = window;
	if(fn._cscope) scope = fn._cscope;
	
	return function() { return fn.apply(scope, arguments); };
}
function daffControl_BindFunction(fn, obj)
{
	fn._cscope = obj;
	return daffControl_GetRealScope(fn);
}


// Cross browser event target
function daffControl_EventTarget(e)
{
	return e.srcElement ? e.srcElement : e.target;
}

// Initializes a new instance of the StringBuilder class
// and appends the given value if supplied
function daffControl_StringBuilder(value)
{
    this.buffer = new Array();
    
    if (value)
		this.append(value);
}

// Appends the given value to the end of this instance.
daffControl_StringBuilder.prototype.append = function (value)
{
    this.buffer.push(value);
}

// Clears the string buffer
daffControl_StringBuilder.prototype.clear = function ()
{
    this.buffer.length = 0;
}

// Converts this instance to a String.
daffControl_StringBuilder.prototype.toString = function (seperator)
{
	if (seperator)
		return this.buffer.join(seperator);
	else
		return this.buffer.join("");
}
