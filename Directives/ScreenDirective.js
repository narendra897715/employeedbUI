
var ScreenDirectives = angular.module('EmpDB.ScreenDirectives',['naif.base64','ngFileSaver','ngFileUpload'])

ScreenDirectives
.directive('home',function(){
	return{
		restrict : "E",
        controller: ['$window', '$state', '$q', '$mdDialog','$scope','$rootScope','BusinessLogic','BusinessLogic1', function(window, state, Q, mdDialog,$scope,rootScope,BusinessLogic,BusinessLogic1){
        	var HomeController=this;
        	
        	BindUserData();
        	function BindUserData(){
        		BusinessLogic1.GetMethod('empDetailsWithToken').then(function(response){
        			HomeController.userData=angular.copy(response);
        			rootScope.userData=angular.copy(response);  
        			},function(){});
        		}
        	
        	
        	
        	HomeController.callLogoutRequest = function(ev){
        		var confirm = mdDialog.confirm().title('Are you sure you want to logout?').targetEvent(ev).ok('Yes').cancel('No');
        		mdDialog.show(confirm).then(function () { window.localStorage.removeItem("AuthenticationToken"); 
        		/* window.location.href = 'http://localhost:7001/Authentication/#/'; */
        			window.location.href= rootScope.ApplicationURL+'/Authentication/#/applications'; 
        		 }, function () { });
        	}
        	HomeController.openMenu = function(mdMenu, ev){        		
        		BusinessLogic1.GetMethod('getApps').then(function(response){ HomeController.applicationList = []; HomeController.applicationList = angular.fromJson(response); }, function(reason){ });
        		mdMenu(ev);
        	}
        	/*BusinessLogic1.GetMethod('getApps').then(function(response){ HomeController.applicationList = []; HomeController.applicationList = angular.fromJson(response); }, function(reason){ });*/        	
        	HomeController.applicationRedirection = function(applicationData){ window.location.href = applicationData.url; }
        	HomeController.changePasswordRequest = function(ev){
        		window.location.href = rootScope.ApplicationURL+'/Authentication/#/changePassword'
        		/*window.open(rootScope.ApplicationURL+'/Authentication/#/changePassword')*/; }
        	
        	window.onbeforeunload = handleBackFunctionality;
        	function handleBackFunctionality() {
                if (window.event) {
                    if (window.event.clientX < 40 && window.event.clientY < 0) {
                        alert("Clicked - Browser back button.");
                    }
                    else {
                        alert("Clicked - Browser refresh button.");
                    }
                }              
            }
        	
        	
        	
        }],
        controllerAs: 'HomeController',
        link: function(scope, element, attrs, controllers) { },
        templateUrl : 'Partials/Home.html'
		}
})
.directive('employees',function(){
	return{
		restrict : "E",
        controller: ['$window', '$state', '$q', '$mdDialog','$scope','$rootScope','BusinessLogic','BusinessLogic1','$http','notification', 'Export',function(window, state, Q, mdDialog,scope,rootScope,BusinessLogic,BusinessLogic1,http,notification,Export){
        	var EmployeesController=this;
        	scope.filter ={"domainID":-1,"statusID":-1}
        	
        	Bind()
        	function Bind(){
        		BindDomainDetails();
        		BindStatusDetails();
        		BindEmployeeDetails();
        	}
        	
        	EmployeesController.applyFilter = function(){
        		BindEmployeeDetails();
        	}
        	
        	EmployeesController.EmployeesClick=function(){
        		scope.filter ={'domainID':-1,'statusID':-1};
        		BindEmployeeDetails();
        	}
        	
        	function BindEmployeeDetails(){
            	BusinessLogic.PostMethod('employeeDetailsList',{"domainID":scope.filter.domainID == -1 ? null : scope.filter.domainID,"statusID":scope.filter.statusID ==-1 ? null : scope.filter.statusID }).then(function(response){
        			EmployeesController.employeesData=angular.copy(response.data);
        			rootScope.totalEmployees=EmployeesController.employeesData.length;	
            	},function(){});
        	}
        	
        	function BindDomainDetails(){
        		BusinessLogic.GetMethod('fetchDomainsList').then(function(response){
        			EmployeesController.domainDetails=angular.copy(response);
        			},function(){});
        	}
        	
        	function BindStatusDetails(){
        		BusinessLogic.GetMethod('statusDropDown').then(function(response){
        			EmployeesController.statusDropDownDetails=angular.copy(response);
        			},function(){});
        	}
        	
        	EmployeesController.listAccordingTosearch = function() {
        		scope.query.page = 1;
        	}
        	        	
        	EmployeesController.SelectedEmployee= function(ed){
        		
        		rootScope.isSelectedNew=false;
        	
        		rootScope.selectedEmployee=angular.copy(ed);    		
        		
        		rootScope.selectedView="Home.IndividualEmployee.PersonalDetails";
        		rootScope.selectedTitle="Personal Details";
        		state.go('Home.IndividualEmployee.PersonalDetails');
        	}
        	EmployeesController.NewEmployee =function(){
        		rootScope.isSelectedNew=true;
        		rootScope.selectedEmployee={};
        		state.go('Home.IndividualEmployee.PersonalDetails');
        	}
        	EmployeesController.ExportToExcell = function(){
        		
        		BusinessLogic.GetMethod('getEmployeesBasicInformationExcel').then(function (Data) { 
    				Export.xlsExportMultipleJSON(angular.fromJson(Data));
    			}, function () { });
        		

        	} 
        	
        	EmployeesController.changeStatus=function(empID){
        		BusinessLogic.PostMethod('changeEmployeeStatus',{'employeeID' :empID,'loginemployeeID':rootScope.userData.iD } ).then(function(response){
        			BindEmployeeDetails();
        			notification.notify(response.data.status);
        		},function(){});
        	}
        	
        	EmployeesController.listStyle = { height: (window.innerHeight - 223) + 'px' };
        	window.addEventListener('resize', onResize);
    		function onResize() {
    			EmployeesController.listStyle.height = (window.innerHeight - 215) + 'px';
    			if(scope.$root != null) { if (!scope.$root.$$phase) scope.$digest() };
    		}
    		EmployeesController.BodylistStyle = { height: (window.innerHeight - 265) + 'px' };
    		window.addEventListener('resize', onBodyResize);
    		function onBodyResize() {
    			EmployeesController.BodylistStyle.height = (window.innerHeight - 265) + 'px';
    			if(scope.$root != null) { if (!scope.$root.$$phase) scope.$digest() };
    		}
        	scope.query = { filter: '', order: '', limit: '10', page: 1 };
        	
        }],
        controllerAs: 'EmployeesController',
        link: function(scope, element, attrs, controllers) { },
        templateUrl : 'Partials/Employees.html'
		}
})
.directive('individualEmployee',function(){
	return{
		restrict : "E",
        controller: ['$window', '$state', '$q', '$mdDialog','$scope','$rootScope','BusinessLogic','BusinessLogic1','$http','notification','$mdSidenav', function(window, state, Q, mdDialog,scope,rootScope,BusinessLogic,BusinessLogic1,http,notification,mdSidenav){
        	var individualEmployeeController=this;
        	
        	individualEmployeeController.sideMenu=[{"url":"Home.IndividualEmployee.PersonalDetails","viewName":"Personal Details","icon":"Assets\\user-icon_white.svg","icon1":"Assets\\user-icon_black.svg"}
        										  ,{"url":"Home.IndividualEmployee.FinancialDetails","viewName":"Financial Details","icon":"Assets\\financial-details_white.svg","icon1":"Assets\\financial-details_black.svg"}        										  
        										  ,{"url":"Home.IndividualEmployee.EducationalDetails","viewName":"Educational Details","icon":"Assets\\edu-details_white.svg","icon1":"Assets\\edu-details_black.svg"}
        										  ,{"url":"Home.IndividualEmployee.ExperienceDetails","viewName":"Experience Details","icon":"Assets\\exp-details_white.svg","icon1":"Assets\\exp-details_black.svg"}
        										  ,{"url":"Home.IndividualEmployee.SkillDetails","viewName":"Skills","icon":"Assets\\skills_white.svg","icon1":"Assets\\skills_black.svg"}
        										  ,{"url":"Home.IndividualEmployee.DocumentDetails","viewName":"Documents","icon":"Assets\\documents_white.svg","icon1":"Assets\\documents_black.svg"}
        										  ,{"url":"Home.IndividualEmployee.Interviews","viewName":"Interview Details","icon":"Assets\\interview_white.svg","icon1":"Assets\\interview_black.svg"}]
        	
        	individualEmployeeController.ChangeView = function(vn){ 
        		if(rootScope.isSelectedNew && angular.isUndefined(rootScope.selectedEmployee.employeeID)){ 
        			notification.notify("Please fill Personal Details first.");       		
        			/*state.go('Home.IndividualEmployee.PersonalDetails'); */
        		}
        		else{
        			rootScope.selectedView=angular.copy(vn.url); 
        			rootScope.selectedTitle=angular.copy(vn.viewName); 
        			state.go(vn.url);
        			
        		}
        		
        	}
        	
        	scope.toggleLeft = buildToggler('left');

            function buildToggler(componentId) {
              return function() {
                mdSidenav(componentId).toggle();
              };
            }
        	
        	
        }],
        controllerAs: 'individualEmployeeController',
        link: function(scope, element, attrs, controllers) { },
        templateUrl : 'Partials/IndividualEmployee.html'
		}
})
.directive('personalDetails',function(){ 
	return{
		restrict : "E",
        controller: ['$window', '$state', '$q', '$mdDialog','$scope','$rootScope','BusinessLogic','BusinessLogic1','$http','notification','convertMillToDate','Export', function(window, state, Q, mdDialog,scope,rootScope,BusinessLogic,BusinessLogic1,http,notification,convertMillToDate, Export){
        	var PersonalDetailsController=this;
        	scope.sameAddr=false;
        	
        	PersonalDetailsController.isEditMode = rootScope.isSelectedNew ? true :false;
        	rootScope.selectedView="Home.IndividualEmployee.PersonalDetails";
        	rootScope.selectedTab=1;
        	if(rootScope.selectedEmployee.isActive == false){
    			document.getElementById('employeeisactivecheckbox').disabled = true;
    		}
    		else{
    			document.getElementById('employeeisactivecheckbox').disabled = false;
    		}
        	scope.professionalDetails_grid = [];
        	 scope.maxDate = new Date();
          	Bind();
        	function Bind(){
        		/*BindGender();*/
        		/*BindBloodGroupDetails();*/
        		/*BindDomainDetails();
        		BindEmployees();
        		BindRoleDetails();
        		BindEmployeementStatusDetails();
        		BindEmployeementTypeDetails();*/
        		/*BindLocationDetails();*/
        		/*BindPersonalDetails();*/
        		if(rootScope.selectedTab == 1){ 
       			 BindGender();
       			 BindBloodGroupDetails();
       			 BindPersonalDetails();
       		 	}
        		if(rootScope.selectedTab == 2){
           		   BindDomainDetails();
           		   BindEmployees();
           		   BindRoleDetails();
          		   BindEmployeementStatusDetails();
          		   BindEmployeementTypeDetails();
           		   BindLocationDetails();
           		   BindPersonalDetails();
           		BindCountryDetails();
           	   }
        		if(rootScope.selectedTab ==3){
        			BindPersonalDetails();
        		}
        		if(rootScope.selectedTab == 4){            	  
              	  BusinessLogic.PostMethod('getAppsList',rootScope.selectedEmployee.employeeID ).then(function(response){	                		  
              		  PersonalDetailsController.items = response.data;
              		  angular.forEach(response.data, function(value, key){
              			  if(value.isSelected == true){	                				  
              				  value.tooltip = 'Click to unselect';
              			  }
              			  else{
              				  value.tooltip = 'Click to select';	                				  
              			  }
              		  })
              		  
          			},function(reason){
          				notification.notify(reason.data.status);
          		  });	                	  
        		}
        	}
        	
        	function BindEmployees(){
        		BusinessLogic.PostMethod('employeeDetailsList',{"domainID":null,"statusID":null }).then(function(response){
        			PersonalDetailsController.employeesData=angular.copy(response.data);
        		},function(){});
        	}
        	
        	function BindEmployeement_status_copy(){
        		if(scope.professionalDetails.employmentStatusID == 1){
        			scope.professionalDetails.employementStatus_copy = angular.copy(scope.professionalDetails.employementStatus);
        			scope.professionalDetails.endDate_copy = null;
        		}
        		else{
        			if(scope.professionalDetails_grid.length == 0){
        				scope.professionalDetails.employementStatus_copy = angular.copy(scope.professionalDetails.employementStatus);
        				scope.professionalDetails.endDate_copy = null;
        			}
        			else{
        				scope.professionalDetails.employementStatus_copy = scope.professionalDetails_grid[(scope.professionalDetails_grid.length)-1].employmentTypeName
        				scope.professionalDetails.endDate_copy = scope.professionalDetails_grid[(scope.professionalDetails_grid.length)-1].endDate
        			}
        		}
        		  
        	}
        	
        	function BindPersonalDetails(){
        		if(rootScope.isSelectedNew && angular.isUndefined(rootScope.selectedEmployee.employeeID)){
        			scope.personalDetails2 = {};
    				scope.professionalDetails2 = {};
    					scope.contactDetails2 = {};
    					scope.employeeinNoticePeriod = false;
        		}
        		else{
        			BusinessLogic.PostMethod('employeePersonalDetails',rootScope.selectedEmployee.employeeID).then(function(response){
        				
        				scope.employeeinNoticePeriod = false;
            			scope.personalDetails =angular.copy(response.data.personalDetails);
            			PersonalDetailsController.displayData = angular.copy(response.data);           			
            			scope.imageDataForEmployee = angular.copy(response.data.personalDetails.imagesDTO);
            			scope.personalDetails.dob=convertMillToDate.toDate(response.data.personalDetails.dob);
            			
            			scope.professionalDetails=angular.copy(response.data.professionalDetails);
            			rootScope.selectedEmployee.isActive = response.data.professionalDetails.isActive;
            			scope.professional_grid_copy = angular.copy(response.data.professionalDetails.employementStatusGrid);
            			scope.professionalDetails_grid=angular.copy(response.data.professionalDetails.employementStatusGrid);
            			getEndDate(scope.professionalDetails);
            			for(var i=0;i<scope.professionalDetails_grid.length;i++){
            				scope.professionalDetails_grid[i].startDate=convertMillToDate.toDate(scope.professionalDetails_grid[i].startDate);
            				scope.professionalDetails_grid[i].endDate = convertMillToDate.toDate(scope.professionalDetails_grid[i].endDate);
            				
            				
            				if((scope.professionalDetails_grid[i].employmentTypeID == 2 || scope.professionalDetails_grid[i].employmentTypeID == 5 || scope.professionalDetails_grid[i].employmentTypeID == 6) ){
            					
            				    scope.employeeStatusDate = (scope.professionalDetails_grid[scope.professionalDetails_grid.length-1]).endDate;
            				    scope.employeeStatusName = (scope.professionalDetails_grid[scope.professionalDetails_grid.length-1]).employmentTypeName;
            				    scope.employeeinNoticePeriod = true;
            				}
            				
            			}
            			scope.professionalDetails.doj=convertMillToDate.toDate(response.data.professionalDetails.doj);
            			BindEmployeement_status_copy();
            			scope.contactDetails=angular.copy(response.data.contactDetails);
            			BindDesignationDetails(scope.professionalDetails.domainID);
            			BindLocationDetails(scope.professionalDetails.countryPkID);
            			scope.personalDetails2 = angular.copy(scope.personalDetails);
        				scope.professionalDetails2 = angular.copy(scope.professionalDetails);
        				scope.contactDetails2 = angular.copy(scope.contactDetails);            			           			
        				rootScope.selectedEmployee.employeeName = (response.data.personalDetails.lastName != null)? response.data.personalDetails.firstName + " " + response.data.personalDetails.lastName: response.data.personalDetails.firstName;
            		},function(){});
        		}
    		}
        	
        	function BindGender(){
        		BusinessLogic.GetMethod('fetchGenderList').then(function(response){
        			PersonalDetailsController.genderDetails=angular.copy(response);
        			},function(){});
        	}
        	function BindBloodGroupDetails(){
        		BusinessLogic.GetMethod('fetchBloodGroupList').then(function(response){
        			PersonalDetailsController.bloodGroupDetails=angular.copy(response);
        			},function(){});
        	}
        	function BindDomainDetails(){
        		BusinessLogic.GetMethod('fetchDomainsList').then(function(response){
        			PersonalDetailsController.domainDetails=angular.copy(response);
        			},function(){});
        	}
        	function BindDesignationDetails(domain_id){ 
        	 if(domain_id){
        		BusinessLogic.PostMethod('fetchDesgnationsList',domain_id).then(function(response){
        			PersonalDetailsController.designationDetails=angular.copy(response.data);
        			},function(){});
        	 }
        	}
        	function BindRoleDetails(){
        		BusinessLogic.GetMethod('fetchRoleList').then(function(response){
        			PersonalDetailsController.roleDetails=angular.copy(response);
        			},function(){});
        	}
        	function BindEmployeementStatusDetails(){
        		BusinessLogic.GetMethod('fetchEmployeementStatusList').then(function(response){
        			PersonalDetailsController.employeementStatus=angular.copy(response);
        			},function(){});
        	}
        	function BindEmployeementTypeDetails(){
        		BusinessLogic.GetMethod('fetchEmployeementTypeList').then(function(response){
        			PersonalDetailsController.employeementTypeList=angular.copy(response);
        			},function(){});
        	}
        	
        	function BindLocationDetails(countryid){
        		if(countryid){
        			BusinessLogic.PostMethod('fetchOfficeLocationList',countryid).then(function(response){
            			PersonalDetailsController.LocationDetails=angular.copy(response.data);
            			},function(){});
        		}
        		
        	}
        	function BindCountryDetails(){
        		BusinessLogic.GetMethod('fetchCountryList').then(function(response){
        			PersonalDetailsController.CountryDetails = angular.copy(response);
        		})
        	}
        	PersonalDetailsController.sendEmail = function(ev, isPersonalFormValid, isProfessionalFormValid, isContactsFormValid){        		
        		if( scope.personalDetails == undefined || scope.professionalDetails == undefined   || !rootScope.selectedEmployee.employeeID  || !PersonalDetailsController.displayData.personalDetails.firstName || !PersonalDetailsController.displayData.personalDetails.lastName || !PersonalDetailsController.displayData.personalDetails.fatherName || !PersonalDetailsController.displayData.professionalDetails.email || !PersonalDetailsController.displayData.personalDetails.dob || !PersonalDetailsController.displayData.professionalDetails.doj || !PersonalDetailsController.displayData.personalDetails.mobileNumber1 || ! PersonalDetailsController.displayData.professionalDetails.designationID ){
        		 notification.notify('Please save all the personal details');
        		}
    			else{ 
    				if(scope.personalDetailsForm.$dirty || scope.professionalDetailsForm.$dirty ){ 
            			notification.notify("Please save the details");
            		}
    				else{
	    			  PersonalDetailsController.emailData ={};
	    			  PersonalDetailsController.concatName = PersonalDetailsController.displayData.personalDetails.middleName ? PersonalDetailsController.displayData.personalDetails.firstName + " " + PersonalDetailsController.displayData.personalDetails.middleName +" "+ PersonalDetailsController.displayData.personalDetails.lastName : PersonalDetailsController.displayData.personalDetails.firstName + " " + PersonalDetailsController.displayData.personalDetails.lastName;
	    			  //get the designation Name by using designation ID    			  
	    			  angular.forEach(PersonalDetailsController.designationDetails, function(value, key){
	    				
	      				if(value.designationID == PersonalDetailsController.displayData.professionalDetails.designationID){      					 
	      					PersonalDetailsController.designationName = value.designation;
	      				}
	      			  })
	      			  //sending the required data to the service.
		    			  PersonalDetailsController.emailData = {name : PersonalDetailsController.concatName,
							   fatherName :scope.personalDetails.fatherName,
							   empID : rootScope.selectedEmployee.employeeID,
							   email :scope.professionalDetails.email,
							   dob : scope.personalDetails.dob,
							   doj : scope.professionalDetails.doj,
							   mobileNumber : scope.personalDetails.mobileNumber1,
							   designationID: scope.professionalDetails.designationID,
							   designationName : PersonalDetailsController.designationName
	    			  	};			  
	    			 
	          			BusinessLogic.PostMethod('sendEmailToEmployeeRelations',PersonalDetailsController.emailData).then(function(response){
	        			    notification.notify(response.data.status);        			    
	        				},function(reason){        				
	        				notification.notify(reason.data.status);        				
	        		  });	          		
    				}
    		    }        	          		
        	}
        	PersonalDetailsController.selectFile = function() {
        		$("#uploadprofilepicture").click();
        	}
        	scope.imagewithbase64 = null;
        	scope.imagestatus = null;
        	scope.fileNameChanged = function(evt) {
        		 scope.Imagefile = evt[0];
        		 if(scope.Imagefile.size > 1000000) {
        			 notification.notify("Image is too large to upload");
        		 } else if(scope.Imagefile.type.indexOf('image') === -1) {
        			 notification.notify("Accepts only Images");
        		 } 
        		 
        		 else {
        			 const reader = new FileReader();
                     console.log(reader.result);
                     reader.onload = e => {
                       const binaryString = e.target.result;
                       scope.imagewithbase64 = 'data:image/png;base64,' + btoa(binaryString);
                       scope.$apply();
                       console.log(btoa(binaryString));
                     
                     };
                     reader.readAsBinaryString(scope.Imagefile);
        		 }
                
        	}
        	PersonalDetailsController.saveProfilePicture = function() {
        	
    			if(scope.imagewithbase64 == null) {
    				 notification.notify("please upload the image");
    			} else {
    				if(scope.imageDataForEmployee == null) {
            			var imageID = null;
            		}
            		else {
            			var imageID = scope.imageDataForEmployee.imageID;
            		}
            		BusinessLogic.PostMethod('saveOrUpdateImageDetails',{"employeeID":rootScope.selectedEmployee.employeeID,"imageData":scope.imagewithbase64,"imageID":imageID}).then(function(response){
            			BindPersonalDetails();
            			mdDialog.hide();
            			scope.imagestatus = null;
            			
            			notification.notify(response.data.status);
            		},function(reason){        				
        				notification.notify(reason.data.status);        				
        			})
    			}
        		
        	}
        	
        	PersonalDetailsController.Updateimagestatus = function(imagestatus123) {
        		
        		if(imagestatus123 == 1) {
        			scope.imagewithbase64 = scope.imageDataForEmployee.imageData;
        			PersonalDetailsController.changeProfilePicture();
        		} else {
        			var confirm = mdDialog.confirm().title("Are you sure you want to delete.").targetEvent().ok('Yes').cancel('No');
        			mdDialog.show(confirm).then(function () { 
        				BusinessLogic.PostMethod('deleteImageDetails',{"imageID":scope.imageDataForEmployee.imageID}).then(function(response){
                			BindPersonalDetails();
                			scope.imagewithbase64 = null;
                			notification.notify(response.data.status);
                		},function(reason){        				
            				notification.notify(reason.data.status);        				
            			})
            		}, function () {
            			scope.imagestatus = null;
            		});
        		
        		}
        	}
        	PersonalDetailsController.changeProfilePicture = function(){ 
            	
    		  	 mdDialog.show({
    		          clickOutsideToClose: false,
    		          scope: scope,        
    		          preserveScope: true,    
    			      fullscreen: 'md' ,       
    		          templateUrl: 'UploadImage.html',
    		          controller: function DialogController($scope, $mdDialog) {
    		        	
    		    	  	$scope.closeView = function() {    			 	                		
    		         		mdDialog.hide();
    		         		scope.imagestatus = null;
    		         		scope.imagewithbase64 = null;
    		         		
    		         	}
    		    	  	
    		    	 
                        
                        }
                    });
                 }
        	
PersonalDetailsController.SaveOrUpdate = function(ev,tabs){ 
	
        		if( scope.personalDetails == undefined){ scope.personalDetails={}} 
        		if(scope.professionalDetails == undefined){ scope.professionalDetails={}}
        		if(scope.contactDetails == undefined){ scope.contactDetails ={}}
        		
        		if(tabs == "professionaldetails"){
        			scope.profession_grid_edited = false;
        			scope.professionalDetails3 = scope.professionalDetails;
        			scope.personalDetails3 = scope.personalDetails2;
        			scope.contactDetails3 = scope.contactDetails2;
        		}
        		else if(tabs == "personaldetails"){
        			scope.professionalDetails3 = scope.professionalDetails2;
        			scope.personalDetails3 = scope.personalDetails;
        			scope.contactDetails3 = scope.contactDetails2;
        		}
        		
         		else if(tabs == "contactdetails"){
        			scope.professionalDetails3 = scope.professionalDetails2;
        			scope.personalDetails3 = scope.personalDetails2;
        			scope.contactDetails3 = scope.contactDetails;
        		}
        		
        		
        		scope.professionalDetails3.employementStatusGrid=scope.professionalDetails_grid;
        		scope.professionalDetails3.modifiedBy = scope.personalDetails3.modifiedBy;
        		BusinessLogic.PostMethod('updatePersonalDetails',{"personalDetails":scope.personalDetails3,"professionalDetails":scope.professionalDetails3,"contactDetails":scope.contactDetails3}).then(function(response){
        			rootScope.isSelectedNew = false;
        			scope.personalDetailsForm.$dirty = false;
        			scope.professionalDetailsForm.$dirty = false;
        			scope.personalDetailsForm.$setPristine();
        			scope.professionalDetailsForm.$setPristine();
        			
        			/*rootScope.selectedEmployee.DOJ = scope.professionalDetails3.doj;*/
        			scope.personalDetails.employeeID =response.data.employeeID
        			scope.professionalDetails.employeeID=response.data.employeeID
        			scope.contactDetails.employeeID =response.data.employeeID
        			rootScope.selectedEmployee.employeeID=response.data.employeeID;        			
        			 BindPersonalDetails();        			
        				notification.notify(response.data.status);
        			  
        			},function(reason){        				
        				notification.notify(reason.data.status);        				
        			});
        	}
        	
        	PersonalDetailsController.stopPropagation =  function(ev) { ev.stopPropagation(); };
        	
        	PersonalDetailsController.ClickAddModifyStatus = function(ev,data){
        		scope.status=data;
        		if(data.length == 0){
        			scope.editing   = false;
        		}
        		else{
        			scope.editing   = true;
        		}
        		mdDialog.show({
	                  clickOutsideToClose: false,
	                  scope: scope,        
	                  preserveScope: true,    
	    		      fullscreen: 'md' ,       
	                  templateUrl: 'AddModifyStatus.html',
	                  controller: function DialogController($scope, $mdDialog) {
	                	  $scope.closeView = function() {
	 	                 		mdDialog.hide(); 
	 	                	  }
	                	}
	               });
        	}
        	
        	if(rootScope.selectedEmployee.employeeID ==21100||rootScope.isSelectedNew)
			{
    			scope.disableDiv=true;
			}
        	PersonalDetailsController.exportToExcel= function(ev, emp){       		
    			BusinessLogic.PostMethod('getEmployeeLeaveData', emp.employeeID).then(function (Data) {
    			if(Data.data.body.length == 0)
    				{
    				notification.notify('No Leave History for ' +emp.employeeName);
    				}
    			else{
    				Export.xlsExportJSON(angular.fromJson(Data.data));
    			}
            		}, function () { });
    		
        	}
        	
        	PersonalDetailsController.DeleteEmployementType =function(ev,data){
        		
        		
        		var confirm = mdDialog.confirm().title("Click 'Yes' to confirm deletion. Click 'No' to go back.").targetEvent().ok('Yes').cancel('No');
        		mdDialog.show(confirm).then(function () { 
        			if(data.employeeStatusDetailsID !=undefined && data.employeeStatusDetailsID>0)
            		{
                		BusinessLogic.PostMethod('deleteEmploymentStatus',data.employeeStatusDetailsID).then(function(response){
                			notification.notify(response.data.status);
                			BindPersonalDetails()
            			},function(){});
            		}
            		else{
            			angular.forEach(scope.professionalDetails_grid,function(value,key){
            				if(value.employmentTypeID==data.employmentTypeID){
            					scope.professionalDetails_grid.splice(key);
            				}
            			});
            		}
        		}, function () { });
        		
        		
        		
        	}
        	
        	
        	PersonalDetailsController.AddModifyStatus= function(ev,form,data){
        		var empID=rootScope.selectedEmployee.employeeID;
        		angular.forEach(PersonalDetailsController.employeementTypeList,function(value,key){
        			if(data.employmentTypeID==value.employmentTypeID){
        				data.employmentTypeName=value.employmentType;
        			}
        		});
        		
        		angular.forEach(scope.professionalDetails_grid,function(value,key){
        			if(value.employmentTypeID == null || value.employmentTypeID == undefined ){ scope.professionalDetails_grid.splice(key); }
        			if(value.employeeStatusDetailsID == data.employeeStatusDetailsID){
        				scope.profession_grid_edited = true;
        				value=data;
        			}
        		 });
        	
        		var obj={"employeeID":empID,"employeeStatusDetailsID":null
        				,"employmentTypeID":data.employmentTypeID
        				,"employmentTypeName":data.employmentTypeName
        				,"endDate":data.endDate
        				,"startDate":data.startDate}
        		
        		if(angular.isUndefined(data.employeeStatusDetailsID)){ 
        			scope.profession_grid_edited = true;
        			scope.professionalDetails_grid.push(obj);
    			}
        		mdDialog.hide();
        	}
        	
        	PersonalDetailsController.DomainChange = function(domainID){
        		scope.professionalDetails.designationID = null;
        		BindDesignationDetails(domainID);
        	}
        	PersonalDetailsController.countryChange = function(countryID){
        		scope.professionalDetails.workLocationID = null;
        		BindLocationDetails(countryID);
        	}
        	scope.checkenddate = 0;
        	PersonalDetailsController.changeEmploymentStatus = function(){
        		scope.checkenddate = 0;
        		scope.todayDate = new Date();
        		if(scope.professional_grid_copy.length < scope.professionalDetails_grid.length || scope.profession_grid_edited == true){
        			rootScope.selectedEmployee.isActive = true;
        			notification.notify('please save the data.');
        		}
        		else{
        			if(scope.employeeinNoticePeriod == true){
            			scope.presentemployementstatus = scope.employeeStatusName;
            		}
            		else{
            			scope.presentemployementstatus = scope.professionalDetails.employementStatus_copy;
            		}
            		/*for(var i=0;i<scope.professionalDetails_grid.length;i++){}*/
            		if(scope.presentemployementstatus == 'Permanent' || scope.presentemployementstatus == 'Probation'){
            			rootScope.selectedEmployee.isActive = true;
            			console.log(rootScope.selectedEmployee.isActive);
            			notification.notify('Please provide valid employment type information to mark employee as Inactive.');
            		}
            		else{
            			for(var i=0;i<scope.professionalDetails_grid.length;i++){
            				scope.objectEnddate = angular.copy(scope.professionalDetails_grid[i].endDate);
            				if(scope.todayDate.setHours(0,0,0,0) < scope.objectEnddate.setHours(0,0,0,0)){
            					scope.checkenddate++;
            					rootScope.selectedEmployee.isActive = true;
            					notification.notify('Please ensure' + ' ' + scope.professionalDetails_grid[i].employmentTypeName + ' ' +  'end date should not exceed today\'s date'); 
            					
            					break;
            				}
            				
            			}
            			if(scope.checkenddate==0){
            				BusinessLogic.PostMethod('changeEmployeeStatus',{'employeeID' :rootScope.selectedEmployee.employeeID,'loginemployeeID':rootScope.userData.iD }).then(function(response){    			
            	    			notification.notify(response.data.status);
            	    			document.getElementById('employeeisactivecheckbox').disabled = true;
            	    		},function(){});
            			}
            		}
        		}
        		
        		/*else{
        			BusinessLogic.PostMethod('changeEmployeeStatus',{'employeeID' :rootScope.selectedEmployee.employeeID,'loginemployeeID':rootScope.userData.iD }).then(function(response){    			
    	    			notification.notify(response.data.status);
    	    		},function(){});
        		}*/
	        	
        	}
        	
        	PersonalDetailsController.changeEmployeeTypefunction=function(form,employmentTypeID){
        		var combexists=false;
        		
        		if(employmentTypeID == 1){ form['endDate'].$setValidity('required', true); }
        		
    			angular.forEach(scope.professionalDetails_grid,function(val,key){
    				if(val.employmentTypeID == employmentTypeID){
    					combexists=true;
    				}});
	    			if(combexists){
	    				form['employmentTypeID'].$setValidity('alreadyExist', false);
	    			}
	    			else{ 
	    				if(scope.professionalDetails_grid.length != 0 ){ 
	    				if(scope.professionalDetails_grid[0].employmentTypeID != null && scope.professionalDetails_grid[0].employmentTypeID != undefined){
	    					form['employmentTypeID'].$setValidity('alreadyExist', true);
	    				}
	    			  }
	    			}
    			}
        	
        	PersonalDetailsController.clickSameAsAbove =function(sameAddr){
        		
        		if(angular.isUndefined(sameAddr)){
        			scope.sameAddr=false;
        		}
        		if(sameAddr){
        			scope.contactDetails.permanentAddress=angular.copy(scope.contactDetails.currentAddress)
        		}
        		else{
        			scope.contactDetails.permanentAddress="";
        		}
        	}
        	
        	PersonalDetailsController.changeStatus = function(data){
        		getEndDate(data);
        		BindEmployeement_status_copy();
        		addDatainEmploymentStatusTable(data.employmentStatusID);
        	}
        	
        	function addDatainEmploymentStatusTable(employeestatusid){
        		scope.employeestatuscount = 0;
        		BusinessLogic.PostMethod('getEmploymentStatusDates ',employeestatusid).then(function(response){    	
        			console.log(response.data);
        			if(response.data.length > 0){
        				for(var i=0;i<scope.professionalDetails_grid.length;i++){
                			/*	scope.professionalDetails_grid[i].startDate=convertMillToDate.toDate(scope.professionalDetails_grid[i].startDate);
                				scope.professionalDetails_grid[i].endDate = convertMillToDate.toDate(scope.professionalDetails_grid[i].endDate);*/
                				if(scope.professionalDetails_grid[i].employmentTypeID ==  response.data[0].employmentTypeID){
                					scope.employeestatuscount++;
                					break;
                				}
                				        				
                				/*if((scope.professionalDetails_grid[i].employmentTypeID == 2 || scope.professionalDetails_grid[i].employmentTypeID == 5 || scope.professionalDetails_grid[i].employmentTypeID == 6) ){
                					
                				    scope.employeeStatusDate = (scope.professionalDetails_grid[scope.professionalDetails_grid.length-1]).endDate;
                				    scope.employeeStatusName = (scope.professionalDetails_grid[scope.professionalDetails_grid.length-1]).employmentTypeName;
                				    scope.employeeinNoticePeriod = true;
                				}*/
                				
                			}
                			if(scope.employeestatuscount == 0){
                				
                				var obj={"employeeID":rootScope.selectedEmployee.employeeID,"employeeStatusDetailsID":null
                        				,"employmentTypeID":response.data[0].employmentTypeID
                        				,"employmentTypeName":response.data[0].employmentTypeName
                        				,"endDate":new Date(response.data[0].endDate)
                        				,"startDate":new Date(response.data[0].startDate)}
                				scope.professionalDetails_grid.push(obj);
                			}
        			}
        		
        			/*scope.employeeStatusDate = response.data[0].endDate;*/
	    		},function(){});
        	}
        	 function getEndDate(data){
        		angular.forEach(scope.professionalDetails_grid,function(value,key){
        			var isExists=false;
        			if(data.employmentStatusID==value.employmentStatusID){
        				isExists=true;
        				scope.professionalDetails.endDate=value.endDate;
        			}
        			if(!isExists){ scope.professionalDetails.endDate = null}
        		})
        		
        		
        	}
        	
        	 PersonalDetailsController.changeTab=function(sTab,form){ 
         		
         		if(sTab != 1){
         			if(rootScope.selectedEmployee.employeeID != undefined){
         				if(sTab != 4 || (rootScope.selectedEmployee.designation != undefined || (PersonalDetailsController.displayData.professionalDetails.designationID != null))){
         					if(scope.professional_grid_copy.length < scope.professionalDetails_grid.length){
         	        			notification.notify('please save the data');
         	        		}
         					else{
         						rootScope.selectedTab=angular.copy(sTab); 
                 				Bind();
         					}
         					
         				}
         				else{
           						notification.notify("Please fill Professional Info Details");   
         					
         				}
         				
         			} 
         			else{
         				notification.notify("Please fill Personal Info Details first.");     
         			}
         		}
         		else{
         			rootScope.selectedTab=angular.copy(sTab);
         			Bind();
         		}
         		
         	}
        	 
        	PersonalDetailsController.ChangeEditMode =function(){
        		PersonalDetailsController.isEditMode=!PersonalDetailsController.isEditMode;
        	}
        	
        	PersonalDetailsController.changeState = function(url){
        		state.go(url);
        	}
        	
        	PersonalDetailsController.Tabs=[{"tabName":"Personal Info","tabId":1}
        								   ,{"tabName":"Professional Info","tabId":2}
        								   ,{"tabName":"Contact Details","tabId":3}
        								   ,{'tabName' : 'Apps', 'tabId': 4}]
        	
        	
        	PersonalDetailsController.resetPassword= function(){
        		var confirm = mdDialog.confirm().title("Are you sure you want to reset password?").targetEvent().ok('Yes').cancel('No');
        		mdDialog.show(confirm).then(function () {
        		BusinessLogic1.PostMethod('passwordReset', rootScope.selectedEmployee.employeeID).then(function(response){
        			notification.notify(response.status);
        		}, function(reason){
        			notification.notify(reason.status);
        		})
        		}, function () { });
        	}
        		

        		PersonalDetailsController.toggle = function(item,list){	                		 
          		  item.isSelected = !item.isSelected;
          		  item.tooltip = !item.isSelected ? 'Click to select':'Click to unselect';          		  
          	  }
      
          	  PersonalDetailsController.submitAppsList = function(){              		  	                		  	                		   
          		  BusinessLogic.PostMethod('saveOrUpdateOrDeleteAppsForEmployee', PersonalDetailsController.items).then(function(response){          		
          			  notification.notify(response.data.status);
          			  mdDialog.hide(); 		                		  	                		  
          			},function(reason){	
          				notification.notify(reason.data.status);
          		  });
          	  }
        		
        	
        	
        	/*PersonalDetailsController.changeAppsAccessible = function(){         		
               	 mdDialog.show({
	                  clickOutsideToClose: true,
	                  scope: scope,        
	                  preserveScope: true,    
	    		      fullscreen: 'md',       
	                  templateUrl: 'appsCheck.html',
	                  controller: function DialogController($scope, $mdDialog) {           	  
	                	  
	                	  PersonalDetailsController.toggle = function(item,list){	                		 
	                		  item.isSelected = !item.isSelected;
	                		  item.tooltip = !item.isSelected ? 'Click to select':'Click to unselect';
	                		  console.log(item.tooltip);
	                	  }
	                	  	                	  
	                	  BusinessLogic.PostMethod('getAppsList',rootScope.selectedEmployee.employeeID ).then(function(response){	                		  
	                		  PersonalDetailsController.items = response.data;
	                		  angular.forEach(response.data, function(value, key){
	                			  if(value.isSelected == true){	                				  
	                				  value.tooltip = 'Click to unselect';
	                			  }
	                			  else{
	                				  value.tooltip = 'Click to select';	                				  
	                			  }
	                		  })
	                		  
	            			},function(reason){
	            				notification.notify(reason.data.status);
	            		  });	                	  
	                	  
	                	  PersonalDetailsController.submitAppsList = function(){              		  	                		  	                		   
	                		  BusinessLogic.PostMethod('saveOrUpdateOrDeleteAppsForEmployee', PersonalDetailsController.items).then(function(response){
	                			  console.log(response);
	                			  notification.notify(response.data.status);
	                			  mdDialog.hide(); 		                		  	                		  
		            			},function(reason){	
		            				notification.notify(reason.data.status);
		            		  });
	                	  }
	                	  $scope.closeView = function() {
	                		  mdDialog.hide(); 
	                	  }
	                   }
    	         });
        		
               	
        	}*/
        	
        }],
        controllerAs: 'PersonalDetailsController',
        link: function(scope, element, attrs, controllers) { },
        templateUrl : 'Partials/PersonalDetails.html'
		}
})
.directive('financialDetails',function(){
	return{
		restrict : "E",
        controller: ['$window', '$state', '$q', '$mdDialog','$scope','$rootScope','BusinessLogic','BusinessLogic1','$http','notification','convertMillToDate', function(window, state, Q, mdDialog,scope,rootScope,BusinessLogic,BusinessLogic1,http,notification,convertMillToDate){
        	var FinancialDetailsController=this;
        	FinancialDetailsController.isEditMode=rootScope.isSelectedNew ? true :false;
        	rootScope.selectedView="Home.IndividualEmployee.FinancialDetails";
        	rootScope.selectedTab=1;
        	
        	Bind();
        	function Bind(){
        		BindFinacialDetails();
        	}
        	
        	FinancialDetailsController.changeEmploymentStatus = function(){
	        	BusinessLogic.PostMethod('changeEmployeeStatus',rootScope.selectedEmployee.employeeID).then(function(response){    			
	    			notification.notify(response.data.status);
	    		},function(){});
        	}
        	
        	FinancialDetailsController.goToPersonalDetails = function(){
        		rootScope.selectedTab = "3";
        		state.go("Home.IndividualEmployee.PersonalDetails");
        	}
        	function BindFinacialDetails(){
        		/*if(rootScope.isSelectedNew && angular.isUndefined(rootScope.selectedEmployee.employeeID)){
        			notification.notify("Please fill Personal Details first.");
        			state.go('Home.IndividualEmployee.PersonalDetails');
        		}*/
        		/*else{*/
        			BusinessLogic.PostMethod('getFinancialDetails',rootScope.selectedEmployee.employeeID).then(function(response){
            			scope.basicDetails=angular.copy(response.data);
            			if(!response.data.financialDetailsID){
            				FinancialDetailsController.isEditMode = true;
            			}
            			scope.basicDetails.passportExpiryDate=convertMillToDate.toDate(response.data.passportExpiryDate);
            			},function(){});
        		/*}*/
        	}
        	
        	FinancialDetailsController.saveOrUpdate = function(ev,form){ 
        		scope.basicDetails.employeeID=angular.copy(rootScope.selectedEmployee.employeeID); 
        		scope.basicDetails.createdBy = rootScope.userData.iD; 
        		scope.basicDetails.modifiedBy = rootScope.userData.iD; 
        		BusinessLogic.PostMethod('saveOrUpdateFinancialDetails',scope.basicDetails).then(function(response){
        			BindFinacialDetails()
        			notification.notify(response.data.status);
        			},function(reason){
        				notification.notify(reason.data.status);
        			});
        	}
        	
        	FinancialDetailsController.Tabs=[{"tabName":"Basic Info","tabId":1}
			   								,{"tabName":"Bank Info","tabId":2}]
        	
        	FinancialDetailsController.changeTab=function(sTab){
        		rootScope.selectedTab=angular.copy(sTab);
        	}
        	FinancialDetailsController.ChangeEditMode =function(){
        		FinancialDetailsController.isEditMode=!FinancialDetailsController.isEditMode;
        	}
        	
        }],
        controllerAs: 'FinancialDetailsController',
        link: function(scope, element, attrs, controllers) { },
        templateUrl : 'Partials/FinancialDetails.html'
		}
})
.directive('educationalDetails',function(){
	return{
		restrict : "E",
        controller: ['$window', '$state', '$q', '$mdDialog','$scope','$rootScope','BusinessLogic','BusinessLogic1','$http','notification','convertMillToDate', function(window, state, Q, mdDialog,scope,rootScope,BusinessLogic,BusinessLogic1,http,notification,convertMillToDate){
        	var EducationalDetailsController=this;
        	rootScope.selectedView ="Home.IndividualEmployee.EducationalDetails";
        	rootScope.selectedTab=1;
        	
        	Bind();
        	function Bind(){             
		    	
        		/*if(rootScope.isSelectedNew && angular.isUndefined(rootScope.selectedEmployee.employeeID)){
        			notification.notify("Please fill Personal Details first.");
        			state.go('Home.IndividualEmployee.PersonalDetails');
        		}*/
        		/*else{*/
        			BusinessLogic.PostMethod('getEducationDetails',rootScope.selectedEmployee.employeeID).then(function(response){
    		    		angular.forEach(response.data, function(value,key){ 
    		    			value.academicStartDate = convertMillToDate.toDate(value.academicStartDate); 
    		    			value.academicEndDate = convertMillToDate.toDate(value.academicEndDate);
    		    		});
    		    		EducationalDetailsController.Details = response.data;  
    				},function(reason){});
        		/*}*/
        	}
        	
        	EducationalDetailsController.changeEmploymentStatus = function(){
	        	BusinessLogic.PostMethod('changeEmployeeStatus',rootScope.selectedEmployee.employeeID).then(function(response){    			
	    			notification.notify(response.data.status);
	    		},function(){});
        	}
        	
        	EducationalDetailsController.saveOrUpdate = function(ev, form, data) { 
        	    if(form.$invalid){ 
        			angular.forEach(form.$error, function (field) { 
                        angular.forEach(field, function(errorField){ 
                          errorField.$setTouched(); 
                        })
                      });
        		}
        		else{
        		data.employeeID = rootScope.selectedEmployee.employeeID;
        		data.createdBy = rootScope.userData.iD; 
        		data.modifiedBy = rootScope.userData.iD;
        		
        		BusinessLogic.PostMethod('saveOrUpdateEducationDetails',[data]).then(function(response){        		    		
        			Bind(); 
        			mdDialog.hide();
        			notification.notify(response.data.status);
				},function(reason){
					notification.notify(reason.data.status);
				});
        	   }
        	  }
     
EducationalDetailsController.deleteDetails = function(data){ 
        		
        		var confirm = mdDialog.confirm().title("Click 'Yes' to confirm deletion. Click 'No' to go back.").targetEvent().ok('Yes').cancel('No');
        		mdDialog.show(confirm).then(function () { 
        			BusinessLogic.PostMethod('deleteEducationDetails',data).then(function(response){        		    		
    	    			Bind();
    	    			notification.notify(response.data.status);
    				},function(reason){
    					notification.notify(reason.data.status);
    				});
        		}, function () { });
        		
        		
    		
	    		
	        }
        	
        	EducationalDetailsController.ChangeDetails = function(data){ 
        	EducationalDetailsController.details = data; 
		  	 mdDialog.show({
		          clickOutsideToClose: false,
		          scope: scope,        
		          preserveScope: true,    
			      fullscreen: 'md' ,       
		          templateUrl: 'EducationalDetails.html',
		          controller: function DialogController($scope, $mdDialog) {
		        	
		    	  	$scope.closeView = function() {    			 	                		
		         		mdDialog.hide();
		         		Bind();
		         	}
		    	  	
		    	  	BusinessLogic.GetMethod('getEducationalBoardDetails').then(function(response){  
		        		EducationalDetailsController.boards = response; 			    				    		
					},function(reason){});
		    	  	
		    	  	BusinessLogic.GetMethod('getEducationalCourseDetails').then(function(response){  
		        		EducationalDetailsController.courses = response; 			    				    		
					},function(reason){});
                    
                    }
                });
             }
        	
        	
        }],
        controllerAs: 'EducationalDetailsController',
        link: function(scope, element, attrs, controllers) { },
        templateUrl : 'Partials/EducationalDetails.html'
		}
})

