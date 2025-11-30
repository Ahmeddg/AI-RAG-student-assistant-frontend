import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RagService, QueryResponse } from '../../services/rag.service';

@Component({
  selector: 'app-query',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './query.component.html',
  styleUrl: './query.component.css'
})
export class QueryComponent {
  question: string = '';
  isLoading = false;
  answer: string = '';
  queryError: string = '';
  hasResult = false;

  constructor(private ragService: RagService) {}

  onQuery(): void {
    if (!this.question.trim()) {
      this.queryError = 'Please enter a question';
      return;
    }

    this.isLoading = true;
    this.queryError = '';
    this.answer = '';
    this.hasResult = false;

    this.ragService.queryDocument(this.question).subscribe({
      next: (response: QueryResponse) => {
        this.isLoading = false;
        this.answer = response.answer;
        this.hasResult = true;
      },
      error: (error) => {
        this.isLoading = false;
        this.queryError = `Query failed: ${error.message || 'Unknown error'}`;
      }
    });
  }

  onClear(): void {
    this.question = '';
    this.answer = '';
    this.queryError = '';
    this.hasResult = false;
  }
}
