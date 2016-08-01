$(document).ready(function () {
    //get Id, if not exists return to projects page
    projectId = GetUrlKeyValue('ID', false);
    projectTitle = GetUrlKeyValue('Title', false);
    //prevent
    if (projectId == undefined || projectId == null || projectId == "") {
        window.location.href = '../Pages/Default.aspx';
    }
    $("#Submit").click(function () {

        //input variables
        var internalReference = "";
        //get Id, if not exists return to projects page
        //var projectId = GetUrlKeyValue('ID', false);

        var documentType = $("#DocumentType option:selected").text();
        var description = $('#Description').val();
        //Take today date if the input is not set
        var dateCreated = $('#DateCreated').val();
        if (dateCreated == undefined || dateCreated == null || dateCreated == "") {
            //dateCreated = new Date().toISOString().slice(0, 10);
            dateCreated = new Date();
        }
        var diffusionDate = $('#DiffusionDate').val();
        var externalReference = $('#ExternalReference').val();
        var localization = $('#Localization').val();
        var form = $('#Form').val();
        var status = $('#Status').val();
        var idAgency = $('#IdAgency').val();
        var projectType = $('#ProjectType').val();
        var type = $('#Type').val();
        var project = $('#Project').val();
        var listProjectType = "";
        errorMsg = "";

        //Validate form 
        //Validate ID Agency
        function getError() {
            //errorMsg = "";
            function validateAgency(idAgency) {
                var re = new RegExp(/^[A-Z][0-9]$/);
                return idAgency.match(re);
            }
            if (!validateAgency(idAgency)) {
                //formSubmited();
                //} else {
                errorMsg += "Not a correct format for ID Agency (e.g. A9)<br>";
            } 
            //Validate Type
            function validateType(type) {
                var re = new RegExp(/^[0-9]{4}$/);
                return type.match(re);
            }
            if (!(type == undefined || type == null || type == "")) {
                if (!validateType(type)) {
                    //formSubmited();
                    //} else {
                    errorMsg += "Not a correct project type (e.g. 0000)<br>";
                } 
            }
            //Validate Project Number
            function validateProject(project) {
                var re = new RegExp(/^[0-9]{2}$/);
                return project.match(re);
            }
            if (!(project == undefined || project == null || project == "")) {
                if (!validateProject(project)) {
                    // formSubmited();
                    //} else {
                    errorMsg += "Not a correct project number (e.g. 00)";
                } 
            }
        }
        //take the project type and make decision
        // if (errorMsg==""){
        //function formSubmited() {
        if (projectType == "Basic") {
            listProjectType = "";
            getError();
            //build the Internal reference
            //[doc type]-[project Id]-[agency]-[doc order number]-[version]-[revision]
            if (errorMsg == "") {
                internalReference = documentType + "-" + projectId + "-" + idAgency + "-0000-00-00";
                //alert(internalReference + ' ' + documentType + ' ' + description + ' ' + dateCreated + ' ' + diffusionDate + ' ' + externalReference + ' ' + localization + ' ' + form + ' ' + status + ' ' + idAgency + ' ' + projectType);
                createListItem(project, type, projectId, internalReference, documentType, description, dateCreated, diffusionDate, externalReference, localization, form, status, idAgency, projectType);
            }
        } else if (projectType == "Full") {
            listProjectType += '<div class="form-group row"><label class="col-sm-2" for="Type">Type:</label><div class="col-sm-4"><input type="text" name="Type" id="Type" placeholder="0000" class="form-control" /></div></div>';
            listProjectType += '<div class="form-group row"><label class="col-sm-2" for="Project">Project:</label><div class="col-sm-4"><input type="text" name="Project" id="Project" placeholder="00" class="form-control" /></div></div>';
            if ((!(type == undefined || type == null || type == "")) && (!(project == undefined || project == null || project == ""))) {
                //build the Internal reference
                //[doc type]-[project Id]-[type]-[project]-[agency]-[doc order number]-[version]-[revision]
                getError();
                if (errorMsg == "") {
                    internalReference = documentType + "-" + projectId + "-" + type + "-" + project + "-" + idAgency + "-0000-00-00";
                    //call the function to add in list
                    //alert("submit full");
                    createListItem(project, type, projectId, internalReference, documentType, description, dateCreated, diffusionDate, externalReference, localization, form, status, idAgency, projectType);
                }
            } else errorMsg = "You must fill <b>project</b> and <b>type</b> field";

            //document.getElementById("page1").setAttribute("style","display:none");

            //alert("full "+type+" "+project);
        } else {
            listProjectType += '<div class="form-group row"><label class="col-sm-2" for="Type">Type:</label><div class="col-sm-4"><input class="form-control" type="text" name="Type" id="Type" placeholder="0000" /></div></div>';
            // alert("full without project "+type);
            if (!(type == undefined || type == null || type == "")) {
                //build the Internal reference
                //[doc type]-[project Id]-[type]-[agency]-[doc order number]-[version]-[revision]
                getError();
                if (errorMsg == "") {
                    internalReference = documentType + "-" + projectId + "-" + type + "-" + idAgency + "-0000-00-00";
                    //call the function to add in list
                    // alert("submit full without project");
                    createListItem(project, type, projectId, internalReference, documentType, description, dateCreated, diffusionDate, externalReference, localization, form, status, idAgency, projectType);
                }
            } else errorMsg = "You must fill <b>type</b> field";
        }
        //}
        $("#ProjectTypeDiv").html(listProjectType);
        $("#errorValidate").html(errorMsg);
    });//click button function ends
    
});//ready function ends


function createListItem(project, type, projectId, internalReference, documentType, description, dateCreated, diffusionDate, externalReference, localization, form, status, idAgency, projectType) {

    //var context = new SP.ClientContext.get_current();
    var clientContext = new SP.ClientContext.get_current();
    var oList = clientContext.get_web().get_lists().getByTitle('File');

    var itemCreateInfo = new SP.ListItemCreationInformation();
    this.oListItem = oList.addItem(itemCreateInfo);


    oListItem.set_item('Project1', projectId);
    oListItem.set_item('DocumentType', documentType);
    oListItem.set_item('CategoryDescription', description);
    oListItem.set_item('_DCDateCreated', dateCreated);
    if (!diffusionDate == undefined) {
        oListItem.set_item('DiffusionDate', diffusionDate);
    }
    oListItem.set_item('ExternalReference', externalReference);
    oListItem.set_item('Location', localization);
    oListItem.set_item('Form', form);
    oListItem.set_item('_Status', status);
    oListItem.set_item('IdAgency', idAgency);
    oListItem.set_item('ProjectType', projectType);
    oListItem.set_item('OrderNumber', 1);
    oListItem.set_item('Version', 1);
    oListItem.set_item('Revision', 1);
    if (!project == undefined) {
        oListItem.set_item('Project', project);
    }
    if (!type == undefined) {
        oListItem.set_item('Type', type);
    }
    oListItem.set_item('InternalReference', internalReference);

    oListItem.update();

    clientContext.load(oListItem);

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
}//createListItem ends

function onQuerySucceeded() {
    window.location.href = '../Pages/File.aspx?ID=' + projectId + '&Title=' + projectTitle;
    //alert('Item created: ' + oListItem.get_id());
}

function onQueryFailed(sender, args) {

    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}

