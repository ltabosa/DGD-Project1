<%@ Page language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
    <SharePoint:ScriptLink Name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <meta name="WebPartPageExpansion" content="full" />

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />
    <link href="../Content/bootstrap.min.css" rel="Stylesheet" type="text/css" />

    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="../Scripts/CopyFile.js"></script>

    <!-- Add SPService jQuery library for SharePoint Web Services -->
    <script type="text/javascript" src="../Scripts/jquery.SPServices-2014.02.min.js"></script>
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Copy File
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
     <form action="/" method="post" class="form-horizontal">
        
         <div class="form-group row">
             <label class="col-sm-2" for="versionRevision">What do you want to change?</label>
             <div class="col-sm-4">
                <label class="radio-inline"><input type="radio" name="versionRevision" value="version"/>Version</label>
                <label class="radio-inline"><input type="radio" name="versionRevision" value="revision"/>Revision</label>
            </div>
         </div>
        <div class="form-group row">
            <label class="col-sm-2" for="Description">Description:</label>
            <div class="col-sm-4">
                <input type="text" name="Description" id="Description" class="form-control" />
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2" for="DateCreated">Date Created:</label>
            <div class="col-sm-4">
                <input type="date" name="DateCreated" id="DateCreated" class="form-control" />
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2" for="DiffusionDate">Diffusion Date:</label>
            <div class="col-sm-4">
                <input type="date" name="DiffusionDate" id="DiffusionDate" class="form-control" />
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2" for="Localization">Localization:</label>
            <div class="col-sm-4">
                <input type="text" name="Localization" id="Localization" class="form-control" />
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2" for="Status">Status:</label>
            <div class="col-sm-4">
                <select name="Status" id="Status" class="form-control">
                    <option selected="selected">In Progress</option>
                    <option>Validated</option>
                    <option>Archived</option>
                    <option>Deleted</option>
                </select>
            </div>
        </div>
                <input type="hidden" name="DocumentType" id="DocumentType" class="form-control" />
                <input type="hidden" name="ExternalReference" id="ExternalReference" value="n/a" class="form-control" />
                <input type="hidden" name="Form" id="Form" class="form-control" />
                <input type="hidden" name="OrderNumber" id="OrderNumber" class="form-control" />
                <input type="hidden" name="Version" id="Version" class="form-control" />
                <input type="hidden" name="Revision" id="Revision" class="form-control" />
                <input type="hidden" name="ProjectID" id="ProjectID" class="form-control" />
                <input type="hidden" name="ProjectName" id="ProjectName" class="form-control" />
                <input type="hidden" name="ProjectCode" id="ProjectCode" class="form-control" />
                <input type="hidden" name="Avenant" id="Avenant" class="form-control" />
                <input type="hidden" name="ProjectType" id="ProjectType" class="form-control" />
                <input type="hidden" name="IdAgency" id="IdAgency" class="form-control" />
        <p id="errorValidate" class="bg-danger"></p>  
        <input name="Submit" id="Submit" type="button" value="Submit" class="btn btn-default btn-lg" />
        
    </form>
   
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script type="text/javascript" src="../Scripts/bootstrap.min.js"></script>
</asp:Content>


