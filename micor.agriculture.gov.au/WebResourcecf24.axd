//this is very similar (in fact shamelessly stolen from) the Microsoft ASP.Net2 code for default buttons on forms
//the difference is that we are going to allow it from fields, sections, or panels - not just one default for the form

var __alreadyFired = false;
function daffControl_FireDefaultButton(event, target)
{
	//Check that we have not already handled this, check that it is the return key that was pressed, and check that it is not
	//from a textarea (which should allow multiple lines)
	try
	{
		if (!__alreadyFired && event.keyCode == 13 && !(event.srcElement && (event.srcElement.tagName.toLowerCase() == "textarea")))
		{
			var defaultButton = document.getElementById(target);
	        
			if (defaultButton && typeof(defaultButton.click) != "undefined")
			{
				__alreadyFired = true;
				defaultButton.click();									//fire the click event
				event.cancelBubble = true;								//regardless of browser, stop the event bubbling to higher levels
				if (event.stopPropagation) event.stopPropagation();
				return false;											//cancel the event
			}
		}
	}
	catch(ex){}															//ignore exceptions
    return true;														//was not the enter key, allow the event
}