var app = angular.module('app', ['nvd3', 'ngMaterial', 'ngCookies']);
app.controller('ctrl', function($scope, $http, $mdToast, $cookies) {
    $scope.personNames = ['alex', 'kristino4ka'];
    $scope.endpoints = ['http://localhost:8080', 'http://91.240.84.2:8080', 'http://192.168.10.22:8080', 'http://192.168.10.21:8080'];
    $scope.endpoint = 'http://localhost:8080';

    var person = $cookies.get('person');
    if (person) {
      $scope.foodperson = person;
      $scope.piePerson = person;
    }
    $scope.changePerson = function() {
      $cookies.put('person', $scope.foodperson);
    }

    $scope.createNewFoody = function() {
      var food = $scope.selectedFood ? $scope.selectedFood.value2 : $scope.searchFood; // save foody in russian :) cooked sausage doctor
      var request = {
        "name": food,
        "person": $scope.foodperson,
        "weight": $scope.foodweight
      };
      if ($scope.fooddate) {
        request.date = $scope.fooddate;
      };
      $scope.saveFoody(request);
    }

    $scope.saveFoody = function(foody) {
      var prefix = $scope.endpoint ? $scope.endpoint : '';
      $http.post(prefix + '/foody', foody).then(function(res) {
        var savedFoodyId = res.data.data;
        foody.id = savedFoodyId;
        $scope.foodies.push(foody)
        $scope.showToast('Запись сохранена');
      });
    }

    $scope.deleteFoody = function(foody) {
      var prefix = $scope.endpoint ? $scope.endpoint : '';
      $http.delete(prefix + '/foody?id=' + foody.id).then(function(res) {
        var idx = $scope.foodies.indexOf(foody);
        $scope.foodies.splice(idx, 1);
      });
    }

    $scope.createNewProduct = function() {
      var newProduct = {
        "name": $scope.npName,
        "runame": $scope.npRuname,
        "calories": $scope.npCalories,
        "protein": $scope.npProtein,
        "fat": $scope.npFat,
        "carbs": $scope.npCarbs,
      }
      $scope.saveProduct(newProduct, function(res) {
        var savedProductId = res.data.data;
        newProduct.id = savedProductId;
        $scope.products.push({
          value1: newProduct.name.toLowerCase(),
          value2: newProduct.runame.toLowerCase(),
          p: newProduct
        });
        $scope.showToast('Продукт добавлен');
      });
    }

    $scope.saveProduct = function(p, successFn) {
      var prefix = $scope.endpoint ? $scope.endpoint : '';
      $http.post(prefix + '/product', p).then(successFn);
    }

    $scope.deleteProduct = function(p) {
      var prefix = $scope.endpoint ? $scope.endpoint : '';
      $http.delete(prefix + '/product?id=' + p.id).then(function(res) {
        var success = res.data.success;
        if (success) {
          var idx = $scope.products.indexOf(p);
          $scope.products.splice(idx, 1);
        } else {
          $scope.showToast('Ошибка при удалении');
        }
      });
    }

    // load products
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
    });
    // load foodies
    var prefix = $scope.endpoint ? $scope.endpoint : '';
    $http.get(prefix + '/foodies').then(function(res) {
      $scope.foodies = res.data;
    });

    // cache control
    $scope.deleteProductCache = function() {
      var prefix = $scope.endpoint ? $scope.endpoint : '';
      $http.post(prefix + '/dropProductCache', function(res) {
        $scope.showToast('Кэш продуктов очищен');
      });
    }
    $scope.deleteFoodyCache = function() {
      var prefix = $scope.endpoint ? $scope.endpoint : '';
      $http.post(prefix + '/dropProductCache', function(res) {
        $scope.showToast('Кэш фуди очищен');
      });
    }

    // charts
    $scope.chartDatePeriods = [
      {id: 'today', desc: 'Today'},
      {id: 'yesterday', desc: 'Yesterday'},
      {id: 'week', desc: 'This week'},
      {id: 'lastweek', desc: 'Last week'},
      {id: 'month', desc: 'This month'},
      {id: 'lastmonth', desc: 'Last month'},
      {id: 'year', desc: 'This year'},
      {id: 'lastyear', desc: 'Last year'}
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
            bars: {
              dispatch: {
                elementClick: function(t,u) {
                  $scope.refreshChart(t.data[0]);
                }
              }
            }
            // zoom: {
            //     enabled: true,
            //     scaleExtent: [1, 10],
            //     useFixedDomain: false,
            //     useNiceScale: false,
            //     horizontalOff: false,
            //     verticalOff: true,
            //     unzoomEventType: 'dblclick.zoom'
            // }
        }
    };

    $scope.refreshChart = function(timestamp) {
      var prefix = $scope.endpoint ? $scope.endpoint : '';
      var dateParam = $scope.pieDate ? '&specificPeriod=' + $scope.pieDate.id : '';
      var timestampParam = timestamp ? '&timestamp=' + timestamp : '';
      if (timestamp) {
        $scope.pieChartForDate = new Date(timestamp);
      } else if ($scope.pieDate) {
        $scope.pieChartForDate = $scope.pieDate.desc;
      }

      $http.get(prefix + '/caloriesChart?personName=' + $scope.piePerson + dateParam + timestampParam).then(function(res) {
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

    $scope.pieDate = {id: 'today', desc: 'Today'};
    $scope.refreshChart();

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

    $scope.getToastPosition = function() {
      return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };

    function sanitizePosition() {
      var current = $scope.toastPosition;

      if ( current.bottom && last.top ) current.top = false;
      if ( current.top && last.bottom ) current.bottom = false;
      if ( current.right && last.left ) current.left = false;
      if ( current.left && last.right ) current.right = false;

      last = angular.extend({},current);
    }

    $scope.showToast = function(text) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(text)
          .position({top: true, right: true})
          .hideDelay(3000)
      );
    }

});
