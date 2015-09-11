
//function GitHubCtrl called on click of submit button
//$scope describes scope of parameter defined in HTML file
//%htttp is to parse the html file
function GitHubCtrl($scope, $http)
{
	
	$scope.getGitInfo = function ()
	{
		//initialilizing userNotFound to False
		$scope.userNotFound = false;
		//initializing loaded to false
		$scope.loaded = false;
		//splitting the URL at every '/' and storing it as string array
		var splitted = $scope.url.split('/');
		//n1 is array index where github.com is found
		var n1 = splitted.indexOf("github.com");
		//username is always the next
		//Example : https://github.com/Shippable/support/issues
		//Here Shippable is the username
		$scope.username = splitted[n1 + 1];
		//In above Example support is the Repository Name
		$scope.reponame = splitted[n1 + 2];
		//date stores the current date and time
		var date = new Date();
		//date now stores date and time 24 hours before
		date.setDate(date.getDate()-1);
		//yesterday is the string notation for date 24 hours ago
		$scope.yesterday = date.toISOString();

		var date2 = new Date();
		//Similarly date2 stores date and time 7 days ago
		date2.setDate(date.getDate()-7);
		//week ago stores the date for 7 days ago in string format
		$scope.weekAgo = date2.toISOString();


		//If the get for the url defined below works i.e. there is a user for the mentioned username
		$http.get("https://api.github.com/users/" + $scope.username).success(function (data) 
		{

			if (data.name == "") data.name = data.login;//name fetches data from login field

			$scope.user = data;

			$scope.loaded = true;

		}).error(function ()
		{
			//If there isn't any user for the above username 
			$scope.userNotFound = true;

		});
		//Query 1 : Issues open in last 24 hours
		$http.get("https://api.github.com/repos/" + $scope.username + "/" + $scope.reponame + "/issues?since=" + $scope.yesterday).success(function(data)
		{

			$scope.issues = data;
			//length of th JSON file in the fetched issues is the answer
			$scope.issuesNumber = Object.keys($scope.issues).length;

		});

		//Query 2 : Issues opened in last 7 days
		$http.get("https://api.github.com/repos/" + $scope.username + "/" + $scope.reponame + "/issues?since=" + $scope.weekAgo).success(function(data)
		{

			$scope.issues = data;
			//here issuesNumber2 stores the dat of number of issues in last 7 days
			$scope.issuesNumber2 = Object.keys($scope.issues).length;

		});


		//Query 0: Total number of open issues
		//Here we use open_issues _count of the link that redirects to your repository and not issues
		$http.get("https://api.github.com/repos/" + $scope.username + "/" + $scope.reponame).success(function (data)
		{

			$scope.repos = data;
			//stores total number of open issues
			$scope.issuesFound = $scope.repos.open_issues_count > 0 ;
		});

	}

}


