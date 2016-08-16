/**
* When this page charges take the correct action to display the right rows.
*/
$(document).ready(function () {
    projectID = GetUrlKeyValue('ID', false);
    projectTitle = GetUrlKeyValue('Title', false);
    DocType = GetUrlKeyValue('DT', false);
    DateCre = (GetUrlKeyValue('DC', false));
    DateCre = DateCre.replace("%", " ");
    DateCreat = String.format("{0:s}", new Date(DateCre));
    Form = GetUrlKeyValue('FO', false);
    if (DocType == null || DocType == undefined || DocType == "") {
        if (DateCre == null || DateCre == undefined || DateCre == "") {
            if (Form == null || Form == undefined || Form == "") {
                SP.SOD.executeFunc('sp.js', 'SP.ClientContext', retrieveProject);
            } else SP.SOD.executeFunc('sp.js', 'SP.ClientContext', retrieveProjectFormat);
        } else SP.SOD.executeFunc('sp.js', 'SP.ClientContext', retrieveProjectDateCreated);
    } else SP.SOD.executeFunc('sp.js', 'SP.ClientContext', retrieveProjectFilterDocType);
    SP.SOD.executeOrDelayUntilScriptLoaded(ModifyRibbon, 'sp.ribbon.js');
});
/**
 * Retrieves the project files.
 */
function retrieveProject() {
    var context = new SP.ClientContext.get_current();
    var oList = context.get_web().get_lists().getByTitle('File');
    var camlQuery = new SP.CamlQuery();
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
                '<FieldRef Name=\'_DCDateCreated\' ' + 'Ascending=\'TRUE\' />' +
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
                '<FieldRef Name=\'Copy\' />' +
            '</ViewFields>' +
        '</View>');
    window.collListItem = oList.getItems(camlQuery);
    context.load(collListItem, 'Include(Id, InternalReference,DocumentType,CategoryDescription,_DCDateCreated,DiffusionDate,ExternalReference,Location,Form,_Status,Copy)');
    context.executeQueryAsync(Function.createDelegate(this, window.onQuerySucceeded),
    Function.createDelegate(this, window.onQueryFailed));
}
/**
 * Retrieves a filter of the document type of the project.
 */
function retrieveProjectFilterDocType() {
    var context = new SP.ClientContext.get_current();
    var oList = context.get_web().get_lists().getByTitle('File');
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(
        '<View>' +
         '<Query>' +
            '<Where>' +
                '<And>' +
                '<Eq>' +
                    '<FieldRef Name=\'Project1\'/>' +
                    '<Value Type=\'Lookup\'>' + projectID + '</Value>' +
                '</Eq>' +
                '<Eq>' +
                    '<FieldRef Name=\'DocumentType\'/>' +
                    '<Value Type=\'Text\'>' + DocType + '</Value>' +
                '</Eq>' +
                '</And>' +
             '</Where>' +
             '<OrderBy>' +
                '<FieldRef Name=\'_DCDateCreated\' ' + 'Ascending=\'TRUE\' />' +
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
                '<FieldRef Name=\'Copy\' />' +
            '</ViewFields>' +
        '</View>');
    window.collListItem = oList.getItems(camlQuery);
    context.load(collListItem, 'Include(Id, InternalReference,DocumentType,CategoryDescription,_DCDateCreated,DiffusionDate,ExternalReference,Location,Form,_Status,Copy)');
    context.executeQueryAsync(Function.createDelegate(this, window.onQuerySucceeded),
    Function.createDelegate(this, window.onQueryFailed));
}
/**
 * Retrieves filter of the project created date.
 */
function retrieveProjectDateCreated() {
    var context = new SP.ClientContext.get_current();
    var oList = context.get_web().get_lists().getByTitle('File');
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(
        '<View>' +
         '<Query>' +
            '<Where>' +
                '<And>' +
                '<Eq>' +
                    '<FieldRef Name=\'Project1\'/>' +
                    '<Value Type=\'Lookup\'>' + projectID + '</Value>' +
                '</Eq>' +
                '<Eq>' +
                    '<FieldRef Name=\'_DCDateCreated\'/>' +
                    '<Value IncludeTimeValue=’FALSE’ Type=\'DateTime\'>' + DateCreat + '</Value>' +
                '</Eq>' +
                '</And>' +
             '</Where>' +
             '<OrderBy>' +
                '<FieldRef Name=\'_DCDateCreated\' ' + 'Ascending=\'TRUE\' />' +
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
                '<FieldRef Name=\'Copy\' />' +
            '</ViewFields>' +
        '</View>');
    window.collListItem = oList.getItems(camlQuery);
    context.load(collListItem, 'Include(Id, InternalReference,DocumentType,CategoryDescription,_DCDateCreated,DiffusionDate,ExternalReference,Location,Form,_Status,Copy)');
    context.executeQueryAsync(Function.createDelegate(this, window.onQuerySucceeded),
    Function.createDelegate(this, window.onQueryFailed));
}
/**
 * Retrieves filter of the format.
 */
