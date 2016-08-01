$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', retrieveDGDs);
    fileId = GetUrlKeyValue('ID', false);
    
});//ready function ends
function retrieveDGDs() {
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
                '<FieldRef Name=\'CategoryDescription\' />' +
                '<FieldRef Name=\'_DCDateCreated\' />' +
                '<FieldRef Name=\'DiffusionDate\' />' +
                '<FieldRef Name=\'ExternalReference\' />' +
                '<FieldRef Name=\'Location\' />' +
                '<FieldRef Name=\'Form\' />' +
                '<FieldRef Name=\'_Status\' />' +
                '<FieldRef Name=\'Project1\' />' +
                '<FieldRef Name=\'ProjectType\' />' +
                '<FieldRef Name=\'IdAgency\' />' +
            '</ViewFields>' +
        '</View>');
    window.collListItem = oList.getItems(camlQuery);
    context.load(collListItem, 'Include(IdAgency, ProjectType, Project1,Id, InternalReference,DocumentType,CategoryDescription,_DCDateCreated,DiffusionDate,ExternalReference,Location,Form,_Status)');
    context.executeQueryAsync(Function.createDelegate(this, window.onQuerySucceeded),
    Function.createDelegate(this, window.onQueryFailed));
}
function onQueryFailed(sender, args) {
    SP.UI.Notify.addNotification('Request failed. ' + args.get_message() + '\n' +
    args.get_stackTrace(), true);
}
function onQuerySucceeded(sender, args) {
    var listEnumerator = collListItem.getEnumerator();
    var listInfo = "";
       
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        var listProjectType = "";
        listInfo +=
          '<form action="/" method="post" class="form-horizontal">' +
            '<div class="form-group row">' +
            '<label for="DocumentType" class="col-sm-2">Document Type:</label>' +
            '<div class="col-sm-4">' +
               '<select name="DocumentType" id="DocumentType" class="form-control" >' +
                  '<option>' + oListItem.get_item('DocumentType') + '</option>' +
                  '<option value="AR" label="Analysis Report">AR</option>' +
                    '<option value="AUD" label="Audit">AUD</option>' +
                    '<option value="BID" label="BID proposal">BID</option>' +
                    '<option value="DB" label="Dashboard">DB</option>' +
                    '<option value="DAN" label="Delivery Acceptance Note">DAN</option>' +
                    '<option value="DS" label="Delivery Support (CD, USB, DVD)">DS</option>' +
                    '<option value="DGD" label="Documentation management dossier">DGD</option>' +
                    '<option value="DOS" label="Dossier">DOS</option>' +
                    '<option value="FD" label="Final Decision">FD</option>' +
                    '<option value="GUI" label="Guideline">GUI</option>' +
                    '<option value="QUO" label="Internal Quotation">QUO</option>' +
                    '<option value="INC" label="Incoming Document">INC</option>' +

                    '<option value="MP" label="Management Plan">MP</option>' +
                    '<option value="MAT" label="Matrix">MAT</option>' +
                    '<option value="MOM" label="Minutes of Meeting">MOM</option>' +
                    '<option value="PLN" label="Planning">PLN</option>' +
                    '<option value="PN" label="Project Note">PN</option>' +
                    '<option value="PR" label="Proofreading Sheet">PR</option>' +
                    '<option value="PUR" label="Purchase Request">PUR</option>' +
                    '<option value="REV" label="Review">REV</option>' +
                    '<option value="SAM" label="Sampling">SAM</option>' +
                    '<option value="DOC" label="Technical Document">DOC</option>' +
                    '<option value="TPL" label="Template">TPL</option>' +
                    '<option value="TR" label="Test Report">TR</option>' +
                '</select>' +
            '</div>' +
        '</div>' +
        '<div class="form-group row">' +
            '<label class="col-sm-2" for="Description">Description:</label>' +
            '<div class="col-sm-4">' +
                '<input type="text" name="Description" id="Description" class="form-control" value="' + oListItem.get_item('CategoryDescription') + '"/>' +
            '</div>' +
        '</div>' +
        '<div class="form-group row">' +
            '<label class="col-sm-2" for="DateCreated">Date Created:</label>' +
            '<div class="col-sm-4">' +
                '<input type="date" name="DateCreated" id="DateCreated" class="form-control" value="' + oListItem.get_item('_DCDateCreated') + '"/>' +
            '</div>' +
        '</div>' +
        '<div class="form-group row">' +
            '<label class="col-sm-2" for="DiffusionDate">Diffusion Date:</label>' +
            '<div class="col-sm-4">' +
                '<input type="date" name="DiffusionDate" id="DiffusionDate" class="form-control" value="' + oListItem.get_item('DiffusionDate') + '"/>' +
            '</div>' +
        '</div>' +
        '<div class="form-group row">' +
            '<label class="col-sm-2" for="ExternalReference">External Reference:</label>' +
            '<div class="col-sm-4">' +
                '<input type="text" name="ExternalReference" id="ExternalReference" value="n/a" class="form-control" value="' + oListItem.get_item('ExternalReference') + '" />' +
            '</div>' +
        '</div>' +
        '<div class="form-group row">' +
            '<label class="col-sm-2" for="Localization">Localization:</label>' +
            '<div class="col-sm-4">' +
                '<input type="text" name="Localization" id="Localization" class="form-control" value="' + oListItem.get_item('Location') + '"/>' +
            '</div>' +
        '</div>' +
        '<div class="form-group row">' +
            '<label class="col-sm-2" for="Form">Form:</label>' +
            '<div class="col-sm-4">' +
                '<select name="Form" id="Form" class="form-control" >' +
                    '<option>' + oListItem.get_item('Form') + '</option>' +
                    '<option value="E" label="Electronic">E</option>' +
                    '<option value="P" label="Paper">P</option>' +
                '</select>' +
            '</div>' +
        '</div>' +
        '<div class="form-group row">' +
            '<label class="col-sm-2" for="Status">Status:</label>' +
            '<div class="col-sm-4">' +
                '<select name="Status" id="Status" class="form-control" >' +
                     '<option>' + oListItem.get_item('_Status') + '</option>' +
                    '<option>In Progress</option>' +
                    '<option>Validated</option>' +
                    '<option>Archived</option>' +
                    '<option>Deleted</option>' +
                '</select>' +
            '</div>' +
        '</div>' +
        '<div class="form-group row">' +
            '<label class="col-sm-2" for="IdAgency">Id Agency:</label>' +
            '<div class="col-sm-4">' +
                '<input type="text" name="IdAgency" id="IdAgency" placeholder="e.g. X0" class="form-control" value="' + oListItem.get_item('IdAgency') + '"/>' +
            '</div>' +
        '</div>' +
        '<div class="form-group row">' +
        '<label class="col-sm-2" for="ProjectType">Project Type:</label>' +
        '<div class="col-sm-4">' +
            '<select name="ProjectType" id="ProjectType" class="form-control" >' +
                '<option>' + oListItem.get_item('ProjectType') + '</option>' +
                '<option>Basic</option>' +
                '<option>Full</option>' +
                '<option>Full Without Project</option>' +
            '</select>' +
        '</div>' +
        '</div>';
        //Check what is the type of project
        if (oListItem.get_item('ProjectType') == 'Full') {
            listProjectType += '<div class="form-group row"><label class="col-sm-2" for="Type">Type:</label><div class="col-sm-4"><input type="text" name="Type" id="Type" placeholder="0000" class="form-control" /></div></div>';
            listProjectType += '<div class="form-group row"><label class="col-sm-2" for="Project">Project:</label><div class="col-sm-4"><input type="text" name="Project" id="Project" placeholder="00" class="form-control" /></div></div>';
        } else if (oListItem.get_item('ProjectType') == 'Full Without Project') {
            listProjectType += '<div class="form-group row"><label class="col-sm-2" for="Type">Type:</label><div class="col-sm-4"><input class="form-control" type="text" name="Type" id="Type" placeholder="0000" /></div></div>';
        }
        listInfo += '<div id="ProjectTypeDiv"></div>' +
        '<p id="errorValidate" class="bg-danger"></p>'+
         '<input type="hidden" name="projectID" id="projectID" value="' + oListItem.get_item('Project1') + '"/>' +
         '<input type="hidden" name="ID" id="ID" value="' + oListItem.get_id() + '"/>' +
        '<input name="Submit" id="Submit" type="button" value="Submit" class="btn btn-default btn-lg" onclick="return updateFile();"/>' +
        
        '</form>';
          }
    
    $("#results").html(listInfo);
    $("#ProjectTypeDiv").html(listProjectType);
    //$("#errorValidate").html(errorMsg);
    
}

