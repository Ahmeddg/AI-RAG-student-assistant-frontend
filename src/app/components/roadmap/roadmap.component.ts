import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RagService } from '../../services/rag.service';

interface Resource {
  title: string;
  type: string;
  url: string;
  description: string;
  difficulty: string;
  relevance_score?: number;
  match_reason?: string;
}

interface Module {
  title: string;
  description: string;
  topics: string[];
  search_query: string;
  resources: Resource[];
}

interface Roadmap {
  title: string;
  description: string;
  modules: Module[];
}

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.css']
})
export class RoadmapComponent {
  topic: string = '';
  learningStyle: string = 'Visual';
  difficulty: string = 'beginner';
  useSearch: boolean = true;

  isLoading: boolean = false;
  roadmap: Roadmap | null = null;
  error: string | null = null;

  learningStyles = ['Visual', 'Auditory', 'Reading', 'Kinesthetic'];
  difficulties = ['beginner', 'intermediate', 'advanced'];

  constructor(private ragService: RagService) { }

  generateRoadmap() {
    if (!this.topic.trim()) return;

    this.isLoading = true;
    this.error = null;
    this.roadmap = null;

    this.ragService.generateRoadmap(
      this.topic,
      this.learningStyle,
      this.difficulty,
      this.useSearch
    ).subscribe({
      next: (response) => {
        this.roadmap = response.roadmap;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error generating roadmap:', err);
        this.error = 'Failed to generate roadmap. Please try again.';
        this.isLoading = false;
      }
    });
  }

  getResourceIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'video': return '🎥';
      case 'article': return '📄';
      case 'documentation': return '📚';
      case 'interactive': return '💻';
      default: return '🔗';
    }
  }
}
