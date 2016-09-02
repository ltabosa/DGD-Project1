$(document).ready(function () {
    fileId = GetUrlKeyValue('ID', false);
    if (!(fileId == "" || fileId == undefined || fileId == null)) {
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', retrieveFiles);
    }
    /**
     * Get inputs on form click.
     */
    $("#Submit").click(function () {
        //input variables
        var internalReference = "";
        var documentType = $("#DocumentType option:selected").text();
        var description = $('#Description').val();
        var dateCreated = dateCreate;
        var diffusionDate = document.getElementById('DiffusionDate').value;
        var externalReference = $('#ExternalReference').val();
        var localization = $('#Localization').val();
        var form = $('#Form').val();
        if ($('#Status').val() == "" || $('#Status').val() == undefined || $('#Status').val() == null) {
            var status = localStorage.getItem('status');
        } else var status = $('#Status').val();
            //console.log(localStorage.getItem('status'));
        //var status = $('#Status').val();
        if (status == "Deleted") {
            localization = "n/a";
        }
        var idAgency = $('#IdAgency').val();
        var projectType = $('#ProjectType').val();

        var avenant = $('#Avenant').val();
        var projectCode = $('#ProjectCode').val();
        var projectName = $('#ProjectName').val();
        var orderNumber = $('#OrderNumber').val();
        var revision = $('#Revision').val();
        var version = $('#Version').val();
        errorMsg = "";
        //Validation if the URL is valid in case of form eletronic
        if (localization == null || localization == undefined || localization == "") {
            if (status == "Validated") {
                errorMsg = "You must fill the field <b>Localization</b>";
            } else createFile();
        }else if ((form == "E") && (status!="Deleted")) {
            if (validateUrl(localization)) {
                createFile();
            } else errorMsg = "You must enter a valid URL in localization";
        } else createFile();
        //Internal Reference as Basic
        /**
         * Creates the file.
         */
        function createFile(){
        if (projectType == "Basic") {
            internalReference = idAgency + "-" + padToFour(orderNumber) + "-" + padToTwo(version) + "-" + padToTwo(revision);
            updateListItem(fileId,internalReference,documentType,description,dateCreated,diffusionDate,externalReference,localization,form,status);
            //Internal Reference as Full
        } else if (projectType == "Full") {
            internalReference = documentType + "-" + padToFour(projectCode) + "-" + padToTwo(avenant) + "-" + idAgency + "-" + padToFour(orderNumber) + "-" + padToTwo(version) + "-" + padToTwo(revision);
            updateListItem(fileId, internalReference, documentType, description, dateCreated, diffusionDate, externalReference, localization, form, status);
            //Internal Reference as Full Without Project 
        } else {

            internalReference = documentType + "-" + idAgency + "-" + padToFour(orderNumber) + "-" + padToTwo(version) + "-" + padToTwo(revision);
            updateListItem(fileId, internalReference, documentType, description, dateCreated, diffusionDate, externalReference, localization, form, status);
        }
        }
        $("#errorValidate").html(errorMsg);
    });//click button function ends
});//ready function ends
/**
 * Retrieves the file by ID.
 */
function retrieveFiles() {
    var context = new SP.ClientContext.get_current();
    var oList = context.get_web().get_lists().getByTitle('File');
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(
        '<View>' +
            '<Query>' +
                '<Where>' +
                    '<Eq>' +
                        '<FieldRef Name=\'ID\'/>' +
                        '<Value Type=\'Counter\'>' + fileId + '</Value>' +
                    '</Eq>' +
                '</Where>' +
                '<OrderBy>' +
                    '<FieldRef Name=\'Title\' ' + 'Ascending=\'TRUE\' />' +
                '</OrderBy>' +
            '</Query>' +
            '<ViewFields>' +
                '<FieldRef Name=\'Id\' />' +
                '<FieldRef Name=\'InternalReference\' />' +
                '<FieldRef Name=\'DocumentType\' />' +
                 '<FieldRef Name=\'Project1\' />' +
                '<FieldRef Name=\'CategoryDescription\' />' +
                '<FieldRef Name=\'_DCDateCreated\' />' +
                '<FieldRef Name=\'DiffusionDate\' />' +
                '<FieldRef Name=\'ExternalReference\' />' +
                '<FieldRef Name=\'Location\' />' +
                '<FieldRef Name=\'Form\' />' +
                '<FieldRef Name=\'_Status\' />' +
                '<FieldRef Name=\'OrderNumber\' />' +
                '<FieldRef Name=\'Version\' />' +
                '<FieldRef Name=\'Revision\' />' +
            '</ViewFields>' +
        '</View>');
    window.collListItem = oList.getItems(camlQuery);
    context.load(collListItem, 'Include(Id, InternalReference, DocumentType, Project1, CategoryDescription, _DCDateCreated ,DiffusionDate,ExternalReference,Location,Form,_Status, OrderNumber,Version,Revision)');
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
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        localStorage.setItem("documentType", oListItem.get_item('DocumentType'));
        localStorage.setItem("description", oListItem.get_item('CategoryDescription'));
        dateCreate = oListItem.get_item('_DCDateCreated');
        localStorage.setItem("diffusionDate", oListItem.get_item('DiffusionDate'));
        localStorage.setItem("externalReference", oListItem.get_item('ExternalReference'));
        localStorage.setItem("localization", oListItem.get_item('Location'));
        localStorage.setItem("form", oListItem.get_item('Form'));
        localStorage.setItem("status", oListItem.get_item('_Status'));
        localStorage.setItem("orderNumber", oListItem.get_item('OrderNumber'));
        localStorage.setItem("version", oListItem.get_item('Version'));
        localStorage.setItem("revision", oListItem.get_item('Revision'));
        retrieveProject(oListItem.get_item('Project1'));
    }
}
/**
 * Retrieves the project.
 * @param {number} projectId - The project identifier.
 */
