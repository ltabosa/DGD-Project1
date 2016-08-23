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
    /**
     * Get inputs from submit form.
     */
    $("#Submit").click(function () {
        //input variables
        var error = "";
        internalReference = "";
        documentType = $("#DocumentType option:selected").text();
        description = $('#Description').val();
        dateCreated = document.getElementById('DateCreated').value;
        //Validate the date created
        if (!((dateCreated == undefined) || (dateCreated == null) || (dateCreated == ""))) {
            dateCreated = new Date(dateCreated);
            var yearCreated = dateCreated.getFullYear();
            var monthCreated = dateCreated.getMonth();
            var dayCreated = dateCreated.getDate() + 1;
            dateCreated = new Date(yearCreated, monthCreated, dayCreated);
            var d = new Date();
            if (yearCreated == d.getFullYear()) {
                if (monthCreated == d.getMonth()) {
                    if (dayCreated > d.getDate()) error = "The <b>date created</b> can not be greater than today's date.<br>";
                } else if (monthCreated > d.getMonth()) error = "The <b>date created</b> can not be greater than today's date.<br>";
            } else if (yearCreated > d.getFullYear()) error = "The <b>date created</b> can not be greater than today's date.<br>";
        } else dateCreated = new Date();
        console.log(dateCreated);
        diffusionDate = document.getElementById('DiffusionDate').value;
        //Validate the diffusion date
        if (!((diffusionDate == undefined) || (diffusionDate == null) || (diffusionDate == ""))) {
            diffusionDate = new Date(diffusionDate);
            var yearDiffusion = diffusionDate.getFullYear();
            var monthDiffusion = diffusionDate.getMonth();
            var dayDiffusion = diffusionDate.getDate() + 1;
            diffusionDate = new Date(yearDiffusion, monthDiffusion, dayDiffusion);
            if (yearDiffusion == dateCreated.getFullYear()) {
                if (monthDiffusion == dateCreated.getMonth()) {
                    if (dayDiffusion < dateCreated.getDate()) error += "The <b>diffusion date</b> can not be less than <b>date created</b>.<br>";
                } else if (monthDiffusion < dateCreated.getMonth()) error += "The <b>diffusion date</b> can not be less than <b>date created</b>.<br>";
            } else if (yearDiffusion < dateCreated.getFullYear()) error += "The <b>diffusion date</b> can not be less than date <b>created</b>.<br>";
        }
        console.log(diffusionDate);
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
        //validate description
        if (!description) {
            error += "You must fill the field <b>description</b>.";
        }
        if (error=="") getDocOrderNumber(documentType);
        $("#errorValidate").html(error);
    });//click button function ends

});//ready function ends

/**
 * Creates the list item.
 * @param {number} projectId - The project identifier
 * @param {text} internalReference - The internal reference.
 * @param {text} documentType - Type of the document.
 * @param {text} description - The description.
 * @param {date} dateCreated - The date created.
 * @param {date} diffusionDate - The diffusion date.
 * @param {text} externalReference - The external reference.
 * @param {text} localization - The localization
 * @param {text} form - The form.
 * @param {text} status - The status
 * @param {number} orderNumber - The order number.
 */
function createListItem(projectId, internalReference, documentType, description, dateCreated, diffusionDate, externalReference, localization, form, status, orderNumber) {

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
    if (((diffusionDate == undefined) || (diffusionDate == null) || (diffusionDate == ""))&&(status=="Validated")) {
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
    oListItem.set_item('Version', 01);
    oListItem.set_item('Revision', 01);

    oListItem.update();

    clientContext.load(oListItem);

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQueryCreateSucceeded), Function.createDelegate(this, this.onQueryCreateFailed));
}//createListItem ends
/**
 * On the query create succeeded.
 */
function onQueryCreateSucceeded() {
    window.location.href = '../Pages/File.aspx?ID=' + projectId + '&Title=' + projectTitle;
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
 * Query to get project info from ID.
 */
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
/**
 * On query succeeded.
 * @param {type} sender - The sender.
 * @param {type} args - The arguments.
 */
function onQuerySucceeded(sender, args) {
    var listEnumerator = collListItem.getEnumerator();
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
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
 * Get the next order number.
 * @param {text} documentType - Type of the document.
 */
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
    Function.createDelegate(this, window.onQueryFailed));
}
/**
 * On the query document order succeeded.
 * @param {type} sender - The sender.
 * @param {type} args - The arguments.
 */
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