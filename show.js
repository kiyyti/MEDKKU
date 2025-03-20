function showQuestions(index) {
    const actualIndex = getActualQuestionIndex(index);
    const question = questions[actualIndex];
    const questionText = document.querySelector('.question-text');
    questionText.textContent = `${question.question}`;
    
    // Clear previous options
    optionList.innerHTML = "";

    // Populate options with onclick handlers
    question.options.forEach(optionText => {
        let optionTag = document.createElement('div');
        optionTag.classList.add('option');
        optionTag.innerHTML = `<span>${optionText}</span>`;
        optionList.appendChild(optionTag);

        // Assign appropriate click handlers based on question type
        if (question.numb === 1) {
            optionTag.onclick = () => selectMultipleAnswersForQ1(optionTag, question);
        } else if (question.numb === 3) {
            optionTag.onclick = () => selectMultipleAnswersForQ3(optionTag, question);
        } else if (question.numb === 4) {
            optionTag.onclick = () => selectAnswerForQ4(optionTag, question);
        } else {
            optionTag.onclick = () => selectAnswer(optionTag, question);
        }
    });

    // Restore previous selections if any
    if (userAnswers[question.numb]) {
        if (question.numb === 1 || question.numb === 3) {
            selectMultiAns = []; // Reset
            userAnswers[question.numb].forEach(ans => {
                const opt = Array.from(optionList.children).find(option => option.querySelector('span').textContent === ans);
                if (opt) {
                    opt.style.border = "2px solid #ffd700";
                    selectMultiAns.push(opt);
                }
            });
        } else if (question.numb === 4) {
            selectedOption4 = []; // Reset
            userAnswers[question.numb].forEach(ans => {
                const opt = Array.from(optionList.children).find(option => option.querySelector('span').textContent === ans);
                if (opt) {
                    opt.style.border = "2px solid #ffd700";
                    selectedOption4.push(opt);
                }
            });
        } else {
            // Single answer questions
            const selected = Array.from(optionList.children).find(option => option.querySelector('span').textContent === userAnswers[question.numb]);
            if (selected) {
                selected.style.border = "2px solid #ffd700";
                selectedAnswer = selected;
            }
        }
    }

    // Update the 'Next' button state
    if (userAnswers[question.numb]) {
        if (question.numb === 1 || question.numb === 3 || question.numb === 4) {
            if (Array.isArray(userAnswers[question.numb]) && userAnswers[question.numb].length > 0) {
                nextBtn.classList.add('active');
            } else {
                nextBtn.classList.remove('active');
            }
        } else if (userAnswers[question.numb]) {
            nextBtn.classList.add('active');
        } else {
            nextBtn.classList.remove('active');
        }
    } else {
        nextBtn.classList.remove('active');
    }
}