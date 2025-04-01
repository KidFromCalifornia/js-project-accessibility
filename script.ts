interface quizData {
  ask: string;
  choose: string[];
  answer: string;
}


const quiz: quizData[] = [
  {
    ask: "When should you avoid using descriptive alt text for images?",
    choose: ["For decorative images", "For informational images ", "For functional images"],
    answer: "For decorative images"
  },
  {
    ask: "What are the different levels of the Web content accessibility guidelines (WCAG)?",
    choose: ["A, B, C ", "G, VG, MVG ", "A, AA, AAA"], answer: "A, AA, AAA"
  },
  {
    ask: "Which description of flowers is easiest to understand?",
    choose: ["Flowers symbolize emotions and culture.", "Flowers are nature's drip—bold and meaningful.", "Flowers are colorful plants that show feelings."],
    answer: "Flowers symbolize emotions and culture."
  }
]

const quizCard = document.getElementById("quizCard") as HTMLFieldSetElement
const quizQuestion = document.getElementById("quizQuestion") as HTMLHeadElement
const quizOptions = document.getElementById("quizOptions") as HTMLInputElement
const quizAnswer = document.getElementById("quizAnswer") as HTMLDivElement
const score = document.getElementById("score") as HTMLSpanElement
const restartBtn = document.getElementById("restartBtn") as HTMLButtonElement
const submitAnswer = document.getElementById("submitAnswer") as HTMLButtonElement


let index = 0, scr = 0;
let selectedOption: string | null = null; //?


// quizQuestion
//quizOptions
//quizAnswer
//quizBtn

//instructions for screen readers at the start of the quiz
const quizInstructions = document.getElementById("quizInstructions");
quizInstructions?.focus(); // Focus on instructions first



function loadQuestion(): void {

  if (index >= quiz.length) return endQ(); // End if no more questions

  const getQ = quiz[index];

  if (quizQuestion) quizQuestion.textContent = getQ.ask;
  if (quizOptions) quizOptions.innerHTML = ""; // Clear previous options 

  let selectedOption: string | null = null;

  getQ.choose.forEach((element, i) => {
    const btn = document.createElement("input"); // shouldn't be const radio (not btn) ?
    btn.type = "radio";
    btn.name = "aria";
    btn.id = `aria-${i}`; // Unique ID for accessibility
    btn.value = `${i + 1}. ${element}`;

    btn.onclick = () => {
      selectedOption = element;
      console.log("Selected:", selectedOption);
    };

    const label = document.createElement("label");
    //label.hidden = true;
    label.htmlFor = btn.id;


    label.appendChild(btn);
    label.append(` ${element}`)

    quizOptions?.appendChild(label);
  });

  // Move focus to first option
  const firstOption = quizOptions.querySelector("input[type='radio']") as HTMLInputElement;
  firstOption?.focus();

  // Enable keyboard navigation inside quiz
  enableKeyboardNavigation();

  // Ensure focus trapping works after question loads
  trapFocusInsideQuiz();
}


function checkA(opt: string): void {

  if (opt === quiz[index].answer) {
    scr++;
    index++;
    loadQuestion();
  } else {
    console.log("incorrect answer")
    submitAnswer?.style.setProperty('display', 'none'); //Remove submit when the answer is incorrect

    quizCard.innerHTML = `
    <h3>Oh no wrong answer</h3>
    <button id="retryBtn">Click to Retry</button>
    `;

    //5 Retry button
    const retryBtn = document.getElementById("retryBtn") as HTMLButtonElement;
    retryBtn.focus(); // Move focus to retry button

    retryBtn.onclick = () => {

      loadQuestion()

    };

  }

}

