import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Firestore, collection, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { docData } from '@angular/fire/firestore';

@Component({
  selector: 'app-manage-results',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-results.component.html',
  styleUrls: ['./manage-results.component.css']
})
export class ManageResultsComponent implements OnInit {
  private firestore: Firestore = inject(Firestore);

  results: any[] = [];
  filteredResults: any[] = [];
  classList: string[] = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];
  sessionList: string[] = ['2023/2024', '2024/2025', '2025/2026', '2026/2027'];
  filter = {
    class: '',
    term: '',
    session: '',
    search: ''
  };
  editIndex: number | null = null;
  editResult: any = {};
  loading = false;

  ngOnInit() {
    this.loading = true;
    const resultsRef = collection(this.firestore, 'results');

    collectionData(resultsRef, { idField: 'id' }).subscribe(snapshot => {
      this.results = snapshot;
      this.filterResults();
      this.loading = false;
    });
  }

  filterResults() {
    this.filteredResults = this.results.filter(res => {
      const matchesClass = !this.filter.class || res.class === this.filter.class;
      const matchesTerm = !this.filter.term || res.term === this.filter.term;
      const matchesSession = !this.filter.session || res.session === this.filter.session;
      const search = (this.filter.search || '').toLowerCase();
      const matchesSearch =
        !search ||
        res.fullName?.toLowerCase().includes(search) ||
        res.admissionNumber?.toLowerCase().includes(search);
      return matchesClass && matchesTerm && matchesSession && matchesSearch;
    });
  }

  startEdit(index: number) {
    this.editIndex = index;
    this.editResult = { ...this.filteredResults[index] };
  }

  async saveEdit(result: any) {
    if (!result.id) return;
    const resultDoc = doc(this.firestore, 'results', result.id);
    await updateDoc(resultDoc, this.editResult);
    this.editIndex = null;
    this.editResult = {};
  }

  cancelEdit() {
    this.editIndex = null;
    this.editResult = {};
  }

  async deleteResult(result: any) {
    if (confirm('Are you sure you want to delete this result?')) {
      this.loading = true;
      const resultDoc = doc(this.firestore, 'results', result.id);
      await deleteDoc(resultDoc);
      this.loading = false;
    }
  }
}
