import { Component } from '@angular/core';
import { ResultCardComponent } from '../../../shared/result-card/result-card.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-view-results',
  standalone: true,
  imports: [ResultCardComponent, FormsModule, CommonModule],
  templateUrl: './view-results.component.html',
  styleUrl: './view-results.component.css'
})
export class ViewResultsComponent {
  checker = {
    admissionNumber: '',
    term: '',
    session: ''
  };

  foundResult: any = null;
  searchAttempted = false;

  constructor(private firestore: Firestore) {}

  async fetchResult() {
    const resultCollection = collection(this.firestore, 'studentResults');
    const q = query(
      resultCollection,
      where('admissionNumber', '==', this.checker.admissionNumber),
      where('term', '==', this.checker.term),
      where('session', '==', this.checker.session)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      this.foundResult = querySnapshot.docs[0].data();
    } else {
      this.foundResult = null;
    }

    this.searchAttempted = true;
  }
}