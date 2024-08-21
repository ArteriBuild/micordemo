{/* Copyright (c) 2016 - 2023 Australian Government **************************
'*  Name:        pl_country_lan.js
'*  Description: Global javascipt snippets.
'*  Email:       wilson.wampers@gmail.com
'*****************************************************************************
'*  Modification History:
'*  -When           -Who            -Bug#           -What
'*  --------------------------------------------------------------------------
'*	-30-Sep-2022    -Wilson Wampers -               -Initial Version
'*****************************************************************************
SEWP:
<style type="text/css">#embeddingText{min-height:100px;min-width: 800px;
    font-family:Consolas;font-size:11px;}</style>
<link rel="stylesheet" href="/_catalogs/masterpage/micor2020/css/lan/pl_country_lan.css" />
<script type="text/javascript" src="/_catalogs/masterpage/micor2020/js/lan/pl_country_lan.js"></script>
// LM ww.230413.1435_T16*/}
// Global variables

plc.verbose     = false;
plc.debug       = true;
plc.countryName = 'not-set';
plc.dataTable   = '/plants/pages/__admin/_plantsfilters.aspx?FilterField1=mcountry&FilterValue1=';
plc.pageUrl     = _spPageContextInfo.serverRequestPath;
plc.data        = new Array();
plc.live        = new Array();

pag.rBlcks      = new Array();

plc._LAN = function(
    pnPageID,
    psPageURL,
    psTitle,
    psCountry,
    psGroup,
    psEndUse
)
{
    this.PGID = pnPageID;
    this.PURL = psPageURL;
    this.TTLE = psTitle;
    this.CNTY = psCountry;
    this.PGRP = psGroup;
    this.ENDU = psEndUse;
}

pag.pgNumber    = 1;
pag.blNumber    = 1;
pag.paging      = 20;
pag.pagingDir   = 'up';// up/down
pag.lastPage    = 0;
pag.blockSize   = 5;

//****************************************************************************
// Desc: Mapping from pagination control to this library
//****************************************************************************
pag.preReRenderHtmlControl = function()
{
    plc.preReRenderHtmlControl();
}

//****************************************************************************
// Desc: Actual page start .replace(/\s/gm,'%20')
//****************************************************************************
plc.init = function()
{
    var sHtml = '';
    console.log('pl_country_lan.js -> loaded.');

    plc.inEditMode = ($('input[name="MSOLayout_InDesignMode"]').val() == '1') ? true : false;
    $(document).ready(
        function()
        {
/*S: Temp fix 403 problem ww230501.1115*/
            // if(!plc.inEditMode && location.href.toLowerCase().indexOf('european_union') != -1)
            // {
            //     console.warn(' --> redirection to org page for the European Union' );
            //     window.location.replace('/plants/pages/european_union_eu/european_union_eu_org.aspx');

            //     return;
            // }
/*E: Temp fix 403 problem  ww230501.1115*/
            if(!plc.inEditMode && location.href.toLowerCase().indexOf('__admin') == -1)
            {
                sHtml+=`<div id="LandingPageControl">
                            <div id="Results">
                                <span id="result"></span>
                                &nbsp;<nobr><span class="srchLoading"><img src="/_layouts/images/gears_anv4.gif" style="width: 18px; height: 18px;"><span class="wonit">... Loading results ...</span></span></nobr>
                                <div class="setPaging">
                                    <span><img class="imgLoading" src="/_layouts/images/gears_anv4.gif" style="display:none;" /></span>
                                    <span title="Set paging to"><div class="sp">10</div></span>
                                    <span title="Set paging to" class="sel"><div class="sp sel">20</div></span>
                                    <span title="Set paging to"><div class="sp">50</div></span>
                                    <span title="Set paging to"><div class="sp">100</div></span>
                                    <span title="Set paging to" style="display: none;"><div class="sp">200</div></span>
                                    <span title="Set paging to" style="display: none;"><div class="sp">500</div></span>
                                </div>
                            </div>
                            <div id="countrySummaries"></div>
                        </div>`;

                $('div.requirement-content').append(sHtml);
                $('span.srchLoading').show();
                plc.buildPlantsDataArray(); 
            }
            else
            {
                if(plc.verbose) console.log('👇️-> Plants \'country landing page\' is in\n[Edit Mode] -> not rendering data details!');
            }
        }
    );
}

