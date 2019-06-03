const dropdown = {
	init: function() {
		this.cacheDom();
		this.bindEvents();
	},
	cacheDom: function() {
		this.$dropdown = $(".pr-dropdown");
		this.$dropdownToggle = this.$dropdown.find(".pr-dropdown__toggle");
		this.$dropdownMenu = this.$dropdown.find(".pr-dropdown__menu");
	},
	bindEvents: function() {
		this.$dropdownToggle.on("click", this.toggleDropdown);
	},
	toggleDropdown: function() {
		$(this).closest(".pr-dropdown").toggleClass("open");
	}
}

const quiz = {
    questions: [
        {
            question: 'What is the best way to feel more physically comfortable when delivering a speech?',
            choices: ['Take a course about self esteem', 'Learn mediation skills', 'Learn specific skills on what to do with your body', 'Take a course about ignoring the audience'],
            worth: 1,
            timetoshow: 5
        },
        {
            question: 'Why is it important to have good posture?',
            choices: ['More impressive looking', 'You avoid stomach cramping', 'Easier to see the back of the room', 'Keeps the body open for other'],
            worth: 3,
            timetoshow: 24
        },
        {
            question: 'How does standing with your feet shoulder width apart help you have abetter delivery?',
            choices: ['Eliminate distracting movement', 'You avoic falling over', 'You can see the back of the room better', 'You can breathe better'],
            worth: 3,
            timetoshow: 36
        },
        {
            question: 'Why are gestures an important delivery skill to learn?',
            choices: ['Helps the audience from seeing how nervous you might be', 'Help communicate the message', 'Teaches you that fewer gestures make a better the speech', 
            'Teaches you that more gestures make a better speech'],
            worth: 1,
            timetoshow: 48
        },
        {
            question: 'What is the outcome of learning correct posture, body movement, and gestures?',
            choices: ['Make you look like you have prepared for your speech', 'Make you look powerful', 'Helps you avoid stomach cramping', 'Make you look and feel more comfortable'],
            worth: 3,
            timetoshow: 60
        },
    ],
    questionCount: 0,
    previousVideoTime: 0,
    init: function() {
        this.cacheDom();
        this.bindEvents();
    },
    cacheDom: function() {
        this.$quizInitial = $(".pr-quiz__initial");
        this.$quizProgress = $(".pr-quiz__counter");
        this.$questionsContainer = $(".pr-quiz__questions");
        this.$questionContainer = $(".pr-quiz__question");
        this.$optionsContainer = $(".pr-quiz__answeroptions");
        this.$questionCountTime = $(".pr-quiz__questionno");
        this.$resumeQuizBtn = $("#resumeBtn");
        this.$quizVideo = $("#quizVideo");
        this.$submitQuizBtn = $(".js-confirm-submit");
    },
    bindEvents: function() {
        this.$optionsContainer.on("change", "input", this.showResumeBtn.bind(this));
        this.$quizVideo.on("play", this.resumeVideo.bind(this));
        this.$resumeQuizBtn.on("click", this.resumeVideo.bind(this));
        this.$submitQuizBtn.on("click", this.submitQuiz.bind(this));
        this.$quizVideo.on("timeupdate", this.checkToShowQuestion.bind(this));
    },
    checkToShowQuestion: function() {
        var currentVideoTime = parseInt(this.$quizVideo.get(0).currentTime);
       
        $.each(this.questions, function(k, v) {
            if (currentVideoTime === this.timetoshow && currentVideoTime != this.previousVideoTime) {
                questionCount = k;
                this.previousVideoTime = this.timetoshow;
                quiz.showQuestion(questionCount);
                return false;
            } 
        });

    },
    showQuestion: function(currentQNum) {
        quiz.$quizVideo.get(0).pause();

        /* Hide the initial instructions & show the question & options */
        this.$questionsContainer.removeClass("initial");
        this.$quizProgress.addClass("show");

        this.$questionContainer.text(quiz.questions[currentQNum].question);

        var questionNumber = parseInt(currentQNum) + 1;
        var questionNumberText = "Question " + questionNumber + " [00:" + Math.round(quiz.$quizVideo.get(0).currentTime) + "]";
        var answerHtml = '';

        $.each(quiz.questions[currentQNum].choices, function(i) {
            answerHtml += '<li><input type="radio" name="question' + currentQNum + '"id="option' + currentQNum + i + '" />';
            answerHtml += '<label for="option' + currentQNum + i +'">' + this + '</label></li>' ;
        });

        quiz.$questionCountTime.html(questionNumberText);
        quiz.$optionsContainer.html(answerHtml);

        quiz.questionCount = currentQNum + 1;

        this.updateDropdown(quiz.questionCount);

    },
    showResumeBtn: function() {
        var totalNumberOfQuestions = this.questions.length;

        if (this.questionCount == totalNumberOfQuestions) {
            this.$resumeQuizBtn.text("Submit Quiz");
        } else {
            this.$resumeQuizBtn.text("Resume");
        }
        this.$resumeQuizBtn.show();
    },
    resumeVideo: function() {

        if (this.$resumeQuizBtn.text().indexOf("Resume") > -1) {
            this.$resumeQuizBtn.hide();
            this.$quizVideo.get(0).play();

            $(".pr-quiz__message").text("Wait for the next question...");
            /* Show the instructions & hide the question & options */
            this.$questionsContainer.addClass("initial");
        } else {
            quiz.confirmSubmission();
        }
        
        this.updateDropdownResults();
    },
    confirmSubmission: function() {
        $("#confirmationModal").show();
    },
    submitQuiz: function() {
        location.href = "part4b_confirmation.html";
    },
    updateDropdown: function(qNum) {
        $(".pr-dropdown__menu").find("li").eq(qNum-1).addClass("current").siblings().removeClass("current");                
        $(".pr-dropdown__toggle").text("Question " + qNum + " of 5");
    },
    updateDropdownResults: function() {
        $(".pr-dropdown__menu").find("li.current").addClass("complete");
    }
}

$(function() {
    dropdown.init();
    quiz.init();
});

(function( $ ) {
	"use strict";
	
	$(".js-open-modal").on("click", function(e) {		
		e.preventDefault();	
		$(this).modal('open');
	});
	
	$(".pr-modal").on("click", ".js-close-modal", function() {
		$(this).modal('close');
	});	
 
    $.fn.modal = function( action ) {
 
        if ( action === "open") {			
			var modalId = this.attr("href");
			$(modalId).show();	
			$("body").addClass("pr-modal-open");
        }
 
        if ( action === "close" ) {		
			/* Close the Modal */
			this.closest(".pr-modal").hide();
			
			var $otherModals = $(".pr-modal:visible").length;
			
			if ($otherModals === 0) {
				$("body").removeClass("pr-modal-open");
			}
        } 
    };
 
}( jQuery ));