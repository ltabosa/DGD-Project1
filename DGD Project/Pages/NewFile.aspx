<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
    <SharePoint:ScriptLink Name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <meta name="WebPartPageExpansion" content="full" />

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />
    <link href="../Content/bootstrap.min.css" rel="Stylesheet" type="text/css" />

    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="../Scripts/Script.js"></script>
    <script type="text/javascript" src="../Scripts/NewFile.js"></script>

    <!-- Add SPService jQuery library for SharePoint Web Services -->
    <script type="text/javascript" src="../Scripts/jquery.SPServices-2014.02.min.js"></script>

</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    New File
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">

    <form action="/" method="post" class="form-horizontal">
        <div class="form-group row">
            <label for="DocumentType" class="col-sm-2">Document Type:</label>
            <div class="col-sm-4">
                <select name="DocumentType" id="DocumentType" class="form-control">
                    <option value="AR" label="Analysis Report">AR</option>
                    <option value="AUD" label="Audit">AUD</option>
                    <option value="BID" label="BID proposal">BID</option>
                    <option value="DB" label="Dashboard">DB</option>
                    <option value="DAN" label="Delivery Acceptance Note">DAN</option>
                    <option value="DS" label="Delivery Support (CD, USB, DVD)">DS</option>
                    <option value="DGD" label="Documentation management dossier">DGD</option>
                    <option value="DOS" label="Dossier">DOS</option>
                    <option value="FD" label="Final Decision">FD</option>
                    <option value="GUI" label="Guideline">GUI</option>
                    <option value="QUO" label="Internal Quotation">QUO</option>
                    <option value="INC" label="Incoming Document">INC</option>

                    <option value="MP" label="Management Plan">MP</option>
                    <option value="MAT" label="Matrix">MAT</option>
                    <option value="MOM" label="Minutes of Meeting">MOM</option>
                    <option value="PLN" label="Planning">PLN</option>
                    <option value="PN" label="Project Note">PN</option>
                    <option value="PR" label="Proofreading Sheet">PR</option>
                    <option value="PUR" label="Purchase Request">PUR</option>
                    <option value="REV" label="Review">REV</option>
                    <option value="SAM" label="Sampling">SAM</option>
                    <option value="DOC" label="Technical Document">DOC</option>
                    <option value="TPL" label="Template">TPL</option>
                    <option value="TR" label="Test Report">TR</option>
                </select>
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
            <label class="col-sm-2" for="ExternalReference">External Reference:</label>
            <div class="col-sm-4">
                <input type="text" name="ExternalReference" id="ExternalReference" value="n/a" class="form-control" />
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2" for="Localization">Localization:</label>
            <div class="col-sm-4">
                <input type="text" name="Localization" id="Localization" class="form-control" />
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2" for="Form">Form:</label>
            <div class="col-sm-4">
                <select name="Form" id="Form" class="form-control">
                    <option value="E" label="Electronic" selected="selected">E</option>
                    <option value="P" label="Paper">P</option>
                </select>
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
       <div class="form-group row">
            <div class="col-sm-4">
                <input type="hidden" name="ProjectName" id="ProjectName" class="form-control" />
            </div>
        </div>
        <div class="form-group row">
            <div class="col-sm-4">
                <input type="hidden" name="ProjectCode" id="ProjectCode" class="form-control" />
            </div>
        </div>
        <div class="form-group row">
            <div class="col-sm-4">
                <input type="hidden" name="Avenant" id="Avenant" class="form-control" />
            </div>
        </div>
        <div class="form-group row">
            <div class="col-sm-4">
                <input type="hidden" name="ProjectType" id="ProjectType" class="form-control" />
            </div>
        </div>
        <div class="form-group row">
            <div class="col-sm-4">
                <input type="hidden" name="IdAgency" id="IdAgency" class="form-control" />
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
