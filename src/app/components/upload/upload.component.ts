import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RagService } from '../../services/rag.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent implements OnInit {
  selectedFile: File | null = null;
  isLoading = false;
  uploadStatus: string = '';
  uploadSuccess = false;
  uploadError = false;
  pdfs: string[] = [];

  constructor(private ragService: RagService) { }

  ngOnInit(): void {
    this.loadPdfs();
  }

  loadPdfs() {
    this.ragService.getPdfs().subscribe({
      next: (data) => this.pdfs = data,
      error: (err) => console.error('Error loading PDFs', err)
    });
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      this.uploadStatus = `File selected: ${this.selectedFile.name}`;
      this.uploadSuccess = false;
      this.uploadError = false;
    }
  }

  onUpload(): void {
    if (!this.selectedFile) {
      this.uploadStatus = 'Please select a file first';
      this.uploadError = true;
      return;
    }

    this.isLoading = true;
    this.uploadSuccess = false;
    this.uploadError = false;

    this.ragService.uploadPdf(this.selectedFile).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.uploadStatus = `Upload successful! ${response.chunks} chunks created from ${response.path}`;
        this.uploadSuccess = true;
        this.selectedFile = null;
        this.loadPdfs();
      },
      error: (error) => {
        this.isLoading = false;
        this.uploadStatus = `Upload failed: ${error.message || 'Unknown error'}`;
        this.uploadError = true;
      }
    });
  }

  deletePdf(filename: string) {
    if (confirm(`Are you sure you want to delete ${filename}?`)) {
      this.ragService.deletePdf(filename).subscribe({
        next: () => {
          this.loadPdfs();
        },
        error: (err) => console.error('Error deleting PDF', err)
      });
    }
  }
}
