/**Query to shows all projects*/
$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', retrieveDGD);
    SP.SOD.executeOrDelayUntilScriptLoaded(ModifyRibbon, 'sp.ribbon.js');
});
/**
 * Retrieves the DGD project.
 */
function retrieveDGD() {
    var context = new SP.ClientContext.get_current();
    var oList = context.get_web().get_lists().getByTitle('Projets');
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name=\'Title\' ' + 'Ascending=\'TRUE\' /></OrderBy></Query><ViewFields><FieldRef Name=\'Id\' /><FieldRef Name=\'Title\' /><FieldRef Name=\'ProjectCode\' /><FieldRef Name=\'Avenant\' /><FieldRef Name=\'IdAgency\' /></ViewFields></View>');
    window.collListItem = oList.getItems(camlQuery);
    context.load(collListItem, 'Include(IdAgency, Id, Title, Avenant, ProjectCode)');
    context.executeQueryAsync(Function.createDelegate(this, window.onQuerySucceeded),
    Function.createDelegate(this, window.onQueryFailed));
}
/**
 * On the query succeeded. Lists all the projects
 * @param {type} sender - The sender.
 * @param {type} args - The arguments.
 */
function onQuerySucceeded(sender, args) {
    var listEnumerator = collListItem.getEnumerator();
    var listInfo =
        "<table class='table table-striped'>" +
            "<tr>" +
                "<th class='col-md-1'></th>" +
                "<th>Project Name</th>" +
                "<th>Project Code</th>" +
                "<th>Avenant</th>" +
                "<th>Id Agency</th>" +
            "</tr>";
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        listInfo +=
        "<tr>" +
        "<td class='col-md-1'><a href='#' onclick='ShowDialog(" + oListItem.get_id() + ")'><img src='../Images/EditIcon.png' /></a></td>" +
        "<td>" +
            "<a href='../Pages/File.aspx?ID=" + oListItem.get_id() + "&Title=" + oListItem.get_item('Title') + "'>" + oListItem.get_item('Title') + "</a>"+
        "</td>" +
        "<td>" + oListItem.get_item('ProjectCode') + "</td>" +
        "<td>" + oListItem.get_item('Avenant') + "</td>" +
        "<td>" + oListItem.get_item('IdAgency') + "</td>" +
        "</tr>";
    }
    listInfo +="</table>";
    $("#results").html(listInfo);
}
/**
 * Shows the dialog.
 * @param {number} ID - The project identifier.
 * @returns {boolean} 
 */
function ShowDialog(ID) {
    var options = {
        url: "../Pages/EditProject.aspx?ID=" + ID,
        allowMaximize: true,
        title: "Edit Project",
        dialogReturnValueCallback: scallback
    };
    SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', options);
    return false;
}
/**
 * Adds the DGD tab.
 */
function AddDGDTab() {
    var sTitleHtml = "";
    var sManageHtml = "";
    sTitleHtml += "<a href='../Lists/File/MyView.aspx' >' ";
    sTitleHtml += "<img src='../images/ViewIcon.png' /></a><br/>My Files";
    sManageHtml += "<a href='../Pages/NewProject.aspx' >";
    sManageHtml += "<img src='../images/CreateIcon.png' /></a><br/>Create New Project";
    var ribbon = SP.Ribbon.PageManager.get_instance().get_ribbon();
    if (ribbon !== null) {
        var tab = new CUI.Tab(ribbon, 'DGD.Tab', 'DGD',
        'Use this tab to view and modify the DGD list',
        'DGD.Tab.Command', false, '', null);
        ribbon.addChildAtIndex(tab, 1);
        var group = new CUI.Group(ribbon, 'DGD.Tab.Group', 'Actions',
        'Use this group to add/update/delete DGD',
        'DGD.Group.Command', null);
        tab.addChild(group);
    }
    SelectRibbonTab('DGD.Tab', true);
    $("span:contains('Actions')").prev("span").html(sManageHtml);
    SelectRibbonTab('Ribbon.Read', true);
}