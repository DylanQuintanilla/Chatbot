import React, { useState, useEffect, useRef } from "react";
import { preguntas } from "../data/preguntas";
/* Procedemos a importar datos tanto las herramientas que utilizaremos por parte de react, como tambien las preguntas para que el chatbot funcione
useState: es una herramienta que nos ayudara a guardar información en el chatbot. Como una caja donde sirve para poner cosas y usarlas cuando las necesitemos. 
useEffect: es una herramienta que nos ayuda a hacer cosas automáticamente cuando algo cambia. Ayudandonos a detectar procesos que pasan automaticamente y hacer algo cuando eso pase.
useRef:  es una herramienta que nos ayuda a recordar algo sin que afecte al resto del programa. Modificando el DOM sin que afecte al resto del programa.
*/

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  //este no ayudara como un historial de mensajes de la conversacion del chatbot
  const [showCategories, setShowCategories] = useState(false);
  //este nos ayudara a mostrar las categorias de las preguntas
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  //este nos ayudara a seleccionar la categoria de las preguntas
  const messagesContainerRef = useRef(null);
  //este nos ayudara a recordar los mensajes que se han enviado en el chatbot, nos ayudara para ir bajando dentro de los mensajes del chat

  useEffect(() => {
    const welcomeMessage = {
      text: "Hola, ¿cómo puedo ayudarte? Usa el botón de abajo para explorar por categorías.",
      sender: "bot",
    };
    setMessages([welcomeMessage]);
  }, []);
//este nos ayudara a mostrar un mensaje de bienvenida al chatbot cabe aclara que este mensaje solo se mostrara una vez al iniciar el chatbot ya que el array [] esta vacio, luego con setMessages lo guardara en el historial de mensajes

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);
  //este nos ayudara a que el chatbot se vaya bajando automaticamente cuando se vayan enviando mensajes, ya qee con el useEffect se detectara cuando se envie un mensaje y se bajara automaticamente

  const handleShowCategories = () => { 
    const categoriesMessage = {
      text: "Por favor, selecciona una categoría:",
      sender: "bot",
    };
    setMessages((prevMessages) => [...prevMessages, categoriesMessage]);
    setShowCategories(true);
  };
//este nos ayudara a mostrar las categorias de las preguntas, con el setMessages guardara el mensaje en el historial de mensajes y con setShowCategories(true) mostrara las categorias de las preguntas

  const handleSelectCategory = (categoryIndex) => {
    const selectedCategory = preguntas[categoryIndex];
    setSelectedCategoryIndex(categoryIndex);
    const categoryMessage = {
      text: `Has seleccionado: ${selectedCategory.category}. Aquí están las preguntas disponibles:`,
      sender: "bot",
    };
    setMessages((prevMessages) => [...prevMessages, categoryMessage]);
  };
  //este nos ayudara a seleccionar la categoria de las preguntas, con el setMessages guardara el mensaje en el historial de mensajes y con setSelectedCategoryIndex(categoryIndex) seleccionara la categoria de las preguntas

  const handleBackToCategories = () => {
    setSelectedCategoryIndex(null);
    const backMessage = {
      text: "Has regresado a la lista de categorías. Por favor, selecciona una categoría:",
      sender: "bot",
    };
    setMessages((prevMessages) => [...prevMessages, backMessage]);
  };
  //este nos ayudara a regresar a la lista de categorias, con el setMessages guardara el mensaje en el historial de mensajes y con setSelectedCategoryIndex(null) regresara a la lista de categorias

  const handleSelectQuestion = (question) => {
    const userMessage = { text: question, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    let responseText = "Lo siento, no entiendo tu pregunta.";
    preguntas.forEach((category) => {
      const foundQuestion = category.questions.find(
        (item) => item.question === question
      );
      if (foundQuestion) {
        responseText = foundQuestion.answer;
      }
    });

    const botMessage = {
      text: responseText,
      sender: "bot",
    };
    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 500);
  };
  //este nos ayudara a seleccionar la pregunta de las categorias, con el setMessages guardara el mensaje en el historial de mensajes y con el setTimeout se mostrara el mensaje del chatbot despues de 500 milisegundos

  return (
    <div style={styles.chatContainer}>
      <div ref={messagesContainerRef} style={styles.messagesContainer}>
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

      <div style={styles.inputContainer}>
        {!showCategories && (
          <button onClick={handleShowCategories} style={styles.button}>
            Ver Categorías
          </button>
        )}
        {showCategories && selectedCategoryIndex === null && (
          <div style={styles.buttonList}>
            {preguntas.map((category, index) => (
              <button
                key={index}
                onClick={() => handleSelectCategory(index)}
                style={styles.categoryButton}
              >
                {category.category}
              </button>
            ))}
          </div>
        )}
        {selectedCategoryIndex !== null && (
          <div style={styles.buttonList}>
            <button
              onClick={handleBackToCategories}
              style={{ ...styles.categoryButton, marginBottom: "10px" }}
            >
              ← Regresar a Categorías
            </button>
            {preguntas[selectedCategoryIndex].questions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSelectQuestion(question.question)}
                style={styles.questionButton}
              >
                {question.question}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

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
    flexDirection: "column",
    padding: "10px",
    borderTop: "1px solid #ccc",
  },
  buttonList: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  categoryButton: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    textAlign: "left",
  },
  questionButton: {
    padding: "10px",
    backgroundColor: "#f1f1f1",
    color: "#000",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    textAlign: "left",
  },
};

export default Chatbot;