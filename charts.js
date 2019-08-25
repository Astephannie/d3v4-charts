google.charts.load('current', {packages: ['corechart', 'bar']});
var thirdChartDateRange = 'week';
var thirdChartAudioType = 'all';
var thirdChartDataType = 'time';

//min-width

function loadData() {
	getFirstChartData('week');
	getThirdChartData('week', 'all', 'time');
}

google.charts.setOnLoadCallback(loadData);

function getFirstChartData(date_range) {
	$('#loadingChartsText').show();
	$('#dropdownFirstChart span').text(capitalizeFirstLetter(date_range));
	$.get('timeoutapi/v1/chart_data/?date='+date_range+'&type=1', function(data, status){	
		drawColColors(data.week_days);
		drawChart(data.audio_types);
		$('#loadingChartsText').hide();
	});
}


function getThirdChartData(date_range, audio_type, data_type) {
	$('#loadingChartsText').show();
	thirdChartDateRange = date_range;
	thirdChartAudioType = audio_type;
	thirdChartDataType = data_type;
	$('#dropdownThirdChart span').text(capitalizeFirstLetter(thirdChartDateRange));
	$('#dropdownTimeouts span').text(capitalizeFirstLetter(thirdChartAudioType));
	$.each($('#thirdChartDataType button'), function(){
		$(this).removeClass('active')
	});
	$('#thirdChartDataType').find('#data_'+data_type).addClass('active');
	var params = 'date='+thirdChartDateRange+'&type=2&audio_type='+thirdChartAudioType+'&data_type='+data_type;
	$.get('timeoutapi/v1/chart_data/?'+params, function(data, status){
		drawScatterPlot(data.data);
		$('#loadingChartsText').hide();
	});
}

function drawColColors(firstChartData) {
	// var data = [['Day', 'Timeouts', 'Debriefs', 'SSP']];
	var data = [['Day', 'Briefings','Opening Timeouts', 'Closing Timeouts']];

    var custom_ticks = [0, 10, 20, 30, 40];
    var custom_count = 5
    if (firstChartData.length < 20) {
        custom_ticks = [0, 10, 20];
        custom_count = 3
    }

	for (var i = 0; i < firstChartData.length; i++) {
		// data.push([firstChartData[i].day_name, firstChartData[i].timeout, firstChartData[i].debrief, firstChartData[i].briefing]);
		data.push([firstChartData[i].day_name, firstChartData[i].briefing, firstChartData[i].timeout, firstChartData[i].closing_timeout]);
	}

	var barData = google.visualization.arrayToDataTable(data);
	var barOptions = {
		bar: {
			groupWidth: "80%"
		},
		backgroundColor: 'transparent',
		//colors: ['#50c4ec', '#016380', '#5fcec7'],
		colors: ['#5fcec7', '#50c4ec', '#016380'], //vatsal-20181225
		hAxis: {
			ticks: [0, 5, 10, 15, 25],
			title: 'Day'
		},
		vAxis: {
			title: 'Number',
            ticks: custom_ticks,
			gridlines: {
				count: custom_count,
				color: "transparent"
			}
		},
		legend: {
			position: 'top',
			alignment: 'start',
			textStyle: {
				color: '#333',
				fontSize: 13
			}
		}
	};

	var barChart = new google.visualization.ColumnChart(document.getElementById('bar-chart'));
	barChart.draw(barData, barOptions);
}


// function drawChart(secondChartData) {
// 	var Header = ["Text", "Value", { role: 'style' }, { role: "interval" }, { role: "interval" } ];
// 	var data = [];
// 	data.push(Header);

// 	for (i = 0; i < secondChartData.length; i++) {
// 		data.push([capitalizeFirstLetter(secondChartData[i].type)+' duration', secondChartData[i].average_duration, colorFromType(secondChartData[i].type), secondChartData[i].average_duration-2, secondChartData[i].average_duration + 5])

// 		data.push([capitalizeFirstLetter(secondChartData[i].type)+' score', parseInt(secondChartData[i].average_score), colorFromType(secondChartData[i].type), secondChartData[i].average_score-2, secondChartData[i].average_score + 5])
// 	}


// 	var barData = new google.visualization.arrayToDataTable(data);
// 	var view = new google.visualization.DataView(barData);
// 	view.setColumns([0, 1,
// 						  { calc: "stringify",
// 							sourceColumn: 1,
// 							type: "string",
// 							role: "annotation" },
// 						  2, 3, 4]);