.directive('experienceDetails',function(){
	return{
		restrict : "E",
        controller: ['$window', '$state', '$q', '$mdDialog','$scope','$rootScope','BusinessLogic','BusinessLogic1','$http','notification','convertMillToDate', function(window, state, Q, mdDialog,scope,rootScope,BusinessLogic,BusinessLogic1,http,notification,convertMillToDate){
        	var ExperienceDetailsController=this;
        	rootScope.selectedView ="Home.IndividualEmployee.ExperienceDetails";
        	
        	Bind();
        	function Bind(){                 
        		/*if(rootScope.isSelectedNew && angular.isUndefined(rootScope.selectedEmployee.employeeID)){
        			notification.notify("Please fill Personal Details first.");
        			state.go('Home.IndividualEmployee.PersonalDetails');
        		}
        		else{*/
	        		BusinessLogic.PostMethod('getExperienceDetails',rootScope.selectedEmployee.employeeID).then(function(response){ 
			    		angular.forEach(response.data, function(value,key){ 
			    			value.startDate = convertMillToDate.toDate(value.startDate);
			    			value.endDate = convertMillToDate.toDate(value.endDate);
			    		});
			    		ExperienceDetailsController.Details = response.data;
			    	},function(reason){});
        		/*}*/
        	}
        	
        	ExperienceDetailsController.changeEmploymentStatus = function(){
	        	BusinessLogic.PostMethod('changeEmployeeStatus',rootScope.selectedEmployee.employeeID).then(function(response){    			
	    			notification.notify(response.data.status);
	    		},function(){});
        	}
        	
        	ExperienceDetailsController.saveOrUpdate = function(ev, form, data) {
        		if(form.$invalid){
        			angular.forEach(form.$error, function (field) {
                        angular.forEach(field, function(errorField){
                          errorField.$setTouched();
                        })
                      });
        		}
        		else{
    			data.employeeID = rootScope.selectedEmployee.employeeID;
        		data.createdBy = rootScope.userData.iD; 
        		data.modifiedBy = rootScope.userData.iD;
        		
        		BusinessLogic.PostMethod('saveOrUpdateExperienceDetails',[data]).then(function(response){        		    		
        			Bind(); 
        			mdDialog.hide();
        			notification.notify(response.data.status);
				},function(reason){
					notification.notify(reason.data.status);
				});
        	   }
        	}
        	
ExperienceDetailsController.deleteDetails = function(data){ 
        		
        		
        		
        		var confirm = mdDialog.confirm().title("Click 'Yes' to confirm deletion. Click 'No' to go back.").targetEvent().ok('Yes').cancel('No');
        		mdDialog.show(confirm).then(function () { 
        			BusinessLogic.PostMethod('deleteExperienceDetails',data).then(function(response){        		    		
    	    			Bind();
    	    			notification.notify(response.data.status);
    				},function(reason){
    					notification.notify(reason.data.status);
    				});
        		}, function () { });
        		
	        }
        	
        	ExperienceDetailsController.ChangeDetails = function(data){
        	ExperienceDetailsController.details = data;
                  	 mdDialog.show({
                          clickOutsideToClose: false,
                          scope: scope,        
                          preserveScope: true,    
            		      fullscreen: 'md' ,       
                          templateUrl: 'ExperienceDetails.html',
                          controller: function DialogController($scope, $mdDialog) {
                        	
                    	  	$scope.closeView = function() {    			 	                		
                         		mdDialog.hide();
                         		Bind();
                         		}
                        	}
                       });
             }
        	
        }],
        controllerAs: 'ExperienceDetailsController',
        link: function(scope, element, attrs, controllers) { },
        templateUrl : 'Partials/ExperienceDetails.html'
		}
})

