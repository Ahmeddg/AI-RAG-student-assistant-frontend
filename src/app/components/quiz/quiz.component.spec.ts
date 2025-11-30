import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizComponent } from './quiz.component';
import { RagService } from '../../services/rag.service';
import { of } from 'rxjs';

describe('QuizComponent', () => {
  let component: QuizComponent;
  let fixture: ComponentFixture<QuizComponent>;
  let ragServiceMock: any;

  beforeEach(async () => {
    ragServiceMock = {
      getPdfs: jasmine.createSpy('getPdfs').and.returnValue(of(['test.pdf'])),
      generateQuiz: jasmine.createSpy('generateQuiz').and.returnValue(of({ quiz: JSON.stringify([{ question: 'Q1', answer: 'A1' }, { question: 'Q2', answer: 'A2' }]) }))
    };

    await TestBed.configureTestingModule({
      imports: [QuizComponent],
      providers: [
        { provide: RagService, useValue: ragServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load PDFs on init', () => {
    expect(ragServiceMock.getPdfs).toHaveBeenCalled();
    expect(component.pdfs).toEqual(['test.pdf']);
  });

  it('should generate quiz', () => {
    component.selectedPdf = 'test.pdf';
    component.generateQuiz();
    expect(ragServiceMock.generateQuiz).toHaveBeenCalledWith('test.pdf', 5, 'medium');
    expect(component.quizQuestions.length).toBe(2);
    expect(component.quizStarted).toBeTrue();
  });

  it('should handle rate answer correctly', () => {
    // Setup quiz state manually for testing logic
    component.quizQuestions = [
      { question: 'Q1', answer: 'A1', userAnswer: undefined, isCorrect: undefined },
      { question: 'Q2', answer: 'A2', userAnswer: undefined, isCorrect: undefined }
    ];
    component.quizStarted = true;
    component.currentQuestionIndex = 0;
    component.score = 0;

    // Rate first question correct
    component.rateAnswer(true);
    expect(component.quizQuestions[0].isCorrect).toBeTrue();
    expect(component.score).toBe(1);
    expect(component.currentQuestionIndex).toBe(1);

    // Rate second question incorrect
    component.rateAnswer(false);
    expect(component.quizQuestions[1].isCorrect).toBeFalse();
    expect(component.score).toBe(1); // Score shouldn't increase
    expect(component.quizCompleted).toBeTrue();
  });
});
