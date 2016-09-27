var app = angular.module('app', ['nvd3', 'ngMaterial']);
app.controller('ctrl', function($scope, $http) {
    $scope.personNames = ['alex', 'kristino4ka'];
    $scope.endpoints = ['http://localhost:8080', 'http://91.240.84.2:8080', 'http://192.168.10.22:8080', 'http://192.168.10.21:8080'];
    // $scope.endpoint = 'http://localhost:8080';
    $scope.weightHints = [10, 15, 30, 50, 100, 150, 200, 250, 300, 350];

    $scope.putFoody = function() {
      var food = $scope.selectedFood ? $scope.selectedFood.value2 : $scope.searchFood; // in russian :) cooked sausage doctor
      var request = {
        "name": food,
        "person": $scope.foodperson
      };
      if ($scope.fooddate) {
        request.date = $scope.fooddate;
      };
      if ($scope.selectedWeight || $scope.searchWeight) {
        request.weight = $scope.selectedWeight ? $scope.selectedWeight : $scope.searchWeight;
      }
      // var params = '?name=' + $scope.foodname + '&person=' + $scope.foodperson;
      // if ($scope.fooddate) {
      //   params = params + '&date=' + $scope.fooddate;
      // }
      // if ($scope.foodweight) {
      //   params = params + '&weight=' + $scope.foodweight;
      // }
      // $http.get($scope.endpoint + '/foody' + params).then(function(res) {
      //   console.log(res);
      //   $scope.refreshFoodies();
      // });
      var prefix = $scope.endpoint ? $scope.endpoint : '';
      $http.put(prefix + '/foody', request).then(function(res) {
        console.log(res);
        $scope.refreshFoodies();
      });
    }

    $scope.refreshFoodies = function() {
      var prefix = $scope.endpoint ? $scope.endpoint : '';
      $http.get(prefix + '/foodies').then(function(res) {
        $scope.foodies = res.data;
      })
    }

    $scope.refreshFoodies();

    $scope.deleteFoody = function(foody) {
      var prefix = $scope.endpoint ? $scope.endpoint : '';
      $http.delete(prefix + '/foody?id=' + foody.id).then(function(res) {
        var idx = $scope.foodies.indexOf(foody);
        $scope.foodies.splice(idx, 1);
      });
    }

    $scope.piePerson = 'kristino4ka';
    $scope.chartDatePeriods = [
      {id: 'day', desc: 'This day'},
      {id: 'week', desc: 'This week'},
      {id: 'month', desc: 'This month'},
      {id: 'year', desc: 'Whole year'}
    ]
    $scope.pieOptions = {
      chart: {
        type: 'pieChart',
        height: 500,
        width: 500,
        x: function(d){return d.x;},
        y: function(d){return d.y;},
        showLabels: true,
        duration: 500,
        labelThreshold: 0.01,
        labelSunbeamLayout: true,
        legend: {
          margin: {
            top: 5,
            right: 5,
            bottom: 5,
            left: 0
          }
        }
      },
      title: {
        enable: true,
        text: 'Calories distribution'
      }
    };

    $scope.barChartOptions = {
            chart: {
                type: 'historicalBarChart',
                height: 450,
                width: 500,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 65,
                    left: 65
                },
                x: function(d){return d[0];},
                y: function(d){return d[1];},
                // clipEdge: true,
                duration: 500,
                xAxis: {
                    axisLabel: 'Date',
                    showMaxMin: false,
                    // rotateLabels: 30,
                    tickFormat: function(d){
                        // return d3.format(',f')(d);
                        // return new Date(d);
                        return d3.time.format("%d-%m")(new Date(d));
                    },
                },
                yAxis: {
                    axisLabel: 'Calories',
                    axisLabelDistance: -20,
                    tickFormat: function(d){
                        return d3.format(',.1f')(d);
                    },
                },
                tooltip: {
                  // headerEnabled: true,
                  // headerFormatter: function(d,q,e) {
                  //   return 'asdf';
                  // },
                  valueFormatter: function (d, i) {
                    return d3.format(',.1f')(d) + ' calories';
                  },
                  keyFormatter: function(d) {
                    return d3.time.format("%d-%m")(new Date(d));
                  }
                },
                zoom: {
                    enabled: true,
                    scaleExtent: [1, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: true,
                    unzoomEventType: 'dblclick.zoom'
                }
            }
        };

    $scope.refreshChart = function() {
      var prefix = $scope.endpoint ? $scope.endpoint : '';
      var dateParam = $scope.pieDate ? '&type=' + $scope.pieDate.id : '';
      $http.get(prefix + '/caloriesChart?personName=' + $scope.piePerson + dateParam).then(function(res) {
        $scope.pieData = res.data;
      });
      $http.get(prefix + '/barChart?personName=' + $scope.piePerson).then(function(res) {
        $scope.barData = [{
          key: "Calories distribution",
          bar: true,
          values: res.data
        }];
      });
    }

    $scope.refreshChart();

    var prefix = $scope.endpoint ? $scope.endpoint : '';
    $http.get(prefix + '/allProducts').then(function(res) {
      var products = [];
      for (var i in res.data) {
        var p = res.data[i];
        products.push({
          value1: p.name.toLowerCase(),
          value2: p.runame.toLowerCase(),
          p: p
        });
      }
      $scope.products = products;
    })
    $scope.searchProducts = function(query) {
      var results = query ? $scope.products.filter(createFilterFor(query)) : $scope.products;
      return results;
    }
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.value1.indexOf(lowercaseQuery) !== -1 || state.value2.indexOf(lowercaseQuery) !== -1);
      };
    }
    $scope.newProduct = function(text) {

    }

    $scope.createNewProduct = function() {
      var request = {
        "name": "Olivie",
        "runame": "Оливье",
        "calories": 198,
        "protein": 7,
        "fat": 16,
        "сarbs": 8,
      }
      var prefix = $scope.endpoint ? $scope.endpoint : '';
      $http.post(prefix + '/product', request).then(function(res) {
        console.log(res);
      })
    }
});
