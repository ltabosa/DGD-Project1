$(document).ready(function () {
    projectId = GetUrlKeyValue('ID', false);
    if (!(projectId == "" || projectId == undefined || projectId == null)) {
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', retrieveDGDs);
    }
    $("#Submit").click(function () {

        //input variables
        var projectName = $('#ProjectName').val();
        var projectCode = $('#ProjectCode').val();
        var avenant = $('#Avenant').val();
        var idAgency = $('#IdAgency').val();
        //var projectType = $('#ProjectType').val();
        errorMsg = "";

        //Validate form 
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

        //if (projectType == "Full") {
        if (!(avenant == null || avenant == undefined || avenant == "")) {
            $('.notShow').show();
            if ((!(projectName == null || projectName == undefined || projectName == ""))
             || (!(projectCode == null || projectCode == undefined || projectCode == ""))
             || (!(avenant == null || avenant == undefined || avenant == ""))
             || (!(idAgency == null || idAgency == undefined || idAgency == ""))) {
                getError();
            } else errorMsg = "You must fill all fields";
            if (errorMsg == "") {
                //alert('create project here');
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
            '</ViewFields>' +
        '</View>');
    window.collListItem = oList.getItems(camlQuery);
    context.load(collListItem, 'Include(Title, ProjectCode, Avenant, IdAgency)');
    context.executeQueryAsync(Function.createDelegate(this, window.onQueryEditSucceeded),
    Function.createDelegate(this, window.onQueryEditFailed));
}
function onQueryEditFailed(sender, args) {
    SP.UI.Notify.addNotification('Request failed. ' + args.get_message() + '\n' +
    args.get_stackTrace(), true);
}
function onQueryEditSucceeded(sender, args) {
    var listEnumerator = collListItem.getEnumerator();
    //var listInfo ="";
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        document.getElementById('ProjectName').value = oListItem.get_item('Title');
        document.getElementById('ProjectCode').value = oListItem.get_item('ProjectCode');
        document.getElementById('Avenant').value = oListItem.get_item('Avenant');
        document.getElementById('IdAgency').value = oListItem.get_item('IdAgency');
        if (oListItem.get_item('Avenant') == null || oListItem.get_item('Avenant') == undefined || oListItem.get_item('Avenant') == "") {
            $('.notShow').hide();
        } 
    }
}


function updateListItem(projectName, projectCode, avenant, idAgency) {

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
    var popData = "";
    SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK, popData);
   
}

function onQueryUpdateFailed(sender, args) {

    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}
