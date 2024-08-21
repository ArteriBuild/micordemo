/*Applies validation to field*/
function daffControl_Validate(field, sender, settings)
{   
	try
	{
		//only validation text fields and only if they have a value
		if (daffControl_EventTarget(sender) && daffControl_EventTarget(sender).tagName.match(/^input$|^textarea$/i) && settings)
		{
			var inputField = daffControl_EventTarget(sender);
			var value = inputField.value;

			if (value)
			{
				var validation = daffControl_ExtractValidation(field, sender, settings);	//extract validation settings
				
				if (validation)
				{
                    
					var extracted;
					var valid;
					
					//first try to convert the value to the type
					var validator = validators[validation.type];

					if (validator)
						extracted = validator.extract(value);
					valid = extracted != null;

					for (var i = 0; i < validation.tests.length && valid; i++)
					{
						var check = validator[validation.tests[i].test];	//get the validator for this test
						if (check)
							valid &= check(extracted, validation.tests[i].value);					//run the check
					}
					
					if (!valid)
					{
						daffControl_AppendToClassName(daffControl_EventTarget(sender), "invalidValue");		//was not valid - add invalid class
						return;
					}
				}
			}
			
			//if we get here then either no value or value was valid - remove the invalid class (if it existed)
			daffControl_RemoveFromClassName(daffControl_EventTarget(sender), "invalidValue");
		}
		
	}
	
	catch(ex){}	//there shouldn't be any exceptions but if they are we def don't care about them
}

/*Class to hold our settings*/
function Control_Settings()
{
	var type;
	var tests;
}

var cachedSettings = {};
function daffControl_ExtractValidation(field, sender, encoded)
{
	var validation;
	
	var key = daffControl_GetUniqueId(field, sender);
	if (key)
		validation = cachedSettings[key];
	
	if (validation)							//if had on cache just use them
		return validation;

	var parsed = encoded.split(';');
	if (parsed)
	{
		validation = new Control_Settings();
		validation.tests = new Array();

		for (var i = 0; i < parsed.length; i++)
		{
			setting = parsed[i].split('=');
			if (setting[0] == 'type')
				validation.type = setting[1];
			else
				validation.tests.push({test: setting[0], value: setting[1]});
		}
		
		cachedSettings[key] = validation;	//cache for next time
		return validation;
	}
	
	return null;
}
//constructs an identifier that can be used to cache settings for a field/element
function daffControl_GetUniqueId(field, sender)
{
	return (field.parentNode.id + ':' + daffControl_EventTarget(sender).id);
}

/*Hashtable of objects containing further hashtables of objects that will perform the validation*/
var validators = {
    'date':{   
		type: 'date',
		extract: function(value)
			{return daffControl_ExtractDate(value);},
		minimumvalue: function(value, minimum)
			{return daffControl_CheckMinimumValue(value, daffControl_ExtractDate(minimum));},
		maximumvalue: function(value, maximum)
			{return daffControl_CheckMaximumValue(value, daffControl_ExtractDate(maximum));}
    },
   'decimal': { 
		type: 'decimal',
		extract: function(value){return daffControl_ExtractDecimal(value);},
		maxlength: function(value, length)
			{return daffControl_CheckPrecisionScale(Math.abs(value), length);},
		minimumvalue: function(value, minimum)
			{return daffControl_CheckMinimumValue(value, daffControl_ExtractDecimal(minimum));},
		maximumvalue: function(value, maximum)
			{return daffControl_CheckMaximumValue(value, daffControl_ExtractDecimal(maximum));}
    },
    'email': { 
		type: 'email',
		extract: function(value){return daffControl_ExtractEmail(value);}
    },
    'integer':{ 
		type: 'integer',
		extract: function(value){return daffControl_ExtractInteger(value);},
		maxlength: function(value, length)
			{return daffControl_CheckLength(Math.abs(value), length);},
		minimumvalue: function(value, minimum)
			{return daffControl_CheckMinimumValue(value, daffControl_ExtractInteger(minimum));},
		maximumvalue: function(value, maximum)
			{return daffControl_CheckMaximumValue(value, daffControl_ExtractInteger(maximum));}
    },
    'time':{ 
		type: 'time',
		extract: function(value){return daffControl_ExtractTime(value);},
		minimumvalue: function(value, minimum)
			{return daffControl_CheckMinimumValue(value, daffControl_ExtractTime(minimum));},
		maximumvalue: function(value, maximum)
			{return daffControl_CheckMaximumValue(value, daffControl_ExtractTime(maximum));}
    },
    'string':{ 
		type: 'string',
		extract: function(value){return value;},
		maxlength: function(value, length)
			{return daffControl_CheckLength(value, length);}
    },
    'stringalphaspace':{ 
		type: 'stringalphaspace',
		extract: function(value){return daffControl_ExtractStringAlphaSp(value);},
		maxlength: function(value, length)
			{return daffControl_CheckLength(Math.abs(value), length);}
    },
    'stringalphanumericspace':{ 
		type: 'stringalphanumericspace',
		extract: function(value){return daffControl_ExtractStringAlphaNumSp(value);},
		maxlength: function(value, length)
			{return daffControl_CheckLength(Math.abs(value), length);}
    },
   'custom': { 
		type: 'custom',
		extract: function(value){return value;},
		validationexpression: function(value, expression)
			{return daffControl_CheckExtractCustom(value, expression);}
    },
    'password': { 
		type: 'password',
		extract: function(value){return daffControl_ExtractPassword(value);}
    }
};


/*Length checking functions*/
function daffControl_CheckLength(value, length)
{
	if(value == null || length == null)
		return true;
	else
		return value.toString().length <= length;
}

