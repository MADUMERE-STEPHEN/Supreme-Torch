import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassTeacherComponent } from './class-teacher.component';

describe('ClassTeacherComponent', () => {
  let component: ClassTeacherComponent;
  let fixture: ComponentFixture<ClassTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassTeacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
