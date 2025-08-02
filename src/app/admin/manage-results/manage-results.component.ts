import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
@Component({
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  selector: 'app-manage-results',
  templateUrl: './manage-results.component.html',
  styleUrls: ['./manage-results.component.css']
})
export class ManageResultsComponent implements OnInit {
  results: any[] = [];
  filteredResults: any[] = [];
  classList: string[] = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];
  sessionList: string[] = ['2023/2024', '2024/2025'];
  filter = {
    class: '',
    term: '',
    session: '',
    search: ''
  };
  editIndex: number | null = null;
  editResult: any = {};
  loading = false;

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.loading = true;
    this.firestore.collection('results').snapshotChanges().subscribe(snapshot => {
      this.results = snapshot.map(doc => ({
        id: doc.payload.doc.id,
        ...doc.payload.doc.data() as any
      }));
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

  saveEdit(result: any) {
    if (!result.id) return;
    this.firestore.collection('results').doc(result.id).update(this.editResult).then(() => {
      this.editIndex = null;
      this.editResult = {};
    });
  }

  cancelEdit() {
    this.editIndex = null;
    this.editResult = {};
  }

  deleteResult(result: any) {
    if (confirm('Are you sure you want to delete this result?')) {
      this.loading = true;
      this.firestore.collection('results').doc(result.id).delete().finally(() => {
        this.loading = false;
      });
    }
  }
}

