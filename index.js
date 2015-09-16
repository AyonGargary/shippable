
//function GitHubCtrl called on click of submit button
//$scope describes scope of parameter defined in HTML file
//%htttp is to parse the html file
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

        $scope.yesterday = date;

        var date2 = new Date();
        date2.setDate(date.getDate()-7);
        $scope.weekAgo = date2;


        $http.get("https://api.github.com/users/" + $scope.username).success(function (data) 
        {

            if (data.name == "") data.name = data.login;

            $scope.user = data;

            $scope.loaded = true;

        }).error(function ()
        {

            $scope.userNotFound = true;

        });

        var pages = 0;
        $http.get("https://api.github.com/repos/" + $scope.username + "/" + $scope.reponame).success(function (data)
        {

            $scope.repos = data;

            $scope.issuesFound = $scope.repos.open_issues_count > 0 ;

            $scope.pages = $scope.issuesFound/100 + 1;
        });
        

        $scope.total_issues =0, $scope.issues_before_24=0, $scope.issues_btw_24_7=0, $scope.issues_beyond_7=0;
    	var i=0;
        for(i=1;i<=18;i++)
        $http.get("https://api.github.com/repos/" + $scope.username + "/" + $scope.reponame + "/issues?per_page=100&page=" + i ).success(function (data)
        {

            $scope.repos = data;
            for(j=0;j<100;j++)
            {
            if(!$scope.repos[j].pull_request)
            {
                if(Date.parse($scope.repos[j].created_at)>$scope.yesterday)
                {
                    $scope.total_issues++;
                    $scope.issues_before_24++;
                }
                else if(Date.parse($scope.repos[j].created_at)<$scope.yesterday && Date.parse($scope.repos[j].created_at)>$scope.weekAgo)
                {
                    $scope.total_issues++;
                    $scope.issues_btw_24_7++;
                }
                else
                {
                    $scope.total_issues++;
                }
            }
            }
          $scope.issues_beyond_7 = $scope.total_issues - $scope.issues_before_24 - $scope.issues_btw_24_7;
        });
        
    }

}
