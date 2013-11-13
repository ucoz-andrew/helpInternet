window.___upoll_data = {
	"request": {
		"user_ref": null,
		"site_lang": null,
		"site_id": "1",
		"site_page": null,
		"sig": "true",
		"poll_id": "1",
		"user_age": null,
		"user_status": null
	},
	"requests_count": 37,
	"poll": {
		"poll_id": "1",
		"poll_lang": "ru",
		"poll_name": "Our super poll",
		"poll_questions": [{
			"text": "Укажите тематику этого сайта:",
			"id": 1,
			"type": "select",
			"sign": "Выберите тематику",
			"answers": [{
				"text": "Автомобили",
				"id": 1
			}, {
				"text": "Супер пупер мега длинное название",
				"id": 2
			}, {
				"text": "Спорт",
				"id": 3
			}, {
				"text": "Еда",
				"id": 4
			}, {
				"text": "Дизайн",
				"id": 5
			}]
		}, {
			"text": "How are you?",
			"id": 2,
			"answers": [{
				"text": "Fine, thanks",
				"id": 1
			}, {
				"text": "Could be better",
				"id": 2
			}, {
				"text": "Bad :(",
				"id": 3
			}]
		}, {
			"text": "Are you sure?",
			"id": 3,
			"answers": [{
				"text": "Yes",
				"id": 1
			}, {
				"text": "No",
				"id": 2
			}, {
				"text": "WAT?",
				"id": 3
			}]
		}, {
			"text": "Do you like cats?",
			"id": 4,
			"answers": [{
				"text": "Yes",
				"id": 1
			}, {
				"text": "No",
				"id": 2
			}, {
				"text": "Not sure",
				"id": 3
			}]
		}],
		"poll_descr": "Please, take this poll",
		"poll_config": {}
	}
};


window.uModalWnd = (function(){
	var app = {

		init: function() {
			app.result = [];
		},

		onDomReady: function() {
			app.restyleRadio('#js-uModalWnd');
			app.pollJSON = window.___upoll_data;
			app.createPoll(app.pollJSON);
		},

		restyleRadio: function(parentSelector) {
			var root = $(parentSelector);
			root.find('input[type=radio]').each(function() {
				$('<i/>', {
					'class': 'fake-radio'
				}).insertAfter(this);
			});
		},

		createPoll: function(pollObj) {
			app.currStep = 0;
			var isSelect, currQuestion, questionBuffer, catsBuffer, allQuestions = '', pollSteps = '', buttonText = 'Дальше';

			$('.uModalWnd__info').html(pollObj.poll.poll_name);

			app.pollStepsLength = pollObj.poll.poll_questions.length;
			for (var i = 0; i < app.pollStepsLength; i += 1) {
				currQuestion = pollObj.poll.poll_questions[i];
				questionBuffer = '';
				var answerVariants = '', curVariant = '';
				if (currQuestion.type === 'select') {
					answerVariants += '<option value="none">' + currQuestion.sign + '</option>';
					for (var j = 0, aLen = currQuestion.answers.length; j < aLen; j += 1) {
						answerVariants += '<option value="' + currQuestion.answers[j].id + '">' + currQuestion.answers[j].text + '</option>';
					}
					questionBuffer = '<select name="uModalWnd__answer__' + currQuestion.id + '" class="uModalWnd__answers--select">' + answerVariants + '</select>';
				}
				else {
					for (var j = 0, aLen = currQuestion.answers.length; j < aLen; j += 1) {
						answerVariants += '<li><label><input type="radio" name="uModalWnd__answer__' + currQuestion.id + '" value="' + currQuestion.answers[j].id + '" /><i class="fake-radio"></i>' + currQuestion.answers[j].text + '</label></li>';
					}
					questionBuffer = '<ul class="uModalWnd__answers">' + answerVariants + '</ul>';
				}
				
				questionBuffer = '<div class="uModalWnd__question">' + currQuestion.text + '</div>' + questionBuffer;
				questionBuffer = '<div class="uModalWnd__question-wrap uModalWnd__content" style="display: none;">' + questionBuffer + '</div>';
				allQuestions = allQuestions + questionBuffer;

				pollSteps = pollSteps + '<li class="uModalWnd__step" style="width: ' + 100/app.pollStepsLength + '%;"></li>';
			}

			pollSteps = '<ul id="js-uModalWnd__steps" class="uModalWnd__steps">' + pollSteps + '</ul>';
			app.btn = $('<div class="uModalWnd__submit-wrap uModalWnd__content"><button class="uModalWnd__submit">' + buttonText + '</button></div>');
			app.allQuestions = $(allQuestions);
			app.pollSteps = $(pollSteps);
			$('#js-uModalWnd__body').append(app.allQuestions).append(app.btn).append(app.pollSteps);

			app.addEventListeners();
			app.nextStep();
		},

		addEventListeners: function() {
			app.btn.find('.uModalWnd__submit').click(function(e) {
				if (app.addStepToResult(app.currStep)) {
					app.nextStep();
				}
				else {}
			});
			
			$('#js-uModalWnd__close').click(function(e) {
				app.sendResult(app.result);
				app.closeWindow();
			});

			app.allQuestions.find('label').click(function() {
				var radio = $(this).find('[type=radio]');
				if(radio.prop('checked')) {
					$(this).parents('li').siblings().find('[type=radio]').removeClass('checked');
					radio.addClass('checked');
				}
				else {
					$(this).removeClass('checked');
				}
			});
		},

		addStepToResult: function() {
			var stepResult = [];
			var selected = app.allQuestions.find('[name=uModalWnd__answer__' + app.pollJSON.poll.poll_questions[app.currStep - 1].id + ']:checked');
			if (!selected.length) {selected = app.allQuestions.find('select[name=uModalWnd__answer__' + app.pollJSON.poll.poll_questions[app.currStep - 1].id + ']')}			
			if (selected.length && !(selected.val() === 'none') && !(app.sending)) {
				selected.each(function(i) {
					stepResult.push($(this).val());
				});
				app.result.push(stepResult);
				return true;
			}
		},

		nextStep: function() {
			if (app.currStep === app.pollStepsLength - 1) {
				app.btn.find('.uModalWnd__submit').text('Отправить');
			}
			if (app.currStep === app.pollStepsLength) {
				app.sendResult(app.result);
				app.closeWindow();
			}
			else {
				app.pollSteps.find('li').removeClass('uModalWnd__step--current').eq(app.currStep).addClass('uModalWnd__step--current');
				app.allQuestions.hide().eq(app.currStep).fadeIn('fast', function() {
					$(window.parent.document).find('#uModalWnd-iframe').height($('body').outerHeight());
				});
				app.currStep += 1;
			}
		},

		serializeResult: function(result) {
			var newResult = '';
			for (var i = 0, len = result.length; i < len; i += 1) {
				newResult = newResult + (i + 1) + '=';
				for (var iStep = 0, lenStep = result[i].length; iStep < lenStep; iStep += 1) {
					newResult = newResult + result[i][iStep];
					newResult += (iStep !== (lenStep - 1)) ? ',' : '';
				}
				newResult += (i !== (len - 1)) ? ';' : '';
			}
			return newResult;
		},

		sendResult: function(result) {
			app.sending = true;
			var result = app.serializeResult(app.result);
			console.log('sending...', result);
		},

		closeWindow: function() {
			$('#js-uModalWnd').fadeOut('fast', function() {
				$(window.parent.document).find('#uModalWnd-iframe').hide();
			});
		}

	};
	return {
		init: app.init,
		onDomReady: app.onDomReady
	}
}());

uModalWnd.init();
$(function() {
	uModalWnd.onDomReady();
});