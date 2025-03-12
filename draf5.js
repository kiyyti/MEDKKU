//ระบบคะแนนเรียบร้อยแล้ว เหลือแค่ บัคข้อ 2.1
const startQuiz = document.querySelector('.start-btn');
const Quizguide = document.querySelector('.popup-info');
const exitBtn = document.querySelector('.exit-btn');
const main = document.querySelector('.main');
const continueBtn = document.querySelector('.continue-btn');
const quizSection = document.querySelector('.quiz-section');
const quizBox = document.querySelector('.quiz-box');
const resultBox = document.querySelector('.result-box');
const tryAgainBtn = document.querySelector('.tryAgain-btn');
const goHomeBtn = document.querySelector('.goHome-btn');
const nextBtn = document.querySelector('.next-btn');
const backBtn = document.querySelector('.back-btn');
const optionList = document.querySelector('.option-list');

let questionCount = 0;
let questionNumb = 1;
let userScore = 0;
let selectedAnswer = null;
let userAnswers = {};
let answerStatus = {};
let Major = 0;
let Minor = 0;
let year
let answeredQuestions = new Set();
let selectedAnswers = [];
let selectedOption4 = []; 
let selectMultiAns = [];

//function แสดงคำถาม loop คำถามแต่ละข้อจากไฟล์  questions.js
function showQuestions(index) {
    const questionText = document.querySelector('.question-text');
    if (questions[index].numb != 0 && questions[index].type == "Major"){
        questionText.textContent = `${questions[index].numb}. ${questions[index].question}`;
    } else {
        questionText.textContent = `${questions[index].question}`;
    }

    optionList.innerHTML = "";

    // สร้างตัวเลือกทั้งหมดก่อน
    questions[index].options.forEach(optionText => {
        let optionTag = document.createElement('div');
        optionTag.classList.add('option');
        optionTag.innerHTML = `<span>${optionText}</span>`;
        optionList.appendChild(optionTag);

        // ตั้งค่า onclick สำหรับแต่ละตัวเลือก
        if (questions[index].numb === 1) {
            optionTag.onclick = () => selectMultipleAnswersForQ1(optionTag, index);
        } else if (questions[index].numb === 3) {
            optionTag.onclick = () => selectMultipleAnswersForQ3(optionTag, index);
        } else if (questions[index].numb === 4) {
            optionTag.onclick = () => selectAnswerForQ4(optionTag, index);
        } else {
            optionTag.onclick = () => selectAnswer(optionTag, index);
        }
    });

    // หลังจากสร้างตัวเลือกแล้ว ให้ตั้งค่าสถานะที่เลือกจาก userAnswers
    if (userAnswers[index]) {
        if (questions[index].numb === 1 || questions[index].numb === 3) {
            selectMultiAns = []; // รีเซ็ตก่อน
            userAnswers[index].forEach(ans => {
                const opt = Array.from(optionList.children).find(option => option.querySelector('span').textContent === ans);
                if (opt) {
                    opt.style.border = "2px solid #ffd700";
                    selectMultiAns.push(opt);
                }
            });
        } else if (questions[index].numb === 4) {
            selectedOption4 = []; // รีเซ็ตก่อน
            userAnswers[index].forEach(ans => {
                const opt = Array.from(optionList.children).find(option => option.querySelector('span').textContent === ans);
                if (opt) {
                    opt.style.border = "2px solid #ffd700";
                    selectedOption4.push(opt);
                }
            });
        } else {
            // สำหรับคำถามที่เป็น single answer
            const selected = Array.from(optionList.children).find(option => option.querySelector('span').textContent === userAnswers[index]);
            if (selected) {
                selected.style.border = "2px solid #ffd700";
                selectedAnswer = selected;
            }
        }
    }

    // ตั้งค่าสถานะปุ่ม Next
    if (userAnswers[index]) {
        if (questions[index].numb === 1 || questions[index].numb === 3 || questions[index].numb === 4) {
            if (Array.isArray(userAnswers[index]) && userAnswers[index].length > 0) {
                nextBtn.classList.add('active');
            } else {
                nextBtn.classList.remove('active');
            }
        } else if (userAnswers[index]) {
            nextBtn.classList.add('active');
        } else {
            nextBtn.classList.remove('active');
        }
    } else {
        nextBtn.classList.remove('active');
    }
}

