import themeSwitcher from "./themeSwitcher.js";
themeSwitcher();

const buttons = document.querySelectorAll(".button__group");

buttons.forEach((button) => {
  button.addEventListener("click", async (e) => {
    const category = e.currentTarget.dataset.category;
    try {
      const data = await fetchQuestionsByCategory(category);
      console.log(data);
    } catch (error) {
      console.log(`Error fetching ${category} data: `, error);
    }
  });
});

const fetchQuestionsByCategory = async (category) => {
  try {
    const res = await fetch(`http://localhost:3000/api/questions/${category}`);
    return await res.json();
  } catch (error) {
    throw new Error(`HTTP error! status: ${error}`);
  }
};
