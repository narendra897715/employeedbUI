var ed=angular.module('EmpDB',['ngMaterial', 'ngMessages', 'ngAnimate','ui.router','md.data.table','EmpDB.ScreenDirectives','EmpDB.Services','EmpDB.EmpDBDirectives']);

ed.controller('EmpDBController',function($scope,$rootScope,$mdDialog,BusinessLogic1,$q,$state){
	
	$state.go('Home.Employees');
})



ed.config(['$stateProvider','$urlRouterProvider','$locationProvider','$mdDateLocaleProvider', '$compileProvider',function($stateProvider,$urlRouterProvider,$locationProvider,$mdDateLocaleProvider, $compileProvider){
	$compileProvider.preAssignBindingsEnabled(true);
	$mdDateLocaleProvider.formatDate = function (date) {  if (date == undefined) { return "" } else {  return moment(date).format('MMM DD, YYYY'); } };

	$urlRouterProvider.otherwise('Home/Employees');
	$locationProvider.hashPrefix('');
	
	$stateProvider.state({name : 'Home',url : '/Home',template : '<home layout="column" style="over-flow:hidden;" flex></home>'})
				  .state({name : 'Home.Employees',url : '/Employees',template : '<employees layout="column" style="over-flow:hidden;" flex></employees>'})
				  .state({name : 'Home.IndividualEmployee',url : '/IndividualEmployee',template : '<individual-employee layout="column" style="display:grid" flex></individual-employee>'})
				  .state({name : 'Home.IndividualEmployee.PersonalDetails',url : '/PersonalDetails',template : '<personal-details layout="column" style="over-flow:hidden;" flex></personal-details>'})
				  .state({name : 'Home.IndividualEmployee.FinancialDetails',url : '/FinancialDetails',template : '<financial-details layout="column" style="over-flow:hidden;" flex></financial-details>'})
				  .state({name : 'Home.IndividualEmployee.EducationalDetails',url : '/EducationalDetails',template : '<educational-details layout="column" style="over-flow:hidden;" flex></educational-details>'})
				  .state({name : 'Home.IndividualEmployee.ExperienceDetails',url : '/ExperienceDetails',template : '<experience-details layout="column" style="over-flow:hidden;" flex></experience-details>'})
				  .state({name : 'Home.IndividualEmployee.SkillDetails',url : '/SkillDetails',template : '<skill-details layout="column" style="over-flow:hidden;" flex></skill-details>'})
				  .state({name : 'Home.IndividualEmployee.DocumentDetails',url : '/DocumentDetails',template : '<document-details layout="column" style="over-flow:hidden;" flex></document-details>'})
				  .state({name : 'Home.IndividualEmployee.Interviews',url : '/Interviews',template : '<interviews layout="column" style="over-flow:hidden;" flex></interviews>'})
				  
}]);


ed.run(function($transitions, $rootScope, $window,$state,BusinessLogic1,BusinessLogic){
	$rootScope.loadingPanel = false;	

	$rootScope.ApplicationURL = 'http://10.10.0.57:8080';	

	$transitions.onStart({}, function(transition) { 
		$rootScope.loadingPanel = true;	
		if($window.localStorage.getItem("AuthenticationToken") == null){ 
			debugger;
			$window.location.href=$rootScope.ApplicationURL+'/Authentication/'; 
			}
		else{
			
			}
		});
	$transitions.onSuccess({}, function(transition) { 
		if($rootScope.UserScreens == undefined){
			$rootScope.ProjectName = "EmployeeDB";
			BusinessLogic1.PostMethod('userStates',$rootScope.ProjectName).then(function(response){
				$rootScope.UserScreens = response;
				var count=0;
				for(var i=0;i<$rootScope.UserScreens.length;i++){
					if(transition.$to().name == $rootScope.UserScreens[i].state){
						$rootScope.Urlfromdb = $rootScope.UserScreens[i].url;
						count++;
						break;
					}
					else{
						continue;
					}
				}
				if(count >= 1){
					if($rootScope.selectedEmployee != undefined && $rootScope.isSelectedNew == false){
						$window.location.href = $rootScope.ApplicationURL + transition.$to().name;
					}
					else{
						$window.location.href =  $rootScope.ApplicationURL+ '/EmployeeDB/#/Home/Employees'
					}
				}
				else{
					$window.location.href = $rootScope.ApplicationURL+'/EmployeeDB/#/Home/Employees';
				}
			},function(reason){})
		}
		else{
			var count=0;
			for(var i=0;i<$rootScope.UserScreens.length;i++){
				if(transition.$to().name == $rootScope.UserScreens[i].state){
					$rootScope.Urlfromdb = $rootScope.UserScreens[i].url;
					count++;
					break;
				}
				else{
					continue;
				}
			}
			if(count >= 1){
				if($rootScope.selectedEmployee != undefined && $rootScope.isSelectedNew == false){
					$window.location.href = $rootScope.ApplicationURL + transition.$to().name;
				}
				else{
					$window.location.href = $rootScope.ApplicationURL+ '/EmployeeDB/#/Home/Employees'
				}
			}
			else{
				$window.location.href = $rootScope.ApplicationURL+'/EmployeeDB/#/Home/Employees';
			}
		}
		
		
		/*$rootScope.urlRestriction = function(){
			var count=0;
			for(var i=0;i<$rootScope.UserScreens.length;i++){
				if(transition.$to().name == $rootScope.UserScreens[i].state){
					$rootScope.Urlfromdb = $rootScope.UserScreens[i].url;
					count++;
					break;
				}
				else{
					continue;
				}
			}
			if(count >= 1){
				$window.location.href = $rootScope.Urlfromdb;
			}
			else{
				$window.location.href = $rootScope.ApplicationURL+'/Authentication/';
			}
		}*/
		$rootScope.loadingPanel = false; });
	
})