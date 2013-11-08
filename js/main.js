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
            "text": "How are you?",
            "id": 1,
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
            "id": 2,
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
            "id": 3,
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
			app.result = '';
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
			var currQuestion, questionBuffer, allQuestions = '', pollSteps = '', buttonText = 'Дальше';

			$('.uModalWnd__info').html(pollObj.poll.poll_name);

			app.pollStepsLength = pollObj.poll.poll_questions.length;
			for (var i = 0; i < app.pollStepsLength; i += 1 ) {
				currQuestion = pollObj.poll.poll_questions[i];
				questionBuffer = '';
				var answerVariants = '';
				for (var j = 0, aLen = currQuestion.answers.length; j < aLen; j += 1) {
					answerVariants += '<li><label><input type="radio" name="uModalWnd__answer__' + currQuestion.id + '" value="' + currQuestion.answers[j].id + '" /><i class="fake-radio"></i>' + currQuestion.answers[j].text + '</label></li>';
				}
				questionBuffer = '<div class="uModalWnd__question">' + currQuestion.text + '</div> <ul class="uModalWnd__answers">' + answerVariants + '</ul>';
				buttonText = (i === (app.pollStepsLength - 1)) ? 'Отправить' : buttonText;
				questionBuffer += '<div class="uModalWnd__submit-wrap"><button class="uModalWnd__submit">' + buttonText + '</button></div>';
				questionBuffer = '<div class="uModalWnd__question-wrap uModalWnd__content" style="display: none;">' + questionBuffer + '</div>';
				allQuestions = allQuestions + questionBuffer;

				pollSteps = pollSteps + '<li class="uModalWnd__step" style="width: ' + 100/app.pollStepsLength + '%;"></li>';
			}
			pollSteps = '<ul id="js-uModalWnd__steps" class="uModalWnd__steps">' + pollSteps + '</ul>';
			app.allQuestions = $(allQuestions);
			app.pollSteps = $(pollSteps);
			$('#js-uModalWnd__body').append(app.allQuestions).append(app.pollSteps);

			app.addEventListeners();
			app.nextStep();
		},

		addEventListeners: function() {
			app.allQuestions.find('.uModalWnd__submit').click(function(e) {
				if (app.addStepToResult(app.currStep)) {
					app.nextStep();
				}
				else {}
			});
			$('#js-uModalWnd__close').click(function(e) {});
		},

		addStepToResult: function() {
			var stepResult = app.currStep + '=', comma = '';
			var selected = app.allQuestions.find('[name=uModalWnd__answer__' + app.currStep + ']:checked');
			if (selected.length) {
				selected.each(function(i) {
					comma = (i > 0) ? ',' : '';
					stepResult = stepResult + comma + $(this).val();
				});
				app.result = (app.result === '') ? (app.result + stepResult) : (app.result + ';' + stepResult);
				return true;
			}
		},

		nextStep: function() {
			if (app.currStep === app.pollStepsLength) {
				console.log('sending...', app.result);
				app.sendResult(app.result);
			}
			else {
				app.pollSteps.find('li').removeClass('uModalWnd__step--current').eq(app.currStep).addClass('uModalWnd__step--current');
				app.allQuestions.hide().eq(app.currStep).fadeIn();
				app.currStep += 1;
			}
		},

		sendResult: function(result) {}

	};
	return {
		init: app.init,
		onDomReady: app.onDomReady,
		step: app.nextStep
	}
}());

uModalWnd.init();
$(function() {
	uModalWnd.onDomReady();
});