//function update file
//$("#Submit").click(function () {
function updateFile(){
    projectId = $('#projectID').val();
    //input variables
    var internalReference = "";
    //get Id, if not exists return to projects page
    //var projectId = GetUrlKeyValue('ID', false);
    //teste

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
    var ID = $('#ID').val();
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
            errorMsg += "Not a correct format for ID Agency (e.g. A9)<br>";
        }
        //Validate Type
        function validateType(type) {
            var re = new RegExp(/^[0-9]{4}$/);
            return type.match(re);
        }
        if (!(type == undefined || type == null || type == "")) {
            if (!validateType(type)) {
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
                errorMsg += "Not a correct project number (e.g. 00)";
            }
        }
    }
    //take the project type and make decision
    // if (errorMsg=="")        //function formSubmited() {
    if (projectType == "Basic") {
        listProjectType = "";
        getError();
        //build the Internal reference
        //[doc type]-[project Id]-[agency]-[doc order number]-[version]-[revision]
        if (errorMsg == "") {
            internalReference = documentType + "-" + projectId + "-" + idAgency + "-0000-00-00";
            //alert(internalReference + ' ' + documentType + ' ' + description + ' ' + dateCreated + ' ' + diffusionDate + ' ' + externalReference + ' ' + localization + ' ' + form + ' ' + status + ' ' + idAgency + ' ' + projectType);
            updateListItem(ID);
            //createListItem(project, type, projectId, internalReference, documentType, description, dateCreated, diffusionDate, externalReference, localization, form, status, idAgency, projectType);
        }
    } else if (projectType == "Full") {
        //listProjectType += '<div class="form-group row"><label class="col-sm-2" for="Type">Type:</label><div class="col-sm-4"><input type="text" name="Type" id="Type" placeholder="0000" class="form-control" /></div></div>';
        //listProjectType += '<div class="form-group row"><label class="col-sm-2" for="Project">Project:</label><div class="col-sm-4"><input type="text" name="Project" id="Project" placeholder="00" class="form-control" /></div></div>';
        if ((!(type == undefined || type == null || type == "")) && (!(project == undefined || project == null || project == ""))) {
            //build the Internal reference
            //[doc type]-[project Id]-[type]-[project]-[agency]-[doc order number]-[version]-[revision]
            getError();
            if (errorMsg == "") {
                internalReference = documentType + "-" + projectId + "-" + type + "-" + project + "-" + idAgency + "-0000-00-00";
                //call the function to add in list
                updateListItem(ID);
                //alert("submit full");
                //createListItem(project, type, projectId, internalReference, documentType, description, dateCreated, diffusionDate, externalReference, localization, form, status, idAgency, projectType);
            }
        } else errorMsg = "You must fill <b>project</b> and <b>type</b> field";

        //document.getElementById("page1").setAttribute("style","display:none");

        //alert("full "+type+" "+project);
    } else {
        //listProjectType += '<div class="form-group row"><label class="col-sm-2" for="Type">Type:</label><div class="col-sm-4"><input class="form-control" type="text" name="Type" id="Type" placeholder="0000" /></div></div>';
        // alert("full without project "+type);
        if (!(type == undefined || type == null || type == "")) {
            //build the Internal reference
            //[doc type]-[project Id]-[type]-[agency]-[doc order number]-[version]-[revision]
            getError();
            if (errorMsg == "") {
                internalReference = documentType + "-" + projectId + "-" + type + "-" + idAgency + "-0000-00-00";
                //call the function to add in list
                //alert("submit full without project");
                updateListItem(ID);
                //createListItem(project, type, projectId, internalReference, documentType, description, dateCreated, diffusionDate, externalReference, localization, form, status, idAgency, projectType);
            }
        } else errorMsg = "You must fill <b>type</b> field";
    }
    //}
    //$("#ProjectTypeDiv").html(listProjectType);
    //$("#errorValidate").html(errorMsg);
    if (errorMsg != "") {
        alert(errorMsg);
    } 
}//click button function ends

/*

function updateListItem(ID) {
    var clientContext = new SP.ClientContext.get_current();
   // var clientContext = new SP.ClientContext(siteUrl);
    var oList = clientContext.get_web().get_lists().getByTitle('File');

    this.oListItem = oList.getItemById(ID);

    oListItem.set_item('Location', 'My Updated Title');

    oListItem.update();

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
}

function onQuerySucceeded() {

    alert('Item updated!');
}

function onQueryFailed(sender, args) {

    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}
 

*/