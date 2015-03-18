var MAFIA = function () {
  var _submitter, _currentArea, _currentCity, _gameTime;
  var _drugs = {};

  var getAmount = function(amount) {
	   return Number(amount.replace(/[^0-9\.]+/g,""));
   };

  var parseDateTime = function (mafiaDate) {
    var start = 0;
    var stop = mafiaDate.indexOf(' ');
    var month = moment.monthsShort().indexOf(mafiaDate.substring(start, stop)) + 1;

    start = stop + 1;
    stop = mafiaDate.indexOf(' ', start);
    var day = mafiaDate.substring(start, stop);

    var year = moment().year();

    start = mafiaDate.indexOf(' - ') + 3;
    var time = mafiaDate.substring(start);

    return moment(month + '/' + day + '/' + year + ' ' + time);
  };

  var getMinColumnIndex = function () {
    if (_currentCity == 'LA' || _currentCity == 'LA') {
      return 2;
    } else if (_currentCity == 'CH' || _currentCity == 'DT') {
      return 6;
    } else if (_currentCity == 'NY' || _currentCity == 'PH') {
      return 10;
    }
  };

  var getRefreshTime = function (drug) {
  	if (_currentCity == 'CH') {
  		switch (drug) {
  			case 'Marijuana':
  				return 45;
  			case 'Mushrooms':
  				return 15;
  			case 'Hashish':
  				return 20;
  			case 'Opium':
  				return 10;
  			case 'Amphetamines':
  				return 5;
  			case 'Grain':
  				return 50;
  			case 'Morphine':
  				return 35;
  			case 'Barbiturates':
  				return 25;
  			case 'Heroin':
  				return 55;
  			case 'Cocaine':
  				return 0;
  		}
  	} else if (_currentCity == 'DT') {
  		switch (drug) {
  			case 'Marijuana':
  				return 15;
  			case 'Mushrooms':
  				return 45;
  			case 'Hashish':
  				return 50;
  			case 'Opium':
  				return 40;
  			case 'Amphetamines':
  				return 35;
  			case 'Grain':
  				return 20;
  			case 'Morphine':
  				return 5;
  			case 'Barbiturates':
  				return 55;
  			case 'Heroin':
  				return 25;
  			case 'Cocaine':
  				return 30;
  		}
  	} else if (_currentCity == 'NY') {
  		switch (drug) {
  			case 'Marijuana':
  				return 0;
  			case 'Mushrooms':
  				return 30;
  			case 'Hashish':
  				return 35;
  			case 'Opium':
  				return 25;
  			case 'Amphetamines':
  				return 20;
  			case 'Grain':
  				return 5;
  			case 'Morphine':
  				return 50;
  			case 'Barbiturates':
  				return 40;
  			case 'Heroin':
  				return 10;
  			case 'Cocaine':
  				return 15;
  		}
  	} else if (_currentCity == 'PH') {
  		switch (drug) {
  			case 'Marijuana':
  				return 30;
  			case 'Mushrooms':
  				return 0;
  			case 'Hashish':
  				return 5;
  			case 'Opium':
  				return 55;
  			case 'Amphetamines':
  				return 50;
  			case 'Grain':
  				return 35;
  			case 'Morphine':
  				return 20;
  			case 'Barbiturates':
  				return 10;
  			case 'Heroin':
  				return 40;
  			case 'Cocaine':
  				return 45;
  		}
  	} else if (_currentCity == 'LV') {
  		switch (drug) {
  			case 'Marijuana':
  				return 5;
  			case 'Mushrooms':
  				return 10;
  			case 'Hashish':
  				return 40;
  			case 'Opium':
  				return 15;
  			case 'Amphetamines':
  				return 25;
  			case 'Grain':
  				return 20;
  			case 'Morphine':
  				return 0;
  			case 'Barbiturates':
  				return 35;
  			case 'Heroin':
  				return 30;
  			case 'Cocaine':
  				return 50;
  		}
  	} else if (_currentCity == 'LA') {
  		switch (drug) {
  			case 'Marijuana':
  				return 35;
  			case 'Mushrooms':
  				return 40;
  			case 'Hashish':
  				return 10;
  			case 'Opium':
  				return 45;
  			case 'Amphetamines':
  				return 55;
  			case 'Grain':
  				return 50;
  			case 'Morphine':
  				return 30;
  			case 'Barbiturates':
  				return 5;
  			case 'Heroin':
  				return 0;
  			case 'Cocaine':
  				return 20;
  		}
  	}
  };

  var updateTime = function () {
    $('.refreshMyTime').each(function () {
    	var currentDrug = $(this).attr('data-drug');

    	var refreshTime = getRefreshTime(currentDrug);
    	var now = moment();
    	var then;

    	if (refreshTime > now.minutes()) {
    		then = moment().hour(now.hours());
    	} else {
    		then = moment().add(1, 'h');
    	}
    	then.minute(refreshTime).second(0);

    	$(this).text(moment.utc(moment(then,"DD/MM/YYYY HH:mm:ss").diff(moment(now,"DD/MM/YYYY HH:mm:ss"))).format("mm:ss"));
    });

    queueUpdateTime();
  };

  var queueUpdateTime = function () {
  	window.setTimeout(function () {
  		updateTime();
  	}, 1000);
  };

  var process = function () {
    $('#displayForm').fadeTo(300, 0);

    $('#drugTable tbody').empty();

    var data = $('#screenScrape').val();
    data = data.replace(/\s/g, ' ');

    // submitter
    var stop = data.indexOf(' $');
    var start = data.lastIndexOf(' ', stop - 1) + 1;

    _submitter = data.substring(start, stop + 1);

    // current area city
    start = data.indexOf(' ', stop + 1) + 1;
    stop = data.indexOf(' X ');

    var cityArray = data.substring(start, stop).split(', ');
    _currentArea = $.trim(cityArray[0]);
    _currentCity = $.trim(cityArray[1]);

    // submission game time
    start = data.indexOf(' X ') + 2;
    stop = data.indexOf(' SDI:', start);

    _gameTime = $.trim(data.substring(start, stop));
    _gameTime = parseDateTime(_gameTime);

    // find all drugs and prices
    var start = 0;
    var searchKey = '[' + _currentArea + ', ' + _currentCity + ']';
    while (start != -1) {
      // drug name
      start = data.indexOf(searchKey, start);

      if (start == -1) {
        break;
      }

      start = data.indexOf('] ', start) + 2;
      stop = data.indexOf(' ', start);

      var currentDrug = data.substring(start, stop);

      // price
      var dashIndex = data.indexOf('-', stop);
      var dollarIndex = data.indexOf('$', stop);

      if (dashIndex < dollarIndex) {
        // no current stock
        start = dollarIndex;
      } else {
        // has stock, so skip an amount to get to price
        start = dollarIndex + 1;
        start = data.indexOf('$', start);
      }

      stop = data.indexOf(' ', start);

      var drugObject = {
        Price: getAmount(data.substring(start, stop))
      };

      // min and max
      var valueStart = data.indexOf(' Min ');
      valueStart = data.indexOf(currentDrug, valueStart);

      var minColumn = getMinColumnIndex();
      for (i = 0; i <= minColumn; i++) {
        valueStart = data.indexOf('$', valueStart + 1);
      }
      var valueStop = data.indexOf(' ', valueStart)

      drugObject.Min = getAmount(data.substring(valueStart, valueStop));

      valueStart = data.indexOf('$', valueStart + 1);
      valueStop = data.indexOf(' ', valueStart)

      drugObject.Max = getAmount(data.substring(valueStart, valueStop));

      _drugs[currentDrug] = drugObject;
    }

    //console.log(_submitter);
    //console.log(_currentArea);
    //console.log(_currentCity);
    //console.log(_gameTime.format("dddd, MMMM Do YYYY, h:mm:ss a"));
    //console.log(_drugs);

    setupDisplayForm();
  };

  var setupDisplayForm = function () {
    $('#screenScrape').val('');

    $('#city').text(_currentArea + ', ' + _currentCity);
    $('#time').text('Data accurate as of ' + _gameTime.format("MMM D - HH:mm:ss"));

    var tableBody = $('#drugTable tbody');

    var dataKeys = Object.keys(_drugs);
    $(dataKeys).each(function () {
      var currentDrug = this.toString();
      var drug = _drugs[this.toString()];

      var newRow;
      newRow += '<tr>';
      newRow += '  <td>' + currentDrug + '</td>';
      newRow += '  <td>' + accounting.formatMoney(drug.Price) + '</td>';

      var percentageValue = (100 - (Math.round((((drug.Price - drug.Min) / (drug.Max - drug.Min)) * 100) * 10) / 10)).toFixed(1);
      newRow += '  <td><meter min="' + 0 + '" max="' + 100 + '" value="' + percentageValue + '" low="33" high="80" optimum="90" title="' + percentageValue + '% potential profit margin" /></td>';

      newRow += '  <td><span class="refreshMyTime" data-drug="' + currentDrug + '" /></td>';
      newRow += '</tr>';

      tableBody.append(newRow);
    });

    updateTime();

    $('#displayForm').fadeTo(200, 1);
  };

  var setupForm = function () {
    $('#submit').click(function () {
      if (validateForm()) {
        process();
      }
    });

    $('#screenScrape').click(function () {
       $(this).select();
    });
  };

  var validateForm = function () {
    var valid = true;
    $('.required').each(function () {
      if ($.trim($(this).val()) == '') {
        $(this).addClass('has-error');
        valid = false;
      } else {
        $(this).removeClass('has-error');
      }
    });

    return valid;
  };

  return {
    init: function () {
      setupForm();

      accounting.settings.currency.precision = 0;
    }
  };
}();

MAFIA.init();
