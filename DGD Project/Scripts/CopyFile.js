$(document).ready(function () {
    
    fileId = GetUrlKeyValue('ID', false);
    if (!(fileId == "" || fileId == undefined || fileId == null)) {
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', retrieveFile);
    }
    /**
     * Call function to create new file and update last one.
     */
    $("#Submit").click(function () {
        var internalReference = "";
        var errorMsg = "";
        var documentType = $("#DocumentType").val();
        var description = $('#Description').val();
        //Take today date if the input is not set
        var dateCreated = document.getElementById('DateCreated').value;
        var diffusionDate = document.getElementById('DiffusionDate').value;
        //Validate the date created
        if (!((dateCreated == undefined) || (dateCreated == null) || (dateCreated == ""))) {
            dateCreated = new Date(dateCreated);
            var yearCreated = dateCreated.getFullYear();
            var monthCreated = dateCreated.getMonth();
            var dayCreated = dateCreated.getDate() + 1;
            dateCreated = new Date(yearCreated, monthCreated, dayCreated);
            //source date
            var d = new Date(localStorage.getItem('dateCreated'));
            if (yearCreated == d.getFullYear()) {
                if (monthCreated == d.getMonth()) {
                    if (dayCreated < d.getDate()) errorMsg = "The <b>date created</b> can not be less than <b>source date created</b>.<br>";
                } else if (monthCreated < d.getMonth()) errorMsg = "The <b>date created</b> can not be less than <b>source date created</b>.<br>";
            } else if (yearCreated < d.getFullYear()) errorMsg = "The <b>date created</b> can not be less than <b>source date created</b>.<br>";
        } else dateCreated = new Date();
        console.log(d);
        console.log(dateCreated);
        var externalReference = $('#ExternalReference').val();
        var localization = $('#Localization').val();
        var form = $('#Form').val();
        var status = $('#Status').val();
        var idAgency = $('#IdAgency').val();
        var projectType = $('#ProjectType').val();
        var avenant = $('#Avenant').val();
        var projectCode = $('#ProjectCode').val();
        var projectId = $('#ProjectID').val();
        var projectName = $('#ProjectName').val();
        var orderNumber = $('#OrderNumber').val();
        var revision = parseInt($('#Revision').val(),10);
        var version = parseInt($('#Version').val(),10);
        var versionOuRevision = document.querySelector('input[name=versionRevision]:checked').value;//$('input[name="versionRevision"]:checked').val();
       
        if (versionOuRevision == "version") {
            version += 1;
            revision = 1;
        } else { revision += 1; }

        //Validation if the URL is valid in case of form eletronic
        if (localization == null || localization == undefined || localization == "") {
            if (status == "Validated") {
                errorMsg += "You must fill the field <b>Localization</b>";
            } 
        }
        if (errorMsg == "") createFile();
        /**
         * Creates the file.
         */
        function createFile(){
            //Internal Reference as Basic
            if (projectType == "Basic") {
                //SEE HOW MANY DOCTYPE WE HAVE AND TAKE THE NEXT NUMBER
                internalReference = idAgency + "-" + padToFour(orderNumber) + "-" + padToTwo(version) + "-" + padToTwo(revision);
                //Internal Reference as Full
            } else if (projectType == "Full") {
                internalReference = documentType + "-" + padToFour(projectCode) + "-" + padToTwo(avenant) + "-" + idAgency + "-" + padToFour(orderNumber) + "-" + padToTwo(version) + "-" + padToTwo(revision);
                //Internal Reference as Full Without Project 
            } else {internalReference = documentType + "-" + idAgency + "-" + padToFour(orderNumber) + "-" + padToTwo(version) + "-" + padToTwo(revision);
         } createListItem(projectId, internalReference, documentType, description, dateCreated, diffusionDate, externalReference, localization, form, status, orderNumber, version, revision);
        } $("#errorValidate").html(errorMsg);
    });//click button function ends

});//ready function ends
/**
 * Retrieves the file selected by ID.
 */
function retrieveFile() {
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
        localStorage.setItem("dateCreated", oListItem.get_item('_DCDateCreated'));
        localStorage.setItem("diffusionDate", oListItem.get_item('DiffusionDate'));
        localStorage.setItem("externalReference", oListItem.get_item('ExternalReference'));
        localStorage.setItem("localization", oListItem.get_item('Location'));
        localStorage.setItem("form", oListItem.get_item('Form'));
        localStorage.setItem("orderNumber", oListItem.get_item('OrderNumber'));
        localStorage.setItem("version", oListItem.get_item('Version'));
        localStorage.setItem("revision", oListItem.get_item('Revision'));
        localStorage.setItem("ProjectID", oListItem.get_item('Project1'));
        retrieveProject(oListItem.get_item('Project1'));
    }
}
/**
 * Retrieves the project info.
 * @param {type} projectId - The project identifier.
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
 * Ons the query edit succeeded.
 * @param {type} sender - The sender.
 * @param {type} args - The arguments.
 */
