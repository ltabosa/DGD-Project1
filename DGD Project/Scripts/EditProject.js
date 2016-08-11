$(document).ready(function () {
    projectId = GetUrlKeyValue('ID', false);
    if (!(projectId == "" || projectId == undefined || projectId == null)) {
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', retrieveDGDs);
    }
    $("#Submit").click(function () {

        //input variables
        /// <summary>
        /// Get inputs from the edit form.
        /// </summary>
        /// <returns></returns>
        var projectName = $('#ProjectName').val();
        var projectCode = $('#ProjectCode').val();
        var avenant = $('#Avenant').val();
        var idAgency = $('#IdAgency').val();
        var projectType = $('#ProjectType').val();
        errorMsg = "";

        //Validate ID Agency, Avenant and Project Code
        function validateAgency(idAgency) {
            var re = new RegExp(/^[A-Z][0-9]$/);
            return idAgency.match(re);
        }
        function validateProjectCode(projectCode) {
            var re = new RegExp(/^[0-9]+$/);
            return projectCode.match(re);
        }
        function validateAvenant(avenant) {
            var re = new RegExp(/^[0-9]+$/);
            return avenant.match(re);
        }
        function getError() {
            if (!validateAgency(idAgency)) errorMsg += "Not a correct format for ID Agency (e.g. A9)<br>";
            if (!validateProjectCode(projectCode)) errorMsg += "Project Code must be a number<br>";
            if (!validateAvenant(avenant)) errorMsg += "Avenant must be a number<br>";
        }

        if (projectType == "Full") {
            $('.notShow').show();
            if ((!(projectName == null || projectName == undefined || projectName == ""))
             || (!(projectCode == null || projectCode == undefined || projectCode == ""))
             || (!(avenant == null || avenant == undefined || avenant == ""))
             || (!(idAgency == null || idAgency == undefined || idAgency == ""))) {
                getError();
            } else errorMsg = "You must fill all fields";
            if (errorMsg == "") {
                updateListItem(projectName, projectCode, avenant, idAgency);
            }
        } else {
            $('.notShow').hide();
            if (!validateAgency(idAgency)) errorMsg += "Not a correct format for ID Agency (e.g. A9)<br>";
            if (errorMsg == "") {
                //alert('create project here');
                updateListItem(projectName, projectCode, avenant, idAgency);
            }
        }
        $("#errorValidate").html(errorMsg);
    });//click button function ends
});//ready function ends

function retrieveDGDs() {
    /// <summary>
    /// Query project by ID.
    /// </summary>
    /// <returns></returns>
    var context = new SP.ClientContext.get_current();
    var oList = context.get_web().get_lists().getByTitle('Projets');
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(
        '<View>' +
            '<Query>' +
                '<Where>' +
                    '<Eq>' +
                        '<FieldRef Name=\'ID\'/>' +
                        '<Value Type=\'Counter\'>' + projectId + '</Value>' +
                    '</Eq>' +
                '</Where>' +
                '<OrderBy>' +
                    '<FieldRef Name=\'Title\' ' + 'Ascending=\'TRUE\' />' +
                '</OrderBy>' +
            '</Query>' +
            '<ViewFields>' +
                '<FieldRef Name=\'Title\' />' +
                '<FieldRef Name=\'ProjectCode\' />' +
                '<FieldRef Name=\'Avenant\' />' +
                '<FieldRef Name=\'IdAgency\' />' +
                '<FieldRef Name=\'ProjectType\' />' +
            '</ViewFields>' +
        '</View>');
    window.collListItem = oList.getItems(camlQuery);
    context.load(collListItem, 'Include(Title, ProjectCode, Avenant, IdAgency, ProjectType)');
    context.executeQueryAsync(Function.createDelegate(this, window.onQueryEditSucceeded),
    Function.createDelegate(this, window.onQueryFailed));
}
/*function onQueryEditFailed(sender, args) {
    SP.UI.Notify.addNotification('Request failed. ' + args.get_message() + '\n' +
    args.get_stackTrace(), true);
}*/
function onQueryEditSucceeded(sender, args) {
    /// <summary>
    /// On the query succeeded. Fill fields with the informations.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="args">The arguments.</param>
    /// <returns></returns>
    var listEnumerator = collListItem.getEnumerator();
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        document.getElementById('ProjectName').value = oListItem.get_item('Title');
        document.getElementById('ProjectCode').value = oListItem.get_item('ProjectCode');
        document.getElementById('Avenant').value = oListItem.get_item('Avenant');
        document.getElementById('IdAgency').value = oListItem.get_item('IdAgency');
        document.getElementById('ProjectType').value = oListItem.get_item('ProjectType');
        if (oListItem.get_item('Avenant') == null || oListItem.get_item('Avenant') == undefined || oListItem.get_item('Avenant') == "") {
            $('.notShow').hide();
        } 
    }
}


function updateListItem(projectName, projectCode, avenant, idAgency) {

    /// <summary>
    /// Updates the list item.
    /// </summary>
    /// <param name="projectName">Name of the project.</param>
    /// <param name="projectCode">The project code.</param>
    /// <param name="avenant">The avenant.</param>
    /// <param name="idAgency">The identifier agency.</param>
    /// <returns></returns>
    var clientContext = new SP.ClientContext.get_current();
    var oList = clientContext.get_web().get_lists().getByTitle('Projets');

    this.oListItem = oList.getItemById(projectId);

    oListItem.set_item('Title', projectName);
    oListItem.set_item('IdAgency', idAgency);
    //if (document.getElementById('ProjectType').value != "Full") {
      //  oListItem.set_item('ProjectCode', null);
     //   oListItem.set_item('Avenant', null);
    //}else{
        oListItem.set_item('ProjectCode', projectCode);
        oListItem.set_item('Avenant', avenant);
   // }

    oListItem.update();

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQueryUpdateSucceeded), Function.createDelegate(this, this.onQueryUpdateFailed));
}

function onQueryUpdateSucceeded() {
    /// <summary>
    /// On the query update succeeded.
    /// </summary>
    /// <returns></returns>
    var popData = "";
    SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK, popData);
   
}

function onQueryUpdateFailed(sender, args) {
    /// <summary>
    /// On the query update failed.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="args">The arguments.</param>
    /// <returns></returns>
    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}
