import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import axios from 'axios';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private router: Router) {}

  handleLogin(): void {
    const loginQuery = `
      query Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
          user {
            username
            email
          }
        }
      }
    `;

    axios
      .post('https://101391157-comp3133-assig2-backend.vercel.app/graphql', {
        query: loginQuery,
        variables: {
          username: this.username,
          password: this.password,
        },
      })
      .then((response) => {
        const loginData = response.data;

        if (loginData.errors) {
          console.error('GraphQL errors:', loginData.errors);
          this.error = 'Error logging in. Please try again.';
          return;
        }

        const authPayload = loginData.data.login;
        if (authPayload && authPayload.user) {
          this.router.navigate(['/employee-list']);
        } else {
          this.error = 'Invalid username or password';
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        this.error = 'An error occurred during login';
      });
  }
}
