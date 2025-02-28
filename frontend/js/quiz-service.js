export class QuizService {
  constructor() {
    this.baseUrl = "https://frontend-quiz-app-8ir7.onrender.com";
  }
  async fetchQuestions(category) {
    try {
      const res = await fetch(`${this.baseUrl}/${category}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }
      return res.json();
    } catch (error) {
      throw new Error(`HTTP error! status: ${error}`);
    }
  }
}
