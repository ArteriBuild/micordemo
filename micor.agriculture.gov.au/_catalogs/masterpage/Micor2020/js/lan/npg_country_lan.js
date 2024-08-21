{/* Copyright (c) 2016 - 2024 Australian Government **************************
'*  Name:        npg_country_lan.js
'*  Description: Global javascript snippets.
'*  Email:       wilson.wampers@gmail.com
'*****************************************************************************
'*  Modification History:
'*  -When           -Who            -Bug#           -What
'*  --------------------------------------------------------------------------
'*	-31-Aug-2022    -Wilson Wampers -               -Initial Version
'*****************************************************************************
PRE_Sections:
​​​​Unless specified within the commodity list below or on the corresponding Meat, Fish, Dairy or Eggs Micor page, 
the Department is unaware of any specific requirement for inedible non-prescribed goods that are for export to [Country name].
LM: ww.240621.1226_P16 - fully commented - */} 
// Global variables

npc.debug       = false;
npc.debugCntr   = 0;
npc.listTitle   = 'Pages';
npc.countryName = 'not-set';
npc.dataTable   = '/npg/pages/__admin/_npgcntyfilter.aspx?FilterField1=mcountry&FilterValue1=';
npc.pageUrl     = _spPageContextInfo.serverRequestPath;
npc.data        = [];
npc.live        = [];
npc.products    = 
[
    {'PRDT':'Edible apiculture products'         ,'BHIT':false},
    {'PRDT':'Inedible apiculture products'       ,'BHIT':false},
    {'PRDT':'Cosmetics'                          ,'BHIT':false},
    {'PRDT':'Edible processed goods'             ,'BHIT':false},
    {'PRDT':'Other inedible Non-prescribed goods','BHIT':false},
    {'PRDT':'Other edible Non-prescribed goods'  ,'BHIT':false}
];
npc._NPG = function(
    pnPageID,
    psPageURL,
    psTitle,
    psCountry,
    psProduct,
    pnWeight
)
{
    this.PGID = pnPageID;
    this.PURL = psPageURL;
    this.TTLE = psTitle;
    this.CNTY = psCountry;
    this.PRDT = psProduct;
    this.WGHT = pnWeight;
}

//****************************************************************************
// Desc: Debugging info
//****************************************************************************
npc.getCounter = function()
{
    return ('⚫️npc['+(ut.pad((npc.debugCntr++),4))+']=- ');
}

//****************************************************************************
// Desc: Actual page start
//****************************************************************************
npc.init = function()
{
    console.log('npg_country_lan.js -> loaded.');
    if(npc.debug) console.log(npc.getCounter() + 'npc.init');

    $(document).ready(
        function()
        {
            if(!sw.inEditMode)
            {
                if(npc.debug) console.log('👇️-> Detected NPG Country value:\n[' + $('#NPGCountry').text()+']');

                npc.countryName = $('#NPGCountry').text().replace(/[ ]/g,'+');
                if(npc.countryName != 'not-set')
                {
                    if($('div.dataTable').length != 0) $('div.dataTable').remove();
                    $('body').append('<div class="dataTable"></div>');
                    npc.dataTable += npc.countryName;
                    npc.dataUrl = location.protocol + '//' + location.host + npc.dataTable;
                    if(npc.debug) console.log(' -> data Url: ' + npc.dataUrl);

                    $('div.dataTable').load(npc.dataUrl + ' #MSOZoneCell_WebPartWPQ1', function()
                    {
                        npc.collectNPGCntypages();
                    });
                    var sCurrentCountry = $('#NPGCountry').text();
                    var replacementText = $('div[id*="_PRE_Sections__"]').text().replace('[Country name]', sCurrentCountry);
                    $('div[id*="_PRE_Sections_"]').text(replacementText);
                }
                else
                {
                    console.log('⛔️ ** npc.init error: -> No NPG \'Country\' configured, please edit the page first!');
                }
            }
            else
            {
                sw.enableCCL();
                if(npc.debug) console.log('👉-> NPG \'country landing page\' is in\n[Edit Mode] -> not rendering data details!');
                if(window.location.href.toLowerCase().indexOf('npg-new-country-landing-page.') == -1)
                {
                    $('div.PRE_Sections').css({'display':'block'});
                }
            }
        }
    );
}

//****************************************************************************
// Desc: Collect NPG country pages
//****************************************************************************
npc.collectNPGCntypages = function()
{
    if(npc.debug) console.log(npc.getCounter() + 'npc.collectNPGCntypages');

    var nRows = -1;

    nRows = $('table[summary*="Pages"]').find('tbody').find('tr').length;
    $('table[summary*="pages"]').find('tbody').find('tr').each(
    function()
    {
        var nPageID, sPageURL, sTitle, sCountry, sProduct;

        sPageURL = npc.convertToRelativeUrl($(this).find('td').eq(1).find('a').prop('href'));
        if(sPageURL.toLowerCase().indexOf('_org') == -1)
        {
            nPageID  = $(this).find('td').eq(0).text();
            sTitle   = $(this).find('td').eq(2).text();
            sCountry = $(this).find('td').eq(3).text();
            sProduct = $(this).find('td').eq(4).text();

            npc.data.push( new npc._NPG(nPageID, sPageURL, sTitle, sCountry, sProduct, 0));
        }
    });
    console.log(' -> npc.data length: ' + npc.data.length);

    npc.live = npc.sortArrayOnProductnWeight(npc.data);
    if(npc.debug) console.log(' -> Array data: \n' + npc.displayArray(npc.live));

    npc.renderHtmlControl();
}