.directive('skillDetails',function(){
	return{
		restrict : "E",
        controller: ['$window', '$state', '$q', '$mdDialog','$scope','$rootScope','BusinessLogic','BusinessLogic1','$http','notification', function(window, state, Q, mdDialog,scope,rootScope,BusinessLogic,BusinessLogic1,http,notification){
        	var SkillDetailsController=this;
        	rootScope.selectedView ="Home.IndividualEmployee.SkillDetails";
        	rootScope.selectedTab=1;
        	
        	Bind();
        	function Bind(){                 
        		/*if(rootScope.isSelectedNew && angular.isUndefined(rootScope.selectedEmployee.employeeID)){
        			notification.notify("Please fill Personal Details first.");
        			state.go('Home.IndividualEmployee.PersonalDetails');
        		}
        		else{*/
        			BusinessLogic.GetMethod('getSkillslevels',rootScope.selectedEmployee.employeeID).then(function(response){  
		    			SkillDetailsController.list = response;
			    		BusinessLogic.PostMethod('getSkillsDetails',rootScope.selectedEmployee.employeeID).then(function(resp){  
				    		SkillDetailsController.Details = resp.data;
				        	angular.forEach(resp.data, function(value, key) {
			   				 angular.forEach(response, function(v, k){		   					 
			   					if(value.skillLevelID == v.skillLevelID){
			   						value.skillType =  v.skillType; 
				   				 }
			   				 })
			   			  });
	            	  },function(reason){});		    		
        			},function(reason){});	
        		/*}*/	
            }
        	
        	SkillDetailsController.changeEmploymentStatus = function(){
	        	BusinessLogic.PostMethod('changeEmployeeStatus',rootScope.selectedEmployee.employeeID).then(function(response){    			
	    			notification.notify(response.data.status);
	    		},function(){});
        	}
        	
        	SkillDetailsController.saveOrUpdate = function(ev, form, data) {
        		
        		if(form.$invalid){
        			angular.forEach(form.$error, function (field) {
                        angular.forEach(field, function(errorField){
                          errorField.$setTouched();
                        })
                      });
        		}
        		
        		else{
        		data.employeeID = rootScope.selectedEmployee.employeeID;
        		data.createdBy = rootScope.userData.iD; 
        		data.modifiedBy = rootScope.userData.iD;
        		
        		BusinessLogic.PostMethod('saveOrUpdateSkillsDetails',[data]).then(function(response){        		    		
        			Bind(); 
        			mdDialog.hide();
        			notification.notify(response.data.status);
				},function(reason){
					notification.notify(reason.data.status);
				});
        	  }
        	}
        	
SkillDetailsController.deleteDetails = function(data){ 
        		
        		
        		var confirm = mdDialog.confirm().title("Click 'Yes' to confirm deletion. Click 'No' to go back.").targetEvent().ok('Yes').cancel('No');
        		mdDialog.show(confirm).then(function () { 
        			BusinessLogic.PostMethod('deleteSkillsDetails',data).then(function(response){        		    		
    	    			Bind();
    	    			notification.notify(response.data.status);
    				},function(reason){
    					notification.notify(reason.data.status);
    				});
        		}, function () { });
        		
    		
	    		
	        }
        	
        	SkillDetailsController.ChangeDetails = function(data){
        		SkillDetailsController.details = data;
                  	 mdDialog.show({
                          clickOutsideToClose: false,
                          scope: scope,        
                          preserveScope: true,    
            		      fullscreen: 'md' ,       
                          templateUrl: 'SkillDetails.html',
                          controller: function DialogController($scope, $mdDialog) {
                        	 
                    	  BusinessLogic.GetMethod('getSkillslevels',rootScope.selectedEmployee.employeeID).then(function(response){  
      		    			SkillDetailsController.list = response;  
                    	  },function(reason){});
                        	
                    	  	$scope.closeView = function() {    			 	                		
                         		mdDialog.hide();
                         		Bind();
                         		}
                        	}
                       });
             }
        	
        }],
        controllerAs: 'SkillDetailsController',
        link: function(scope, element, attrs, controllers) { },
        templateUrl : 'Partials/SkillDetails.html'
		}
})
.directive('documentDetails',function(){
	return{
		restrict : "E",
        controller: ['$window', '$state', '$q', '$mdDialog','$scope','$rootScope','BusinessLogic','BusinessLogic1','$http','notification','$interval','convertMillToDate','FileSaver','Blob','Upload', function(window, state, Q, mdDialog,scope,rootScope,BusinessLogic,BusinessLogic1,http,notification,interval,convertMillToDate,FileSaver,Blob,Upload){
        	var DocumentDetailsController=this;
        	DocumentDetailsController.isEditMode=rootScope.isSelectedNew ? true :false;
        	rootScope.selectedView="Home.IndividualEmployee.DocumentDetails";
        	DocumentDetailsController.total;
        	DocumentDetailsController.loaded;
        	
        	Bind();
        	function Bind(){
        		BusinessLogic.PostMethod('getDocumentDetails',rootScope.selectedEmployee.employeeID).then(function(response){        		    		
        			DocumentDetailsController.Details = response.data; 
        			angular.forEach(response.data, function(value,key){
        				value.createdDate = convertMillToDate.toDate(value.createdDate);
		    			value.modifiedDate = convertMillToDate.toDate(value.modifiedDate);
        			});	    		
        			
				},function(reason){
					
				});
        	}
        	
        	DocumentDetailsController.changeEmploymentStatus = function(){
	        	BusinessLogic.PostMethod('changeEmployeeStatus',rootScope.selectedEmployee.employeeID).then(function(response){    			
	    			notification.notify(response.data.status);
	    		},function(){});
        	}
        	
        	/* scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
	        	 DocumentDetailsController.total=e.total;
		      	  DocumentDetailsController.loaded=e.loaded;
        		  };
        	
	        	  scope.onProgress = function (e, reader, file, fileList, fileOjects, fileObj) {
	        		  DocumentDetailsController.total=file.size;
			      	  DocumentDetailsController.loaded=e.loaded;
			      	  	console.log(DocumentDetailsController.total+'   '+DocumentDetailsController.loaded);
	  	        	  };
        	*/
        	scope.$watch('files', function () {
        		 var file = scope.files;
        		 if(file != undefined){
        			 getBase64(file);
        		 }
        		
        		  function getBase64(file) {
        			   var reader = new FileReader();
        			   reader.readAsDataURL(file);
        			  
        			    var base64Data = reader.result.substr( reader.result.indexOf('base64,') + 'base64,'.length);
        			    alert(base64Data);
                scope.upload = {'selectedFile':{}};
                scope.upload.selectedFile.base64 = base64Data;
        		 scope.upload.selectedFile.filename = scope.files.name;
        		 
        		 scope.upload.selectedFile.filetype = scope.files.type;
        		 scope.upload.selectedFile.filesize = scope.files.size;
        			}
               /* var fileReader = new FileReader();
                fileReader.readAsDataURL(scope.files);
                var base64Data = fileReader.result.substr( fileReader.result.indexOf('base64,') + 'base64,'.length);
                scope.upload = {'selectedFile':{}};
                scope.upload.selectedFile.base64 = base64Data;
        		 scope.upload.selectedFile.filename = scope.files.name;
        		 
        		 scope.upload.selectedFile.filetype = scope.files.type;
        		 scope.upload.selectedFile.filesize = scope.files.size;
                */
            });
        	
        	
           
         scope.uploadFileTypeCheck = function(){
        	
        	 
        		var file = scope.upload.selectedFile;
        		var fileextensions = file.filename.replace(/^.*\./, '');
        		
        			if( fileextensions == 'csv'|| fileextensions == 'txt' || fileextensions == 'xlsx' || fileextensions =='docx' ||fileextensions =='pdf' || fileextensions =='png' || fileextensions =='jpeg' || fileextensions =='jpg' || fileextensions =='xls' || fileextensions =='doc') {
        				
        				scope.disableuploadbutton = false;
        				
        		}
        			else{
        				scope.disableuploadbutton = true;
        			}
        		
        	}
        	
        	DocumentDetailsController.BrowseFile = function(ev){
        		angular.element('#upload').trigger('click');
        	}
        	
        	DocumentDetailsController.uploadFileTemplate =function(ev){
	        		mdDialog.show({
	  		          clickOutsideToClose: false,
	  		          scope: scope,        
	  		          preserveScope: true,    
	  			      fullscreen: 'md' ,       
	  		          templateUrl: 'UploadFileTemplate.html',
	  		          controller: function DialogController($scope,$window,$rootScope, $mdDialog) {
	  		        	
	  		    	  	$scope.closeView = function() { 
	  		    	  		$scope.upload={};
	  		    	  	DocumentDetailsController.total=null;
	  		        	DocumentDetailsController.loaded=null;
	  		         		mdDialog.hide();
	  		         		
	  		         	}
	                  }
	                });
        	}
        	
        	DocumentDetailsController.closeView = function() { 
        		scope.upload = {};
        		scope.disableuploadbutton = false;
	         		mdDialog.hide();
	         		
	         	}
        	
DocumentDetailsController.deleteDocument = function(data){
        		
        		
        		var confirm = mdDialog.confirm().title("Click 'Yes' to confirm deletion. Click 'No' to go back.").targetEvent().ok('Yes').cancel('No');
        		mdDialog.show(confirm).then(function () { 
        			BusinessLogic.PostMethod('deleteDocumentsDetails',data).then(function(response){
            			
            			BusinessLogic.PostMethod('getDocumentDetails',rootScope.selectedEmployee.employeeID).then(function(response){ 
            				notification.notify('File Deleted Successfully');
                			DocumentDetailsController.Details = response.data; 
                			angular.forEach(response.data, function(value,key){
                				value.createdDate = convertMillToDate.toDate(value.createdDate);
        		    			value.modifiedDate = convertMillToDate.toDate(value.modifiedDate);
                			});	    		
                			
        				},function(reason){
        					
        				});
            			
        			},function(){});
        		}, function () { });
        		
        		
        		
        	}
        	
        	DocumentDetailsController.dowloadfile = function(data){
        	
        		function b64toBlob(b64Data, contentType, sliceSize) {
        			  contentType = contentType || '';
        			  sliceSize = sliceSize || 512;

        			  var byteCharacters = atob(b64Data);
        			  var byteArrays = [];

        			  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        			    var slice = byteCharacters.slice(offset, offset + sliceSize);

        			    var byteNumbers = new Array(slice.length);
        			    for (var i = 0; i < slice.length; i++) {
        			      byteNumbers[i] = slice.charCodeAt(i);
        			    }

        			    var byteArray = new Uint8Array(byteNumbers);

        			    byteArrays.push(byteArray);
        			  }
        			    
        			  var blob = new Blob(byteArrays, {type: contentType});
        			  return blob;
        			}


        			var contentType = data.documentType ;
        			var b64Data = data.document ;

/*        			var b64Data = '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'*/
/*        			var b64Data = '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';*/

        			var blob = b64toBlob(b64Data, contentType);
        			
        			 FileSaver.saveAs(blob, data.documentName); 
        	}
        	
        	
        	
        	DocumentDetailsController.uploadfile = function(){
        		var elem = document.getElementById("myBar");
        		var width = 10;
        	   	     var timerID = setInterval(function(){
        		    	  if (width >= 100) {
        		              clearInterval(timerID);
        		          } else {
        		              width++; 
        		              elem.style.width = width + '%'; 
        		              elem.innerHTML = +  width * 1 + '%';
        		            
        		          }
        		    	  },1000);
        		 
        		   
        		  
        		  
        		scope.sampleObject = {};
        		scope.sampleObject.employeeID = rootScope.selectedEmployee.employeeID;
        		scope.sampleObject.documentsID = null;
        		scope.sampleObject.document = scope.upload.selectedFile.base64;
        		scope.sampleObject.documentName = scope.upload.selectedFile.filename;
        		scope.sampleObject.documentType = scope.upload.selectedFile.filetype;
        		scope.sampleObject.createdBy = rootScope.userData.iD;
        		scope.sampleObject.modifiedBy = rootScope.userData.iD;
        		scope.sampleObject.createdDate = null;
        		scope.sampleObject.modifiedDate = null;
        		scope.sampleObject.employeeName = null;
        		
        		scope.sampleObject.fileExtension = scope.upload.selectedFile.filename.replace(/^.*\./, '');
        		
        		if(scope.upload.selectedFile.filesize <= 2000000){
        			BusinessLogic.PostMethod('saveDocumentDetails',scope.sampleObject).then(function(response){ 
               		 elem.style.width = 100 + '%';
               		
               		 
               		DocumentDetailsController.closeView();
               		
               		BusinessLogic.PostMethod('getDocumentDetails',rootScope.selectedEmployee.employeeID).then(function(response){ 
               			notification.notify('File Uploaded Successfully');
            			DocumentDetailsController.Details = response.data; 
            			angular.forEach(response.data, function(value,key){
            				value.createdDate = convertMillToDate.toDate(value.createdDate);
    		    			value.modifiedDate = convertMillToDate.toDate(value.modifiedDate);
            			});	    		
            			
    				},function(reason){
    					
    				});
           			
       			},function(reason){
       				
       			});
        		}
        		
            	
        	}
        	
        	
        	
        	
        		
        }],
        controllerAs: 'DocumentDetailsController',
        link: function(scope, element, attrs, controllers) { },
        templateUrl : 'Partials/Documents.html'
		}
})

