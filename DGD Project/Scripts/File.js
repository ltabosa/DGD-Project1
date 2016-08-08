﻿$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', retrieveProject);
    SP.SOD.executeOrDelayUntilScriptLoaded(ModifyRibbon, 'sp.ribbon.js');
});
//nouvelle function
function retrieveProject() {
    var context = new SP.ClientContext.get_current();
    var oList = context.get_web().get_lists().getByTitle('File');
    var camlQuery = new SP.CamlQuery();
    projectID = GetUrlKeyValue('ID', false);
    projectTitle = GetUrlKeyValue('Title', false);
    camlQuery.set_viewXml(
        '<View>' +
         '<Query>' +
            '<Where>' +
                '<Eq>' +
                    '<FieldRef Name=\'Project1\'/>' +
                    '<Value Type=\'Lookup\'>' + projectID + '</Value>' +
                '</Eq>' +
             '</Where>' +
             '<OrderBy>' +
                '<FieldRef Name=\'_DCDateCreated\' ' + 'Ascending=\'FALSE\' />' +
             '</OrderBy>' +
         '</Query>' +
            '<ViewFields>' +
                '<FieldRef Name=\'Id\' />' +
                '<FieldRef Name=\'InternalReference\' />' +
                '<FieldRef Name=\'DocumentType\' />' +
                '<FieldRef Name=\'CategoryDescription\' />' +
                '<FieldRef Name=\'_DCDateCreated\' />' +
                '<FieldRef Name=\'DiffusionDate\' />' +
                '<FieldRef Name=\'ExternalReference\' />' +
                '<FieldRef Name=\'Location\' />' +
                '<FieldRef Name=\'Form\' />' +
                '<FieldRef Name=\'_Status\' />' +
            '</ViewFields>' +
        '</View>');
    window.collListItem = oList.getItems(camlQuery);
    context.load(collListItem, 'Include(Id, InternalReference,DocumentType,CategoryDescription,_DCDateCreated,DiffusionDate,ExternalReference,Location,Form,_Status)');
    context.executeQueryAsync(Function.createDelegate(this, window.onQuerySucceeded),
    Function.createDelegate(this, window.onQueryFailed));
}
function onQuerySucceeded(sender, args) {
    var listEnumerator = collListItem.getEnumerator();
    var listInfo = "<h1>" + projectTitle + "</h1>" +
    "<table class='table table-striped'>" +
        "<tr>" +
            "<th>Edit</th>" +
            "<th>Copy</th>" +
            "<th>Internal Reference</th>" +
            "<th class='dropdown'><a href='' class='dropdown-toggle' data-toggle='dropdown'>Document Type<span class='caret'></span></a></th>" +
            "<th>Description</th>" +
            "<th>Date Created</th>" +
            "<th>Diffusion Date</th>" +
            "<th>External Reference</th>" +
            "<th>Localization</th>" +
            "<th>Format</th>" +
            "<th>Status</th>" +
        "</tr>";
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        var dateCreated = oListItem.get_item('_DCDateCreated').getFullYear() + "/" + padToTwo(((oListItem.get_item('_DCDateCreated').getMonth()) + 1)) + "/" + padToTwo(oListItem.get_item('_DCDateCreated').getDate());
        //var diffusionDate = oListItem.get_item('DiffusionDate');
        if (!((oListItem.get_item('DiffusionDate') == null) || (oListItem.get_item('DiffusionDate') == undefined) || (oListItem.get_item('DiffusionDate') == ""))) {
            var diffusionDate = oListItem.get_item('DiffusionDate').getFullYear() + "/" + padToTwo(((oListItem.get_item('DiffusionDate').getMonth()) + 1)) + "/" + padToTwo((oListItem.get_item('DiffusionDate').getDate()));
        }
        if (oListItem.get_item('_Status') == "Deleted") {
            listInfo += '<tr class="bold" role="alert">';
        } else listInfo += "<tr>";
        listInfo +=
            "<td><a href='#' onclick='ShowDialog(" + oListItem.get_id() + ")'><img src='../Images/EditIcon.png' /></a></td>" +
            "<td><a href='#' onclick='ShowDialogCopy(" + oListItem.get_id() + ")'><img src='../Images/CopyIcon.png' /></a></td>" +
            "<td>" + oListItem.get_item('InternalReference') + "</td>" +
            "<td>" + oListItem.get_item('DocumentType') + "</td>" +
            "<td>" + oListItem.get_item('CategoryDescription') + "</td>" +
            "<td>" + dateCreated + "</td>" +
            "<td>" + diffusionDate + "</td>" +
            "<td>" + oListItem.get_item('ExternalReference') + "</td>" +
            "<td>" + oListItem.get_item('Location') + "</td>" +
            "<td>" + oListItem.get_item('Form') + "</td>" +
            "<td>" + oListItem.get_item('_Status') + "</td>";
        if (oListItem.get_item('_Status') == "Deleted") {
            listInfo += '</tr>';
        }
    }
    listInfo += "</table>";
    $("#results").html(listInfo);
}
function onQueryFailed(sender, args) {
    SP.UI.Notify.addNotification('Request failed. ' + args.get_message() + '\n' +
    args.get_stackTrace(), true);
}
//end function
//new window for edit file
function ShowDialog(ID) {
    var options = {
        url: "../Pages/EditFile.aspx?ID=" + ID,
        //url: "../Lists/File/EditForm.aspx?ID=" + ID,
        width: 600,
        height: 600,
        allowMaximize: true,
        title: "Edit File",
        dialogReturnValueCallback: scallback
    };
    SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', options);
    return false;
}
function scallback(dialogResult, returnValue) {
    if (dialogResult == SP.UI.DialogResult.OK) {
        SP.UI.ModalDialog.RefreshPage(SP.UI.DialogResult.OK);
    }
}

