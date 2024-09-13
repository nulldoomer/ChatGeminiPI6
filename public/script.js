document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const messageInput = document.querySelector('#user-input');
    const message = messageInput.value;

    // Mostrar el mensaje del usuario en el chat
    addMessageToChat('user', message);

    try {
        const response = await fetch('/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });

        const data = await response.json();
        addMessageToChat('bot', data.response);
    } catch (error) {
        console.error('Error al comunicarse con el servidor:', error);
        addMessageToChat('bot', 'Lo siento, ocurrió un error. Por favor, intenta nuevamente.');
    }

    messageInput.value = ''; // Limpiar el campo de entrada
});

function addMessageToChat(sender, text) {
    const chat = document.querySelector('#chat-window');
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${sender}`;
    const messageText = document.createElement('p');
    messageText.innerText = text;
    messageElement.appendChild(messageText);
    chat.appendChild(messageElement);
    chat.scrollTop = chat.scrollHeight; // Hacer scroll hasta el final
}
