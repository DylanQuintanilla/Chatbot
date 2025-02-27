import React, { useState, useEffect } from "react";
import { preguntas } from "../data/preguntas";

const Chatbot = () => {
  // Estado para almacenar los mensajes (usuario y bot)
  const [messages, setMessages] = useState([]);

  // Agregar mensaje de bienvenida al iniciar la aplicación
  useEffect(() => {
    const welcomeMessage = {
      text: "Hola, ¿cómo puedo ayudarte? Escribe tu pregunta o selecciona una categoría.",
      sender: "bot",
    };
    setMessages([welcomeMessage]);
  }, []);

  // Función para manejar el envío de mensajes
  const handleSendMessage = (input) => {
    if (input.trim() === "") return;

    // Agregar mensaje del usuario
    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Buscar respuesta en la base de datos de preguntas frecuentes
    let responseText = "Lo siento, no entiendo tu pregunta.";
    preguntas.forEach((category) => {
      const foundQuestion = category.questions.find((item) =>
        item.question.toLowerCase().includes(input.toLowerCase())
      );
      if (foundQuestion) {
        responseText = foundQuestion.answer;
      }
    });

    // Agregar respuesta del chatbot
    const botMessage = {
      text: responseText,
      sender: "bot",
    };
    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 500); // Retraso de 500 ms para simular una respuesta "natural"
  };

  return (
    <div style={styles.chatContainer}>
      {/* Contenedor de mensajes */}
      <div style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#007bff" : "#f1f1f1",
              color: msg.sender === "user" ? "#fff" : "#000",
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Campo de entrada */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Escribe tu pregunta..."
          style={styles.input}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage(e.target.value);
              e.target.value = ""; // Limpiar el campo de entrada
            }
          }}
        />
      </div>
    </div>
  );
};

// Estilos del chatbot
const styles = {
  chatContainer: {
    width: "400px",
    height: "600px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  messagesContainer: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  message: {
    maxWidth: "70%",
    padding: "10px",
    margin: "5px",
    borderRadius: "8px",
    wordWrap: "break-word",
  },
  inputContainer: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ccc",
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
};

export default Chatbot;