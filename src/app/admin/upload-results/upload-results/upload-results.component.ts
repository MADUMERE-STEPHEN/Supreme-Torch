import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { where, query, getDocs } from 'firebase/firestore';
@Component({
  selector: 'app-upload-results',
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-results.component.html',
  styleUrls: ['./upload-results.component.css']
})
export class UploadResultsComponent {
  classNames: string[] = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];
  showDepartment: boolean = false;

  async onClassOrDepartmentChange() {
    this.studentsInClass = [];
    // Show department only for SS classes
    this.showDepartment = !!this.newResult.class && this.newResult.class.startsWith('SS');
    let studentsRef = collection(this.firestore, 'students');
    let q;
    if (this.showDepartment && this.selectedDepartment) {
      // Filter by class and department
      q = (await import('firebase/firestore')).query(
        studentsRef,
        (await import('firebase/firestore')).where('class', '==', this.newResult.class),
        (await import('firebase/firestore')).where('department', '==', this.selectedDepartment)
      );
    } else if (this.newResult.class) {
      // Filter by class only
      q = (await import('firebase/firestore')).query(
        studentsRef,
        (await import('firebase/firestore')).where('class', '==', this.newResult.class)
      );
    }
    if (q) {
      const snap = await (await import('firebase/firestore')).getDocs(q);
      this.studentsInClass = snap.docs.map(doc => doc.data());
    }
    // Set subjects
    if (this.showDepartment && this.selectedDepartment && this.departmentSubjects[this.selectedDepartment]) {
      this.newResult.results = this.departmentSubjects[this.selectedDepartment].map(subj => ({
        subject: subj,
        test: 0,
        exam: 0,
        total: 0
      }));
    } else if (this.newResult.class) {
      // JSS subjects (example)
      this.newResult.results = [
        { subject: 'Mathematics', test: 0, exam: 0, total: 0 },
        { subject: 'English Language', test: 0, exam: 0, total: 0 },
        { subject: 'Basic Science', test: 0, exam: 0, total: 0 },
        { subject: 'Social Studies', test: 0, exam: 0, total: 0 }
      ];
    }
    this.updateTotals();
  }
  private firestore: Firestore = inject(Firestore);

  departments: string[] = ['Science', 'Arts', 'Commercial'];
  selectedDepartment: string = '';
  departmentSubjects: { [key: string]: string[] } = {
    Science: [
      'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Language'
    ],
    Arts: [
      'English Language', 'Literature', 'Government', 'CRS', 'History'
    ],
    Commercial: [
      'Mathematics', 'Economics', 'Commerce', 'Accounting', 'Business Studies'
    ]
  };

  newResult = {
    fullName: '',
    admissionNumber: '',
    class: '',
    term: '',
    session: '',
    results: [
      { subject: '', test: 0, exam: 0, total: 0 }
    ],
    createdAt: new Date().toISOString(),
    totalScore: 0,
    percentage: 0
  };

  totalScore = 0;
  percentage = 0;

  studentsInClass: any[] = [];
  resultExists: boolean = false;

  async uploadResult() {
    // Check for empty required fields
    if (
      !this.newResult.class ||
      (!this.isJssClass(this.newResult.class) && !this.selectedDepartment) ||
      !this.newResult.fullName ||
      !this.newResult.term ||
      !this.newResult.admissionNumber ||
      !this.newResult.session ||
      !this.newResult.results ||
      this.newResult.results.some(sub => !sub.subject || sub.test == null || sub.exam == null)
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    // Check for duplicate result for this student, term, session, and class+department
    const classKey = this.isJssClass(this.newResult.class)
      ? this.newResult.class
      : `${this.newResult.class}-${this.selectedDepartment}`;
    const resultsRef = collection(this.firestore, 'results');
    const q = query(
      resultsRef,
      where('fullName', '==', this.newResult.fullName),
      where('term', '==', this.newResult.term),
      where('session', '==', this.newResult.session),
      where('classKey', '==', classKey)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      alert('This student already has a result for this term and session.');
      return;
    }

    // Prepare result object
    const resultToUpload = {
      ...this.newResult,
      classKey,
      department: this.selectedDepartment || null,
      totalScore: this.totalScore,
      percentage: this.percentage,
      results: this.newResult.results.map(sub => ({ 
        subject: sub.subject,
        test: Number(sub.test) || 0,
        exam: Number(sub.exam) || 0,
        total: sub.total
      })),
      createdAt: new Date().toISOString()

    };

    // Upload result
    await addDoc(resultsRef, resultToUpload);
    alert('Result uploaded successfully!');
    // Optionally reset form here
  }

  updateSubjectTotal(index: number) {
    const subject = this.newResult.results[index];
    subject.test = Number(subject.test) || 0;
    subject.exam = Number(subject.exam) || 0;
    subject.total = subject.test + subject.exam;
    this.updateTotals();
  }

  updateTotals() {
    let total = 0;
    let count = 0;
    for (const s of this.newResult.results) {
      if (typeof s.total === 'number') {
        total += s.total;
        count++;
      }
    }
    this.totalScore = total;
    this.percentage = count > 0 ? (total / (count * 100)) * 100 : 0;
  }

  addSubject() {
    this.newResult.results.push({ subject: '', test: 0, exam: 0, total: 0 });
    this.updateTotals();
  }

  removeSubject(index: number) {
    this.newResult.results.splice(index, 1);
    this.updateTotals();
  }

  resetForm() {
    this.newResult = {
      fullName: '',
      admissionNumber: '',
      class: '',
      term: '',
      session: '',
      results: [{ subject: '', test: 0, exam: 0, total: 0 }],
      createdAt: new Date().toISOString(),
      totalScore: 0,
      percentage: 0
    };
    this.selectedDepartment = '';
  }

  onDepartmentChange() {
    if (this.selectedDepartment && this.departmentSubjects[this.selectedDepartment]) {
      this.newResult.results = this.departmentSubjects[this.selectedDepartment].map(subj => ({
        subject: subj,
        test: 0,
        exam: 0,
        total: 0
      }));
      this.updateTotals();
    } else {
      this.newResult.results = [{ subject: '', test: 0, exam: 0, total: 0 }];
      this.updateTotals();
    }
  }

  async onClassChange() {
    // Fetch students for the selected class
    this.studentsInClass = [];
    this.resultExists = false;
    if (this.newResult.class) {
      const studentsRef = collection(this.firestore, 'students');
      // Query students by class
      const q = (await import('firebase/firestore')).query(studentsRef, (await import('firebase/firestore')).where('class', '==', this.newResult.class));
      const snap = await (await import('firebase/firestore')).getDocs(q);
      this.studentsInClass = snap.docs.map(doc => doc.data());
    }
  }

  async onStudentChange() {
    // Check if result already exists for this student in this term
    this.resultExists = false;
    if (this.newResult.fullName && this.newResult.term) {
      const resultsRef = collection(this.firestore, 'studentResults');
      const q = (await import('firebase/firestore')).query(resultsRef,
        (await import('firebase/firestore')).where('fullName', '==', this.newResult.fullName),
        (await import('firebase/firestore')).where('term', '==', this.newResult.term)
      );
      const snap = await (await import('firebase/firestore')).getDocs(q);
      if (!snap.empty) {
        this.resultExists = true;
      }
    }
  }

  isJssClass(className: string): boolean {
    return /^JSS/i.test(className);
  }
}
