{/* Copyright (c) 2022 Australian Government *********************************
'*  Name:        comlan_login.js
'*  Description: Global javascipt snippets.
'*  Email:       wilson.wampers@gmail.com
'*****************************************************************************
'*  Modification History:
'*  -When           -Who            -Bug#           -What
'*  --------------------------------------------------------------------------
'*	-26-Aug-2022    -Wilson Wampers -               -Initial Version
'****************************************************************************/
/*  LM ww.220925.2204_P */} 
/* SEWP:
<style type="text/css">#embeddingText{min-height:100px;min-width: 800px;
    font-family:Consolas;font-size:11px;}</style>
<link rel="stylesheet" href="/_catalogs/masterpage/micor2020/css/lan/comlan_login.css" />
<script type="text/javascript" src="/_catalogs/masterpage/micor2020/js/lan/comlan_login.js"></script>
*/
(function ()
{
    console.log(' /*|*\\  default');
    var loginPage = '/Meat/Pages/meat.aspx';
    $(document).ready(
    function()
    {
        setTimeout( 
            function()
            {
                if($('#login').css('display') != 'none')
                {
                    console.log('⛔️ ==> must login! \n @: ' + '\ndisplay: ' + $('#login').css('display'));
                    $('#ctl00_PlaceHolderMain_latestUpdatesLink').css({'display':'none'}); 
                }
                else
                {
                     window.location = loginPage; 
                }
            }, 10
        );
    });
})();