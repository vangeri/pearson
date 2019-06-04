const dropdown = {
	init: function() {
		this.cacheDom();
        this.bindEvents();
        this.addTimeStamp();
	},
	cacheDom: function() {
		this.$dropdown = $(".pr-dropdown");
		this.$dropdownToggle = this.$dropdown.find(".pr-dropdown__toggle");
		this.$dropdownMenu = this.$dropdown.find(".pr-dropdown__menu");
	},
	bindEvents: function() {
        this.$dropdownToggle.on("click", this.toggleDropdown);
        this.$dropdownMenu.on("click", "li", this.updateDropdown.bind(this));
	},
	toggleDropdown: function() {
		$(this).closest(".pr-dropdown").toggleClass("open");
    },
    addTimeStamp: function() {
        this.$dropdownMenu.find("li").each(function(i) {
            var timeStamp = quiz.questions[i].timetoshow;
            $(this).attr("data-time", timeStamp);
        });
    },
    updateDropdown: function(e) {
        var $clickedLi = $(e.target).closest("li");
        
        this.$dropdown.removeClass("open");
        $clickedLi.addClass("current").siblings().removeClass("current");

        quiz.gotoQuestion($clickedLi);
    }
}

const quiz = {
    questions: [
        {
            question: 'What is the best way to feel more physically comfortable when delivering a speech?',
            choices: ['Take a course about self esteem', 'Learn mediation skills', 'Learn specific skills on what to do with your body', 'Take a course about ignoring the audience'],
            worth: 1,
            timetoshow: 12,
            answered: false
        },
        {
            question: 'Why is it important to have good posture?',
            choices: ['More impressive looking', 'You avoid stomach cramping', 'Easier to see the back of the room', 'Keeps the body open for other'],
            worth: 3,
            timetoshow: 24,
            answered: false
        },
        {
            question: 'How does standing with your feet shoulder width apart help you have abetter delivery?',
            choices: ['Eliminate distracting movement', 'You avoid falling over', 'You can see the back of the room better', 'You can breathe better'],
            worth: 3,
            timetoshow: 36,
            answered: false
        },
        {
            question: 'Why are gestures an important delivery skill to learn?',
            choices: ['Helps the audience from seeing how nervous you might be', 'Help communicate the message', 'Teaches you that fewer gestures make a better the speech', 
            'Teaches you that more gestures make a better speech'],
            worth: 1,
            timetoshow: 48,
            answered: false
        },
        {
            question: 'What is the outcome of learning correct posture, body movement, and gestures?',
            choices: ['Make you look like you have prepared for your speech', 'Make you look powerful', 'Helps you avoid stomach cramping', 'Make you look and feel more comfortable'],
            worth: 3,
            timetoshow: 60,
            answered: false
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
        this.$optionsContainer.on("change", "input", this.answerQuestion);
        this.$quizVideo.on("play", this.resumeVideo.bind(this));
        this.$resumeQuizBtn.on("click", this.resumeVideo.bind(this));
        this.$submitQuizBtn.on("click", this.submitQuiz.bind(this));
        this.$quizVideo.on("timeupdate", this.checkToShowQuestion.bind(this));
    },
    checkToShowQuestion: function() {
        var currentVideoTime = parseInt(this.$quizVideo.get(0).currentTime);
       
        $.each(this.questions, function(i) {
            
          //  console.log(currentVideoTime, this.timetoshow, quiz.previousVideoTime);
            if (currentVideoTime === this.timetoshow && currentVideoTime != quiz.previousVideoTime) {
                questionCount = i;
                quiz.previousVideoTime = this.timetoshow;
                console.log("checkToShowQuestion");
                quiz.showQuestion(questionCount);
                return false;
            } 
        });

    },
    showQuestion: function(currentQNum) {
        quiz.$quizVideo.get(0).pause();

        this.hideResumeBtn();

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
    answerQuestion: function() {
        var $clickedItem = $(this);
            qNumber = $clickedItem.attr("name").split("question")[1];
        
        quiz.questions[qNumber].answered = true;
        quiz.showResumeBtn();
    },
    showResumeBtn: function() {
        var totalNumberOfQuestions = quiz.questions.length;

        if (quiz.questionCount == totalNumberOfQuestions) {
            quiz.$resumeQuizBtn.text("Submit Quiz");
        } else {
            quiz.$resumeQuizBtn.text("Resume");
        }
        quiz.$resumeQuizBtn.show();
    },
    hideResumeBtn: function() {
        quiz.$resumeQuizBtn.text("Resume").hide();
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
        var totalNumberOfQuestions = quiz.questions.length,
            totalAnsweredQuestions = 0;
        $.each(quiz.questions, function() {
            if (this.answered) {
                totalAnsweredQuestions += 1;
            }
        });

        if (totalAnsweredQuestions === totalNumberOfQuestions) {
            $("#confirmationModal").show();
        } else {
            $("#errorMesg").addClass("show");
        }
    },
    submitQuiz: function() {
        location.href = "part4b_confirmation.html";
    },
    updateDropdown: function(qNum) {
        $(".pr-dropdown__menu").find("li").eq(qNum-1).addClass("current").siblings().removeClass("current");                
        $(".pr-dropdown__toggle").text("Question " + qNum + " of 5");
        $("#questionPoints").text(quiz.questions[qNum-1].worth);
    },
    updateDropdownResults: function() {
        $(".pr-dropdown__menu").find("li.current").addClass("complete");
    },
    gotoQuestion: function(li) {
        
        quiz.hideResumeBtn();
        quiz.$questionsContainer.addClass("initial");

        $("#errorMesg").removeClass("show");

        var timeStamp = parseFloat(li.attr("data-time")) - 2;
        
        quiz.$quizVideo.get(0).currentTime = timeStamp;

        quiz.$quizVideo.get(0).play();
    }
}

var accordion = {
		
    init: function() {
        this.cacheDom();
        this.bindEvents();
    },

    cacheDom: function() {
        this.accordions = document.querySelectorAll('.pr-accordion');
    },

    bindEvents: function() {
        this.accordions.forEach( accordion => {
            accordion.addEventListener('click', this.toggleAccordion.bind(this) );
        });
    },
    
    toggleAccordion: function( e ) {	
        
        const isAccordionTitle = e.path.some( arrayItem => arrayItem.classList.contains('pr-accordion__title') );
        if ( !isAccordionTitle ) { return; }
        
        const accordionItem = e.target.closest('.pr-accordion__item'),
            allSiblings = accordionItem.parentNode.querySelectorAll('.pr-accordion__item');
        
        // Don't remove .active if it's current node
        allSiblings.forEach( sibling => {
            if ( sibling !== accordionItem ) {
                sibling.classList.remove('active');
            }
        });
        
        accordionItem.classList.toggle('active');

    }
    
};


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


$(function() {
    dropdown.init();
    quiz.init();
    accordion.init();

    setTimeout(function() {
        $("#successMesg").removeClass("show");
    }, 5000);

    $(".pr-message__clear").on("click", function() {
        $(this).closest(".pr-message").removeClass("show");
    })
});