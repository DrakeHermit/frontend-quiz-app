import themeSwitcher from "./themeSwitcher.js";
themeSwitcher();

const buttons = document.querySelectorAll(".button__group");

const fetchQuestionsByCategory = async (category) => {
  try {
    const res = await fetch(`http://localhost:3000/api/questions/${category}`);
    const questions = res.json();
    return questions;
  } catch (error) {
    console.log("Failed to fetch the data");
  }
};