function selectAnswerForQ4(option, index) {
    const optionText = option.querySelector('span').textContent;
    
    if (optionText) {
        if (optionText === "ไม่มีประวัติภูมิแพ้") {
            if (selectedOption4.includes(option)) {
                // ยกเลิกการเลือกเมื่อคลิกซ้ำ
                selectedOption4 = selectedOption4.filter(opt => opt !== option);
                option.style.border = "";
            } else {
                // เคลียร์ตัวเลือกอื่น ๆ เมื่อเลือก "ไม่มีอาการดังกล่าว"
                selectedOption4.forEach(opt => opt.style.border = "");
                selectedOption4 = [option];
                option.style.border = "2px solid #ffd700";
            }
        } else {
            // หากมีการเลือก "ไม่มีอาการดังกล่าว" เอาไว้ ยกเลิกการเลือกก่อน
            const ans4 = selectedOption4.find(opt => opt.querySelector('span').textContent === "ไม่มีประวัติภูมิแพ้");
            if (ans4) {
                selectedOption4 = selectedOption4.filter(opt => opt !== ans4);
                ans4.style.border = "";
            }

            if (selectedOption4.includes(option)) {
                // ยกเลิกการเลือกเมื่อคลิกซ้ำ
                selectedOption4 = selectedOption4.filter(opt => opt !== option);
                option.style.border = "";
            } else if (selectedOption4.length < 2) {
                selectedOption4.push(option);
                option.style.border = "2px solid #ffd700";
            }
        }
    }

    if (selectedOption4.length > 0) {
        nextBtn.classList.add('active');
    } else {
        nextBtn.classList.remove('active');
    }

    userAnswers[index] = selectedOption4.map(opt => opt.querySelector('span').textContent);
}

function selectMultipleAnswersForQ3(option, index) {
    const optionText = option.querySelector('span').textContent;

    if (optionText) {
        if (selectMultiAns.includes(option)) {
            // ยกเลิกการเลือกเมื่อคลิกซ้ำ
            selectMultiAns = selectMultiAns.filter(opt => opt !== option);
            option.style.border = "";
        } else {
            selectMultiAns.push(option);
            option.style.border = "2px solid #ffd700";
        }
    }

    if (selectMultiAns.length > 0) {
        nextBtn.classList.add('active');
    } else {
        nextBtn.classList.remove('active');
    }

    userAnswers[index] = selectMultiAns.map(opt => opt.querySelector('span').textContent);
}

//เลือกหลายคำตอบ ขอ้ 1
function selectMultipleAnswersForQ1(option, index) {
    const optionText = option.querySelector('span').textContent;

    if (optionText) {
        if (optionText === "ไม่มีอาการดังกล่าว") {
            if (selectMultiAns.includes(option)) {
                // ยกเลิกการเลือกเมื่อคลิกซ้ำ
                selectMultiAns = selectMultiAns.filter(opt => opt !== option);
                option.style.border = "";
            } else {
                // เคลียร์ตัวเลือกอื่น ๆ เมื่อเลือก "ไม่มีอาการดังกล่าว"
                selectMultiAns.forEach(opt => opt.style.border = "");
                selectMultiAns = [option];
                option.style.border = "2px solid #ffd700";
            }
        } else {
            // หากมีการเลือก "ไม่มีอาการดังกล่าว" เอาไว้ ยกเลิกการเลือกก่อน
            const noSymptomOption = selectMultiAns.find(opt => opt.querySelector('span').textContent === "ไม่มีอาการดังกล่าว");
            if (noSymptomOption) {
                selectMultiAns = selectMultiAns.filter(opt => opt !== noSymptomOption);
                noSymptomOption.style.border = "";
            }

            if (selectMultiAns.includes(option)) {
                // ยกเลิกการเลือกเมื่อคลิกซ้ำ
                selectMultiAns = selectMultiAns.filter(opt => opt !== option);
                option.style.border = "";
            } else if (selectMultiAns.length < 3) {
                selectMultiAns.push(option);
                option.style.border = "2px solid #ffd700";
            }
        }
    }

    
    if (selectMultiAns.length > 0) {
        nextBtn.classList.add('active');
    } else {
        nextBtn.classList.remove('active');
    }

    userAnswers[index] = selectMultiAns.map(opt => opt.querySelector('span').textContent);
    nextBtn.classList.toggle('active', selectMultiAns.length > 0);
} 


