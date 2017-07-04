var app = angular.module('blogApp', ['angular.filter','ngRoute']);

app.directive('topSec', function () {
        return {
			restrict: 'AE',
            templateUrl: 'views/topSec.html'
        };
});

app.directive('blogSec', function () {
        return {
			restrict: 'AE',
            templateUrl: 'views/blogSec.html'
        };
});

app.directive('categorySec', function () {
        return {
			restrict: 'AE',
            templateUrl: 'views/categorySec.html'
        };
});

app.directive('recentpostSec', function () {
        return {
			restrict: 'AE',
            templateUrl: 'views/recentpostSec.html'
        };
});

app.directive('archivesSec', function () {
        return {
			restrict: 'AE',
            templateUrl: 'views/archivesSec.html'
        };
});

app.config([ '$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {   
        $routeProvider
		.when('/:postID',{
		  		templateUrl : 'views/fullblogSec.html',
				controller: 'blogController'
		})
		.when('/category/:postCAT',{
		  		templateUrl : 'views/categoryblogSec.html',
				controller: 'catblogController'
		})
		.when('/yearcat/:yearval',{
		  		templateUrl : 'views/archiveblogSec.html',
				controller: 'archiveblogController'
		})
		.when('/',{
		  		templateUrl : 'views/home.html'
		})
		.otherwise({
            redirectTo : '/'
        });
        //$locationProvider.html5Mode(true); 
    } 
]);


app.controller('blogCtrl', function($scope, $http, $rootScope, $routeParams) {
	
   	$scope.title = "Angualrjs Blog";
	
	
	$http({
				method:'GET', 
				url:'JSON/blog.json'
			})
			.success(function(response){
				$rootScope.blogposts = response;
				console.log($rootScope.blogposts);
				
				//fetch date from JSON data, get the year using slice fucntion of javascript and put them in year array. 
				var data = $rootScope.blogposts;
				var total = data.length;
				var yearlist = [];
				var obj = {};
				data.forEach(function (a) {
					var y = a.post_date.slice(0, 4);	
					yearlist.push(y);				
				});
				console.log(yearlist);
				$rootScope.yearlist = yearlist;
				//count the year coming how many times and put them in obj array.
				for (var i = 0, j = total; i < j; i++) {
					   obj[yearlist[i]] = (obj[yearlist[i]] || 0) + 1;
				}		
				$rootScope.datelist = obj;
				console.log($rootScope.datelist);

				$scope.currentPage = 0;
				$scope.pageSize = 4;

				$scope.numberOfPages=function(){
					return Math.ceil($scope.blogposts.length/$scope.pageSize);
				}
			});
	
				

	$http({
				method:'GET', 
				url:'JSON/categories.json'
			})
			.success(function(response){
				$scope.categories = response;
				//console.log($scope.categories);
			});
		
		
	  
});


app.controller('blogController', function($scope, $http, $rootScope, $routeParams, $filter) {
			
			$scope.blogDetails = $filter('filter')($rootScope.blogposts, {post_id:$routeParams.postID})[0];
			console.log($scope.blogDetails);
			
});

app.controller('catblogController', function($scope, $http, $rootScope, $routeParams, $filter) {
			
			$rootScope.postCAT = $routeParams.postCAT;
			$scope.catblogLists = $filter('filter')($rootScope.blogposts, {post_category:$routeParams.postCAT});
			console.log($scope.catblogLists);
			
});

app.controller('archiveblogController', function($scope, $rootScope, $routeParams) {
			
			$rootScope.yearval = $routeParams.yearval;
			
});


app.filter('currentDates', function() {
  return function(eventdata) {
    var data_date, filtered_list, i, today;
    filtered_list = [];
    i = 0;
    while (i < eventdata.length) { 
      today = Date.now();
      data_date = new Date(eventdata[i].date);
      if (today <= data_date) {
        filtered_list.push(eventdata[i]);
      }
      i++;
    }
    return filtered_list;
  };
});

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

app.filter('dateToISO', function() {
  return function(input) {
    input = new Date(input).toISOString();
    return input;
  };
});
