{/* Copyright (c) 2022 Australian Government *********************************
'*  Name:        laeman.js
'*  Description: Global javascipt snippets.
'*  Email:       wilson.wampers@gmail.com
'*****************************************************************************
'*  Modification History:
'*  -When           -Who            -Bug#           -What
'*  --------------------------------------------------------------------------
'*  -28-Mar-2022    -Wilson Wampers -               -Initial Version
'*****************************************************************************
SEWP: snippet, goes into the script editor web part
<style type="text/css">
#embeddingText{ min-height:200px;min-width: 800px;font-family:Consolas;font-size:11px; }
div#CSRListViewControlDivWPQ2 span { display: none; }
</style>
<script type="text/javascript">
var styleSheet = 'css/laeman.css';
global.loadCss(global.micor2020Path + styleSheet);
</script>
<script type="text/javascript" src="/_catalogs/masterpage/micor2020/js/laeman.js"></script>
'* LM: ww220407.1443 */}
var lm = lm || {};

lm.verbose = false;

lm.npr = 0;
lm.gState = new Array();

// Constructor
lm._S = function(
    psId, 
    psTitle,
    psComment
)
{
    this.INDX = psId;
    this.TTLE = psTitle;
    this.CMMT = psComment;
}
lm.arSps = new Array();

//****************************************************************************
// Desc:
//****************************************************************************
/*
$(document).ready(function()
{
    lm.cID = $('td.ms-gb').length;
    if(lm.verbose) console.log('lm counted ' + lm.cID + ' groups');
    $(window).on('resize', function(e)
    { 
        lm.setLeaMAnsWidth(); 
    });
});
*/
//****************************************************************************
// Desc:
//****************************************************************************
lm.getSuperseded = function()
{ 
    var itemCount = 0;

    if(lm.verbose) console.log('--> xXx Loading superseded items xXx <--');
    $('footer').prepend('<div id="laContent" class="laHidden"></div>');
    $('#laContent').load( '/live-animals/Pages/isSuperseded.aspx #script > table > tbody',
    function()
    {
        itemCount = $('#laContent').find('tr').length;
        console.log(' ** --> Superseded items found: ' + itemCount);
        if(itemCount > 0)
        {
            $('#laContent tr').each(
            function()
            {     
                var sId, sTitle, sComment;

                sId      = $(this).find('td').eq(0).text();
                sTitle   = $(this).find('td').eq(1).text();
                sComment = $(this).find('td').eq(2).text();
                sComment = sComment.replace(/[\u200B-\u200D\uFEFF]/g, '');
                sComment = sComment.replace(/&ZeroWidthSpace;/g, '');
                sComment = sComment.replace(/<[^>]+>/g, '');

                //lm.arSps[lm.arSps.length] = new lm._S( sId, sTitle, sComment, false);
                lm.arSps[lm.arSps.length] = new lm._S( sId, sTitle, sComment);
            });
        }
        $('#laContent').remove();
        setTimeout(lm.checkForSupersededContent, 250);
    });
}

//****************************************************************************
// Desc:
//****************************************************************************
lm.checkForSupersededContent = function()
{
    console.log(' running lm.checkForSupersededContent ... ' + lm.arSps.length);
    var trID, sTit; 

    for(var ni=0;ni<lm.arSps.length;ni++)
    {
        trID = lm.curLF + ',' + lm.arSps[ni].INDX + ',0';
        if( $('tr[iid="'+trID+'"]').length > 0 
        && !$('tr[iid="'+trID+'"]').hasClass('not-allowed'))
        {
            sTit = '<span>'+lm.arSps[ni].TTLE+'</span>';
            $('tr[iid="'+trID+'"]').addClass('not-allowed').attr('title', lm.arSps[ni].CMMT);
            $('tr[iid="'+trID+'"]').find('td').eq(2).html(sTit);
            if(lm.verbose) console.log('==> set: tr [iid="' +trID+ '"] td[2] to '+sTit);
        }
    }
}

//****************************************************************************
// Desc: Called by laemanJSLink
//****************************************************************************
lm.init = function()
{
    /*
    if(lm.verbose) console.log(++lm.npr+' ** --> lm.init is called \n');

    var sColExp = '', nCnt = 0, sID, sgState = '';

    sID  = $('input[id*="GroupByWebPart"]').prop('id');
    lm.curLF = sID.replace(/GroupByWebPartID/g,'');
    $('td.ms-gb').each(function()
    {
        lm.gState[nCnt] = 
            ($(this).closest('tbody').next().attr('isloaded') == 'true')?true:false;
        nCnt++;
    });
    
    $('div#inplaceSearchDiv_WPQ2_lsstatus').parent().css(
        {'border': '1px solid transparent'}
    );

    for( ni=0; ni < lm.gState.length; ni++)
    {
        sgState += lm.gState[ni] + ' ' + ni +'\n';
    }
    if(lm.verbose) console.log(sgState);
    lm.setExpCol(lm.npr);
    lm.setChevrons();
    */
}

