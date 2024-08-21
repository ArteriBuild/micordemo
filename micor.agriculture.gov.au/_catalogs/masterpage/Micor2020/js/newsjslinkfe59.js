{/* Copyright (c) 2021 AWE ***************************************************
'*  Name:        newsJSLink.js
'*  Description: Global javascipt snippets.
'*  Email:       wilson.wampers@gmail.com
'*****************************************************************************
'*  Modification History:
'*  -When           -Who            -Bug#           -What
'*  --------------------------------------------------------------------------
'*  -02-Aug-2021    -Wilson Wampers -               -Initial Version
'*****************************************************************************
'* LM: ww210923.0940 */}
console.log(' @-> news: JSLink template -> loaded.');

//***************************************************************************
// Desc: Item rendering template detail
//***************************************************************************
function rowFormatTemplate(ctx) 
{  
    var sHtml = '', oHref = null, sHref = '#', altMsg = 'Click to follow this link';

    sHref = ctx.CurrentItem.relart;

    sHtml += '\n<div class="newsArtRow" id="art_'+ctx.CurrentItem.ID+'">';
    sHtml += '\n    <div class="newsArtTitle">';
    if(sHref != '')
    {
        sHtml += '\n        <a class="aLink" title="'+ altMsg +'" href="'+ sHref +'">'+ ctx.CurrentItem.Title +'</a>';
    }
    else
    {
        sHtml += '\n        <span>'+ ctx.CurrentItem.Title +'</span>';
    }
    sHtml += '\n    </div>';
    sHtml += '\n    <div class="newsArtDate">'+ ctx.CurrentItem.PublishingStartDate.split(' ')[0] +'</div>';
    sHtml += '\n    <div class="newsArticle">'+ ctx.CurrentItem.commsmsg +'</div>';
    sHtml += '\n</div>';
 
    return sHtml;
}

//***************************************************************************
// Desc: Singlet definition of the item rendering template
//***************************************************************************
(function() 
{  
    var itemContext = {};  

    itemContext.Templates = {}; 
    itemContext.Templates.Item = rowFormatTemplate;
    BaseViewID = 1;  
    ListTemplateType = 100;  
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(itemContext); 

})();

//***************************************************************************