app.controller('indexController', function ($scope, $location, $routeParams, $cookies, jobsFactory) {
	function getPayload(token) {
		var base64Url = token.split('.')[1];
		var base64 = base64Url.replace('-', '+').replace('_', '/');
		return JSON.parse(window.atob(base64));
	}

	function appendJobs(){
		if(!$scope.jobs){
			$scope.jobs = [];
		}
		for(var i = $scope.data[1]*5; i < ($scope.data[1]+1)*5; i++){
			$scope.jobs[i] = $scope.data[0][i];
			if ($scope.data[0][i+1])
				continue;
			else
				break;

		}
		if ($scope.data[0][$scope.jobs.length])
			$scope.data[1] += 1;
	}
	
	if ($cookies.get('token')) {
		var payload = getPayload($cookies.get('token'));
		$scope.data = ["waiting"];
		$scope.id = payload.id;
		$scope.name = payload.first_name + " " + payload.last_name;
		$scope.user_type = 'truck_type' in payload ? 'trucker' : 'contractor';
		$scope.error = null;
		jobsFactory.index(function(data) {
			if (data.errors)
				$scope.error = "Something went wrong, please wait a while and try reloading."
			else {
				$scope.data[0] = data;
				$scope.data[1] = 0;
				appendJobs();
			}
		});
	}
	else
		$location.url('/welcome');


	$scope.append = function(){
		appendJobs();
	};

	$scope.logout = function() {
		$cookies.remove('token');
		$location.url('/welcome');
	}
});
