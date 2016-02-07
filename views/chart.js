var App = angular.module('chart',[]);

App.controller('ChartController',['$scope','storeFactory', function($scope,storeFactory){
  $scope.store = storeFactory.store;
  $scope.tags = []
  
  $scope.submitSymbol = function(){
    if($scope.symbol === '')
      return;
    //$scope.tags.push($scope.symbol);
    socket.emit('news',$scope.symbol);
    $scope.symbol = '';
  }
  
  var socket = io.connect();
  //socket.emit('news','AAPL');
  
  socket.on('news',function(data){
  // socket returns stock data in {stocktag:[list of end prices]} format
    $scope.store.push(data);
    //console.log('tags', $scope.tags)
    //$scope.tags.push(data.name);
    
    var chart = $('#container').highcharts();
    chart.addSeries(data);
     
  })
  
  // chart schema
  $scope.render = function(){
     $(function () {
        $('#container').highcharts({
            chart: {
                type: 'spline'
            },
            title: {
                text: 'Stock Data (measured by closing value)',
                x: -20 //center
            },
            xAxis: {
               type:'datetime'
            },
            yAxis: {
                title: {
                    text: 'Stock Closing Value'
                }
            },
            tooltip: {
                crosshairs: true,
                shared: true
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: $scope.store
        });
    });
  }
  
  $scope.removeTag = function(index){
    $scope.tags.splice(index,1)
    var chart = $('#container').highcharts();
    chart.series[index].remove();
  }  
  
  $scope.render();
}])


App.factory('storeFactory',[function(){
  var factory  = {}
  
  factory.store = [];
  
  return factory;
}]);