function retrieveProjectFormat() {
    var context = new SP.ClientContext.get_current();
    var oList = context.get_web().get_lists().getByTitle('File');
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(
        '<View>' +
         '<Query>' +
            '<Where>' +
                '<And>' +
                '<Eq>' +
                    '<FieldRef Name=\'Project1\'/>' +
                    '<Value Type=\'Lookup\'>' + projectID + '</Value>' +
                '</Eq>' +
                '<Eq>' +
                    '<FieldRef Name=\'Form\'/>' +
                    '<Value Type=\'Choice\'>' + Form + '</Value>' +
                '</Eq>' +
                '</And>' +
             '</Where>' +
             '<OrderBy>' +
                '<FieldRef Name=\'_DCDateCreated\' ' + 'Ascending=\'TRUE\' />' +
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
                '<FieldRef Name=\'Copy\' />' +
            '</ViewFields>' +
        '</View>');
    window.collListItem = oList.getItems(camlQuery);
    context.load(collListItem, 'Include(Id, InternalReference,DocumentType,CategoryDescription,_DCDateCreated,DiffusionDate,ExternalReference,Location,Form,_Status,Copy)');
    context.executeQueryAsync(Function.createDelegate(this, window.onQuerySucceeded),
    Function.createDelegate(this, window.onQueryFailed));
}
/**
 * Ons the query succeeded.
 * @param {type} sender - The sender.
 * @param {type} args - The arguments.
 */