// ฟังก์ชันเช็คคำตอบที่เลือก
function selectAnswer(option, index) {
    if (selectedAnswer) {
        selectedAnswer.style.border = "";
    }
    selectedAnswer = option;  // กำหนดคำตอบที่เลือกใหม่
    selectedAnswer.style.border = "2px solid #ffd700";  // กำหนดสีกรอบใหม่
    nextBtn.classList.add('active');

    let Article = questions[index].numb;
    // userAnswers[index] = option.textContent;
    userAnswers[index] = option.querySelector('span').textContent;

    if (Article === 0) {
        year = option.textContent;
    }

    if (questions[index].numb === 1 || questions[index].numb === 3 || questions[index].numb === 4) {
        userAnswers[index] = Array.isArray(userAnswers[index]) ? userAnswers[index] : [];
        const answerText = option.querySelector('span').textContent;
        if (!userAnswers[index].includes(answerText)) {
            userAnswers[index].push(answerText);
        }
    } else {
        userAnswers[index] = option.querySelector('span').textContent;
    }

}

//function ข้อต่อไป + เพิ่มคะแนน
nextBtn.onclick = () => {

    if (selectedAnswer || selectedOption4.length > 0 || selectMultiAns.length > 0) {
        const questionIndex = questionCount;
        const questionn = questions[questionIndex];
        const corrects = questionn.answer;
        let isCorrect = false;

        if (userAnswers[questionIndex] === "เป็นผื่นลักษณะนี้ครั้งแรก") {
            questions.splice(3, 0, {
                numb: 2.1,
                type: "Major",
                question: "มีผื่นลักษณะนี้มานานหรือยัง",
                options: [
                    "1-2 สัปดาห์",
                    "3-4 สัปดาห์",
                    "1-3 เดือน",
                    "3-6 เดือน"
                ],
                answer: [
                    "3-4 สัปดาห์",
                    "1-3 เดือน",
                    "3-6 เดือน"
                ]
            });
        }


        if (questionIndex === 3 && selectMultiAns.length > 0) {
            if (year.includes("> 2 ปี")) {
                questions[3].answer = ["ใบหน้า/แก้ม", "ด้านนอกของแขน และ ขา"];
            } else if (year.includes("< 2 ปี")) {
                questions[3].answer = ["ข้อพับแขน", "ข้อพับขา"];
            } 
            isCorrect = selectMultiAns.some(ans => questions[3].answer.includes(ans.querySelector('span').textContent));
        } else if (corrects.includes(userAnswers[questionIndex])) {
            isCorrect = true;
        }
        
        if (selectedOption4.length > 0) {
            const Selecttion4 = selectedOption4.find(opt => opt.querySelector('span').textContent === "ไม่มีประวัติภูมิแพ้");
            if (Selecttion4) {
                isCorrect = false
            } else if (selectedOption4.length > 0) {
                // Major++;
                // console.log({questionIndex}, ":Major",Major)
                isCorrect = true;
            } else {
                // Major = Major;
                isCorrect = false;
            }
        }

        if (selectMultiAns.length > 0 && questionIndex !== 3) {
            const Selecttion1 = selectMultiAns.find(opt => opt.querySelector('span').textContent === "ไม่มีอาการดังกล่าว")
            if (Selecttion1) {
                isCorrect = false; // "ไม่มีอาการดังกล่าว" ไม่ได้ให้คะแนนเพิ่ม
            } else if (selectMultiAns.length > 0) {
                isCorrect = true;
            } else {
                isCorrect = false;
            }
        }

        // ตรวจสอบว่าเคยตอบคำถามนี้มาก่อนหรือไม่
        if (answerStatus.hasOwnProperty(questionIndex)) {
            const previousCorrectness = answerStatus[questionIndex];

            if (previousCorrectness) { // คำตอบเดิมถูก
                if (!isCorrect) { // คำตอบใหม่ผิด (หรือไม่มีคำตอบ)
                    if (questionn.type === "Major") {
                        Major--; // ลดคะแนน Major
                        console.log({questionIndex}, ":Major ลดลง:", Major);
                    } else {
                        Minor--; // ลดคะแนน Minor
                        console.log({questionIndex}, ":Minor ลดลง:", Minor);
                    }
                } // ถ้าคำตอบใหม่ยังถูก ก็ไม่ต้องทำอะไร (คะแนนคงเดิม)
            } else { // คำตอบเดิมผิด
                if (isCorrect) { // คำตอบใหม่ถูก
                    if (questionn.type === "Major") {
                        Major++; // เพิ่มคะแนน Major
                        console.log({questionIndex}, ":Major เพิ่มขึ้น:", Major);
                    } else {
                        Minor++; // เพิ่มคะแนน Minor
                        console.log({questionIndex}, ":Minor เพิ่มขึ้น:", Minor);
                    }
                } // ถ้าคำตอบใหม่ยังผิด ก็ไม่ต้องทำอะไร (คะแนนคงเดิม)
            }
        } else { // เป็นคำถามใหม่ (ยังไม่เคยตอบ)
            if (isCorrect) {
                if (questionn.type === "Major") {
                    Major++; // เพิ่มคะแนน Major
                    console.log({questionIndex}, ":Major เพิ่มขึ้น (ครั้งแรก):", Major);
                } else {
                    Minor++; // เพิ่มคะแนน Minor
                    console.log({questionIndex}, ":Minor เพิ่มขึ้น (ครั้งแรก):", Minor);
                }
            }
        }

        // บันทึกสถานะความถูกต้องของคำตอบปัจจุบัน
        answerStatus[questionIndex] = isCorrect;

        selectedOption4 = [];
        selectedAnswer = null;
        selectMultiAns = [];

        
        if (questionCount < questions.length - 1) {
            questionCount++;
            showQuestions(questionCount);
            questionNumb++;
            questionCounter(questionNumb);
        } else {
            showResultBox();
        }
    }

    backBtn.classList.add('active');

};

