document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('testForm');
    const questionsContainer = document.getElementById('questionsContainer');
    const resultContainer = document.getElementById('result');
    const submitButton = document.getElementById('submitButton');

    // Función para randomizar un array
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    fetch('./DATA/data.json')
        .then(response => response.json())
        .then(questions => {
            questions.forEach((question, index) => {
                const questionDiv = document.createElement('div');
                questionDiv.className = 'question';
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
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            questionsContainer.innerHTML = '<p>Hubo un error cargando las preguntas. Por favor, intenta de nuevo más tarde.</p>';
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
});
