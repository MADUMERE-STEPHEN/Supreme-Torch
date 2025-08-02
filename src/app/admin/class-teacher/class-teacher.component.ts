import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-class-teacher',
  templateUrl: './class-teacher.component.html',
  styleUrls: ['./class-teacher.component.css']
})
export class ClassTeacherComponent {
  firestore = inject(Firestore);

  classNames = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];
  departments = ['Science', 'Arts', 'Commercial'];
  selectedClass = '';
  selectedDepartment = '';
  classPasscode = '';
  accessGranted = false;
  accessError = '';
  showDepartment = false;
  newStudentName = '';
  studentsInClass: any[] = [];
  loading = false;
  unlockedClass = '';

  // Example passcodes (replace with your real logic or fetch from DB)
  classPasscodes: any = {
    'JSS1': 'jss1pass',
    'JSS2': 'jss2pass',
    'JSS3': 'jss3pass',
    'SS1-Science': 'ss1scipass',
    'SS1-Arts': 'ss1artpass',
    'SS1-Commercial': 'ss1compass',
    'SS2-Science': 'ss2scipass',
    'SS2-Arts': 'ss2artpass',
    'SS2-Commercial': 'ss2compass',
  };

  onClassChange() {
    this.showDepartment = this.selectedClass.startsWith('SS');
    if (!this.showDepartment) this.selectedDepartment = '';
    this.accessGranted = false;
    this.unlockedClass = '';
  }

  async onDepartmentChange() {
    if (this.unlockedClass === this.selectedClass) {
      this.accessGranted = true;
      this.accessError = '';
      await this.loadStudents();
    } else {
      this.accessGranted = false;
      this.accessError = '';
    }
  }

  async verifyClassAccess() {
    let key = this.selectedClass;
    if (this.showDepartment && this.selectedDepartment) {
      key += '-' + this.selectedDepartment;
    }
    if (this.classPasscode === this.classPasscodes[key]) {
      this.accessGranted = true;
      this.accessError = '';
      this.unlockedClass = this.selectedClass; // Track unlocked class
      await this.loadStudents();
    } else {
      this.accessError = 'Incorrect passcode!';
      this.accessGranted = false;
    }
  }

  async loadStudents() {
    this.loading = true;
    const studentsRef = collection(this.firestore, 'students');
    let q;
    if (this.showDepartment && this.selectedDepartment) {
      // Query by class and department separately
      q = query(
        studentsRef,
        where('class', '==', this.selectedClass),
        where('department', '==', this.selectedDepartment)
      );
    } else {
      // Query by class only
      q = query(
        studentsRef,
        where('class', '==', this.selectedClass)
      );
    }
    const snapshot = await getDocs(q);
    this.studentsInClass = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    this.loading = false;
  }

  async addStudent() {
    if (!this.newStudentName) return;
    if (this.showDepartment && !this.selectedDepartment) {
      alert('Please select a department.');
      return;
    }
    let student: any = {
      fullName: this.newStudentName,
      class: this.selectedClass // "SS2"
    };
    if (this.showDepartment && this.selectedDepartment) {
      student.department = this.selectedDepartment; // "Science"
    }
    await addDoc(collection(this.firestore, 'students'), student);
    this.newStudentName = '';
    await this.loadStudents();
  }

  async deleteStudent(student: any) {
    if (confirm(`Delete ${student.fullName}?`)) {
      this.loading = true;
      const { doc, deleteDoc } = await import('@angular/fire/firestore');
      const studentDocRef = doc(this.firestore, 'students', student.id);
      await deleteDoc(studentDocRef);
      await this.loadStudents();
      this.loading = false;
    }
  }

}