//****************************************************************************
// Desc: 
//****************************************************************************
plc.buildPlantsDataArray = function()
{
    var sHtml = '', nRows = -1;

    //alert('In-page countryname reading: \n' + $('#CountryName').text().replace(/\s/gm,'+').replace(/,/g,'%2c'));
    plc.countryName = $('#CountryName').text().replace(/\s/gm,'+').replace(/,/g,'%2c');
    if(plc.debug) 
        console.log('👇️-> Detected Plants Country value:\n['+ plc.countryName+']');

    if(plc.countryName != 'not-set')
    {
        if($('div.dataTable').length != 0) $('div.dataTable').remove();
        $('body').append('<div class="dataTable"></div>');
        plc.dataTable += plc.countryName;
        plc.dataUrl = location.protocol + '//' + location.host + plc.dataTable;
        console.log(' -> data Url: ' + plc.dataUrl);
        $('div.dataTable').load(plc.dataUrl + ' #MSOZoneCell_WebPartWPQ1', function()
        {
            nRows = $('table[summary*="Pages"]').find('tbody').find('tr').length;
            $('table[summary*="pages"]').find('tbody').find('tr').each(
            function()
            {
                var sPageURL, nPageID, sTitle, sCountry, sGroup, sEndUse;

                sPageURL = plc.convertToRelativeUrl($(this).find('td').eq(1).find('a').prop('href'));
                if(sPageURL.toLowerCase().indexOf('test') == -1)
                {
                    nPageID  = $(this).find('td').eq(0).text();
                    sTitle   = $(this).find('td').eq(2).text().trim();
                    sCountry = $(this).find('td').eq(3).text().replace(/�/g,'ô').trim();
                    sCountry = ut.uniClean(sCountry);
                    sGroup   = $(this).find('td').eq(4).text();
                    sEndUse  = $(this).find('td').eq(5).text();
            
                    plc.data[plc.data.length] = new plc._LAN(nPageID, sPageURL, sTitle, sCountry, sGroup, sEndUse);
                }
                else
                {
                    console.warn(' -> invalid URL: ' + sPageURL);
                }
            });
            plc.live = plc.sortArrayOnTitle(plc.data);
            if(plc.verbose) console.log(' -> Array data: \n' + plc.displayArray(plc.live));

            sHtml += plc.renderHtmlControl();
            sHtml += pag.pagingControl();
        
            $('#countrySummaries').html(sHtml);
            $('span.srchLoading').hide();
            pag.initPagingControl();
            $('.PageLinkPrev').click();
        });
    }
    else
    {
        console.log('⛔️ ** plc.init error: -> No Plants \'Country\' configured, please edit the page first!');
    }
}

//****************************************************************************
// Desc: 
//****************************************************************************
plc.renderHtmlControl = function()
{// debugger;
    var ni, sHtml='', nMax, nCnt = (pag.pgNumber-1)*pag.paging, nPagingLoop=0;

    pag.lastPage = pag.calcLastPage(plc.live.length);
    pag.populateBlocks();
    nPagingLoop = ((pag.pgNumber*pag.paging) < plc.live.length)?(pag.pgNumber*pag.paging):plc.live.length;
    if( plc.verbose || global.verbose) 
        console.log(  plc.live.length + ' total items\n'
                    + pag.lastPage + ' pages\n' 
                    + pag.rBlcks.length + ' blocks\n' 
                    + pag.blockSize + ' pages/block\n' 
                    + pag.paging + ' items/page' 
                    + '\npage: ' + pag.pgNumber 
                    + '\nblock: ' + pag.blNumber 
                    + '\npage movement: ' + pag.pagingDir + '.');

    $('span#result').html('(' + plc.live.length + ' cases)');

    if(plc.debug) console.log('nCnt: ' + nCnt +  '\nnPagingLoop: ' + nPagingLoop);

    for(var ni=nCnt; ni<nPagingLoop; ni++)
        sHtml+=`<div class="plantsRow">
                    <span class="column left">
                        <a class="ms-noWrap ms-displayBlock" href="`
                            +plc.live[ni].PURL+`" title="`+plc.live[ni].TTLE+` - `+plc.live[ni].CNTY+ `">`
                            +plc.live[ni].TTLE+` - `+plc.live[ni].CNTY+`
                        </a>
                    </span>
                    <span class="column middle">`+plc.live[ni].PGRP+`&nbsp;</span>
                    <span class="column right">`+plc.live[ni].ENDU+`&nbsp;</span>               
                </div>`;

    setTimeout(function()
    {
        $('.imgLoading').css({'display':'none'});
    }, 500);

    return sHtml;
}

