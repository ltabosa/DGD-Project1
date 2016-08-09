$(document).ready(function () {
    //SP.SOD.executeFunc('sp.js', 'SP.ClientContext', retrieveDGDs);
    fileId = GetUrlKeyValue('ID', false);
    if (!(fileId == "" || fileId == undefined || fileId == null)) {
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', retrieveFiles);
    }
    $("#Submit").click(function () {
        //alert("Submit button: " + localStorage.getItem('description'));
        //input variables
        var internalReference = "";

        var documentType = $("#DocumentType option:selected").text();
        var description = $('#Description').val();
        //Take today date if the input is not set
        //var dateCreated = $('#DateCreated').val();
        var dateCreated = document.getElementById('DateCreated').value;
        
        //var diffusionDate = $('#DiffusionDate').val();
        var diffusionDate = document.getElementById('DiffusionDate').value;
        //alert(diffusionDate);
        var externalReference = $('#ExternalReference').val();
        var localization = $('#Localization').val();
        var form = $('#Form').val();
        var status = $('#Status').val();
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
        }else if (form == "E") {
            if (validateUrl(localization)) {
                createFile();
            } else errorMsg = "You must enter a valid URL in localization";
        } else createFile();
        /*if (form == "E") {
            //valider URL
            if (validateUrl(localization)) {
                createFile();
            } else errorMsg = "You must enter a valid URL.";
        } else {
            createFile();
        }*/
        //Internal Reference as Basic
        function createFile(){
        if (projectType == "Basic") {
            //SEE HOW MANY DOCTYPE WE HAVE AND TAKE THE NEXT NUMBER

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
function onQueryFailed(sender, args) {
    SP.UI.Notify.addNotification('Request failed. ' + args.get_message() + '\n' +
    args.get_stackTrace(), true);
}
function onQuerySucceeded(sender, args) {
    var listEnumerator = collListItem.getEnumerator();
    //var listInfo = "";
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        localStorage.setItem("documentType", oListItem.get_item('DocumentType'));
        localStorage.setItem("description", oListItem.get_item('CategoryDescription'));
        localStorage.setItem("dateCreated", oListItem.get_item('_DCDateCreated'));
        localStorage.setItem("diffusionDate", oListItem.get_item('DiffusionDate'));
        //localStorage.setItem("dateCreated", new Date(oListItem.get_item('_DCDateCreated')));
        //if (!(oListItem.get_item('DiffusionDate')==null)||(oListItem.get_item('DiffusionDate')==undefined)||(oListItem.get_item('DiffusionDate')=="")){
        //    localStorage.setItem("diffusionDate", new Date(oListItem.get_item('DiffusionDate')));
        //}
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
        //alert("retrieve Project: "+localStorage.getItem('description'));
        document.getElementById('DocumentType').value = localStorage.getItem('documentType');
        document.getElementById('Description').value = localStorage.getItem('description');

        //dateCreated = new Date(localStorage.getItem('dateCreated'));
        document.getElementById('DateCreated').value = localStorage.getItem('dateCreated');
        document.getElementById('DiffusionDate').value = localStorage.getItem('diffusionDate');

        document.getElementById('ExternalReference').value = localStorage.getItem('externalReference');
        document.getElementById('Localization').value = localStorage.getItem('localization');
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
        /*if (oListItem.get_item('Avenant') == null || oListItem.get_item('Avenant') == undefined || oListItem.get_item('Avenant') == "") {
            //if (!(oListItem.get_item('ProjectType') == "Full")) {
            $('.notShow').hide();
        }*/
    }
}


//function edit file

function updateListItem(fileId,internalReference,documentType,description,dateCreated,diffusionDate,externalReference,localization,form,status){
//function updateListItem(ID) {
    var clientContext = new SP.ClientContext.get_current();
   // var clientContext = new SP.ClientContext(siteUrl);
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
    /*
    oListItem.set_item('OrderNumber', orderNumber);
    oListItem.set_item('Version', 1);
    oListItem.set_item('Revision', 1);
    */
    oListItem.update();

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQueryUpdateSucceeded), Function.createDelegate(this, this.onQueryUpdateFailed));
}

function onQueryUpdateSucceeded() {
    var popData = "";
    SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK, popData);
    //alert('Item updated!');
}

function onQueryUpdateFailed(sender, args) {

    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}
 

function padToFour(number) {
    if (number <= 9999) { number = ("000" + number).slice(-4); }
    return number;
}
function padToTwo(number) {
    if (number <= 99) { number = ("0" + number).slice(-2); }
    return number;
}
function validateUrl(url) {
    var re = new RegExp(/^(((ftp|http|https):\/\/)|(\/))(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/);
    return url.match(re);
}