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
'* LM: ww220406.0759 */}
var oCtx;
//****************************************************************************
// Desc: 
//****************************************************************************
function postRender()
{
    lm.init();
}

//****************************************************************************
// Desc: CSR script run starts here
//****************************************************************************
(function()
{
    oCtx = {};

    oCtx.Templates        = {};
    oCtx.OnPostRender     = postRender;
    oCtx.BaseViewID       = 1;
    oCtx.ListTemplateType = 100;
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(oCtx);
})();

//****************************************************************************