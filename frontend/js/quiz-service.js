export class QuizService {
  constructor() {
    this.baseUrl = "http://localhost:5050/api/questions";
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