//1 NEW keyboard navigation
function enableKeyboardNavigation(): void {
  const radioButtons = quizOptions.querySelectorAll<HTMLInputElement>("input[type='radio']");

  radioButtons.forEach((radio, index) => {
    radio.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        const next = radioButtons[index + 1] || radioButtons[0]; // Loop to first if at end
        next.focus();
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        const prev = radioButtons[index - 1] || radioButtons[radioButtons.length - 1]; // Loop to last if at start
        prev.focus();
      } else if (event.key === " " || event.key === "Enter") {
        // Select answer with Space or Enter
        event.preventDefault();
        radio.checked = true; // Mark it as selected
        selectedOption = radio.value.replace(/^\d+\.\s*/, ""); // Remove number prefix (e.g., "1. ")
        console.log("Selected:", selectedOption);

        // Move focus to submit button
        submitAnswer.focus();
      } else if (event.key === "Tab") {
        event.preventDefault();
        const next = radioButtons[index + 1] || submitAnswer;
        next.focus();
      }
    }
    });
};

// Allow "Enter" to submit when submit button is focused
submitAnswer.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    if (selectedOption !== null) {
      checkA(selectedOption);
    } else {
      console.log("No option selected!");
    }
  }
});


// Prevent pressing "Enter" from triggering submission when question is focused
quizQuestion?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Stop it from being processed
  }
});
// Prevent pressing "Enter" from triggering submission when question is focused
quizQuestion?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Stop it from being processed
  }
});

//7 NEW Focus trap inside the quiz card
function trapFocusInsideQuiz() {
  const focusableElements = quizCard.querySelectorAll<HTMLElement>("input[type='radio'], button");

  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  quizCard.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Tab") {
      if (event.shiftKey && document.activeElement === firstElement) {
        // Shift + Tab: Move focus back to the last element
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        // Tab: Move focus to the first element
        event.preventDefault();
        firstElement.focus();
      }
    }
  });
}


//2 NEW Move focus to first answer option for better keyboard usability
const firstOption = quizOptions.querySelector("input[type='radio']") as HTMLInputElement;
firstOption?.focus();

//3 NEW **Enable keyboard navigation after adding elements**
enableKeyboardNavigation();

// Append elements



//4 took it out of function loadQuestion
submitAnswer.onclick = (event) => {

  event.preventDefault(); //Stops form submission from refreshing the page

  if (selectedOption !== null) {
    checkA(selectedOption);
  } else {
    console.log("No option selected!");
  }
}










// Function to retry the same question
// function retryQuestion(question: quizData): void {
//   quizCard.innerHTML = ""; // Clear retry message

//   if (quizQuestion) quizQuestion.textContent = question.ask;
//   if (quizOptions) quizOptions.innerHTML = ""; // Clear previous options

//   let selectedOption: string | null = null;

//   question.choose.forEach((element, i) => {
//     const btn = document.createElement("input");
//     btn.type = "radio";
//     btn.name = "aria";
//     btn.id = `aria-${i}`; // Unique ID for accessibility
//     btn.value = `${i + 1}. ${element}`;

//    btn.onclick = () => {
//       selectedOption = element;
//       console.log("Selected:", selectedOption);
//     };

//     const label = document.createElement("label");
//     //label.hidden = true;
//     label.htmlFor = btn.id;


//   label.appendChild(btn);
//   label.append(` ${element}`)

//     submitAnswer.onclick = (event) => {

//     event.preventDefault(); //Stops form submission from refreshing the page

//     if (selectedOption !== null) {
//       checkA(selectedOption);
//     } else {
//       console.log("No option selected!");
//     }
//   };
//     // Append elements

//     quizOptions?.appendChild(label);
//   });

//   submitAnswer.style.display = "block"; // Show submit button again
// }


function endQ(): void {
  quizQuestion?.style.setProperty('display', 'none');
  quizOptions?.style.setProperty('display', 'none');
  quizAnswer?.style.setProperty('display', 'block');
  if (score) score.textContent = scr.toString();
  restartBtn?.style.setProperty('display', 'block');
  submitAnswer.style.setProperty('display', 'none');

  //6 NEW Move focus to final score
  quizAnswer?.focus();
}


console.log(loadQuestion)

loadQuestion();


