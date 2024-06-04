document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('testForm');
    const questionsContainer = document.getElementById('questionsContainer');
    const resultContainer = document.getElementById('result');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const submitButton = document.getElementById('submitButton');
    const progressBar = document.createElement('div');
    const progress = document.createElement('div');

    progressBar.className = 'progress-bar';
    progress.className = 'progress';
    progressBar.appendChild(progress);
    questionsContainer.parentNode.insertBefore(progressBar, questionsContainer);

    let currentQuestionIndex = 0;
    let questions;

    // Función para randomizar un array
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    fetch('./DATA/data.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            questions.forEach((question, index) => {
                const questionDiv = document.createElement('div');
                questionDiv.className = 'question';
                if (index === 0) questionDiv.classList.add('active');
                questionDiv.innerHTML = `<h3>${index + 1}. ${question.pregunta}</h3>`;

                // Randomizar respuestas
                shuffle(question.respuesta);

                question.respuesta.forEach(answer => {
                    const answerDiv = document.createElement('div');
                    answerDiv.className = 'answer';
                    answerDiv.innerHTML = `
                        <label>
                            <input type="radio" name="question${index}" value="${answer.type}">
                            ${answer.enunciado}
                        </label>
                    `;
                    questionDiv.appendChild(answerDiv);
                });

                questionsContainer.appendChild(questionDiv);
            });

            // Desactivar el botón "Siguiente" hasta que se seleccione una opción
            const firstQuestionInputs = document.querySelectorAll(`input[name="question0"]`);
            firstQuestionInputs.forEach(input => {
                input.addEventListener('change', () => {
                    nextButton.disabled = false;
                });
            });

            // Actualizar la barra de progreso
            updateProgressBar();
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            questionsContainer.innerHTML = '<p>Hubo un error cargando las preguntas. Por favor, intenta de nuevo más tarde.</p>';
        });

    function showQuestion(index) {
        const questions = document.querySelectorAll('.question');
        questions.forEach((question, i) => {
            if (i === index) {
                question.classList.add('active');
            } else {
                question.classList.remove('active');
            }
        });

        prevButton.style.display = index === 0 ? 'none' : 'inline-block';
        nextButton.style.display = index === questions.length - 1 ? 'none' : 'inline-block';
        submitButton.style.display = index === questions.length - 1 ? 'inline-block' : 'none';

        // Desactivar el botón "Siguiente" hasta que se seleccione una opción
        const currentQuestionInputs = document.querySelectorAll(`input[name="question${index}"]`);
        nextButton.disabled = true;
        currentQuestionInputs.forEach(input => {
            input.addEventListener('change', () => {
                nextButton.disabled = false;
            });
        });

        // Actualizar la barra de progreso
        updateProgressBar();
    }

    function updateProgressBar() {
        const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
        progress.style.width = `${progressPercentage}%`;
    }

    prevButton.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion(currentQuestionIndex);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        }
    });

    submitButton.addEventListener('click', () => {
        const formData = new FormData(form);
        let scores = { Analyst: 0, Scientist: 0, Engineer: 0 };

        for (let [key, value] of formData.entries()) {
            scores[value]++;
        }

        const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        const [first, second, third] = sortedScores;

        let result = `
            <p>Tu afinidad con los roles es la siguiente:</p>
            <p><strong>1. ${first[0]}: ${first[1]} puntos</strong></p>
            <p>2. ${second[0]}: ${second[1]} puntos</p>
            <p>3. ${third[0]}: ${third[1]} puntos</p>
        `;

        resultContainer.innerHTML = result;
    });

    showQuestion(currentQuestionIndex);
});