//****************************************************************************
// Desc: renderHtmlControl
//****************************************************************************
npc.renderHtmlControl = function()
{
    if(npc.debug) console.log(npc.getCounter() + 'npc.renderHtmlControl');

    if(npc.debug) console.log('Rendering data length: ' + npc.live.length);

    var sHtml = '', sPreviousProduct = '';

    for( var ni=0; ni<npc.live.length; ni++)
    {
        if(npc.live[ni].PRDT != '')
            if(npc.live[ni].PRDT != sPreviousProduct)
            {
                if(ni>0) 
                {
                    sHtml += '</ul>';   
                }

                sPreviousProduct = npc.live[ni].PRDT;
                sHtml += '<h2 class="ms-webpart-titleText">'+npc.live[ni].PRDT+'</h2>';
                sHtml += '<ul class="twoColumnsList">'; 
                if(npc.live[ni].WGHT>0)
                {
                    sHtml += '<li><a class="ms-noWrap ms-displayBlock" href="'+npc.live[ni].PURL+'" title="'+npc.live[ni].TTLE+'">'+npc.live[ni].TTLE+'</a></li>';
                }
                else
                {
                    sHtml += '<li>There are no products to show.</li>';
                }  
            }
            else
            {
                if(npc.live[ni].WGHT>0)
                {
                    sHtml += '<li><a class="ms-noWrap ms-displayBlock" href="'+npc.live[ni].PURL+'" title="'+npc.live[ni].TTLE+'">'+npc.live[ni].TTLE+'</a></li>';
                }
                else
                {
                    sHtml += '<li>There are no products to show.</li>';
                } 
            }
    }
    sHtml += '</ul>';
    sHtml += '<br/>';

    $('div.productSummaries').html(sHtml);
}

//****************************************************************************
// Desc: Sort array on Product and Weight (Ranking)
//****************************************************************************
npc.sortArrayOnProductnWeight = function(poArray)
{
    if(npc.debug) console.log(npc.getCounter() + 'npc.sortArrayOnProduct');

    var rRay = [], rData = [], bHit = false, nWeight = 0;

    rRay = poArray.sort(
        function(x,y)
        {// Ascending = true | descending = false
            var bAsc = true;
            var a = x.PRDT,
                b = y.PRDT;
            if (a > b) {return (bAsc)?1:-1;}
            if (a < b) {return (bAsc)?-1:1;}
            return 0;
        });
    
        for(var ni=0; ni<npc.products.length; ni++)
        { 
            for(var nj=0; nj<rRay.length; nj++)
            {
                if(rRay[nj].PRDT == npc.products[ni].PRDT)
                {
                    nWeight++;
                    npc.products[ni].BHIT = true;
                }
            }
            for(var nj=0; nj<rRay.length; nj++)
            {
                if(rRay[nj].PRDT == npc.products[ni].PRDT)
                {
                    rRay[nj].WGHT = nWeight;
                }
            }
            nWeight = 0;
        }
        // Fill up with no matches (empty product)
        for( var ni=0; ni<npc.products.length; ni++)
        {
            if(!npc.products[ni].BHIT)
            {
                rRay.push( new npc._NPG('-', '-', '-'+ni+'-', '-', npc.products[ni].PRDT, 0));
            }
        }

    rData = rRay.sort(
        function(x,y) 
        {// Ascending = true | descending = false
            var b_ab_Asc = false, b_cd_Asc = true;
            var a = x.WGHT,
                b = y.WGHT,
                c = x.PRDT.toLowerCase().replace(/[ ]/gm,''),
                d = y.PRDT.toLowerCase().replace(/[ ]/gm,'');
            if (a > b) {return (b_ab_Asc)? 1:-1;}
            if (a < b) {return (b_ab_Asc)?-1: 1;}
            if (c > d) {return (b_cd_Asc)? 1:-1;}
            if (c < d) {return (b_cd_Asc)?-1: 1;}
            return 0;
        });
    
    return rData;
}

//****************************************************************************
// Desc: Transform a static url to a relative url
//****************************************************************************
npc.convertToRelativeUrl = function(psUrl)
{
    var relUrl = psUrl;

    return relUrl.replace(location.protocol + '//', '')
                 .replace(location.hostname, '');
}

//****************************************************************************
// Desc: Display array data for debug info
//****************************************************************************
npc.displayArray = function(poArray)
{
    var sData = '--------------------------------------------------------------------\n';

    for(var ni=0; ni<poArray.length; ni++)
    {
        sData += 'Element  : ['+ ut.pad((ni+1), 4) +']\n'
               + 'Page id  : ' + poArray[ni].PGID + '\n'
               + 'Page URL : ' + poArray[ni].PURL + '\n'
               + 'Title    : ' + poArray[ni].TTLE + '\n'
               + 'Country  : ' + poArray[ni].CNTY + '\n'
               + 'Product  : ' + poArray[ni].PRDT + '\n'
               + 'Weight   : ' + poArray[ni].WGHT + '\n' 
               + '--------------------------------------------------------------------\n';
    }

    return sData;
}

//****************************************************************************
// Desc: Mapper for ccl.\ to coml.\ call
//****************************************************************************
npc._Start = (function()
{
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', npc.init);
})();

//****************************************************************************