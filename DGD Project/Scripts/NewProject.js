$(document).ready(function () {
    $('.notShow').hide();
    $("#Submit").click(function () {

        //input variables
        var projectName = $('#ProjectName').val();
        var projectCode = $('#ProjectCode').val();
        var avenant = $('#Avenant').val();
        var idAgency = $('#IdAgency').val();
        var projectType = $('#ProjectType').val();
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

        if (projectType == "Full") {
            $('.notShow').show();
            if ((!(projectName == null || projectName == undefined || projectName == ""))
             || (!(projectCode == null || projectCode == undefined || projectCode == ""))
             || (!(avenant == null || avenant == undefined || avenant == ""))
             || (!(idAgency == null || idAgency == undefined || idAgency == ""))) {
                getError();
            } else errorMsg = "You must fill all fields";
            if (errorMsg == "") {
                //alert('create project here');
                createListItem(projectType,projectName, projectCode, avenant, idAgency);
            } 
        } else {
            $('.notShow').hide();
            if (!validateAgency(idAgency)) errorMsg += "Not a correct format for ID Agency (e.g. A9)<br>";
            if (errorMsg == "") {
                //alert('create project here');
                createListItem(projectType,projectName, projectCode, avenant, idAgency);
            }
        }
        $("#errorValidate").html(errorMsg);
    });//click button function ends

});//ready function ends


function createListItem(projectType,projectName, projectCode, avenant, idAgency) {

    //var context = new SP.ClientContext.get_current();
    var clientContext = new SP.ClientContext.get_current();
    var oList = clientContext.get_web().get_lists().getByTitle('Projets');

    var itemCreateInfo = new SP.ListItemCreationInformation();
    this.oListItem = oList.addItem(itemCreateInfo);


    oListItem.set_item('Title', projectName);
    oListItem.set_item('ProjectCode', projectCode);
    oListItem.set_item('Avenant', avenant);
    oListItem.set_item('IdAgency', idAgency);
    oListItem.set_item('ProjectType', projectType);

    oListItem.update();

    clientContext.load(oListItem);

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
}//createListItem ends

function onQuerySucceeded() {
    window.location.href = '../Pages/Default.aspx';
}

function onQueryFailed(sender, args) {

    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}

