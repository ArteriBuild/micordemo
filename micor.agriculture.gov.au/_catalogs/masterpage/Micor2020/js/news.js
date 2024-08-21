{/* Copyright (c) 2021 AWE ***************************************************
'*  Name:        news.js (archive)
'*  Description: Global javascipt snippets.
'*  Email:       wilson.wampers@gmail.com
'*****************************************************************************
'*  Modification History:
'*  -When           -Who            -Bug#           -What
'*  --------------------------------------------------------------------------
'*  -02-Aug-2021    -Wilson Wampers -               -Initial Version
'*****************************************************************************
'* LM: ww210923.09*39 */}

//***************************************************************************
$(document).ready(function()
{
    console.log('news javascript -> loaded.');
    if(window.location.href.toLowerCase().indexOf('news') > -1)
    {
        $('ul#tools').find('li').eq(0).html(' ').css({'max-width':'1px'});
        $('ul#tools').css({'min-height':'42px'});
        $('a#ctl00_PlaceHolderMain_rssLink').hide();
        $('a#ctl00_PlaceHolderMain_latestUpdatesLink').hide();
    }
});

//***************************************************************************