﻿$(document).ready(function () {
    projectId = GetUrlKeyValue('ID', false);
    if (!(projectId == "" || projectId == undefined || projectId == null)) {
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', retrieveDGDs);
    }
    /**
     * Get inputs from the edit form.
     */
    $("#Submit").click(function () {
        var projectName = $('#ProjectName').val();
        var projectCode = $('#ProjectCode').val();
        var avenant = $('#Avenant').val();
        var idAgency = $('#IdAgency').val();
        var projectType = $('#ProjectType').val();
        errorMsg = "";
        //Validate ID Agency, Avenant and Project Code
        /**
         * Validates the agency.
         * @param {number} idAgency - The identifier agency.
         * @returns {boolean} 
         */
        function validateAgency(idAgency) {
            var re = new RegExp(/^[A-Z][0-9]$/);
            return idAgency.match(re);
        }
        /**
         * Validates the project code.
         * @param {number} projectCode - The project code.
         * @returns {boolean} 
         */
        function validateProjectCode(projectCode) {
            var re = new RegExp(/^[0-9]+$/);
            return projectCode.match(re);
        }
        /**
         * Validates the avenant.
         * @param {number} avenant - The avenant.
         * @returns {boolean} 
         */
        function validateAvenant(avenant) {
            var re = new RegExp(/^[0-9]+$/);
            return avenant.match(re);
        }
        /**
         * Gets the error from validation data
         */
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
                updateListItem(projectName, projectCode, avenant, idAgency);
            }
        }
        $("#errorValidate").html(errorMsg);
    });//click button function ends
});//ready function ends
/**
 * Query project by ID.
 */
function retrieveDGDs() {
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
/**
 * Ons the query succeeded.
 * @param {type} sender - The sender.
 * @param {type} args - The arguments.
 */
function onQueryEditSucceeded(sender, args) {
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

/**
 * Updates the list item.
 * @param {string} projectName - Name of the project.
 * @param {integer} projectCode - The project code.
 * @param {integer} avenant - The avenant.
 * @param {integer} idAgency - The identifier agency.
 */
function updateListItem(projectName, projectCode, avenant, idAgency) {
    var clientContext = new SP.ClientContext.get_current();
    var oList = clientContext.get_web().get_lists().getByTitle('Projets');

    this.oListItem = oList.getItemById(projectId);

    oListItem.set_item('Title', projectName);
    oListItem.set_item('IdAgency', idAgency);
    oListItem.set_item('ProjectCode', projectCode);
    oListItem.set_item('Avenant', avenant);

    oListItem.update();

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQueryUpdateSucceeded), Function.createDelegate(this, this.onQueryUpdateFailed));
}
/**
 * On the query update succeeded.
 */
function onQueryUpdateSucceeded() {
    var popData = "";
    SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK, popData);
   
}
/**
 * Ons the query succeeded.
 * @param {type} sender - The sender.
 * @param {type} args - The arguments.
 */
function onQueryUpdateFailed(sender, args) {
    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}
