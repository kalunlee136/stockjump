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
    //$scope.store.push(data);
    //console.log('tags', $scope.tags)
    //$scope.tags.push(data.name);
    
    var chart = $('#container').highcharts();
    chart.addSeries(data);
  
    document.getElementById("stocks").innerHTML += '<div class="tag" id='+data.name+'>'+ '<p>'+data.name+'</p></div>';
    
    var tag = document.getElementsByClassName('tag');
    for (var i=0;i< tag.length;i++){
      tag[i].onclick = function(){
        socket.emit('remove',this.id);
      };
      
    }
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
            series: []
        });
    });
  }
  
  // receives socket info to remove stock symbol from chart
  socket.on('remove', function(id) {
    var chart = $('#container').highcharts();
    console.log(chart.series);
    for(var i=0; i < chart.series.length; i++){
      if (chart.series[i].name === id) {
        console.log('series',chart.series[i])
        chart.series[i].remove();
        document.getElementById(id).remove();
      }
       
    }
  });
  
  /*var removeTag = function(id) {
    var chart = $('#container').highcharts();
    console.log(chart.series);
    for(var i=0; i < chart.series.length; i++){
      if (chart.series.name === id)
        console.log(',',chart.series[i]);
        chart.series[i].remove();
        document.getElementById(id).innerHTML = '';
        document.getElementById(id).remove();
    }
  }*/ 
  
  $scope.render();
}])

//overload a remove() function so we don't have to always 
//go to the parent 
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

App.factory('storeFactory',[function(){
  var factory  = {}
  
  factory.store = [];
  
  return factory;
}]);