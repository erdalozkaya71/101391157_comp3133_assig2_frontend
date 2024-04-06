import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, RouterModule, NgIf],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.signupForm.valid) {
      const { username, email, password, confirmPassword } =
        this.signupForm.value;

      if (password !== confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }

      this.error = '';

      const mutation = `
        mutation Signup($username: String!, $email: String!, $password: String!) {
          signup(username: $username, email: $email, password: $password) {
            user {
              id
              username
              email
            }
          }
        }
      `;

      this.http
        .post('https://101391157-comp3133-assig2-backend.vercel.app/graphql', {
          query: mutation,
          variables: { username, email, password },
        })
        .subscribe({
          next: (response: any) => {
            // Specify the type of the response object
            console.log('Signup response:', response);
            if (response.data.signup.user) {
              alert('Registered successfully.');
              this.router.navigate(['/employee-list']);
            } else {
              this.error = 'Registration failed';
            }
          },
          error: (err) => {
            this.error = 'Failed: ' + err.message;
          },
        });
    } else {
      this.error = 'Please fill in all fields';
    }
  }
}
