import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css'],
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, HttpClientModule, RouterModule],
})
export class EmployeeCreateComponent implements OnInit {
  createForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.createForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      salary: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.createForm.valid) {
      const formValues = this.createForm.value;
      this.http
        .post('https://101391157-comp3133-assig2-backend.vercel.app/graphql', {
          query: `
          mutation AddNewEmployee($firstName: String!, $lastName: String!, $email: String!, $gender: String!, $salary: Float!) {
            addNewEmployee(first_name: $firstName, last_name: $lastName, email: $email, gender: $gender, salary: $salary) {
              id
              first_name
              last_name
              email
              gender
              salary
            }
          }
        `,
          variables: {
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            email: formValues.email,
            gender: formValues.gender,
            salary: parseFloat(formValues.salary),
          },
        })
        .subscribe({
          next: (response) => {
            alert('Employee saved successfully');
            this.createForm.reset(); // Reset the form fields
            // Optionally navigate to another route after successful submission
            // this.router.navigate(['/employee-list']);
          },
          error: (error) => {
            console.error('Error creating employee:', error);
          },
        });
    }
  }
}
