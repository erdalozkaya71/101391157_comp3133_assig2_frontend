import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [NgFor, RouterModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  empdata: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    axios
      .post('https://101391157-comp3133-assig2-backend.vercel.app/', {
        query: `
        {
          getAllEmployees {
            id
            first_name
            last_name
            email
          }
        }
      `,
      })
      .then((response) => {
        this.empdata = response.data.data.getAllEmployees;
      })
      .catch((error) => console.error('Error fetching data:', error));
  }

  navigateToCreate() {
    this.router.navigate(['/employee-create']);
  }

  loadDetail(id: string) {
    this.router.navigate([`/employee-details/${id}`]);
  }

  loadUpdate(id: string) {
    this.router.navigate([`/employee-update/${id}`]);
  }

  async removeEmployee(id: string) {
    console.log('Attempting to delete employee with ID:', id); // Log the ID to be deleted

    if (window.confirm('Do you want to delete?')) {
      try {
        const response = await axios.post(
          'https://101391157-comp3133-assig2-backend.vercel.app/',
          {
            query: `
            mutation DeleteEmployeeById($id: ID!) {
              deleteEmployeeById(id: $id) {
                id
              }
            }
          `,
            variables: { id },
          }
        );

        console.log('GraphQL response:', response.data); // Log the GraphQL response

        if (response.data.data.deleteEmployeeById) {
          this.empdata = this.empdata.filter((item) => item.id !== id);
          alert('Employee deleted successfully');
        } else if (response.data.errors) {
          console.error('Error deleting employee:', response.data.errors);
          alert('Error deleting employee. Please try again.');
        }
      } catch (error) {
        console.error('There was an error deleting the employee:', error);
        alert('Error deleting employee. Please try again.');
      }
    }
  }

  handleLogout() {
    this.router.navigate(['/']);
  }
}
