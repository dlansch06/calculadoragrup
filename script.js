// Obtiene la referencia al elemento de la pantalla de la calculadora
const display = document.getElementById('display');

// Variables para almacenar el estado de la calculadora
let currentInput = '';    // Almacena el número que el usuario está ingresando actualmente
let operator = null;      // Almacena el operador (+, -, *, /) que ha sido seleccionado
let firstOperand = null;  // Almacena el primer número de la operación (el que se ingresó antes del operador)
let waitingForSecondOperand = false; // Indica si estamos esperando el segundo número después de un operador

/**
 * Agrega un valor (número o punto decimal) a la pantalla y al input actual.
 * @param {string} value - El valor (dígito o '.') a agregar.
 */
function appendToDisplay(value) {
    // Si la pantalla muestra "Error", se limpia para iniciar una nueva operación.
    if (display.value === 'Error') {
        clearDisplay();
    }

    // Si ya se presionó un operador y estamos esperando el segundo número,
    // se resetea 'currentInput' para empezar a construir el segundo número.
    if (waitingForSecondOperand) {
        currentInput = value;
        waitingForSecondOperand = false;
    } else {
        // Evita múltiples puntos decimales en el mismo número
        if (value === '.' && currentInput.includes('.')) {
            return;
        }
        currentInput += value;
    }
    display.value = currentInput; // Actualiza la pantalla
}

/**
 * Limpia la pantalla y reinicia todas las variables de la calculadora.
 */
function clearDisplay() {
    currentInput = '';
    operator = null;
    firstOperand = null;
    waitingForSecondOperand = false;
    display.value = ''; // Deja la pantalla en blanco
}

/**
 * Maneja la selección de un operador (+, -, *, /).
 * Realiza el cálculo de la operación anterior si ya hay una pendiente.
 * @param {string} nextOperator - El operador que se acaba de presionar.
 */
function setOperator(nextOperator) {
    // Si 'currentInput' está vacío y ya hay un 'firstOperand' y un 'operator',
    // significa que el usuario cambió el operador (ej. de '+' a '-').
    if (currentInput === '' && firstOperand !== null) {
        operator = nextOperator; // Simplemente actualiza el operador
        return;
    }

    // Convierte el input actual a un número flotante.
    const inputValue = parseFloat(currentInput);

    // Si 'firstOperand' es nulo, este es el primer número de la operación.
    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (!waitingForSecondOperand) {
        // Si no estamos esperando el segundo operando, significa que hay que calcular.
        // Se realiza el cálculo con el operador anterior y el nuevo input.
        const result = performCalculation(firstOperand, inputValue, operator);
        display.value = result; // Muestra el resultado intermedio
        firstOperand = result; // El resultado se convierte en el primer operando para la siguiente operación
    }

    waitingForSecondOperand = true; // Se activa la bandera para esperar el siguiente número
    operator = nextOperator; // Se guarda el nuevo operador
    currentInput = ''; // Se limpia el input actual
}

/**
 * Realiza la operación matemática final cuando se presiona el botón de igual (=).
 */
function calculateResult() {
    // Si no hay input actual o no hay un primer operando para calcular, no se hace nada.
    if (currentInput === '' && firstOperand === null) {
        return;
    }

    // Si solo hay un número en la pantalla y se presiona '=',
    // no se hace un cálculo, solo se mantiene el número.
    if (firstOperand === null && currentInput !== '') {
        display.value = parseFloat(currentInput);
        return;
    }

    // Convierte el input actual (el segundo número) a un flotante.
    const secondOperand = parseFloat(currentInput);

    // Realiza el cálculo final.
    const result = performCalculation(firstOperand, secondOperand, operator);
    display.value = result; // Muestra el resultado final

    // Reinicia el estado de la calculadora para una nueva operación
    firstOperand = result; // El resultado final se puede usar como primer operando si el usuario sigue calculando
    operator = null;
    currentInput = result.toString(); // Guarda el resultado como el nuevo input actual
    waitingForSecondOperand = false;
}

/**
 * Función auxiliar para realizar la operación matemática.
 * @param {number} num1 - El primer número.
 * @param {number} num2 - El segundo número.
 * @param {string} op - El operador.
 * @returns {number|string} El resultado de la operación o "Error" si hay división por cero.
 */
function performCalculation(num1, num2, op) {
    switch (op) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
        case '/':
            if (num2 === 0) {
                return 'Error'; // Evita la división por cero
            }
            return num1 / num2;
        default:
            return num2; // Si no hay operador definido, solo devuelve el segundo número (o el actual)
    }
}

// --- ACTUALIZACIÓN IMPORTANTE PARA EL HTML ---
// Asegúrate de que los botones de operador en tu HTML llamen a `setOperator()`
// en lugar de `appendToDisplay()` para que la lógica de encadenamiento funcione correctamente.
// El botón de igual ya llama a `calculateResult()`.

// EJEMPLO DE CÓMO DEBERÍAN ESTAR LOS BOTONES DE OPERADOR EN TU HTML:
// <button class="btn operator" onclick="setOperator('/')">/</button>
// <button class="btn operator" onclick="setOperator('*')">*</button>
// <button class="btn operator" onclick="setOperator('-')">-</button>
// <button class="btn operator" onclick="setOperator('+')">+</button>