function retrieveProject(projectId) {
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
        document.getElementById('DocumentType').value = localStorage.getItem('documentType');
        document.getElementById('Description').value = localStorage.getItem('description');
        //document.getElementById('DateCreated').value = localStorage.getItem('dateCreated');
        document.getElementById('DiffusionDate').value = localStorage.getItem('diffusionDate');
        document.getElementById('ExternalReference').value = localStorage.getItem('externalReference');
        if (localStorage.getItem('localization') == "" || localStorage.getItem('localization') == null || localStorage.getItem('localization') == "null" || localStorage.getItem('localization') == undefined) {
            document.getElementById('Localization').value = "";
        }else document.getElementById('Localization').value = localStorage.getItem('localization');
        document.getElementById('Form').value = localStorage.getItem('form');
        document.getElementById('Status').value = localStorage.getItem('status');
        
        document.getElementById('OrderNumber').value = localStorage.getItem('orderNumber');
        document.getElementById('Version').value = localStorage.getItem('version');
        document.getElementById('Revision').value = localStorage.getItem('revision');
        document.getElementById('ProjectName').value = oListItem.get_item('Title');
        document.getElementById('ProjectCode').value = oListItem.get_item('ProjectCode');
        document.getElementById('Avenant').value = oListItem.get_item('Avenant');
        document.getElementById('IdAgency').value = oListItem.get_item('IdAgency');
        document.getElementById('ProjectType').value = oListItem.get_item('ProjectType');
        if (oListItem.get_item('ProjectType') == "Basic") {
            $('.notShow').hide();
        }
    }
}
/**
 * Updates the list item.
 * @param {number} fileId - The file identifier.
 * @param {text} internalReference - The internal reference.
 * @param {choice} documentType - Type of the document.
 * @param {text} description - The description.
 * @param {date} dateCreated - The date created.
 * @param {date} diffusionDate - The diffusion date.
 * @param {text} externalReference - The external reference.
 * @param {text/url} localization - The localization.
 * @param {choice} form - The form.
 * @param {choice} status - The status.
 */
function updateListItem(fileId,internalReference,documentType,description,dateCreated,diffusionDate,externalReference,localization,form,status){

    var clientContext = new SP.ClientContext.get_current();
    var oList = clientContext.get_web().get_lists().getByTitle('File');

    this.oListItem = oList.getItemById(fileId);

    oListItem.set_item('InternalReference', internalReference);
    oListItem.set_item('DocumentType', documentType);
    oListItem.set_item('CategoryDescription', description);
    if (!((dateCreated == undefined)||(dateCreated == null)||(dateCreated == ""))){
        oListItem.set_item('_DCDateCreated', dateCreated);
    }
    if (((diffusionDate == undefined) || (diffusionDate == null) || (diffusionDate == "")) && (status == "Validated")) {
        diffusionDate = new Date();
    }
    if (!((diffusionDate == undefined)||(diffusionDate == null)||(diffusionDate == ""))) {
        oListItem.set_item('DiffusionDate', diffusionDate);
    }
    oListItem.set_item('ExternalReference', externalReference);
    oListItem.set_item('Location', localization);
    oListItem.set_item('Form', form);
    oListItem.set_item('_Status', status);
    //save today modification date
    var dateToday = new Date();
    oListItem.set_item('Date1', dateToday);

    oListItem.update();

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQueryUpdateSucceeded), Function.createDelegate(this, this.onQueryUpdateFailed));
}
/**
 * Ons the query update succeeded.
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