$(document).ready(function () {
    //get Id, if not exists return to projects page
    projectId = GetUrlKeyValue('ID', false);
    projectTitle = GetUrlKeyValue('Title', false);
    //prevent add without project ID
    if (projectId == undefined || projectId == null || projectId == "") {
        window.location.href = '../Pages/Default.aspx';
    } else {
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', retrieveDGD);
    }
    $("#Submit").click(function () {

        //input variables
        internalReference = "";

        documentType = $("#DocumentType option:selected").text();
        description = $('#Description').val();
        //Take today date if the input is not set
        //dateCreated = $('#DateCreated').val();
        dateCreated = document.getElementById('DateCreated').value;
        //diffusionDate = $('#DiffusionDate').val();
        diffusionDate = document.getElementById('DiffusionDate').value;
        externalReference = $('#ExternalReference').val();
        localization = $('#Localization').val();
        form = $('#Form').val();
        status = $('#Status').val();
        idAgency = $('#IdAgency').val();
        projectType = $('#ProjectType').val();
        avenant = $('#Avenant').val();
        projectCode = $('#ProjectCode').val();
        projectName = $('#ProjectName').val();
        revision = 1;
        version = 1;
        getDocOrderNumber(documentType);
        //alert(orderNumber);


    });//click button function ends

});//ready function ends


function createListItem(projectId, internalReference, documentType, description, dateCreated, diffusionDate, externalReference, localization, form, status, orderNumber) {

    //var context = new SP.ClientContext.get_current();
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
    /*if (((diffusionDate == undefined) || (diffusionDate == null) || (diffusionDate == ""))&&(status=="Validated")) {
        diffusionDate = new Date();
    }*/
    if (!((diffusionDate == undefined) || (diffusionDate == null) || (diffusionDate == ""))) {
        oListItem.set_item('DiffusionDate', diffusionDate);
    }
    oListItem.set_item('ExternalReference', externalReference);
    oListItem.set_item('Location', localization);
    oListItem.set_item('Form', form);
    oListItem.set_item('_Status', status);
    oListItem.set_item('OrderNumber', orderNumber);
    oListItem.set_item('Version', 01);
    oListItem.set_item('Revision', 01);

    oListItem.update();

    clientContext.load(oListItem);

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQueryCreateSucceeded), Function.createDelegate(this, this.onQueryCreateFailed));
}//createListItem ends

function onQueryCreateSucceeded() {
    window.location.href = '../Pages/File.aspx?ID=' + projectId + '&Title=' + projectTitle;
    //alert('Item created: ' + oListItem.get_id());
}

function onQueryCreateFailed(sender, args) {

    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}

function retrieveDGD() {
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
    context.executeQueryAsync(Function.createDelegate(this, window.onQuerySucceeded),
    Function.createDelegate(this, window.onQueryFailed));
}
function onQueryFailed(sender, args) {
    SP.UI.Notify.addNotification('Request failed. ' + args.get_message() + '\n' +
    args.get_stackTrace(), true);
}
function onQuerySucceeded(sender, args) {
    var listEnumerator = collListItem.getEnumerator();
    //var listInfo ="";
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        document.getElementById('ProjectName').value = oListItem.get_item('Title');
        document.getElementById('ProjectCode').value = oListItem.get_item('ProjectCode');
        document.getElementById('Avenant').value = oListItem.get_item('Avenant');
        document.getElementById('IdAgency').value = oListItem.get_item('IdAgency');
        document.getElementById('ProjectType').value = oListItem.get_item('ProjectType');
        //if (oListItem.get_item('Avenant') == null || oListItem.get_item('Avenant') == undefined || oListItem.get_item('Avenant') == "") {
        //if (!(oListItem.get_item('ProjectType') == "Full")) {
        //$('.notShow').hide();
        //}
    }
}

function getDocOrderNumber(documentType) {
    var context = new SP.ClientContext.get_current();
    var oList = context.get_web().get_lists().getByTitle('File');
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(
        '<View>' +
            '<Query>' +
                '<Where>' +
                    '<And>' +
                        '<Eq><FieldRef Name=\'Project1\'/><Value Type=\'Number\'>' + projectId + '</Value></Eq>' +
                        '<Eq><FieldRef Name=\'DocumentType\'/><Value Type=\'Text\'>' + documentType + '</Value></Eq>' +
                    '</And>' +
                '</Where>' +
            '</Query>' +
            '<ViewFields>' +
                '<FieldRef Name=\'InternalReference\' />' +
            '</ViewFields>' +
        '</View>');
    window.collListItem = oList.getItems(camlQuery);
    context.load(collListItem, 'Include(InternalReference)');
    context.executeQueryAsync(Function.createDelegate(this, window.onQueryDocOrderSucceeded),
    Function.createDelegate(this, window.onQueryDocOrderFailed));
}
function onQueryDocOrderFailed(sender, args) {
    SP.UI.Notify.addNotification('Request Doc Order failed. ' + args.get_message() + '\n' +
    args.get_stackTrace(), true);
}
function onQueryDocOrderSucceeded(sender, args) {
    var count = window.collListItem.get_count();
    errorMsg = "";
    //SEE HOW MANY DOCTYPE WE HAVE AND TAKE THE NEXT NUMBER
    if (count > 0) {
        orderNumber = count + 1;
    } else { orderNumber = 1; }

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
    //Internal Reference as Basic
    function createFile() {
        if (projectType == "Basic") {
            internalReference = idAgency + "-" + padToFour(orderNumber) + "-" + padToTwo(version) + "-" + padToTwo(revision);
            createListItem(projectId, internalReference, documentType, description, dateCreated, diffusionDate, externalReference, localization, form, status, orderNumber);
        } else if (projectType == "Full") {
            internalReference = documentType + "-" + padToFour(projectCode) + "-" + padToTwo(avenant) + "-" + idAgency + "-" + padToFour(orderNumber) + "-" + padToTwo(version) + "-" + padToTwo(revision);
            createListItem(projectId, internalReference, documentType, description, dateCreated, diffusionDate, externalReference, localization, form, status, orderNumber);
            //Internal Reference as Full Without Project 
        } else {
            internalReference = documentType + "-" + idAgency + "-" + padToFour(orderNumber) + "-" + padToTwo(version) + "-" + padToTwo(revision);
            createListItem(projectId, internalReference, documentType, description, dateCreated, diffusionDate, externalReference, localization, form, status, orderNumber);
        }
    }
    $("#errorValidate").html(errorMsg);
}

function padToFour(number) {
    if (number <= 9999) { number = ("000" + number).slice(-4); }
    return number;
}
function padToTwo(number) {
    if (number <= 99) { number = ("0" + number).slice(-2); }
    return number;
}
/**
* Shape is an abstract base class. It is defined simply
* to have something to inherit from for geometric 
* subclasses
* @constructor
*/
function validateUrl(url) {
    var re = new RegExp(/^(((ftp|http|https):\/\/)|(\/))(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/);
    return url.match(re);
}