//new window for copy file and create new with diferent version or revision
function ShowDialogCopy(ID) {
        var options = {
            url: "../Pages/CopyFile.aspx?ID=" + ID,
            width: 600,
            height: 600,
            allowMaximize: true,
            title: "Copy File",
            dialogReturnValueCallback: scallback
        };
        SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', options);
        return false;
    }

// Methods for the ribbon
function ModifyRibbon() {
    var pm = SP.Ribbon.PageManager.get_instance();
    pm.add_ribbonInited(function () {
        AddDGDTab();
    });
    var ribbon = null;
    try {
        ribbon = pm.get_ribbon();
    }
    catch (e) { }
    if (!ribbon) {
        if (typeof (_ribbonStartInit) == "function")
            _ribbonStartInit(_ribbon.initialTabId, false, null);
    }
    else {
        AddDGDTab();
    }
}
function AddDGDTab() {
    var sTitleHtml = "";
    var sManageHtml = "";
    sTitleHtml += "<a href='../Pages/Default.aspx' >' ";
    sTitleHtml += "<img src='../images/ViewIcon.png' /></a><br/>My Projects";
    sManageHtml += "<a href='../Pages/NewFile.aspx?ID=" + projectID + "&Title="+projectTitle+"' >";
    sManageHtml += "<img src='../images/CreateIcon.png' /></a><br/>New File";
    var ribbon = SP.Ribbon.PageManager.get_instance().get_ribbon();
    if (ribbon !== null) {
        var tab = new CUI.Tab(ribbon, 'DGD.Tab', 'DGD',
        'Use this tab to view and modify the DGD list',
        'DGD.Tab.Command', false, '', null);
        ribbon.addChildAtIndex(tab, 1);
        var group = new CUI.Group(ribbon, 'DGD.Tab.Group', 'Views',
        'Use this group to view a list of titles',
        'DGD.Group.Command', null);
        tab.addChild(group);
        var group = new CUI.Group(ribbon, 'DGD.Tab.Group', 'Actions',
        'Use this group to add/update/delete DGD',
        'DGD.Group.Command', null);
        tab.addChild(group);
    }
    SelectRibbonTab('DGD.Tab', true);
    $("span:contains('Views')").prev("span").html(sTitleHtml);
    $("span:contains('Actions')").prev("span").html(sManageHtml);
    SelectRibbonTab('Ribbon.Read', true);
}

function padToFour(number) {
    if (number <= 9999) { number = ("000" + number).slice(-4); }
    return number;
}
function padToTwo(number) {
    if (number <= 99) { number = ("0" + number).slice(-2); }
    return number;
}