function onQueryEditSucceeded(sender, args) {
    var listEnumerator = collListItem.getEnumerator();
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        document.getElementById('DocumentType').value = localStorage.getItem('documentType');
        document.getElementById('Description').value = localStorage.getItem('description');
        document.getElementById('DateCreated').value = localStorage.getItem('dateCreated');
        document.getElementById('DiffusionDate').value = localStorage.getItem('diffusionDate');
        document.getElementById('ExternalReference').value = localStorage.getItem('externalReference');
        document.getElementById('Localization').value = localStorage.getItem('localization');
        document.getElementById('Form').value = localStorage.getItem('form');
        document.getElementById('OrderNumber').value = localStorage.getItem('orderNumber');
        document.getElementById('Version').value = localStorage.getItem('version');
        document.getElementById('Revision').value = localStorage.getItem('revision');
        //get project informations
        document.getElementById('ProjectID').value = localStorage.getItem('ProjectID');
        document.getElementById('ProjectName').value = oListItem.get_item('Title');
        document.getElementById('ProjectCode').value = oListItem.get_item('ProjectCode');
        document.getElementById('Avenant').value = oListItem.get_item('Avenant');
        document.getElementById('IdAgency').value = oListItem.get_item('IdAgency');
        document.getElementById('ProjectType').value = oListItem.get_item('ProjectType');
    }
}
/**
 * Creates the list item.
 * @param {number} projectId - The project identifier.
 * @param {text} internalReference - The internal reference.
 * @param {choice} documentType - Type of the document.
 * @param {text} description - The description.
 * @param {date} dateCreated - The date created.
 * @param {date} diffusionDate - The diffusion date.
 * @param {text} externalReference - The external reference.
 * @param {text/url} localization - The localization
 * @param {choice} form - The form (paper or eletronic)
 * @param {choice} status - The status.
 * @param {number} orderNumber - The order number.
 * @param {number} version - The version.
 * @param {number} revision - The revision.
 */
function createListItem(projectId, internalReference, documentType, description, dateCreated, diffusionDate, externalReference, localization, form, status, orderNumber,version,revision) {

    var clientContext = new SP.ClientContext.get_current();
    var oList = clientContext.get_web().get_lists().getByTitle('File');

    var itemCreateInfo = new SP.ListItemCreationInformation();
    this.oListItem = oList.addItem(itemCreateInfo);

    oListItem.set_item('Project1', projectId);
    oListItem.set_item('InternalReference', internalReference);
    oListItem.set_item('DocumentType', documentType);
    oListItem.set_item('CategoryDescription', description);
    if ((dateCreated == undefined) || (dateCreated == null) || (dateCreated == "")) {
        dateCreated = new Date();
    }
    oListItem.set_item('_DCDateCreated', dateCreated);
    if (((diffusionDate == undefined) || (diffusionDate == null) || (diffusionDate == "")) && (status == "Validated")) {
        diffusionDate = new Date();
    }
    if (!((diffusionDate == undefined) || (diffusionDate == null) || (diffusionDate == ""))) {
        oListItem.set_item('DiffusionDate', diffusionDate);
    }
    oListItem.set_item('ExternalReference', externalReference);
    oListItem.set_item('Location', localization);
    oListItem.set_item('Form', form);
    oListItem.set_item('_Status', status);
    oListItem.set_item('OrderNumber', orderNumber);
    oListItem.set_item('Version', version);
    oListItem.set_item('Revision', revision);

    oListItem.update();

    clientContext.load(oListItem);

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQueryCreateSucceeded), Function.createDelegate(this, this.onQueryCreateFailed));
}//createListItem ends
/**
 * Ons the query create succeeded we update the file.
 */
function onQueryCreateSucceeded() {
    updateLastFile();
}
/**
 * Ons the query create failed.
 * @param {type} sender - The sender.
 * @param {type} args - The arguments.
 */
function onQueryCreateFailed(sender, args) {
    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}
/**
 * Updates the last file.
 */
function updateLastFile() {
    var clientContext = new SP.ClientContext.get_current();
    var oList = clientContext.get_web().get_lists().getByTitle('File');

    this.oListItem = oList.getItemById(fileId);

    oListItem.set_item('Copy', true);
    oListItem.set_item('_Status', 'Archived');

    oListItem.update();

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQueryUpdateSucceeded), Function.createDelegate(this, this.onQueryUpdateFailed));
}//createListItem ends
/**
 * Ons the query update succeeded.
 */
function onQueryUpdateSucceeded() {
    var popData = "";
    SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK, popData);
}
/**
 * Ons the query create failed.
 * @param {type} sender - The sender.
 * @param {type} args - The arguments.
 */
function onQueryUpdateFailed(sender, args) {
    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}