function onQuerySucceeded(sender, args) {
    var listEnumerator = collListItem.getEnumerator();
    var listInfo = "<h1>" + projectTitle + "</h1>" +
    "<table class='table table-striped'>" +
        "<tr>" +
            "<th>Edit</th>" +
            "<th>Copy</th>" +
            "<th>Internal Reference</th>" +
            "<th class='dropdown'><a href='/' class='dropdown-toggle' data-toggle='dropdown'>Document Type<span class='caret'></span></a>" +
                "<ul class='dropdown-menu'>" +
                '<div id="resultsDocTypes"></div>';
    retrieveListDocTypes();
    listInfo += "</ul></th>" +
 "<th>Description</th>" +
 "<th class='dropdown'><a href='/' class='dropdown-toggle' data-toggle='dropdown'>Date Created<span class='caret'></span></a>" +
     "<ul class='dropdown-menu'>" +
     '<div id="resultsDateCreated"></div>' +
     "</ul></th>" +
 "<th>Diffusion Date</th>" +
 "<th>External Reference</th>" +
 "<th>Localization</th>" +
 "<th class='dropdown'><a href='/' class='dropdown-toggle' data-toggle='dropdown'>Format<span class='caret'></span></a>" +
 "<ul class='dropdown-menu'>" +
     '<div id="resultsForm"></div>' +
     "</ul></th>" +
 "<th>Status</th>" +
"</tr>";
    while (listEnumerator.moveNext()) {
        var diffusionDate = "";
        var oListItem = listEnumerator.get_current();
        var dateCreated = oListItem.get_item('_DCDateCreated').getFullYear() + "/" + padToTwo(((oListItem.get_item('_DCDateCreated').getMonth()) + 1)) + "/" + padToTwo(oListItem.get_item('_DCDateCreated').getDate());
        if (!((oListItem.get_item('DiffusionDate') == null) || (oListItem.get_item('DiffusionDate') == undefined) || (oListItem.get_item('DiffusionDate') == ""))) {
            diffusionDate = oListItem.get_item('DiffusionDate').getFullYear() + "/" + padToTwo(((oListItem.get_item('DiffusionDate').getMonth()) + 1)) + "/" + padToTwo((oListItem.get_item('DiffusionDate').getDate()));
        }
        if (oListItem.get_item('_Status') == "Deleted") {
            listInfo += '<tr class="bold" role="alert">';
        } else listInfo += "<tr>";
        listInfo +=
            "<td><a href='#' onclick='ShowDialog(" + oListItem.get_id() + ")'><img src='../Images/EditIcon.png' /></a></td>" +
            "<td>";
        if ((oListItem.get_item('Copy') == null) || (oListItem.get_item('InternalReference') == undefined) || (oListItem.get_item('InternalReference') == "")) {
            listInfo += "<a href='#' onclick='ShowDialogCopy(" + oListItem.get_id() + ")'><img src='../Images/CopyIcon.png' /></a>";
        }
        listInfo += "</td>" +
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
/**
 * Shows the dialog For Edit File.
 * @param {integer} ID - The file identifier.
 * @returns {type} 
 */
function ShowDialog(ID) {
    var options = {
        url: "../Pages/EditFile.aspx?ID=" + ID,
        width: 600,
        height: 600,
        allowMaximize: true,
        title: "Edit File",
        dialogReturnValueCallback: scallback
    };
    SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', options);
    return false;
}
/**
 * Shows the new window for copy file and create new with diferent version or revision.
 * @param {integer} ID - The identifier.
 * @returns {type} 
 */
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
/**
 * Adds the DGD tab in the ribbon.
 */
function AddDGDTab() {
    var sTitleHtml = "";
    var sManageHtml = "";
    sTitleHtml += "<a href='../Pages/Default.aspx' >' ";
    sTitleHtml += "<img src='../images/ViewIcon.png' /></a><br/>My Projects";
    sManageHtml += "<a href='../Pages/NewFile.aspx?ID=" + projectID + "&Title=" + projectTitle + "' >";
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
/**
 * Query to take document types, formats and created date.
 */
function retrieveListDocTypes() {
    var context = new SP.ClientContext.get_current();
    var oList = context.get_web().get_lists().getByTitle('File');
    var camlQuery = new SP.CamlQuery();
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
                '<FieldRef Name=\'DocumentType\' />' +
                '<FieldRef Name=\'Form\' />' +
                '<FieldRef Name=\'_DCDateCreated\' />' +
             '</OrderBy>' +
         '</Query>' +
            '<ViewFields>' +
                '<FieldRef Name=\'DocumentType\' />' +
                '<FieldRef Name=\'_DCDateCreated\' />' +
                '<FieldRef Name=\'Form\' />' +
            '</ViewFields>' +
        '</View>');
    window.collListItem = oList.getItems(camlQuery);
    context.load(collListItem, 'Include(DocumentType,_DCDateCreated,Form)');
    context.executeQueryAsync(Function.createDelegate(this, window.onQueryListDocTypesSucceeded),
    Function.createDelegate(this, window.onQueryFailed));

}
/**
 * Ons the query succeeded.
 * @param {type} sender - The sender.
 * @param {type} args - The arguments.
 */
function onQueryListDocTypesSucceeded(sender, args) {
    var listEnumerator = collListItem.getEnumerator();
    var listDocTypes = "";
    var listDateCreated = "";
    var listForm = "";
    var temp1 = "";
    var temp2 = [];
    var temp3 = "";
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        if (!(oListItem.get_item('DocumentType') == temp1)) {
            temp1 = oListItem.get_item('DocumentType');
            listDocTypes += "<li><a href='../Pages/File.aspx?ID=" + projectID + "&Title=" + projectTitle + "&DT=" + oListItem.get_item('DocumentType') + "'>" + oListItem.get_item('DocumentType') + "</a></li>";
        }
        var year = oListItem.get_item('_DCDateCreated').getFullYear();
        var month = oListItem.get_item('_DCDateCreated').getMonth();
        var day = oListItem.get_item('_DCDateCreated').getDate();
        var count = 0;
        if (temp2.length == 0) {
            temp2.push(oListItem.get_item('_DCDateCreated'));
        } else {
            temp2.forEach(myFunction);
            if (count == 0) {
                temp2.push(oListItem.get_item('_DCDateCreated'));
            }
        }
        /**
         * Count if the array contains the date
         * @param {date} item - The date
         * @param {integer} index - The index
         */
        function myFunction(item, index) {
            if ((year == item.getFullYear()) && (month == item.getMonth()) && (day == item.getDate())) {
                count += 1;
            }
        }
        if (!(oListItem.get_item('Form') == temp3)) {
            temp3 = oListItem.get_item('Form');
            listForm += "<li><a href='../Pages/File.aspx?ID=" + projectID + "&Title=" + projectTitle + "&FO=" + oListItem.get_item('Form') + "'>" + oListItem.get_item('Form') + "</a></li>";
        }
    }
    var date_sort_asc = function (date1, date2) {
        // This is a comparison function that will result in dates being sorted in
        // ASCENDING order. As you can see, JavaScript's native comparison operators
        // can be used to compare dates. 
        if (date1 > date2) return 1;
        if (date1 < date2) return -1;
        return 0;
    };
    temp2.sort(date_sort_asc);
    for (var i = 0; i < temp2.length; i++) {
        listDateCreated += "<li><a href='../Pages/File.aspx?ID=" + projectID + "&Title=" + projectTitle + "&DC=" + temp2[i] + "'>" + temp2[i].getFullYear() + "/" + padToTwo(((temp2[i].getMonth()) + 1)) + "/" + padToTwo(temp2[i].getDate()) + "</a></li>";
    }
    $("#resultsDocTypes").html(listDocTypes);
    $("#resultsForm").html(listForm);
    $("#resultsDateCreated").html(listDateCreated);
}