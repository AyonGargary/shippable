

function GitHubCtrl($scope, $http)
{

	$scope.getGitInfo = function ()
	{

		$scope.userNotFound = false;

		$scope.loaded = false;
		var splitted = $scope.url.split('/');
		var n1 = splitted.indexOf("github.com");

		$scope.username = splitted[n1 + 1];

		$scope.reponame = splitted[n1 + 2];

		var date = new Date();

		date.setDate(date.getDate()-1);

		$scope.yesterday = date.toISOString();

		var date2 = new Date();
    date2.setDate(date.getDate()-7);
		$scope.weekAgo = date2.toISOString();




     
		$http.get("https://api.github.com/users/" + $scope.username).success(function (data) 
		{

			if (data.name == "") data.name = data.login;

			$scope.user = data;

			$scope.loaded = true;

		}).error(function ()
		{

			$scope.userNotFound = true;

		});

		$http.get("https://api.github.com/repos/" + $scope.username + "/" + $scope.reponame + "/issues?since=" + $scope.yesterday).success(function(data)
		{

			$scope.issues = data;

			$scope.issuesNumber = Object.keys($scope.issues).length;

		});


		$http.get("https://api.github.com/repos/" + $scope.username + "/" + $scope.reponame + "/issues?since=" + $scope.weekAgo).success(function(data)
		{

			$scope.issues = data;

			$scope.issuesNumber2 = Object.keys($scope.issues).length;

		});



		$http.get("https://api.github.com/repos/" + $scope.username + "/" + $scope.reponame).success(function (data)
		{

			$scope.repos = data;

			$scope.issuesFound = $scope.repos.open_issues_count > 0 ;
		});

	}

}


