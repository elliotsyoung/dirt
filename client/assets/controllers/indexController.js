app.controller('indexController', function ($scope, $location, $routeParams, $cookies, $anchorScroll, jobsFactory) {
	function getPayload(token) {
		var base64Url = token.split('.')[1];
		var base64 = base64Url.replace('-', '+').replace('_', '/');
		return JSON.parse(window.atob(base64));
	}

	if ($cookies.get('token')) {
		var payload = getPayload($cookies.get('token'));
		$scope.id = payload.id;
		$scope.name = payload.first_name + " " + payload.last_name;
		$scope.user_type = 'truck_type' in payload ? 'trucker' : 'contractor';
		$scope.error = null;
		jobsFactory.index(function(data) {
			if (data.errors)
				$scope.error = "Something went wrong, please wait a while and try reloading."
			else
				$scope.jobs = data;

			console.log($scope.jobs);
		});
	}
	else
		$location.url('/welcome');

	$anchorScroll();

	$scope.logout = function() {
		$cookies.remove('token');
		$location.url('/welcome');
	}
});
