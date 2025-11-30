import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RagService } from '../../services/rag.service';

// Renamed to follow TypeScript naming conventions
interface Options {
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface QuizQuestion {
  question: string;
  options: Options; // Fixed: Added semicolon and capitalized type name
  correct_answer: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit {
  pdfs: string[] = [];
  selectedPdf: string = '';
  difficulty: string = 'medium';
  numQuestions: number = 5;

  quizQuestions: QuizQuestion[] = [];
  currentQuestionIndex = 0;
  isLoading = false;
  quizStarted = false;
  quizCompleted = false;
  score = 0;
  errorMessage = '';
  selectedOption: string = '';

  constructor(private ragService: RagService) { }

  ngOnInit(): void {
    this.loadPdfs();
  }

  loadPdfs() {
    this.ragService.getPdfs().subscribe({
      next: (data) => {
        this.pdfs = data;
        if (this.pdfs.length > 0) {
          this.selectedPdf = this.pdfs[0];
        }
      },
      error: (err) => console.error('Error loading PDFs', err)
    });
  }

  generateQuiz(): void {
    if (!this.selectedPdf) {
      this.errorMessage = 'Please select a PDF.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.quizStarted = false;
    this.quizCompleted = false;
    this.quizQuestions = [];

    this.ragService.generateQuiz(this.selectedPdf, this.numQuestions, this.difficulty).subscribe({
      next: (response) => {
        this.isLoading = false;
        try {
          let quizData = response.quiz;
          if (typeof quizData === 'string') {
            const start = quizData.indexOf('[');
            const end = quizData.lastIndexOf(']');
            if (start !== -1 && end !== -1) {
              quizData = JSON.parse(quizData.substring(start, end + 1));
            } else {
              quizData = JSON.parse(quizData);
            }
          }

          this.quizQuestions = quizData;
          this.quizStarted = true;
          this.currentQuestionIndex = 0;
          this.score = 0;
          this.selectedOption = '';
        } catch (error) {
          console.error(error);
          this.errorMessage = 'Failed to parse quiz questions. The model might have returned invalid JSON.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = `Failed to generate quiz: ${error.message || 'Unknown error'}`;
      }
    });
  }

  // Helper method to get option keys for iteration in template
  getOptionKeys(): string[] {
    return ['A', 'B', 'C', 'D'];
  }

  // Helper method to select an option
  selectOption(optionKey: string): void {
    this.selectedOption = optionKey;
  }

  submitAnswer() {
    if (!this.selectedOption || this.quizCompleted) return;

    const question = this.quizQuestions[this.currentQuestionIndex];
    question.userAnswer = this.selectedOption;
    question.isCorrect = this.selectedOption === question.correct_answer;

    if (question.isCorrect) {
      this.score++;
    }

    // FIXED: Removed automatic advancement
    // The user will now click "Next Question" or "View Results" buttons
    // No automatic setTimeout navigation
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    this.selectedOption = '';
  }

  restartQuiz() {
    this.quizStarted = false;
    this.quizCompleted = false;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.selectedOption = '';
    this.quizQuestions = [];
  }
}