.directive('interviews',function(){ 
	return{
		restrict : "E",
        controller: ['$window', '$state', '$q', '$mdDialog','$scope','$rootScope','BusinessLogic','BusinessLogic1','$http','notification', function(window, state, Q, mdDialog,scope,rootScope,BusinessLogic,BusinessLogic1,http,notification){
        	
        	var InterviewsController = this;       	
        	rootScope.selectedView ="Home.IndividualEmployee.Interviews";        	       	
        	/*InterviewsController.edit = false;*/
        	InterviewsController.edit = rootScope.isSelectedNew ? true :false;
        	InterviewsController.selectedDomain = 'null'; 
        	InterviewsController.selectedDomainName = 'null';
        	/*InterviewsController.InterviewData = {'empID' : rootScope.selectedEmployee.employeeID, 
        										  'interviewDomainID' : InterviewsController.selectedDomain};*/ 
        	Bind();
        	function Bind(){ 
        		
        		getInterviewDetails(); 
        			BusinessLogic.GetMethod('getInterviewDomainDetails').then(function(resp){   
					  InterviewsController.domains = resp; 
				    },function(reason){});       			
            }
        	
        	InterviewsController.changeEmploymentStatus = function(){
	        	BusinessLogic.PostMethod('changeEmployeeStatus',rootScope.selectedEmployee.employeeID).then(function(response){    			
	    			notification.notify(response.data.status);
	    		},function(){});
        	}
        	
        	function getTechStreams(){ 
        		BusinessLogic.GetMethod('getStaticSteams').then(function(resp){   
					  InterviewsController.technologyStreams = resp; 
				    },function(reason){});
        	}
        	
        		function getInterviewDetails (){ 
        	
        		BusinessLogic.PostMethod('getInterviewDetails',{'empID' : rootScope.selectedEmployee.employeeID}).then(function(resp){ 
    				InterviewsController.data = resp.data; 
    				if(!resp.data.interviewDomainID){
    					InterviewsController.edit= true; 
    				}
    				if(InterviewsController.selectedDomain == 'null' && resp.data.interviewDomainID != undefined){ 
    					InterviewsController.selectedDomain = resp.data.interviewDomainID;
    					angular.forEach(InterviewsController.domains, function(value, key){     					
    						if(value.interviewDomainID == InterviewsController.selectedDomain){
    							InterviewsController.selectedDomainName = value.interviewDomainName; 
    						}
    					}); 
    					if(InterviewsController.selectedDomainName == 'Technology'){
    						  getTechStreams();  
    					}
    				}
    			},function(reason){});
        		        	
        	}
        		       
        	InterviewsController.ChangeEditMode = function(){
        		
        		InterviewsController.edit = !InterviewsController.edit;        			
        		/*getInterviewDetails();*/        		        		
        	}
        	
        	InterviewsController.domainChange = function(selectedDomain){        		
        		InterviewsController.selectedDomain = selectedDomain;
        		angular.forEach(InterviewsController.domains, function(value, key){
				  if(value.interviewDomainID == InterviewsController.selectedDomain){
					InterviewsController.selectedDomainName = value.interviewDomainName; 
				  }				  
			    })
			    if(InterviewsController.selectedDomainName == 'Technology'){
					  getTechStreams();  
				}
        		getInterviewDetails();
        	}
        	        	
        	InterviewsController.saveOrUpdate = function(ev, form, data) { 
        		 
        		if(form.$invalid){
        			angular.forEach(form.$error, function (field) {
                        angular.forEach(field, function(errorField){
                          errorField.$setTouched();
                        })
                      });
        		}
        		else{        		
        		InterviewsController.saveData = [];
        		        		
        		if(InterviewsController.selectedDomainName == 'Business'){
        			data.businessDomain.employeeID = rootScope.selectedEmployee.employeeID;
        			data.businessDomain.createdBy = rootScope.userData.iD; 
            		data.businessDomain.modifiedBy = rootScope.userData.iD; 
            		data.businessDomain.interviewDomainID = InterviewsController.selectedDomain; 
        			InterviewsController.saveData.push(data.businessDomain);
        		}
        		if(InterviewsController.selectedDomainName == 'Technology'){
        			data.technologyDomain.employeeID = rootScope.selectedEmployee.employeeID;
        			data.technologyDomain.createdBy = rootScope.userData.iD; 
            		data.technologyDomain.modifiedBy = rootScope.userData.iD; 
            		data.technologyDomain.interviewDomainID = InterviewsController.selectedDomain; 
        			InterviewsController.saveData.push(data.technologyDomain);
        		}
        		if(InterviewsController.selectedDomainName == 'Others'){
        			data.othersDomain.employeeID = rootScope.selectedEmployee.employeeID;
        			data.othersDomain.createdBy = rootScope.userData.iD; 
            		data.othersDomain.modifiedBy = rootScope.userData.iD; 
            		data.othersDomain.interviewDomainID = InterviewsController.selectedDomain; 
        			InterviewsController.saveData.push(data.othersDomain);  
        		}
        		angular.forEach(InterviewsController.domains, function(value, key){ 
        			if(InterviewsController.selectedDomainName == value.interviewDomainName){
        				InterviewsController.saveData.push({'interviewDomainID' : value.interviewDomainID}); 
        			}
        		})
        		
        		BusinessLogic.PostMethod('saveOrUpdateInterviewDomainDetails',InterviewsController.saveData).then(function(response){ 
        			InterviewsController.edit = false;
        			getInterviewDetails();
        			notification.notify(response.data.status); 
				},function(reason){
					notification.notify(reason.data.status);
				});
        	   }
        	  }
        	
        
        	
        }],
        controllerAs: 'InterviewsController',
        link: function(scope, element, attrs, controllers) { },
        templateUrl : 'Partials/Interviews.html'
		}
})
