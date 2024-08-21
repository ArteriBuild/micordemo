{/* Copyright (c) 2021 AWE ****************************************************
'*  Name:        organics.js 
'*  Description: Global javascipt snippets.
'*  Email:       wilson.wampers@gmail.com
'*****************************************************************************
'*  Modification History:
'*  -When           -Who            -Bug#           -What
'*  --------------------------------------------------------------------------
'*	-27-Apr-2021    -Wilson Wampers -               -Initial Version
'*****************************************************************************
'* LM: ww211124.1001_D */}

//****************************************************************************
$(document).ready(function()
{
    console.log('organics.js -> loaded.');
    if(window.location.href.toLowerCase().indexOf('organics') > -1)
    {
        $('ul#tools').css({'min-height':'42px'});
        $('a#ctl00_PlaceHolderMain_rssLink').hide();
    }
});
    
//****************************************************************************