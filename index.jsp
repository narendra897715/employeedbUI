<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html ng-app="EmpDB">
<head>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js"></script>
 <!-- <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular-animate.min.js"></script> -->
 <script src="Controllers/cdn/angular-animate-1.6.4.js"></script>
 <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular-aria.min.js"></script>
 <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular-messages.min.js"></script>
 <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular-sanitize.min.js"></script>
 <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular-resource.js"></script>
 <script src="https://code.angularjs.org/1.6.4/i18n/angular-locale_en-us.js"></script>
 <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment.js"></script>
 <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.34/pdfmake.js"></script>
 <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.34/vfs_fonts.js"></script>


 <script src="https://ajax.googleapis.com/ajax/libs/angular_material/1.1.1/angular-material.min.js"></script>
 <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/1.0.3/angular-ui-router.js"></script>

<!-- <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular-animate.min.js"></script>
<script src="Controllers/cdn/angular-animate-1.6.4.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular-aria.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular-messages.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular-sanitize.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular-resource.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/angular_material/1.1.6/angular-material.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment.js"></script>
<script src="https://code.angularjs.org/1.6.4/i18n/angular-locale_en-us.js"></script>  
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/1.0.3/angular-ui-router.js"></script>
 -->

<script src="Controllers/cdn/md-data-table.js"></script>
<script src="Controllers/cdn/angular-base64-upload.js"></script>
<script src="https://cdn.jsdelivr.net/npm/angular-file-saver@1.1.3/dist/angular-file-saver.bundle.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/ng-file-upload@12.2.13/dist/ng-file-upload.min.js"></script>
 
<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/angular_material/1.1.1/angular-material.min.css"> </link>
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"> </link>

<link rel="stylesheet" href="Styles/PageStyles.css">
<link rel="stylesheet" href="Styles/md-data-table.css">

<script src="Controllers/MainControl.js"></script>
<script src="Directives/ScreenDirective.js"></script>
<script src="Services/services.js"></script>
<script src="Directives/EmpDBDirectives.js"></script>


<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"> -->
<link rel="shortcut icon" href="Assets/favicon.png" />
<title>Employee DB</title>
</head>
<body ng-controller="EmpDBController" ng-cloak>
<div ui-view class="layout-column layout-fill flex"></div>
</body>
</html>