//****************************************************************************
// Desc:
//****************************************************************************
lm.setExpCol = function()
{
    if(lm.verbose) console.log(' postRender: ' + lm.npr);
    var nCnt = 1, divId, divCv, sHtml = '', sOnClick = '';

    $('td.ms-gb').each(function()
    {
        divId = 'div'+lm.curLF+'-'+nCnt;
        divCv = 'cvn'+lm.curLF+'-'+nCnt; 
        if($('div#' + divId).length == 0)
        {  
            lm.arTxt = $(this).text().trim().split('(');
            lm.frstPart = lm.arTxt[0].replace(/Year :/g,'').trim();
            lm.cntrPart = '(' + lm.arTxt[1];

            $(this).find('a').hide();
            $(this).find('span').hide();

            sOnClick = "javascript:ExpCollGroup('"+lm.curLF+"-"+nCnt+"_', "
                     + "'img_"+lm.curLF+"-"+nCnt+"_',event, false);lm.toggleChevrons(this);return false;";

            sHtml ='<div class="laeMAn" id="'+divId+'" onclick="'+sOnClick+'" '
                  +'title="expand/collapse section">'
                  +'<div class="leftContent">'+lm.frstPart+'<span class="ncount"> '+lm.cntrPart+'</span></div>'
                  +'<div id="'+divCv+'" class="cvnCo"></div>'
                  +'</div>';
                  
            $(this).prepend(sHtml);
            lm.setLeaMAnsWidth();
            if(lm.verbose) console.log(' - Added: ' + divId + ' ' + lm.frstPart + lm.cntrPart);
            nCnt++;
        }
    });
}

//****************************************************************************
// Desc:
//****************************************************************************
lm.setChevrons = function()
{
    if(lm.verbose) console.log('lm.setChevrons ** -> adjusting ' + $('div[id*="cvn"]').length + ' chevrons');

    if($('div[id*="cvn"]').eq(0).length > 0)
    { 
        var pId, sId, arI, tbI;

        pId  = $('div[id*="cvn"]').eq(0).prop('id');
        sId  = pId.replace(/cvn/g,'');
        arI  = sId.split('-');
        tbI  = 'tbod' + arI[0] + '-';

        for( var ni=0; ni<lm.gState.length; ni++ )
        {
            if(lm.gState[ni] == true)
            {
                if($('#' + tbI + (ni+1) + '__').css('display') == 'none')
                {
                    $('td.ms-gb').eq(ni).removeClass().addClass('ms-gb');
                    $('div[id*="cvn"]').eq(ni).removeClass().addClass('cvnCo');
                    if(lm.verbose) console.log('lm.setChevrons: ' + $('div[id*="cvn"]').eq(ni).prop('id') + ' set to collapsed');
                }
                else
                {
                    $('td.ms-gb').eq(ni).addClass('expanded');
                    $('div[id*="cvn"]').eq(ni).removeClass().addClass('cvnEx');
                    if(lm.verbose) console.log('lm.setChevrons: ' + $('div[id*="cvn"]').eq(ni).prop('id') + ' set to expanded');
                }
            }
            else
            {
                $('td.ms-gb').eq(ni).removeClass().addClass('ms-gb');
                $('div[id*="cvn"]').eq(ni).removeClass().addClass('cvnCo');
                if(lm.verbose) console.log('lm.setChevrons: ' + $('div[id*="cvn"]').eq(ni).prop('id') + ' set to collapsed');
            }
        }
    }
    setTimeout(lm.checkForSupersededContent, 250);
    window.dispatchEvent(new Event('resize'));
}

//****************************************************************************
// Desc: tbod12-4__
//****************************************************************************
lm.toggleChevrons = function(poObj)
{
    if(lm.verbose) console.log('\nToggle event detect: \n' );

    var pId, sId, arI, tbI;

    pId  = $(poObj).prop('id');
    sId  = pId.replace(/div/g,'');
    arI  = sId.split('-');
    tbI  = 'tbod' + arI[0] + '-';
    div  = tbI.replace(/tbod/g,'cvn'); 

    for(var ni=0; ni<lm.gState.length; ni++)
    {
        if( lm.gState[ni] == true )
        {
            if(lm.verbose) console.log(' ** display style of tbody ' 
                                     + tbI + (ni+1) + '__' + ': ' + $('#' + tbI + (ni+1) + '__').css('display'));
            if($('#' + tbI + (ni+1) + '__').css('display') == 'none')
            {
                $('td.ms-gb').eq(ni).removeClass().addClass('ms-gb');
                $('div#'+div+(ni+1)).removeClass().addClass('cvnCo');
                if(lm.verbose) console.log('lm.toggleChevrons: set '+div+(ni+1)+' to collapsed');
            }
            else
            {
                $('td.ms-gb').eq(ni).addClass('expanded');
                $('div#'+div+(ni+1)).removeClass().addClass('cvnEx');
                if(lm.verbose) console.log('lm.toggleChevrons: set '+div+(ni+1)+' to expanded');
            }
        }
        else
        {
            $('td.ms-gb').eq(ni).removeClass().addClass('ms-gb');
            $('div#'+div).removeClass().addClass('cvnCo');
        }
    }
}

//****************************************************************************
// Desc: 
//****************************************************************************
lm.setLeaMAnsWidth = function()
{
    $('div.laeMAn').css({'width': ($('td.ms-gb').eq(0).width())+'px'});
    if(lm.verbose) console.log('changing with:' + $('td.ms-gb').eq(0).width());
}

//****************************************************************************
// Desc: 
//****************************************************************************
lm._Start = (function()
{
    console.clear();
    console.log('laeman.js -> loaded.');
    ut.removeHash(); // may cause a type-error otherwise

    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', lm.getSuperseded);
})();

//****************************************************************************