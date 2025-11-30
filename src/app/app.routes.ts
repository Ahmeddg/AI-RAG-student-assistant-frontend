import { Routes } from '@angular/router';
import { UploadComponent } from './components/upload/upload.component';
import { QueryComponent } from './components/query/query.component';
import { QuizComponent } from './components/quiz/quiz.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: UploadComponent },
  { path: 'query', component: QueryComponent },
  { path: 'quiz', component: QuizComponent },
  { path: '**', redirectTo: '/home' }
];
