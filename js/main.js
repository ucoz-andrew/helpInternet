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
                "text": "Супер пупер длинное название",
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
					for (var j = 0, aLen = currQuestion.answers.length; j < aLen; j += 1) {
						answerVariants += '<li><label><input type="radio" name="uModalWnd__answer__' + currQuestion.id + '" value="' + currQuestion.answers[j].id + '" />' + currQuestion.answers[j].text + '</label></li>';
					}
					questionBuffer = '<ul class="uModalWnd__answers uModalWnd__answers--select">' + answerVariants + '</ul>';
					questionBuffer = '<div class="uModalWnd__fake-select-wrap js-uModalWnd__fake-select"><span class="uModalWnd__fs-val">' + currQuestion.sign + '</span>' + questionBuffer + '</div>';
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

			app.createSelectFormRadio('js-uModalWnd__answers--select');
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
			var fakeSelect = app.allQuestions.find('.js-uModalWnd__fake-select');
			fakeSelect.find('.uModalWnd__fs-val').click(function(e) {
				$(this).parent().toggleClass('uModalWnd__fs-opened');
			});
			fakeSelect.find('label').click(function(e) {
				if (!$(this).parent().hasClass('fs-option-active')) {
					var root = $(this).parents('.js-uModalWnd__fake-select');
					$(this).parent().siblings('li').removeClass('fs-option-active');
					$(this).parent().addClass('fs-option-active');
					root.removeClass('uModalWnd__fs-opened');
					root.find('.uModalWnd__fs-val').text($(this).text());
				}
			});
			$('#js-uModalWnd__close').click(function(e) {});
		},

		addStepToResult: function() {
			var stepResult = [], comma = '';
			var selected = app.allQuestions.find('[name=uModalWnd__answer__' + app.pollJSON.poll.poll_questions[app.currStep - 1].id + ']:checked');
			if (selected.length && !(app.sending)) {
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
			}
			else {
				app.pollSteps.find('li').removeClass('uModalWnd__step--current').eq(app.currStep).addClass('uModalWnd__step--current');
				app.allQuestions.hide().eq(app.currStep).fadeIn('fast', function() {
					$(window.parent.document).find('iframe').height($('body').outerHeight());
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

		createSelectFormRadio: function(selector) {}

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