//****************************************************************************
// Desc: 
//****************************************************************************
plc.sortArrayOnTitle = function(poArray)
{
    var rData = new Array(); 
    
    rData = poArray;
    rData = rData.sort(
        function(x,y)
        {// Ascending = true | descending = false
            var bAsc = true;
            var a = x.TTLE.toLowerCase().trim().replace(/[ ]/g,'').replace(/,/g,''),
                b = y.TTLE.toLowerCase().trim().replace(/[ ]/g,'').replace(/,/g,'');
            if (a > b) {return (bAsc)?1:-1;}
            if (a < b) {return (bAsc)?-1:1;}
            return 0;
        }
    );

    return rData;
}

//****************************************************************************
// Desc: Transform a static url to a relative url
//****************************************************************************
plc.convertToRelativeUrl = function(psUrl)
{
    var relUrl = psUrl;

    return relUrl.replace(location.protocol + '//', '')
                 .replace(location.hostname, '');
}

//****************************************************************************
// Desc: Display array data for debug info
//****************************************************************************
plc.displayArray = function(poArray)
{
    var sData = '--------------------------------------------------------------------\n';

    for(var ni=0; ni<poArray.length; ni++)
    {
        sData += 'Element   : ['+ ut.pad((ni+1), 4) +']\n'
               + 'Page id   : ' + poArray[ni].PGID + '\n'
               + 'Page URL  : ' + poArray[ni].PURL + '\n'
               + 'Title     : ' + poArray[ni].TTLE + '\n'
               + 'Country   : ' + poArray[ni].CNTY + '\n'
               + 'Group     : ' + poArray[ni].PGRP + '\n'
               + 'End use   : ' + poArray[ni].ENDU + '\n'
               + '--------------------------------------------------------------------\n';
    }

    return sData;
}

//****************************************************************************
// Desc:
//****************************************************************************
plc.preReRenderHtmlControl = function()
{// Keep the page number within bounds
    pag.pgNumber = ((pag.pgNumber>pag.lastPage)? pag.lastPage : (pag.pgNumber<1)? 1 : pag.pgNumber);
    pag.blNumber = parseInt(((pag.pgNumber-1)/(pag.blockSize)), 10)+1;

    plc.reRenderHtmlControl();
}

//****************************************************************************
// Desc: Rebuild the page Html from (non) filtered data
//****************************************************************************
plc.reRenderHtmlControl = function(poArray)
{
    var sHtml='';

    sHtml += plc.renderHtmlControl();
    if(plc.live.length > pag.paging)
        sHtml += pag.pagingControl();
    else
        sHtml += `<ul id="Paging" class="ms-srch-Paging"><li>&nbsp;</li></ul>`;

    $('div#countrySummaries').html(sHtml);
    pag.initPagingControl();
}

//****************************************************************************
// Desc: Wait for the SharePoint client context to become available, then
//       launch the call back function
//****************************************************************************
if(location.href.toLowerCase().indexOf('lacountrylanding') == -1)
{
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', plc.init);
}
//****************************************************************************