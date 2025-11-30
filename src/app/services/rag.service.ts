import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface QueryRequest {
  question: string;
}

export interface QueryResponse {
  answer: string;
}

export interface UploadResponse {
  status: string;
  chunks: number;
  path: string;
}

@Injectable({
  providedIn: 'root'
})
export class RagService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  uploadPdf(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadResponse>(`${this.apiUrl}/upload_pdf/`, formData);
  }

  getPdfs(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/pdfs/`);
  }

  deletePdf(filename: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pdfs/${filename}`);
  }

  queryDocument(question: string): Observable<QueryResponse> {
    return this.http.post<QueryResponse>(`${this.apiUrl}/query/`, { question });
  }

  generateQuiz(filename: string, numQuestions: number, difficulty: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/generate_quiz/`, { 
      filename, 
      num_questions: numQuestions, 
      difficulty 
    });
  }
}