// 	var options = {
// 		backgroundColor: { fill:'transparent' },
// 		colors: ['#50c4ec', '#016380', '#5fcec7', '#016380'],
// 		// title: ' ',
// 		title:'Mean Duration and Score',
//         titleTextStyle: {
//             fontSize: 15,
//             bold: true,
//         },
// 		bar: {
// 			groupWidth: "90%"
// 		},
// 		intervals: { 'style':'box', 'color': '#000000' },
//         // interval: { 'style':'box', 'color': 'rgb(0,0,0)' },
// 		legend: {
// 			position: "none"
// 		},
// 		vAxis: {
// 			gridlines: {count: 0}
// 		}
// 	};
// 	var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_values"));
// 	chart.draw(view, options);
// }

function drawChart(secondChartData) {
	var Header = ["Type", "Duration", "Score"];
	var data = [];
	data.push(Header);

	for (i = 0; i < secondChartData.length-3; i++) {
		data.push([capitalizeFirstLetter(secondChartData[i].type), secondChartData[i].average_duration, parseInt(secondChartData[i].average_score)]);
	}

	var barData = new google.visualization.arrayToDataTable(data);
	var view = new google.visualization.DataView(barData);
	view.setColumns([0, 1, {
		calc: 'stringify',
		sourceColumn: 1,
		type: 'string',
		role: 'annotation'
	}, 2, {
			calc: 'stringify',
			sourceColumn: 2,
			type: 'string',
			role: 'annotation'
		}]);

	var options = {				
		backgroundColor: 'transparent',			
		title: 'Mean Duration and Score',
		titleTextStyle: {
			fontSize: 15,
			bold: true,
		},
		bars: 'vertical',		
		vAxis: { title: 'Number' },
		hAxis: { title: 'Type' },
		legend: { position: 'bottom', alignment: 'start'  },	
	};
	var chart = new google.visualization.ColumnChart(document.getElementById('columnchart_values'));
	chart.draw(view, options);
}


function drawScatterPlot(thirdChartData) {
	var data = [['Time', 'Opening Timeouts', 'Closing Timeouts', 'Briefing']];
	var Header = ["Text", "Value", { role: "style" }, { role: "interval" }, { role: "interval" } ];
	//var title = 'Number of timeouts, debriefs, briefing';
	var colors = ['#40607C', '#89BDE6', '#91c5c5'];
	if (thirdChartAudioType === 'all') {
		for (var i = 0; i < thirdChartData.length; i++) {

            var tmts = thirdChartData[i].timeout
            var brfs = thirdChartData[i].briefing
            var debrfs = thirdChartData[i].closing_timeout

            if (tmts == undefined) {tmts = -1};
            if (brfs == undefined) {brfs = -1};
            if (debrfs == undefined) {debrfs = -1};

            data.push([thirdChartData[i].data, tmts, debrfs, brfs]);

			// data.push([thirdChartData[i].data, thirdChartData[i].timeout, thirdChartData[i].debrief, thirdChartData[i].briefing])

		}
        if (thirdChartData.length === 0) data.push([0, -1, -1, -1]);

	} else {
		data = [['Time', capitalizeFirstLetter(thirdChartAudioType)]];
		var field = 'timeout';
		if (thirdChartAudioType === 'closing_timeout') field = 'closing_timeout';
		else if (thirdChartAudioType === 'briefing') field = 'briefing';
		for (var i = 0; i < thirdChartData.length; i++) {
            if (thirdChartData[i][field] == undefined){thirdChartData[i][field] = -1}
            data.push([thirdChartData[i].data, thirdChartData[i][field]])
		}
		if (thirdChartData.length === 0) data.push([0, -1]);
		// title = 'Number of '+thirdChartAudioType;
		colors = [colorFromType(field)];
	}

	var maxValue = 240;
	var title = 'Time';
    var custom_format = '# sec'
	if (thirdChartDataType === 'score') {
		maxValue = 100;
		title = 'Score';
        custom_format = ''
	}

	var data = google.visualization.arrayToDataTable(data);
	var options = {
		title: 'Number of Opening Timeouts, Closing Timeouts',
        titleTextStyle: {
            fontSize: 15,
            bold: true
        },
		tooltip: {trigger:'focus'},
		backgroundColor: 'transparent',
		colors: colors,
		hAxis: {
			title: title,
			minValue: 10,
			maxValue: maxValue,
			gridlines: {
				count: 5,
				color: "transparent"
			},
            format: custom_format
		},
		vAxis: {
            title: 'Number',
			minValue: 0,
			maxValue: 15,
			gridlines: {
				count: 4,
				color: "transparent"
			},
            viewWindowMode: "explicit", viewWindow:{ min: 0 }
		},
		legend: 'none'
	};

	var chart = new google.visualization.ScatterChart(document.getElementById('scatter-plot'));

	chart.draw(data, options);
}

function colorFromType(audio_type) {
	var color = "#40607C";
	if (audio_type === 'briefing') color = "#91c5c5";
	if (audio_type === 'closing_timeout') color = "#89BDE6";
	return color;
}
function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