function daffControl_CheckPrecisionScale(value, length)
{
	if(value == null || length == null)
		return true;
		
	//they can pass in length as either just a number (for total length) or precision.scale (eg 10.2)
	//precision is the total number of digits, scale is the number right of the decimal point
	var constraint = length.split('.');
	if (constraint)
	{
		if (constraint.length == 2)					//check precision AND scale
		{
			var parts = value.toString().split('.');
			if (parts.length > 1)	//check precision and scale
				return (value.toString().replace('.','').length <= constraint[0] && parts[1].length <= constraint[1]);
			else					//just check precision
				return parts[0].length <= constraint[0];
		}
		else										//just check total length (do not include decimal point)
			return value.toString().replace('.','').length <= constraint[0];
	}
	
	return true;
}

/*Range checking functions*/

function daffControl_CheckMinimumValue(value, minimum)
{
	if (value == null || minimum == null)
		return true;
	else
		return value >= minimum;
}

function daffControl_CheckMaximumValue(value, maximum)
{
	if (value == null || maximum == null)
		return true;
	else
		return value <= maximum;
}

var MonthNames = {jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};	//makes lookup easy
function daffControl_ExtractDate(value)
{
	//matching for dd/mm/yyyy with '/','-',' ' as spacers 
	//var re = /^(\d{1,2})([\/\s-])(\d{1,2})\2(\d{4}|\d{2})$/;
	//matching for any combination of dd mm yyyy or dd MMM yyyy or dd MMMM yyyy with either '/', '-', or ' ' as spacers (note using case insensitve flag)
	var re = /^(\d{1,2})([\/\s-])((?:0?[1-9]|1[012])|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?))\2(\d{4}|\d{2})$/i;
	var bits = re.exec(value);
    if (bits && bits.length == 5)
    {
		var year  = parseInt(bits[4],10);
		var month = null;
		if (isNaN(bits[3]))
		{
			month = MonthNames[bits[3].toLowerCase().substring(0,3)];		//grab the value of the month from our list
			if(month == null)
				return null; 
			else
				month = parseInt(month, 10);
		}
		else
			month = parseInt(bits[3],10) - 1;	//javascript months are 0 based... go figure
		
		var day = parseInt(bits[1],10);
		
		//adjust for 2 digit years
		if (year < 100)
			year += year < 20 ? 2000 : 1900;
		
		var date = new Date();
		date.setYear(year);
		date.setMonth(month);
		date.setDate(day);
		
		//stupid date accepts months > 12 etc... it just rolls into next month
		//so after setting the date check that current day/month/year what we parsed
		if (date.getDate() == day && date.getMonth() == month && date.getFullYear() == year)
			return date;
    }
    
    return null;
}

function daffControl_ExtractInteger(value)
{
	//check it really is an integer
	if (value.match(/^[-+]?\d+$/))
	{
	    var num = parseInt(value,10);
		return (isNaN(num) ? null : num);
	}
		
	return null;
}

function daffControl_ExtractDecimal(value)
{
	//check it really is either an integer or a decimal (ie the decimal point is optional)
	if (value.match(/^[-+]?(\d+)(\.\d+)?$/))
	{
	    var num = parseFloat(value,10);
		return (isNaN(num) ? null : num);
	}
		
	return null;
}

function daffControl_ExtractEmail(value)
{
	//check that it is an email address of valid form
	if (value.match(/^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@(([0-9a-zA-Z])+([-\w]*[0-9a-zA-Z])*\.)+[a-zA-Z]{2,9})$/))
		return value;
		
	return null;
}

function daffControl_ExtractTime(value)
{
	//matching for hhdd or hh:dd
	var re = /^(\d{4})|(\d{1,2}:\d{2})$/;
	var bits = re.exec(value);
    if (bits && bits.length == 3)
    {
		var hours;
		var minutes;
		
		if (bits[1])			//they entered hhmm
		{
			hours = bits[1].substr(0,2);
			minutes = bits[1].substr(2,2);
		}
		else					//they entered hh:mm
		{
			hours = bits[2].split(':')[0];
			minutes = bits[2].split(':')[1];
		}
		
		var time = new Date();
		time.setHours(hours);
		time.setMinutes(minutes);
		
		//stupid date accepts minutes > 59 etc... it just rolls into next hours
		//so after setting the time check that current hours/minutes is what we parsed
		if (time.getHours() == hours && time.getMinutes() == minutes)
			return time;
    }
    
    return null;
}

//used for strings only containing alpha, apostrophe, hyphen and space characters
function daffControl_ExtractStringAlphaSp(value)
{
	//check that it is a string of valid form
	if (value.match(/^[a-zA-Z-'.\s]+$/))
		return value;
		
	return null;
}

//used for strings only containing alpha numeric and space characters
function daffControl_ExtractStringAlphaNumSp(value)
{
	//check that it is a string of valid form
	if (value.match(/^[A-za-z0-9-'\\/,&\s]+$/))
		return value;
		
	return null;
}

function daffControl_CheckExtractCustom(value, expression)
{
    //case insensitive
    reg = new RegExp(expression);
	if (reg.exec(value))
		return true;
		
	return false;
}

function daffControl_ExtractPassword(value)
{
	//check that it is an password of valid form
	//require 6 to 15 characters, at least one Upercase letter, one lowercase letter and one number
	if(/\d/.test(value) && value.match(/^(?=.*[A-Z]).*$/) && value.match(/^(?=.*[a-z]).*$/) && value.length > 5 && value.length < 16)
	{
		return value;
	}	
	return null;
}



