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

function Reset() {
    questionCount = 0;
    questionNumb = 1;
    userScore = 0;
    selectedAnswer = null;
    userAnswers = {};
    answerStatus = {};
    Major = 0;
    Minor = 0;
    year
    answeredQuestions = new Set();
    selectedAnswers = [];
    selectedOption4 = []; 
    selectMultiAns = [];
}

//function แสดงคำถาม loop คำถามแต่ละข้อจากไฟล์  questions.js
function showQuestions(index) {
    const questionNumb = questions[index].numb
    const questionText = document.querySelector('.question-text');
    questionText.textContent = `${questions[index].question}`;

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

    // ตั้งค่าสถานะที่เลือกจาก userAnswers ตาม index
    const userAnswer = userAnswers[questions[index].numb];
    if (userAnswer) {
        if (questionNumb === 1) {
            selectMultiAns = [];
            userAnswer.forEach(ans => {
                const opt = Array.from(optionList.children).find(option => option.querySelector('span').textContent === ans);
                if (opt) {
                    opt.style.border = "2px solid #ffd700";
                    selectMultiAns.push(opt);
                }
            });
        } else if (questionNumb === 3) {
            selectMultiAns = [];
            userAnswer.forEach(ans => {
                const opt = Array.from(optionList.children).find(option => option.querySelector('span').textContent === ans);
                if (opt) {
                    opt.style.border = "2px solid #ffd700";
                    selectMultiAns.push(opt);
                }
            });
        } else if (questionNumb === 4) {
            selectedOption4 = [];
            userAnswer.forEach(ans => {
                const opt = Array.from(optionList.children).find(option => option.querySelector('span').textContent === ans);
                if (opt) {
                    opt.style.border = "2px solid #ffd700";
                    selectedOption4.push(opt);
                }
            });
        } else {
            // สำหรับคำถามที่เป็น single answer
            const selected = Array.from(optionList.children).find(option => option.querySelector('span').textContent === userAnswer);
            if (selected) {
                selected.style.border = "2px solid #ffd700";
                selectedAnswer = selected;
            }
        }

        // กำหนดสถานะของปุ่มต่อไป
        if (questionNumb === 1 || questionNumb === 3 || questionNumb === 4) {
            if (Array.isArray(userAnswer) && userAnswer.length > 0) {
                nextBtn.classList.add('active');
            } else {
                nextBtn.classList.remove('active');
            }
        } else {
            if (userAnswer) {
                nextBtn.classList.add('active');
            } else {
                nextBtn.classList.remove('active');
            }
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

    userAnswers[questions[index].numb] = selectedOption4.map(opt => opt.querySelector('span').textContent);
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

    userAnswers[questions[index].numb] = selectMultiAns.map(opt => opt.querySelector('span').textContent);
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

    userAnswers[questions[index].numb] = selectMultiAns.map(opt => opt.querySelector('span').textContent);
} 


// ฟังก์ชันเช็คคำตอบที่เลือก
function selectAnswer(option, index) {
    if (selectedAnswer) {
        selectedAnswer.style.border = "";
    }
    selectedAnswer = option;  // กำหนดคำตอบที่เลือกใหม่
    selectedAnswer.style.border = "2px solid #ffd700";  // กำหนดสีกรอบใหม่
    nextBtn.classList.add('active');

    // userAnswers[index] = option.textContent;
    userAnswers[questions[index].numb] = option.querySelector('span').textContent;

    if (questions[index].numb === 0) {
        year = option.textContent;
        if (year === "< 2 ปี") {
            console.log('คำตอบข้อที่ 0 คุณคือ < 2 ปี')
            console.log("\tคำตอบข้อ 3 คือ ข้อพับแขน , ข้อพับขา")
        } else if (year === "> 2 ปี") {
            console.log("คำตอบข้อที่ 0 คุณคือ > 2 ปี")
            console.log("\tคำตอบข้อ 3 คือ ใบหน้า/แก้ม , ด้านนอกของแขน/ขา")
        }
    }

    if (questions[index].numb === 1 || questions[index].numb === 3 || questions[index].numb === 4) {
        userAnswers[index] = Array.isArray(userAnswers[index]) ? userAnswers[index] : [];
        const answerText = option.querySelector('span').textContent;
        if (!userAnswers[index].includes(answerText)) {
            userAnswers[index].push(answerText);
        }
    } else {
        userAnswers[questions[index].numb] = option.querySelector('span').textContent;
    }
}

function updateScore(questionIndex, isCorrect) {
    const question = questions[questionIndex];
    const type = questionTypes[question.numb];

    if (answerStatus.hasOwnProperty(questions[questionIndex].numb)) {
        const previousCorrectness = answerStatus[questions[questionIndex].numb];

        if (previousCorrectness && !isCorrect) { // เคยถูก แต่ตอนนี้ผิด
            if (type === "Major") {
                Major--;
                console.log(`Major ถูกลบ: ${Major}`);
            } else {
                Minor--;
                console.log(`Minor ถูกลบ: ${Minor}`);
            }
        } else if (!previousCorrectness && isCorrect) { // เคยผิด แต่ตอนนี้ถูก
            if (type === "Major") {
                Major++;
                console.log(`Major ถูกเพิ่ม: ${Major}`);
            } else {
                Minor++;
                console.log(`Minor ถูกเพิ่ม: ${Minor}`);
            }
        }
        // ไม่มีการเปลี่ยนแปลงถ้าความถูกต้องไม่เปลี่ยนแปลง
    } else { // เป็นคำถามใหม่ (ยังไม่เคยตอบ)
        if (isCorrect) {
            if (type === "Major") {
                Major++;
                console.log(`Major ถูกเพิ่ม (ครั้งแรก): ${Major}`);
            } else {
                Minor++;
                console.log(`Minor ถูกเพิ่ม (ครั้งแรก): ${Minor}`);
            }
        }
    }

    answerStatus[questions[questionIndex].numb] = isCorrect;
}

//function ข้อต่อไป + เพิ่มคะแนน
nextBtn.onclick = () => {
    if (selectedAnswer || selectedOption4.length > 0 || selectMultiAns.length > 0) {
        const questionIndex = questionCount;
        const questionn = questions[questionIndex];
        let isCorrect = false;

        if (questionn.numb === 2) {
            if (userAnswers[questionIndex] === "เป็นผื่นลักษณะนี้ครั้งแรก") {
                // เพิ่มข้อ 2.1 หากยังไม่มี
                const exists = questions.some(q => q.numb === 2.1);
                if (!exists) {
                    questions.splice(questionIndex + 1, 0, Question21);
                }
            } else {
                // ลบข้อ 2.1 หากมี
                const indexToRemove = questions.findIndex(q => q.numb === 2.1);
                if (indexToRemove !== -1) {
                    
                    // ถ้าเคยตอบข้อ 2.1 ไปแล้ว ให้ลบคะแนนออก
                    if (answerStatus[questions[indexToRemove].numb]) {
                        Major--;
                        console.log("ลบคะแนนที่ได้ข้อ 2.1:") 
                        delete answerStatus[questions[indexToRemove].numb];
                        delete userAnswers[questions[indexToRemove].numb];
                    }
                    
                    // ลบข้อ 2.1 ออกจาก questions
                    questions.splice(indexToRemove, 1);
                }
            }
        }

        // ตรวจสอบความถูกต้องของคำตอบ
        if (questionn.numb === 1) {
            const Secttion1 = selectMultiAns.some(opt => opt.querySelector('span').textContent === "ไม่มีอาการดังกล่าว");
            if (Secttion1) {
                isCorrect = false; // ถ้าเลือก "ไม่มีอาการดังกล่าว" ผิด
            } else {
                isCorrect = selectMultiAns.length > 0; // ถ้าเลือกอย่างอื่น (หรือหลายอย่าง) ถูก
            }
        } else if (questionn.numb === 2 && userAnswers[questionIndex] !== "เป็นผื่นลักษณะนี้ครั้งแรก") {
            isCorrect = true;
        } else if (questionn.numb === 3) {
            if (year.includes("> 2 ปี")) {
                questionn.answer = ["ใบหน้า/แก้ม", "ด้านนอกของแขน และ ขา"];
            } else if (year.includes("< 2 ปี")) {
                questionn.answer = ["ข้อพับแขน", "ข้อพับขา"];
            }
            isCorrect = selectMultiAns.some(ans => questionn.answer.includes(ans.querySelector('span').textContent));
        } else if (questionn.numb === 4) {
            const hasNoAllergy = selectedOption4.some(opt => opt.querySelector('span').textContent === "ไม่มีประวัติภูมิแพ้");
            if (hasNoAllergy) {
                isCorrect = false;
            } else {
                isCorrect = selectedOption4.length > 0;
            }
        } else if (Array.isArray(questionn.answer)) {
            // คำถามที่มีหลายคำตอบอื่น ๆ (ถ้ามี)
            isCorrect = questionn.answer.every(ans => userAnswers[questions[questionIndex].numb].includes(ans));
        } else {
            // คำถามแบบ single answer
            isCorrect = questionn.answer.includes(userAnswers[questions[questionIndex].numb]);
        }

        // การจัดการคะแนน
        updateScore(questionIndex, isCorrect);

        // รีเซ็ตตัวแปร
        selectedOption4 = [];
        selectedAnswer = null;
        selectMultiAns = [];

        // อัปเดตคะแนน
        console.log(`Major: ${Major}, Minor: ${Minor}`);

        // ไปยังคำถามต่อไปหรือแสดงผลลัพธ์
        if (questionCount < questions.length - 1) {
            questionCount++;
            showQuestions(questionCount);
            questionNumb++;
            questionCounter(questionNumb);
        } else {
            showResultBox();
        }

        backBtn.classList.add('active');
    }
};

//function ปุ่มย้อนกลับ
backBtn.onclick = () => {
    if (questionCount > 0) {
        questionCount--;
        questionNumb--;
        showQuestions(questionCount); 
        questionCounter(questionNumb); 
        // ปุ่มย้อนกลับเริ่มทำงานหลังจากผ่านคำถามแรกไปแล้ว
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
        console.log("====================================")
        console.log("คะแนน Major:", Major , "คะแนน Minor:", Minor);
        console.log("====================================")
    } else {
        scoreText.textContent = "ผื่นที่เป็นยังไม่เข้าเกณฑ์การวินิจฉันผื่นภูมิแพ้ผิวหนัง ให้ติดตามอาการของผื่นหากมีอาการผื่นเป็นซ้ำให้ทำแบบประเมินซ้ำอีกครั้ง หรือปรึกษาพบแพทย์เพื่อยืนยันการวินิจฉันโรค"
        console.log("====================================")
        console.log("คะแนน Major:", Major , "คะแนน Minor:", Minor);
        console.log("====================================")
    }
}

//function ลองใหม่อีกครั้งหลังทำ Quiz
tryAgainBtn.onclick = () => {
    quizBox.classList.add('active');
    nextBtn.classList.remove('active');
    resultBox.classList.remove('active');

    console.log('ทำอีกครั้ง')
    Reset();
    showQuestions(questionCount);
    questionCounter(questionNumb);
    
}

//function กลับมาหน้าแรกหลังทำ Quiz
goHomeBtn.onclick = () => {
    quizSection.classList.remove('active');
    nextBtn.classList.remove('active');
    resultBox.classList.remove('active');

    console.log('กลับหน้าแรก')
    Reset();
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