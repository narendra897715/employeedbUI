
	var EmpDBServices = angular.module('EmpDB.Services', []);
	
	EmpDBServices.factory('httpPreConfig', ['$http', '$rootScope', function ($http, $rootScope) {
		$http.defaults.transformRequest.push(function (data) {
			$rootScope.loadingPanel = true;
			return data;
		});
		$http.defaults.transformResponse.push(function (data) {
			$rootScope.loadingPanel = false;
			return data;
		})
		return $http;
	}])
	.factory("notification", function ($mdDialog, $q) {
		return {
			notify: function (Msg) {
				var defer = $q.defer();
				$mdDialog.show({
					clickOutsideToClose: false,
					skipHide: true,
					template: '<md-dialog flex="40" flex-md="60" flex-xs="100" flex-sm="100" aria-label="confirmation" md-theme="meritus">' +
					'  <md-dialog-content class="md-dialog-content"><h2 class="md-title" style="text-align:left; padding: 10px"><p ng-bind="Msg" style="margin: 0"></p></h2></md-dialog-content>' +
					'  <md-dialog-actions layout="row" layout-align="end center">' +
					'    <md-button ng-click="closeDialog()" type="button" class="meritus-btn md-raised" style="padding: 0 !important;">OK</md-button>' +
					'  </md-dialog-actions>' +
					'</md-dialog>',
					controller: function DialogController($mdDialog, $scope) {
						$scope.Msg = Msg;
						$scope.closeDialog = function () { $mdDialog.hide(); }
					}
				});	
				return defer.promise;
			}
		};
	})
	.factory("NoAccessNotification", function ($mdDialog, $q) {
		return {
			notify: function (Msg) {
				var defer = $q.defer();
				$mdDialog.show({
					clickOutsideToClose: false,
					skipHide: true,
					template: '<md-dialog flex="30" flex-md="60" flex-xs="100" flex-sm="100" aria-label="confirmation" md-theme="meritus">' +
					'  <md-dialog-content class="md-dialog-content" style="padding: 0px;"><h2 class="md-title layout-padding"  >'+
					'  <span class="flex layout-row layout-align-start-center">'+
					'  <span class="layout-row layout-align-start-center"><img ng-src="Assets/error.gif" style="height:40px;margin-right:8px;"></span>'+
					'  <span style="margin: 0;font-family: segoe ui !important;font-size: 16px;">Warning</span>'+
					'  </span>'+
					'  <p ng-bind="Msg" class="layout-row layout-align-center-center" style="margin: 0;font-family: segoe ui !important;font-size: 16px;"></p></h2></md-dialog-content>' +
					'  <md-dialog-actions layout="row" layout-align="end center">' +
					'    <md-button ng-click="closeDialog()" type="button" class="meritus-btn md-raised" style="padding: 0 !important;">OK</md-button>' +
					'  </md-dialog-actions>' +
					'</md-dialog>',
					controller: function DialogController($mdDialog, $scope) {
						$scope.Msg = 'You do not have access to this page';
			        	$scope.closeDialog = function() { $mdDialog.hide(); }
					}
				});	
				return defer.promise;
			}
		};
	})
	.factory("notificationWithNote", function ($mdDialog, $q) {
		return {
			notify: function (Msg,Note) {
				var defer = $q.defer();
				$mdDialog.show({
					clickOutsideToClose: false,
					skipHide: true,
					template: '<md-dialog flex="40" flex-md="60" flex-xs="100" flex-sm="100" aria-label="confirmation" md-theme="meritus">' +
					'  <md-dialog-content class="md-dialog-content"><h2 class="md-title" style="text-align:left; padding: 10px"><p ng-bind="Msg" style="margin: 0"></p></h2>'+
					'  </md-dialog-content>' +
					'  <md-dialog-actions layout="row" layout-align="space-between center" class="md-dialog-content" style="padding-top:0px; padding-bottom:0px">' +
					'    <h2 class="md-title" style= "font-size: 14px; padding:0px 10px; text-align:left"><div layout="row"> <span style="font-weight:bold;color:red">Note:&nbsp;</span><p ng-bind="Note" style="margin: 0;font-size: 14px;color:red"></p></div></h2> '+
					'    <div><md-button ng-click="closeDialog()" type="button" class="meritus-btn md-raised" style="padding: 0 !important;">OK</md-button></div>' +
					'  </md-dialog-actions>' +
					'</md-dialog>',
					controller: function DialogController($mdDialog, $scope) {
						$scope.Msg = Msg;
						$scope.Note = Note;
						$scope.closeDialog = function () { $mdDialog.hide(); }
					}
				});	
				return defer.promise;
			}
		};
	});
	EmpDBServices.service('BusinessLogic', ['$http', '$q', '$location', '$window', 'httpPreConfig', '$rootScope',function ($http, $q, $location, $window, httpPreConfig, $rootScope) {
		var deferObject,
			BusinessLogic = {
				GetMethod: function (URL) {
					   var promise = httpPreConfig({ method: 'GET', url:  URL, headers: { 'Content-Type': 'application/json', 'token': $window.localStorage.getItem("AuthenticationToken") } }), deferObject = deferObject || $q.defer();
						promise.then(function (answer) {
							deferObject.resolve(answer.data);
						}, function (reason) { 
							deferObject.reject(reason);
						});
					return deferObject.promise;
				},
				PostMethod: function (URL, PostData) {
					    var promise = httpPreConfig({ method: 'POST', url: URL, data: PostData , headers: { 'Content-Type': 'application/json', 'token': $window.localStorage.getItem("AuthenticationToken") } }), deferObject = deferObject || $q.defer();
						promise.then(function (answer) {
							deferObject.resolve(answer);
						}, function (reason) { 
							deferObject.reject(reason);
						});
					return deferObject.promise;
				}
			};
		return BusinessLogic;
	}]);
	EmpDBServices.service('BusinessLogic1', ['$http', '$q', '$location', '$window', 'httpPreConfig', '$rootScope',function ($http, $q, $location, $window, httpPreConfig, $rootScope) {
		var deferObject,
			BusinessLogic = {
				GetMethod: function (URL) {
					   var promise = httpPreConfig({ method: 'GET', url:  $rootScope.ApplicationURL+'/Authentication/' + URL, headers: { 'Content-Type': 'application/json', 'token': $window.localStorage.getItem("AuthenticationToken") } }), deferObject = deferObject || $q.defer();
						promise.then(function (answer) {
							deferObject.resolve(answer.data);
						}, function (reason) { 
							$rootScope.LoadingShow = false; 
							if (reason.status == 400 || reason.status == 412 || reason.status == 403 || reason.status == 404) { $window.localStorage.removeItem("AuthenticationToken"); $window.location.href = $rootScope.ApplicationURL+'/Authentication/#/'; }
							else {  }
							deferObject.reject(reason);
						});
					return deferObject.promise;
				},
				PostMethod: function (URL, PostData) {
	        		    var promise = httpPreConfig({ method: 'POST', url: $rootScope.ApplicationURL+'/Authentication/' + URL, data: PostData , headers: { 'Content-Type': 'application/json', 'token': $window.localStorage.getItem("AuthenticationToken") } }), deferObject = deferObject || $q.defer();
						promise.then(function (answer) {
							deferObject.resolve(answer.data);
						}, function (reason) { 
							$rootScope.LoadingShow = false; 
							if (reason.status == 400 || reason.status == 412 || reason.status == 403 || reason.status == 404) { $window.localStorage.removeItem("AuthenticationToken"); $window.location.href = $rootScope.ApplicationURL+'/Authentication/#/'; }
							else {  }
							deferObject.reject(reason);
						});
					return deferObject.promise;
				}
			};
		return BusinessLogic;
	}]);
	EmpDBServices.service('Export', function ($http, $q, BusinessLogic, $rootScope) {
		var deferObject,
			Export = {
				xlsExportJSON: function (JSON) { 
					var properties = JSON;
					var HTML = '<table>';
					if (properties.header) {
						HTML += '<thead><tr><th></th><th class="headerText" colspan="' + properties.header.length + '" style="background-color:#16365c; color:white; border-style: solid; border-width: 1px;">' + properties.name + '</th></tr><tr><th></th>';
						angular.forEach(properties.header, function (val, key) { HTML += '<th style="background-color:#16365c; color:white; border-style: solid; border-width: 1px;">' + val + '</th>'; });
						HTML += '</tr></thead>';
					}
					if (properties.body) {
						if (!properties.header) {
							properties.header = [];
							angular.forEach(properties.body[0], function (val, key) { properties.header.push(key); });
							HTML += '<thead><tr><th></th><th class="headerText" colspan="' + properties.header.length + '" style="background-color:#16365c; color:white; border-style: solid; border-width: 1px; text-align: left;">' + properties.name + '</th></tr><tr><th></th>';
							angular.forEach(properties.header, function (val, key) { HTML += '<th style="background-color:#16365c; color:white; border-style: solid; border-width: 1px;">' + val + '</th>'; });
							HTML += '</tr></thead>';
						}
						HTML += '<tbody>';
						properties.body.forEach(function callback(currentValue, index, array) {
							HTML += '<tr><td></td>';
							angular.forEach(properties.header, function (val, key) { HTML += '<td class="number" style="background-color:white; border-style: solid; border-width: 1px;">' + currentValue[val] + '</td>'; });
							HTML += '</tr>';
						});
						HTML += '</tbody>';
					}
					HTML += '</table>';

					var a, base64, uri = 'data:application/vnd.ms-excel;base64,',
						template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
							'<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>' +
							'<x:Name>Sheet 1</x:Name>' +
							'<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->' +
							'<style>td,th{font-family: Arial; font-size:13px} .headerText{ text-align: left; } .number{mso-number-format:"\#\";}</style>' +
							'<meta name=ProgId content=Excel.Sheet>' +
							'<meta charset=UTF-8>' +
							'</head><body style="background-color:#ddd">' +
							HTML +
							'</body></html>',
						base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); };
					a = document.createElement('a');
					a.href = uri + base64(template);
					a.target = '_blank';
					a.download = properties.name ? properties.name + new Date() + '.xls' : 'Excel.xls';
					document.getElementsByTagName('body')[0].appendChild(a); // #111
					a.click();
					a.remove();
				},
				xlsExportMultipleJSON: function (JSON) { 
					/*var UserLogginData = AllloggedInUserData.AllLogginData();*/
					var wbname =  'Basic Information_'+new Date()+ '.xls'; 
					var tables;
					JSON.length ? tables = JSON : tables = [JSON];
					var uri = 'data:application/vnd.ms-excel;base64,'
						, tmplWorkbookXML = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'
							+ '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>{Author}</Author><Created>{created}</Created></DocumentProperties>'
							+ '<Styles>'
							+ '<Style ss:ID="SheetStyle"><Interior ss:Color="#8c8c8c" ss:Pattern="Solid"/></Style>'
							+ '<Style ss:ID="HeaderText"><Borders> <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/> <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/> <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/> <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders><Alignment ss:Vertical="Center" ss:Horizontal="Center"/><Font ss:Size="10" ss:Bold="1" ss:Color="#ffffff"/><Interior ss:Color="#16365c" ss:Pattern="Solid"/></Style>'
							+ '<Style ss:ID="Header"><Borders> <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/> <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/> <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/> <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders><Alignment ss:Vertical="Center" ss:Horizontal="Left"/><Font ss:Bold="1" ss:Color="#ffffff"/><Interior ss:Color="#16365c" ss:Pattern="Solid"/></Style>'
							+ '<Style ss:ID="CellStyle"><Borders> <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/> <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/> <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/> <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders><Interior ss:Color="#ffffff" ss:Pattern="Solid"/></Style>'
							+ '<Style ss:ID="Currency"><NumberFormat ss:Format="Currency"></NumberFormat> <Borders> <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/> <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/> <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/> <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders><Interior ss:Color="#ffffff" ss:Pattern="Solid"/></Style>'
							+ '<Style ss:ID="Date"><NumberFormat ss:Format="dd-MMM-yyyy"></NumberFormat><Borders> <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/> <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/> <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/> <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders><Interior ss:Color="#ffffff" ss:Pattern="Solid"/></Style>'
							+ '<Style ss:ID="Default" ss:Name="Normal">'
							+  '<Alignment ss:Vertical="Center"/>'
							+  '<Borders></Borders>'
							+  '<Font ss:Size="10" ss:FontName="Arial"/>'
							+  '<Interior/>'
							+  '<NumberFormat/>'
							+  '<Protection/>'
							+ '</Style>'
							+ '</Styles>'
							+ '{worksheets}</Workbook>'
						, tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}"><Table ss:StyleID="SheetStyle">{columns}{rows}</Table></Worksheet>'
						, tmplCellXML = '<Cell{attributeStyleID}{attributeFormula}><Data ss:Type="{nameType}">{data}</Data></Cell>'
						, base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
						, format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
					var ctx = "", workbookXML = "", worksheetsXML = "", rowsXML = "", columnsXML = "";
					for (var i = 0; i < tables.length; i++) {
						for (var j = 0; j < tables[i].body.length; j++) {
							if (j == 0) {
								if (tables[i].header) {
									rowsXML += '<Row></Row> <Row><ss:Cell /><Cell ss:StyleID="HeaderText" ss:MergeAcross="'+(tables[i].header.length - 1)+'"><Data ss:Type="String">'+tables[i].name+'</Data></Cell></Row> <Row><Cell></Cell>'
									columnsXML +='<ss:Column ss:AutoFitWidth="1" ss:Width="50"/>';
									angular.forEach(tables[i].header, function (val, key) {
										var dataValue = val;
										ctx = {
											attributeStyleID: ' ss:StyleID="Header"'
											, nameType: 'String'
											, data: dataValue
											, attributeFormula: ''
										};
										rowsXML += format(tmplCellXML, ctx);
										columnsXML +='<ss:Column ss:AutoFitWidth="1" ss:Width="200"/>';
									});
									rowsXML += '</Row>';
								}
								else {
									tables[i].header = [];
									rowsXML += '<Row></Row> <Row><ss:Cell /><Cell ss:MergeAcross="'+(tables[i].body[0].length - 1)+'"><Data ss:Type="String">'+tables[i].name+'</Data></Cell></Row> <Row><Cell></Cell>'
									columnsXML +='<ss:Column ss:AutoFitWidth="1" ss:Width="50"/>';
									angular.forEach(tables[i].body[0], function (val, key) {
										tables[i].header.push(key);
										var dataValue = val;
										ctx = {
											attributeStyleID: ' ss:StyleID="Header"'
											, nameType: 'String'
											, data: dataValue
											, attributeFormula: ''
										};
										rowsXML += format(tmplCellXML, ctx);
										columnsXML +='<ss:Column ss:AutoFitWidth="1" ss:Width="200"/>';
									});
									rowsXML += '</Row>'
								}
							}
							rowsXML += '<Row><Cell></Cell>'
							for (var k = 0; k < tables[i].header.length; k++) {
								var dataType, styleID = ' ss:StyleID="CellStyle"', dataValue = tables[i].body[j][tables[i].header[k]];
								if(angular.isNumber(dataValue)) { if(tables[i].dataType[tables[i].header[k]] == 'Number') { dataType = 'Number'; styleID = ' ss:StyleID="CellStyle"' } else { dataType = 'Number'; styleID = ' ss:StyleID="Currency"' } }
								else if(angular.isDate(dataValue)) { dataType = 'DateTime'; styleID = ' ss:StyleID="Date"'}
								else { dataType = 'String'; styleID = ' ss:StyleID="CellStyle"'}
								ctx = {
									attributeStyleID: styleID
									, nameType: dataType
									, data: dataValue
									, attributeFormula: ''
								};
								rowsXML += format(tmplCellXML, ctx);
							}
							rowsXML += '</Row>'
						}
						ctx = { columns: columnsXML, rows: rowsXML, nameWS: tables[i].name || 'Sheet' + i };
						worksheetsXML += format(tmplWorksheetXML, ctx);
						
						rowsXML = "";
						columnsXML = "";
					}

					ctx = { Author: $rootScope.userData.iD, created: (new Date()).getTime(), worksheets: worksheetsXML }; 
					workbookXML = format(tmplWorkbookXML, ctx);
					var link = document.createElement("A");
					
					link.href = uri + base64(workbookXML);
					link.download = wbname || 'Workbook.xls';
					link.target = '_blank';
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				}
			};
		return Export;
	});