//function ปุ่มย้อนกลับ
backBtn.onclick = () => {
    if (questionCount > 0) {
        questionCount--;
        questionNumb--;
        showQuestions(questionCount); 
        questionCounter(questionNumb); 
        if (questionNumb === 1) {
            backBtn.classList.remove('active');
        }
    }
}

//function เลขคำถามตอนทำ Quize 
function questionCounter(index) {
    const questionTotal = document.querySelector('.question-total');
    questionTotal.textContent = `${index} จาก ${questions.length} คำถาม`;
}

//function ผลลัพท์
function showResultBox() {
    quizBox.classList.remove('active');
    resultBox.classList.add('active');
    const scoreText = document.querySelector('.score-text');

    if (Major >= 3 && Minor >= 3) {
        // scoreText.textContent = `Major: ${Major} Minor: ${Minor}`;
        scoreText.textContent = "ผื่นที่เป็นเข้าเกณฑ์การวินิจฉันผื่นภูมิแพ้ผิวหนัง แนะนำให้ไปพบแพทย์เพื่อยืนยันการวินิจฉัยโรคและวางแผนการรักษาต่อไป"
    } else {
        scoreText.textContent = "ผื่นที่เป็นยังไม่เข้าเกณฑ์การวินิจฉันผื่นภูมิแพ้ผิวหนัง ให้ติดตามอาการของผื่นหากมีอาการผื่นเป็นซ้ำให้ทำแบบประเมินซ้ำอีกครั้ง หรือปรึกษาพบแพทย์เพื่อยืนยันการวินิจฉันโรค"
    }
}

//function ลองใหม่อีกครั้งหลังทำ Quiz
tryAgainBtn.onclick = () => {
    quizBox.classList.add('active');
    nextBtn.classList.remove('active');
    resultBox.classList.remove('active');

    questionCount = 0;
    questionNumb = 1;
    Major = 0;
    Minor = 0;
    userAnswers = {};
    selectedAnswer = null;
    showQuestions(questionCount);
    questionCounter(questionNumb);
    
}

//function กลับมาหน้าแรกหลังทำ Quiz
goHomeBtn.onclick = () => {
    quizSection.classList.remove('active');
    nextBtn.classList.remove('active');
    resultBox.classList.remove('active');

    questionCount = 0;
    questionNumb = 1;
    Minor = 0;
    Major = 0;
    userAnswers = {};
    selectedAnswer = null;
    showQuestions(questionCount);
    questionCounter(questionNumb);
    
}

//function ปุ่ม เริ่มทำQuiz
startQuiz.onclick = () => {
    Quizguide.classList.add('active');
    main.classList.add('active');
}

//function ปุ่มออก
exitBtn.onclick = () => {
    Quizguide.classList.remove('active');
    main.classList.remove('active');
}

//function ปุ่มไปต่อไปหน้า Quiz Guize
continueBtn.onclick = () => {
    quizSection.classList.add('active');
    Quizguide.classList.remove('active');
    main.classList.remove('active');
    quizBox.classList.add('active');

    showQuestions(0);
    questionCounter(1);
    
}