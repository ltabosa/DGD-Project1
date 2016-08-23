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
    <script type="text/javascript" src="../Scripts/EditProject.js"></script>
    <script type="text/javascript" src="../Scripts/Scripts.js"></script>

    <!-- Add SPService jQuery library for SharePoint Web Services -->
    <script type="text/javascript" src="../Scripts/jquery.SPServices-2014.02.min.js"></script>

</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    New Project
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">

    <form action="/" method="post" class="form-horizontal">
        <div class="form-group row">
            <label class="col-sm-2" for="ProjectName">Project Name:</label>
            <div class="col-sm-4">
                <input type="text" name="ProjectName" id="ProjectName" class="form-control" />
            </div>
        </div>

        <div class="form-group row notShow">
            <label class="col-sm-2" for="ProjectCode">Project Code:</label>
            <div class="col-sm-4">
                <input type="number" name="ProjectCode" id="ProjectCode" class="form-control" />
            </div>
        </div>
        <div class="form-group row notShow" >
            <label class="col-sm-2" for="Avenant">Amendment:</label>
            <div class="col-sm-4">
                <input type="number" name="Avenant" id="Avenant" class="form-control" />
            </div>
        </div>    
        <div class="form-group row">
            <label class="col-sm-2" for="IdAgency">Id Agency:</label>
            <div class="col-sm-4">
                <input type="text" name="IdAgency" id="IdAgency" placeholder="e.g. X0" class="form-control" />
            </div>
        </div>
        
        <div class="form-group row">
            <div class="col-sm-4">
                <input type="hidden" name="ProjectType" id="ProjectType" class="form-control" />
            </div>
        </div>
        <!--
        <div class="form-group row">
            <label class="col-sm-2" for="ProjectType">Project Type:</label>
            <div class="col-sm-4">
                <select name="ProjectType" id="ProjectType" class="form-control">
                    <option selected="selected">Basic</option>
                    <option>Full</option>
                    <option>Full Without Project</option>
                </select>
            </div>
        </div>
        -->
        <div id="ProjectTypeDiv"></div>
        <p id="errorValidate" class="bg-danger"></p>

        <input name="Submit" id="Submit" type="button" value="Submit" class="btn btn-default btn-lg" />
        
    </form>
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script type="text/javascript" src="../Scripts/bootstrap.min.js"></script>
</asp:Content>